---
date: 2019-06-19
title: '如何优化Docker Registry私有镜像服务'
template: post
thumbnail: '../thumbnails/docker.png'
slug: docker-registry-ops
author: JayL
categories:
  - devops
  - docker
tags:
  - image 
  - registry
---

容器化部署已经逐渐成为企业生产环境应用部署常态。搭建私有容器镜像服务也是大部分企业的必备选择。通常都会使用`Docker Registry`官方提供个镜像直接部署。

# 环境部署

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