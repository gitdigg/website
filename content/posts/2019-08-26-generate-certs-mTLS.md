---
date: 2019-08-26
title: 'Go 编程: 快速生成自签名证书与双向认证(mTLS)'
template: post
author: JayL
published: true
thumbnail: '../thumbnails/go.png'
slug: generate-certs-and-mTLS
categories:
  - devops
  - go
tags:
  - openssl
  - certstrap
  - certigo
  - mTLS
  - go
  - Go 编程
---

自签名证书双向认证大量用于各类网络集群项目中，例如 `Kubernetes`. 要实现服务间的证书双向验证，当然前提是要了解证书双向验证原理。相关原理介绍的文章，网上很多这里就不详细说明了。简单贴张图，自行理解。

![](../images/mtls.png)

# 1. 快速生成自签名证书

生成自签名证书传统工具是`OpenSSL`。不过`OpenSSL`不论是其复杂的命令选项，还是更加复杂配置都会让人头皮发麻。这里介绍一个更简单的生成自签名证书的工具: `certstrap`， 项目地址:[square/certstrap](https://github.com/square/certstrap).具体安装请参考其文档。

## 1.1 CA证书

要进行证书自签名，首先是生成一个自信任的CA认证证书。

````bash
$: certstrap init --common-name "ExampleCA" --expires "20 years"
````
命令完成后，会在当前目录下创建一个新的`out`目录，生成的证书都在该目录下.

````bash
$: tree out
out
├── ExampleCA.crl
├── ExampleCA.crt
└── ExampleCA.key
````

## 1.2 服务端证书

首先创建CSR, 即证书签名请求。

````bash
$: certstrap request-cert -cn server -ip 127.0.0.1 -domain "*.example.com"
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Created out/server.key
Created out/server.csr
````

生成CSR之后，通过刚刚生成的CA证书进行签名.

````bash
$: certstrap sign server --CA ExampleCA
Enter passphrase for CA key (empty for no passphrase):
Created out/server.crt from out/server.csr signed by out/ExampleCA.key
````
这样就完成了服务端证书的签名，签名后的证书就是:`out/server.crt`.

## 1.3 客户端证书

企业内部集群，通常为了保证服务之间的安全行，对客户端请求需要进行双向验证。这个时候就需要客户端也提供证书。

客户端证书的生成过程同服务端类似，更简单一点，不需要提供证书的IP与域名信息。

````bash
$: certstrap request-cert -cn client
$: certstrap sign client --CA ca
````

## 1.4 查看证书

生成完的证书是否正确，可以通过`certigo`工具进行查询。项目地址: [square/certigo](https://github.com/square/certigo)。

安装完成后，通过以下命令查询证书的具体信息。

````bash
$: certigo dump out/server.crt
** CERTIFICATE 1 **
Valid: 2019-08-26 09:34 UTC to 2021-08-26 09:34 UTC
Subject:
	CN=server
Issuer:
	CN=ExampleCA
DNS Names:
	*.example.com
IP Addresses:
	127.0.0.1
````

## 1.5 PKCS 格式证书

生成PKCS格式的证书可以直接点击安装到系统证书簇中，方便一些应用（浏览器等）的使用。具体生成PKCS 格式证书，使用`OpenSSL`命令如下:

````bash
$: openssl pkcs12 -export -out client.p12 -inkey out/client.key -in out/client.crt -certfile out/ExampleCA.crt
````

# 2. 双向认证(Mutual TLS Authentication)

在Go语言编程过程中，经常会对C/S交互进行双向认证，以确保通信安全。在服务端程序与客户端程序部分需要进行相应的 `tls.Config` 网络传输层的设置。至于具体双向认证的原理，本文不再赘述。这里推荐我个人从很多项目中解耦出来的一个通用包，方便更加快速的实现C/S端的`tls.Config`生成。具体项目地址: [x-mod/tlsconfig](https://github.com/x-mod/tlsconfig)

## 2.1 mTLS 服务端设置

服务端开启TLS，同时开启客户端验证：

````go

import "github.com/x-mod/tlsconfig"

cf := tlsconfig.New(
    //服务端 TLS 证书
    tlsconfig.CertKeyPair("out/server.crt", "out/server.key"), 
    //客户端 TLS 证书签名 CA
    tlsconfig.ClientCA("out/exampleCA.crt"), 
    //验证客户端证书
    tlsconfig.ClientAuthVerified(),
)
````

## 2.2 mTLS 客户端设置

客户端 TLS 设置：

````go

import "github.com/x-mod/tlsconfig"

cf := tlsconfig.New(
    //服务端 TLS 证书签名 CA
    tlsconfig.CA("out/exampleCA.crt"), 
    //客户端证书 TLS 证书
    tlsconfig.CertKeyPair("out/client.crt", "out/client.key"), 
)
````

以上代码是简单的C/S各端的`tls.Config`对象的设置，C/S程序可以是`tcp`/`http`/`grpc`等各类实现，可自行代码验证。
