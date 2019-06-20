---
date: 2019-06-19
title: 'SUID, SGID 和 Sticky Bit 到底是什么'
template: post
thumbnail: '../thumbnails/linux.png'
slug: linux-suid-guid-stick
author: JayL
categories:
  - devops
  - linux
tags:
  - suid
  - sgid
  - sticky
---

对于Linux系统而言，针对可执行文件与目录存在三个特殊权限设置。分别是：

- SUID
- SGID
- Sticky bit

## Set-user Identification (SUID)

你是否想过，一个非`root`用户是如何通过修改他的密码，并且新的密码写入到一个他没有写权限的文件`/etc/shadow`中的。要解答这个问题，我们首先检查以下`/usr/bin/passwd`命令的文件属性：

````bash
$: ls -lrt /usr/bin/passwd
-r-sr-sr-x   1 root     sys        31396 Jan 20  2014 /usr/bin/passwd
````

你会发现该文件在`owner`与`group`区域的执行权限字段不是`x`而是`s`。其中`owner`区的`s`代表`SUID`,而`group`区的`s`则代表`SGID`。

如果一个命令的`SUID`位被设置为`s`， 那么其在执行的过程中，命令的执行用户就会切换成命令的`owner`进行执行。

注意，有时候在`owner`区的`s`可能设置的是`S`。大写的意思是，`owner`区执行位权限是空`-`。

## Set-group identification (SGID)

`SGID`与`SUID`基本类似，只是在命令执行后切换的用户不是`owner`而是`group`。

与`SUID`不同的是，如果`group`区的执行位权限设置是空`-`的话，同时`SGID`位设置了，那么在其执行位表示的不是`S`,而是`l`。

## Sticky Bit

`Sticky Bit`主要用于目录的共享。目录 `/var/tmp` and `/tmp`就具备共享功能，所有用户都可以创建文件，还可以修改或执行其它用户的文件，但是删除文件只能是文件拥有者。一旦目录的`Sticky Bit`被设置了，就能保证目录中各自的文件只有文件的拥有者可以删除。

````bash
# ls -ld /var/tmp
drwxrwxrwt  2   sys   sys   512   Jan 26 11:02  /var/tmp
````
类似`S`,当`Sticky Bit`设置的值是`T`时，表示`other`区的执行权限为空`-`。`t`则代表`other`区的执行权限已设置。

## 如何设置以上特殊权限

设置可执行文件或目录的特殊权限，关键是要知道这些权限值具体在文件属性中是如何存储的。其实文件属性设置位，不是我们看到的10位，即1字节的类型位 + 9字节的3组`rwx`位。

其实在系统的实现中，文件权限使用12个二进制位表示：

````
11 10 9 8 7 6 5 4 3 2 1 0
S  G  T r w x r w x r w x
````
第11位为SUID位，第10位为SGID位，第9位为sticky位，第8-0位对应于上面的三组rwx位。所以要设置相应的值和其它位类似：

````bash
# 设置SUID
$: chmod 4555 [path_to_file]

# 设置SGID
$: chmod 2555 [path_to_file]

# 设置Sticky Bit
$: chmod 1777 [path_to_directory]
# 或者
$: chmod +t [path_to_directory]
````

## 参考：

- [What is SUID, SGID and Sticky bit](https://www.thegeekdiary.com/what-is-suid-sgid-and-sticky-bit/).