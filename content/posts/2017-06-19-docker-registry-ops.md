---
date: 2019-06-19
title: '企业镜像分发二三事'
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

容器化部署已经逐步成为企业生产环境应用部署常态方案, 针对企业容器镜像的发布有必要写篇文章记录一下其过程中的关键点。

## 分发方式

在镜像发布

## 镜像发布

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