---
id: aiagent33
slug: /aiagent33
title: 33-Redis：实现Agent短期记忆存储的最佳方案
date: 2002-09-26
authors: 鲸落
tags: [AI]
keywords: [AI]
---



## 前言

用户和Agent聊了几轮之后，对话上下文该存放在哪里呢?

CLI版的单机Agent 很简单：所有对话历史、摘要都直接放在进程内存里，不需要任何外部存储。

但后端服务不一样：

- 线上服务一般会部署多个服务实例做负载均衡，单实例内存无法共享会话数据
- 同时对话属于高频读写的热数据，对响应延迟要求极高，还需要实现会话闲置自动失效。

这种场景下，最近几轮对话、动态截断、历史摘要，这些运行时上下文必须放在Redis里。

依靠Redis低延迟读写、天然支持TTL过期、多实例数据共享的特性，完美支撑短期会话运行。

Redis只负责承载运行时短期记忆，不会长期保存数据。

每一条消息本身，最终都会异步写入PostgreSQL保存，作为永久的聊天记录和可语义检索的长期记忆。

写消息的流程是这样的:

- 用户发消息
- 写入Redis(更新短期记忆)
- 同时写入PostgreSQL(落库永久保存)
- 截断、摘要都在Redis里做
- 长期记忆检索从PostgreSQL+向量查

![image-20260803162609527](https://img.xiaojunnan.cn/image-20260803162609527.png)



## Redis

我们先学下Redis，然后基于它实现短期记忆。

Redis是一个高性能的键值型内存数据库，也是后端开发中最常用的缓存中间件之一。

它的数据默认都存在内存里，读写延迟通常在亚毫秒级，天生就适合处理像对话上下文这样的高频读写场景。

它的几个特性，刚好完美适配Agent短期记忆的需求:

- 支持TTL(过期时间)
  - 会话闲置一段时间后，数据会自动过期清理，不用我们写额外的定时清理逻辑，非常省心。
- 多实例共享数据
  - 所有Agent 服务实例都能连接同一个Redis，用户的会话上下文在任何实例上都能被读取，完美解决了负载均衡下的会话共享问题。
- 丰富的数据结构
  - 我们可以用List 直接存对话列表，用Hash存会话元信息，用String存对话摘要，实现起来非常灵活。
- 支持持久化
  - 如果需要，Redis也能通过RDB/AOF做数据备份，避免极端情况下会话数据丢失，兼顾性能与可靠性。



## 用一下

### docker

docker-compose.yml

```yaml
services:
  # Redis
  redis:
    image: redis:7-alpine
    container_name: agent_redis
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - ${DOCKER_VOLUME_DIRECTORY:-.}/volumes/redis:/data
    command: redis-server --appendonly yes
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5

  # Redis 官方 Web GUI（类似 pgAdmin）
  redisinsight:
    image: redis/redisinsight:2.50
    container_name: redis_insight
    restart: always
    ports:
      - "5540:5540"
    volumes:
      - ${DOCKER_VOLUME_DIRECTORY:-.}/volumes/redisinsight:/data
    environment:
      - RI_HOST=0.0.0.0
    depends_on:
      - redis

networks:
  default:
    name: common-network
```

跑下redis以及它的GUI：

【视频】

redis还有很多数据类型，我们过一遍常用的7种:

![image-20260803163139087](https://img.xiaojunnan.cn/image-20260803163139087.png)



### 常见命令

创建 redis-data-types.md

```markdown
# Redis 核心数据类型手册

## 一、String 字符串
适用场景：验证码、Token、登录会话、计数器、分布式锁、配置项、文本类短期记忆

**核心命令**

set key value
get key
setex key 秒数 value
set key value nx ex 秒数
incr key
decr key
incrby key 步长

**真实业务示例**

手机验证码，5 分钟过期
setex verification:mobile:13800138000 300 "666888"

用户登录 Token，24 小时过期
setex session:token:adf245kjndsa3 86400 "userid:1001"

文章阅读量自增
incr counter:article:1024

分布式锁，10 秒过期，防止重复执行
set lock:order:2001 "locked" nx ex 10

AI 对话摘要，1 小时过期
setex agent:memory:user:1001 3600 "用户想学习 PostgreSQL 向量检索"

---

## 二、Hash 哈希
适用场景：用户信息、商品资料、电商购物车、结构化对话上下文

**核心命令**

hset key field value
hmset key field1 value1 field2 value2
hget key field
hgetall key
hkeys key
hvals key
hincrby key field 增量

**真实业务示例**

存储用户基础信息
hset user:info:1001 name "张三" age 28 phone "13800138000"

电商购物车，字段为商品 ID，值为购买数量
hset cart:user:1001 product:10086 2 product:10087 1

存储 AI 会话完整上下文
hset agent:session:user:1001 messages "最近 5 轮对话" summary "对话摘要"

---

## 三、List 列表
适用场景：消息队列、任务队列、操作日志、聊天历史、有序记录

**核心命令**

lpush key value1 value2
rpush key value1 value2
lrange key 0 -1
lpop key
rpop key
llen key

**真实业务示例**

订单消息队列，右侧入队
rpush queue:order "order_1001" "order_1002"

用户浏览历史，左侧插入最新记录
lpush user:history:1001 "查看了 AI 课程" "查看了 Redis 教程"

后台任务队列
rpush queue:task "生成对话摘要" "向量入库"

---

## 四、Set 集合
适用场景：数据去重、每日签到、IP 黑名单、共同好友、权限标签

**核心命令**

sadd key value1 value2
smembers key
sismember key value
sinter key1 key2
sunion key1 key2
sdiff key1 key2

**真实业务示例**

记录当日签到用户
sadd sign:20250820:user 1001 1002 1003

网站 IP 黑名单
sadd blacklist:ip "192.168.1.100" "192.168.1.101"

查询两位用户的共同好友
sinter user:friend:1001 user:friend:1002

---

## 五、ZSet 有序集合
适用场景：各类排行榜、内容热度排序、用户积分排名、权重队列

**核心命令**

zadd key score member
zrange key 0 -1
zrevrange key 0 -1
zscore key member
zrank key member

**真实业务示例**

课程热度排行榜，数值为热度分数
zadd rank:course 98 "PostgreSQL 实战" 95 "AI Agent 开发" 92 "Redis 从入门到精通"

用户积分排行榜
zadd rank:user:points 1000 "张三" 850 "李四"

文章热度排序
zadd hot:article 1200 "article:1024" 980 "article:1025"

---

## 六、Bitmap 位图
适用场景：海量用户签到记录、在线状态统计、布尔型数据存储，极致节省内存

**核心命令**

setbit key 偏移量 0/1
getbit key 偏移量
bitcount key

**真实业务示例**

记录用户当月签到，第 5 天、第 10 天完成签到
setbit user:sign:1001:202508 5 1
setbit user:sign:1001:202508 10 1

统计该用户当月总签到天数
bitcount user:sign:1001:202508

---

## 七、Geo 地理位置
适用场景：附近门店、附近的人、两地距离计算、位置检索

**核心命令**

geoadd key 经度 纬度 名称
geodist key 名称1 名称2 km

**真实业务示例**

添加线下门店经纬度信息
geoadd shop:location 116.481028 39.921983 "北京总店"

计算两家门店之间的直线距离，单位千米
geodist shop:location "北京总店" "上海分店" km

---

## 数据类型场景速查表
| 数据类型 | 典型业务场景 |
| ---- | ---- |
| String | 验证码、Token、计数器、分布式锁、文本记忆 |
| Hash | 用户信息、商品数据、购物车、结构化会话 |
| List | 消息队列、任务队列、浏览/聊天历史 |
| Set | 签到、数据去重、黑名单、好友关系 |
| ZSet | 排行榜、热度排序、积分排名 |
| Bitmap | 批量签到、海量布尔状态统计 |
| Geo | 位置检索、距离计算、附近门店/人群 |
```



### 代码里

安装依赖：`pnpm install ioredis`

创建src/redis-test.mjs

```js
import Redis from "ioredis";

// 创建 Redis 客户端
const redis = new Redis({
  host: "localhost",
  port: 6379,
  db: 0,
});

// 监听连接
redis.on("connect", () => {
  console.log("✅ ioredis 连接成功（mjs 版）");
});

// 错误监听
redis.on("error", (err) => {
  console.error("❌ Redis 连接失败：", err);
});

// 执行操作
async function runRedisDemo() {
  try {
    // =========================
    // 1. String 字符串
    // =========================
    await redis.set("name", "张三");
    await redis.set("code", "6666", "EX", 300); // 5 分钟过期
    console.log("String name:", await redis.get("name"));

    // =========================
    // 2. Hash 哈希
    // =========================
    await redis.hset("user:1001", "name", "李四", "age", 28);
    console.log("Hash user:", await redis.hgetall("user:1001"));

    // =========================
    // 3. List 列表
    // =========================
    await redis.lpush("task:list", "任务1", "任务2");
    await redis.rpush("task:list", "任务3");
    console.log("List:", await redis.lrange("task:list", 0, -1));

    // =========================
    // 4. Set 集合
    // =========================
    await redis.sadd("tag:set", "redis", "nest", "node");
    console.log("Set:", await redis.smembers("tag:set"));

    // =========================
    // 5. ZSet 有序集合
    // =========================
    await redis.zadd("score:rank", 99, "小明", 95, "小红");
    console.log("ZSet 排名:", await redis.zrange("score:rank", 0, -1));

    // =========================
    // 6. 分布式锁（标准写法）
    // =========================
    const lockKey = "lock:order:1001";
    const lockResult = await redis.set(lockKey, "locked", "NX", "EX", 10);
    console.log("分布式锁:", lockResult ? "加锁成功" : "加锁失败");
  } catch (err) {
    console.error("执行异常：", err);
  }
}

// 运行
runRedisDemo();
```



redis的数据结构、应用场景，代码里怎么操作都会了。

接下来我们可以实现刚开始的需求：

基于redis 实现agent 短期记忆的存储。



### 基于redis 实现agent 短期记忆的存储

![image-20260803164339807](https://img.xiaojunnan.cn/image-20260803164339807.png)

安装 langgraph 和 deepagents，创建src/agent-with-redis-memory.mjs

```js
/**
 * 基于 Redis 的 Agent 短期记忆
 *
 * 模式：
 * - invoke 前：从 Redis 读取该会话的 messages
 * - invoke 后：把 agent 返回的 messages 写回 Redis（带 TTL）
 * - 压缩：由 langchain summarizationMiddleware 在 agent 内部完成
 *
 * 前置：docker compose up -d redis
 *
 * 运行：node src/agent-with-redis-memory.mjs
 * 输入 exit / quit / :q 退出；:clear 清空当前会话记忆
 */
import "dotenv/config";
import Redis from "ioredis";
import * as readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { ChatOpenAI } from "@langchain/openai";
import {
  mapChatMessagesToStoredMessages,
  mapStoredMessagesToChatMessages,
} from "@langchain/core/messages";
import { createAgent, HumanMessage, summarizationMiddleware } from "langchain";

const REDIS_HOST = process.env.REDIS_HOST ?? "localhost";
const REDIS_PORT = Number(process.env.REDIS_PORT ?? 6379);
const REDIS_DB = Number(process.env.REDIS_DB ?? 0);
const MEMORY_TTL = Number(process.env.MEMORY_TTL_SECONDS ?? 1800);
const KEY_PREFIX = process.env.MEMORY_KEY_PREFIX ?? "agent:short_memory";
const SESSION_ID = process.env.MEMORY_SESSION_ID ?? "demo_user_001";

const summaryPrompt = `你是对话摘要助手。请用中文总结以下对话，包含：
1. 讨论的主要话题
2. 用户提到的重要事实（姓名、偏好、日期等，务必保留原文信息）
3. 继续对话所需的关键上下文

保持简洁，不要编造，不要遗漏用户明确说过的信息。

待摘要的对话：
{messages}

摘要：`;

class RedisMessageStore {
  constructor({ redis, keyPrefix, ttlSeconds }) {
    this.redis = redis;
    this.keyPrefix = keyPrefix;
    this.ttlSeconds = ttlSeconds;
  }

  messagesKey(sessionId) {
    return `${this.keyPrefix}:${sessionId}:messages`;
  }

  async loadMessages(sessionId) {
    const raw = await this.redis.get(this.messagesKey(sessionId));
    if (!raw) return [];
    return mapStoredMessagesToChatMessages(JSON.parse(raw));
  }

  async saveMessages(sessionId, messages) {
    const payload = JSON.stringify(mapChatMessagesToStoredMessages(messages));
    await this.redis.set(
      this.messagesKey(sessionId),
      payload,
      "EX",
      this.ttlSeconds,
    );
  }

  async clear(sessionId) {
    await this.redis.del(this.messagesKey(sessionId));
  }

  async ttl(sessionId) {
    return this.redis.ttl(this.messagesKey(sessionId));
  }
}

async function invokeWithMemory(agent, store, sessionId, userText) {
  const history = await store.loadMessages(sessionId);
  console.log(`  ↳ 从 Redis 加载 ${history.length} 条历史`);

  const result = await agent.invoke(
    { messages: [...history, new HumanMessage(userText)] },
    { recursionLimit: 30 },
  );

  await store.saveMessages(sessionId, result.messages);
  const ttl = await store.ttl(sessionId);
  console.log(`  ↳ 写回 Redis ${result.messages.length} 条 (TTL ${ttl}s)`);

  return result;
}

const redis = new Redis({ host: REDIS_HOST, port: REDIS_PORT, db: REDIS_DB });

redis.on("connect", () => console.log("✅ Redis 已连接"));
redis.on("error", (err) => console.error("❌ Redis 错误:", err.message));

const store = new RedisMessageStore({
  redis,
  keyPrefix: KEY_PREFIX,
  ttlSeconds: MEMORY_TTL,
});

const model = new ChatOpenAI({
  model: process.env.MODEL_NAME,
  apiKey: process.env.OPENAI_API_KEY,
  configuration: { baseURL: process.env.OPENAI_BASE_URL },
  temperature: 0,
});

const agent = createAgent({
  model,
  tools: [],
  systemPrompt:
    "你是会话助手。记住用户提到的关键事实，中文简短回答。若消息中有对话摘要，请据此继续对话。",
  middleware: [
    summarizationMiddleware({
      model,
      summaryPrompt,
      trigger: { messages: 8 },
      keep: { messages: 4 },
    }),
  ],
});

console.log("输入 exit / quit / :q 退出，:clear 清空记忆\n");

const rl = readline.createInterface({ input: stdin, output: stdout });
let prevCount = (await store.loadMessages(SESSION_ID)).length;

try {
  while (true) {
    const userText = (await rl.question("你: ")).trim();
    if (!userText) continue;

    if (["exit", "quit", ":q"].includes(userText.toLowerCase())) break;

    if (userText === ":clear") {
      await store.clear(SESSION_ID);
      prevCount = 0;
      console.log("已清空当前会话记忆\n");
      continue;
    }

    const { messages } = await invokeWithMemory(
      agent,
      store,
      SESSION_ID,
      userText,
    );
    console.log("\n助手:", messages.at(-1)?.content);
    console.log(`当前消息数: ${messages.length}`);
    if (messages.length < prevCount + 2) {
      console.log("  ⚡ 已触发压缩");
    }
    prevCount = messages.length;
    console.log();
  }
} finally {
  rl.close();
}

await redis.quit();
```

用到的环境变量在.env里配置：

```
# LLM（OpenAI 兼容接口）
OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
MODEL_NAME=qwen-plus
OPENAI_API_KEY=sk-xx

# 用于身份验证，实现链路上报  
LANGCHAIN_API_KEY=xx
# 指定LangSmith中的项目，追踪结果会归类到该项目下
LANGCHAIN_PROJECT=redis-test
# 开启LangSmith追踪功能
LANGCHAIN_TRACING_V2=true

# Redis（默认与 docker-compose 一致）
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

# 短期记忆：key 前缀、会话 ID、过期时间（秒）
MEMORY_KEY_PREFIX=agent:short_memory
MEMORY_SESSION_ID=demo_user_001
MEMORY_TTL_SECONDS=1800

# 启动时清空会话记忆（默认保留，方便多次运行续聊）
# CLEAR_MEMORY=1
```

【视频】

这样我们就基于redis实现了短期记忆的存储，具体的摘要+截断的压缩逻辑是用的deepagents



## 总结

Agent基本都是用Redis做短期记忆的存储，用PostgreSQL做历史消息、长期记忆存储。

我们学了Redis 的7种常用数据类型 string、hash、list、set、zset(有序集合)、bitmap(位图)、geo(地理位置)

过了一遍它们的读写命令，以及各自典型的业务场景。

然后基于 Redis+DeepAgents 实现了短期记忆。

DeepAgents的压缩中间件做消息的摘要+截断，Redis做短期记忆的存储。

一般会把每轮消息存入PostgreSQL做历史消息，还能用来基于向量做长期记忆的检索。

Redis基本是 Agent做短期记忆存储的最佳方案了。



## `createSummarizationMiddleware`对比`summarizationMiddleware`

这两个名字看起来很像，但通常来自 **不同版本的 LangChain / LangGraph Agent API**，核心目的都是：**自动压缩历史消息（conversation summarization）避免上下文无限增长**。

区别主要在于：**封装程度、持久化能力、适用场景不同**。



### `createSummarizationMiddleware`

```
createSummarizationMiddleware({
  model,
  backend,
  historyPathPrefix,
  summaryPrompt,
  trigger: { type: "messages", value: 8 },
  keep: { type: "messages", value: 4 },
})
```

这是新版偏工程化的 Middleware。

特点：支持 Backend 存储

你这里有：

```
backend,
historyPathPrefix,
```

说明它可以把摘要写入外部存储。

例如：

```
messages:

[
 用户: 我叫张三
 AI: 你好张三

 用户: 我喜欢篮球
 AI: 记住了

 ...
]


超过8条

↓

summary:

用户张三，喜欢篮球

保留最近4条消息
```

摘要可能存：

```
backend
 |
 ├── conversation/123/summary
 |
 └── conversation/123/messages
```

适合：

- 多轮长期聊天
- ChatGPT 类应用
- 用户几个月后回来继续聊
- 多实例服务部署



工作流程大概：

```
用户消息
    |
    ↓
Agent Middleware
    |
    ↓
检查 messages 数量
    |
    ↓
超过 trigger
    |
    ↓
调用 model 生成 summary
    |
    ↓
保存 summary 到 backend
    |
    ↓
删除旧 messages
    |
    ↓
继续调用 agent
```



### `summarizationMiddleware`

```
summarizationMiddleware({
  model,
  summaryPrompt,
  trigger: { messages: 8 },
  keep: { messages: 4 },
})
```

这个更简单。

它通常是：

> 一个纯内存 middleware

没有：

```
backend
historyPathPrefix
```

所以摘要生命周期跟当前 agent run 绑定。

例如：

```
messages:

[
msg1,
msg2,
...
msg8
]


触发


↓

summary:

msg1-msg4 的摘要


保留:

msg5-msg8
```

但是：

如果服务重启：

```
summary ❌ 丢失
```



适合：

- demo
- 测试
- 单次会话
- 不需要长期记忆



### 对比

|            | createSummarizationMiddleware | summarizationMiddleware |
| ---------- | ----------------------------- | ----------------------- |
| 版本       | 新版 API                      | 旧/简单 API             |
| 持久化     | ✅ 支持 backend                | ❌ 通常没有              |
| 长期记忆   | ✅ 可以                        | ❌ 不适合                |
| 多用户会话 | ✅                             | 一般                    |
| 部署集群   | ✅                             | 困难                    |
| 配置复杂度 | 高                            | 低                      |
| 适合生产   | ✅                             | 小项目                  |



### 为什么两个 API 长这么像？

因为 LangChain 在演进。

早期：

```
summarizationMiddleware()
```

提供一个简单能力：

> 超长上下文自动总结

后来 Agent Runtime 更复杂：

- checkpoint
- store
- backend
- memory
- thread

所以升级成：

```
createSummarizationMiddleware()
```

变成一个更完整的组件。

所以简单记：

> `summarizationMiddleware` = **临时压缩上下文**

> `createSummarizationMiddleware` = **带存储能力的生产级上下文记忆管理**













































