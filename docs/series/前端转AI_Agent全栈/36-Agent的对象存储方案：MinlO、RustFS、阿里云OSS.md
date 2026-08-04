---
id: aiagent36
slug: /aiagent36
title: 36-Agent的对象存储方案：MinlO、RustFS、阿里云OSS
date: 2002-09-26
authors: 鲸落
tags: [AI]
keywords: [AI]
---



## 前言

AIAgent在跑业务的时候，时时刻刻都要读写各种文件。

不管是上传的文档，还是AI自己生成的报表、图片视频

普通本地文件夹根本扛不住海量文件的生产场景。

所以要用对象存储(Object Storage)

比如这三类场景:

- 存放RAG知识库所有原始文件，给智能问答提供数据源
- 保存Agent自动运行产出的报表、图表、运行日志
- 统一存图片、音频、视频，支撑多模态AI处理任务

![image-20260803233257126](https://img.xiaojunnan.cn/image-20260803233257126.png)

(MinlO是常用的对象存储方案)



## MinlO

单独拿知识库场景来说：

![image-20260803233520857](https://img.xiaojunnan.cn/image-20260803233520857.png)

MinlO承担着原始文件的存储重任。

各类文档、PDF、网页素材都会先进入数据处理环节，完成文件解析、文本切分、内容清洗与元数据提取。

处理完成后的原始文件，会完整存入MinlO对象存储中长久保存。

同时文件对应的名称、来源、切片等元数据写入关系型数据库(PostgreSQL)

而切分后的文本分片会用嵌入模型向量化，存入向量数据库。

这就走完了知识库完整的数据入库流程。

![image-20260803233609387](https://img.xiaojunnan.cn/image-20260803233609387.png)

等到用户发起提问检索时，先把用户问题用嵌入模型向量化，去向量库做语义检索

向量数据库返回相似度高的文本片段，同时附带对应的文件ID

检索服务拿着文件ID去元数据库，调取这份文件的基础信息

再根据文件ID从MinlO拉取完整原始文件、原文片段内容

最终把原文内容和检索结果一并返回给提问的用户。

![image-20260803233727572](https://img.xiaojunnan.cn/image-20260803233727572.png)

整套流程里 MinlO对象存储的作用不可替代。

向量库只存文本向量，不会存放完整原始文件。

关系数据库仅保管元数据，无法承载大体积二进制附件。

只有MinlO能统一存放PDF、图片、各类附件等大容量素材。

既能保障文件长期安全归档，又能随时按需调取原文溯源。

能和向量库、业务数据库无缝联动。

![image-20260803233756666](https://img.xiaojunnan.cn/image-20260803233756666.png)



## 主流存储方案

当然，对象存储不止有MinlO

市面上主流可选方案主要分为三类:阿里云 OSS、MinlO、RustFS

先说阿里云OSS，属于公有云托管服务。

不用自己搭建服务器，零运维，开箱就能用。

完美适配云上业务，能和阿里云各类产品打通联动。

采用按量计费模式，自动扩容，业务规模越大扩容越省心。

适合线上SaaS平台、在线教育这类不想维护存储的团队。

再就是MinlO，是轻量化私有化方案。

支持Docker一键部署，单机、小型集群都能快速搭建。

日常小批量文档存取流畅，搭建成本几乎为零。

但短板也很明显，大批量大文件并发时容易卡顿。

开源协议为AGPL，如果商用落地会存在版权风险。

更适合中小企业小型知识库、本地测试环境使用。

最后是RustFS，面向大型私有化集群设计。

支持多服务器分布式部署，海量文件并发场景稳定性更强。

底层基于Rust开发，运行时内存占用更低。

同时兼容S3、POSIX、WebDAV多种访问协议，适配更广

开源协议是宽松的Apache2.0，商用无任何版权约束。

专门匹配集团级多模态知识库、海量音视频、国产化政务国企项目。

综上:

- 如果业务跑在公有云上、想省去运维压力，直接选阿里云OSS。
- 如果只是小型本地自建知识库、低成本快速落地，优先MinlO。
- 如果是海量音视频存储、大型集团国产化项目，推荐RustFS。

![image-20260803233955967](https://img.xiaojunnan.cn/image-20260803233955967.png)

这节我们把这三种都用一下



### 阿里云OSS

我们本地文件存储是目录-文件的真实树状组织方式

![image-20260803234252682](https://img.xiaojunnan.cn/image-20260803234252682.png)

而OSS对象存储底层是扁平化结构：

![image-20260803234313935](https://img.xiaojunnan.cn/image-20260803234313935.png)

阿里云OSS官方文档也明确说明，对象存储底层没有真实目录层级：

![image-20260803234539103](https://img.xiaojunnan.cn/image-20260803234539103.png)

控制台里我们看到的文件夹视图，只是系统模拟出来的效果：

![image-20260803234556642](https://img.xiaojunnan.cn/image-20260803234556642.png)

这套虚拟目录的实现逻辑和文件元数据无关。

每个Object对象包含三部分核心信息:唯一Key标识、文件二进制内容、自定义元数据

![image-20260803234615659](https://img.xiaojunnan.cn/image-20260803234615659.png)

OSS只是解析文件Key里的/斜杠分隔符，渲染出目录分层视图。

用Key前缀做分组检索。

手动创建空文件夹时，本质是生成一个以/结尾的0字节占位对象。

![image-20260803234645687](https://img.xiaojunnan.cn/image-20260803234645687.png)

除了对象存储 OSS，阿里云也提供了文件存储和块存储的方式：

![image-20260803234726771](https://img.xiaojunnan.cn/image-20260803234726771.png)

块存储就是把整块磁盘给你用，你需要自己格式化，存储容量有限。

文件存储就是有目录层次结构，你可以上传下载文件，存储容量有限。

对象存储就是key-value存储，分布式的方式实现的，存储容量无限。

这些简单了解就行，绝大多数情况下，我们都是用OSS对象存储。

很多时候，我们需要在代码里上传，比如知识库里，用户上传的文件，要传到OSS。

安装依赖：`pnpm install ali-oss`

.env

```
OSS_REGION=oss-xxx
OSS_ACCESS_KEY_ID=xxx
OSS_ACCESS_KEY_SECRET=xxx
OSS_BUCKET=xxx
```

创建src/oss-upload.mjs

```js
import 'dotenv/config';
import OSS from 'ali-oss';
import fs from 'fs';

const client = new OSS({
  // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
  region: process.env.OSS_REGION,
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  authorizationV4: true,
  bucket: process.env.OSS_BUCKET,
});

async function putStream () {
  try {
    // 使用chunked encoding。使用putStream接口时，SDK默认会发起一个chunked encoding的HTTP PUT请求。
    let stream = fs.createReadStream('./zao.png');
    // 填写Object完整路径，例如exampledir/exampleobject.txt。Object完整路径中不能包含Bucket名称。
    let result = await client.putStream('aaa/bbb/first.png', stream);    
    console.log(result); 
  } catch (e) {
    console.log(e)
  }
}

putStream();
```

这样，我们就通过代码完成了OSS文件上传。



### MinlO

直接用阿里云的OSS是挺方便，但是要花钱，而且企业内部有的资料也不希望上云。

这种情况就要自己搭OSS服务了

比如 MinlO 或者 RustFS

![image-20260803235243230](https://img.xiaojunnan.cn/image-20260803235243230.png)

创建 docker-compose.yml

```yaml
version: "3.8"

services:
  # minio:
    image: minio/minio:RELEASE.2025-04-22T22-12-26Z
    container_name: minio-server
    restart: always
    ports:
      # S3 对象存储API端口（程序对接用）
      - "9000:9000"
      # Web图形控制台端口（浏览器访问UI）
      - "9001:9001"
    environment:
      # 登录控制台、S3接口的账号（至少3位）
      MINIO_ROOT_USER: admin
      # 登录密码（至少8位，数字+字母）
      MINIO_ROOT_PASSWORD: Admin@123456
    volumes:
      # 持久化数据到本地 ./minio-data 文件夹
      - ./volumes/minio-data:/data
    command: server /data --console-address ":9001"
```

跑一下：

【视频】

这样我们就在本地跑了一个OSS服务

代码：`pnpm install minio`

```js
import 'dotenv/config';
import fs from 'fs';
import * as Minio from 'minio';

const minioClient = new Minio.Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_ SECRET_KEY,
})

async function putStream() {
    try {
        const stream = fs.createReadStream('./zao.png');
        const result = await minioClient.putObject('aaa', 'ccc/ddd/hello.png', stream);
        console.log(result);
        console.log('上传成功');
    } catch (err) {
        console.log(err);
    }
}

putStream();
```

你会发现代码和之前阿里云OSS的差不多，为什么OSS服务都这么相似呢?

因为它们都是循 AWS 的 Simple Storage Service (S3)规范的，简称 S3 规范。

所以不管哪家的OSS，用起来都是差不多的。

![image-20260803235905615](https://img.xiaojunnan.cn/image-20260803235905615.png)



### RustFS

最后再来用一下 RustFS

改下配置文件:

```yaml
version: "3.8"

services:
  # minio:
  #   image: minio/minio:RELEASE.2025-04-22T22-12-26Z
  #   container_name: minio-server
  #   restart: always
  #   ports:
  #     # S3 对象存储API端口（程序对接用）
  #     - "9000:9000"
  #     # Web图形控制台端口（浏览器访问UI）
  #     - "9001:9001"
  #   environment:
  #     # 登录控制台、S3接口的账号（至少3位）
  #     MINIO_ROOT_USER: admin
  #     # 登录密码（至少8位，数字+字母）
  #     MINIO_ROOT_PASSWORD: Admin@123456
  #   volumes:
  #     # 持久化数据到本地 ./minio-data 文件夹
  #     - ./volumes/minio-data:/data
  #   command: server /data --console-address ":9001"
  rustfs:
    image: rustfs/rustfs:latest
    container_name: rustfs-server
    restart: always
    ports:
      - "9000:9000"    # S3 API 端口
      - "9001:9001"    # Web控制台端口
    environment:
      TZ: Asia/Shanghai
      # S3/后台登录账号密钥
      RUSTFS_ACCESS_KEY: admin
      RUSTFS_SECRET_KEY: Admin@123456
      # 开启Web管理控制台
      RUSTFS_CONSOLE_ENABLE: "true"
    volumes:
      - ./volumes/rustfs-data:/data
      - ./volumes/rustfs-logs:/logs
    command: server /data
```

跑一下：

【视频】

除了界面不大一样，功能都是差不多的。

然后在代码里上传个文件;

`pnpm install @aws/sdk/client-s3`

因为都兼容S3协议，所以所有对象存储服务都可直接使用AWS 官方S3 SDK;

前面我们用ali-oss、minio写的代码也都可以换成这个sdk

创建 src/s3-upload.mjs

```js
import 'dotenv/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';

// 初始化统一S3客户端（RustFS/MinIO/阿里云OSS通用）
const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
  signatureVersion: 'v4',
  region: 'aaa' // 本地私有存储随便填，不影响
});

/**
 * 文件流上传
 * @param {string} objectKey 对象路径 aaa/bbb/first.png
 * @param {ReadableStream} stream fs可读流
 * @param {string} contentType 文件类型（图片/pdf等）
 */
async function putStream(objectKey, stream, contentType = 'image/png') {
  try {
    const uploadCmd = new PutObjectCommand({
      Bucket: 'hello',
      Key: objectKey,
      Body: stream,
      ContentType: contentType
    });
    await s3Client.send(uploadCmd);
    console.log('上传成功');
  } catch (err) {
    console.error('上传失败', err);
    throw err;
  }
}

async function main() {
  const stream = fs.createReadStream('./zao.png');
  await putStream('aaa/bbb/first.png', stream, 'image/png');
}

main();
```

env

```
OSS_REGION=oss-cn-beijing
OSS_ACCESS_KEY_ID=LTAI5tABJ6BXekZDhfHSTCBN
OSS_ACCESS_KEY_SECRET=
OSS_BUCKET=agent-bucket123

MINIO_ACCESS_KEY=
MINIO_SECRET_KEY=

S3_ENDPOINT=localhost
S3_PORT=9000
S3_ACCESS_KEY_ID=admin
S3_SECRET_ACCESS_KEY=Admin@123456
```

跑一下：

【视频】

至此，我们阿里云OSS、MinlO、RustFS就都用了一遍了。



## 总结

Al Agent运行过程中会持续产生、读取大量各类文件。

用户上传的文档、程序自动生成的图表、音视频等都需要稳定存储。

普通本地文件夹无法支撑海量文件并发读写的业务场景

所以做AI知识库、多模态Agent项目，必须使用对象存储。

比如RAG知识库的完整流程:

用户上传的PDF、网页素材先经过解析、清洗、切片处理。

原始文件会完整存入对象存储长期归档保存。

文件名称、来源、切片信息这类元数据存入PostgreSQL关系库。

文本切片经过向量化后，单独存入向量数据库用于语义检索。

用户提问时，向量库返回匹配片段并附带对应文件ID

程序拿着ID去数据库读取文件基础信息

再通过对象存储拉取完整原始文档做溯源展示。

向量库只存向量、数据库只存文字信息，都存不了大体积二进制文件。

只有对象存储能统一承载图片、PDF、音视频等大容量素材。

目前主流可选三类对象存储方案，分别是阿里云OSS、MinlO、RustFS

阿里云OSS是公有云托管服务，不用自己维护服务器，按量自动扩容

适合线上SaaS、不想投入运维人力的业务团队

MinlO可以Docker快速私有化部署，本地测试、小型知识库用着很方便

但新版社区版阉割了可视化管理功能，商用还存在AGPL开源版权风险

RustFS专为私有化海量文件场景打造，Rust底层内存占用低、并发稳定

商用无约束，适配多模态国产化项目

三类存储底层全部遵循 S3标准协议，核心能力基本一致。

只是后台管理界面、商用约束存在区别。

安装@aws-sdk/client-s3这一个aws 的包就能对接所有OSS 服务，也可以分别用ali-oss、minio来对接。

对象存储是各类AIAgent 存储文件的底层核心支撑，后面会大量用到。









