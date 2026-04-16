---
id: aiagent19
slug: /aiagent19
title: 19-Nest + tool 实现 OpenClaw 同款定时任务功能（上）
date: 2002-09-26
authors: 鲸落
tags: [AI]
keywords: [AI]
---

## 前言

定时任务是 Agent 常见功能。

比如你用豆包的时候：

你让它某个时间做某件事情。

它会调用定时任务的 tool 设置一个提醒，并且你可以单独管理所有的提醒。

OpenClaw 当然也有定时任务功能。

我们看下它是怎么实现的：

### OpenClaw 的实现

把 OpenClaw 的仓库代码下下来，让 ai 分析下：

![640 (1080×512)](./19-Nest+tool%E5%AE%9E%E7%8E%B0OpenClaw%E5%90%8C%E6%AC%BE%E5%AE%9A%E6%97%B6%E4%BB%BB%E5%8A%A1%E5%8A%9F%E8%83%BD%EF%BC%88%E4%B8%8A%EF%BC%89.assets/640.png)

可以看到，OpenClaw 的定时任务有两种：

- 可以创建定时任务，传入文本，到时间会启动一个 Agent Loop 来执行
- 心跳机制定期主动做一些事情

到时间后跑一个 agent loop 循环调用 tool call 做事情：

![图片](./19-Nest+tool%E5%AE%9E%E7%8E%B0OpenClaw%E5%90%8C%E6%AC%BE%E5%AE%9A%E6%97%B6%E4%BB%BB%E5%8A%A1%E5%8A%9F%E8%83%BD%EF%BC%88%E4%B8%8A%EF%BC%89.assets/640-1774280666573-6.png)

它并没有把定时任务封装成 tool，但是有执行命令的 tool，所以绕了一层，也是一样：

![图片](./19-Nest+tool%E5%AE%9E%E7%8E%B0OpenClaw%E5%90%8C%E6%AC%BE%E5%AE%9A%E6%97%B6%E4%BB%BB%E5%8A%A1%E5%8A%9F%E8%83%BD%EF%BC%88%E4%B8%8A%EF%BC%89.assets/640-1774280678197-9.png)

### Nanobot 的实现

再来看下 Nanobot 的实现，它是 mini 版 OpenClaw

![图片](./19-Nest+tool%E5%AE%9E%E7%8E%B0OpenClaw%E5%90%8C%E6%AC%BE%E5%AE%9A%E6%97%B6%E4%BB%BB%E5%8A%A1%E5%8A%9F%E8%83%BD%EF%BC%88%E4%B8%8A%EF%BC%89.assets/640-1774280707369-12.png)

![图片](./19-Nest+tool%E5%AE%9E%E7%8E%B0OpenClaw%E5%90%8C%E6%AC%BE%E5%AE%9A%E6%97%B6%E4%BB%BB%E5%8A%A1%E5%8A%9F%E8%83%BD%EF%BC%88%E4%B8%8A%EF%BC%89.assets/640-1774280709691-15.png)

也就是这个流程：

![图片](./19-Nest+tool%E5%AE%9E%E7%8E%B0OpenClaw%E5%90%8C%E6%AC%BE%E5%AE%9A%E6%97%B6%E4%BB%BB%E5%8A%A1%E5%8A%9F%E8%83%BD%EF%BC%88%E4%B8%8A%EF%BC%89.assets/640-1774281017339-18.png)

既然各种 Agent 都有定时任务功能，那我们也按照这个方案实现一遍，后面可以集成到我们的 Agent 项目里。

## 使用

我们还在上一节的hello-nest-langchain中测试使用

---

暂停...

---
