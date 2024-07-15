---
id: yalc
slug: /tool/yalc
title: 更好的本地package开发调试工具：yalc
date: 2002-09-26
authors: 鲸落
tags: [tool, yalc]
keywords: [tool, yalc]
---


起因：在我司调试项目的时候涉及到了yalc，就想着来细致的了解一下这个工具，在此之前还没有用过，纪录一下



> 作者：前端实习生鲸落
>
> 博客：[鲸落 (xiaojunnan.cn)](http://www.xiaojunnan.cn/)
>
> Github：[github.com/xiaojunnanya](https://github.com/xiaojunnanya)



## yalc是什么

yalc github上的解释：`Better workflow than npm | yarn link for package authors.`（对`包开发者`而言，一种比yarn/npm link`更好的开发流程`）

相较于npm、yarn提供了一种更加灵活、可靠的方式，来在不同的npm包之间共享代码和进行本地开发测试





## npm link/yarn link/yalc 都是做什么的

### yalc之前

在yalc之前，或者大家根本不知道yalc的时候，在当你正在开发一个`组件库/sdk/插件`或其他npm库的时候，如果你想知道它们在一个前端项目上`被依赖/被使用`的真正效果时，你应该怎么做？

例如：

> `admin-management`依赖了`good-ui`，经过了一上午的~~摸鱼~~开发，我在`good-ui`实现了一个功能，但我想知道它在`admin-management`中的实际表现如何，我应该怎么做呢？

一般来说，我有以下几种选择



### 通过相对或绝对路径引用

将业务代码中的`import和require`所用到的地址，从`在node_modules里检索`改为`真实的物理地址`。例如：

```javascript
// import { Button } from 'good-ui'
// 为了调试，强行改成了绝对或者相对路径
import { Button } from 'C:/codes/good-ui/dist'
```



**此方案缺点**：`需要频繁改业务代码`，这既麻烦又危险，毕竟谁能保证不犯错呢



### 发布到npm源后再调试

将你构建后的产物发布到npm或私有npm上，然后在本地重新install后直接使用。你需要：

```bash
# 去good-ui里升级版本&发布
npm version prerelease # 升级版本
npm publish # 发布
# 在admin-management中
npm install goood-ui@latest
```



**此方案缺点**：污染了npm版本线，且需要频繁npm install，效率也不高



### 使用npm link或yarn link调试

使用npm link/yarn link/yalc 等工具，通过软链接的方式进行调试
 原理：

- 在全局包路径（Global Path）下创建一个软连接(Symlinked)指向`good-ui`的dist包;
- 在`admin-management`里通过软连接，将全局的软链接指向其`node_modules/good-ui` 通常也需要两步

```bash
# 第一步 在good-ui中执行：
npm link
# or
yarn link
# 第二步 在admin-management中执行：
npm link good-ui
# or
yarn link good-ui
```



**此方案缺点**：

1. 影响node_modules中原本的`good-ui`包
2. 软链接和文件系统引发的其他各种奇怪的问题
3. 全局中`good-ui`版本



### 更好的方案yalc

对`包开发者`而言，一种比yarn/npm link`更好的开发流程`。

它的主要对标者就是yarn/npm link，它主要解决了一些yarn/npm link本身存在的缺陷，满足了`包开发者`的实际需求。





## Yalc vs npm link：深入对比及优势

### 工作方式差异

- npm link是通过在本地创建一个全局链接,并让依赖这个包的项目链接到全局包来实现的。这意味着全局有一个这个包的单实例。
- yalc通过把本地暂存包的副本复制到依赖项目的node_modules来工作。
  - yalc不会在全局创建符号链接,而是会直接把当前工作目录的包文件(比如my-package),复制一份到依赖这个包的项目(比如my-app)的node_modules目录下面。
  - 这样my-app项目就直接依赖于本地的my-package的副本,可以独立进行迭代开发和测试,而不会相互影响。 也就是说,通过yalc,不同的依赖项目会各自拥有本地包的一个副本,而不是通过全局符号链接的方式依赖同一个包实例。
  - 这样可以避免使用npm link时的一些问题,如全局唯一实例被多项目篡改,需要频繁建立和切断链接等。每个项目可以通过自己的本地包副本独立工作。



### 使用场景差异

- npm link更适合单项目开发和测试。如果有多个项目依赖同一个本地包，npm link就需要频繁链接和断开链接。
- yalc更适合多项目同时开发和测试。每个项目可以独立安装测试本地包，不会互相影响，当然也可以完全 yalc 一把梭。



### yalc的优势

- 支持一次向多个项目推送本地包，不需要重复链接过程
  - yalc可以通过在包目录下执行`yalc publish`一次性将本地包推送到多个依赖项目，依赖项目只需要执行`yalc add package-name`即可。这避免了使用npm link时需要对每个项目重复建立全局链接的过程。
- 依赖项目可以独立迭代修改本地包，不会相互干扰
  - 每个依赖项目都拥有本地包的独立副本,可以根据自己的需要自由修改和迭代,不会影响到其他项目,也不会被其他项目的修改所影响。
- 更清晰的目录结构,可以直接在node_modules看到本地包
- 依赖项目不需要全局链接包,更干净的环境
- 可以随时通过yalc remove清理项目的本地依赖
- 精确的版本控制
  - **npm link：** 当使用`npm link`时，你将一个本地包链接到另一个项目中。然而，这个过程不涉及包的版本信息，因此在不同项目中可能会出现版本不一致的情况。这可能会导致开发人员在测试或构建过程中遇到意外的错误。
  - **Yalc：** Yalc为每个链接的包分配一个唯一的版本号。这确保了不同项目使用的是相同版本的链接包，消除了版本差异可能带来的问题。无论你在哪个项目中测试代码，都可以确保使用的是一致的包版本





## 使用yalc

### 安装

```bash
npm i yalc -g
# or
yarn global add yalc
```



### 使用yalc

1. 发布依赖 （yalc publish）：在`good-ui`包中执行：`yalc publish`
2. 添加依赖（yalc add - ）：在`admin-management`项目中执行`yalc add good-ui`
   - 其对应的依赖就会变成`"good-ui": "file:.yalc/good-ui"`

3. 移除依赖（yalc remove -）：在`admin-management`项目中执行`yalc remove good-ui`
   - 这样就又重新用上了`node_modules`中原本依赖的`good-ui`

4. 更新和推送（yalc push）：如果在你修改了`good-ui`里的一些代码，你只需要执行`yalc publish --push`/`yalc push`
   - 你的最新的包，直接在`admin-management`中生效了
5. 其他的用法可以前往github上查看：[yalc (github.com)](https://github.com/wclr/yalc)



### 自动化

当前上述的使用都是每次修改我们都需要手动的执行命令，那有没有自动化的方式呢

具体的一些环境可能还是要看具体的常见，并且windows和mac的执行命令有时候还是有一点不一样的

这里我提供的是windows

```json
# 先运行
"start": "cross-env \"npm:build:* -- --watch\"",
# 使用mondemon监听变化进行实时推送
"yalc:watch": "nodemon -x \"yalc push --sig\""
```





## 参考链接

[【一库】yalc: 可能是最好的前端link调试方案（已经非常谦虚了） - 掘金 (juejin.cn)](https://juejin.cn/post/7033400734746066957)

[还在用npm link？yalc: 更丝滑的前端link调试方案 - 掘金 (juejin.cn)](https://juejin.cn/post/7270912883961298979)