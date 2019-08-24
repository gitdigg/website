---
date: 2019-08-24
title: 'Go 编程：写一个程序友好的命令行工具包'
template: post
author: JayL
published: true
thumbnail: '../thumbnails/go.png'
slug: go-command-line-lib
categories:
  - go
tags:
  - command-line
  - go
  - golang
  - Go 编程
---

作为一名后端程序员，命令行程序太普遍了。如何开始一个类似的命令行程序的工具以及相关依赖包也非常多。个人最常使用的工具包是: [spf13/cobra](https://github.com/spf13/cobra)。 同时结合作者提供的[spf13/viper](https://github.com/spf13/viper)包，命令行程序需要的绝大部分功能作者都替你想到了，基本上是没有必要重写一个新轮子了。

然而，即便是功能再齐全的包在个人使用的习惯与便利上还是因人而异的。虽然，通过`cobra`提供的命令行工具可以快速的启动一个命令行项目的框架代码，但是在多级命令的组织上，还可以在简洁一点，特别是对于子命令的操作，添加一个子命令必须指定对应的父级命令，逻辑上正确，但是使用上是不便的。

````golang
rootCmd.AddCommand(subCmd)
...
subCmd.AddCommand(subSubCmd)
````

`cobra`生成的代码中，不难发现类似以上的代码。在多级命令的组织上是非常机械。因为是生成代码，不需要手动编辑代码，所以这种不便很难直接感受到。但它提供的`cobra`工具是**程序员友好**的。

但是对于企业级命令行项目而言，不可能通过人工的方式通过`cobra`工具手动生成相应的命令行框架代码。而是需要直接将命令行代码集成的项目框架中去，所以就命令行相关代码而言，我们需要更加**程序友好**的工具包。

一个理想的命令行工具包，我认为可以是这样的：

整个包仅提供一个增加子命令的接口：`Add`, 通过`option`的方式，对具体命令行进行配置即可。特别是对于多级命令的设置上，我希望可以通过类似文件系统的**目录结构**的形式来定义具体的子级命令。

````
/			根命令
/foo		一级命令
/foo/bar  	二级命令
...
````

在使用上，可以是这样：

**仅根命令行**：

````go
import (
	"fmt"

	"github.com/x-mod/cmd"
)

func main() {
	cmd.Add(
		cmd.Path("/"),
		cmd.Main(Main),
	)
	cmd.Execute()
}

func Main(c *cmd.Command, args []string) error {
	fmt.Println("my root command running ...")
	return nil
}
````

**多级命令行**:

````go
import (
	"fmt"

	"github.com/x-mod/cmd"
)

func main() {
	cmd.Add(
		cmd.Path("/foo/bar/v1"),
		cmd.Main(V1),
	).PersistentFlags().StringP("parameter", "p", "test", "flags usage")
	cmd.Version("version string")
	cmd.Execute()
}

func V1(c *cmd.Command, args []string) error {
	fmt.Println("V1 called")
	return nil
}
````

在Bash中，命令行操作如下:

````bash
$: go run main.go foo bar v1
V1 called
````

当然，现实中我也是这么做的。具体工具包的实现，请参考: [x-mod/cmd](https://github.com/x-mod/cmd)。有了这样一个**程序友好**的命令行工具包，下一步就是写一个**项目框架**的快速启动工具，将这个包用进去了。


