---
date: 2019-07-08
title: 'Go 编程： 如何扩展 http.Client'
template: post
published: false
thumbnail: '../thumbnails/go.png'
slug: go-extend-http-client
author: JayL
categories:
  - go
tags:
  - comment
---

## 1. 为什么需要扩展 http.Client

默认的 http.Client 直接在生产环境下使用，会出现各种奇怪的问题， 如：

- 连接数过多，导致系统文件数资源耗尽
- 对方服务器长时间不响应时，作为客户端的我们也跟着卡死


## 2. 如何扩展

### 2.1 过程分析

一次常规的 http 请求过程可以划分为三个阶段：

- 构建请求
- 网络通信
- 处理响应

所有的应用这个过程是相同的。所以，如果要扩展 http.Client， 需要就此三个阶段进行高层次的抽象。为什么要抽象，不赘述了。

### 2.2 构建请求

### 2.3 处理响应

### 2.4 通信过程

## 3. 小结

