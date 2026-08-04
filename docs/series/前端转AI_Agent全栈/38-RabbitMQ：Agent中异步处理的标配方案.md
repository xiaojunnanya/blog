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

解析完文档得到Markdown后，往 MQ发一条消息

两个消费者收到消息后，分别做不同的处理。

RabbitMQ的架构是这样的

![image-20260804162406570](https://img.xiaojunnan.cn/image-20260804162406570.png)

Producer 和Consumer分别是生产者和消费者。

Connection是客户端与RabbitMQ服务之间的TCP 物理连接。

我们不会每次收发消息都新建独立Connection，因为TCP连接创建开销较高;

所以在一条Connection 内部划分多条逻辑通道，也就是Channel。

生产者和消费者都是绑定到具体的channel 来收发消息。

Queue队列，是真正存放消息的容器，消息最终存在队列中等待消费者处理。

整套承载消息接收、路由、转发的RabbitMQ服务实例，统称为Broker。

至于Exchange，这个是把消息放到不同的队列里用的，叫做交换机。

它负责把我们发的消息按照规则放入不同的Queue里

Exchange主要有4种：

- fanout:把消息放到这个交换机的所有 Queue
- direct:把消息放到交换机的指定key的队列
- topic:把消息放到交换机的指定key的队列，支持模糊匹配
- headers:把消息放到交换机的满足某些header 的队列



我们分别来试一下

## 试一下

```yaml
services:
  rabbitmq:
    image: rabbitmq:3.13-management
    container_name: rabbitmq
    restart: always
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: Admin@123456
      RABBITMQ_DEFAULT_VHOST: /
    volumes:
      - ./rabbitmq_data:/var/lib/rabbitmq
```

安装依赖：`pnpm install amqplib`



### direct类型

先跑一下direct类型交换机(代码从仓库复制)

https://github.com/QuarkGluonPlasma/ai-agent-course-code/tree/main/rabbitmq-test/src/direct

这种交换机，会根据消息的routingkey把消息传给精确匹配routingkey 的队列

![image-20260804164134201](https://img.xiaojunnan.cn/image-20260804164134201.png)

### fanout类型

https://github.com/QuarkGluonPlasma/ai-agent-course-code/tree/main/rabbitmq-test/src/fanout

这种交换机，不看routingkey，会把收到的消息广播到所有绑定的队列

![image-20260804164254375](https://img.xiaojunnan.cn/image-20260804164254375.png)



### topic类型

https://github.com/QuarkGluonPlasma/ai-agent-course-code/tree/main/rabbitmq-test/src/topic

这个类型的交换机是根据通配符类匹配

*是匹配任意一个段

#是匹配0到任意个段

![image-20260804164316220](https://img.xiaojunnan.cn/image-20260804164316220.png)



### handers类型

https://github.com/QuarkGluonPlasma/ai-agent-course-code/tree/main/rabbitmq-test/src/headers

headers 类型的交换机不再看 routing key，而是根据headers 来匹配

![image-20260804165110603](https://img.xiaojunnan.cn/image-20260804165110603.png)



### 总结

![](https://img.xiaojunnan.cn/image-20260804164350008.png)



## 总结

这节我们学了RabbitMQ。

后端的异步任务基本都是通过mg来做。

生产者往队列里存入消息，消费者取出来处理，整个过程是异步的。

我们学了 RabbitMQ 的架构, 包括 Connection、 Channel、 Exchange、 Queue、Producer、Consumer 这些概念

以及4 种交换机类型：direct、topic、fanout、headers

后面Agent应用涉及到异步的场景，都会用RabbitMQ来实现。

























