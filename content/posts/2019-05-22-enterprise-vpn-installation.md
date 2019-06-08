---
date: 2019-05-22
title: '基于容器技术快速搭建企业VPN服务'
template: post
thumbnail: '../thumbnails/openvpn.png'
slug: enterprise-vpn-installation
categories:
  - devops
  - docker  
tags:
  - openvpn
  - network
---

即使再小的公司，在家办公的需求总会时不时的冒出来。本文就是基于此需求，利用容器技术快速搭建一套企业内网的VPN服务，提供给需要在家办公的员工。该方案纯开源且免费。

## 1.硬件需求

硬件需求，主要是需要提供两台服务器。
- 一台部署在企业内网
- 一台可以是云主机，需要通过外网访问。
- 域名需求根据实际需要配备。

## 2 实施方案

### 2.1 网络拓补图

````bash
[云主机： 安装 frps 服务端] <----> [内网主机： 安装 frpc 客户端 & OpenVPN 服务端]
````

### 2.2 服务端配置生成

在代码托管服务`gitlab`上创建仓库项目`intranet-vpn`，存储相关配置信息。并提供必要的操作指南。

````bash
$: mkdir intranet-vpn
$: mkdir intranet-vpn/configs
$: cd intranet-vpn/configs
$: docker run --rm -v $PWD:/etc/openvpn kylemanna/openvpn ovpn_genconfig -u udp://[YOUR.PUBLIC.DOMAIN]:1194
$: docker run --rm -v $PWD:/etc/openvpn -it kylemanna/openvpn ovpn_initpki
````
在最后一步中，提供必要的CA认证密码以及服务端证书所属域名信息(可提供IP地址)。

生成好的证书是不需要再次编辑的。但是相关服务端配置需要根据实际网络情况进行设置。主要需要变更的配置是:

````ini
# OPENVPN服务端提供的虚拟网域地址，确认和企业内网不在相同网域名即可
server 192.168.255.0 255.255.255.0
# 按默认生成，无需修改
verb 3
key /etc/openvpn/pki/private/[YOUR.PUBLIC.DOMAIN].key
ca /etc/openvpn/pki/ca.crt
cert /etc/openvpn/pki/issued/[YOUR.PUBLIC.DOMAIN].crt
dh /etc/openvpn/pki/dh.pem
tls-auth /etc/openvpn/pki/ta.key
key-direction 0
keepalive 10 60
persist-key
persist-tun

# 以下部分仍无需修改，只作用于容器内。如果需要设置Host主机上的端口, 直接使用`Docker`的容器端口映射即可
# 服务端口
proto udp
# 服务端口
port 1194
dev tun0
status /tmp/openvpn-status.log


user nobody
group nogroup
comp-lzo no

# Route Configurations Below
route 192.168.254.0 255.255.255.0

# Push Configurations Below
push "block-outside-dns"
push "dhcp-option DNS 8.8.8.8"
push "dhcp-option DNS 8.8.4.4"
push "comp-lzo no"
````

OpenVPN的配置是非常复杂的，特别是对于第一次部署OpenVPN的人来说。各种选项配置， 可以直接通过命令的帮助获得：`openvpn help`。

````bash
$: docker run --rm kylemanna/openvpn openvpn --help
````

通过以上命令，基本可以获取所有OpenVPN的参数配置。所有参数配置都可以直接通过命令行参数进行设置，也可以通过配置文件设置。
不妨根据`help`命令查询理解默认生成的服务端配置参数。

针对具体网络环境，我们需要修改或新增的配置是:

````ini
# 新增配置项: 可以让vpn的client之间互相访问，直接通过openvpn程序转发. 按需。
client-to-client

# 新增配置项:允许多个客户端使用同一个证书连接服务端按需。
duplicate-cn

# 修改配置项: 该配置项是在服务端配置client端所在网络空间，通过配置Client端网络空间，其它非该网络空间的Client就可以通过服务端访问该内部网络空间
# Route Configurations Below
# route 192.168.254.0 255.255.255.0

````
到此，服务端的基础配置已经完成。

### 2.2 OpenVPN 内网服务部署

在外网服务器安装必要工具：

- `git`
- `docker`

启动服务端服务:

````bash

$: git clone [`intranet-vpn` repo]
$: cd `intranet-vpn`\configs
# 启动服务端
$: docker run -v $PWD:/etc/openvpn -d -p 1194:1194/udp --privileged --name=vpn-server kylemanna/openvpn
````

`OpenVPN`不仅仅提供虚拟网络服务，其本身还提供了管理服务。可以根据以下名称查询相关管理的配置。

### 2.3 客户端管理

#### 2.3.1 颁发客户端证书

在本地机器上，切换到`intranet-vpn`仓库路径。

````bash
$: cd /path/to/`intranet-vpn`/configs
$: docker run --rm -v $PWD:/etc/openvpn -it kylemanna/openvpn easyrsa build-client-full liujianping nopass
$: docker run --rm -v $PWD:/etc/openvpn kylemanna/openvpn ovpn_getclient liujianping > clients/liujianping.ovpn
````

输入CA密码以后就会生成`clients/liujianping.ovpn`证书。

````bash
$: tree /path/to/`intranet-vpn`/configs
├── ccd
├── clients
│   └── intranet.ovpn
├── openvpn.conf
├── ovpn_env.sh
└── pki
    ├── ca.crt
    ├── certs_by_serial
    │   ├── BF83EC945DE988835F0FAB3D60B2843A.pem
    │   └── D2B7038F99114CEE43727E97BC033E8F.pem
    ├── crl.pem
    ├── dh.pem
    ├── index.txt
    ├── index.txt.attr
    ├── index.txt.attr.old
    ├── index.txt.old
    ├── issued
    │   ├── liujianping.crt
    │   └── [YOUR.PUBLIC.DOMAIN].crt
    ├── private
    │   ├── ca.key
    │   ├── liujianping.key
    │   └── [YOUR.PUBLIC.DOMAIN].key
    ├── reqs
    │   ├── liujianping.req
    │   └── [YOUR.PUBLIC.DOMAIN].req
    ├── serial
    ├── serial.old
    └── ta.key
````

客户端证书依然需要进行修改。

````ini
#始终重新解析Server的IP地址，如果remote后面跟的是域名，保证Server IP地址是动#态的使用DDNS动态更新DNS后，Client在自动重新连接时重新解析Server的IP地址，这#样无需人为重新启动，即可重新接入VPN
resolv-retry infinite

#持久化
persist-key
persist-tun
````

#### 2.3.2 查看已颁发客户端证书

在本地机器上，切换到`intranet-vpn`仓库路径的`configs`路径。

````bash
$: cd /path/to/`intranet-vpn`/configs

# 查看已颁发的客户端证书
$: docker run --rm -it -v $PWD:/etc/openvpn kylemanna/openvpn ovpn_listclients
name,begin,end,status
liujianping,May 22 07:17:44 2019 GMT,May  6 07:17:44 2022 GMT,VALID

`````

#### 2.3.3 客户端安装

OpenVPN 本身程序就提供了多种运行模式，可以是`server`模式也可以是`client`模式，所以对于一台`linux`操作系统而言，安装好了 `OpenVPN`就可以直接作为客户端直接运行了。

````bash
# 直接daemon模式运行
$: openvpn --daemon --config configs/clients/intranet.ovpn --log-append /var/log/openvpn.log
````

除了程序本身，`OpenVPN` 还提供了图形版本的客户端。具体下载连接如下： 

- [Linux & Windows client](https://openvpn.net/community-downloads/)
- [MacOS client](https://openvpn.net/vpn-server-resources/connecting-to-access-server-with-macos/)

具体图形客户操作，略。

#### 2.3.4 撤销客户端证书

第一步，本地先撤销指定证书，提交变更

````bash
$: cd /path/to/`intranet-vpn`/configs
# 撤销证书
$: docker run --rm -it -v $PWD:/etc/openvpn kylemanna/openvpn ovpn_revokeclient liujianping
# or 撤销并删除相关证书
$: docker run --rm -it -v $PWD:/etc/openvpn kylemanna/openvpn ovpn_revokeclient liujianping remove
# 查看状态
$: docker run --rm -it -v $PWD:/etc/openvpn kylemanna/openvpn ovpn_listclients
name,begin,end,status
liujianping,May 22 07:17:44 2019 GMT,May  6 07:17:44 2022 GMT,INVALID #未添加 remove 选项时, 增加 remove 选项时 证书也从列表删除

# 提交变更
$: git add . 
$: git commit -m "revoke liujianping client cert"
$: git push origin master
````

第二步, 服务端更新证书与配置并重启服务

````bash
$: cd /path/to/`intranet-vpn`
# 更新配置
$: git pull origin master
# 重启服务
$: docker restart vpn-server
````

## 3 内网 OpenVPN 服务映射到公网

要实现员工在家办公，内网 VPN 服务必须在公网上暴露入口。 具体实现，就是选择一款合适的内网穿透工具，将内网VPN服务暴露在公网上。
常见的内网穿透工具有以下可供选择：

- frp	
- ngrok	
- easyProxy	
- natapp	
- nps

这里采用frp实现穿透功能。frp的实现原理请参考其项目说明[frp操作指南](https://github.com/fatedier/frp/blob/master/README_zh.md)。

具体配置如下:

### 3.1 服务端，公网服务器

启动`frps`服务，配置如下：

````ini
# [common] is integral section
[common]
# A literal address or host name for IPv6 must be enclosed
# in square brackets, as in "[::1]:80", "[ipv6-host]:http" or "[ipv6-host%zone]:80"
bind_addr = 0.0.0.0
bind_port = 7000

token= [YOURTOKEN]
````

启动服务:

````bash
$: frps -c /path/to/frps.ini
````

### 3.2 客户端，内网VPN服务器

启动`frpc`服务，配置如下：

````ini
[common]
# A literal address or host name for IPv6 must be enclosed
# in square brackets, as in "[::1]:80", "[ipv6-host]:http" or "[ipv6-host%zone]:80"
server_addr = [公网服务IP]
server_port = 7000

token= [YOURTOKEN]

[udp_port]
type = udp
local_ip = 127.0.0.1
local_port = 1194
remote_port = 1194 # 按需设置
use_encryption = false
use_compression = false

````

启动服务:

````bash
$: frpc -c /path/to/frpc.ini
````

## 4 常见问题

完成了以上VPN服务内网穿透的操作，就可以直接通过客户端进行登录操作了。 可能过程中还会遇到一些问题。 如果VPN连接建立成功，但是内网仍然不能`ping`通。可以通过以下命令进行调试，查看问题所在。

````
$: ip route get [ip]
````

该命令可以查看指定`ip`在本机上的路由情况.

````
$: ip route list
````

该命令可以查看本机上的路由表信息。

基本上大部分问题都可以通过 以上两个命令解决。 

如果对于路由原理不清楚，可以参考该篇文章: [如何操作系统路由表](/route-command/)