---
id: nestseries02
slug: /nestseries02
title: 02-快速掌握NestCLI
date: 2002-09-26
authors: 鲸落
tags: [Nest]
keywords: [Nest]
---

## @nest/cli

项目开发离不开工程化的部分，比如创建项目、编译构建、开发时 watch 文件变动自动构建等。

Nest 项目自然也是这样，所以它在 @nestjs/cli 这个包里提供了 nest 命令。

可以直接 npx 执行，npm 会把它下载下来然后执行：

```
npx @nestjs/cli new 项目名
```

也可以安装到全局，然后执行，更推荐这种：

```
npm install -g @nestjs/cli

nest new 项目名
```

不过后者要时不时升级下版本，不然可能用它创建的项目版本不是最新的：

```
npm update -g @nestjs/cli
```

那 nest 都提供了啥命令呢？

nest -h 看看:

![](02-快速掌握NestCLI.assets/5825f0b71ed243ccaff39c6d5010110dtplv-k3u1fbpfcp-watermark.png)

有创建新项目的 nest new，有生成某些代码的 nest generate，还有编译构建的 nest build，开发模式的 nest start 等。

分别看一下：

## nest new

nest new 我们用过，就是创建一个新的 nest 项目的。

它有这么几个选项：

![](02-快速掌握NestCLI.assets/6b94ca38aaef4d13acb999234c0ea3dftplv-k3u1fbpfcp-watermark.png)

--skip-git 和 --skip-install 很容易理解，就是跳过 git 的初始化，跳过 npm install。

--package-manager 是指定包管理器的，之前创建项目的时候会让我们选择：

![](02-快速掌握NestCLI.assets/74fe9a9c3c77465c904b587574c128edtplv-k3u1fbpfcp-watermark.png)

指定之后，就跳过包管理器选择这步了：

![](02-快速掌握NestCLI.assets/33871e97763d4ddc983f0a36099164c5tplv-k3u1fbpfcp-watermark.png)

--language 可以指定 typescript 和 javascript，一般我们都选择 ts，用默认的就好。

--strict 是指定 ts 的编译选项是否开启严格模式的，也就是这么 5 个选项：

![](02-快速掌握NestCLI.assets/7e004a861e0146fd8b2b48c7d954a744tplv-k3u1fbpfcp-watermark.png)

默认是 false，也可以指定为 true：

![](02-快速掌握NestCLI.assets/3e7c8a78c688481695933d04055634b4tplv-k3u1fbpfcp-watermark.png)

这个之后需要的话再改就行。



## nest generate

nest 命令除了可以生成整个项目外，还可以生成一些别的代码，比如 controller、service、module 等。

比如生成 module：

```
nest generate module aaa
```

![](02-快速掌握NestCLI.assets/4ffdcbbd08fc4d048b59a860b55b4312tplv-k3u1fbpfcp-watermark.png)

它会生成 module 的代码：

![](02-快速掌握NestCLI.assets/14fdef17ae594e62b25623a4254a34d8tplv-k3u1fbpfcp-watermark.png)

还会自动在 AppModule 里引入：

![](02-快速掌握NestCLI.assets/357fecc074a540eeb6e4f70a1b5f5471tplv-k3u1fbpfcp-watermark.png)

当然你也可以生成 controller、service 等代码：

```
nest generate controller aaa
nest generate service aaa
```

同样，它也会更新到 module 的依赖里去。

当然，如果是要完整生成一个模块的代码，不需要一个个生成，可以用 

```
nest generate resource xxx
```

它会让你选择是哪种代码，因为 nest 支持 http、websocket、graphql、tcp 等，这里我们选择 http 的 REST 风格 api：

![](02-快速掌握NestCLI.assets/1480b030b48b4517b9ee38e8bda06e81tplv-k3u1fbpfcp-watermark.png)

然后会让你选择是否生成 CRUD 代码：

![](02-快速掌握NestCLI.assets/90edc9b8005547cb9d7c6e10e8f2b73atplv-k3u1fbpfcp-watermark.png)

选择是。

然后就会生成整个模块的 CRUD + REST api 的代码：

![](02-快速掌握NestCLI.assets/94ebae465ba94991a154ffe7652b3557tplv-k3u1fbpfcp-watermark.png)



当然，它同样会自动在 AppModule 引入：

![](02-快速掌握NestCLI.assets/e09b9ac107e840b2883c81764d0dc48dtplv-k3u1fbpfcp-watermark.png)

这就是 nest generate，可以快速生成各种代码：

![](02-快速掌握NestCLI.assets/a33cc387c39b4870b698dbc518a98530tplv-k3u1fbpfcp-watermark.png)

这些代码模版的集合是在 @nestjs/schematics 这个包里定义的。

nest new 创建项目的时候有个 --collection 选项，就是配置这个的。

不过一般我们不需要配置。

你可以在 [@nestjs/schematics](https://github.com/nestjs/schematics/tree/master/src/lib) 里看到这些代码模版的定义：

![](02-快速掌握NestCLI.assets/0d9109ed36fa4287b05803b841ca5754tplv-k3u1fbpfcp-watermark.png)

它的实现原理很简单，就是模版引擎填充变量，打印成代码：

![](02-快速掌握NestCLI.assets/6e441a62a8904bb8b4832df6b48508bbtplv-k3u1fbpfcp-watermark.png)

nest generate 也有不少选项：

![](02-快速掌握NestCLI.assets/76df459728cd4f69bfede05aec788658tplv-k3u1fbpfcp-watermark.png)

--flat 和 --no-flat 是指定是否生成对应目录的：

![](02-快速掌握NestCLI.assets/d37577a1f5ef4d9aa7b1ccb4c2502cdatplv-k3u1fbpfcp-watermark.png)

--spec 和 --no-spec 是指定是否生成测试文件：

![](02-快速掌握NestCLI.assets/d8f052d8088f41c3a881ab289c551c3etplv-k3u1fbpfcp-watermark.png)

--skip-import 是指定不在 AppModule 里引入：

![](02-快速掌握NestCLI.assets/a635e5d8a0b6494eb59109bfe5e10fcetplv-k3u1fbpfcp-watermark.png)

也就是不生成这部分代码：

![](02-快速掌握NestCLI.assets/ef965983632c43b6a314aada5d2e572ctplv-k3u1fbpfcp-watermark.png)

至于 --project，这是指定生成代码在哪个子项目的，等之后用到 monorepo 项目的时候再说。

这就是 nest cli 提供的快速生成各种代码的能力，是不是还挺方便的？

## nest build

然后就是 nest build 了，它是用来构建项目的:

![](02-快速掌握NestCLI.assets/fe5cb526a5724f3a95a299e51193ff6etplv-k3u1fbpfcp-watermark.gif)

执行 nest build，会在 dist 目录下生成编译后的代码。

同样，它也有一些选项：

![](02-快速掌握NestCLI.assets/2e74a180fe0f481cbe6d99f38071488etplv-k3u1fbpfcp-watermark.png)

--wepback 和 --tsc 是指定用什么编译，默认是 tsc 编译，也可以切换成 webpack。

这是 tsc 的编译产物：

![](02-快速掌握NestCLI.assets/afac24d943e14446aa9c3d593770b06atplv-k3u1fbpfcp-watermark.png)

这是 webpack 的编译产物：

![](02-快速掌握NestCLI.assets/706b166b0afc4fc18a6af653f846f63atplv-k3u1fbpfcp-watermark.png)

tsc 不做打包、webpack 会做打包，两种方式都可以。

node 模块本来就不需要打包，但是打包成单模块能提升加载的性能。

--watch 是监听文件变动，自动 build 的。

但是 --watch 默认只是监听 ts、js 文件，加上 --watchAssets 会连别的文件一同监听变化，并输出到 dist 目录，比如 md、yml 等文件。

--path 是指定 tsc 配置文件的路径的。

那 --config 是指定什么配置文件呢？

是 nest cli 的配置文件。

## nest-cli.json

刚刚我们说的那些选项都可以在 nest-cli.json 里配置：

![](02-快速掌握NestCLI.assets/a2297cf557e54157961a7e6ee67ee180tplv-k3u1fbpfcp-watermark.png)

比如 compilerOptions 里设置 webpack 为 true 就相当于 nest build --webpack，一样的效果：

![](02-快速掌握NestCLI.assets/fad42dc73a404089abbd5f921c43350atplv-k3u1fbpfcp-watermark.png)

webpack 设置为 false 就是用 tsc 了。

deleteOutDir 设置为 true，每次 build 都会都清空 dist 目录。

而 assets 是指定 nest build 的时候，把那些非 js、ts 文件也复制到 dist 目录下。

可以通过 include、exclude 来精确匹配，并且可以单独指定是否 watchAssets。

不过只支持 src 下文件的复制，如果是非 src 下的，可以自己写脚本复制：

![](02-快速掌握NestCLI.assets/4335579ee0a846fdbfc0ef022eed5c8atplv-k3u1fbpfcp-watermark.png)

然后是 generateOptions，这些就和我们 nest generate 时的 --no-spec、--no-flat 一样的效果。

比如我把 flat 设置为 false、spec 设置为 false，那再 generate 代码时就是这样的：

![](02-快速掌握NestCLI.assets/eb9a3995fd3a47138eb2be3f12169954tplv-k3u1fbpfcp-watermark.png)

生成了一层目录，并且没有生成测试文件。

sourceRoot 是指定源码目录。

entryFile 是指定入口文件的名字，默认是 main。

而 $schema 是指定 nest-cli.json 的 schema，也就是可以有哪些属性的：

[https://json.schemastore.org/nest-cli](https://json.schemastore.org/nest-cli)

这是一种 json schema 的规范，还是挺容易看懂的：

![](02-快速掌握NestCLI.assets/6afce9b2ea204fd49f1ef2fef2c59312tplv-k3u1fbpfcp-watermark.png)

如果想全面了解 nest-cli.json 都有啥属性，可以看看这个 schema 定义。

## nest start

最后，再来看下 nest start 命令：

![](02-快速掌握NestCLI.assets/42a6eb5dd0f94712ace4e9db607701a7tplv-k3u1fbpfcp-watermark.gif)

可以看到每次重新 build 了，并且用 node 把 main.js 跑了起来。

它有这些选项：

![](02-快速掌握NestCLI.assets/c961834fd8124bcb8803a39769f30679tplv-k3u1fbpfcp-watermark.png)

--watch 是最常用的选项了，也就是改动文件之后自动重新 build：

![](02-快速掌握NestCLI.assets/35e9594f302f4344be3adc4e84af0342tplv-k3u1fbpfcp-watermark.gif)

--debug 是启动调试的 websocket 服务，用来 debug。

![](02-快速掌握NestCLI.assets/921f0364a9ef4f5799a7217b0ebef375tplv-k3u1fbpfcp-watermark.png)

--exec 可以指定用什么来跑，默认是用 node 跑，你也可以切换别的 runtime。

其余选项和 nest build 一样，就不复述了。

## nest info

最后还有个 nest info 命令，这个就是查看项目信息的，包括系统信息、 node、npm 和依赖版本：

![](02-快速掌握NestCLI.assets/71eaf4f2c4d24447bab2aa00e598c7dctplv-k3u1fbpfcp-watermark.png)

## 总结

nest 在 @nestjs/cli 包里提供了 nest 命令，它可以用来做很多事情：

- 生成项目结构和各种代码
- 编译代码
- 监听文件变动自动编译
- 打印项目依赖信息

也就是这些子命令：

- nest new 快速创建项目
- nest generate 快速生成各种代码
- nest build 使用 tsc 或者 webpack 构建代码
- nest start 启动开发服务，支持 watch 和调试
- nest info 打印 node、npm、nest 包的依赖版本

并且，很多选项都可以在 nest-cli.json 里配置，比如 generateOptions、compilerOptions 等。

学会用 nest cli，是学好 nest 很重要的一步。