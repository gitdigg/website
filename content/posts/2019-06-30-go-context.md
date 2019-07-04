---
date: 2019-06-30
title: 'Go 编程: Context 必须深入理解的系统库'
template: post
published: false
thumbnail: '../thumbnails/go.png'
slug: go-context
author: JayL
categories:
  - go
tags:
  - context
---

周末看到一篇名为 `Go Context` 优缺点的文章，硬着头皮看了几点作者所说的缺点，直接放弃。本着治病救人的目的，本篇仅仅为了给 `Go Context` 正名，告诉你一个真实的 `Go Context`。

## 上下文是什么

先不说技术，就说生活上的上下文。A、B两人正聊天，聊到中间，这时你跑进来。A说X怎么怎么样，你就不明白了。这种情况就叫不了解上下文。所以上下文指的是一种状态，它是

再到技术，技术上的上下文，一般都是在学习操作系统关于进程切换时讲到的。系统中有很多进程，但是计算资源有限，就必须进行进程切换，合理的分配资源。但是切换后的进程怎么重新切换回来呢？这个时候就必须要上下文了。

## Go Context 

至于 Go Context 其实只是上下文的一种语言级别的实现而已。通过提供一些简单而通用的接口，实现上下文所必须的功能。

## 