---
date: 2019-08-27
title: 'Go 编程: 写一个通用的项目版本信息包'
template: post
author: JayL
published: true
thumbnail: '../thumbnails/go.png'
slug: go-build-version
categories:
  - go
tags:
  - build
  - version
  - go
  - Go 编程
---

在Go程序的编译期设置版本信息，操作非常简单。只需要设置相应的链接选项参数即可，如：

````go
package main

import "log"

var version = "unset"

func main(){
  log.Println("version: ", version)
}
````

编译期设置版本信息操作如下:

````bash
$: go run -ldflags '-X main.version=v1.0.0' main.go
version: v1.0.0
````

在企业项目中，版本信息常常会结合`git`版本信息，编译时间等相关信息。每个项目版本信息基本类似，所以有必要建立一个简单的`build`包，方便其它项目使用。项目地址:[x-mod/build](https://github.com/x-mod/build).

````go
package build

import "fmt"

var (
	version = "dev"
	commit  = "none"
	date    = "unknown"
)

//String version
func String() string {
	return fmt.Sprintf("%v, commit %v, built at %v", version, commit, date)
}

````

这样在实际项目中就可以直接引用，并在编译期设置相应的版本信息。以命令行项目为例：

````go
package main

import (
  "github.com/x-mod/build"
  "github.com/x-mod/cmd"
)

func main(){
  cmd.Version(build.String())
  cmd.Execute()
}
````

在编译期的编译指令如下：

````bash
$: go build -ldflags "-X github.com/x-mod/build.commit=$(git rev-parse HEAD) -X github.com/x-mod/build.date=$(date +%FT%T%z)"
````

有了通用包，以上代码就可以完成自动化生成，基本无需人工参与。