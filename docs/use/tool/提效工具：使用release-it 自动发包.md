---
id: release-it
slug: /tool/release-it
title: 提效工具：使用release-it 自动发包
date: 2002-09-26
authors: 鲸落
tags: [tool, release]
keywords: [tool, release]
---

> [release-it(github.com)](https://github.com/release-it/release-it)



## 前言

在我们日常工作开发中或多或少都要和`npm`包打交道。之前工作中就有过发布`npm`包的经历，只知道无脑通过`npm publish`发包，也没有打 `tag`、版本、没生成 `changelog`的概念。后来在实习的时候了解到，可以使用release-it 来进行自动打包发布，在这里纪录一下



## 前置准备

要在`npm`上发包，当然需要在`npm`上注册账号，这个就不再赘述。我们在注册完账号之后，先设置一下镜像源，再登录自己的`npm`账号。如果有同学和我一样，使用的是公司内部私有的`npm`服务器，使用的账号和镜像源都是公司提供的，不要弄混淆，下面我们开始具体步骤。



### 准备项目文件

首先创建一个文件夹，然后执行`npm init -y `初始化我们的项目

`package.json`文件

```json
{
  "name": "release-test",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```



如果是在已有项目中接入，最好要查看一下当前项目镜像源，初始化项目可以跳过。

那为什么要设置镜像源呢？装过`npm`包的同学都知道，`npm`官方`public`仓库是部署在国外，使用官方镜像源装包速度很慢，所以我们有时候会将镜像源设置为`https://registry.npm.taobao.org`，也就是淘宝镜像。这个时候如果我们使用`npm`的账号是无法登录的，或者是说你把镜像设置为公司内部私有的镜像源，这个时候通过官方`npm`账号也是无法登录的。在哪注册的账号，需要将镜像源设置为注册地的仓库。这里我们使用`npm`官方镜像源，将镜像源设置为`https://registry.npmjs.org`

```shell
# 查看当前镜像源
npm config get registry  

# 设置镜像源
npm set registry https://registry.npmjs.org  
```



另外一种设置镜像源方式，可以在项目根目录中新建`.npmrc`文件

```js
registry = https://registry.npmjs.org/
```



### 登录npm

使用`npm`注册的账号密码登录，这里就不演示了

```shell
# 登录
npm login

➜ npm login
Username: 用户名
Password: 密码
Email: 注册邮箱
Enter one-time password: 一次性密码  邮箱会收到邮件

➜ npm whoami 
# 查看当前登录账号名称
```



## 自动发包

`release-it`它做了什么？

- 同步提交`git`远端内容
- 更新版本号
- 产出`changelog`
- 提交变动
- 增加`git tag`
- 推送tag更新至远端

我们可以通过`--dry-run`参数可以看到具体进行了哪些操作



### 安装

```sql
➜ npm init release-it
npx: 30 安装成功，用时 5.813 秒
? Where to add the release-it config? ›
❯   .release-it.json
    package.json
```

在上面的选择就是选择你的配置项放在哪



或者运行：`npm install -D release-it` 也可



选择之后会自动在package scripts中添加命令

```json
"scripts": {
    "release": "release-it"
},
```



### 配置

在项目根目录创建文件

- `.release-it.json`
- `.release-it.js`
- `.release-it.yaml` 
- `.release-it.toml`

或者是在`pakcage.json`文件中添加`release-it`属性，这里我就直接创建`.release-it.json`文件，添加以下配置或者可以查看 [更多配置](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Frelease-it%2Frelease-it%2Fblob%2Fmaster%2Fdocs%2Fconfiguration.md)

```json
{
    "github": {
        "release": true
    },
    "git": {
        "commitMessage": "release: v${version}"
    },
    "npm": {
        "publish": true
    },
    "hooks": {
        "after:bump": "echo 更新版本成功"
    }
}
```



### 生成CHANGELOG

安装插件：`npm i @release-it/conventional-changelog -D`

然后将以下内容添加到`.release-it.json`文件中

```json
"plugins": {
    "@release-it/conventional-changelog": {
      "preset": "angular",
      "infile": "CHANGELOG.md"
   }
}
```



### 自动发布

运行命令，就可以进行发布

```shell
➜ npm run release
# or
➜ npx release-it
```



> 在这里发包的时候遇到了一些问题，还没有发成功，再说





## 踩坑

### 超时

```js
npm WARN config global `--global`, `--local` are deprecated. Use `--location=global` instead.

> release-test10@1.0.0 release
> release-it

ERROR Timed out after 10000ms.
Documentation: https://git.io/release-it-npm
```



### 没有git仓库提交代码

在安装完`@release-it/conventional-changelog`后，如果没有在`git`远程仓库提交代码，也是会发布失败

```js
ERROR Unable to fetch from null
fatal: not a git repository (or any of the parent directories): .git
```



### 包名重复

发包前，最好确认一下包名有没有重复，如果包名重复是无法发布的。校验包名最简单的办法就是去`npm`官网上搜你需要发布的名字，如果有就需要换一个名字，没有就可以发布。



### changelog文件没有commit信息

为什么我提交了commit，但是生成的changelog中没有commit信息？

这是因为提交的commit信息不符合`angular`规范，在`.release-it.json`文件中我们可以看到

```js
...
  "plugins": {
    "@release-it/conventional-changelog": {
      "preset": "angular",
      "infile": "CHANGELOG.md"
    }
  }
...
```





## 其他

我所了解到的还有`standard-version`也可以自动发包，但是我看了github已经两年没有更新了，所以还是更推荐使用`release-it`
