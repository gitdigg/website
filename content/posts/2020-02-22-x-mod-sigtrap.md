---
date: 2020-02-22
title: 'Go 编程: 封装一个简单信号辅助包'
template: post
thumbnail: '../thumbnails/go.png'
slug: x-mod-sigtrap
author: JayL
categories:
  - go
tags:
  - signal
  - go
  - golang
  - Go 编程
---

> 这是一个简单的应用级抽象案例。

在 Go 语言中管控进程信号，非常简单。只需要简单的 3 行代码即可完成管控：

````go
package main

import "os/signal"

func main() {
    //信号接收 channel
    sigCh := make(chan os.Signal, 1)
    
    //监听信号(所有信号)
    signal.Notify(sigCh)

    //信号触发
    sig := <-sigch
    //TODO
}
````

但在实际开发过程中，这些功能性的函数缺少了**应用级抽象**，想要像搭积木一样构建应用程序多少有些不便。所以，花了点时间做一下应用级别抽象，方便以后使用。

既然是应用级抽象，就从应用层面入手，首先给这块抽象的积木，按照功能命个名，就叫`Capture`好了。

````go
//信号捕获器
type Capture struct{
  //TODO
}
````

既然是信号捕获, 在创建`Capture`时需要定义具体信号的触发操作，将具体`<信号,触发函数>`,取个英文名`Trap`。那么，在创建`Capture`时，就可以做为参数传进去。同时，`Capture`必须处于服务状态，才可以监听并触发信号操作，所以需要提供一个`Capture.Serve`函数。最终希望的应用级接口就是这样：

````go
package main

import (
	"context"
	"log"
	"syscall"

	"github.com/x-mod/sigtrap"
)

func main() {
  ctx, cancel := context.WithCancel(context.Background())
  
	capture := sigtrap.New(
		sigtrap.Trap(syscall.SIGINT, sigtrap.Handler(cancel)),
		sigtrap.Trap(syscall.SIGTERM, sigtrap.Handler(cancel)),
	)
	defer capture.Close()
	log.Println("sigtrap: waiting ...")
	log.Println("sigtrap:", capture.Serve(ctx))
}
````

具体的`Capture`实现也非常的简单，可以直接参考项目源码: [github.com/x-mod/sigtrap](https://github.com/x-mod/sigtrap).

很多类似这样简单工具包均没有太多的技术难度，封装的原因在于，在开发过程中我们需要更加友好的**应用级抽象**而已。

以下是我个人开源的一些工具包，欢迎参考：[github.com/x-mod/index](https://github.com/x-mod/index).

## 基础库

- [x-mod/build](https://github.com/x-mod/build) - 项目版本信息控制包 - [Blog](https://www.gitdig.com/go-build-version/)
- [x-mod/cmd](https://github.com/x-mod/cmd) - 更快速的命令行辅助包 - [Blog](https://www.gitdig.com/go-command-line-lib/)
- [x-mod/errors](https://github.com/x-mod/errors) - 多功能错误辅助包 - [Blog](https://www.gitdig.com/x-mod-errors/)
- [x-mod/event](https://github.com/x-mod/event) - 事件触发辅助包
- [x-mod/sigtrap](https://github.com/x-mod/sigtrap) - 系统信号辅助包 - [Blog](https://www.gitdig.com/x-mod-sigtrap/)
- [x-mod/routine](https://github.com/x-mod/routine) - 协程控制、主函数辅助包
- [x-mod/tlsconfig](https://github.com/x-mod/tlsconfig) - 证书设置辅助包 - [Blog](https://www.gitdig.com/generate-certs-and-mTLS/)

## 网络库

- [x-mod/tcpserver](https://github.com/x-mod/tcpserver) - tcpserver 快速构建框架 - [Blog](https://www.gitdig.com/go-tcpserver-graceful-shutdown/)
- [x-mod/thriftudp](https://github.com/x-mod/thriftudp) - thriftudp 快速构建框架 - [Blog](https://www.gitdig.com/go-udp-thrift-server/)
- [x-mod/httpclient](https://github.com/x-mod/httpclient) - httpclient 请求、响应辅助包
- [x-mod/httpserver](https://github.com/x-mod/httpserver) - httpserver 程序友好构建包