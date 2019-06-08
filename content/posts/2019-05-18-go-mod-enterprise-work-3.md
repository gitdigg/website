---
date: 2019-05-18
title: 'Go Module 工程化实践（三）：工程实践篇'
template: post
thumbnail: '../thumbnails/go.png'
slug: go-mod-enterprise-work-3
author: JayL
categories:
  - go
  - devops
tags:
  - go module
---

# 3. 工程实践篇

> **如何实现企业内项目的`Go Module`工程化迁移?**

以本人以往所在公司的实际现状作为样例，说明具体的`Go Module`工程化迁移过程。

原有Go项目均采用单一`vendor`的模式进行依赖控制，即企业内所有Go项目的第三方依赖均引用该统一的`vendor`仓库，由专人专组独立维护。这样做的好处就是依赖包不会随实际开发者的版本变更而变更，企业内部维护一套相对稳定的版本，缺点就是缺少了依赖包的版本控制。

向`Go Module`工程化迁移的**目标**就是保持本地版本的稳定的同时兼顾版本控制功能。

## 3.1 `modules`仓库

在非`Go Module`项目中，所有项目的依赖包，使用了`vendor`仓库，在迁移到`Go Module`模式下，同样需要相应的`modules`仓库, 来保证本地开发包依赖版本的稳定。

该`modules`仓库的依赖包从何而来。不妨看看：

````bash

$: tree -L 1 $GOPATH/pkg/mod/cache/download
├── cloud.google.com
├── git.apache.org
├── git.yixindev.net
├── github.com
├── go.opencensus.io
├── go.uber.org
├── golang.org
├── gonum.org
├── google.golang.org
├── gopkg.in
├── gotest.tools
├── honnef.co
├── k8s.io
└── layeh.com
````

这就是我们要维护的`modules`仓库依赖包。在开发过程中，新的依赖包都会下载到这个路径。将新的依赖包版本复制到`modules`仓库相应的路径。就完成了`modules`仓库依赖包的版本维护。

需要注意的点是：

我们是从`$GOPATH/pkg/mod/cache/download`目录中复制新的依赖包到`modules`仓库中。但并不是所有的文件都需要进行维护，特别是本地下载过程中的一些临时文件。

````bash
$: tree -L 1 $GOPATH/pkg/mod/cache/download/github.com/x-mod/httpclient/@v/
├── list
├── list.lock
├── v0.1.2.info
├── v0.1.2.lock
├── v0.1.2.mod
├── v0.1.2.zip
├── v0.1.2.ziphash
├── v0.2.0.info
├── v0.2.0.lock
├── v0.2.0.mod
├── v0.2.0.zip
├── v0.2.0.ziphash
├── v0.2.1.info
├── v0.2.1.lock
├── v0.2.1.mod
├── v0.2.1.zip
└── v0.2.1.ziphash
````

在这个`github.com/x-mod/httpclient`依赖包中，我们仅仅需要具体版本的四个类型文件：

- info
- mod
- zip
- ziphash

其它类型的文件，是不需要进行`modules`仓库维护的。所以可以在`modules`仓库中通过`.gitignore`进行忽略。

## 3.2 `CI`过程更新

完成了`modules`仓库的维护后，我们就可以对原有项目的`CI`过程进行更新了。在`CI`编译机或者容器上

- git clone `modules` repo 到指定位置 `path/to/modules`
- 开启`GoModule`编译选项, 设置`export GO111MODULE=on`
- 设置`GoProxy`环境变量, 设置通过本地文件代理: `export GOPROXY=file:///path/to/modules`
   
现在所有GO项目就会开启`GoModule`选项同时，可以完成依赖包的版本控制。如何缺少依赖包，只需要从本地将新增依赖包的版本添加到`modules`仓库即可。

## 3.3 企业仓库`GoGet`代理优化

如果阅读了`Go Get`原理之后，针对企业依赖包的`GoGet`，我们可以写一个简单的`http`代理程序, 这样就设定自己的：

````go

// Example
// code server http://aaa.com:888/user/repo.git
// code import path: bbb.com/user/repo
// 
// host => aaa.com:888
// vcs  => git
// root => bbb.com

type Getter struct {
	host    string //gitlab address
	vcs     string //git
	root    string //git
}

func NewGetter(host string, vcs string, root string) *Getter {
	return &Getter{
		host: host,
		vcs:  vcs,
		root: root,
	}
}

func (x *Getter) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.URL.Query().Get("go-get") == "1" {
		sp := strings.Split(r.URL.Path[1:], "/")
		if len(sp) < 2 {
			http.Error(w, fmt.Errorf("unsupport path: %s", r.URL.Path).Error(), http.StatusBadRequest)
			return
		}
		prefix := fmt.Sprintf("%s/%s/%s", x.host, sp[0], sp[1])
		repository := fmt.Sprintf("%s/%s/%s.%s", x.root, sp[0], sp[1], x.vcs)
		fmt.Fprintf(w, `<html><head><meta name="go-import" content="%s %s %s" /></head></html>`, prefix, x.vcs, repository)
		log.Println("go get [", prefix, "] from repository [", repository, "].")
		return
	}
	http.Error(w, fmt.Errorf("unsupport request: %s", r.URL.Path).Error(), http.StatusBadRequest)
}
````  
通过这个简单的代理，你就可以实现：

> code server http://aaa.com:888/user/repo.git
> code import path: bbb.com/user/repo
> 
> host => aaa.com:888
> vcs  => git
> root => bbb.com

这样的非标依赖包的拉取了。

这一篇拖了好久，花一个小时完结掉这个系列。

# 相关阅读：

- [Go Module 工程化实践（一）：基础概念篇](/go-mod-enterprise-work-1/)
- [Go Module 工程化实践（二）：取包原理篇](/go-mod-enterprise-work-2/)
- [Go Module 工程化实践（三）：工程实践篇](/go-mod-enterprise-work-3/)
