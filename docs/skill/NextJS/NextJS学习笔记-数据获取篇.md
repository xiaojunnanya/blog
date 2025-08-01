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

































































