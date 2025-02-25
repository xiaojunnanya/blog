---
id: vite
slug: /vite
title: vite实践
date: 2002-09-26
authors: 鲸落
tags: [前端工程化, vite]
keywords: [前端工程化, vite]
---





## 介绍

[vite官网](https://cn.vitejs.dev/)

Vite 是一种新型前端构建工具，能够显著提升前端开发体验，它主要由两部分组成：

- 开发阶段：一个开发服务器，它基于 原生 ES 模块 提供了 丰富的内建功能，如速度快到惊人的 模块热替换（HMR）
- 打包阶段：一套构建指令，它使用 Rollup 打包代码，并且它是预配置的，可输出用于生产环境的高度优化过的静态资源



## vite插件

### 分包

- Vite 配置 `manualChunks` 选项，`manualChunks` 选项通常用于代码分割

```ts
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // 将所有的依赖项都合并到一个js包中
            return 'vendor';
          }
        }
      }
    }
  }
});
```

```ts
// 但是在一般情况下，我们并不会将所有的依赖项都打包在一个js中，我们有选择性的进行打包
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const packageName = id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0]
            // 希望合并的库, 合并成 vendor.[hash].js，减少请求数。
            const vendorPackages = [
              'lodash-es',
              'axios',
              'react',
              'antd',
              'typescript',
              'vite',
            ]
            return vendorPackages.includes(packageName) ? 'vendor' : packageName
          }
        },
      }
    }
  }
});
```
