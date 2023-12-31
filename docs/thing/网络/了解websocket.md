---
id: websocket
slug: /network/websocket
title: 了解Websocket
date: 2002-09-26
authors: 鲸落
tags: [网络, websocket]
keywords: [网络, websocket]
---

## 什么是WebSocket

WebSocket 是基于 TCP 的一种新的应用层网络协议。它实现了浏览器与服务器全双工通信，即允许服务器主动发送信息给客户端。

因此，在 WebSocket 中，浏览器和服务器只需要完成一次握手，两者之间就直接可以创建持久性的连接，并进行双向数据传输，客户端和服务器之间的数据交换变得更加简单。





## WebSocket的特点

- 实时性好：WebSocket 可以实现实时交互和即时通信，对于在线游戏、聊天室、股票行情等实时性要求高的应用场景非常重要
- 数据传输量小：WebSocket 的协议头和数据格式比 HTTP 更小，可以大大减少网络传输的开销和延迟
- 双向通信：WebSocket 支持客户端和服务器之间的双向通信，客户端和服务器之间可以直接发送消息，不需要像 HTTP 协议那样每次都发送请求和响应
- 长连接：WebSocket 的连接可以保持长时间，而不需要像 HTTP 协议那样在每次请求和响应之间重新建立连接。





## WebSocket协议的工作流程

### 建立连接之前

WebSocket复用了HTTP的握手通道。具体指的是，客户端通过HTTP请求与WebSocket服务端协商升级协议。协议升级完成后，后续的数据交换则遵照WebSocket的协议。

**首先在WebSocket建立连接之前需要经过TCP三次握手，建立了TCP连接后，客户端和服务器之间才能开始进行WebSocket握手**



### 建立连接

**客户端发起握手请求**：首先，客户端发起协议升级请求，当前请求也是有一定的要求的

- 请求方式必须是`GET`，且HTTP的版本必须是`1.1`
- 请求头中包含`Connection:Upgrade`字段，表示要升级协议
- 请求头中包含`Upgrade: websocket`字段，表示要升级到websocket协议
- 请求头中包含`Sec-WebSocket-Version: 13`字段，表示websocket的版本
- 包含一个`Sec-WebSocket-Key`头部，其值是一个随机生成的16字节的Base64编码字符串，用于安全校验

**服务器响应握手请求：**

- 服务器接收到WebSocket握手请求后，会进行一系列校验，包括检查"Upgrade"头部、"Connection"头部和"Sec-WebSocket-Key"头部等。
- 如果服务器支持WebSocket，并且请求合法，将返回状态码101，表示升级成功，同时在响应头中也会包含一些额外的信息。
- 如`Upgrade: websocket`和`Connection: Upgrade`和`Sec-WebSocket-Accept`
- `Sec-WebSocket-Accept`是根据客户端请求首部的`Sec-WebSocket-Key`计算出来的

**一旦服务器发送了状态码101，连接就会从HTTP协议切换到WebSocket协议。此时，客户端和服务器之间的连接就是WebSocket连接了，双方可以进行全双工通信。**



### 数据传输

WebSocket 的每条消息可能会被切分成多个数据帧（最小单位）。发送端会将消息切割成多个帧发送给接收端，接收端接收消息帧，并将关联的帧重新组装成完整的消息。



### 维持连接

为了保持连接的活跃性，客户端和服务器通常会定期发送心跳消息。心跳消息是一个特殊的数据帧，它没有有效载荷，仅用于检测连接是否仍然有效



### 关闭连接

WebSocket连接的关闭过程涉及两个阶段：**主动关闭和被动关闭**。任何一方都可以主动发起关闭，另一方则被动关闭。

**主动关闭连接**：

- 主动发起关闭：当一方决定关闭WebSocket连接时，它会发送一个特殊的关闭帧（Close Frame）给对方，表示希望关闭连接。在关闭帧的有效载荷中，通常包含一个状态码（Status Code）和一个可选的关闭原因（Closing Reason）
- 被动响应：收到关闭帧的一方（被动方）会发送一个回应的关闭帧，其中的状态码和关闭原因可以是与之前的关闭帧不同的值。这个关闭帧作为确认，告知对方收到了关闭请求，并准备好关闭连接
- 等待关闭：发送关闭帧的一方接收到对方的关闭帧后，会等待一段时间（通常是几秒钟），以确保对方已经处理完关闭请求。在等待期间，双方仍然可以交换其他数据帧
- 关闭连接：一旦双方都确认关闭请求，它们就会关闭WebSocket连接，即关闭TCP连接。这样，连接就彻底关闭了，不再可用于通信

**被动关闭连接**：

- 异常关闭：有时候WebSocket连接可能会因为某些异常情况而被动关闭，例如网络故障、服务器故障或连接超时等。当这种情况发生时，一方的WebSocket实现会自动关闭连接，并发送关闭帧给对方，通知连接关闭的原因
- 响应关闭帧：收到关闭帧的一方也会发送一个回应的关闭帧，确认收到了关闭请求
- 等待关闭：和主动关闭一样，收到关闭帧的一方会等待一段时间，确保对方已经处理完关闭请求
- 关闭连接：一旦双方都确认关闭请求，它们就会关闭WebSocket连接，即关闭TCP连接

**在WebSocket连接关闭的过程中，并没有四次挥手，只有两次握手来进行关闭帧的交换确认。一旦WebSocket关闭握手完成，底层的TCP连接才会进行四次挥手，最终关闭连接。**





## Sec-WebSocket-Key/Accept的作用

`Sec-WebSocket-Key/Sec-WebSocket-Accept`在主要作用在于提供基础的防护，减少恶意连接、意外连接

作用大致归纳如下：

- 避免服务端收到非法的websocket连接（比如http客户端不小心请求连接websocket服务，此时服务端可以直接拒绝连接）
- 确保服务端理解websocket连接。因为ws握手阶段采用的是http协议，因此可能ws连接是被一个http服务器处理并返回的，此时客户端可以通过Sec-WebSocket-Key来确保服务端认识ws协议。（并非百分百保险，比如总是存在那么些无聊的http服务器，光处理Sec-WebSocket-Key，但并没有实现ws协议）
- 用浏览器里发起ajax请求，设置header时，Sec-WebSocket-Key以及其他相关的header是被禁止的。这样可以避免客户端发送ajax请求时，意外请求协议升级（websocket upgrade）
- 可以防止反向代理返回错误的数据。比如反向代理前后收到两次ws连接的升级请求，反向代理把第一次请求的返回给cache住，然后第二次请求到来时直接把cache住的请求给返回（无意义的返回）
- Sec-WebSocket-Key主要目的并不是确保数据的安全性，因为Sec-WebSocket-Key、Sec-WebSocket-Accept的转换计算公式是公开的，而且非常简单，最主要的作用是预防一些常见的意外情况（非故意的）

**强调：Sec-WebSocket-Key/Sec-WebSocket-Accept 的换算，只能带来基本的保障，但连接是否安全、数据是否安全、客户端/服务端是否合法的 ws客户端、ws服务端，其实并没有实际性的保证**





## WebSocket与HTTP的异同

##### 相同点

- 都是基于TCP的应用层协议。
- 都使用Request/Response模型进行连接的建立。
- 在连接的建立过程中对错误的处理方式相同，在这个阶段WS可能返回和HTTP相同的返回码。
- 都可以在网络中传输数据。

##### 不同点

- WS使用HTTP来建立连接，但是定义了一系列新的header，在HTTP中并不会使用。
- WS的连接不能通过中间人来转发，它必须是一个直接连接。
- WS连接建立之后，通信双方都可以在任何时刻向另一方发送数据。
- WS连接建立之后，数据的传输使用帧来传递，不再需要Request消息。
- WS的数据帧有序。





## 了解轮询和长轮询

在WebSocket之前，想要实现类似与聊天这样的功能主要有轮询和长轮询这样的技术



### 轮询

轮询是一种简单的实时通信技术，它的基本原理是客户端定期向服务器发送请求，查询是否有新的数据或消息。这个过程是周期性的，客户端在固定的时间间隔内发送HTTP请求，并等待服务器的响应。一旦有新的数据可用，服务器会在响应中返回数据给客户端。如果没有新数据，则服务器可能会返回一个空响应或者一个特定的标识，表示没有更新。



```js
setInterval(function() {
    $.get("/path/to/server", function(data, status) {
        console.log(data);
    });
}, 10000);
```

上面的程序会每隔10秒向服务器请求一次数据，并在数据到达后存储。这个实现方法通常可以满足简单的需求，然而同时也存在着很大的缺陷：在网络情况不稳定的情况下，服务器从接收请求、发送请求到客户端接收请求的总时间有可能超过10秒，而请求是以10秒间隔发送的，这样会导致接收的数据到达先后顺序与发送顺序不一致。于是出现了采用 setTimeout 的轮询方式：

```js
function poll() {
    setTimeout(function() {
        $.get("/path/to/server", function(data, status) {
            console.log(data);
            // 发起下一次请求
            poll();
        });
    }, 10000);
}
```

程序首先设置10秒后发起请求，当数据返回后再隔10秒发起第二次请求，以此类推。这样的话虽然无法保证两次请求之间的时间间隔为固定值，但是可以保证到达数据的顺序。



**缺点**：

- 轮询会导致频繁的HTTP请求和响应，即使没有新数据也会占用网络资源。
- 由于固定的轮询时间间隔，可能会导致数据的延迟，无法实现真正的实时通信。
- 在高并发环境下，大量的轮询请求可能会给服务器带来较大的负担。



### 长轮询

为了解决传统轮询的缺点，长轮询采用了一种稍微不同的方法。在长轮询中，客户端发送一个HTTP请求到服务器，但服务器并不立即响应。相反，服务器会将请求挂起（保持连接打开），直到有新数据可用或者超时发生。之后客户端再次发送request, 重复上次的动作。

长轮询允许服务器在有新数据时立即推送给客户端，避免了不必要的轮询开销。然而，它仍然需要频繁地发送HTTP请求，并且每个请求的响应时间较长，因此在高并发情况下，仍然存在性能和资源消耗的问题。

​	
