---
id: aiagent41
slug: /aiagent41
title: 41-LangFuse：开源可内网部署的Agent全链路监测方案
date: 2002-09-26
authors: 鲸落
tags: [AI]
keywords: [AI]
---



## 前言

前面学了用LangSmith做Agent的全链路监测，以及跑效果评估的实验。

它是线上的服务，不用自己部署，直接接入就行。

但是，本地调试用LangSmith没问题，很方便，配几个环境变量就行，LangChain、LangGraph开箱即用。

那如果是线上呢?

LangSmith线上服务是收费的。

如果你想用免费方案，那就得用LangFuse了，它是开源的，可以自己部署。

![image-20260804211525895](https://img.xiaojunnan.cn/image-20260804211525895.png)

而且它也不绑定具体框架，但各种 Agent框架都很容易集成。

它有cloud开箱即用版，和自己部署，两种方式。



## cloud版

https://cloud.langfuse.com/

和LangSmith 功能差不多

创建apikey在项目里配置一下

我们跑一下 deepagents然后用 langfuse来收集下信息：

【视频】

用OpenTelemetry做埋点、函数插桩，收集到的数据转成LangFuse的格式，上报服务
器，之后在平台就可以看到trace的链路了。

然后来跑一下Agent 评估:

【视频】

流程和LangSmith一样:

- 创建数据集dataset
- 创建评估器 evaluator
- 跑实验experiment

然后我们跑一下，在langfuse平台看一下：

【视频】



## 本地部署

刚才用的是cloud，然后我们本地部署一下，不然生产环境也是要收费的:
根目录跑一下这个：

```
curl -o docker-compose.yml https://raw.githubusercontent.com/langfuse/langfuse/main/docker-compose.yml
```

【视频】

用一下

【视频】

这样，只要改一下环境变量，代码一行不用改，tracing、evaluate等就都收集到了我们自己部署的langfuse服务里了。

然后来看一下这个langfuse服务的架构

![image-20260804215343222](https://img.xiaojunnan.cn/image-20260804215343222.png)

大概这样的关系：
![image-20260804215359477](https://img.xiaojunnan.cn/image-20260804215359477.png)

- langfuse web是web服务，接受请求，把消息放到redis 的消息队列
- worker用来消费redis消息队列的消息，做具体的处理
- redis这里主要用作消息队列，再就是缓存
- postgresql存各种业务数据
- minio存文件
- clickhouse 存tracing等数据，用于查询分析

最后来看一下monitor：

【视频】

它主要是一些指标的统计，再就是告警，可以当某个指标达到阈值的时候，通过slack或者webhook之类的通知你。



## 对比LangSmith和LangFuse

### 部署与成本

LangSmith闭源产品，默认SaaS托管。

零运维、按量收费，高tracing量生产环境成本高;

企业版(Enterprise付费签约)提供私有化自托管方案，但成本极高(最低门槛10万美金/年起)

LangFuse支持Cloud版+自建开源部署，生产环境可零成本、数据完全自主可控，无用量扣费压力



### 框架适配性

LangSmith 深度绑定 LangChain/LangGraph，原生零配置，其他框架兼容差;

LangFuse 基于OpenTelemetry埋点，全框架通用，适配任意Agent 框架，无技术绑定



### 总结

核心就是上面两个区别。

![image-20260804215807514](https://img.xiaojunnan.cn/image-20260804215807514.png)



## 总结

LangSmith 用起来简单，LangChain生态配几个环境变量就能接入。

但是它是闭源saas，生产环境按量付费比较贵

虽然支持私有化部署，但门槛高，最低10万美金/年。

所以LangFuse是一个很好的开源替代方案，支持cloud和本地 docker compose 跑。

它基于 OpenTelemetry自动埋点收集数据上报，所以很容易支持各种 Agent 框架。

我们跑了 Tracing,创建了数据集 Dataset 和评估器Evauator 然后跑了实验Experiment

功能和 LangSmith 差不多。

后续我们本地调试还是 LangSmith，但要在生产环境跑的Agent 都会用LangFuse。















