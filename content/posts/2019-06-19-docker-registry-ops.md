---
date: 2019-06-19
title: '企业级 Docker 镜像分发二三事'
template: post
published: false
thumbnail: '../thumbnails/docker.png'
slug: docker-registry-ops
author: JayL
categories:
  - devops
  - docker
tags:
  - image 
  - registry
  - distribution
---

在个人电脑上搭建 Docker 镜像分发服务是非常简单的一件事，简单的一个 Docker Pull 命令就能搞定。但是针对企业级的 Docker 镜像分发服务则不可这么随意，本文是作者本人就所在企业搭建 Docker 镜像分发服务的一些经验总结，方便更多中小企业技术人员参考。

## 第一件事：选择分发方式


## 第二件事：镜像分发安全


## 第三件事：镜像存储管理



`Docker Registry` 的部署非常简单。参考官方文档，无论是从安全、用户管理、前端代理都有非常清晰的操作指南。这里仅仅是简单的构建一个基础的`Registry`镜像服务用于本文的演示。

````bash
$: docker run xxx
````
增加一个简易的镜像。

````bash
````

# 管理镜像

`Docker Registry`不提供UI操作界面，仅仅提供了基于 HTTP 的 `api` 接口。

## 服务安全

## 用户权限

## 功能配置

# 日常操作

## 定期查询

## 