---
date: 2019-03-06
title: 'Go Module 工程化实践（一）：基础概念篇'
template: post
thumbnail: '../thumbnails/go.png'
slug: go-mod-enterprise-work-1
author: JayL
categories:
  - go
  - devops
  - Popular
tags:
  - go module
---

# 1. 基础概念篇

`Go Module`已经来了，默认`Go Module`模式将会在1.13版本发布。也就是说半年后，就会全面铺开。鉴于官方提供扫盲文档中的样例过于简单，提供一个更加贴近实际开发过程的例子也许是有必要的。

官方文档参考：[Go Module Wiki](https://github.com/golang/go/wiki/Modules#how-to-prepare-for-a-release)。

## 1.1 准备环境

按照官方的说明，`Go Module`是在 Go 的 `1.11`版本开始引入，但是默认该选项是关闭的，直到`1.13`版本将会默认开启。预计`1.13`将会在2019年8月份发布。所以在这之前，是必须手动开启`Go Module`支持。

必要条件：

- Go语言版本 >= 1.11
- 设置环境变量 `GO111MODULE=on`

在开启`Go Module`功能后，官方还提供了环境变量`GOPROXY`用于设置包镜像服务。此处暂不详细介绍了。

## 1.2 `Go Module`带来的改变

### 1.2.1 **`GOPATH`作用的改变**

引入`Go Module`后，环境变量`GOPATH`还是存在的。开启`Go Module`功能开关后，环境变量`GOPATH`的作用也发生了改变。

> When using modules, GOPATH is no longer used for resolving imports. However, it is still used to store downloaded source code (in GOPATH/pkg/mod) and compiled commands (in GOPATH/bin).

翻译出来就是：

- 环境变量`GOPATH`不再用于解析`imports`包路径，即原有的`GOPATH/src/`下的包，通过`import`是找不到了。
- `Go Module`功能开启后，下载的包将存放与`$GOPATH/pkg/mod`路径
- `$GOPATH/bin`路径的功能依旧保持。

### 1.2.2 **新增`go.mod`文件配置**

开始`Go Module`开发之前，首先是初始化一个正确的`Go Module`定义，即`go.mod`文件。
何为正确的`Go Module`定义。就是说`mod`包必须符合。

>**方法一**：
>- 在`$GOPATH/src`的目录下，创建合理的路径`github.com/liujianping/foo`路径。
>- 进入`$GOPATH/src/github.com/liujianping/foo`路径，执行`go mod init`即可。

或者
>**方法二**：
>
>- 创建foo路径，位置任意
>- 进入foo目录，执行`go mod init github.com/liujianping/foo`即可。

生成了`go.mod`文件后，就该文件的语法简单的学习一下。

- **module**
  to define the module path;
- **go** 
  to set the expected language version;
- **require**
  to require a particular module at a given version or later;
- **exclude**
  to exclude a particular module version from use; and
- **replace**
  to replace a module version with a different module version.

官方提供了一个简单全面的例子：
````
module my/thing
go 1.12
require other/thing v1.0.2
require new/thing/v2 v2.3.4
exclude old/thing v1.2.3
replace bad/thing v1.4.5 => good/thing v1.4.5
````
### 1.2.3 **`go get`流程改变**

引入`Go Module`之后，`go get`官方又重新实现了一套。具体实现代码可以参考：

- 不开启`Go Module`功能，`go get`代码实现

> $GOROOT/src/cmd/go/internal/get/get.go    

- 开启`Go Module`功能，`go get`代码实现

> $GOROOT/src/cmd/go/internal/modget/get.go  

简单说明一下主要区别，更详细的`go get`取包原理放到下篇讲解。最直接的区别是：

> - 老的`go get`取包过程类似：`git clone ` + `go install` , 开启`Go Module`功能后`go get`就只有 `git clone` 或者 `download`过程了。
> - 新老实现还有一个不同是，两者存包的位置不同。前者，存放在`$GOPATH/src`目录下；后者，存放在`$GOPATH/pkg/mod`目录下。
> - 老的`go get`取完主包后，会对其`repo`下的`submodule`进行循环拉取。新的`go get`不再支持`submodule`子模块拉取。


## 1.3 一个完整的例子

官方的版本由于过于简单，连一个基础的本地第三方包的引入都没有，仅仅通过引入一个公开的第三方开源包，缺少了常规本地开发说明。所以，笔者特意提供一个完整的例子，分别从：

- 本地仓库
- 远程仓库
- 私有仓库

三个维度阐释`Go Module`的在实际开发中的具体应用。

本例子的目录结构如下:

````
$GOPATH/src
├── github.com
    └── liujianping
        ├── demo
        │   └── go.mod
        └── foo
            └── go.mod
````

创建两个`mod`模块：`demo` 与 `foo`, 其中 `foo` 作为一个依赖包，提供简单的 `Greet` 函数供 `demo` 项目调用。

### 1.3.1 本地仓库

本地仓库的意思，就是例子中的两个包: `github.com/liujianping/demo` 与 `github.com/liujianping/foo` 暂时仅仅存在于本地。无法通过 `go get` 直接从`github.com` 上获取。

通过以下命令，简单的创建项目代码：

````
$: mkdir -p $GOPATH/src/github.com/liujianping/foo
$: cd $GOPATH/src/github.com/liujianping/foo
$: go mod init
$: cat <<EOF > foo.go
package foo

import "fmt"

func Greet(name string) string {
    return fmt.Sprintf("%s, 你好！", name)
}
EOF

$: mkdir -p $GOPATH/src/github.com/liujianping/demo
$: cd $GOPATH/src/github.com/liujianping/demo
$: go mod init
$: cat <<EOF > main.go
package  main

import ( 
    "fmt"
    "github.com/liujianping/foo"
)

func main(){
    fmt.Println(foo.Greet("GoModule"))    
}
EOF
````

执行完以上命令以后，mod `demo` 与 `foo` 的代码部分就完成了。现在来执行以下：

````
$: cd $GOPATH/src/github.com/liujianping/demo
$: go run main.go
build github.com/liujianping/demo: cannot find module for path github.com/liujianping/foo
````
从输出可以看出，在`demo` 中调用 `foo`的依赖包，在编译过程就失败了。`demo`无法找到
`github.com/liujianping/foo`。为什么这样？

按照传统的`$GOPATH`引入包原则，只要在`$GOPATH/src`存在相应路径的包，就可以完成编译了。**从现在的情形就可以解释`$GOPATH`在`Go Module`功能开启后，对原有引入包的规则发生的改变。**

既然，`$GOPATH/src`路径不再支持。那么如何解决这个无法找到包依赖的问题呢？方法有二：

- 本地路径
- 远程仓库

该小节提供`本地路径`方法。

````
$: cat $GOPATH/src/github.com/liujianping/demo/go.mod
module github.com/liujianping/demo
````
目前`demo`项目的`go.mod`仅仅一句话，因为无法找`github.com/liujianping/foo`,所以在`go build`过程中也不会修改`go.mod`，增加对包`github.com/liujianping/foo`的依赖关系。所以，只能是手动处理了。修改`go.mod`文件如下：

````
module github.com/liujianping/demo

require github.com/liujianping/foo v0.0.0
replace github.com/liujianping/foo => ../foo
````
再次执行demo程序：

````
$: go run main.go
go: finding github.com/liujianping/foo v0.0.0
GoModule, 你好！
````

对于项目中直接引用本地依赖包的官方文档中有段**注意事项**:

> Note: for direct dependencies, a require directive is needed even when doing a replace. For example, if foo is a direct dependency, you cannot do replace foo => ../foo without a corresponding require for foo. (If you are not sure what version to use in the require directive, you can often use v0.0.0 such as require foo v0.0.0; see #26241).

意思就是，即使是本地依赖包，明确的`require`仍然是需要的。至于版本号，其实只要符合[SemVer规范](https://semver.org/)就可以。可以是`v0.0.0`,也可以是`v0.1.2`

`Go Module`最主要是引入了依赖包的版本控制。所以，我们不妨就本地版本测试一下。

对本地版本`foo`进行相应的git本地版本控制，增加几个版本，代码中相应的增加版本信息。

````
package foo

import "fmt"

func Greet(name string) string {
    return fmt.Sprintf("%s, 你好！ Version 1.0.0", name)
}
````
增加了以下三个版本tag。

````
$: git tag
v0.1.0
v0.2.0
v1.0.0
````

在`demo`项目中，设置`foo`版本, `go.mod`修改如下：

````
module github.com/liujianping/demo

require github.com/liujianping/foo v0.1.0
replace github.com/liujianping/foo => ../foo
````

执行`demo`程序，输出如下：

````
go run main.go
go: finding github.com/liujianping/foo v0.1.0
GoModule, 你好！ Version 1.0.0
````

不难得出结论：**`go get`是不会从本地仓库获取版本信息的**，查看`go get`在module模式下工具链实现代码也可得出这个结论。

### 1.3.2 远程仓库

从上节可以大致了解`Go Module`的原理。现在我们将`foo`依赖包上传到`github.com`上，包括相应的版本tag。首先`github.com`创建相应的项目`foo`.再将本地仓库上传到远程仓库中。

````
$: git remote add origin git@github.com:liujianping/foo.git
$: git push -u origin master
````

上传版本tag信息：

````
$: git push origin --tags
````

现在完成了`github.com/liujianping/foo`依赖包的远程部署。看看具体实操`demo`项目，首先去掉本地的直接依赖。`demo`项目的`go.mod`如下

````
$: cat $GOPATH/src/github.com/liujianping/demo/go.mod
module github.com/liujianping/demo
````

重新执行`demo`项目

````
$: cd $GOPATH/src/github.com/liujianping/demo
$: go run main.go
go: finding github.com/liujianping/foo v1.0.0
go: downloading github.com/liujianping/foo v1.0.0
GoModule, 你好！ Version 1.0.0
````

查看变更后的`go.mod`,如下

````
$: cat go.mod
module github.com/liujianping/demo

require github.com/liujianping/foo v1.0.0 // indirect
````

同时`demo`根目录下，增加了`go.sum`文件。

````
cat go.sum
github.com/liujianping/foo v1.0.0 h1:yYoUzvOwC1g+4mXgSEloF187GmEpjKAHEmkApDwvOVQ=
github.com/liujianping/foo v1.0.0/go.mod h1:HKRu+NgbfULQV4mqZOnCXpF9IwlhOOIwmns7gpwjZic=
````


修改foo版本号到 v0.2.0

````
$: cat go.mod
module github.com/liujianping/demo

require github.com/liujianping/foo v0.2.0 // indirect
````

重新执行`demo`项目

````
$: cd $GOPATH/src/github.com/liujianping/demo
$: go run main.go
go: finding github.com/liujianping/foo v0.2.0
go: downloading github.com/liujianping/foo v0.2.0
GoModule, 你好！ Version 0.2.0
````

再看看`go.sum`文件发生的变化：

````
cat go.sum
github.com/liujianping/foo v0.2.0 h1:2JCV7mfUyneSksnWokX0kZoBbtWPoyL8s8iW80WHl/A=
github.com/liujianping/foo v0.2.0/go.mod h1:HKRu+NgbfULQV4mqZOnCXpF9IwlhOOIwmns7gpwjZic=
github.com/liujianping/foo v1.0.0 h1:yYoUzvOwC1g+4mXgSEloF187GmEpjKAHEmkApDwvOVQ=
github.com/liujianping/foo v1.0.0/go.mod h1:HKRu+NgbfULQV4mqZOnCXpF9IwlhOOIwmns7gpwjZic=
````

通过以上步骤，粗略可以了解针对`Go Module`对于远程仓库的版本选择。简单解释版本的选择过程下：

>- 检查远程仓库最新的tag版本，有就取得该版本
>- 远程仓库没有tag版本时，直接获取master分支的HEAD版本
>- 如果在`go.mod`文件中指定了具体版本，`go get`直接获取该指定版本
>- `go.mod`中除了可以指定具体版本号以外，还支持**分支名**


继续对远程版本`foo`增加新的版本`v1.0.1`。提交相应代码并推送版本标签`v1.0.1`到远端。并重新设置`demo`项目中的`go.mod`中的依赖版本为`v1.0.0`.如下：

````
$: cat go.mod
module github.com/liujianping/demo

require github.com/liujianping/foo v1.0.0 // indirect
````

重新执行`demo`项目

````
$: cd $GOPATH/src/github.com/liujianping/demo
$: go run main.go
GoModule, 你好！ Version 1.0.0
````
这次执行没有输出go本身的提示信息，而是直接输出了结果。因为`github.com/liujianping/foo v1.0.0`已经存在于本地的缓存中了，不妨查看一下。

````
$: ls $GOPATH/pkg/mod/github.com/liujianping/foo@v1.0.0
````

虽然就`demo`项目而言，依赖项目`foo`有两个`v1.0.0`与`v1.0.1`两个版本可用。按照`GoModule`版本选择最小版本的算法，`demo`项目依旧选择`v1.0.0`版本。

> **如何更新依赖包版本**

更新依赖包的版本，最简单的方式，直接手动编辑`go.mod`设置依赖包版本即可。

另外一种方式就是通过`go get -u`的方式进行自动更新。具体操作步骤如下：

**查看依赖包版本更新信息**

````
$: go list -u -m all
go: finding github.com/liujianping/foo v1.0.1
github.com/liujianping/demo
github.com/liujianping/foo v1.0.0 [v1.0.1]
````

**更新依赖包版本**

````
$: go get -u 
go: downloading github.com/liujianping/foo v1.0.1
````
或者，制定更新patch版本
````
$: go get -u=patch github.com/liujianping/foo 
go: downloading github.com/liujianping/foo v1.0.1
````

此时，`go.mod`文件即被更新

````
$: cat go.mod
module github.com/liujianping/demo

require github.com/liujianping/foo v1.0.1
````

重新执行程序

````
$: go run main.go
GoModule, 你好！ Version 1.0.1
````

**基于分支**

`GoModule`除了支持基于标签`tag`的版本控制，可以直接利用远程分支名称进行开发。

所以本节，笔者就模块`foo`创建一个新的远程分支`develop`.具体代码，请直接参考`github.com/liujianping/foo`项目。

修改`demo`项目的`go.mod`文件：

````
module github.com/liujianping/demo

require github.com/liujianping/foo develop
````

再次执行`demo`, 结果如下：

````
$: go run main.go
go: finding github.com/liujianping/foo develop
go: downloading github.com/liujianping/foo v1.0.2-0.20190214080857-9c0018d55446
GoModule, 你好！ Branch develop
````
查看，`go.mod`文件，发生如下变更：

````
$: cat go.mod
module github.com/liujianping/demo

require github.com/liujianping/foo v1.0.2-0.20190214080857-9c0018d55446
````

按官方文档的说明，使用分支名，可以直接拉取该分支的最后一次提交。从实验来看, `Go Module`一旦发生编译就会针对分支名的依赖进行版本号固定。

### 1.3.3 私有仓库

对于私有仓库而言，其原理与1.3.2中的远程仓库是类似的。唯一不同之处是，`go get`取包的过程可能存在种种障碍，导致无法通过`go get`取到私有仓库包。主要原因可能是：

- 权限问题
- 路径问题

导致按照正常的`go get`过程取包失败。如果了解了`go get`取包原理，以上问题也就迎刃而解了。

# 相关阅读：

- [Go Module 工程化实践（一）：基础概念篇](/go-mod-enterprise-work-1/)
- [Go Module 工程化实践（二）：取包原理篇](/go-mod-enterprise-work-2/)
- [Go Module 工程化实践（三）：工程实践篇](/go-mod-enterprise-work-3/)


