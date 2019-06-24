---
date: 2019-06-09
title: '高效SHELL环境 step by step（一）: 命令别名'
template: post
thumbnail: '../thumbnails/bash.png'
slug: effient-shell-in-practice-01
author: JayL
categories:
  - bash
tags:
  - alias
---

## 基础环境

在进行高效的SHELL实践之前，首先配置一下基础环境，当然首先是需要一台MacOS电脑。这里采用: `zsh` + `oh-my-zsh` + `zsh-completions` + `zsh-autosuggestions` 。具体安装步骤如下:

````bash
# 切换默认SHELL为 zsh
$: chsh -s /bin/zsh

# 安装 oh-my-zsh
$: sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"

# 安装 zsh-completions
$: git clone https://github.com/zsh-users/zsh-completions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-completions

# 安装 zsh-autosuggestions
$: git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

````
安装完成后，轻松敲打几个命令，该提示的、补全的也都如预期般的展示，的确大大的提升了命令输入的效率。

## 命令别名

减少输入的另一个办法就是对拼写复杂的命令设置简易的别名。`alias`别名命令最常规的用法就是，定义别名。当然这是`alias`命令的主要功能之一。不过它还具有其它功能，不细看的话很容易被忽略掉。

不妨通过`tldr`命令查询看看`alias`的功能列表：

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

不难看出，`alias`命令还有另外检索的功能，该功能在我们设置别名时先判断是否已经存在别名非常有用。

## 框架扩展

如果仅仅认为[oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh)只是提供的个性化的主题脚本框架，真是太小看它了。它一套真正的基于`zsh`的脚本框架，其真正的威力还表现在其提供的200多个插件上, 当然这些插件是需要安装的，在 `oh-my-zsh` 的插件目录中仅仅是这些工具的辅助函数或是别名。通过这个插件目录，我们可以发现大量功能强大的工具。当然我们也可以将自己常用的脚本放进来，作为独立的分支维护个人命令。

通常，`oh-my-zsh`都会开启默认插件`git`功能。但是具体`git`插件提供了哪些功能则需要通过插件的[README](https://github.com/robbyrussell/oh-my-zsh/blob/master/plugins/git/README.md)文件。打开一看，里面提供的别名有 141 个之多，这么多的别名很明显是无法记忆的。

````bash
# 统计一些git的别名总数
$: alias | grep ^g | wc -l
141
````

如果能够在使用时快速的查询这些别名，用时查询，一旦用得多了，也就记住了。先通过别名命令手动查询：

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
````

现在，我们就可以通过将这个简单命令行，写出自己的脚本，集成的`oh-my-zsh`的框架，作为自己的插件独立维护。在`oh-my-zsh`的插件目录中，增加一个自定义的插件`alias`.提供一个快速查询现有别名的功能。

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