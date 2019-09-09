---
date: 2019-09-09
title: 'Go 1.13  私有代理服务的构建'
template: post
thumbnail: '../thumbnails/go.png'
slug: go-mod-enterprise-work-5
author: JayL
categories:
  - go
  - devops
tags:
  - go module
  - 工程化实践
---

在 Go 1.13 版本的发布前，设置 `GOPROXY` 只能指定一个代理服务地址。进入 Go 1.13 版本后，`GOPROXY` 支持多代理设置，通过`,`隔开即可。如下:

````bash
export GOPROXY=https://proxy.golang.org,direct
````

按官方文档的说明，当第一个`proxy`在处理`ge get`所发出的HTTP请求时，返回HTTP状态码为`404`或`410`时，就会查找下一个`proxy`。

这个提升确确实实是从`Go Module`功能开放以来最想要的补充。有了这个多代理`proxy`的设置, 就可以在日常构建企业级项目中，将私有包代理与共有包代理分开，这样就不再需要维护一个巨型的`Go Module`仓库，只需要要维护一个有限大小的私有包仓库即可。私有包仓库主要存放**企业内部包**，同时可加上**墙外的共用包**。

下面简单说明一下如何构建企业级私有代理服务。

## 私有包仓库

首先在企业`GitLab`上创建代码仓库项目：`private-modules`.

在开启`Go Module`功能之后，每次构建程序的过程中，Go 都会在`$GOPATH/pkg/mod/cache/download/`缓存所有下载到本地的`Go Module`包。

将**企业私有包**以及**墙外的共用包**，对应的目录提交到代码仓库项目：`private-modules`中即可。

````bash
$: tree -L 1 $GOPATH/pkg/mod/cache/download/
$GOPATH/pkg/mod/cache/download/
├── **cloud.google.com**  //墙外包
├── **your.company.com**  //私有包
├── git.apache.org
├── github.com
├── go.etcd.io
├── go.opencensus.io
├── go.uber.org
├── golang.org
├── gonum.org
├── google.golang.org
├── gopkg.in
├── gotest.tools
├── honnef.co
├── k8s.io
├── layeh.com
└── rsc.io
````

如图示中，就可以将墙外的包与企业内部包对应目录添加到`private-modules`项目中进行管理。

## 私有代理服务

编写私有代理服务程序。私有代理服务程序非常简单，就是一个简单的基于文件系统的HTTP服务即可，同时添加`User/Password`进行安全认证。更加安全的控制可以通过对非内网的IP进行限制访问。

代理服务器的实现非常简单，如下：

````go

func ProxyHandler(wr http.ResponseWriter, req *http.Request) {
    //认证
    user, password, ok := req.BasicAuth()
	if !ok {
        http.Error(wr, "basic auth required", http.StatusForbidden)
		return
    }
    
	if user != "[YOUR-USER]" || password != "[YOUR-PASSWORD]" {
		http.Error(wr, "basic auth failed", http.StatusForbidden)
		return
    }
    
    //墙外包
    if strings.HasPrefix(req.URL.RequestURI(), "cloud.google.com") {
        http.FileServer("[PrivateModulePath]").ServeHTTP(wr, req)
        return
    }
    
    //私有包
    if strings.HasPrefix(req.URL.RequestURI(), "your.company.com") {
        http.FileServer("[PrivateModulePath]").ServeHTTP(wr, req)
        return
    }
    
    //404
    http.NotFound(wr, req)
}
````

私有代理程序结合企业`CI`工具，保证`[PrivateModulePath]`目录下的包实时更新即可。

## 程序构建

构建好以上的企业私有代理服务之后，就可以在`CI`阶段进行多阶段构建 Go 程序了。简单展示一下样例`Dockerfile`，方便读者自行测试。

````
FROM golang:1.13-alpine3.10 AS builder
RUN  apk --update --no-cache add git mercurial subversion bzr ca-certificates 
ENV  GOPROXY=https://[YOUR-USER]:[YOUR-PASSWORD]@proxy.yourcompany.com,direct
WORKDIR /app
COPY . .
RUN go build -o main

FROM alpine:3.10
WORKDIR /app
COPY --from=builder /app/main /usr/local/bin
ENTRYPOINT [ "main" ] 
````

企业私有代理服务主要的使用场景是在企业内网中使用，对于需要在家办公的员工可以通过文件代理的方式进行构建。