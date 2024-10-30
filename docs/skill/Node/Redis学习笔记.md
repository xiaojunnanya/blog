---
id: redis
slug: /redis
title: Redis学习笔记
date: 2002-09-26
authors: 鲸落
tags: [Node, redis]
keywords: [Node, redis]
---

## 邂逅Redis

### 简介

Redis 是用 C 语言开发的一个开源的高性能键值对（key-value）数据库，官方提供的数据是可以达到 100000+ 的 QPS（每秒内查询次数）。它存储的 value 类型比较丰富，也被称为结构化的 NoSQL 数据库

NoSql（Not Only SQL），不仅仅是 SQL，泛指非关系型数据库。NoSQL 数据库并不是要取代关系型数据库，而是关系型数据库的补充 关系型数据库：

- Mysql
- Oracle
- DB2
- SQLServer

非关系型数据库：

- Redis
- Mongo DB
- MenCached

Redis应用场景：

- 缓存
- 任务队列
- 消息队列
- 分布式锁



### 数据类型

Redis 存储的是 key-value 结构的数据，其中 key 是字符串类型

- value 有五种常用的数据类型

  - 字符串 string

  - 哈希 hash

  - 列表 list

  - 集合 set

  - 有序集合 sorted set

- 五种高级数据类型

  - 消息队列Stream
  - 地理空间Geospatial
  - HyperLogLog
  - 位图 Bitmap
  - 位域 Bitfield



### 安装

已windows为例

下载安装包进行安装（注意如果使用安装包只能使用V5版本，我们学习redis可以使用）

安装后打开cmd执行`redis-server.exe`，当界面出现端口号代表我们启动成功

:::info 补充

在我执行`redis-server.exe`后出现一个错误

```
C:\Users\Tofly>redis-server.exe
[23816] 29 Oct 10:40:41.136 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
[23816] 29 Oct 10:40:41.137 # Redis version=5.0.14.1, bits=64, commit=ec77f72d, modified=0, pid=23816, just started
[23816] 29 Oct 10:40:41.137 # Warning: no config file specified, using the default config. In order to specify a config file use redis-server.exe /path/to/redis.conf
[23816] 29 Oct 10:40:41.140 # Could not create server TCP listening socket *:6379: bind: 在一个非套接字上尝试了一个操作 。
```

这个错误是因为 Redis 服务器在启动时尝试绑定端口 6379 失败了。常见原因可能是端口已被占用，或者在非套接字上进行了操作。

执行`netstat -ano | findstr :6379`来检查 6379 端口是否已被其他程序占用

如果有结果，说明该端口已经被其他程序占用，记下进程 ID，然后可以使用以下命令终止进程：

`taskkill /PID 进程ID /F`

:::

执行`redis-cli`我们就可以看到redis的客户端界面



### 图形化工具

https://redis.io/insight/



## 学习Redis

### 常用命令

- `SET key value`设置指定 key 的值
  - 设置成功返回`OK`
  - 我们存储数字1，通过get获取的会是字符串1
- `GET key`获取指定 key 的值
  - 返回`nil`表示该键不存在
- `SETEX key seconds value`设置指定 key 的值，并将 key 的过期时间设置为 seconds 秒
- `TTL key`查看一个键的过期时间
  - 返回-1表示没有设置过期时间
  - 返回-2表示已经过期
- `SETNX key value`只有在 key 不存在时设置 key 的值，如果存在则不做任何事情
- `DEL key` 删除一个键
  - 删除成功返回`1(int类型)`
- `EXISTS key`：判断一个键是否存在
  - 存在返回1，不存在返回0

- `KEYS *` 查看redis中所有的键
  - `KEYS *me`查找所有以me结尾的键
- `FLUSHALL`删除所有的键（慎用）



注意：

1. redis中数据存储是区分大小写的
2. redis中的键和值都是以二进制存储的，所以默认不支持中文，当我们set一个key为中文的时候，get key的时候返回的是二进制字符串。如果我们想要正常显示中文的话，我们启动redis的时候使用`redis-cli --raw`，表示已原始形式显示内容
3. 我们也可以使用`EXPIRE`来设置过期时间，`EXPIRE key time`，它和`SETEX`还是有区别的

:::info 补充

在 Redis 中，`SETEX` 和 `EXPIRE` 都用于设置键的过期时间，但它们有一些关键区别：

1. **`SETEX`**：
   - 语法：`SETEX key seconds value`
   - 功能：`SETEX` 同时设置键值对和过期时间。执行 `SETEX` 时，键会立即保存到 Redis 中，并且指定的过期时间会直接应用。
   - 使用场景：适合在插入数据的同时设置过期时间的情况。
   - 示例：`SETEX myKey 60 "hello"`，这个命令将 `myKey`键的值设置为 `"hello"`，并在 60 秒后自动过期。
2. **`EXPIRE`**：
   - 语法：`EXPIRE key seconds`
   - 功能：`EXPIRE` 仅用于给已有的键设置过期时间。如果键不存在或没有值，`EXPIRE` 不会创建或更新键。
   - 使用场景：适合在数据已经存在后，才决定给它添加过期时间的情况。
   - 示例：`EXPIRE myKey 60`。这个命令首先将`myKey` 键的值设置为`"hello"`，然后再将该键设置为 60 秒后过期。

**总结**：

- `SETEX` 在设置值的同时指定过期时间。
- `EXPIRE` 仅用于对已经存在的键添加或更新过期时间。

:::















































































