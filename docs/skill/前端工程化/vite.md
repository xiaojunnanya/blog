---
id: vite
slug: /vite
title: vite
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



## 原理

### vite打包图片

#### 图片在 Vite 中的引用方式

在 Vite 项目里，你通常会这样引用图片：`import logo from './logo.png';`

或者在 HTML/模板里：`<img src="/assets/logo.png" />`

底层 Vite 会对这些图片进行处理，具体流程取决于 **文件大小** 和 **引用方式**。



#### 图片打包流程

Vite 底层使用的是 **Rollup** 进行打包，而 Rollup 本身对图片是通过 **Asset** 处理的。

1. **解析资源引用**

- 当你 `import logo from './logo.png'` 时，Vite 会解析这个导入路径，生成一个 **模块 ID**。
- 如果是 HTML `<img src>`，Vite 会把它当作静态资源来处理。

2. **根据文件大小处理**
    Vite 默认使用 **base64 内联策略**：

- 小于 `assetsInlineLimit`（默认 4kb）的图片会被 **转成 base64**，直接嵌入到打包后的 JS 或 CSS 文件中。
- 大于这个大小的图片会被 **输出到 dist/assets**，并生成一个带 **hash** 的文件名（比如 `logo.abc123.png`），确保缓存安全。

3. **生成打包后的路径**

- 内联图片：`const logo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."`
- 外部图片：`const logo = "/assets/logo.abc123.png"`
   这样 JS 或 CSS 引用时直接使用生成的路径。

4. **输出资源文件**
    Rollup 会把这些图片当作 **asset** 类型处理，拷贝到打包目录 `dist/assets`，并加上 hash。



#### Vite 和 Rollup 底层逻辑

如果你想看更底层：

- **Vite 会先用 esbuild 或 vite-plugin-imagemin 等插件处理资源**。
- **Rollup 在打包阶段会触发 `load` 和 `generateBundle` 钩子**：
  - `load`：读取图片文件内容。
  - `generateBundle`：决定如何输出（内联还是文件）。
- 生成的图片路径会替换原来的 `import` 或 `src`。

所以底层本质上就是：

```bash
源文件（logo.png） 
    ─> Vite/Rollup 读取
        ─> 小文件 base64 内联 / 大文件 hash 输出
            ─> JS/CSS 文件中替换引用路径
```



#### 总结关键点

1. **小文件内联，大文件输出**。
2. **Vite 实际上是 Rollup + 插件处理资源**。
3. **生成的文件名通常带 hash** 保证缓存安全。
4. **JS/CSS 引用会被替换成最终路径**。





## vite插件 rollupOptions

### 文件分类

`vite`默认会把所有静态资源都打包到`assets`文件夹，配置`chunkFileNames`、`entryFileNames`、`assetFileNames`将静态资源分类。

```js
build: {
    outDir: '../../build/front',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // 入口文件命名规则
        entryFileNames: 'js/[name].[hash].js',
        // 动态 import 的 chunk 命名规则
        chunkFileNames: 'js/[name].[hash].js',
        // 静态资源分类打包
        assetFileNames: assetInfo => {
          const ext = assetInfo.name?.split('.').pop()?.toLowerCase()
          if (!ext) return 'assets/[name].[hash][extname]'

          if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext)) {
            return 'images/[name].[hash][extname]'
          }

          if (['css'].includes(ext)) {
            return 'css/[name].[hash][extname]'
          }

          if (['woff', 'woff2', 'eot', 'ttf', 'otf'].includes(ext)) {
            return 'fonts/[name].[hash][extname]'
          }

          return 'assets/[name].[hash][extname]'
        },
      },
    },
  },
```





| 配置项           | 作用目标                  | 控制什么文件                       | 示例                                                  |
| ---------------- | ------------------------- | ---------------------------------- | ----------------------------------------------------- |
| `entryFileNames` | **入口 JS 文件**          | 入口模块（如 `main.ts`）           | `js/main.[hash].js`                                   |
| `chunkFileNames` | **代码分割生成的 chunk**  | 通过 `import()`、共享模块生成的 JS | `js/chunk-[name].[hash].js`                           |
| `assetFileNames` | **静态资源文件（非 JS）** | 图片、字体、CSS、媒体等            | `images/[name].[hash].[ext]`、`css/[name].[hash].css` |

- `entryFileNames`
  - 控制的是：**构建入口文件的输出位置和命名**
  - 入口文件：就是你在 `index.html` 中通过 `<script type="module" src="main.ts">` 或 Vite 配置里 `build.rollupOptions.input` 指定的文件
  - 典型输出路径：`dist/js/main.abc123.js`

- `chunkFileNames`

  - 控制的是：**通过动态导入（`import()`）或代码分割生成的 JS 模块的输出位置和命名**。
  - 常见的 chunk 来源：动态 `import('./module')`、`node_modules`

- `assetFileNames`

  - 控制的是：**所有非 JS 的静态资源文件的输出位置和命名**。

  - 包括：样式、图片、字体、视频、音频

  - 可根据文件后缀动态分类，如：

    ```js
    assetFileNames: (assetInfo) => {
      const ext = assetInfo.name?.split('.').pop()
      if (ext === 'css') return 'css/[name].[hash][extname]'
      if (['png', 'jpg', 'jpeg'].includes(ext)) return 'images/[name].[hash][extname]'
      return 'assets/[name].[hash][extname]'
    }
    ```





### 打包分析插件

`npm i rollup-plugin-visualizer -D`

> rollup-plugin-visualizer是一个打包体积分析插件，对应webpack中的`webpack-bundle-analyzer`。配置好后运行构建命令会生成一个`stats.html`。

```js
plugins: [
	visualizer({ open: true })
],
```

之后每次打包后，该插件都会在根目录生成`stats.html`，在浏览器打开后就可以看到各个`chunk`的大小信息



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

分包目的是 **合理拆分代码，提高加载效率**。下面是它的详细作用和应用场景：



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

> 一般来说deleteOriginFile都设置为false，虽然体积会变大，但是会适合服务器根据客户端支持情况自动选择加载 `.gz` 或原始文件。如果支持gzip就加载gzip，不支持就加载正常的

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

































