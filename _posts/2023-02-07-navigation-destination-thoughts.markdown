---
layout: post
title:  "Thoughts on NavigationDestination"
date:   2023-02-07 11:18:22 +0100
categories: swift swiftui
---

We were all excited when iOS 16 introduced `NavigationStack` and `NavigationDestination`. These (not so) new tools provide options for implementing data-driven navigation. We can use these new APIs to further drive the UI using our state, calling it state-driven.

I would like to focus on a specific part of `navigationDestination` and dive a bit into how we can extend it to simplify its use.

Let's assume we have a collection of items we want to display in a list and tapping on an element takes us to a detail presentation of that item.

We can solve this using navigationDestination in two ways, but one of them requires our data type to conform to `Hashable`. Let's go with the less constrictive option and use the `Bool` binding to show or hide our destination.

{% highlight swift %}
struct ListView: View {
  @State var showingDetail = false
  @State var detailIndex: Int = 0

  var body: some View {
    NavigationStack {
      List {
        ForEach(0..<10) { index in
          Button {
            self.detailIndex = index
            self.showingDetail = true
          } label: {
            Text("Row \(index + 1)")
          }
        }
      }
      .navigationTitle("Demo")
      .navigationDestination(isPresented: $showingDetail) {
	      Text("Detail for \(detailIndex + 1)")
      }
    }
  }
}
{% endhighlight %}

There are two interesting things that stand out. First, we need two variables for displaying the detail view - a `Bool` and the actual item. Additionally, the view inside the `navigationDestination` is constructed immediately when the parent body is evaluated, restricting us from initializing the content lazily.

### Can we change this in some way?

The eager evaluation is actually simple to solve. We just slap an if let statement in the closure and are done with it.

{% highlight swift %}
@State var detailIndex: Int?

List { 
  ...
}
.navigationDestination(isPresented: $showingDetail) {
  if let detailIndex {
    Text("Detail for \(detailIndex + 1)")
  }
}
{% endhighlight %}

In order to reduce the number of required variables, a simple way  would be to instantiate a binding directly in the ``.navigationDestination(isPresented: destination:)`` method. We simply fill out the missing logic and we're good to go. This compiles and works just fine.

{% highlight swift %}
List {
  ...
}
.navigationDestination(
isPresented: .init(get: {
  self.detailIndex != nil
}, set: { isPresented in
  if !isPresented {
    self.detailIndex = nil
  }
})) {
  if let detailIndex {
    Text("Detail for \(detailIndex + 1)")
  }
}
{% endhighlight %}


Now a question presents itself. Can this be done in a way that abstracts this binding creation away from the callsite. And there is a way - a ViewModifier.
We put the logic inside a new modifier and add an extension to View. And there we have it, a new call that evaluates a presence of value and passes it as an argument to the destination closure. 

{% highlight swift %}
struct BindingDestination<Value, Destination: View>: ViewModifier {
  @Binding var value: Value?
  let destination: (Value) -> Destination

  func body(content: Content) -> some View {
    content
      .navigationDestination(
        isPresented: .init(get: {
          value != nil
        }, set: { isPresented in
          if !isPresented {
            value = nil
          }
        })) {
          if let value {
            destination(value)
          }
        }
  }
}

extension View {
  func navigationDestination<Value, Destination: View>(
    evaluating binding: Binding<Value?>,
    @ViewBuilder destination: @escaping (Value) -> Destination
  ) -> some View {
    self
      .modifier(BindingDestination(value: binding,
        destination: destination))
      }
}
{% endhighlight %}

This is the end of this simple exploration of modern SwiftUI navigation. The example shows how you can easily modify your navigation destinations to act upon an optional value being present instead of using a dedicated Bool to control the display. Here is an example of how to use the end result of this excercise.

{% highlight swift %}
List {
  ...
}
.navigationDestination(evaluating: $detailIndex) { detailIndex in
  Text("Detail for \(detailIndex + 1)")
}
{% endhighlight %}

If you've come this far - this is not the end. It's just the first step into modern navigation. Imagine you could build your navigation tree with mutually exclusive destinations. Think of an enum for defining what the current navigation path is. This is explored and explained in detail with PointFree's [modern SwiftUI navigation](https://www.pointfree.co/collections/swiftui/modern-swiftui) series from which this exploration also got the inspiration. Check it out and enjoy the benefits of clearly defined navigation structure in your apps.