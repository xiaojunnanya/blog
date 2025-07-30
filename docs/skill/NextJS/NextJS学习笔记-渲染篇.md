---
id: nextjs02
slug: /nextjs02
title: NextJS学习笔记 - 渲染篇
date: 2002-09-26
authors: 鲸落
tags: [Node, NextJs]
keywords: [Node, NextJs]
---



## CSR、SSR、SSG、ISR

### CSR

#### 概念介绍

我们先从传统的 CSR 开始说起。

**CSR，英文全称“Client-side Rendering”，中文翻译“客户端渲染”。顾名思义，渲染工作主要在客户端执行。**

像我们传统使用 React 的方式，就是客户端渲染。浏览器会先下载一个非常小的 HTML 文件和所需的  JavaScript 文件。在 JavaScript 中执行发送请求、获取数据、更新 DOM 和渲染页面等操作。

这样做最大的问题就是不够快。（SEO 问题是其次，现在的爬虫已经普遍能够支持 CSR 渲染的页面）

在下载、解析、执行 JavaScript以及请求数据没有返回前，页面不会完全呈现。



#### Next.js 实现 CSR

Next.js 支持 CSR，在 Next.js Pages Router 下有两种方式实现客户端渲染。

一种是在页面中使用 React `useEffect` hook，而不是服务端的渲染方法（比如 `getStaticProps`和 `getServerSideProps`，这两个方法后面会讲到），举个例子：

```javascript
// pages/csr.js
import React, { useState, useEffect } from 'react'
 
export default function Page() {
  const [data, setData] = useState(null)
 
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos/1')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      setData(result)
    }
 
    fetchData().catch((e) => {
      console.error('An error occurred while fetching the data: ', e)
    })
  }, [])
 
  return <p>{data ? `Your data: ${JSON.stringify(data)}` : 'Loading...'}</p>
}
```

可以看到，请求由客户端发出，同时页面显示 loading 状态，等数据返回后，主要内容在客户端进行渲染。

当访问 `/csr`的时候，渲染的 HTML 文件为：

```html
<body>
  <div id="__next">
    <p>Loading...</p>
  </div>
</body>
```

js获取数据后，更新为：

```html
<body>
  <div id="__next">
    <p>Your dtat: json...</p>
  </div>
</body>
```



第二种方法是在客户端使用数据获取的库比如 [SWR](https://swr.vercel.app/)（也是 Next.js 团队开发的）或 [TanStack Query](https://tanstack.com/query/latest/)，举个例子：

```javascript
// pages/csr2.js
import useSWR from 'swr'
const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function Page() {
  const { data, error, isLoading } = useSWR(
    'https://jsonplaceholder.typicode.com/todos/1',
    fetcher
  )
 
  if (error) return <p>Failed to load.</p>
  if (isLoading) return <p>Loading...</p>
 
  return <p>Your Data: {data.title}</p>
}
```

效果同上



### SSR

#### 概念介绍

**SSR，英文全称“Server-side Rendering”，中文翻译“服务端渲染”。顾名思义，渲染工作主要在服务端执行。**

比如打开一篇博客文章页面，没有必要每次都让客户端请求，万一客户端网速不好呢，那干脆由服务端直接请求接口、获取数据，然后渲染成静态的 HTML 文件返回给用户。

虽然同样是发送请求，但通常服务端的环境（网络环境、设备性能）要好于客户端，所以最终的渲染速度（首屏加载时间）也会更快。

虽然总体速度是更快的，但因为 CSR 响应时只用返回一个很小的 HTML，SSR 响应还要请求接口，渲染 HTML，所以其响应时间会更长，对应到性能指标 TTFB (Time To First Byte)，SSR 更长。

> getServerSideProps由服务端执行，也就是调用接口在浏览器控制台是看不到的



#### Next.js 实现 SSR

Next.js 支持 SSR，我们使用 Pages Router 写个 demo：

```javascript
// pages/ssr.js
export default function Page({ data }) {
  return <p>{JSON.stringify(data)}</p>
}
 
export async function getServerSideProps() {
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos`)
  const data = await res.json()
 
  return { props: { data } }
}
```

使用 SSR，你需要导出一个名为 `getServerSideProps`的 async 函数。这个函数会在每次请求的时候被调用。返回的数据会通过组件的 props 属性传递给组件。服务端会在每次请求的时候编译 HTML 文件返回给客户端。



### SSG

#### 3.1. 概念介绍

**SSG，英文全称“Static Site Generation”，中文翻译“静态站点生成”。**

SSG 会在构建阶段，就将页面编译为静态的 HTML 文件。

比如打开一篇博客文章页面，既然所有人看到的内容都是一样的，没有必要在用户请求页面的时候，服务端再请求接口。干脆先获取数据，提前编译成 HTML 文件，等用户访问的时候，直接返回 HTML 文件。这样速度会更快。再配上 CDN 缓存，速度就更快了。

所以能用 SSG 就用 SSG。“在用户访问之前是否能预渲染出来？”如果能，就用 SSG。

#### Next.js 实现 SSG

Next.js 支持 SSG。当不获取数据时，默认使用的就是 SSG。我们使用 Pages Router 写个 demo：

```javascript
// pages/ssg1.js
function About() {
  return <div>About</div>
}
 
export default About
```

像这种没有数据请求的页面，Next.js 会在构建的时候生成一个单独的 HTML 文件。

不过 Next.js 默认没有导出该文件。如果你想看到构建生成的 HTML 文件，修改 `next.config.js` 文件：

```javascript
const nextConfig = {
  output: 'export'
}
 
module.exports = nextConfig
```

再执行 `npm run build`，你就会在根目录下看到生成的 `out` 文件夹，里面存放了构建生成的 HTML 文件。

那如果要获取数据呢？这分两种情况。

第一种情况，页面内容需要获取数据。就比如博客的文章内容需要调用 API 获取。Next.js 提供了 `getStaticProps`。写个 demo：

```javascript
// pages/ssg2.js
export default function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}

export async function getStaticProps() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts')
  const posts = await res.json()
  return {
    props: {
      posts,
    },
  }
}
```

`getStaticProps`会在构建的时候被调用，并将数据通过 props 属性传递给页面。

（还记得 `getServerSideProps` 吗？两者在用法上类似，不过 `getServerSideProps` 是在每次请求的时候被调用，`getStaticProps` 在每次构建的时候）

第二种情况，是页面路径需要获取数据。

这是什么意思呢？就比如数据库里有 100 篇文章，我肯定不可能自己手动定义 100 个路由，然后预渲染 100 个 HTML 吧。Next.js 提供了 `getStaticPaths`用于定义预渲染的路径。它需要搭配动态路由使用。写个 demo：

新建 `/pages/post/[id].js`，代码如下：

```javascript
// /pages/post/[id].js
export default function Blog({ post }) {
  return (
    <>
      <header>{post.title}</header>
      <main>{post.body}</main>
    </>
  )
}

export async function getStaticPaths() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts')
  const posts = await res.json()
 
  const paths = posts.map((post) => ({
    params: { id: String(post.id) },
  }))

  // { fallback: false } 意味着当访问其他路由的时候返回 404
  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  // 如果路由地址为 /posts/1, params.id 为 1
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${params.id}`)
  const post = await res.json()
 
  return { props: { post } }
}
```

其中，`getStaticPaths` 和 `getStaticProps`都会在构建的时候被调用，`getStaticPaths` 定义了哪些路径被预渲染，`getStaticProps`获取路径参数，请求数据传给页面。

当你执行 `npm run build`的时候，就会看到 post 文件下生成了一堆 HTML 文件。



### ISR

#### 概念介绍

**ISR，英文全称“Incremental Static Regeneration”，中文翻译“增量静态再生”。**

还是打开一篇博客文章页面，博客的主体内容也许是不变的，但像比如点赞、收藏这些数据总是在变化的吧。使用 SSG 编译成 HTML 文件后，这些数据就无法准确获取了，那你可能就退而求其次改为 SSR 或者 CSR 了。

考虑到这种情况，Next.js 提出了 ISR。当用户访问了这个页面，第一次依然是老的 HTML 内容，但是 Next.js 同时静态编译成新的 HTML 文件，当你第二次访问或者其他用户访问的时候，就会变成新的 HTML 内容了。你可以在[demo](https://on-demand-isr.vercel.app/) 中测试 ISR 效果。



#### Next.js 实现 ISR

Next.js 支持 ISR，并且使用的方式很简单。你只用在 `getStaticProps` 中添加一个 `revalidate`即可。我们基于 SSG 的示例代码上进行修改：

```javascript
// pages/post/[id].js
// 保持不变
export default function Blog({ post }) {
  return (
    <>
      <header>{post.title}</header>
      <main>{post.body}</main>
    </>
  )
}

// fallback 的模式改为 'blocking'
export async function getStaticPaths() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts')
  const posts = await res.json()
 
  const paths = posts.slice(0, 10).map((post) => ({
    params: { id: String(post.id) },
  }))
 
  return { paths, fallback: 'blocking' }
}

// 使用这种随机的方式模拟数据改变
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// 多返回了 revalidata 属性
export async function getStaticProps({ params }) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${getRandomInt(100)}`)
  const post = await res.json()
 
  return { 
    props: { post }, 
    revalidate: 10
  }
}
```

`revalidate`表示当发生请求的时候，至少间隔多少秒才更新页面。

这听起来有些抽象，以 `revalidate: 10` 为例，在初始请求后和接下来的 10 秒内，页面都会使用之前构建的 HTML。10s 后第一个请求发生的时候，依然使用之前编译的 HTML。但 Next.js 会开始构建更新 HTML，从下个请求起就会使用新的 HTML。（如果构建失败了，就还是用之前的，等下次再触发更新）

当你在本地使用 `next dev`运行的时候，`getStaticProps`会在每次请求的时候被调用。所以如果你要测试 ISR 功能，先构建出生产版本，再运行生产服务。也就是说，测试 ISR 效果，用这俩命令：

```javascript
next build // 或 npm run build
next start // 或 npm run start
```



页面刷新后，文章内容发生变化。然后 10s 内的刷新，页面内容都没有变化。10s 后的第一次刷新触发了更新，10s 后的第二次刷新内容发生了变化。

注意这次 `getStaticPaths` 函数的返回为`return { paths, fallback: 'blocking' }`。它表示构建的时候就渲染 `paths` 里的这些路径。如果请求其他的路径，那就执行服务端渲染。在上节 SSG 的例子中，我们设置 `fallback`为 false，它表示如果请求其他的路径，就会返回 404 错误。

所以在这个 ISR demo 中，如果请求了尚未生成的路径，Next.js 会在第一次请求的时候就执行服务端渲染，编译出 HTML 文件，再请求时就从缓存里返回该 HTML 文件。SSG 优雅降级到 SSR。



### 支持混合使用

在写 demo 的时候，想必你已经发现了，其实每个页面你并没有专门声明使用哪种渲染模式，Next.js 是自动判断的。所以一个 Next.js 应用里支持混合使用多种渲染模式。

当页面有 `getServerSideProps`的时候，Next.js 切成 SSR 模式。没有 `getServerSideProps` 则会预渲染页面为静态的 HTML。那你可能会问，CSR 呢？就算用 CSR 模式，Next.js 也要提供一个静态的 HTML，所以还是要走预渲染这步的，只不过相比 SSG，渲染的内容少了些。

页面可以是 SSG + CSR 的混合，由 SSG 提供初始的静态页面，提高首屏加载速度。CSR 动态填充内容，提供交互能力。举个例子：

```javascript
// pages/postList.js
import React, { useState } from 'react'

export default function Blog({ posts }) {
  const [data, setData] = useState(posts)
  return (
    <>
      <button onClick={async () => {
          const res = await fetch('https://jsonplaceholder.typicode.com/posts')
          const posts = await res.json()
          setData(posts.slice(10, 20))
      }}>换一批</button>
      <ul>
        {data.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </>
  )
}

export async function getStaticProps() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts')
  const posts = await res.json()
  return {
    props: {
      posts: posts.slice(0, 10),
    },
  }
}
```

初始的文章列表数据就是在构建的时候写入 HTML 里的，在点击换一批按钮的时候，则是在客户端发送请求重新渲染内容。





















































































































