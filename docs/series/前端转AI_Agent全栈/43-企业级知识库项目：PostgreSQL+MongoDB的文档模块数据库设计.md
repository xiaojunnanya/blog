---
id: aiagent43
slug: /aiagent43
title: 43-企业级知识库项目：PostgreSQL+MongoDB的文档模块数据库设计
date: 2002-09-26
authors: 鲸落
tags: [AI]
keywords: [AI]
---



## 前言

知识库项目会有很多模块，比如用户模块、文档模块、AI问答模块、知识图谱模块、统计模块等

这节我们先来做一下文档模块。

文档是用户上传的pdf、txt、音频、视频等文件，解析为文档，用于后续AI问答的知识来源。

![image-20260901222702897](https://img.xiaojunnan.cn/image-20260901222702897.png)

员工上传的文件可能存在内容错误、夹带隐私敏感信息、无效垃圾内容等问题。若不经审核直接入库，脏数据会污染知识库，直接导致AI问答输出错误、不合规回复。

因此所有文档必须经管理员审核通过后，才可正式纳入知识检索体系。

基于审核机制，文档设计4种生命周期状态：

- 草稿：上传完成、未提交审核，仅上传人可见
- 待审核：用户提交发布申请，等待管理员处理
- 已发布：审核通过，全权限用户可检索调用
- 已驳回：审核不通过，附带驳回原因，支持修改后重新提审



所有上传的文件，都会转为markdown格式。

原始二进制文件(PDF/视频/音频等大体积源文件):持久存储至RustFs对象存储

文档元数据(标题、上传人、创建时间、审核状态、分类、关联ID等轻量信息):存入PostgreSQL关系库;

解析后的完整Markdown正文:独立存储于MongoDB。

![image-20260901222953991](https://img.xiaojunnan.cn/image-20260901222953991.png)

审核通过后，文档成为发布状态，才会做文本切分Chunk、抽取实体存入Neo4j知识图谱、构建ES全文索引、生成向量写入向量库。



## 开始

### 后端

创建后端项目`nest new knowledge-hub-backend`

我们先准备一下docker-compose.yml

```yaml
services:
  # PostgreSQL
  postgres:
      image: pgvector/pgvector:pg16
      container_name: knowledge_hub_postgres
      restart: always
      environment:
        POSTGRES_USER: user
        POSTGRES_PASSWORD: 123456
        POSTGRES_DB: knowledge_hub
      ports:
        - "5432:5432"
      volumes:
        - ${DOCKER_VOLUME_DIRECTORY:-.}/volumes/postgres:/var/lib/postgresql/data
        - ./init-scripts/postgresql:/docker-entrypoint-initdb.d
      healthcheck:
        test: ["CMD-SHELL", "pg_isready -U user -d hello_pg"]
        interval: 5s
        timeout: 5s
        retries: 5

  # PostgreSQL GUI (pgAdmin)
  pgadmin:
    container_name: knowledge_hub_pgadmin
    image: dpage/pgadmin4:latest
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: admin
    volumes:
      - ${DOCKER_VOLUME_DIRECTORY:-.}/volumes/pgadmin:/var/lib/pgadmin
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80/login"]
      interval: 30s
      timeout: 20s
      retries: 3
    ports:
      - "8088:80"
    depends_on:
      - postgres

  # MongoDB 主库
  mongodb:
    image: mongo:7-jammy
    container_name: knowledge_hub_mongodb
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: mongo_user
      MONGO_INITDB_ROOT_PASSWORD: mongo_pass123
      MONGO_INITDB_DATABASE: knowledge_hub
    ports:
      - "27017:27017"
    volumes:
      - ${DOCKER_VOLUME_DIRECTORY:-.}/volumes/mongo:/data/db
      - ./init-scripts/mongodb:/docker-entrypoint-initdb.d
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')", "-u", "mongo_user", "-p", "mongo_pass123", "--authenticationDatabase", "admin"]
      interval: 10s
      timeout: 10s
      retries: 5

  # MongoDB Web GUI: mongo-express
  mongo-express:
    image: mongo-express:1.0.2-20-alpine3.19
    container_name: knowledge_hub_mongo_express
    restart: always
    ports:
      - "8081:8081"
    environment:
      # 连接 mongo 数据库账号（和mongodb服务保持一致）
      ME_CONFIG_MONGODB_SERVER: mongodb
      ME_CONFIG_MONGODB_ADMINUSERNAME: mongo_user
      ME_CONFIG_MONGODB_ADMINPASSWORD: mongo_pass123
      ME_CONFIG_MONGODB_ENABLE_ADMIN: "true"
      # mongo-express 网页登录账号（区分数据库账号）
      ME_CONFIG_BASICAUTH_ENABLED: "true"
      ME_CONFIG_BASICAUTH_USERNAME: me_admin
      ME_CONFIG_BASICAUTH_PASSWORD: me_123456
      # 编辑器暗色主题
      ME_CONFIG_OPTIONS_EDITORTHEME: "3024-night"
    # 等待mongodb健康就绪再启动
    depends_on:
      mongodb:
        condition: service_healthy

networks:
  default:
    name: common-network
```

用到的mongodb的初始化脚本：

```js
db = db.getSiblingDB("knowledge_hub");

db.createUser({
  user: "knowledge_hub_user",
  pwd: "knowledge_hub_password",
  roles: [{ role: "readWrite", db: "knowledge_hub" }],
});

// 文档正文：_id(ObjectId) ↔ kh_document.content_id，documentId ↔ kh_document.id
db.createCollection("document_content");
db.document_content.createIndex({ documentId: 1 }, { unique: true });
db.document_content.createIndex({ deleted: 1 });
```

跑一下：
【视频】



PostgreSql和 MongoDB 都跑起来了

接下来我们设计下表结构:

















































