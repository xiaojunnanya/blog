---
id: aiagent09
slug: /aiagent09
title: 09-向量数据库Milvus：做 AI Agent开发必备技术
date: 2002-09-26
authors: 鲸落
tags: [AI]
keywords: [AI]
---



## 前言

前面我们实现了 RAG，文档向量化放到向量数据库，每次查询根据向量化的 query 去数据库做相似度匹配，查出相关文档放到 prompt 里给大模型，大模型来生成回答。

但之前向量数据库是放在内存里的：`import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory"`

而实际上 AI Agent 产品都会用 Milvus 这种向量数据库。

就像 web 应用会把数据存在 mysql 里，基于对数据的增删改查实现各种业务功能。然后根据 id 或者关键词去关联查询一系列表的数据。

而 AI Agent 应用会把知识、记忆放在 Milvus 数据库中，基于对知识的检索、增删改实现各种功能。

不同的是这里涉及到向量化，就需要嵌入模型，比如检索、新增、修改。但是删除直接根据 id，不需要嵌入模型。

那把数据存在 MySQL 里，和现在存在 Milvus 里有什么不同么？

你在 MySQL 里查询数据，只能用 id、关键词匹配。

而在 Milvus 里查询知识，是根据语义匹配的，你可以用自然语言来检索。

这两种功能一般都需要。

比如你做了一个 AI 日记本：

- 查询日记列表可以从 MySQL 来查，不走 AI
- 查询“我哪几天的日记心情比较好”，就要去 Milvus 做向量相似度检索，然后交给 AI 生成回答

所以一般会做 mysql 和 milvus 的双写，也就是同时对两个数据库做增删改，保持数据同步。

这节我们先学下 Milvus，做下增删改查，跑通基于 Mivlus 的 RAG 流程。



## Milvus

### docker 下载

本地跑 Milvus 需要安装 docker：https://www.docker.com/。

点击 do'wnload docker desktop，选择电脑的系统下载

下载后安装，会有桌面端和命令行工具。

打开命令行输入docker，如果命令可用了，就代表装好了。

打开桌面端：

- images 是下载的镜像列表。
- containers 是镜像跑起来的容器列表。

这里对 docker 不熟也没关系，下节会讲，这节重点是 mivlus。

电脑中创建一个目录用来放 milvus 的 docker 配置文件和数据：

```
mkdir milvus
cd milvus
```

从这里下载 milvus 的 docker compose 配置文件：https://github.com/milvus-io/milvus/releases，点击Assets，找到[milvus-standalone-docker-compose.yml](https://github.com/milvus-io/milvus/releases/download/v2.6.11/milvus-standalone-docker-compose.yml) 点击下载

把配置文件拿到刚才这个目录，跑一下 docker compose：`docker compose -f ./milvus-standalone-docker-compose.yml up -d`

用到的镜像根据配置文件自动下载：







