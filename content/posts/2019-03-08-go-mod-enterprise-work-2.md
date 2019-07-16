---
date: 2019-03-08
title: 'Go Module 工程化实践（二）：取包原理篇'
template: post
thumbnail: '../thumbnails/go.png'
slug: go-mod-enterprise-work-2
author: JayL
categories:
  - go
  - devops
tags:
  - go module
  - 工程化实践
---

# 2. `go get` 取包原理篇

不论是否开启`Go Module`功能，`go get`从版本控制系统`VCS`中取包的基础过程是类似的，除了在新的实现中不再循环拉取`submodule`子模块以外。

## 2.1 `go get` 基础取包流程

假设依赖包`github.com/liujianping/foo`不在本地，需要通过`go get`获取。发起以下命令：

````
$: go get github.com/liujianping/foo
````

命令发出后：

### 2.1.1 第一步，正则匹配出依赖包的查询路径

   `go get`可以指定具体包的`import`路径或者通过其自行分析代码中的`import`得出需要获取包的路径。但是`import`路径，并不直接就是该包的查询路径。在`go get`的源码实现中，包的查询路径是通过一组正则匹配出来的。也就是说，`import`路径是必须匹配这组正则表达式的，如果不匹配的话，代码是肯定无法编译的。笔者就贴一下这组正则表达式中的github正则与私有仓库的正则：

````go    
    // Github
	{
		prefix: "github.com/",
		re:     `^(?P<root>github\.com/[A-Za-z0-9_.\-]+/[A-Za-z0-9_.\-]+)(/[\p{L}0-9_.\-]+)*$`,
		vcs:    "git",
		repo:   "https://{root}",
		check:  noVCSSuffix,
	},
    
    //省略其它VCS...
    
    // General syntax for any server. 
	// Must be last.私有仓库将会使用该正则
	{
		re:   `^(?P<root>(?P<repo>([a-z0-9.\-]+\.)+[a-z0-9.\-]+(:[0-9]+)?(/~?[A-Za-z0-9_.\-]+)+?)\.(?P<vcs>bzr|fossil|git|hg|svn))(/~?[A-Za-z0-9_.\-]+)*$`,
		ping: true,
	},
````

以包路径`github.com/liujianping/foo`为例，正则匹配后，得出的查询路径就是：

`https://github.com/liujianping/foo`

再结合`go-get`参数，向远端VCS系统发起`https://github.com/liujianping/foo?go-get=1`请求。

### 2.1.2 第二步，查询得出包的远端仓库地址

包的远端仓库地址，可以通过`go get`请求的响应中的`go-import`的meta标签中的content中获取的。

````
$: curl https://github.com/liujianping/foo?go-get=1 | grep go-import
<meta name="go-import" content="github.com/liujianping/foo git https://github.com/liujianping/foo.git">
````
例子中的包对应的远端仓库地址就是：`https://github.com/liujianping/foo.git`.

### 2.1.3 第三步，根据仓库地址`clone`到本地

虽然版本控制系统`VCS`本身就存在各类区别，但是一些基础操作大多类似。在`go get`中具体`clone`的过程会根据具体的`VCS`采用对应的操作。


## 2.2 `go get` 代理取包流程

了解了`go get`取包的基础流程后，说说`Go Module`功能开启后的完整流程。

开启`Go Module`后，`go get`增加了一个新的环境变量`GOPROXY`。该环境变量一旦开启，`go get`就完全切换到新的取包流程，即**`GOPROXY`流程**，暂时就这么称呼吧。

在**`GOPROXY`流程**中，官方定义了一组代理接口, 请参考[官方接口定义](https://tip.golang.org/cmd/go/#hdr-Module_proxy_protocol)。

> GET $GOPROXY/<module>/@v/list returns a list of all known versions of the given module, one per line.

> GET $GOPROXY/<module>/@v/<version>.info returns JSON-formatted metadata about that version of the given module.

> GET $GOPROXY/<module>/@v/<version>.mod returns the go.mod file for that version of the given module.

> GET $GOPROXY/<module>/@v/<version>.zip returns the zip archive for that version of the given module.

其实这组接口的定义就是`$GOPATH/pkg/mod/cache/download`中的文件系统。就是说，我们可以直接将此目录下的文件系统作为代理使用，如下命令：`export GOPROXY=file:///$GOPATH/pkg/mod/cache/download/`

关于`GOPROXY`代理服务，网上有很多实现，官方也推荐了几个。各有各的问题，只能这样说。因为，对于一些定制话的需求，例如：

- 私有仓库的权限问题
- 个别库的镜像国内无法访问等 

尚无完美的解决方案。但是即使这样，我们还是可以根据具体的工程化需求构建企业内部的一套标准的`GO Module`流程来。具体方案，在下一篇**工程实践篇**中讲解。

## 2.3 私有仓库取包过程中的常见问题
 
私有仓库的取包过程中出现的问题大多集中在基础取包过程中。具体的异常又可能发生在2.1.1～2.1.3任一阶段。分别列举常见问题与解决思路。

### 2.3.1 私有仓库`clone`阶段的权限问题

通常情况下，私有仓库的访问是基于账号权限的。例如，`private.vcs.com/group/foo`的包路径，在`go get`过程中，会正则匹配出`https://private.vcs.com/group/foo.git`的仓库路径，假设VCS系统是gitlab搭建的。

那么在`git clone https://private.vcs.com/group/foo.git`的过程中，系统会提醒用户提供用户名与登录密码。每次输入就会很累赘。

**解决方案**有二：

- 方法一：

> 增加 `$HOME/.gitconfig` 配置:

> [url "ssh://git@github.com/MYORGANIZATION/"]
> insteadOf = https://github.com/MYORGANIZATION/

将原有的https访问方式替换成ssh方式。

- 方法二：

> 增加 `$HOME/.netrc`:

> machine github.com login YOU password APIKEY
> 将其中的 APIKEY 换成自己的登录KEY。

虽然采用的github为例，但适用于gitlab服务。其实，还有一种解决方案，该方案，还能解决2.3.2中的问题，故在下节中讲解。

### 2.3.2 私有VCS非标路径问题

由于历史原因，笔者公司的gitlab服务地址就是非标准的路径，标准路径应该是： `https://private.vcs.com`，而笔者公司的gitlab路径则是： `https://private.vcs.com:888`.

如果按`go get`流程，import包路径应该采用d:`private.vcs.com:888/group/foo`，就可以正确匹配出该仓库的合理地址了。但是很不幸，在实际操作中，失败告终。具体原因读者可以自行测试一下。

此时唯一的办法，就是搭建一个中间服务：`https://private.vcs.com` 能够通过`go get`的包路径匹配查询正确的仓库地址。

# 相关阅读：

- [Go Module 工程化实践（一）：基础概念篇](/go-mod-enterprise-work-1/)
- [Go Module 工程化实践（二）：取包原理篇](/go-mod-enterprise-work-2/)
- [Go Module 工程化实践（三）：工程实践篇](/go-mod-enterprise-work-3/)
