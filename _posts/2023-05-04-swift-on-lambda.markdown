---
layout: post
title:  "Swift on AWS Lambda"
date:   2023-05-04 00:00:00 +0100
categories: swift
description: Swift can run on AWS Lambda too
image: /assets/swiftAndLambda.jpg
author: Vid Tadel
---

It's been a few months since I wrote about my journey with Swift on server. I was busy with other side projects and also prepared for my webinar about developing apps for iOS natively or using cross platform frameworks.

But in all this time, I had one more quest in mind. The Vapor based GraphQL sample app was basically complete, but I wanted more. 
You've probably heard of [AWS Lambda](https://aws.amazon.com/lambda/). It's a compute service that lets you run code without provisioning or managing servers.

I wanted to try Swift on Lambda. Having a place that runs your backend code on demand sounds great for a playground app such as Stars and Planets.

As usual, the sample code is available [here](https://github.com/tadelv/stars-and-planets/).

To get up and running with a sample app, I had to search for [guides](https://www.swift.org/server/guides/deploying/aws-sam-lambda.html) on swift.org and other places to figure out, how to make and deploy a lambda running Swift. 
Thankfully, most of the heavy lifting has been done by these [awesome folks](https://www.swift.org/sswg/). The runtime and events SDK are the essentials you need to start developing your Swift powered Lambda function.

{% highlight swift %}
dependencies: [
        .package(url: "https://github.com/swift-server/swift-aws-lambda-runtime.git", from: "1.0.0-alpha"),
        .package(url: "https://github.com/swift-server/swift-aws-lambda-events.git", branch: "main"),
        ...
    ]
{% endhighlight %}


The interesting part was to understand how to prepare and package everything to run on Lambda infrastructure. The high level overview of the tasks is as follows:

- create a Swift package with dependencies for Lambda runtime
- use Docker to build your Swift package using an Amazon Linux image
- zip the result
- upload that to Lambda storage (S3)

I got up and running using SAM at first, but I thought there must be another way to do it. After using serverless for another project at work, I felt like the SAM definition file was a little too verbose for me.
I got help from our resident AWS master, [Paul](https://github.com/maslick) and he had a [sample project](https://github.com/maslick/swift-lambda) using serverless up and running for me in no time.

{% highlight yaml %}
provider:
    name: aws
    runtime: provided.al2
    architecture: arm64

functions:
    query:
        handler: StarsAndPlanetsLambda.handler
        memorySize: 128
        events:
          - httpApi:
              path: /graphql
              method: post
{% endhighlight %}

The interesting part here was that by building the image for arm64 means you can run your lambda on AWS graviton processors. I stumbled on an interesting issue here before switching to arm64. The build step in Docker was failing intermittently for some reason and from what I understood by googling, it was due to a qemu issue. I was really glad arm64 is also supported.

{% highlight shell %}
executable="StarsAndPlanetsLambda"
# platflorm="linux/amd64"
platflorm="linux/arm64"


echo "preparing docker build image"
docker build --platform=$platflorm . -t builder
echo "done"

{% endhighlight %}

So, that all was great, but I wanted more than just a hello world Lambda. I thought it would be interesting to support GraphQL on Lambda as well, just as in the Vapor project.

To support GraphQL, I had to go one level below GraphQLKit and use [Graphiti](https://github.com/GraphQLSwift/Graphiti), its base. Same as with Vapor, I had to implement a schema and a resolver for requests. 

{% highlight swift %}
static func create() -> StarsAPI {
    StarsAPI(
      resolver: StarsResolver(),
      schema: try! Schema<StarsResolver, StarsAndPlanetsContext> {
        Type(Planet.self) {
          Field("id", at: \.id)
          Field("name", at: \.name)
          Field("starId", at: \.starId)
        }
        ...
        Query {
          Field("stars", at: StarsResolver.stars)
          Field("planets", at: StarsResolver.planets)
          Field("starsPlanets", at: StarsResolver.starsPlanets) {
            Argument("starID", at: \.starID)
          }
        }
        ...
      }
    )
}

struct StarsResolver {
  func stars(
    context: StarsAndPlanetsContext,
    arguments: NoArguments,
    group: EventLoopGroup
  ) throws -> EventLoopFuture<[Star]> {
    group.next().makeFutureWithTask {
      try await context.stars()
    }
  }
  ...
}
{% endhighlight %}

The other part of the puzzle was to deconstruct an incoming request into a query GraphQL would understand.

{% highlight swift %}
struct InputQuery: Codable {
  let operationName: String?
  let query: String
  let variables: [String: Map]?
}

@main
struct StarsAndPlanetsLambda: SimpleLambdaHandler {
  func handle(
    _ request: APIGatewayV2Request,
    context: LambdaContext
  ) async throws -> APIGatewayV2Response {
    ...
    guard let bodyData = body.data(using: .utf8) else {
        context.logger.error("failed to get data from body")
        return .init(statusCode: .badRequest)
    }

    let query: InputQuery
    do {
        query = try JSONDecoder().decode(InputQuery.self, from: bodyData)
    } catch {
        return .init(statusCode: .badRequest, body: "\(error)")
    }

    ...

    let result = try await api.asyncExecute(
        request: query.query,
        context: apiContext,
        on: context.eventLoop,
        variables: query.variables)
    ...
  }
{% endhighlight %}

In order for Stars and Planets to actually work, I had to persist data somehow. Among the plethora of possibilities, I opted to go with DynamoDB, Amazons no-sql database. 

This was another fun part of the experiment. In order to connect to DynamoDB, I used a new [SDK](https://github.com/awslabs/aws-sdk-swift) from Amazon, which is not yet encouraged to use in production. It can be used on all platforms, iOS, MacOS as well as Linux. 

{% highlight swift %}
import AWSDynamoDB

struct StarsAndPlanetsContext {
    let client: DynamoDBClient
    let starsTable: String
    let planetsTable: String
    init() async throws {
        client = try await DynamoDBClient(region: "eu-central-1")
        guard let starsTable = ProcessInfo.processInfo.environment["STARS_TABLE"] else {
            throw ContextError.starsTableNotFound
        }
        self.starsTable = starsTable
        ...
    }
    ...
    func planets() async throws -> [Planet] {
        let input = ScanInput(tableName: planetsTable)
        let queryResult = try await client.scan(input: input)
        guard let items = queryResult.items else {
            throw ContextError.planetsNotFound
        }
        return items.compactMap {
            guard case let .s(id) = $0["planetId"],
                    case let .s(name) = $0["name"],
                    case let .s(starId) = $0["starId"] else {
            return nil
        }

        return Planet(id: id, name: name, starId: starId)
        }
    }
}
{% endhighlight %}


I stumbled upon an interesting issue there, building AWS SDK on Linux using docker on a Mac can fail if your volume is not case-sensitive. The workaround was for me to create a new case sensitive volume and move my project over there for building.

And yes, once that was done, I was able to interact with my lambda using the client that is also part of the exploratory project. The only actual change I had to do in the client was to change the api endpoint url. And the data is persisted in the cloud, how amazing!