---
date: 2019-07-02
title: '记一次技术调研(二): GoMobile 在 iOS 上的应用'
template: post
published: false
thumbnail: '../thumbnails/appstore.png'
slug: go-mobile-research-02
author: JayL
categories:
  - go
  - ios
tags:
  - grpc
---
> **问题**
>
> 在手机应用的开发中，通常会将复杂的业务逻辑层实现放在服务端，客户端仅负责表现层。但是对于某些手机应用而言，业务逻辑的实现位于服务端反而是不安全的或是不合理的，而是需要将其逻辑直接在手机端实现。
>
> **调研目的**
>
> 面对不同系统的手机客户端，单独重复实现相同的业务逻辑，并非最佳实践。如何通过第三方语言 Go 语言将业务逻辑封装成库的形式，并以静态打包的方式提供给不同系统的手机客户端使用，是本次调研的目的。

具体调研内容包括:

- [x] [iOS 应用实现 gRPC 调用](/go-mobile-research-01/)
- [x] [GoMobile 在 iOS 上的应用](/go-mobile-research-02/)
- [ ] Android 应用实现 gRPC 调用
- [ ] GoMobile 在 Android 上的应用
- [ ] C/S 架构 or 静态库

其中关于 gRPC 在 iOS 与 Android 的实现，本身官方就已经提供了样例。本次调研会用到相关内容，所以将其作为调研的一部分记录下来，方便后来者阅读。调研中所有涉及的项目代码均存放于: [liujianping/grpc-apps](https://github.com/liujianping/grpc-apps) 仓库中， 需要的朋友可以直接下载测试。

## GoMobile 工具安装

首先保证开发环境处于"全球通"状态，保证顺利安装相关依赖包与工具。

> 注意： GoMobile 不支持最新的 Go Module 包依赖功能，所以建议在开始本教程之前, 执行 `export GO111MODULE=off` 关闭 Go Module 功能。

安装工具主要包括：

- Command Line Tools for XCode
  直接通过开发者账号在苹果[官网](https://developer.apple.com/download/more/)上下载.

- gomobile
  通过以下命令直接源码安装

````bash
$: go get golang.org/x/mobile/cmd/gomobile 
````

## GoMobile 的限制

在现有的框架下，Go Mobile 进支持以下类型的跨语言：

- 有符号的整形和浮点数
- 字符串和布尔值（字符串映射成String或NSString*）
- 字节切片（[]byte），字节切片穿越边界之后是允许修改其中内容的
- 函数：任何使用上述类型的函数，没有返回值或只有一个返回值，若有两个返回值时，第二个参数必须是内置的error类型
- 接口：任何包含了符合上述条件的函数的接口
- 结构体：任何包含符合上述条件类型的结构体都能穿越语言边界

## 超越类型

