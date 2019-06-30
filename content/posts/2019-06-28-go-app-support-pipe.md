---
date: 2019-06-28
title: 'Go 编程: 一分钟实现管道 pipe 功能'
template: post
thumbnail: '../thumbnails/go.png'
slug: go-app-support-pipe
author: JayL
categories:
  - go
tags:
  - pipeline
  - command-line
---

乘着打盹的时间看了一眼前两天写的日期转换的开源工具: [ts](https://github.com/liujianping/ts)。发现管道 `pipeline` 的功能点可以放大一下, 就此记录一下以备将来只需。

## 管道是什么

但凡在类 Unix 系统上敲过命令的人，大多使用过管道功能. 所谓管道，就是将A程序的标准输出作为B程序的标准输入。而在类 Unix 系统只需要使用 `|` 符号，连接 A 和 B 程序即可, 即 `A | B`。通过多次管道连接，就可以实现非常强大的功能。所以在类 Unix 系统上开发命令行程序有个著名的原则: `KISS`，即 Keep It Simple Stupid。

画了张简单的图：

![pipeline](../images/pipe.png)

## Go 程序

在 Go 程序中实现管道功能及其简单，直接上码：

````go
    //先取程序的标准输入属性信息
    info, err := os.Stdin.Stat()
    if err != nil {
        return errors.Annotate(err, "stdin stat failed")
    }

    // 判断标准输入设备属性 os.ModeCharDevice 是否设置
    // 同时判断是否有数据输入 
    if (info.Mode()&os.ModeCharDevice) == os.ModeCharDevice &&
        info.Size() > 0 {
        bytes, err := ioutil.ReadAll(os.Stdin)
        if err != nil {
            return errors.Annotate(err, "stdin read failed")
        }
        //TODO...
    }

````

属性 `os.ModeCharDevice` 的意思是标准输入的设备类型是Unix字节流设备(Unix character device)即终端(terminal)输入。该方式判断有一个注意点：

> 需要判断 `info.Size()`, 即标准输入是有数据输入的。如果终端没有输入的话，程序会在 `ioutil.ReadAll` 处阻塞。

所以使用这种方式需要了解不同条件设置的用途，请结合实际开发需求。除了这个方式以外，还有另外更加简单的实现方法：

````go
    // 直接判断 标准输入属性是否设置 os.ModeNamedPipe 即可
    if (info.Mode()&os.ModeNamedPipe) == os.ModeNamedPipe {
        //TODO...
    }
````

标准输入只有在存在输入的时候，才会设置`os.ModeNamedPipe`属性。相比较第一种方式，这种方式代码更加简单。只是命名管道（NamedPipe）又来了一个新概念，增加了理解的难度。引入一个 Linux 命令`mkfifo`,这个命令就是创建命名管道用的。至于为什么这里程序的`os.Stdin`属性会是`os.ModeNamedPipe`，我这先偷个懒了。



