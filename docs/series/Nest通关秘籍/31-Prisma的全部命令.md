---
id: nestseries31
slug: /nestseries31
title: 31-Prisma的全部命令
date: 2002-09-26
authors: 鲸落
tags: [Nest]
keywords: [Nest]
---

过一遍 Prisma 的全部命令。

```
npx prisma -h
```

![](31-Prisma的全部命令.assets/8d4303e562914ed4b5a96c870236f787tplv-k3u1fbpfcp-jj-mark0000q75.png)

有这些：

- init：创建 schema 文件

- generate： 根据 shcema 文件生成 client 代码

- db：同步数据库和 schema

- migrate：生成数据表结构更新的 sql 文件

- studio：用于 CRUD 的图形化界面

- validate：检查 schema 文件的语法错误

- format：格式化 schema 文件

- version：版本信息




先创建个新项目：

```
mkdir prisma-all-command
cd prisma-all-command
npm init -y
```

全局安装 prisma，这个是命令行工具的包：`npm install -g prisma`



## prisma init

首先来试一下 init 命令：

![](31-Prisma的全部命令.assets/5cda9096e9424c8ba9b052b1a8cd6debtplv-k3u1fbpfcp-jj-mark0000q75.png)

这个就是创建 schema 文件的，可以指定连接的 database，或者指定 url。

我们试一下：`prisma init`

![](31-Prisma的全部命令.assets/803a110c492a4c5bbd5320fa958a7a2dtplv-k3u1fbpfcp-jj-mark0000q75.png)

执行 init 命令后生成了 prisma/shcema.prisma 和 .env 文件：

![](31-Prisma的全部命令.assets/a1ea30a82f614f0788dcc0f4feb1ef93tplv-k3u1fbpfcp-jj-mark0000q75.png)

![](31-Prisma的全部命令.assets/ab0670632c5d4b9e9dde8b31980f57e1tplv-k3u1fbpfcp-jj-mark0000q75.png)

包含了 db provider，也就是连接的数据库，以及连接的 url：

![](31-Prisma的全部命令.assets/5ff37b1eb71845b4954ac732351274fatplv-k3u1fbpfcp-jj-mark0000q75.png)

![](31-Prisma的全部命令.assets/ca9dccf4f98b4482bd99091a38cb9694tplv-k3u1fbpfcp-jj-mark0000q75.png)

删掉这俩文件，重新生成：`prisma init --datasource-provider mysql`

这样生成的就是连接 mysql 的 provider 和 url 了：

![](31-Prisma的全部命令.assets/a9e42e14e6e24405b187215b17f7ffa8tplv-k3u1fbpfcp-jj-mark0000q75.png)

![](31-Prisma的全部命令.assets/9ca1667c732a49beb7e5b6ef45f3e623tplv-k3u1fbpfcp-jj-mark0000q75.png)

其实就是改这两处的字符串，prisma init 之后自己改也行。

再删掉这俩文件，我们重新生成。

```
prisma init --url mysql://root:guang@localhost:3306/prisma_test
```

这次指定连接字符串。

可以看到，provider 会根据你指定的 url 来识别，并且 .env 里的 url 就是我们传入的：

![](31-Prisma的全部命令.assets/58d4c30da19f465a859912b080bea712tplv-k3u1fbpfcp-jj-mark0000q75.png)

![](31-Prisma的全部命令.assets/a4a2fc484bcc4410807e8df4f9fdba68tplv-k3u1fbpfcp-jj-mark0000q75.png)



## prisma db

创建完 schema 文件，如何定义 model 呢？

其实 init 命令的打印提示了：

![](31-Prisma的全部命令.assets/0686752fafa743b6a8f676d266c09f30tplv-k3u1fbpfcp-jj-mark0000q75.png)



###  prisma db pull

你可以执行 prisma db pull 把数据库里的表同步到 schema 文件。

我们试一下：`prisma db pull`

![](31-Prisma的全部命令.assets/51bf4749e5014463bec0b72e62d4a31dtplv-k3u1fbpfcp-jj-mark0000q75.png)

提示发现了 2 个 model 并写入了 schema 文件。

现在连接的 prisma_test 数据库里是有这两个表的：

![](31-Prisma的全部命令.assets/5ed443a246eb42cab0d33ffbc8d0260ctplv-k3u1fbpfcp-jj-mark0000q75.png)

生成的 model 定义是这样的：

![](31-Prisma的全部命令.assets/b66238684b3442a09d700a27016361c3tplv-k3u1fbpfcp-jj-mark0000q75.png)

其中，@@index 是定义索引，这里定义了 authorId 的外键索引。

此外，db 命令还有别的功能：

```
prisma db -h
```

![](31-Prisma的全部命令.assets/a32adf5922464877b0adf1307e880dddtplv-k3u1fbpfcp-jj-mark0000q75.png)



### prisma db push

试下 prisma db push 命令：

首先在 mysql workbench 里把这两个表删掉：

![](31-Prisma的全部命令.assets/71913e8985064aa99ea3b2ef1bc43c67tplv-k3u1fbpfcp-jj-mark0000q75.png)

然后执行 db push：`prisma db push`

![](31-Prisma的全部命令.assets/677514acfbd848b99bdd602398c6d539tplv-k3u1fbpfcp-jj-mark0000q75.png)

提示同步到了 database，并且生成了 client 代码。

在 mysql workbench 里可以看到新的表：

![](31-Prisma的全部命令.assets/98b31be7183d4f06a77085b7d6ecc220tplv-k3u1fbpfcp-jj-mark0000q75.png)



### prisma db seed

seed 命令是执行脚本插入初始数据到数据库。

我们用 ts 来写，先安装相关依赖：

```
npm install typescript ts-node @types/node --save-dev
```

创建 tsconfig.json：`npx tsc --init`

然后写下初始化脚本 prisma/seed.ts

```javascript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: [
    {
      emit: 'stdout',
      level: 'query'
    },
  ],
});

async function main() {
    const user = await prisma.user.create({
        data: {
            name: '东东东',
            email: 'dongdong@dong.com',
            Post: {
                create: [
                    {
                        title: 'aaa',
                        content: 'aaaa'
                    },
                    {
                        title: 'bbb',
                        content: 'bbbb'
                    }
                ]
            },
        },
    })
    console.log(user)
}

main();
```

在 package.json 添加 seed 命令的配置：

![](31-Prisma的全部命令.assets/87217c1c49bf4913893345662f6f6be5tplv-k3u1fbpfcp-jj-mark0000q75.png)

```json
"prisma": {
    "seed": "npx ts-node prisma/seed.ts"
},
```

然后执行 seed：`prisma db seed`

![image.png](31-Prisma的全部命令.assets/9b961266c00740a9919edc4808f23f78tplv-k3u1fbpfcp-jj-mark0000q75.png)

在 mysql workbench 里可以看到数据被正确插入了：

![](31-Prisma的全部命令.assets/b16e1310a2934ddab9d9484737eea28dtplv-k3u1fbpfcp-jj-mark0000q75.png)

![](31-Prisma的全部命令.assets/0ce6c95394ab4be2bdd14ec036c50771tplv-k3u1fbpfcp-jj-mark0000q75.png)

其实 seed 命令就是把跑脚本的过程封装了一下，和直接用 ts-node 跑没啥区别。



### prisma db execute

然后是 prisma db execute，这个是用来执行 sql 的。

比如我写一个 prisma/test.sql 的文件：

```sql
delete from Post WHERE id = 2;
```

然后执行 execute：

```
prisma db execute --file prisma/test.sql --schema prisma/schema.prisma
```

这里 --file 就是指定 sql 文件的。

而 --schema 指定 schema 文件，主要是从中拿到数据库连接信息。

![](31-Prisma的全部命令.assets/740213f0e2fb44ad872f142604d8153dtplv-k3u1fbpfcp-jj-mark0000q75.png)

然后去 mysql workbench 里看一下，确实 id 为 2 的 Post 数据没有了：

![](31-Prisma的全部命令.assets/cd48653b11a34700b6c1004d30133445tplv-k3u1fbpfcp-jj-mark0000q75.png)

这就是 db 的 4 个命令。



## prisma migrate

mirgrate 是迁移的意思，在这里是指表的结构变化。

prisma migrate 有这些子命令：

![](31-Prisma的全部命令.assets/ec74ce5adfa74ac8938f8e25d9785c2ftplv-k3u1fbpfcp-jj-mark0000q75.png)

我们分别来看一下。



### prisma migrate dev

首先是 prisma migrate dev。

这个我们前面用过，它会根据 schema 的变化生成 sql 文件，并执行这个 sql，还会生成 client 代码。

```
prisma migrate dev --name init
```

因为之前创建过表，并且有数据。

它会提示是否要 reset：

![](31-Prisma的全部命令.assets/ac08e229620d4630b561324018f442e8tplv-k3u1fbpfcp-jj-mark0000q75.png)

选择是，会应用这次 mirgration，生成 sql 文件：

![](31-Prisma的全部命令.assets/e7fa4cf793f34ea4aa932145689ac945tplv-k3u1fbpfcp-jj-mark0000q75.png)

并且会生成 client 代码，而且会自动执行 prisma db seed，插入初始化数据。

![](31-Prisma的全部命令.assets/504d374d37e04c2f81527b7f7220af53tplv-k3u1fbpfcp-jj-mark0000q75.png)

![](31-Prisma的全部命令.assets/6da5ff447888459dbb5f9aa2635a5dcdtplv-k3u1fbpfcp-jj-mark0000q75.png)

这样就既创建了表，又插入了初始数据，还生成了 client。

我们开发的时候经常用这个命令。

在 prisma/migrations 下会保存这次 migration 的 sql 文件。

目录名是 “年月日时分秒_名字” 的格式：

![](31-Prisma的全部命令.assets/1d2e09eb5e92415190ab5d9543cf752ctplv-k3u1fbpfcp-jj-mark0000q75.png)

那如果我们改一下 schema 文件，再次执行 migrate dev 呢？

在 Post 的 model 定义里添加 tag 字段：

![](31-Prisma的全部命令.assets/966dd7e9f05844f59ec7a21d5a48d0d9tplv-k3u1fbpfcp-jj-mark0000q75.png)

```
tag       String  @default("")
```

然后 migrate dev：

```
prisma migrate dev --name age-field
```

![](31-Prisma的全部命令.assets/60aeda069c8d49e1b6bc4ca96bc34e4atplv-k3u1fbpfcp-jj-mark0000q75.png)

这次生成的 sql 只包含了修改表结构的：

![](31-Prisma的全部命令.assets/263be9c0f79642c7bf1ccae880a7e885tplv-k3u1fbpfcp-jj-mark0000q75.png)

在数据库中有个 _prisma_migrations 表，记录着数据库 migration 的历史：

![](31-Prisma的全部命令.assets/966c50e637734075885ac7c1d1aa22a9tplv-k3u1fbpfcp-jj-mark0000q75.png)

如果把这个表删掉，再次 mirgate dev 就会有前面的是否 reset 的提示了：

![](31-Prisma的全部命令.assets/ac08e229620d4630b561324018f442e8tplv-k3u1fbpfcp-jj-mark0000q75.png)



### prisma migrate reset

如果你想手动触发reset，可以用 reset 命令：

![](31-Prisma的全部命令.assets/25f8c02994ec4444a07c9b6473fa66b0tplv-k3u1fbpfcp-jj-mark0000q75.png)

它会清空数据然后执行所有 migration

```
prisma migrate reset
```

![](31-Prisma的全部命令.assets/d073ff389c6e4fe1ab01db0e92ee96abtplv-k3u1fbpfcp-jj-mark0000q75.png)

会提示会丢失数据，确认后就会重置表，然后执行所有 migration：

![](31-Prisma的全部命令.assets/3f8338316afb484a99daf135a8a867d2tplv-k3u1fbpfcp-jj-mark0000q75.png)

还会生成 client 代码，并且执行 prisma db seed 来初始化数据。



## prisma generate

generate 命令只是用来生成 client 代码的，他并不会同步数据库：

![](31-Prisma的全部命令.assets/389524ff126640cc94dba4aa11266dc7tplv-k3u1fbpfcp-jj-mark0000q75.png)

只是根据 schema 定义，在 node_modules/@prisma/client 下生成代码，用于 CRUD。



## prisma studio

这个是可以方便 CRUD 数据的图形界面：`prisma studio`

![](31-Prisma的全部命令.assets/71f520804d274b1885d893700770255atplv-k3u1fbpfcp-jj-mark0000q75.png)

选择一个 model：

![](31-Prisma的全部命令.assets/48c5d2f35a2342c280bb3a89a2316f17tplv-k3u1fbpfcp-jj-mark0000q75.png)

会展示它的所有数据：

![](31-Prisma的全部命令.assets/0c465185b0cb470c868e6ed6c39c1e6dtplv-k3u1fbpfcp-jj-mark0000q75.png)

可以编辑记录：
![](31-Prisma的全部命令.assets/14fbcdeb5cab47ab86947c781fceef91tplv-k3u1fbpfcp-jj-mark0000q75.png)

删除记录：
![](31-Prisma的全部命令.assets/2f54d499d21d4c90a4088ee4168568f2tplv-k3u1fbpfcp-jj-mark0000q75.png)

新增记录：
![](31-Prisma的全部命令.assets/c390aa8733ac4bc099a1499962396671tplv-k3u1fbpfcp-jj-mark0000q75.png)

不过一般我们都用 mysql workbench 来做。



## prisma validate

这个是用来检查 schema 文件是否有语法错误的：

![](31-Prisma的全部命令.assets/2b7ea663f0eb48f4ae030e46d0669fbetplv-k3u1fbpfcp-jj-mark0000q75.png)

比如我写错一个类型，然后执行 validate：`prisma validate`

会提示这里有错误：

![](31-Prisma的全部命令.assets/63ed6335516b4af299f59101ed1f2b38tplv-k3u1fbpfcp-jj-mark0000q75.png)

当然，我们安装了 prisma 的插件之后，可以直接在编辑器里看到这个错误：

![](31-Prisma的全部命令.assets/807848e678334c21b1cf05cd38ad9292tplv-k3u1fbpfcp-jj-mark0000q75.png)

就和 eslint 差不多。



## prisma format

这个是用来格式化 prisma 文件的：

![](31-Prisma的全部命令.assets/0d4efddbf59a4296aa70b850d535e503tplv-k3u1fbpfcp-jj-mark0000q75.gif)



当然，你安装了 prisma 的 vscode 插件之后，也可以直接用编辑器的 format：

![](31-Prisma的全部命令.assets/e4cedcab3cbc410cb54daf87cbf884bdtplv-k3u1fbpfcp-jj-mark0000q75.gif)



## prisma version

这个就是展示一些版本信息的，比较简单：

![](31-Prisma的全部命令.assets/9b7848d2360d44a49fa8f513bee2062etplv-k3u1fbpfcp-jj-mark0000q75.png)

案例代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/prisma-all-command)



## 补充

:::info 补充
**prisma migrate dev 与 prisma db push 区别**

`prisma migrate dev`：用于在开发环境中管理数据库的迁移。它的作用是生成和应用数据库迁移，从而同步数据库架构与 Prisma 数据模型（`schema.prisma`）中的定义

`prisma db push` 命令用于将 Prisma 模式（`schema.prisma` 文件中的数据模型）直接推送到数据库，而 **不生成迁移文件**。这意味着，它会立即根据当前的 Prisma 数据模型更改数据库架构，但不会生成类似于 `prisma/migrations` 目录下的迁移文件，也不会创建用于版本控制的迁移历史



**区别**：

| 特性                   | `npx prisma db push`                               | `npx prisma migrate dev`                               |
| ---------------------- | -------------------------------------------------- | ------------------------------------------------------ |
| **生成迁移文件**       | 不生成迁移文件                                     | 会生成迁移文件，记录数据库架构变化的历史               |
| **适用场景**           | 快速同步数据库架构，适用于不需要版本控制的开发场景 | 需要管理数据库架构变更历史，适用于有版本控制需求的项目 |
| **是否考虑迁移历史**   | 不考虑迁移历史                                     | 考虑迁移历史，支持版本控制和回滚功能                   |
| **数据库操作**         | 直接同步数据库结构                                 | 生成迁移并将其应用到数据库                             |
| **生成 Prisma 客户端** | 不会重新生成 Prisma 客户端                         | 会重新生成 Prisma 客户端，确保客户端与数据库结构同步   |

- 使用 `npx prisma db push` 当你 **不关心迁移文件**，只是快速将数据库结构与 Prisma 模式同步时。
- 使用 `npx prisma migrate dev` 当你需要 **管理数据库架构的迁移历史**，以及需要版本控制和回滚功能时。

`db push` 是快速同步的命令，适合小规模、快速迭代的开发场景，而 `migrate dev` 则更适用于需要长期维护和版本控制数据库架构的项目。

:::





## 总结

这节我们学习了 prisma 的全部命令：

- init：创建 schema 文件

- generate： 根据 shcema 文件生成 client 代码

- db：同步数据库和 schema

- migrate：生成数据表结构更新的 sql 文件

- studio：用于 CRUD 的图形化界面

- validate：检查 schema 文件的语法错误

- format：格式化 schema 文件

- version：版本信息

其中，prisma init、prisma migrate dev 是最常用的。

prisma db pull、prisma db push 也可以方便的用来做 schema 和数据库的同步。

常用的命令也没有几个，多拥几遍就熟了。