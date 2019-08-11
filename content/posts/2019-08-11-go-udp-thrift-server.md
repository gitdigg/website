---
date: 2019-08-11
title: 'Go 编程：借一个 udpserver 用用'
template: post
author: JayL
published: true
thumbnail: '../thumbnails/go.png'
slug: go-udp-thrift-server
categories:
  - go
tags:
  - thrift
  - udpserver
  - go
  - golang
  - Go 编程
---

既然写了一个 `tcpserver`, 乘机把之前借用的一个 `udpserver` 整理一下。当然这个项目是借用的，常说**庸才模仿，天才抄袭**，这次就算抄袭吧（偷笑）。 

具体项目地址请参见: [github.com/x-mod/thriftudp](https://github.com/x-mod/thriftudp)。

`tcp`与`udp`的区别，此类面试题就不解释了。`udp`其协议本身特点决定了它非常适合如日志、监控等数据收集类场景，即在不影响程序性能的基础上提升程序的可监测性（Measurability）.

既然是借用的，不妨看看借用的项目: [Jaeger](https://github.com/jaegertracing/jaeger)， 以下是`Jaeger`实现架构图：

![](../images/jaeger-arch-v1.png)

从图中可以看出，`Jaeger`是使用`UDP`协议作为实现`jaeger-client`与`jaeger-agent`之间的基础通信协议。其它网路组件直接则通过`TCP`通信。无论是`UDP`还是`TCP`均不属于应用层协议，在应用层同样需要选择或设计相应的应用级协议格式。如今很少设计自定义的协议格式，通常会采用`ProtoBuffer`或`Thrift`等此类专门`IDL`，进行接口定义。深入研究[Jaeger](https://github.com/jaegertracing/jaeger)代码，就会发现，同一个项目中不但用了`ProtoBuffer`，同时也使用了`Thrift`，只是具体使用场景不同。

> **为什么`Thrift`更加适合在`UDP`协议上使用呢？**

`ProtoBuffer`与`Thrift`本质上并太大无差别，都是专门针对字节序列化与反序列化的定义与生成工具而已。但是`Thrift`有一个更加适合`UDP`通信的关键字，即`oneway`关键字，其意思就是不用等待响应返回。在`TCP`上通信，通常是需要等待请求返回的。而`UDP`不需要，发出去了是可以不管是否成功的。看起来非常的不合理，但是如果`UDP`只是在本机`HOST`的回环接口上进行数据交互，基本不会出现网络原因导致的数据包丢失问题。

想法很好，不幸的是，官方[apache/thrift](https://github.com/apache/thrift)在生成的框架代码以及样例中均不提供`UDP`实现。所以就照着[Jaeger](https://github.com/jaegertracing/jaeger)项目写了一个，方便以后使用。

主要针对[Jaeger](https://github.com/jaegertracing/jaeger)项目的变化是：

- 支持新的`thrift`版本
- 独立的`udpserver`框架

该项目的使用非常简单，步骤如下：

- 按照`thrift`语法进行接口定义
- 使用`thrift`生成框架代码
- 具体Client/Server端代码实现

更多细节可以参考项目的样例程序[thriftudp/example](https://github.com/x-mod/thriftudp/tree/master/example)。





