---
date: 2019-07-01
title: '一分钟系列： Go 编程之用时定义'
template: post
thumbnail: '../thumbnails/go.png'
slug: go-return-define
author: JayL
categories:
  - go
tags:
  - return-define
---

研究 Go 大神的开源库，常常会有惊喜。以 Dave Cheney 的开源库[github.com/pkg/profile](https://github.com/pkg/profile) 为例，其中有一句辣眼睛的写法:

````go
// Start starts a new profiling session.
// The caller should call the Stop method on the value returned
// to cleanly stop profiling.
func Start(options ...func(*Profile)) interface {
	Stop()
} {
    //implemention codes
    ...
    return &prof 
}
````

咋一看，真是没看懂。再仔细一看，其实只是在函数的返回结果时定义了一个匿名接口。为方便记忆，不妨称之为**用时定义**， 即不是在返回前提前定义，而是在函数返回阶段定义匿名接口。

这么做也的确有炫技的嫌疑，不过就算大神炫技，咱跟着看看学点有意思的东西也不错。

````go
import "github.com/pkg/profile"

func main() {
    defer profile.Start().Stop()
    ...
}
````

再看看该库的使用指南，这种做法真的是优雅，通过一个匿名的接口定义限制并规范了对返回对象的使用。赶紧收藏！

贴一个彩蛋，昨天 Dave Cheney 的Twitter：

````go
package main

import (
    "fmt"
)

func main() {
   fmt.Println(0 > "0"[0])
}
````

答案有以下选择：

1. 0
2. true
3. false
4. 48

大家可以选择一下？答案过两天评论里給。
