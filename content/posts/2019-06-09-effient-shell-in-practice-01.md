---
date: 2019-06-09
title: '高效SHELL实操（一）: 命令别名'
template: post
thumbnail: '../thumbnails/bash.png'
slug: effient-shell-in-practice-01
author: JayL
categories:
  - bash
tags:
  - alias
---

看完<a href="https://coolshell.cn/articles/19219.html" target="_blank">《打造高效的工作环境 – SHELL 篇》</a>，切换个人的SHELL环境：`zsh` + [oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh) + [zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions), 轻松敲打几个命令，该提醒的、弹出的也都如预期般的展示，的确大大的提升了命令输入的效率。

如果仅仅是提升输入效率或是使用[oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh)提供的个性化的主题，可真是大材小用了。[oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh)是一套真正的基于`zsh`的脚本框架，其真正的威力表现在其提供的200多个插件上。这些插件有些是通过直接提供辅助函数的方式扩展SHELL环境，有些则需要首先安装基础命令，再通过提供一组别名的方式扩展SHELL环境。每个插件都会在其相应的目录中提供`README`文件，供使用者快速入门。

举两个例子，在`~/.zshrc`中的 `plugins`中增加 `osx` 插件，该插件就是直接在脚本中提供一组函数的方式，扩展SHELL的功能。具体`osx`提供哪些功能函数，可以参考插件的[README](https://github.com/robbyrussell/oh-my-zsh/blob/master/plugins/osx/README.md). 其提供的几个功能函数：

````bash
#  开启一个新的teminal Tab窗口
$: tab 
#  横切分Tab窗口
$: split_tab
#  纵切分Tab窗口
$: vsplit_tab
#  通过finder打开当前目录
$: ofd
#  删除当前目录及子目录下的.DS_STORE文件
$: rmdsstore
````
就是非常好用的命令。

在[oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh)中插件`git`默认的就是打开的。该`git`插件则是通过提供一组别名的方式来扩展SHELL的。

> 如何查看这组别名呢？

可以通过直接查看`git`的插件脚本进行查看, 也可查看它的[README](https://github.com/robbyrussell/oh-my-zsh/blob/master/plugins/git/README.md)。

更方便的方法是，直接通过`alias`命令查看。很多人只会使用`alias`创建别名，而忽略了该命令的其它功能。不妨通过`tldr`命令查询看看`alias`的功能列表：

````bash

$: tldr alias
alias

Creates aliases -- words that are replaced by a command string.
Aliases expire with the current shell session, unless they're defined in the shell's configuration file, e.g. `~/.bashrc`.

- List all aliases:
    alias

- Create a generic alias:
    alias word="command"

- View the command associated to a given alias:
    alias word

- Remove an aliased command:
    unalias word

- Turn `rm` into an interactive command:
    alias rm="rm -i"

- Create `la` as a shortcut for `ls -a`:
    alias la="ls -a"
````

现在，就通过`alias`命令查看以下`git`插件增加了哪些别名：

````bash
$: alias | grep ^g
g=git
ga='git add'
gaa='git add --all'
gap='git apply'
gapa='git add --patch'
gau='git add --update'
gav='git add --verbose'
gb='git branch'
gbD='git branch -D'
...

# 统计一些git的别名总数
$: alias | grep ^g | wc -l
141
````

真是不查不知道，一查吓一跳竟然会有141个针对`git`命令的别名。虽然每个人自己会根据各自的使用习惯定义自己的别名，但是，尽量使用插件中定义的别名可以减少很多别名冲突的问题。
这么多别名，一个个看下来还是很累的，而且不容易记。不妨写一个简单的脚本，在要使用`git`命令时先查一下是否存在相应的别名。如果存在就开始逐步使用起来，也就不需要专门进行记忆了。

### 扩展自己的插件

在`oh-my-zsh`的脚本框架下，增加一个自定义的插件`alias`.提供一个快速查询现有别名的功能。

````bash

$: mkdir ～/.oh-my-zsh/plugins/alias
$: cd ～/.oh-my-zsh/plugins/alias
$: cat <<EOF > alias.plugin.zsh
function alias-find(){
    alias | grep $1
}

alias af="alias-find "
EOF

````
完成编辑后，`.zshrc`中增加`alias`插件。重新开启新的SHELL窗口，现在就可以通过`af`别名命令查询已有的别名了。

````bash
$: af commit
gc='git commit -v'
'gc!'='git commit -v --amend'
gca='git commit -v -a'
'gca!'='git commit -v -a --amend'
gcam='git commit -a -m'
'gcan!'='git commit -v -a --no-edit --amend'
'gcans!'='git commit -v -a -s --no-edit --amend'
gcmsg='git commit -m'
'gcn!'='git commit -v --no-edit --amend'
gcs='git commit -S'
gcsm='git commit -s -m'
gdt='git diff-tree --no-commit-id --name-only -r'
git-svn-dcommit-push='git svn dcommit && git push github master:svntrunk'
gsd='git svn dcommit'
gwch='git whatchanged -p --abbrev-commit --pretty=medium'
gwip='git add -A; git rm $(git ls-files --deleted) 2> /dev/null; git commit --no-verify --no-gpg-sign -m "--wip-- [skip ci]"'
````
这样就可以快速的查询已有存在`commit`内容的别名命令了。

## 总结

- `oh-my-zsh`是一个脚本框架，如果使用该框架，尽可能最大化的使用到它的功能。
- 扩展自己的插件，可以非常有效的管理自己的脚本。

## 参考项目

个人的`alias`插件项目，请参阅：[liujianping/oh-my-zsh](https://github.com/liujianping/oh-my-zsh/blob/master/plugins/alias/alias.plugin.zsh).