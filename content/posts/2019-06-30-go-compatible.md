---
date: 2019-06-30
title: 'Go 编程： 交叉编译 vs 条件编译'
template: post
published: false
thumbnail: '../thumbnails/go.png'
slug: go-compatible
author: JayL
categories:
  - go
tags:
  - compatible
---

说起**条件编译**，大部分开发人员都会联想到**交叉编译**。但是 **条件编译** 和 **交叉编译** 完全是两回事， 解决的问题也是不一样的。总结区分一下，就是：

- **交叉编译**，解决的是目标程序问题, 是**目的**。
- **条件编译**，解决的是代码适配问题, 是**过程**。

## 交叉编译

交叉编译解决目标程序问题,即在一台具体的系统环境下编译出不同系统或不同语言环境的目标程序。举个简单的例子，在一台任意操作系统的机器上，编译出不同系统的目标程序：

````bash
# 以平台 linux 作为目标编译平台
$: GOOS=linux go build 
# 以平台 darwin 作为目标编译平台
$: GOOS=darwin go build 
# 以平台 windows 作为目标编译平台
$: GOOS=windows go build 
````

当然交叉编译不仅仅是可以根据目的操作系统进行编译，还可以区分系统的CPU架构类型，以及不同的语言版本，甚至可以指定用户自定义的编译标签，按自定义的方式编译目标程序。

更复杂的交叉编译参数如下:

````bash
$: GOOS=${GOOS} GOARCH=${GOARCH} go build -tags ...
````

**交叉编译**程序是否是按照预期进行编译，可以通过`go list`命令进行验证。不防先熟悉以下该命令：

````bash
# linux 
$: GOOS=linux go list -f '{{.GoFiles}}' os/exec
[exec.go exec_unix.go lp_unix.go]

# darwin
$: GOOS=darwin go list -f '{{.GoFiles}}' os/exec
[exec.go exec_unix.go lp_unix.go]

# windows
$: GOOS=windows go list -f '{{.GoFiles}}' os/exec
[exec.go exec_windows.go lp_windows.go]
````

可以看出，这个命令能够快速回答我们按当前的目标平台编译时，编译所需要的代码文件。有了这个利器，就可以很方便的开始**条件编译**的话题了。

## 条件编译

条件编译解决的是一份代码在不同的编译平台以及不同的语言版本的兼容性问题，即一份代码处处都可以编译。Go 语言中的条件编译的方式，可直接官方提供的文档: [Build Constraints](https://golang.org/pkg/go/build/#hdr-Build_Constraints).

总结下来就是两种方式：

### 文件名后缀方式

`go build` 在不读取源文件的情况下可以通过文件名后缀以决定哪些文件参与编译，哪些不需要。文件名后缀的形式，主要有：

- _$GOOS.go
- _$GOARCH.go
- _$GOOS_$GOARCH.go 

最后一种组合后缀，顺序不能颠倒。

### 编译标签标注方式

更加灵活的条件编译方式，是通过在文件头增加**条件编译标签**。条件标签在使用上需要和常规注释进行区分。


## 现实问题

讲了这么多，到底还是要解决问题。先说说我遇到的问题。前些日子写了一个`http.Client`的扩展包[x-mod/httpclient](https://github.com/x-mod/httpclient)，至于为什么要写这么一个扩展包，以后有时间具体分析。先说一下写这扩展包遇到的问题：

> **问题**：我本地使用的是 Go 语言版本是 1.12 。但是在项目的 CI 过程中，设置的是 1.11 版本。所以在 CI 的过程，编译失败。具体原因则是， 官方在 1.12 版本提供系统 `http.Client` 提供了一个新的 `CloseIdleConnections` 函数接口。但是这个函数是新增的，在 1.11 的版本没有此函数接口。而偏偏我的扩展包用到了这个新的功能函数。

遇到这种问题，首先不论是什么解决方案，作为一个开源的扩展库而言，如果以前支持版本 1.11， 那么无论如何处理，这个大前提不能改变，即必须保持向下兼容。

解决办法也很简单:

- a) 不使用新函数，使用其它方式替代类似功能
- b) 继续使用新函数, 但必须保证向下兼容

当然，这里选择继续使用新函数并且保证代码向下兼容。先说一下解决思路：

> 

