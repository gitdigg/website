---
date: 2020-03-25
title: 'Go 编程: 证书自动化与几大邮件运营商的(接收/投递)安全漏洞'
template: post
thumbnail: '../thumbnails/go.png'
slug: autocert-msp-bugs
author: JayL
categories:
  - go
tags:
  - glog
  - go
  - golang
  - Go 编程
---

> 最近手撸了一个纯 Go 的邮件系统，在证书配置上使用了`autocert`包进行证书自动化。同时在与几大邮件运营上接收与投递测试的过程中发现了对方的一些安全漏洞。本文就证书自动化与邮件运营商这些安全漏洞进行阐述。

## 证书自动化

### 原理

实现证书自动化，首先当然得感谢 letsencrypt.org 签发的免费证书。

简单解释一下 letsencrypt.org 签发证书的原理。 letsencrypt.org 共提供了 4 种校验(challenge)方式, 分别是：

- **HTTP-01 challenge**
- **DNS-01 challenge**
- **TLS-SNI-01 challenge**
- **TLS-ALPN-01 challenge**

其中校验方式(TLS-SNI-01)由于安全原因已废弃，代替方案就是**TLS-ALPN-01**。虽然有多种校验(challenge)方式，但是其基本原理是相同的，即**验证所声明域名资源的可写权**。

**HTTP-01 challenge** 过程，首先 `acme` 客户端向 letsencrypt.org 服务请求一个验证令牌(token)， 再将该令牌写入`http://<YOUR_DOMAIN>/.well-known/acme-challenge/<TOKEN>`路径。这样 letsencrypt.org 服务通过访问该路径来确认 http 资源的可写权。

**DNS-01 challenge** 过程，首先 `acme` 客户端向 letsencrypt.org 服务请求一个验证具体的 DNS TXT 记录值， 并再将记录值添加到`_acme-challenge.<YOUR_DOMAIN>`解析记录中。这样 letsencrypt.org 服务通过请求`_acme-challenge.<YOUR_DOMAIN>`的 TXT 记录值来验证 DNS 资源的可写权。

**TLS-ALPN-01 challenge** 过程，ALPN (Application Layer Protocol Negotiation)是TLS的扩展，我也不熟不冒充专家，留给读者自己了。不过基础原理是相同的。

每种校验方式的优缺点，可以参考官方文档: [challenge-types](https://letsencrypt.org/docs/challenge-types/).

### 实现

对于开发人员而言，快速实现证书自动化，通常会选择 **HTTP-01 challenge** 方式。具体实现代码非常简单：

````go
package main

import (
    "log"
    "net/http"
    "github.com/x-mod/httpserver"
    "github.com/x-mod/routine"
    "github.com/x-mod/tlsconfig"
    "golang.org/x/crypto/acme/autocert"
)

func main(){
    certs := &autocert.Manager{
        Prompt:     autocert.AcceptTOS,
        HostPolicy: autocert.HostWhitelist("your-domain"),
        Cache:      autocert.DirCache("your-local-certs-cache-dir"),
        Email:      "your-email-address",
    }
    http := httpserver.New( 
        httpserver.Address(":80"),
        httpserver.HTTPHandler(certs.HTTPHandler(nil)),
    )
    https := httpserver.New(
        httpserver.Address(":443"),
        httpserver.TLSConfig(tlsconfig.New(
            tlsconfig.GetCertificate(certs.GetCertificate),
        )),
        httpserver.HTTPHandler(
            http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
                fmt.Fprintf(w, "hello autocert!")
            }),
        ),
    )
    if err := routine.Main(
        context.TODO(),
        routine.ExecutorFunc(https.Serve),
        routine.Go(routine.ExecutorFunc(http.Serve)),
        routine.Signal(syscall.SIGINT, routine.SigHandler(func() {
            http.Close()
            https.Close()
        }))); err != nil {
        log.Println(err)
    }
}
    
````

将以上代码相关配置参数更改为具体配置即可，当然服务运行的公网IP与域名指向必须首先配置好。

## 几大邮件运营商的安全漏洞

本次测试发现的问题，均与证书相关。这些问题深刻影响了其邮件接收与投递的安全性，希望本文能引起相关邮件运营商重视并解决其安全漏洞，给用户提供更加安全的邮箱服务。

### 原理

邮件接收与投递的协议是 SMTP 协议，也是不同邮件运营商之间交互的关键协议。通常 SMTP 协议均服务于 25 端口上， 由于最开始 SMTP 协议运行在明文上，所以为了加强 SMTP 协议的安全性，增加了一个`STARTTLS`命令。

命令`STARTTLS`主要做什么呢？ 

简单的说就是在一个已建立的 TCP 常规连接上，通过该命令的方式，进行C/S端的同步升级，升级为 TLS 连接。这个过程和常见的直接监听 TLS 不同，是发生在已建立的 TCP 连接上。

如何将 TCP 常规连接升级为 TLS 连接呢？

其实也很简单，不过需要 C/S 端均增加相应的 TLS 证书配置，并开启加密握手操作即可。写成代码如下：

**服务端**

````go
import "crypto/tls"

//tls.Server(conn net.Conn, config *tls.Config)
tlsConn := tls.Server(conn, config)
if err := tlsConn.Handshake(); err != nil {
    //TODO
}
//Upgrade OK
````

**客户端**

````go
import "crypto/tls"

//tls.Client(conn net.Conn, config *tls.Config)
tlsConn = tls.Client(conn, config)
````

TLS的过程都在 `Handshake` 里了。一旦证书配置错误，不论是服务端还是客户端，`tls.Config`一旦配置错误，都会导致握手失败。现在我们来看看几大邮件运营商握手失败的问题。

### 接收问题

先说邮件接收有问题的邮件运营商： 网易邮箱。国内最早开始邮箱服务的运营商，犯了一个非常低级的证书配置错误，导致所有外部邮件进入网易邮箱不能通过 TLS 安全链接进行投递，只能通过明文投递。

看一下，网易邮箱 `163.com` 在接收邮件时，报的问题日志：

`STARTTLS:  x509: certificate is valid for *.163.com, 163.com, not 163mx02.mxmail.netease.com`

问题很明显。

### 投递问题

再说腾讯邮箱，测试邮箱域名 `qq.com`. 通过个人 qq 邮箱，发送一封邮件到自己手撸的邮件服务器上, 以 `example.com` 为例。配置好 `example.com` 的 dns mx 记录到我的邮箱接收服务域名(`mx.example.com`)上. 出现问题日志：

`acme/autocert: missing server name`.

很明显，这个错误来自于 autocert 包，至于为什么会报这个错误，就是因为腾讯邮箱客户端投递时没有设置证书对应的服务域名。用代码表示就是:

````go
import "crypto/tls"

//tls.Client(conn net.Conn, config *tls.Config)
tlsConn = tls.Client(conn, &tls.Config{
    ServerName: "", //设置为服务域名
})
````

出现类似腾讯邮箱的投递问题的还有 `outlook.com` 邮箱。 

对比`gmail.com` 邮箱，`STARTTLS` 则握手成功。

**如何解决此类对方投递问题**

当然最好时投递方自己，修复该漏洞。当然也可以在服务的接收端，做一点修改，对与此类证书请求服务域名是空的，默认填上服务域名。

````go

func GetCertificate(defaultServerName string, fn func(hello *tls.ClientHelloInfo) (*tls.Certificate, error)) func(hello *tls.ClientHelloInfo) (*tls.Certificate, error) {
	return func(hello *tls.ClientHelloInfo) (*tls.Certificate, error) {
		glog.V(4).Infof("client server name: %s", hello.ServerName)
		if hello.ServerName == "" {
			hello.ServerName = defaultServerName
			glog.V(4).Infof("set default server name: %s", hello.ServerName)
		}
		return fn(hello)
	}
}
````

这样就可以在接收修复客户端不带服务端证书域名的问题。

测试了一下 腾讯邮箱发到 Gmail 邮箱， 收到的邮件是通过 TLS 投递，可见 Gmail 同样在接收端修复了这个问题，保证 `STARTTLS` 成功。 