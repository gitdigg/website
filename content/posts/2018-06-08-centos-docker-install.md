---
date: 2019-06-08
title: 'CentOS: Docker 快速安装与配置'
template: post
thumbnail: '../thumbnails/centos.png'
slug: centos-docker-installation
categories:
  - devops
tags:
  - installation
  - docker
  - docker-compose
  - systemctl
  - TODO
---

## 1 容器服务的安装

### 1.1 Docker 安装

安装`docker`最好的文档肯定上[官网指南](https://docs.docker.com/v17.12/install/linux/docker-ce/centos/#install-using-the-repository).本文快速记录以下具体在centos下的操作命令:

````bash
# remove old version
$: sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-selinux \
                  docker-engine-selinux \
                  docker-engine

# install utils
$: sudo yum install -y yum-utils \
  device-mapper-persistent-data \
  lvm2

# add yum repo
$: sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo

# install docker
$: sudo yum install -y docker-ce

# start dockerd
$: sudo systemctl start docker
````

### 1.2 Docker-Compose 安装

````bash

$: sudo curl -L "https://github.com/docker/compose/releases/download/1.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

$: sudo chmod +x /usr/local/bin/docker-compose

````

## 2 容器服务的配置

容器服务的配置主要关注点:

- 监听路径
- 存储路径

### 2.1 查看默认配置

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

# Note that StartLimit* options were moved from "Service" to "Unit" in systemd 229.
# Both the old, and new location are accepted by systemd 229 and up, so using the old location
# to make them work for either version of systemd.
StartLimitBurst=3

# Note that StartLimitInterval was renamed to StartLimitIntervalSec in systemd 230.
# Both the old, and new name are accepted by systemd 230 and up, so using the old name to make
# this option work for either version of systemd.
StartLimitInterval=60s

# Having non-zero Limit*s causes performance problems due to accounting overhead
# in the kernel. We recommend using cgroups to do container-local accounting.
LimitNOFILE=infinity
LimitNPROC=infinity
LimitCORE=infinity

# Comment TasksMax if your systemd version does not supports it.
# Only systemd 226 and above support this option.
TasksMax=infinity
````

输出的第一行注释`# /usr/lib/systemd/system/docker.service`给出了具体配置文件的路径。可以按需直接进行修改。


其中`docker`服务本身的参数配置在`ExecStart`条目。 为了方便修改配置，我们给`docker`增加相应的配置文件，通过环境变量的方式，传递给`systemd`服务。

关于 `systemctl` 管理 `systemd` 服务的操作，先打个`TODO`的标签了。