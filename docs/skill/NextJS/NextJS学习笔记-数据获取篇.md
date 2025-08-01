---
id: nextjs03
slug: /nextjs03
title: NextJS学习笔记 - 数据获取篇
date: 2002-09-26
authors: 鲸落
tags: [React, NextJs]
keywords: [React, NextJs]
---





## 数据获取、缓存与重新验证

在 Next.js 中如何获取数据呢？

Next.js 优先推荐使用原生的 fetch 方法，因为 Next.js 拓展了原生的 fetch 方法，为其添加了缓存和更新缓存(重新验证)的机制。

这样做的好处在于可以自动复用请求数据，提高性能。坏处在于如果你不熟悉，经常会有一些“莫名奇妙”的状况出现……

让我们来看看具体如何使用吧。



### 服务端使用 fetch

#### 基本用法

Next.js 拓展了原生的 [fetch Web API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)，可以为**服务端的每个请求**配置缓存（caching）和重新验证（ revalidating）行为。

你可以在**服务端组件、路由处理程序、Server Actions** 中搭配 `async`/`await` 语法使用 fetch。

举个例子：

```javascript
// app/page.js
async function getData() {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos')
  if (!res.ok) {
    // 由最近的 error.js 处理
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export default async function Page() {
  const data = await getData()
  return <main>{JSON.stringify(data)}</main>
}
```



#### 默认缓存

默认情况下，Next.js 会自动缓存服务端 `fetch` 请求的返回值（背后用的是[数据缓存（Data Cache）](https://juejin.cn/book/7307859898316881957/section/7309077169735958565#heading-6)）。

```javascript
// fetch 的 cache 选项用于控制该请求的缓存行为
// 默认就是 'force-cache', 平时写的时候可以省略
fetch('https://...', { cache: 'force-cache' })
```

但这些情况默认不会自动缓存：

1. 在 Server Action 中使用的时候
2. 在定义了非 GET 方法的路由处理程序中使用的时候

**简单的来说，在服务端组件和只有 GET 方法的路由处理程序中使用 fetch，返回结果会自动缓存。**



#### 重新验证

**在 Next.js 中，清除数据缓存并重新获取最新数据的过程就叫做重新验证（Revalidation）。**

Next.js 提供了两种方式重新验证：

- 一种是**基于时间的重新验证（Time-based revalidation）**，即经过一定时间并有新请求产生后重新验证数据，适用于不经常更改且新鲜度不那么重要的数据。
- 一种是**按需重新验证（On-demand revalidation）**，根据事件手动重新验证数据。按需重新验证又可以使用基于标签（tag-based）和基于路径（path-based）两种方法重新验证数据。适用于需要尽快展示最新数据的场景。



**基于时间的重新验证**

使用基于时间的重新验证，你需要在使用 fetch 的时候设置 `next.revalidate` 选项（以秒为单位）：

```javascript
fetch('https://...', { next: { revalidate: 3600 } })
```

或者通过[路由段配置项](https://juejin.cn/book/7307859898316881957/section/7309079033223446554)进行配置，使用这种方法，它会重新验证该路由段所有的 `fetch` 请求。

```javascript
// layout.jsx | page.jsx | route.js
export const revalidate = 3600
```

注：在一个静态渲染的路由中，如果你有多个请求，每个请求设置了不同的重新验证时间，将会使用最短的时间用于所有的请求。而对于动态渲染的路由，每一个 `fetch`请求都将独立重新验证。



**按需重新验证**

使用按需重新验证，在**路由处理程序或者 Server Action** 中通过路径（ [revalidatePath](https://juejin.cn/book/7307859898316881957/section/7309079586296791050#heading-12)） 或缓存标签 [revalidateTag](https://juejin.cn/book/7307859898316881957/section/7309079586296791050#heading-23) 实现。



**错误处理和重新验证**

如果在尝试重新验证的过程中出现错误，缓存会继续提供上一个重新生成的数据，而在下一个后续请求中，Next.js 会尝试再次重新验证数据。



#### 退出数据缓存

当 `fetch` 请求满足这些条件时都会退出数据缓存：

*   `fetch` 请求添加了 `cache: 'no-store'` 选项
*   `fetch` 请求添加了 `revalidate: 0` 选项
*   `fetch` 请求在路由处理程序中并使用了 `POST` 方法
*   使用`headers` 或 `cookies` 的方法之后使用 `fetch`请求
*   配置了路由段选项 `const dynamic = 'force-dynamic'`
*   配置了路由段选项 `fetchCache` ，默认会跳过缓存
*   `fetch` 请求使用了 `Authorization`或者 `Cookie`请求头，并且在组件树中其上方还有一个未缓存的请求


在具体使用的时候，如果你不想缓存某个单独请求：

```javascript
// layout.js | page.js
fetch('https://...', { cache: 'no-store' })
```

不缓存多个请求，可以借助[路由段配置项](https://juejin.cn/book/7307859898316881957/section/7309079033223446554)：

```javascript
// layout.js | page.js
export const dynamic = 'force-dynamic'
```

**Next.js 推荐单独配置每个请求的缓存行为，这可以让你更精细化的控制缓存行为。**



### 服务端使用三方请求库

也不是所有时候都能使用 fetch 请求，如果你使用了不支持或者暴露 fetch 方法的三方库（如数据库、CMS 或 ORM 客户端），但又想实现数据缓存机制，那你可以使用 React 的 `cache` 函数和路由段配置项来实现请求的缓存和重新验证。


举个例子：

```javascript
// app/utils.js
import { cache } from 'react'
 
export const getItem = cache(async (id) => {
  const item = await db.item.findUnique({ id })
  return item
})
```

现在我们调用两次接口，但只会产生一次数据库查询。

注：这里的代码并不是完整可运行的，如果想要细致了解 React Cache 函数的特性，可以查看： [（技巧）当 Next.js 遇到频繁重复的数据库操作时，记住使用 React 的 cache 函数](https://juejin.cn/post/7348643498117038099#heading-5)



### 客户端使用路由处理程序

如果你需要在客户端组件中获取数据，可以在客户端调用路由处理程序。路由处理程序会在服务端被执行，然后将数据返回给客户端，适用于不想暴露敏感信息给客户端（比如 API tokens）的场景。

如果你使用的是服务端组件，无须借助路由处理程序，直接获取数据即可。



### 客户端使用三方请求库

你也可以在客户端使用三方的库如 [SWR](https://swr.vercel.app/) 或 [React Query](https://tanstack.com/query/latest) 来获取数据。这些库都有提供自己的 API 实现记忆请求、缓存、重新验证和更改数据。



### 建议与最佳实践



**尽可能在服务端获取数据**

尽可能在服务端获取数据，这样做有很多好处，比如：

1.  可以直接访问后端资源（如数据库）
2.  防止敏感信息泄漏
3.  减少客户端和服务端之间的来回通信，加快响应时间
4.  ...



**在需要的地方就地获取数据**

如果组件树中的多个组件使用相同的数据，无须先全局获取，再通过 props 传递，你可以直接在需要的地方使用 `fetch` 或者 React `cache` 获取数据，不用担心多次请求造成的性能问题，因为 `fetch` 请求会自动被记忆化。这也同样适用于布局，毕竟本来父子布局之间也不能传递数据。



**适当的时候使用 Streaming**

Streaming 和 `Suspense`都是 React 的功能，允许你增量传输内容以及渐进式渲染 UI 单元。页面可以直接渲染部分内容，剩余获取数据的部分会展示加载态，这也意味着用户不需要等到页面完全加载完才能与其交互。



**串行获取数据**

在 React 组件内获取数据时，有两种数据获取模式，并行和串行。

所谓串行数据获取，数据请求相互依赖，形成瀑布结构，这种行为有的时候是必要的，但也会导致加载时间更长。

所谓并行数据获取，请求同时发生并加载数据，这会减少加载数据所需的总时间。



我们先说说串行数据获取，直接举个例子：

```javascript
// app/artist/page.js
// ...
 
async function Playlists({ artistID }) {
  // 等待 playlists 数据
  const playlists = await getArtistPlaylists(artistID)
 
  return (
    <ul>
      {playlists.map((playlist) => (
        <li key={playlist.id}>{playlist.name}</li>
      ))}
    </ul>
  )
}
 
export default async function Page({ params: { username } }) {
  // 等待 artist 数据
  const artist = await getArtist(username)
 
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Playlists artistID={artist.id} />
      </Suspense>
    </>
  )
}
```

在这个例子中，`Playlists` 组件只有当 `Artist` 组件获得数据才会开始获取数据，因为 `Playlists` 组件依赖 `artistId` 这个 prop。这也很容易理解，毕竟只有先知道了是哪位艺术家，才能获取这位艺术家对应的曲目。

在这种情况下，你可以使用 `loading.js` 或者 React 的 `<Suspense>` 组件，展示一个即时加载状态，防止整个路由被数据请求阻塞，而且用户还可以与未被阻塞的部分进行交互。

关于阻塞数据请求：

*   一种防止出现串行数据请求的方法是在应用程序根部全局获取数据，但这会阻塞其下所有路由段的渲染，直到数据加载完毕。
*   任何使用 `await` 的 `fetch` 请求都会阻塞渲染和下方所有组件的数据请求，除非它们使用了 `<Suspense>` 或者 `loading.js`。另一种替代方式就是使用并行数据请求或者预加载模式。



要实现并行请求数据，你可以在使用数据的组件外定义请求，然后在组件内部调用，举个例子：

```javascript
import Albums from './albums'

// 组件外定义
async function getArtist(username) {
  const res = await fetch(`https://api.example.com/artist/${username}`)
  return res.json()
}
 
async function getArtistAlbums(username) {
  const res = await fetch(`https://api.example.com/artist/${username}/albums`)
  return res.json()
}
 
export default async function Page({ params: { username } }) {
  // 组件内调用，这里是并行的
  const artistData = getArtist(username)
  const albumsData = getArtistAlbums(username)
 
  // 等待 promise resolve
  const [artist, albums] = await Promise.all([artistData, albumsData])
 
  return (
    <>
      <h1>{artist.name}</h1>
      <Albums list={albums}></Albums>
    </>
  )
}
```

在这个例子中，`getArtist` 和 `getArtistAlbums` 函数都是在 `Page` 组件外定义，然后在 `Page` 组件内部调用。用户需要等待两个 promise 都 resolve 后才能看到结果。

为了提升用户体验，可以使用 Suspense 组件来分解渲染工作，尽快展示出部分结果。



### 使用 React `cache` `server-only` 和预加载模式

你可以将 `cache` 函数，`preload` 模式和 [server-only](https://juejin.cn/book/7307859898316881957/section/7309076661532622885#heading-15) 包一起使用，创建一个可在整个应用使用的数据请求工具函数。

```javascript
// utils/get-article.js
import { cache } from 'react'
import 'server-only'
 
export const preloadArticle = (id) => {
  void getArticle(id)
}
 
export const getArticle = cache(async (id) => {
  // ...
})
```

现在，你可以提前获取数据、缓存返回结果，并保证数据获取只发生在服务端。此外，布局、页面、组件都可以使用 `utils/get-article.js`

注：如果想要细致了解 preload 函数和 server-only 以及 cache 的特性，可以查看： [（技巧）当 Next.js 遇到频繁重复的数据库操作时，记住使用 React 的 cache 函数](https://juejin.cn/post/7348643498117038099#heading-5)



:::info 详解

这一段是在讲 **Next.js 的 Server Component 模式下如何写一个服务端专用、自动缓存的数据获取工具函数**，结合了：

- React 的 `cache`（缓存函数结果）
- `server-only`（限制只能服务端用）
- preload（预加载机制）



**背景**

在 Next.js App Router 中（使用 React Server Components），我们常常需要在服务端获取数据，但又希望：

- 数据只在服务端获取（不会被打包进客户端）
- 同一个参数的请求只发一次（避免重复 fetch）
- 可以手动「预加载」，实现延迟加载、提前加载的效果



**代码解释**

- 第一句：`import { cache } from 'react'`
  - `cache(fn)` 会返回一个**缓存版本的函数**
  - 当你用相同参数调用它多次，只会真正执行一次
  - 类似“记忆化”函数（Memoization）。
- 第二句：`import 'server-only'`
  - 这是一个特殊的标志语句，告诉 **Next.js 构建工具**：这个模块只能在服务端使用，如果被客户端代码引用，会报错。
  - 它的作用是为了**安全、性能和构建体积**：
    - 避免把 `getArticle` 打包进客户端
    - 防止客户端访问到服务端接口（可能暴露 secret）
- `getArticle = cache(async (id) => { ... })`
  - 这是你真正获取文章数据的函数。
  - 它是缓存过的，**相同参数只 fetch 一次**。
  - 你可以在布局、页面、组件中反复用这个函数，它只发一次请求。
- `preloadArticle(id)`
  - 这是你用来**“提前加载文章”**的工具。
  - 它调用 `getArticle(id)` 但不等待结果，只是触发。
  - 比如你在页面加载时预取接下来用户可能要看的文章，配合交互：`onMouseEnter={() => preloadArticle('123')}`。用户 hover 的时候先预取数据，等点进去时已经加载好了。



需要注意的是：`cache` 和 `'server-only'` 都**只能在 Server Component 中使用**，**不能用于客户端组件（带 `use client`）**



**示例代码**

1. 封装数据请求函数（服务端专用）

```ts
// utils/get-article.ts
import { cache } from 'react'
import 'server-only'

export const getArticle = cache(async (id: string) => {
  // 模拟服务端请求
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)

  if (!res.ok) throw new Error('Failed to fetch article')
  return res.json()
})

// 预加载函数
export const preloadArticle = (id: string) => {
  void getArticle(id)
}
```

2. 页面使用 `getArticle`

```tsx
// app/article/[id]/page.tsx
import { getArticle } from '@/utils/get-article'

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await getArticle(params.id)

  return (
    <div>
      <h1>{article.title}</h1>
      <p>{article.body}</p>
    </div>
  )
}
```

3. 客户端组件中使用 `preloadArticle`

```tsx
// components/ArticleLink.tsx
'use client'

import Link from 'next/link'
import { preloadArticle } from '@/utils/get-article'

export function ArticleLink({ id, title }: { id: string; title: string }) {
  return (
    <Link
      href={`/article/${id}`}
      onMouseEnter={() => preloadArticle(id)} // 悬停时预取数据
    >
      {title}
    </Link>
  )
}
```

:::



## Server Actions























































