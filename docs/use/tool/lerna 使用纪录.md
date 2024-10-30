---
id: lerna
slug: /tool/lerna
title: lerna 使用纪录
date: 2002-09-26
authors: 鲸落
tags: [tool, lerna]
keywords: [tool, lerna]
----


## 前言

在lerna v7.x 版本后移除了`lerna bootstrap`，现在运行 `npm install` 时，它会自动执行 `npm run link`，以链接所有子项目



## 使用

1. 在主文件的package.json中添加你要链接的文件夹目录

```
"workspaces": [
    "packages/*"
 ],
```

2. `npx lerna init` 生成 `lerna.json`
3. `npm intall` 即可



## lerna.json

```
{
  "$schema": "node_modules/lerna/schemas/lerna-schema.json",
  "version": "independent",
  "lerna": "8.1.8",
  "npmClient": "npm",
  "packages": ["packages/*"]
}
```



## 补充

- 在主文件夹中执行子文件夹的scripts命令：`"dev": "npm --prefix ./packages/frontEnd run dev"`

- 同时执行多个scripts命令：`"open": "concurrently \"npm run dev\" \"npm run start\""`（先安装concurrently：`npm install concurrently -D`）

