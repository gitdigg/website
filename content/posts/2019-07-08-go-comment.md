---
date: 2019-07-08
title: 'Go 编程： 那些奇怪的注释'
template: post
published: true
thumbnail: '../thumbnails/go.png'
slug: go-comment
author: JayL
categories:
  - go
tags:
  - comment
---

自从上篇总结了一下[Go 编程： 交叉编译 vs 条件编译](/go-compatible/)之后，觉得有必要对于类似**条件编译标签**此类的特殊注释做一次简单收集。

## 1. 常规注释

每种开发语言都有自己的注释语法和格式，也大多类似。 Go 语言和市面上其它多种高级语言的注释语法也类似，主要有以下两种语法格式:

- 注释行 以符合 `//` 开头 
- 注释块 以符号 `/* 注释内容 */` 包括

通常情况下， 对外公开的包、函数、常量、变量均需要进行注释。代码是否注释完全，可以通过`lint`工具进行审查。不了解的话，可以参考[像 Awesome-Go 一样提升企业 Go 项目代码质量](/golang-ci-code-review/)一文。

但是，以上也就仅仅是正常情况。在很多特殊情况下，一些看似符合以上注释语法的地方，却不是注释，也是本文整理的重点。

## 2. “奇怪”的注释

### 2.1 条件编译

在一些特殊的 Go 代码实现文件中，可以看到 `// +build` 开头的注释，而且此类 Go 代码实现中的函数常常还会在其它类似的文件中出现不同的实现。此类注释，称之为`条件编译标签`。它有明显的特征，即单独一行或多行，均以`// +build` 开头，同时和其它代码或者注释之间通过空行隔开。

例如：

````
// +build linux,386 darwin,!cgo
````
条件编译组合结果是： `(linux AND 386) OR (darwin AND (NOT cgo))`

````
// +build linux darwin
// +build 386
````
条件编译组合结果是：`(linux OR darwin) AND 386`

具体详细的条件编译的内容参考: [Go 编程： 交叉编译 vs 条件编译](/go-compatible/).

### 2.2 二进制包

同`条件编译标签`类似，同样需要与其它代码或者注释之间通过空行隔开。但是注释为固定內容： `//go:binary-only-package`时，代表代码中直接引用二进制包。二进制包的位于：`$GOPATH/pkg/`路徑下。

````go
//go:binary-only-package

package mypkg
````

代码中直接引用二进制包， 非常适用于一些敏感或者有一定壁垒的企业核心包的发布。

### 2.3 代码生成

在 Go 项目中，常常会看到很多符合这样的正则表达式的注释内容

`^// Code generated .* DO NOT EDIT\.$`

即表示该 Go 代码文件是通过工具自动化生成的，不可修改。实现 Go 代码文件的自动生成的方法很多，工具也有很多。常见工具有：`protoc` + `protoc-gen-go` 组合，以及 `stringer`工具等等。

熟悉 `go tool` 工具中的 `generate` 的话， 可以直接通过以下注释格式的方式，将生成代码的具体命令操作，写在 Go 代码文件中。例如：

````go
//go:generate command argument...
````

这样在执行 `go generate` 命令时，该命令会自动检索 Go 代码文件中的注释指令，并依次执行，如有多条指令的话。

### 2.4 Cgo代码块

如果在 Go 代码文件中，看到类似以下的注释：

````go
/*
#include <stdio.h>
#include <stdlib.h>

void myprint(char* s) {
	printf("%s\n", s);
}
*/
import "C"
````

即，一个注释块中的内容是 C 代码，同时，注释块结束后，马上是`import "C"`则代表该 Go 代码中引用 C 代码，其中注释块中的内容就是具体的 C 代码。 C 代码可以是简单头文件引用，也可以是具体的实现代码。 

其中，在 Cgo 的代码块中，与纯 C 代码稍微不同的是， Cgo 代码中还可以加入`#cgo`开头的注释：

````go
/*
#cgo CFLAGS: -I .
#cgo LDFLAGS: -L . -lclibrary

#include "clibrary.h"

int callOnMeGo_cgo(int in); // Forward declaration.
*/
import "C"
````

其中，`#cgo`开头的行作用是指定具体 C 代码的编译链接参数。

## 3. 小结

以上就是我想到的一些奇怪的注释，如有遗漏，欢迎补充。

## 参考资源：

- [Comments](https://github.com/golang/go/wiki/Comments)
- [Cgo](https://github.com/golang/go/wiki/cgo)