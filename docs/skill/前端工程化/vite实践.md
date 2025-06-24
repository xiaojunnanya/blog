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



### 文件压缩

`npm install vite-plugin-compression -D`

```js
plugins:[
    viteCompression({
        verbose: true, // 是否在控制台中输出压缩结果
        disable: false,
        threshold: 1024 * 10, // 10kb,如果体积大于阈值，将被压缩，单位为b，体积过小时请不要压缩，以免适得其反
        algorithm: 'gzip', // 压缩算法，可选['gzip'，' brotliccompress '，'deflate '，'deflateRaw']
        ext: '.gz',
        deleteOriginFile: false // 源文件压缩后是否删除
    })
]
```

> 一般来说deleteOriginFile都设置为false，虽然体检会变大，但是会适合服务器根据客户端支持情况自动选择加载 `.gz` 或原始文件。如果支持gzip就加载gzip，不支持就加载正常的

需要配置`nginx`，使其开启`gzip`模式

```
server {
        listen 80;
        server_name whaledev.xiaojunnan.cn;

        index index.html;
        root /home/xjn/whaledev/build/front;

        gzip_static on;
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
        gzip_vary on;
        gzip_min_length 1k;
        gzip_comp_level 6;

        location / {
                try_files $uri $uri/ /index.html;
                client_max_body_size 1024M;
        }
}
```

> - gzip on;                        # 开启 gzip
> - gzip_static on;                 # 开启对 .gz 静态文件的支持（如果有生成 .gz 文件）
> - gzip_vary on;                   # 添加 `Vary: Accept-Encoding` 响应头
> - gzip_comp_level 6;              # 压缩等级，1-9，数字越大压缩越强，CPU开销越高
> - gzip_min_length 1024;           # 最小压缩内容长度（单位：字节）
> - gzip_buffers 16 8k;             # 缓冲区配置
> - gzip_types                       # 指定压缩的 MIME 类型（默认只压 text/html）
>           text/plain
>           text/css
>           application/json
>           application/javascript
>           text/xml
>           application/xml
>           application/xml+rss
>           text/javascript
>           font/ttf
>           font/otf
>           application/x-font-ttf
>           application/x-font-opentype
>           image/svg+xml;

> 查看F12接口看响应头是否有：`Content-Encoding: gzip`



### 查看打包后的依赖大小

`npm i rollup-plugin-visualizer -D`

> rollup-plugin-visualizer是一个打包体积分析插件，对应webpack中的`webpack-bundle-analyzer`。配置好后运行构建命令会生成一个`stats.html`。

```js
plugins: [
	visualizer({ open: true })
],
```

之后每次打包后，该插件都会在根目录生成`stats.html`，在浏览器打开后就可以看到各个`chunk`的大小信息
