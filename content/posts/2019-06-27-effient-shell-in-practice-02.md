---
date: 2019-06-27
title: '高效SHELL环境 step by step（二）: 目录与文件'
template: post
thumbnail: '../thumbnails/bash.png'
slug: effient-shell-in-practice-02
author: JayL
categories:
  - bash
tags:
  - autojump
  - eva
  - fzf
  - bat
  - fd
  - fasd
  - rg
---

[高效SHELL环境 step by step（一）: 命令别名](/effient-shell-in-practice-01)中讲了通过命令提示、命令补全与命令别名的方式减少输入提示键盘输入的速度。本节主要关注：**目录与文件的快速定位**。通过快速定位文件与目录达到提升操作效率。

## 1 目录

### 1.1 目录定位

能够快速定位目录的脚本项目很多，比较热门的项目是:

- [autojump](https://github.com/wting/autojump) 
- [z](https://github.com/rupa/z)
- [goto](https://github.com/iridakos/goto)

这几个项目功能都非常类似。装一个就可以了。以`autojump`为例子。首先通过

````bash
$: brew install autojump
````

进行安装。完成安装后，在`oh-my-zsh`中开启相应的插件`autojump`。测试其常用操作：

- `j`  快速跳转到指定目录
- `jc` 快速跳转到指定子目录
- `jo` 快速通过图形界面打开目录

通过`j -s`查询缓存的检索目录优先级。

### 1.2 目录展示

常规进行目录展示的命令是`ls`，但其太过单薄，特别是对于嵌套较深子目录，要进行多次操作才能达到预期效果。这里介绍两个扩展命令:

- [tree](http://mama.indstate.edu/users/ice/tree/)
- [exa](https://the.exa.website/)

MacOS安装：

````bash
$: brew install tree
$: brew install exa
````

`tree`命令功能比较单一, `exa`除了支持`tree`命令的功能外，在色彩展示以及文件详情上展示的信息更加丰富。

![exa](../images/exa.png)

为了方便自己使用，按各人喜好定义别名。

## 2 文件

对于文件的定位以及操作，应该尽量的靠近文件的位置，减少比必要的检索范围。在SHELL环境中通常所谓查询都是进行正则匹配。所以熟悉正则表达式非常重要。收集的以下正则表达式的教程非常适合所有级别的读者：

- [Learn regex the easy way](https://github.com/ziishaned/learn-regex)

### 2.1 按名称检索

- [fd](https://github.com/sharkdp/fd)

  `fd`命令是对`find`命令的扩展。其在功能上与`find`命令类似，但操作接口更加友好。

### 2.2 按历史检索

- [fasd](https://github.com/clvv/fasd)

`fasd`是将`autojump`命令原理扩展到了文件上，当然它也支持目录。`autojump`提供了关键的跳转命令`j`; `fasd`则提供四个关键命令:

- `f` 文件快速检索
- `a` 文件 + 目录快速检索
- `s` 交互选择检索
- `d` 目录快速检索

### 2.3 按内容检索

按文件内容检索系统提供的命令`grep`太古老，不论是展示上还是操作接口上都不够友好。以下扩展命令明显更加易于使用, 而且会在查询文件时使用 `.gitignore` 中的规则.

- [ag](https://github.com/ggreer/the_silver_searcher)

- [rg](https://github.com/BurntSushi/ripgrep)

- [ack](https://beyondgrep.com/)

具体操作演示，可以通过 `tldr` 或 `man` 命令查询一下。

### 2.4 文件操作

文件操作按行为可划分为： 文件预览、文件编辑、文件删除。按此类型划分，分别列举几个扩展命令。

**文件预览**

- [bat](https://github.com/sharkdp/bat) 该命令提供更加友好的图形展示，结合文件内容语法进行高亮展示, 同时支持git变更对比。

**文件编辑**

文件编辑命令实在太多了，有人喜欢 IDE， 有人喜欢命令行。贴一篇文章，很多编辑工具都罗列了。

- [21 Best Open Source Text Editors (GUI + CLI) in 2019](https://www.tecmint.com/best-open-source-linux-text-editors/)

**删除文件**

其实文件删除命令，系统提供的 `rm` 命令就非常好用。但该命令风险很高，万一一个不小心删错了就没有回头路了。所以有人写了下面这个工具:

- [trash-cli](https://github.com/andreafrancia/trash-cli/)

提供的功能挺好的：

````bash
trash-put           trash files and directories.
trash-empty         empty the trashcan(s).
trash-list          list trashed files.
trash-restore       restore a trashed file.
trash-rm            remove individual files from the trashcan.
````

只是这个工具使用python写的安装过程有点费事，改天自己写一个纯SHELL版本。

### 2.5 从检索到操作

快速定位目录或者文件，再执行相应的操作，已经够快了。如果还想更快一点，推荐下面这个工具：

- [fzf](https://github.com/junegunn/fzf)

它可以将**检索**与**操作**两个过程直接关联起来。先看一张预览图：

![fzf](../images/fzf.png)

两个简单的使用例子：

````bash
# 预览
$: fzf --preview 'bat {}'

# 定位文件后，按F1开启编辑工具
$: fzf --bind 'f1:execute(vim {})'
````

## 3 小结

高效命令需要大量的实践练习，和对旧习惯的抛弃。