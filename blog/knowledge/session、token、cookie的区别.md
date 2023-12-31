---
slug: /sessionTokenCookie
title: session、token、cookie的区别
date: 2023-07-23
authors: jl
tags: [知识点, js ]
keywords: [知识点, js ]
---

## 写在前面

我们知道，HTTP 是无状态的。也就是说，HTTP 请求方和响应方间无法维护状态，都是一次性的，它不知道前后的请求都发生了什么。

但有的场景下，我们需要维护状态。最典型的，一个用户登陆微博，发布、关注、评论，都应是在登录后的用户状态下的。我们知道，HTTP 是无状态的。也就是说，HTTP 请求方和响应方间无法维护状态，都是一次性的，它不知道前后的请求都发生了什么。

但有的场景下，我们需要维护状态。最典型的，一个用户登陆微博，发布、关注、评论，都应是在登录后的用户状态下的。

Session 、 Cookie 和 token 的主要目的就是为了弥补 HTTP 的无状态特性。



## 什么是cookie

- **cookie 存储在客户端：** cookie 是服务器发送到用户浏览器并保存在本地的一小块数据，它会在浏览器下次向同一服务器再发起请求时被携带并发送到服务器上。

- **cookie 是不可跨域的：** 每个 cookie 都会绑定单一的域名，无法在别的域名下获取使用，**一级域名和二级域名之间是允许共享使用的**（**靠的是 domain）**。
  - Domain属性指定浏览器发出 HTTP 请求时，哪些域名要附带这个 Cookie。如果没有指定该属性，浏览器会默认将其设为当前 URL 的一级域名，比如 [www.example.com](https://link.juejin.cn?target=http%3A%2F%2Fwww.example.com) 会设为 example.com，而且以后如果访问example.com的任何子域名，HTTP 请求也会带上这个 Cookie。如果服务器在Set-Cookie字段指定的域名，不属于当前域名，浏览器会拒绝这个 Cookie。



## 什么是session

- **session 是另一种记录服务器和客户端会话状态的机制**
- **session 是基于 cookie 实现的，session 存储在服务器端，sessionId 会被存储到客户端的cookie 中**



## session验证流程

- 用户第一次请求服务器的时候，服务器根据用户提交的相关信息，创建对应的 Session
- 请求返回时将此 Session 的唯一标识信息 SessionID 返回给浏览器
- 浏览器接收到服务器返回的 SessionID 信息后，会将此信息存入到 Cookie 中，同时 Cookie 记录此 SessionID 属于哪个域名
- 当用户第二次访问服务器的时候，请求会自动判断此域名下是否存在 Cookie 信息，如果存在自动将 Cookie 信息也发送给服务端，服务端会从 Cookie 中获取 SessionID，再根据 SessionID 查找对应的 Session 信息，如果没有找到说明用户没有登录或者登录失效，如果找到 Session 证明用户已经登录可执行后面操作。

根据以上流程可知，**SessionID 是连接 Cookie 和 Session 的一道桥梁**，大部分系统也是根据此原理来验证用户登录状态。



## cookie和session的区别

- **安全性：** Session 比 Cookie 安全，Session 是存储在服务器端的，Cookie 是存储在客户端的。
- **存取值的类型不同**：Cookie 只支持存字符串数据，想要设置其他类型的数据，需要将其转换成字符串，Session 可以存任意数据类型。
- **有效期不同：** Cookie 可设置为长时间保持，比如我们经常使用的默认登录功能，Session 一般失效时间较短，客户端关闭（默认情况下）或者 Session 超时都会失效
- **存储大小不同：** 单个 Cookie 保存的数据不能超过 4K，Session 可存储数据远高于 Cookie，但是当访问量过多，会占用过多的服务器资源。



## 什么是token

Token是在身份验证和授权过程中广泛使用的一种机制，用于确认用户的身份并获得权限。它通常是一个字符串，由服务器生成并返回给客户端（例如，Web浏览器或移动应用程序）。Token在客户端和服务器之间进行传递，用于识别和验证用户。



## token身份验证流程

1. 客户端使用用户名跟密码请求登录
2. 服务端收到请求，去验证用户名与密码
3. 验证成功后，服务端会签发一个 token 并把这个 token 发送给客户端
4. 客户端收到 token 以后，会把它存储起来，比如放在 cookie 里或者 localStorage 里
5. 客户端每次向服务端请求资源的时候需要带着服务端签发的 token
6. 服务端收到请求，然后去验证客户端请求里面带着的 token ，如果验证成功，就向客户端返回请求的数据



- **每一次请求都需要携带 token，需要把 token 放到 HTTP 的 Header 里**
- **基于 token 的用户认证是一种服务端无状态的认证方式，服务端不用存放 token 数据。用解析 token 的计算时间换取 session 的存储空间，从而减轻服务器的压力，减少频繁的查询数据库**
- **token 完全由应用管理，所以它可以避开同源策略**



## token和session的区别

1. 定义和作用：
   - Token（令牌）：Token是在身份验证和授权过程中用于确认用户身份和获得权限的一种机制。它通常是一个字符串，由服务器生成并返回给客户端，用于在客户端和服务器之间传递身份验证和授权信息。
   - Session（会话）：Session是服务器端用于维护用户状态和身份信息的一种机制。服务器为每个客户端创建一个会话，用于跟踪用户的状态，通过Session ID标识不同的会话。
2. 存储位置：
   - Token：Token通常存储在客户端，比如浏览器的Cookie或本地存储中，以便客户端可以将其附加到后续请求中。
   - Session：Session数据通常存储在服务器端，而不是在客户端。服务器通过Session ID来标识每个客户端的会话状态。
3. 状态维护：
   - Token：Token是无状态的，服务器不需要在后端存储Token的状态信息，因为所有必要的信息都包含在Token本身中。
   - Session：Session是有状态的，服务器需要在后端维护会话状态信息，以便跟踪用户状态和保存临时数据。
4. 应用场景：
   - Token：Token在Web API、移动应用和分布式系统中广泛使用，特别适合跨服务器进行身份验证和授权。
   - Session：Session通常在传统的Web应用中使用，用于跟踪用户状态和保存用户相关的数据。
5. 安全性：
   - Token：由于Token包含所有必要的验证信息，因此必须谨慎处理，确保其不被非法获取或篡改，通常通过加密和签名来增加安全性。
   - Session：Session数据存储在服务器端，相对较安全，但仍然需要采取措施防止会话劫持和其他安全漏洞。



## 有了 Cookie 为什么还需要 Token

Cookie 作为 HTTP 规范，其出现历史久远，因此存在一些历史遗留问题，比如跨域限制等，并且 Cookie 作为 HTTP 规范中的内容，其存在默认存储以及默认发送的行为，存在一定的安全性问题。相较于 Cookie，token 需要自己存储，自己进行发送，不存在跨域限制，因此 Token 更加的灵活，没有 Cookie 那么多的“历史包袱”束缚，在安全性上也能够做更多的优化。



## Token 有什么 优势？

Token的无状态特性、安全性、可扩展性以及跨平台和跨语言的支持，使得它成为现代Web应用和API身份验证和授权的首选机制。