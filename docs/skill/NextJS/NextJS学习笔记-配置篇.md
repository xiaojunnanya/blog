---
id: nextjs06
slug: /nextjs06
title: NextJS学习笔记 - 配置篇
date: 2002-09-26
authors: 鲸落
tags: [React, NextJs]
keywords: [React, NextJs]
---



## 环境变量

在 Next.js 中添加环境变量会更加方便，因为 Next.js 内置了对环境变量的支持，使用环境变量有两种方式：

1.  通过 `.env.local` 加载环境变量
2.  通过 `NEXT_PUBLIC_`前缀在浏览器中获取环境变量



### .env.local 加载环境变量

Next.js 支持从 `.env.local`中加载环境变量到 `process.env`。现在我们在项目根目录下建立一个 `.env.local`文件（注意是根目录，不是 `/src`目录）

```javascript
DB_HOST=localhost
DB_USER=myuser
DB_PASS=mypassword
```

现在我们就可以服务端组件或者路由处理程序中通过 `process.env`获取到该值：

```javascript
// app/page.js
export default function Page() {
  console.log(process.env.DB_HOST)
  return <h1>Hello World!</h1>
}
```

```javascript
// app/api/route.js
export async function GET() {
  const db = await myDB.connect({
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
  })
  // ...
}
```

使用起来就是这么方便。Next.js 也支持多行变量，示例代码如下：

```javascript
# .env.local
 
# 直接换行
PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
...
Kh9NV...
...
-----END DSA PRIVATE KEY-----"
 
# 也可以使用 `\n`
PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nKh9NV...\n-----END DSA PRIVATE KEY-----\n"
```

Nxt.js 也支持使用 `$`引用其他变量，举个例子：

```javascript
TWITTER_USER=nextjs
TWITTER_URL=https://twitter.com/$TWITTER_USER
```

在这个例子中，`process.env.TWITTER_URL` 的值为 `https://twitter.com/nextjs`。

如果你本来就要用带 `$`的值，使用 `\$`这种方式进行转义即可。



### 浏览器中获取环境变量

前面我们讲到，`process.env` 是 Nodejs 提供的用于获取用户环境变量对象的 API。也就是说，正常在 `.env.local` 中设置的变量，是无法在浏览器端获取的。

为了让浏览器也可以获取环境变量中的值，Next.js 可以在构建的时候，将值内联到客户端的 js bundle 中，替换掉所有硬编码使用 `process.env.[variable]`的地方。不过为了告诉 Next.js 哪些值是可以让浏览器访问的，你需要在变量前添加 `NEXT_PUBLIC_`前缀，比如：

```bash
NEXT_PUBLIC_ANALYTICS_ID=abcdefghijk
```

现在我们再通过 `process.env.NEXT_PUBLIC_ANALYTICS_ID` 获取：

```javascript
'use client';
// app/page.js
export default function Page() {
  return <h1 onClick={() => {
    console.log(process.env.NEXT_PUBLIC_ANALYTICS_ID)
  }}>Hello World!</h1>
}
```

如果没有 `NEXT_PUBLIC_`前缀，正常点击的时候获取的值会是 `undefined` ，添加 `NEXT_PUBLIC_`前缀后即可获取到正确的值。不过你要记得这里的原理，其实是在构建的时候，将所有 `NEXT_PUBLIC_`前缀的值做了替换，也就是在代码中，点击事件的代码就已经变成了：



此外要注意，动态查找的值不会被内联，比如：

```javascript
// 使用了变量，不会被内联，不会生效
const varName = 'NEXT_PUBLIC_ANALYTICS_ID'
setupAnalyticsService(process.env[varName])
 
// 使用了变量，不会被内联，不会生效
const env = process.env
setupAnalyticsService(env.NEXT_PUBLIC_ANALYTICS_ID)

//  正确的方式（直接写明变量名）：
setupAnalyticsService(process.env.NEXT_PUBLIC_ANALYTICS_ID);
```



### 默认环境变量

通常一个 `.env.local`文件就够用了，但有的时候，你也许会希望在 `development`（`next dev`）或 `production`（`next start`）环境中添加一些默认值。

Next.js 支持在 `.env`（所有环境）、`.env.development`（开发环境）、`.env.production`（生产环境）中设置默认的值。

`.env.local`会覆盖这些默认值。

注意：`.env`、`.env.development`、`.env.production` 用来设置默认的值，所有这些文件可以放到仓库中，但 `.env*.local`应该添加到 `.gitignore`，因为可能涉及到一些机密的信息。

此外，如果环境变量 NODE\_ENV 未设置，当执行 `next dev`的时候，Next.js 会自动给 `NODE_DEV`赋值 `development`，其他命令则会赋值 `production`。也就是说，当执行 `next dev`或者其他命令的时候，获取`process.env.NODE_ENV`是有值的，这是 Next.js 自动赋值的，为了帮助开发者区分开发环境。



### 测试环境变量

除了 `development`环境和 `production`环境，还有第三个选项，那就是 `test`环境。这是当使用测试工具如 `jest`或 `cypress`时，出于测试目的而设置特定的环境变量。

用法跟开发环境、生产环境类似，建立一个 `.env.test`文件用于测试环境，但是跟开发环境、生产环境不同的是，测试环境不会加载 `.env.local`中的值，这是为了让每个人都产生相同的测试结果。这些默认值会在 `NODE_DEV`设置成 `test`的时候用到。



### 环境变量加载顺序

环境变量的查找也是有顺序的，一旦找到，就会终止查找，不会再往下查找，这个顺序是：

1.  `process.env`
2.  `.env.$(NODE_ENV).local`
3.  `.env.local` (当 `NODE_ENV` 是 `test` 的时候不会查找)
4.  `.env.$(NODE_ENV)`
5.  `.env`

举个例子，如果你在 `.env.development.local` 和 `.env`中设置了 `NODE_ENV` 为 `development`，按照这个顺序，最终会使用 `.env.development.local`中的值。



## 绝对地址导入和模块路径别名

Next.js 的 `tsconfig.json`和`jsconfig.json`文件支持设置 `"paths"`和 `"baseUrl"`选项。

这些配置会帮助你更方便的导入模块



### 绝对地址导入

`baseUrl`配置项可以让你从项目根目录中直接导入。使用示例如下：

```javascript
// tsconfig.json or jsconfig.json
{
  "compilerOptions": {
    "baseUrl": "."
  }
}
```

我们声明 `baseUrl`为 `"."`，也就是项目根目录。现在我们在根目录下的 `components`文件夹下新建一个组件：

```javascript
// components/button.js
export default function Button() {
  return <button>Click me</button>
}
```

现在我们导入该组件，不需要再使用相对地址，当嵌套多层引入组件时候就会很方便：

```javascript
// app/page.js
import Button from '/components/button'
 
export default function HomePage() {
  return (
    <>
      <h1>Hello World</h1>
      <Button />
    </>
  )
}
```



### 模块别名

除了配置 `baseUrl` 路径之外，你也可以设置 `"paths"` 选项实现路径别名。举个例子：

```javascript
// tsconfig.json or jsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/components/*": ["components/*"]
    }
  }
}
```

在这个例子中，我们设置了一个路径映射，`@/components/*` 到 `"components/*`。

```javascript
// components/button.js
export default function Button() {
  return <button>Click me</button>
}
```

现在我们不需要使用相对地址，使用设置的路径别名即可：

```javascript
// app/page.js
import Button from '@/components/button'
 
export default function HomePage() {
  return (
    <>
      <h1>Hello World</h1>
      <Button />
    </>
  )
}
```

那 `baseUrl`和 `paths:`是什么关系呢？事实上，`paths` 中的地址是相对于 `baseUrl` 的，举个例子：

```javascript
// tsconfig.json or jsconfig.json
{
  "compilerOptions": {
    "baseUrl": "src/",
    "paths": {
      "@/styles/*": ["styles/*"],
      "@/components/*": ["components/*"]
    }
  }
}
```

```javascript
// pages/index.js
import Button from '@/components/button'
import '@/styles/styles.css'
import Helper from 'utils/helper'
 
export default function HomePage() {
  return (
    <Helper>
      <h1>Hello World</h1>
      <Button />
    </Helper>
  )
}
```

`@/components/button`最终的地址其实是 `src/components/button`，其他地址同理。



## 段（Segment）

为了简单起见，我翻译成“段”。Segment 放到 URL 这个场景时：

**URL Segment** 指的是由斜杠分隔的 URL Path 的一部分
**URL Path** 指的则是域名后面的 URL 部分（URL Path 由 URL Segment 组成）



## 路由段配置项

路由段配置选项可以配置页面、布局、路由处理程序的行为。比如我们使用 fetch 的时候可以单独配置某个请求的 `revalidate` ，借助路由段配置，我们可以配置这个路由下所有 fetch 请求的 `revalidate`。

路由段配置的使用方式也很简单，导出一个约定变量名即可，比如：

```javascript
// layout.js | page.js | route.js
export const dynamic = 'auto'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
export const maxDuration = 5
 
export default function MyComponent() {}
```

具体这些变量名和值的类型为：

| **变量名**                                                   | **类型**                                                     | **默认值**   |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------ |
| [dynamic](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic) | `'auto' \| 'force-dynamic' \| 'error' \| 'force-static'`     | `'auto'`     |
| [dynamicParams](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamicparams) | `boolean`                                                    | `true`       |
| [revalidate](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#revalidate) | `false \| 'force-cache' \| 0 \| number`                      | `false`      |
| [fetchCache](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#fetchcache) | `'auto' \| 'default-cache' \| 'only-cache' \| 'force-cache' \| 'force-no-store' \| 'default-no-store' \| 'only-no-store'` | `'auto'`     |
| [runtime](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#runtime) | `'nodejs' \| 'edge'`                                         | `'nodejs'`   |
| [preferredRegion](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#preferredregion) | `'auto' \| 'global' \| 'home' \| string \| string[]`         | `'auto'`     |
| [maxDuration](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#maxduration) | `number`                                                     | 部署平台设置 |

注意配置选项的值目前是静态分析的，也就是说，配置`revalidate = 600`是有效的，但是 `revalidate = 60 * 10`是无效的。

我们来一一讲解这些配置选项的作用。



### dynamic

更改布局或者页面的动态行为，用例如下：

```javascript
// layout.js | page.js | route.js
export const dynamic = 'auto'
// 'auto' | 'force-dynamic' | 'error' | 'force-static'
```

为了讲解 dynamic 参数的选项，我们先复习下基础知识：

所谓**静态渲染（Static Rendering）**，指的是路由在构建时渲染，或者在重新验证后后台渲染，其结果会被缓存并可以推送到 CDN。适用于未针对用户个性化且数据已知的情况，比如静态博客文章、产品介绍页面等。

所谓**动态渲染（Dynamic Rendering）**，指的是路由在请求时渲染，适用于针对用户个性化或依赖请求中的信息（如 cookie、URL 参数）的情况。

因为渲染模式和数据缓存是相互独立的，所以在动态渲染下，数据请求也分为缓存和不缓存（[uncached data request](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#opting-out-of-data-caching)）的。默认是缓存，这样做的好处在于，即便选择了动态渲染，也不用担心渲染时获取所有数据对性能造成影响。

`dynamic` 影响的不仅是渲染模式，也会影响数据缓存的方式。

还有一个名词叫**动态函数（Dynamic Functions）**，指的是获取只能在请求时才能得到的信息（如 cookie、请求头、URL 参数）的函数，在 Next.js 中，对应的就是 `cookies()`、`headers()`、`useSearchParams()`、`searchParams()` 这些函数。如果使用了这些函数的任意一个，都会导致路由进行动态渲染。

接下来我们讲解 `dynamic` 的值都有哪些作用：

*   `'auto'`（默认）：自动判断
*   `'force-dynamic'`，强制使用 SSR（每次请求时重新渲染），相当于：
    *   Page Router 下使用了 `getServerSideProps()`
    *   将布局或页面中每个 `fetch()` 请求都设置为 `{ cache: 'no-store', next: { revalidate: 0 } }`
    *   设置了路由段配置 `export const fetchCache = 'force-no-store'`
*   `'error'`强制静态渲染并缓存数据，如果有组件使用了动态函数或不缓存数据请求（[uncached data request](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#opting-out-of-data-caching)），就会导致错误，相当于：
    *   Page Router 下使用了`getStaticProps()`
    *   将布局或页面中每个 `fetch()` 请求都设置为 `{ cache: 'force-cache' }`
    *   设置了路由段配置 `fetchCache = 'only-cache', dynamicParams = false`
    *   设置`dynamic = 'error'` 会更改 `dynamicParams` 的默认值 `true` 为 `false`
*   `'force-static'` 强制使用 SSG（构建时生成 HTML，不允许用动态数据），强制 `cookies()`、`headers()`、`useSearchParams()` 返回空值。



### dynamicParams

控制当访问不是由 `generateStaticParams` 生成的动态路由段的时候发生什么。

```javascript
// layout.jsx | page.jsx
export const dynamicParams = true // true | false,
```

*   `true`（默认）：按需生成
*   false：返回 404

这个选项对应 Page Router 下的 `getStaticPaths` 的 `fallback: true | false | blocking`选项。

如果使用了 `dynamic = 'error'` 和 `dynamic = 'force-static'`，它会更改 `dynamicParams` 的默认值为 `false`。



### revalidate

设置布局或者页面的默认验证时间。此设置不会覆盖单个 `fetch` 请求设置的 `revalidate` 的值。注意 `revalidate` 选项只能用于 Nodejs Runtime，不能用于 Edge Runtime。

```javascript
// layout.jsx | page.jsx | route.js
export const revalidate = false
// false | 'force-cache' | 0 | number
```

*   `false`（默认），语义上相当于 `revalidate: Infinity`，资源无限期缓存。
*   `0`，页面或布局总是动态渲染，即使没有使用动态函数或者不缓存数据请求（[uncached data request](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#opting-out-of-data-caching)）。
*   `number` ：设置布局或页面的默认重新验证频率，以秒为单位。

关于重新验证频率，一个路由可能有多个布局和一个页面，此时会选择最低的 `revalidate` 值作为路由的重新验证频率。这是为了确保子路由的重新验证时间频率和父布局保持一致。此外，单个 fetch 请求可以设置比路由默认的 `revalidate` 值更低的 `revalidate` 值，这会增加整个路由的重新验证频率。这允许你根据某些动态条件进行更频繁的重新验证。



### fetchCache

这是一个高级选项，仅当你特别需要覆盖默认行为时才应该使用。为了解释这个选项，我们先复习下 fetch 请求的 `options.cache` 选项：

```javascript
fetch(`https://...`, { cache: 'force-cache' | 'no-store' })
```

其中 `force-cache`是默认值，表示优先从缓存中查找匹配请求，当没有匹配项或者匹配项过时时，才从服务器上获取资源并更新缓存。`no-store`表示每次请求都从服务器上获取资源，不从缓存中查，也不更新缓存。

回到 Next.js，默认情况下，Next.js 会缓存在动态函数使用之前的 `fetch` 请求，不会缓存任何动态函数之后的`fetch` 请求。而 `fetchCache` 允许你覆盖布局或者页面中所有的 `fetch`请求的默认 `cache`选项。

```javascript
// layout.jsx | page.jsx | route.js
export const fetchCache = 'auto'
// 'auto' | 'default-cache' | 'only-cache'
// 'force-cache' | 'force-no-store' | 'default-no-store' | 'only-no-store'
```

*   `'auto'`（默认）：动态函数之前按照开发者设置的 `cache` 选项进行缓存，动态函数之后不缓存请求
*   `'default-cache'`：开发者可以自由设置 `cache` 选项，但如果开发者未设置 `cache` 选项，默认设置为 `force-cache`，这意味着即使是在动态函数之后的请求，也会被视为静态
*   `'only-cache'`：如果开发者未设置 `cache` 选项，默认设置为 `force-cache`，如果有请求设置成 `cache: 'no-store'`，则会导致报错
*   `'force-cache'`：将所有请求的 `cache` 选项设置为 `force-cache` 。
*   `'default-no-store'`：开发者可以自由设置 `cache` 选项，但如果开发者未设置 `cache` 选项，默认设置为 `no-store`，这意味着即使是在动态函数之前的请求，也会被视为动态。
*   `'only-no-store'`：如果开发者未设置 `cache` 选项，默认设置为 `no-store`，如果有请求设置成 `cache: 'force-cache'`，则会导致报错
*   `'force-no-store'`：将所有请求的 `cache` 选项设置为 `no-store` 。

一个路由可能有多个布局和一个页面，此时选项应该相互兼容：

*   如何 `'only-cache'` 和 `'force-cache'` 同时提供，`'force-cache'` 获胜。如果 `'only-no-store'` 和 `'force-no-store'`同时提供，`'force-no-store'`获胜。带 `force` 的选项会更改整个路由的行为，并会阻止 `'only-*'` 引发的错误。
*   `'only-*'` 和 `force-*'`选项的作用就是确保整个路由要么是完全静态要么是完全动态，这意味着：
    *   在单个路由中不允许同时使用 `'only-cache'`和 `'only-no-store'`
    *   在单个路由中不允许同时使用 `'force-cache'`和 `'force-no-store'`
*   如果子级提供了 `'auto'`或  `'*-cache'`，父级无法使用 `'default-no-store'`，因为这会导致请求有不同的行为。

Next.js 建议共享的父布局使用 `'auto'`，在子级中自定义不同的选项。



### runtime

设置运行时环境，具体参考小册[《渲染篇 | Streaming 和 Edge Runtime》](https://juejin.cn/book/7307859898316881957/section/7309076865732640818)

```javascript
// layout.jsx | page.jsx | route.js
export const runtime = 'nodejs'
// 'edge' | 'nodejs'
```

*   `nodejs`（默认）
*   `edge`



### preferredRegion

在 [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions) 中使用，搭配 `export const runtime = 'edge'; `，用于设置 [Edge Functions](https://vercel.com/docs/functions/configuring-functions/region) 执行的区域，默认情况下，Edge Functions 在最接近传入请求的区域中执行，但如果你的函数比较依赖数据源，你会更希望它靠近数据源所在的位置以实现快速响应，那就可以设置 preferredRegion 指定一系列首选区域。

指定区域的时候，传入的是区域 ID，区域列表参考 [Vercel 的 Region List 文档](https://vercel.com/docs/edge-network/regions)，其中 iad1 表示美国东部区域，参考位置美国华盛顿地区，sfo1 表示美国西部，参考位置美国旧金山。

```javascript
// layout.jsx | page.jsx | route.js
export const preferredRegion = 'auto'
// 'auto' | 'global' | 'home' | ['iad1', 'sfo1']
```



### maxDuration

在 [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions) 中使用，用于配置 [Vercel 函数](https://vercel.com/docs/functions/configuring-functions/duration)的最大持续时间，所谓 Max duration，指的是函数在响应之前可以处理 HTTP 请求的最长时间。如果持续时间内没有响应，则会返回错误码。如果没有指定，根据不同的部署平台，默认时间会不同。

```javascript
export const maxDuration = 5
```



### generateStaticParams

与动态路由搭配使用，用于定义静态生成的路由段参数。具体内容参考小册[《API 篇 | 路由相关的常用方法》](



































