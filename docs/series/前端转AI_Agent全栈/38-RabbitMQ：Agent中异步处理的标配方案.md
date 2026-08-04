---
id: aiagent38
slug: /aiagent38
title: 38-RabbitMQ：Agent中异步处理的标配方案
date: 2002-09-26
authors: 鲸落
tags: [AI]
keywords: [AI]
---



## 前言

RAG流程里，pdf、docx、pptx等各类文档上传后会解析为markdown格式

然后会分片存入向量数据库(比如Milvus)，会存入ElasticSearch做全文检索。

那解析的接口做向量化、ES存储，需要同步等它们完成么?

很明显没必要，这俩完全可以异步来做。

后端如果想做异步处理，一般都是用消息队列MQ，比如RabbitMQ

![image-20260804160654278](https://img.xiaojunnan.cn/image-20260804160654278.png)























































