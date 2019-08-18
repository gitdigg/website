---
date: 2019-08-18
title: 'Go Module 工程化实践(四) : 改进篇'
template: post
thumbnail: '../thumbnails/go.png'
slug: go-mod-enterprise-work-4
author: JayL
categories:
  - go
  - devops
tags:
  - go module
  - 工程化实践
---

# 4. 改进篇

在生产环境中正式启用`Go Module`功能已经过去快半年了，这半年的使用过程中，陆续遇到些问题，不过都比较顺利的解决了。虽说是改进篇，主要还是记录一下这半年来遇到的一些问题吧。

## 4.1 二级包(单一仓库多模块)如何处理

`Go Module`本身功能带给原有开发库的管理冲击还是挺大的，特别是对于一些大型的基础包，包内又存在很多二级目录。类似这样的包必须进行二级包定义，否则单一主包管理，对于仅仅使用个别功能的项目而言，就会导致依赖冗余。

官方给出了具体的二级包(单一仓库多模块)操作说明;[multi-module-repositories](https://github.com/golang/go/wiki/Modules#faqs--multi-module-repositories).同时，官方也`WARNING`大家，单一仓库多模块属于不推荐用法。

想想`Go Module`才刚开始使用，也没必要在生产环境中冒这么大风险，挑战高难度。前期依赖冗余就冗余，我的办法就是一步步的对此类单一仓库多模块进行拆分处理。

以`base`库为例，仓库地址为：`your.gitlab.domain/groupname/base`.可以直接利用`GitLab`提供的`Group`功能，创建一个`base`组，再将二级目录独立建仓库管理。最终变成这样：

````bash
your.gitlab.domain/base/
                        |-- foo
                        |-- bar
````

这个过程可以是一个渐进过程，也可以一次性的解决。

## 4.2 为什么需要多阶段构建容器镜像

在实际开发发布过程中，经常会碰到容器执行失败，并报：`No such file or directory`此类错误。通常情况下，错误的原因都是由于容器程序与所运行的基础镜像之间的环境不同造成的。虽然在编译Go程序的时候可以选择交叉编译的方式指定目标编译平台，但是对于不能通过非静态编译（即依赖外部的静态库或者动态库）的程序，其外部依赖库本身依赖其编译系统时，Go提供的交叉编译就无能为力了。所以通过多阶段构建，将程序的编译与发布通过相同的底层镜像进行构建可以最大程度的规避此类错误。

### 一个简单的Go程序多阶段构建文件

````Dockerfile
FROM golang:1.12-alpine AS builder
# 设置Go编译参数
ARG LDFLAGS
ENV LDFLAGS ${LDFLAGS}
# 设置Go编译环境变量
ENV GO111MODULE=on
ENV GOPROXY=https://[Your.Proxy]
WORKDIR /app
COPY . .
RUN GOOS=linux go build -o main -ldflags "${LDFLAGS}"

FROM  alpine
# 安装必要的工具包
RUN  apk --update --no-cache add tzdata ca-certificates \
    && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
COPY --from=builder /app/main /usr/local/bin
ENTRYPOINT [ "main" ]
````

### 排查`No such file or directory`

虽然`No such file or directory`的报错即直白又明确，但是不同的程序导致的原因则是千差万别。这里简单说下如何排查这个问题，主要分两个步骤：**静态排查**和**动态排查**。

**静态镜像检查**

既然报文件或目录不存在，首先当然是检查是否真的文件或目录不存在。通过静态的方式，即容器不在运行态。静态检查就是通过检查镜像的方式，检查文件或目录是否存在。如何深入到容器镜像内部文件系统，可以通过手动的方式进行检查，也可以使用镜像工具检查。之前推荐一个开源项目[dive](https://github.com/wagoodman/dive)，通过一个简单的命令就够了。

````bash
$: dive [your.image]
````

这个工具非常有用，能够看出容器镜像每一层发生的变更，也就能够定位文件是否真的不存在。

**动态容器检查**

其实很多时候，静态检查都会发现文件是存在，之所以导致`No such file or directory`的错误，是因为执行程序依赖的外部库不存在导致的。既然是外部库不存在，则需要进入实际的容器进行检查。

通常在`Dockerfile`中构建容器时使用 `ENTRYPOINT` 关键字，设置容器的初始进程。如果想进入问题容器显然`ENTRYPOINT`设置成问题程序，就会导致无法通过`docker exec`进入该容器。所以需要重新构建容器镜像，就是不要设置基础镜像的`ENTRYPOINT`，而是将问题程序通过`CMD`进行设置。这样我们就可以通过`sh`进入容器。

进入容器后，检查问题程序的执行问题，只需要`ldd`命令即可，查询问题程序的外部依赖。常规情况下，到这里基本就会定位具体的问题所在了。

## 4.3 基础镜像需要安装哪些基础包

通常来说，我们都会使用`alpine`系统作为容器的基础镜像，因为其足够小，而且提供了包管理工具，方便安装必要的基础包。那么，在构建一个服务镜像时，基础镜像需要安装哪些基础包呢？

### 基础包必须设置正确的时区

````Dockerfile
FROM alpine
RUN  apk --update --no-cache add tzdata \
    && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
````

### 镜像访问外部HTTP服务时，需要安装认证证书

````Dockerfile
FROM alpine
RUN  apk --update --no-cache add ca-certificates
````

### 镜像调用外部静态库或动态库时，需要安装必要开发库

````Dockerfile
FROM alpine
RUN  apk --update --no-cache add libc6-compat libc-dev libstdc++ 
````
依赖包的安装还是需要依赖具体的外部库的实现。

## 4.4 如何迁移代码仓库到自定义域名

在Go语言中引入第三方依赖包是非常便捷的。但是如果完全安装标准的`import`路径与代码仓库的路径并非常常按照预期。所以需要对于一些并那么友好的代码仓库路径进行自定义域名处理。在实现上也很简单，增加一个简单的HTTP代理服务即可。

### go get 原理

在 Go 中通过`import`关键字引入第三方依赖包，其基础原理很简单。例如`import "github.com/x-mod/tcpserver"`,在编译过程中就会通过以下的方式找到真正的代码库所在位置并下载到本地。

````
$: curl http://github.com/x-mod/tcpserver?go-get=1 | grep go-import
....
<meta name="go-import" content="github.com/x-mod/tcpserver git https://github.com/x-mod/tcpserver.git">
...
````

具体实现上一篇中提过，这里不说了。



