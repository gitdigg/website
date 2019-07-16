---
date: 2019-06-05
title: '如何迁移 Docker 的存储目录'
template: post
thumbnail: '../thumbnails/docker.png'
slug: docker-data-migrate
author: JayL
categories:
  - docker
tags:
  - docker
  - 存储迁移
---

一篇简易文章，简单记录一下 Docker 的存储目录迁移过程。

## 1. 问题

在云主机上安装 Docker 后，很多时候会不注意设置它的存储目录。导致随着时间的增长，导致云主机的系统磁盘空间被挤占殆尽。

避免这种错误最好的办法就是在安装阶段设置好其存储目录到外接磁盘。犯错没关系，只要能够正确的解决，并且确保在解决过程中不要引入其它的问题即可。

## 2. 步骤

按默认安装并启动 `docker` 服务后，其存储的默认路径是 `/var/lib/docker` . 该目录是可进行自定义设置:

````bash
$: dockerd -h | grep data-root
--data-root string        Root directory of persistent Docker state (default "/var/lib/docker")
````

即在开始启动 `docker` 服务时，设置好相应的 `--data-root` 参数即可。如果是开始安装就可以按以下步骤设置：

````bash
$: systemctl cat docker
# /usr/lib/systemd/system/docker.service
[Unit]
Description=Docker Application Container Engine
Documentation=https://docs.docker.com
BindsTo=containerd.service
After=network-online.target firewalld.service containerd.service
Wants=network-online.target
Requires=docker.socket

[Service]
Type=notify
# the default is not to use systemd for cgroups because the delegate issues still
# exists and systemd currently does not support the cgroup feature set required
# for containers run by docker
ExecStart=/usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
ExecReload=/bin/kill -s HUP $MAINPID
TimeoutSec=0
RestartSec=2
Restart=always

...
````

通过该命令找到 `docker.service` 所在位置：`/usr/lib/systemd/system/docker.service`。通过编辑  文件中的， `ExecStart` 启动参数，直接设置 `--data-root` 路径。

现在的问题是一开始 `docker` 服务没有设置存储路径，现在必须进行一次安全的存储迁移工作。具体步骤如下：

### 2.1 准备目录

````bash
$: mkdir /data/dockerd
$: chown root:root /data/dockerd 
$: chmod 701 /data/dockerd 
````

### 2.2 目录迁移

````bash
# 停服
$: systemctl stop docker

# 迁移目录
$: mv /var/lib/docker/* /data/dockerd/
$: rm /var/lib/docker
$: ln -s /data/dockerd /var/lib/docker
````

### 2.3 重启服务

````bash
# 启动服务
$: systemctl start docker
````

**总结**

通过**软连接**的方式迁移服务存储路径，可以减少对`systemd`服务启动的参数配置，且访问路径仍是`/var/lib/docker`, 减少可能的依赖路径导致的各类问题。