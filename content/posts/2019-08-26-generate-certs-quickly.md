---
date: 2019-08-26
title: '快速生成自签名证书'
template: post
author: JayL
published: true
thumbnail: '../thumbnails/devops.png'
slug: generate-certs-quickly
categories:
  - devops
tags:
  - openssl
  - certstrap
  - certigo
---

生成自签名证书传统工具是`OpenSSL`。不过`OpenSSL`不论是其复杂的命令选项，还是更加复杂配置都会让人头皮发麻。这里介绍一个更简单的生成自签名证书的工具: `certstrap`， 项目地址:[square/certstrap](https://github.com/square/certstrap).具体安装请参考其文档。

## CA证书

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

## 服务端证书

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

## 客户端证书

企业内部集群，通常为了保证服务之间的安全行，对客户端请求需要进行双向验证。这个时候就需要客户端也提供证书。

客户端证书的生成过程同服务端类似，更简单一点，不需要提供证书的IP与域名信息。

````bash
$: certstrap request-cert -cn client
$: certstrap sign client --CA ca
````

## 查看证书

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

## PKCS 格式证书

生成PKCS格式的证书可以直接点击安装到系统证书簇中，方便一些应用（浏览器等）的使用。具体生成PKCS 格式证书，使用`OpenSSL`命令如下:

````bash
$: openssl pkcs12 -export -out client.p12 -inkey out/client.key -in out/client.crt -certfile out/ExampleCA.crt
````