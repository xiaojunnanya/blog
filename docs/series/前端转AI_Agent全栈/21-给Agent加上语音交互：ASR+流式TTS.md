---
id: aiagent21
slug: /aiagent21
title: 21-给 Agent 加上语音交互：ASR + 流式TTS
date: 2002-09-26
authors: 鲸落
tags: [AI]
keywords: [AI]
---

## 前言

我们常用的 Agent 都有语音功能。

语音输入会转成文字，大模型的回答会通过语音朗读。可以切换音色。

这种 STT（Speech To Text）语音转文字，TTS（Text To Speech）文字转语音基本是 Agent 开发必备技术了。

这节我们就来学一下语音相关技术，实现豆包同款功能。

## 使用

### Demo

我们用腾讯云的语音（各家用法都差不多）。https://console.cloud.tencent.com/tts

这里创建一个密钥：https://console.cloud.tencent.com/cam/capi

然后你可以直接问右侧的ai大模型：给我语音转文字的示例代码，nodejs的

创建 `src/tts-test.mjs`

```js
import 'dotenv/config'
import tencentcloud from 'tencentcloud-sdk-nodejs-tts'
import fs from 'node:fs'

const secretId = process.env.SECRET_ID
const secretKey = process.env.SECRET_KEY

const TtsClient = tencentcloud.tts.v20190823.Client

const client = new TtsClient({
  credential: {
    secretId,
    secretKey,
  },
  region: 'ap-beijing',
  profile: {
    httpProfile: {
      endpoint: 'tts.tencentcloudapi.com',
    },
  },
})

const params = {
  Text: '下班路上，我还在为晚霞开心。突然电话响起：系统崩了。我的心一下揪紧，冲进办公室时几乎要绝望。可当大家一起排查、重启，屏幕终于恢复正常，我长长松了口气，笑着说：还好，我们没放弃。', // 要合成的文本
  SessionId: 'session-001',
  VoiceType: 502001, // 101007：智瑜（女声）
  Codec: 'mp3', // 指定输出格式为 mp3
}

client.TextToVoice(params).then(
  data => {
    // 返回的 Audio 字段是 Base64 编码的音频数据
    const audioBuffer = Buffer.from(data.Audio, 'base64')
    const outputPath = './output.mp3'

    fs.writeFile(outputPath, audioBuffer, err => {
      if (err) {
        console.error('保存文件失败：', err)
      } else {
        console.log('MP3 已保存至：', outputPath)
      }
    })
  },
  err => {
    console.error('合成失败：', err)
  },
)
```

调用文字转语音 tts 功能，传入参数，返回的 base64 字符串转为 buffer 写入文件。

这个音色 id 从这里找：https://cloud.tencent.com/document/product/1073/92668

安装用到的包：`pnpm install tencentcloud-sdk-nodejs-tts`

跑一下可以发现多了一个output.mp3的文件

### 流式语音合成

但这种直接传入全部文本生成语音的方式，显然不太适合我们的场景。

比如豆包流式返回回答，语音也是流式播放的。

这种就需要用流式语音合成接口了，它是 websocket 的：https://cloud.tencent.com/document/product/1073/108595

可以再问一下这个页面右侧小人图标的ai模型：`根据这个页面，给我生成调用流式文本语音合成的nodejs代码`

创建 `src/streaming-tts-test.mjs`

```js
import 'dotenv/config'
import WebSocket from 'ws'
import crypto from 'node:crypto'
import fs from 'node:fs'

const SECRET_ID = process.env.SECRET_ID
const SECRET_KEY = process.env.SECRET_KEY
const APP_ID = process.env.APP_ID

const VOICE_TYPE = 101001
const OUTPUT_FILE = 'output3.mp3'
const TEXT_INTERVAL_MS = 3000
const TEXTS = [
  '傍晚我还在为晚霞开心，',
  '突然接到电话说系统崩了，',
  '我心里一沉冲回办公室，',
  '好在大家一起排查后终于恢复，',
  '我长长松了口气。',
]

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

function buildWsUrl() {
  const now = Math.floor(Date.now() / 1000)
  const sessionId = `session_${now}_${Math.random().toString(36).slice(2)}`

  const params = {
    Action: 'TextToStreamAudioWSv2',
    AppId: parseInt(APP_ID),
    Codec: 'mp3',
    Expired: now + 3600,
    SampleRate: 16000,
    SecretId: SECRET_ID,
    SessionId: sessionId,
    Speed: 0,
    Timestamp: now,
    VoiceType: VOICE_TYPE,
    Volume: 5,
  }

  const sortedKeys = Object.keys(params).sort()
  const signStr = sortedKeys.map(k => `${k}=${params[k]}`).join('&')
  const rawStr = `GETtts.cloud.tencent.com/stream_wsv2?${signStr}`
  const signature = crypto
    .createHmac('sha1', SECRET_KEY)
    .update(rawStr)
    .digest('base64')
  const searchParams = new URLSearchParams({
    ...params,
    Signature: signature,
  })

  return {
    sessionId,
    url: `wss://tts.cloud.tencent.com/stream_wsv2?${searchParams.toString()}`,
  }
}

async function sendTexts(ws, sessionId) {
  for (let i = 0; i < TEXTS.length; i++) {
    ws.send(
      JSON.stringify({
        session_id: sessionId,
        message_id: `msg_${i}`,
        action: 'ACTION_SYNTHESIS',
        data: TEXTS[i],
      }),
    )
    console.log(`[文本] 已发送: ${TEXTS[i]}`)
    if (i < TEXTS.length - 1) await sleep(TEXT_INTERVAL_MS)
  }
  ws.send(JSON.stringify({ session_id: sessionId, action: 'ACTION_COMPLETE' }))
  console.log('[文本] 已发送 ACTION_COMPLETE')
}

function streamTTS() {
  if (!SECRET_ID || !SECRET_KEY || !APP_ID) {
    throw new Error('请先在 .env 配置 SECRET_ID、SECRET_KEY、APP_ID')
  }

  const { url, sessionId } = buildWsUrl()
  const ws = new WebSocket(url)
  const writeStream = fs.createWriteStream(OUTPUT_FILE, { flags: 'w' })
  let totalBytes = 0
  let closed = false
  let sent = false

  const closeAll = () => {
    if (closed) return
    closed = true
    writeStream.end(() => {
      console.log(`[保存] 音频已保存至 ${OUTPUT_FILE}，共 ${totalBytes} 字节`)
    })
    if (ws.readyState < WebSocket.CLOSING) ws.close()
  }

  ws.on('open', () => {
    console.log('[连接] WebSocket 已建立，等待服务端就绪...')
  })

  ws.on('message', async (data, isBinary) => {
    if (isBinary) {
      writeStream.write(data)
      totalBytes += data.length
      return
    }

    try {
      const msg = JSON.parse(data.toString())
      console.log('[消息]', JSON.stringify(msg))

      if (msg.ready === 1 && !sent) {
        sent = true
        await sendTexts(ws, sessionId)
      }

      if (msg.code && msg.code !== 0) {
        console.error(`[错误] code=${msg.code}, message=${msg.message}`)
        closeAll()
      } else if (msg.final === 1) {
        console.log('[完成] 合成结束。')
        closeAll()
      }
    } catch (e) {
      console.error('[解析错误]', e.message)
    }
  })

  ws.on('error', err => {
    console.error('[WebSocket 错误]', err.message)
    closeAll()
  })

  ws.on('close', (code, reason) => {
    console.log(`[断开] 连接已关闭，code=${code}, reason=${reason}`)
    closeAll()
  })
}

streamTTS()
```

appid 在这里：https://console.cloud.tencent.com/developer，基本信息里的APPID

安装以来：`pnpm i ws`

跑一下，可以看到文件先是5s，然后变成12s是不断追加的

### 流式语音合成 + ASR

因为文本是流式返回的，所以语音一般也要流式生成，用 streaming tts 的接口。

接下来试一下语音识别 ASR（Automatic Speech Recognition），叫 STT （Speech To Text） 也可以，但 ASR 用的多一些。

这个就不用流式了。你平时用豆包的时候，都是说完一段话才转成的文本

创建 `src/asr-test.mjs`文件

```js
import 'dotenv/config'
import tencentcloud from 'tencentcloud-sdk-nodejs'
import fs from 'node:fs'

const SECRET_ID = process.env.SECRET_ID
const SECRET_KEY = process.env.SECRET_KEY

const AsrClient = tencentcloud.asr.v20190614.Client
const AUDIO_FILE = './output.mp3'

const client = new AsrClient({
  credential: {
    secretId: SECRET_ID,
    secretKey: SECRET_KEY,
  },
  region: 'ap-shanghai',
  profile: {
    httpProfile: {
      reqMethod: 'POST',
      reqTimeout: 30,
    },
  },
})

async function run() {
  const audioBase64 = fs.readFileSync(AUDIO_FILE).toString('base64')

  const params = {
    EngSerViceType: '16k_zh',
    SourceType: 1,
    Data: audioBase64,
    DataLen: Buffer.byteLength(audioBase64),
    VoiceFormat: 'mp3',
  }

  try {
    const data = await client.SentenceRecognition(params)
    console.log('识别结果：', data.Result)
  } catch (err) {
    console.error('识别失败：', err)
  }
}

run()
```

传入音频 mp3 文件，调用接口来识别，返回文本

安装下依赖：`pnpm install tencentcloud-sdk-nodejs`

然后需要开通一下：https://console.cloud.tencent.com/asr，开通之后密钥用之前的密钥就行

跑一下：

```
mac@macdeMacBook-Air-3 aiagent % pnpm run asr-test

> ai@1.0.0 asr-test /Users/mac/jiuci/github/aiagent
> node src/21/asr-test.mjs

识别结果： 傍晚，我还在为晚霞开心，突然接到电话说系统崩了。我心里一沉，冲回办公室，好在大家一起排查后终于恢复，我长长松了口气。
```

可以看到识别是成功的

这样，我们就可以来实现豆包同款的语音交互了：

点击录音，输入一段语音，服务端提供接口来转文字，之后用大模型生成回答。

流式 SSE 返回文字，同时用 WebSocket 返回流式语音。

这样就可以实现语音输入，流式的文字、语音输出。

为啥不直接用 SSE 返回音频数据呢？

因为 SSE 是基于 http 的文本协议，需要转 Base64 才行，传这种二进制数据还是 WebSocket 更合适。

思路理清了，接下来按照这个实现下豆包同款交互。

## 豆包同款

### 后端

先创建后端项目：`nest new asr-and-tts-nest-service`

先写一下调用大模型回答的 SSE 接口

#### sse回答接口

创建 ai 模块：

```
nest g module ai
nest g controller ai --no-spec
nest g service ai --no-spec
```

改下 AiService、AiController、AiModule

```ts
import { Inject, Injectable } from '@nestjs/common'
import { ChatOpenAI } from '@langchain/openai'
import { PromptTemplate } from '@langchain/core/prompts'
import type { Runnable } from '@langchain/core/runnables'
import { StringOutputParser } from '@langchain/core/output_parsers'

@Injectable()
export class AiService {
  private readonly chain: Runnable

  constructor(@Inject('CHAT_MODEL') model: ChatOpenAI) {
    const prompt = PromptTemplate.fromTemplate('请回答以下问题：\n\n{query}')
    this.chain = prompt.pipe(model).pipe(new StringOutputParser())
  }

  async *streamChain(query: string): AsyncGenerator<string> {
    const stream = await this.chain.stream({ query })
    for await (const chunk of stream) {
      yield chunk
    }
  }
}
```

```ts
import { Controller, Get, Query, Sse } from '@nestjs/common'
import { from, map, Observable } from 'rxjs'
import { AiService } from './ai.service'

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Sse('chat/stream')
  chatStream(@Query('query') query: string): Observable<{ data: string }> {
    return from(this.aiService.streamChain(query)).pipe(
      map(chunk => ({ data: chunk })),
    )
  }
}
```

```ts
import { Module } from '@nestjs/common'
import { AiService } from './ai.service'
import { AiController } from './ai.controller'
import { ConfigService } from '@nestjs/config'
import { ChatOpenAI } from '@langchain/openai'

@Module({
  controllers: [AiController],
  providers: [
    AiService,
    {
      provide: 'CHAT_MODEL',
      useFactory: (configService: ConfigService) => {
        return new ChatOpenAI({
          model: configService.get('MODEL_NAME'),
          apiKey: configService.get('OPENAI_API_KEY'),
          configuration: {
            baseURL: configService.get('OPENAI_BASE_URL'),
          },
        })
      },
      inject: [ConfigService],
    },
  ],
})
export class AiModule {}
```

就是基于用 langchain 创建一个 chain 来回答用户的问题，流式返回

安装依赖：`pnpm install @nestjs/config @langchain/openai @langchain/core`，配置.env

```
OPENAI_API_KEY=sk-xxx
OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
MODEL_NAME=qwen-plus
```

在AppModule引入：

```ts
@Module(P
  imports: [
    AiModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
)
```

#### 语音转文字接口

创建 speech 模块：

```
nest g module speech
nest g service speech --no-spec
nest g controller speech --no-spec
```

把之前 asr 的逻辑拿过来，放到 service 里：

```ts
import { Inject, Injectable } from '@nestjs/common'
import type * as tencentcloud from 'tencentcloud-sdk-nodejs'

type UploadedAudio = {
  buffer: Buffer
  originalname: string
  mimetype: string
  size: number
}

type AsrClient = InstanceType<typeof tencentcloud.asr.v20190614.Client>

@Injectable()
export class SpeechService {
  constructor(@Inject('ASR_CLIENT') private readonly asrClient: AsrClient) {}

  async recognizeBySentence(file: UploadedAudio): Promise<string> {
    const audioBase64 = file.buffer.toString('base64')

    const result = await this.asrClient.SentenceRecognition({
      EngSerViceType: '16k_zh',
      SourceType: 1,
      Data: audioBase64,
      DataLen: file.buffer.length,
      VoiceFormat: 'ogg-opus',
    })

    return result.Result ?? ''
  }
}
```

把传过来的 buffer 转成 base64 字符串，用 asrClient 的 SentenceRecognition 方法来识别成文字返回。
