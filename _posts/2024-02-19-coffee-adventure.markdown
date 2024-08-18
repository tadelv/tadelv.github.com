---
layout: post
title: "From Instant Coffee to Espresso Engineering: My Caffeinated Journey"
date: 2024-08-18 00:00:00 +0100
categories: coffee
description: "How I went from instant coffee to flow profiled espresso and beyond in six months"
author: Vid Tadel
featured_image: coffee/from-bean-to-cup.jpeg
---

> Did you know that coffee has more flavor compounds than wine? That’s right—there are over 800 different compounds in coffee that contribute to its complex and delightful taste, making it a beverage with endless possibilities.

**Disclaimer:** This post is a bit of a long story. If you’re just here for the highlights, feel free to skip ahead to the interesting parts [1](#announcement), [2](#second_announcement), [3](#third_announcement).

***Featured image:** a latte from coffee I roasted myself*

---

For as long as I can remember, my family was all about coffee. But we weren’t the fancy, café-latte-sipping type—no, we were hardcore instant coffee drinkers. The kind that requires just a spoonful of granules, a dash of sugar, and a lake of milk. It was the only coffee I knew, and I loved it. The taste, the aroma, the ritual—it was all so familiar and comforting.

But then, something happened that would change my coffee journey forever. Toward the end of high school, during a visit to a friend’s house, I encountered an espresso machine for the first time. I was mesmerized. It was sleek, shiny, and mysterious, like something out of a sci-fi movie. I remember promising myself that one day, I’d have one of those machines. Little did I know, that moment was just the beginning of a wild ride into the world of coffee.

> **Quick Coffee Fact:** The word "espresso" comes from the Italian word for "expressed" or "pressed out," referring to the method of forcing hot water through finely-ground coffee.

Fast forward a few years—I found myself at a new job with a break room that housed a massive, industrial-grade espresso machine. This thing was a beast, equipped with a scale, a special grinder, and more coffee options than I knew existed. It was like meeting an old friend who had undergone a serious glow-up. And thus, my real coffee journey began.

---
<center>
    <img height=420 src="/assets/coffee/beginnings.jpeg" />
    <p/>
</center>


It started innocently enough—I got myself a filter coffee maker. Then came the AeroPress, a neat little gadget that turned my kitchen into a mini café. But what began as a hobby quickly spiraled into an obsession. I spent two months diving into the rabbit hole of coffee research. I pored over articles, watched countless YouTube videos, and haunted online forums, all in pursuit of the perfect cup.

<center>
    <img width="50%" src="/assets/coffee/ascaso.jpeg"/>
    <p/>
</center>
Eventually, I took the plunge and bought an espresso machine. I went way over budget, of course, but I figured it was worth it. My excitement was through the roof—until I realized that my low-cost grinder wasn’t quite cutting it. The coffee was good, but I knew it could be better.

So, I started tinkering. I watched more videos, experimented with different techniques, and eventually found myself staring at my machine, screwdriver in hand, ready to take it apart. Now, I had zero experience with electronics, but that didn’t stop me. I learned about AWG (American Wire Gauge), resistance, and coils. I even got shocked by 220V AC a few times—don’t worry, I’m fine. Mostly.

My curiosity led me to discover a whole community of coffee enthusiasts who modified their machines to extract every ounce of flavor possible. Inspired, I decided to mod my machine as well. But there was a catch—the modification was designed for a different model. Did I let that stop me? Of course not. I decided to fork the project and create my own modification to suit my machine.

<center>
    <img width="49%" src="/assets/coffee/steel-begin.jpeg"/>
    <img width="49%" src="/assets/coffee/steel-done.jpeg"/>
    <p/>
    <p>Starting with an LCD, ending with full control over Wifi</p>
</center>

Here we come to the first <a name="announcement">announcement</a> I have, the open source work on modifications to a coffee machine, to connect
it to wifi and add additional control parameters. You can find it on github under
[steelduino](https://github.com/tadelv/steelduino). 


Sleepless nights and many espressos later, I realized that this project was turning into a monster. Maybe it was better to buy a machine that did all this by itself.

> **Quick Coffee Fact:** The first espresso machine was patented in 1901 by Luigi Bezzera in Milan, Italy. His goal was to make coffee preparation faster, hence the name "espresso."

<center>
    <img width="50%" src="/assets/coffee/decent.jpeg"/>
    <p/>
</center>

With a new, state-of-the-art machine and a better grinder in hand, I thought I’d finally be content. And I was—for about a week. Then, my mind started racing with new ideas. I began sketching out plans for a Bluetooth scale to precisely measure coffee grounds. 
This is the <a name="second_announcement">second announcement</a>, a bluetooth enabled small form factor coffee scale, that you can build yourself. Find
it on [github](https://github.com/tadelv/almost-decent-scale) as well.

<center>
    <img width="50%" src="/assets/coffee/scale.jpeg"/>
    <p/>
</center>


Around the same time, I started visiting specialty coffee shops and discovered a whole new world beyond the dark Italian roast I was used to. Through a recommendation from a barista, I connected with a local roaster whose beans I still enjoy to this day.

But the most significant inspiration came when I visited his nano-roastery. Watching the roasting process up close, I felt a spark—could I roast my coffee at home? This led to another project: creating an Arduino-controlled coffee roaster, using popcorn poppers or other machines that lacked dedicated controls.

So of course, here is the <a name="third_announcement">third announcement</a>, an "Arudino-controlled" home coffee roaster, built from a
hot air pop corn popper. The code for the build can be found on [github](https://github.com/tadelv/yaeger).

<center>
    <img src="/assets/coffee/yaeger.jpeg"/>
<p/>
</center>

> **Quick Coffee Fact:** Coffee roasting is an art and a science. The process involves heating the beans to specific temperatures to bring out the desired flavors. Light roasts retain more of the bean’s original flavor, while dark roasts develop richer, smokier notes.

As I stand at this crossroads, with one foot in the world of tech and the other in the realm of artisanal coffee, I can’t help but reflect on how far I’ve come. Some might say I’m in the throes of a midlife crisis, but to me, coffee is the ultimate adventure. It’s a rabbit hole that goes deeper than I ever imagined. For some, coffee is just a morning ritual; for others, it’s a passion. And for lunatics like me, it’s an endless quest to tweak every possible parameter, log all the data, and discover new frontiers in the cup.

So, whether you’re a casual sipper or a fellow coffee scientist, I say this: enjoy your coffee, however you like it. Because at the end of the day, it’s all about the experience—and the next crazy idea just waiting to be brewed.
