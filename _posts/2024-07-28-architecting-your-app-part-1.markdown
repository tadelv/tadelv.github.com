---
layout: post
title: "Architecting your applications, part 1"
date: 2025-07-28 00:00:00 +0100
categories: swift
description: "Collection of thoughts on how we build apps from the ground up"
author: Vid Tadel
---

Every app developer will someday find themselves making a choice about how they will build their app. As always, there is a multitude of possibilities and each can be tailored specifically to suit our needs and wishes. Many times, there is also no time to think this through and we just throw ourselves into coding, leaving the architecture decisions to our future selves.

And when we stop for a moment and think of it, we realize that the word architecture can mean many things. A few examples of the meaing of the word can be how we organize our files, how we orchestrate communication between our views, models and services or how we bridge distances between two unrelated screens that show the same piece of data.

Usually, it starts off simple. You know what you want to achieve, you have all the pieces in your mind, fitting together nicely. You tend to this little software garden with great attention, meticulously laboring to keep everything in check. But unevitably sometime down the line, someting can happen that starts disrupting this perfect piece of code. There are many words for this, I like to use the term "software decay". In my opinion it's a natural course of all things. Stuff gets built with great care, is maintained for some time and eventually crumbles to dust and ruins. Nothing new here. Still, there's no reason to despair, since we can rebuild anew and this is what gives us new excitement and joy. We are builders after all.

Pursuing this goal of building the perfect foundation for an app to stand on, there is no other option but to experiment, learn, read and practice. Practice makes perfect and if you have the drive in you, every next app you build will be an improvement over the previous one.

With this in mind, I'd like to share some advice about possible ways to _architect_ your next game-changing app.

dependency inversion
separation of concerns
tree based modularization
