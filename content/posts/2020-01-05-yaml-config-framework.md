---
date: 2012-01-05
title: 'Go 编程: 从 K8S 资源定义到 YAML 配置框架的实现'
template: post
thumbnail: '../thumbnails/go.png'
slug: yaml-config-framework
author: JayL
categories:
  - go
  - k8s
tags:
  - yaml  
  - go
  - golang
  - Go 编程
---

在 Go 语言中，实现 YAML 配置定义与解析是非常简单的, 以最新YAML 包 `gopkg.in/yaml.v3` 为例：

````go

import "gopkg.in/yaml.v3"

type StructA struct {
    A string `yaml:"a"`
}

type StructB struct {
    StructA `yaml:",inline"`
    B       string `yaml:"b"`
}

var b StructB
err := yaml.Unmarshal([]byte(data), &b)

````

非常直白，貌似不值一谈。再看看现实， YAML 文件用途之广泛，特别是在Kubernetes 平台上的应用，简直就是不可或缺。几乎所有 Kubernetes 资源都有相应的 YAML 格式定义， 少说也有几十种，这些资源在 Kubernetes 中是如何定义并被解析处理的呢？

## 何为配置框架

如果这几十种资源全都按篇头的例子进行独立定义是不可想象的。所以，在 Kubernetes 的资源定义上设计了一套基础**元数据**定义框架。不妨就就简单的 POD 资源定义做个例子分析一下：

````yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    app: myapp
spec:
  containers:
  - name: myapp-container
    image: busybox
    command: ['sh', '-c', 'echo Hello Kubernetes! && sleep 3600']
````

配置定义中：`apiVersion`、`kind`、`metadata`、`spec`这四项一级字段，就是我所说的**元数据**属性字段。在 Kubernetes 中，所有的资源对象都必须遵守这个基础框架格式。至于具体的资源定义，则通过`kind`进行区分，通过 `spec`进行具体定义。

> 这样定义有什么好处呢？

首先，从配置定义层面看，这种定义方式直接将**具体资源配置**抽象成**通用资源配置**，这样实际处理资源配置的过程就可以框架化。什么是框架化，请参考以前的[文章](/go-tcpserver-graceful-shutdown/).这里简单贴一下框架原理图。

![](../images/framework.png)

框架的好处之一，就是**代码复用**。同样，对于配置文件，如果配置本身遵循同一套基础框架时，那么，配置文件的处理过程就可以实现框架化，即通过相同的处理流程进行处理，也就实现了框架特性，**代码复用**。

将不同的配置设计成遵循同一套基础框架还有另外一个好处，即**延迟实现**。如果所有的 Kubernetes 资源都必须在发布时就预先定义好资源属性，想想CRD（用户自定义资源）岂不是束手无策。

## YAML 配置框架的实现

原理讲完了，现在我们来简单模拟一下 Kubernetes 资源配置框架的实现。简单定义一个叫做`command`的资源配置：

````yaml
apiVersion: v1
kind: command
name: hello #简化 metadata 成简单的 name 
spec:
  command: 
    - echo
    - hello
````

用最简单的 Go 代码实现以上面的资源的解析过程：

````go
// 基础资源配置框架结构定义
type Resource struct{
  ApiVersion string `yaml:"apiVersion"`
  Kind string `yaml:"kind"`
  Name string `yaml:"name"`
  Spec Command `yaml:"spec"`
}

// command 配置定义
type Command struct {
  Argments []string `yaml:"command"` 
}

// 解析 Resource
var resource Resource
err := yaml.Unmarshal([]byte(data), &resource)

````

实现配置框架的解析是非常容易的，只需要定义出基础配置项即可。这是已知情况。现在问题是，Kind 类型不仅仅是 `command`, 还有其它的类型。比如，增加一个 `database` 的配置资源定义：

````yaml
apiVersion: v1
kind: database
name: dbconfig #简化 metadata 成简单的 name 
spec:
  host: "127.0.0.1"
  port: "3306"
  database: "demo"
  username: "demo"
  password: "123456"
````

那么现在，如何通过使用同一套代码实现两个完全不同资源的解析呢？

首先，当然还是要增加 `Database` 的类型定义，这步少不了。如下：

````go
// database 配置
type Database struct {
  Host string `yaml:"host"`
  Port string `yaml:"port"`
  Database string `yaml:"database"`
  Username string `yaml:"username"`
  Password string `yaml:"password"`
}
````

有了`Command`与`Database`的定义，现在的问题是，如何让`Resource`同时支持这两种类型，当然，可能还会有更多种类型。做为一名资深 Go 程序员，第一反应一定是使用接口。不错！但是如何在配置框架中使用接口呢？

不妨回头看看，我前面讲到的，**延迟实现**。在解析配置时，对于不确定的配置节点，就可以采取**延迟实现**的方式来处理。在最新`gopkg.in/yaml.v3`包中，对于延后处理的节点可以定义成`yaml.Node`类型。那么，现在 `Resource` 定义就可以更新成这样：

````go
// 基础资源配置框架结构定义
type Resource struct{
  ApiVersion string `yaml:"apiVersion"`
  Kind string `yaml:"kind"`
  Name string `yaml:"name"`
  //延迟实现解析
  Spec yaml.Node `yaml:"spec"`
}
````

那么现在即使完全不知道`Command`与`Database`的定义我们也可以开始解析`Resource`了。写一个简单文件解析函数的实现：

````go
//伪代码，谨慎使用
func Parse(filename string) ([]*Resource, error) {
  fd, err := os.Open(filename)
  if err != nil {
    return nil, err
  }

  rs := []*Resource{}
  dec := yaml.NewDecoder(fd)
  for {
    r := Resource{}
    err := dec.Decode(&r)
    if err != nil {
      if err == io.EOF {
        break
      }
      return err
    }
    rs = append(rs, r)
  }
  return rs, nil
}
````

如果写到这就完了，那前面我所说的什么框架啊、配置框架也就白瞎了。既然要写配置框架，当然处理框架配置以外，还需要框架处理流程。我们还有很关键的事没有完成。不妨，先看看在 Kubernetes 平台上，配置资源是如何流转的。

![](../images/k8s-config-flow.png)

在 Kubernetes 平台上， YAML 格式的资源配置主要过程是：①、 ② 两个过程。这两步的关键实现就在 ApiServer 上。当然，这里并不是要将 ApiServer 摊开来一步一步的做源码分析。我们只需要知道①、 ② 两个过程就可以了，即在 ApiServer 内部实现上，所有的资源定义配置经过 ApiServer 时，第一步肯定是**解析配置**，然后就是第二步**处理配置**。

同理，回到我们自己的例子中来。不论是 `command` 还是 `database`， 解析完成后，后面一定还有一个后续操作，至于具体什么操作不重要，关键是要有，哪怕是一个空操作。所以，我们就可以定义这样一个操作执行接口：

````go
type Executor func(context.Context) error
````

除了这个执行接口以外，其实我们还少一个关键步骤，即**规范Kind资源类型**。如何规范Kind资源类型呢，答案当然是接口。Kind 资源如何在配置框架中实现处理，这个处理过程我们就可以抽象成下面的接口， 即将延迟处理的 `yaml.Node` 解析成目标执行`Executor`接口. 这就是不同 `Kind` 类型资源，必须实现的接口。

````go
//Kind Spec Interface
type KindSpec interface{
  Decode(node *yaml.Node) (Executor, error)
}
````

有了这样一个 `KindSpec` 的接口类型定义，我们就可以将不同的 `Kind` 类型资源通过注册的方式注入到配置框架中，写一个简单的配置框架代码类供大家参考：

````go
//伪代码，谨慎使用
type ConfigFramework struct{
    kinds map[string]KindSpec
}

func New() *ConfigFramework{
  return &ConfigFramework{kinds: make(map[string]KindSpec)}
}

//注册 Kind 类型资源
func (cf *ConfigFramework) Register(kind string, spec KindSpec) {
  cf.kinds[kind] = spec
}

func (cf *ConfigFramework) Execute(ctx context.Context, filename string) error {
  fd, err := os.Open(filename)
  if err != nil {
    return err
  }

  dec := yaml.NewDecoder(fd)
  for {
    r := Resource{}
    err := dec.Decode(&r)
    if err != nil {
      if err == io.EOF {
        break
      }
      return err
    }
    if spec, ok := cf.kinds[r.Kind]; ok {
      if exec, err := spec.Decode(r.Spec); err != nil {
        return err
      }
      if exec != nil {
        if err := exec.Execute(ctx); err != nil {
          return err
        }
      }
    }
  }
  return nil
}

````

以上，就完成了一个简单配置框架，即将配置的解析与处理过程框架化。

