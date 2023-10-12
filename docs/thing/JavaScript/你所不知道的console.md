---
id: noconsole
slug: /javascript/noconsole
title: 你所不知道的console
date: 2002-09-26
authors: 鲸落
tags: [Javascript]
keywords: [Javascript]
---

## 首页

**`Console`** 对象提供了浏览器控制台调试的接口。在不同浏览器上它的工作方式可能不一样，但通常都会提供一套共性的功能。

`Console` 对象可以从任何全局对象中访问到，如 浏览器作用域上的Window，以及通过属性控制台作为 workers 中的特定变体的 [`WorkerGlobalScope` (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope)。可以通过 [`Window.console`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/console) 引用，也可以简单的通过 `console` 引用。例：`console.log("Failed to open the specified link");`



> 下面是我们在开发过程中经常使用的

## log

开发人员最常用的

**`console.log()`** 方法向 Web 控制台输出一条信息。这条信息可能是单个字符串（包括可选的替代字符串），也可能是一个或多个对象。



## time和timeEnd

在开发中也是比较常用的，用来计算其过程中执行的时间

**`console.time`**：你可以启动一个计时器来跟踪某一个操作的占用时长。每一个计时器必须拥有唯一的名字，页面中最多能同时运行 10,000 个计时器。当以此计时器名字为参数调用`console.timeEnd()`]时，浏览器将以毫秒为单位，输出对应计时器所经过的时间。

- 语法：`console.time(timerName);`
- 参数：
  - timerName：新计时器的名字。用来标记这个计时器，作为参数调用 `console.timeEnd()`]可以停止计时并将经过的时间在终端中打印出来。



## count

**`console.count()`** 方法会记录调用 `count()` 的次数

- 语法：`console.count()`
- 参数：
  - [`label`](https://developer.mozilla.org/zh-CN/docs/Web/API/console/count#label) 可选：一个字符串。如果给定，`count()` 会输出带有该标签的调用次数。如果未提供，调用 `count()` 的行为就像是带有“default”标签一样。

- 返回值：无

示例：

```js
let user = "";

function greet() {
  console.count();
  return `hi ${user}`;
}

user = "bob";
greet();
user = "alice";
greet();
greet();
console.count();
```

```js
// 控制台输出看起来像这样：标签显示为 default，因为没有提供明确的标签
"default: 1"
"default: 2"
"default: 3"
"default: 4"
```

如果我们将 `user` 变量作为第一次调用 `count()` 函数时的 `label` 参数传入，并将字符串”alice“作为第二次调用的参数：

```js
let user = "";

function greet() {
  console.count(user);
  return `hi ${user}`;
}

user = "bob";
greet();
user = "alice";
greet();
greet();
console.count("alice");
```

```js
// 控制台输出看起来像这样：
"bob: 1"
"alice: 1"
"alice: 2"
"alice: 3"
```



## dir

`console.dir()` 方法可以显示指定 JavaScript 对象的属性列表，并以交互式的形式展现。输出结果呈现为分层列表，包含展开/折叠的三角形图标，可用于查看子对象的内容。

换句话说，`console.dir()` 是一种在控制台中查看指定 JavaScript 对象的所有属性的方法，开发人员可以通过这种方式轻松获取对象的属性。

- 语法：`console.dir(obj)`
- 参数：
  - object：应输出其属性的 JavaScript 对象。
- 返回值：无



## table

`Console.table()`：将数据以表格的形式显示

这个方法需要一个必须参数 `data`，`data` 必须是一个数组或者是一个对象；还可以使用一个可选参数 `columns`

它会把数据 `data` 以表格的形式打印出来。数组中的每一个元素（或对象中可枚举的属性）将会以行的形式显示在表格中

表格的第一列是 `index`。如果数据 `data` 是一个数组，那么这一列的单元格的值就是数组的索引。如果数据是一个对象，那么它们的值就是各对象的属性名称。

- 语法：`console.table(data [, columns])`
- 参数：
  - data：要显示的数据。必须是数组或对象
  - columns：一个包含列的名称的数组





## 了解其他的console

- `Console.countReset()`：重置指定标签的计数器值
- `console.clear()` 方法会清空控制台，但前提是该控制台允许清空。像浏览器运行的图形控制台就允许清空，而像 Node 运行的终端上显示的控制台则不支持它，调用该方法将不会产生任何效果（也不会报错）
- `console.debug()` 方法将一条消息输出到 web 控制台，消息的日志级别为“debug”。只有在控制台配置为显示调试输出时，才会向用户显示该消息。在大多数情况下，日志级别在控制台 UI 中进行配置。该日志级别可能对应于 **`Debug`** 或 **`Verbose`** 日志级别

- `Console.error()`：打印一条错误信息

- `Console.info()`：打印资讯类说明信息
- `Console.warn()`：打印一个警告信息









