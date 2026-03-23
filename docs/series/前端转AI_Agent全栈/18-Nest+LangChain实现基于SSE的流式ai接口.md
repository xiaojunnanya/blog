---
id: aiagent18
slug: /aiagent18
title: 18-Nest + LangChain 实现基于 SSE 的流式 ai 接口
date: 2002-09-26
authors: 鲸落
tags: [AI]
keywords: [AI]
---







## 前言

前面学了 LangChain 的各种功能，但都是在 Node.js 脚本里跑的，而实际上大多数 Agent 都是跑在后端服务里。

比如你和豆包聊天的时候，它会调用 AI 接口，把你的问题传给后端，后端流式返回生成的回答。

这节我们就来学一下 LangChain 和后端框架结合，开发 ai 接口。

我们用 Nest 这个后端框架

我们创建个项目：

```js
npm install -g @nestjs/cli

nest new hello-nest-langchain
```

具体关于nest这里就不介绍了



## 使用

安装`pnpm install @langchain/core @langchain/openai`

生成一个 ai 的模块：`nest g res ai --no-spec`

然后在 AiService 里调用 langchain 创建一个 chain：

```js
import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import type { Runnable } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';

@Injectable()
export class AiService {
  private readonly chain: Runnable;

  constructor() {
    const prompt = PromptTemplate.fromTemplate('请回答以下问题：\n\n{query}');
    const model = new ChatOpenAI({
      temperature: 0.7,
      modelName: 'qwen-plus',
      apiKey: 'sk-xxx',
      configuration: {
        baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      },
    });
    this.chain = prompt.pipe(model).pipe(new StringOutputParser());
  }

  async runChain(query: string): Promise<string> {
    return this.chain.invoke({ query });
  }
}
```

在构造器里创建 ChatModel、chain 避免重复创建。（这里 apikey 之类的先写在代码里，后面优化）

runChain 方法基于传入的参数调用 chain

然后在 AiController 里加一个路由：

```js
import { Controller, Get, Query } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('chat')
  async chat(@Query('query') query: string) {
    const answer = await this.aiService.runChain(query);
    return { answer };
  }
}
```

接收 query 参数，调用大模型来回答问题。

跑一下：`http://localhost:3000/ai/chat?query=你好`



## 配置抽离

但现在有两个问题：

- 配置没有抽离
- 没有流式返回内容

配置的话用这个包：`pnpm install @nestjs/config`

在 AppModule 里引入 ConfigModule：

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiModule } from './ai/ai.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AiModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

它的作用就是读取 .env 配置文件，提供一个 service 来读配置。

isGlobal 设置为 true 就是全局模块，也就是不用 imports 就可以注入里面的 provider

这样我们就可以根目录创建一个 .env 文件，和之前一样：

```
OPENAI_API_KEY=sk-xxx
OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
MODEL_NAME=qwen-plus
```

现在配置就可以用 ConfigService 动态读取了：

```ts
import { Inject, Injectable } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import type { Runnable } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  private readonly chain: Runnable;

  constructor(@Inject(ConfigService) configService: ConfigService) {
    const prompt = PromptTemplate.fromTemplate('请回答以下问题：\n\n{query}');
    const model = new ChatOpenAI({
      temperature: 0.7,
      modelName: configService.get('MODEL_NAME'),
      apiKey: configService.get('OPENAI_API_KEY'),
      configuration: {
        baseURL: configService.get('OPENAI_API_URL'),
      },
    });
    this.chain = prompt.pipe(model).pipe(new StringOutputParser());
  }

  async runChain(query: string): Promise<string> {
    return this.chain.invoke({ query });
  }
}
```



## 流式返回

实现流式返回，这种不断返回内容一般用 SSE（server-sent event） 来做

服务端返回的 Content-Type 是 text/event-stream，这是一个流，可以多次返回内容。

在 AiService 里加一个流式的接口：

```ts
async *streamChain(query: string): AsyncGenerator<string> {
    const stream = await this.chain.stream({ query });
    for await (const chunk of stream) {
      yield chunk;
    }
  }
```

调用 chain 的 stream 方法，流式返回内容。

这里用到了 js 的生成器语法，也就是方法名那里标个*，然后 yield 不断异步返回内容。

你没用过这个语法也没关系，理解意思就行，过一遍就会了。

然后在 AiController 里调用下这个方法，加一个 chat/stream 接口：

```js
import { Controller, Get, Query, Sse } from '@nestjs/common';
import { AiService } from './ai.service';
import { from, map, Observable } from 'rxjs';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('chat')
  async chat(@Query('query') query: string) {
    const answer = await this.aiService.runChain(query);
    return { answer };
  }

  @Sse('chat/stream')
  chatStream(@Query('query') query: string): Observable<{ data: string }> {
    return from(this.aiService.streamChain(query)).pipe(
      map((chunk) => ({ data: chunk })),
    );
  }
}
```

声明接口是 sse 的，然后创建一个 Observable，从 service 的返回流里读取内容，用 map 转成有 data 属性的对象

这个是 rxjs 的写法，Nest 用 rxjs 来处理异步流。

其实和 LCEL 的声明式写法思路一样，就是声明对这个流做什么处理

跑一下，可以看到，通过 sse 的接口就可以流式的返回内容了。

我们写一下前端代码，有的同学可能不知道 sse 的接口怎么调用；

```js
btn.addEventListener("click", () => {
        const baseUrl = apiUrlInput.value.replace(/\/$/, "");
        const q = queryInput.value.trim();
        if (!q) {
          status.textContent = "请输入问题";
          return;
        }

        const url = `${baseUrl}/ai/chat/stream?query=${encodeURIComponent(q)}`;
        output.textContent = "";
        btn.disabled = true;
        status.textContent = "连接中...";

        const eventSource = new EventSource(url);

        eventSource.onmessage = ({ data }) => {
          output.textContent += data;
          status.textContent = "接收中...";
        };

        eventSource.onerror = () => {
          eventSource.close();
          btn.disabled = false;
          status.textContent = "连接已结束";
        };

        eventSource.addEventListener("done", () => {
          eventSource.close();
          btn.disabled = false;
          status.textContent = "完成";
        });
      });
```

就是调用 EventSource 的 api，在 onmessage 回调里接收 data 就可以了。



## **总结**

这节我们学了 Nest + LangChain 来开发 ai 接口。

Nest 是一个 Node.js 生态最主流的后端开发框架，提供了 MVC、DI 等特性。

- 通过 module 来拆分代码，每个 module 包含 service、controller 等。
- 实现了 DI 依赖注入，通过 @Injectable 声明的 Service，通过 useFactory 创建的对象，都可以作为 provider 来注入。

注入方式包含构造器注入，也就是声明在参数里，以及属性注入，也就是 @Inject 的方式注入

我们基于 LangChain 写了几个 ai 接口：

ChatModel 用 useFactory 创建 provider 来注入。

chain 定义在构造器里，避免重复创建。

同步和流式分别调用 invoke 和 stream 方法。

在 service 里用生成器语法异步返回内容，然后在 controller 创建了一个 sse 的接口，用 rxjs 的 Observable 返回流式数据。

前端代码用 EventSource 来监听 sse 的 message 事件，拿到流式返回的数据。

SSE 在 ai 接口流式返回内容方面是最常用的方式，后面会经常用到。









