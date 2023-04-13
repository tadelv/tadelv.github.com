---
layout: post
title:  "MapKit performance in SwiftUI"
date:   2023-04-13 00:00:00 +0100
categories: swiftui mapkit
---

> N.B.: Clustering in SwiftUI is only possible when using UIViewRepresentable, there is no native SwiftUI view to do it. [See here.](https://developer.apple.com/forums/thread/684811?answerId=681564022#681564022)

I was given an interesting challenge, to inspect performance on an app that uses MapKit, to display certain points of interest. What caught my eye, were UI freezes when zooming out of a particular region. The app displays a lot of annotations, about 7000, but various reports over the internet tell, that MapKit should be able to display them without a problem. So then, what could possibly be the issue? 

At first, I suspected database access being slow, but that wasn't the case. Even with all the annotations loaded in memory, map view would perform sluggishly. I tried various combinations of incantations, but to no avail. Desperate, I turned again to Apple's own [sample code on clustering](https://developer.apple.com/documentation/mapkit/mkannotationview/decluttering_a_map_with_mapkit_annotation_clustering). Curious, I thought. There is no sample code for clustering in SwiftUI, the sample app is written for UIKit, Apple's original framework for developing user interfaces for the iPhone. That made me think. I rearranged the application to show the map view embedded in a normal `UIViewController`. And I couldn't believe my eyes. Performance returned, buttery smooth animation when zooming out and clustering performing seamlessly, the way it was intended to. 

I fired up instruments to see where the catch was. Interestingly, the SwiftUI version made a bunch of calls to add subviews to what I assume is the map layer. The UIKit version did not have that. 

> I do not have any inside knowledge of how MapKit or SwiftUI work internally, but this is an interesting case of where it would be preferable to use UIKit over SwiftUI still. Perhaps only until the next WWDC, who knows.

As part of the investigation, I wrote a small app that uses both UIKit and SwiftUI to show a map view with 10k annotations. Not surprisingly, the performance was similar. I made a few more instruments runs to confirm.

<center>
<video width="320" height="480" controls="controls">
  <source src="/assets/mapkit-screen-recording.mov" type="video/mp4">
</video>
</center>

> MKMapView embedded in a SwiftUI view will clog the main thread.

Comparing both runs, there is an interesting thing to observe. 

![Instruments timeline for both UIKit and SwiftUI runs](/assets/mapkit-instruments1.png)
*Instruments Time Profiler run with highlighted UIKit and SwiftUI runs*

While SwiftUI code gets stuck adding annotation views, nothing of the sort is present in UIKit backed code. What might also be interesting is that SwiftUI stack trace shows signs of a gesture recognizer being used.

![SwiftUI stack trace when panning out](/assets/mapkit-instruments-swiftui-stack.png)
*SwiftUI Spending a lot of time adding annotation views*

![UIKit stack trace when panning out](/assets/mapkit-instruments-uikit-stack.png)
*UIKit happily chugging along rendering stuff with Metal*

The Takeaway: If you're planning on writing an app using MapKit, make sure to understand your requirements and act accordingly. Packing a lot of annotations into a SwiftUI embedded MapView can cause performance issues.