---
layout: post
title:  "From iOS to Server-side Swift"
date:   2023-02-22 00:00:00 +0100
categories: swift vapor
---

I've been working on various iOS apps for over a decade. In this time, I did also experiment with other projects, including an Objective-C based http server. After the advent of Swift, I've read glimpses of something called Vapor. I was curious what it was. 

And I finally got the time to look into it. Discussing it with my friend [Klemen](https://www.linkedin.com/in/kkogovsek), he pointed out I could also take a look at GraphQL while I'm at it.

I thereby set out on an adventure, use Vapor, GraphQL and Composable Architecture for the client, to build a complete project, displaying a simple list of stars and their planets.

## On the Server

For the sake of simplicity I decided to use an in memory sqlite database behind [Fluent](https://github.com/vapor/fluent). I like how Fluent abstracts away interfacing with the database, so in case I wanted to change my backing db, I wouldn't have to change anything in my source code.
In order to support GraphQL, I decided to adopt [GraphQLKit](https://github.com/alexsteinerde/graphql-kit) and [GraphiQLVapor](https://github.com/alexsteinerde/graphiql-vapor). This allowed me to get something working really quickly. 

The two main points for supporting GraphQL in your Vapor app for me are:

- Create your resolver
- Create the schema

Resolver is the object GraphQLVapor will ask to perform queries or mutations. I put all my database access code in there.

{% highlight swift %}
final class StarsController {
  func fetchStars(request: Request,
                  _: NoArguments,
                  group: EventLoopGroup) throws -> EventLoopFuture<[Star]> {
    group.next().makeFutureWithTask {
      return try await Star.query(on: request.db).with(\.$planets).all()
    }
  }
  ...
}
{% endhighlight %}

In the sample above, I wanted to use async/await from Fluent, but wasn't sure how to couple it with GraphQLKit's requests, which is why I have it wrapped up in an EventLoopGroups future.

<br/>

Schema is a description for GraphQL, of what entities are available and what queries or mutations can be performed.

{% highlight swift %}
let starsSchema = try! Schema<StarsController, Request> {
  Scalar(UUID.self)

  Type(Star.self) {
    Field("id", at: \.id)
    Field("name", at: \.name)
    Field("planets", with: \.$planets)
  }

  ...

  Query {
    Field("stars", at: StarsController.fetchStars)
    Field("planets", at: StarsController.fetchPlanets)
    Field("starsPlanets", at: StarsController.fetchStarsPlanets) {
      Argument("starID", at: \.starID)
    }
  }

  Mutation {
    Field("createStar", at: StarsController.createStar) {
      Argument("name", at: \.name)
    }
    ...
  }
}
{% endhighlight %}

Once this is done, tell the Vapor application to register the newly created schema.

{% highlight swift %}
app.register(graphQLSchema: starsSchema, withResolver: StarsController())
{% endhighlight %}

With the above code, we have a working GraphQL endpoint in our app. We can already make queries or perform mutations.

To enable browsing the GraphQL implementation directly on the server, I used GraphiQL-Vapor, just adding the following line after registering the GraphQL schema.

{% highlight swift %}
app.enableGraphiQL(on: "explore")
{% endhighlight %}

With this, I could browse my GraphQL implementation on `localhost:8080/explore`

## On the Client

Googling for an iOS GraphQL client lead me straight to [Apollo](https://github.com/apollographql/apollo-ios/). Once added as a dependency to the client project, I needed to tell Apollo where to get the schema and what operations can be performed. This is done in a `codegen-config.json` file.

{% highlight json %}
{
  "input" : {
    "operationSearchPaths" : [
      "**/*.graphql"
    ],
    "schemaSearchPaths" : [
      "**/*.graphqls"
    ]
  },
  "schemaDownloadConfiguration": {
      "downloadMethod": {
          "introspection": {
              "endpointURL": "http://localhost:8080/graphql",
              "httpMethod": {
                  "POST": {}
              },
              "includeDeprecatedInputValues": false,
              "outputFormat": "SDL"
          }
      },
      "downloadTimeout": 60,
      "headers": [],
      "outputPath": "./graphql/schema.graphqls"
  }
}
{% endhighlight %}

I had to specify the server location and operations that I want to do in order for Apollo to generate objects I could then use in my client app. 

{% highlight graphql %}
query Stars {
  stars {
    id
    name
    planets {
      id
      name
    }
  }
}

query PlanetsOfAStar($starID: UUID!) {
  starsPlanets(starID: $starID) {
    id
    name
  }
}

mutation NewStar($name: String!) {
  createStar(name: $name) {
    id
  }
}

mutation NewPlanet($name: String!, $starID: UUID!) {
  createPlanet(name: $name, starID: $starID) {
    id
  }
}
{% endhighlight %}

After that it was time to structure the application so it can display and create Stars and Planets.

I decided to introduce model objects separately in the Client domain. Even though this essentially duplicates models, it allows me to stay flexible in the future in case I would want to swap Apollo for a different GraphQL client implementation. It also frees me from coupling the business logic with the network layer.

## Conclusion

I am very excited about my first step into the world of server-side swift. There is certainly a lot more for me to explore here. Vapor is built on top of [SwiftNIO](https://github.com/apple/swift-nio) and there are other frameworks similar to Vapor worth exploring as well.

The main take-away for me here is the knowledge, that I can now provide backend services for any of my  projects, without leaving the world of Swift.

Feel free to take a look around the project on my [GitHub](https://github.com/tadelv/stars-and-planets)

### References:

[GraphQL Vapor Template](https://github.com/alexsteinerde/vapor-graphql-template) where I figured out how to set up the schema.

[Getting Started with Apollo](https://www.apollographql.com/docs/ios/get-started/) where I figured how to get Apollo client up and running.

[Fluent](https://docs.vapor.codes/fluent/overview/) where I learned how to interface with the database.