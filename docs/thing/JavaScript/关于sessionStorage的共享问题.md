---
id: sessionStorage
slug: /javascript/sessionStorage
title: 关于sessionStorage的共享问题
date: 2002-09-26
authors: 鲸落
tags: [Javascript]
keywords: [Javascript]
---

最近在看掘金的时候有一篇文章提到了关于sessionStorage的数据共享的问题，结合评论区来总结一下

## sessionStorage

在聊到sessionStorage那必然少不了localStorage，区别：

> `localStorage` 类似 `sessionStorage`，但其区别在于：
>
> 存储在 `localStorage` 的数据可以长期保留；而当页面会话结束——也就是说，当页面被关闭时，存储在 `sessionStorage` 的数据会被清除。



那么 **localstorage**可以在同一网站下共享数据吗？答案是可以的

```js
// 你可以在第一个tab里面存储一个数据
localStorage.setItem('name', 'abc')
// 在另外一个tab读取这个数据
localStorage.getItem('name') // abc
```



那么**sessionStorage**呢？[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/sessionStorage)

- 页面会话在浏览器打开期间一直保持，并且重新加载或恢复页面仍会保持原来的页面会话。
- **在新标签或窗口打开一个页面时会复制顶级浏览会话的上下文作为新会话的上下文，这点和 session cookie 的运行方式不同。**
- 打开多个相同的 URL 的 Tabs 页面，会创建各自的 `sessionStorage`。
- 关闭对应浏览器标签或窗口，会清除对应的 `sessionStorage`。



## 总结

sessionStorage 就是会话级别的存储（关键在于会话）

如何定义一个会话？

- 在A页面点击超链接（a标签）或者在控制台window.open打开页面B，都是属于当前页面的延续，属于一个会话。
- 在A页面已经打开的前提下，然后在新tab打开同域页面C，此时C和A页面无直接关系，不属于一个会话。

sessionSession并不是共享的，而是复制的。

- 也就是说，B页面打开的时候复制了A页面的sessionSession，仅仅是复制
- 此时，无论修改A页面的sessionStorage还是修改B页面的SessionStorage，都不会彼此影响。
- 也就是说两个页面存储的SessionStorage数据都不会同步变化（各自都是自己的存储，存储独立存在）。