---
id: aiagent37
slug: /aiagent37
title: 37-多模态与OSS前端直传实战：AI画板
date: 2002-09-26
authors: 鲸落
tags: [AI]
keywords: [AI]
---



## 前言

之前我们的Agent都是输入文字、返回文字。

但平时用的很多Agent都支持输入图片、返回图片

这是怎么实现的呢?

首先模型要用支持多模态的

【视频】

qwen3.7-plus，输入支持文字、图片、视频，输出是文字

![image-20260804153132287](https://img.xiaojunnan.cn/image-20260804153132287.png)

![image-20260804153148191](https://img.xiaojunnan.cn/image-20260804153148191.png)

然后我们要用 OSS来存储图片，拿到url给大模型

![image-20260804153524755](https://img.xiaojunnan.cn/image-20260804153524755.png)

基于多模态的大模型+OSS，我们就可以实现支持多模态的Agent



## 试一下

`pnpm install @langchain/core @langchain/openai dashscope-sdk-official dotenv ali-oss`

创建 src/image-understanding.mjs

```js
/**
 * 图像理解 — qwen-vl-plus
 * DashScope OpenAI 兼容接口 + ChatOpenAI
 */
import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";

const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  model: "qwen-vl-plus",
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
  },
});

const response = await model.invoke([
  new HumanMessage({
    content: [
      { type: "text", text: "详细描述这张图片的内容" },
      {
        type: "image_url",
        image_url: {
          url: "https://dashscope.oss-cn-beijing.aliyuncs.com/images/dog_and_girl.jpeg",
        },
      },
    ],
  }),
]);

console.log("model: qwen-vl-plus");
console.log(response.content);
```

其他案例：https://github.com/QuarkGluonPlasma/ai-agent-course-code/blob/main/multi-modal-agent/src/image-understanding.mjs

跑一下：

【视频】

兼容 openai 协议的大模型就可以用 ChatOpenAI来调用，其余的直接用 dashscope 的SDK来调。

这个过程涉及到了OSS，传入的图片、视频、音频url、生成的视频、音频、图片的保存等。

![image-20260804154306497](https://img.xiaojunnan.cn/image-20260804154306497.png)

我们来完整实现下这个流程。

生成图片传到OSS直接后端做就行，返回oss的url

但是用户上传视频，有必要先传到我们服务器，再传到oss么?

没必要，这种可以用OSS直传。

![image-20260804154446014](https://img.xiaojunnan.cn/image-20260804154446014.png)

阿里云文档里有写:

https://help.aliyun.com/zh/oss/user-guide/uploading-objects-to-oss-directly-from-clients/



## AI 画板

多模态大模型调用、前端直传OSS都跑通了，我们来做一个小实战：AI 画板。

![image-20260804154832328](https://img.xiaojunnan.cn/image-20260804154832328.png)

代码：https://github.com/QuarkGluonPlasma/ai-agent-course-code/tree/main/ai-canvas



## 总结

Agent很多都支持多模态，比如上传图片识别、生成图片、视频等。

我们用了一下多模态的大模型，阿里的模型有的不支持openai协议，需要用dashscope的sdk来调用。

生成的图片、视频等会放到临时的oss，有效期大概24小时，我们要传到自己的oss持久保存。

我们实现了前端直传 OSS，服务端只返回sts信息就可以了。

然后把多模态大模型与前端直传 oss做了一个综合的小实战：AI 画板。

前端直传OSS+多模态大模型，会免回经常用到。



























