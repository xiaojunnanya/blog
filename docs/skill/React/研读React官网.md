---
id: reactwebsite
slug: /reactwebsite
title: 研读React官网
date: 2002-09-26
authors: 鲸落
tags: [React]
keywords: [React]
---

## 相关地址

[HTML to JSX (transform.tools)](https://transform.tools/html-to-jsx)

[React 官方中文文档 (docschina.org)](https://react.docschina.org/)

[tsreact](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts)

[使用 TypeScript – React 中文文档 (docschina.org)](https://react.docschina.org/learn/typescript)

[React Hooks: not magic, just arrays](https://medium.com/@ryardley/react-hooks-not-magic-just-arrays-cd4f1857236e)



## React哲学

### 找出UI精简且完整的用State表示

现在考虑示例应用程序中的每一条数据:

1. 产品原始列表
2. 搜索用户键入的文本
3. 复选框的值
4. 过滤后的产品列表

其中哪些是 state 呢？标记出那些不是的:

- 随着时间推移 **保持不变**？如此，便不是 state。
- 通过 props **从父组件传递**？如此，便不是 state。
- 是否可以基于已存在于组件中的 state 或者 props **进行计算**？如此，它肯定不是state！

剩下的可能是 state。

让我们再次一条条验证它们:

1. 原始列表中的产品 **被作为 props 传递，所以不是 state**。
2. 搜索文本似乎应该是 state，因为它会随着时间的推移而变化，并且无法从任何东西中计算出来。
3. 复选框的值似乎是 state，因为它会随着时间的推移而变化，并且无法从任何东西中计算出来。
4. 过滤后列表中的产品 **不是 state，因为可以通过被原始列表中的产品，根据搜索框文本和复选框的值进行计算**。

这就意味着只有搜索文本和复选框的值是 state！非常好！





## 描述UI

### props

- 要传递 props，请将它们添加到 JSX，就像使用 HTML 属性一样。
- 要读取 props，请使用 `function Avatar({ person, size })` 解构语法。
- 你可以指定一个默认值，如 `size = 100`，用于缺少值或值为 `undefined` 的 props 。
- 你可以使用 `<Avatar {...props} />` JSX 展开语法转发所有 props，但不要过度使用它！
- 像 `<Card><Avatar /></Card>` 这样的嵌套 JSX，将被视为 `Card` 组件的 `children` prop。
- Props 是只读的时间快照：每次渲染都会收到新版本的 props。
- 你不能改变 props。当你需要交互性时，你可以设置 state。



### 条件渲染

> `if...else...` | `&&` | `三元运算符`

- **切勿将数字放在 `&&` 左侧.**
  - JavaScript 会自动将左侧的值转换成布尔类型以判断条件成立与否。然而，如果左侧是 `0`，整个表达式将变成左侧的值（`0`），React 此时则会渲染 `0` 而不是不进行渲染。
  - 例如，一个常见的错误是 `messageCount && <p>New messages</p>`。其原本是想当 `messageCount` 为 0 的时候不进行渲染，但实际上却渲染了 `0`。
    - 为了更正，可以将左侧的值改成布尔类型：`messageCount > 0 && <p>New messages</p>`。
    - 或者转为布尔值：`!!messageCount && <p>New messages</p>`



### 渲染列表

> `map` | `filter`

- `map/filter`的参数都是`(item, index, arr)`
- 有返回值，需要return

- 设置key：直接放在 `map()` 方法里的 JSX 元素一般都需要指定 `key` 值！

  - 这些 key 会告诉 React，每个组件对应着数组里的哪一项，所以 React 可以把它们匹配起来。这在数组项进行移动（例如排序）、插入或删除等操作时非常重要。一个合适的 `key` 可以帮助 React 推断发生了什么，从而得以正确地更新 DOM 树

  - Fragment 语法的简写形式 `<> </>` 无法接受 key 值，所以你只能要么把生成的节点用一个 `<div>` 标签包裹起来，要么使用长一点但更明确的 `<Fragment>` 写法

- key 需要满足的条件

  - **key 值在兄弟节点之间必须是唯一的。** 不过不要求全局唯一，在不同的数组中可以使用相同的 key。
  - **key 值不能改变**，否则就失去了使用 key 的意义！所以千万不要在渲染时动态地生成 key。



:::caution 陷阱

你可能会想直接把数组项的索引当作 key 值来用，实际上，如果你没有显式地指定 `key` 值，React 确实默认会这么做。但是数组项的顺序在插入、删除或者重新排序等操作中会发生改变，此时把索引顺序用作 key 值会产生一些微妙且令人困惑的 bug。

与之类似，请不要在运行过程中动态地产生 key，像是 `key={Math.random()}` 这种方式。这会导致每次重新渲染后的 key 值都不一样，从而使得所有的组件和 DOM 元素每次都要重新创建。这不仅会造成运行变慢的问题，更有可能导致用户输入的丢失。所以，使用能从给定数据中稳定取得的值才是明智的选择。

有一点需要注意，组件不会把 `key` 当作 props 的一部分。Key 的存在只对 React 本身起到提示作用。如果你的组件需要一个 ID，那么请把它作为一个单独的 prop 传给组件： `<Profile key={id} userId={id} />`。

:::



### 保持组件纯粹

**纯函数：**给定相同的输入，纯函数应总是返回相同的结果。

React 便围绕着纯函数的概念进行设计



:::note 使用严格模式检测不纯的计算 

在 React 中，你可以在渲染时读取三种输入：[props](https://react.docschina.org/learn/passing-props-to-a-component)，[state](https://react.docschina.org/learn/state-a-components-memory) 和 [context](https://react.docschina.org/learn/passing-data-deeply-with-context)。你应该始终将这些输入视为只读。

当你想根据用户输入 *更改* 某些内容时，你应该 [设置状态](https://react.docschina.org/learn/state-a-components-memory)，而不是直接写入变量。当你的组件正在渲染时，你永远不应该改变预先存在的变量或对象。

React 提供了 “严格模式”，在严格模式下开发时，它将会调用每个组件函数两次。**通过重复调用组件函数，严格模式有助于找到违反这些规则的组件**。

严格模式在生产环境下不生效，因此它不会降低应用程序的速度。如需引入严格模式，你可以用 `<React.StrictMode>` 包裹根组件。一些框架会默认这样做。

:::



### 副作用

函数式编程在很大程度上依赖于纯函数，但 **某些事物** 在特定情况下不得不发生改变。这是编程的要义！这些变动包括更新屏幕、启动动画、更改数据等，它们被称为 **副作用**。它们是 **“额外”** 发生的事情，与渲染过程无关。

在 React 中，**副作用通常属于 [事件处理程序](https://react.docschina.org/learn/responding-to-events)**。事件处理程序是 React 在你执行某些操作（如单击按钮）时运行的函数。即使事件处理程序是在你的组件 **内部** 定义的，它们也不会在渲染期间运行！ **因此事件处理程序无需是纯函数**。

如果你用尽一切办法，仍无法为副作用找到合适的事件处理程序，你还可以调用组件中的 [`useEffect`](https://react.docschina.org/reference/react/useEffect) 方法将其附加到返回的 JSX 中。这会告诉 React 在渲染结束后执行它。**然而，这种方法应该是你最后的手段**。

如果可能，请尝试仅通过渲染过程来表达你的逻辑。你会惊讶于这能带给你多少好处！





## 添加交互

### 事件

`onClick={handleClick}` 的结尾没有小括号！不要 **调用** 事件处理函数：你只需 **把函数传递给事件** 即可。当用户点击按钮时 React 会调用你传递的事件处理函数。



:::caution 陷阱

传递给事件处理函数的函数应直接传递，而非调用。例如：

| 传递一个函数（正确）             | 调用一个函数（错误）               |
| -------------------------------- | ---------------------------------- |
| `<button onClick={handleClick}>` | `<button onClick={handleClick()}>` |

区别很微妙。在第一个示例中，`handleClick` 函数作为 `onClick` 事件处理函数传递。这会让 React 记住它，并且只在用户点击按钮时调用你的函数。

在第二个示例中，`handleClick()` 中最后的 `()` 会在 [渲染](https://react.docschina.org/learn/render-and-commit) 过程中 **立即** 触发函数，即使没有任何点击。这是因为在 [JSX `{` 和 `}`](https://react.docschina.org/learn/javascript-in-jsx-with-curly-braces) 之间的 JavaScript 会立即执行。

当你编写内联代码时，同样的陷阱可能会以不同的方式出现：

| 传递一个函数（正确）                    | 调用一个函数（错误）              |
| --------------------------------------- | --------------------------------- |
| `<button onClick={() => alert('...')}>` | `<button onClick={alert('...')}>` |

如果按如下方式传递内联代码，并不会在点击时触发，而是会在每次组件渲染时触发：

```
// 这个 alert 在组件渲染时触发，而不是点击时触发！

<button onClick={alert('你点击了我！')}>
```

如果你想要定义内联事件处理函数，请将其包装在匿名函数中，如下所示：

```
<button onClick={() => alert('你点击了我！')}>
```

这里创建了一个稍后调用的函数，而不会在每次渲染时执行其内部代码。

在这两种情况下，你都应该传递一个函数：

- `<button onClick={handleClick}>` 传递了 `handleClick` 函数。
- `<button onClick={() => alert('...')}>` 传递了 `() => alert('...')` 函数。

:::



### 捕获阶段事件

极少数情况下，你可能需要捕获子元素上的所有事件，**即便它们阻止了传播**。例如，你可能想对每次点击进行埋点记录，传播逻辑暂且不论。那么你可以通过在事件名称末尾添加 `Capture` 来实现这一点：

```
<div onClickCapture={() => { /* 这会首先执行 */ }}>

  <button onClick={e => e.stopPropagation()} />

  <button onClick={e => e.stopPropagation()} />

</div>
```

每个事件分三个阶段传播：

1. 它向下传播，调用所有的 `onClickCapture` 处理函数。
2. 它执行被点击元素的 `onClick` 处理函数。
3. 它向上传播，调用所有的 `onClick` 处理函数。

捕获事件对于路由或数据分析之类的代码很有用，但你可能不会在应用程序代码中使用它们。



### state如同一张快照

[state 如同一张快照](https://react.docschina.org/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time)

- 设置 state 请求一次新的渲染。
- React 将 state 存储在组件之外，就像在架子上一样。
- 当你调用 `useState` 时，React 会为你提供**该次渲染** 的一张 state 快照。
- 变量和事件处理函数不会在重渲染中“存活”。每个渲染都有自己的事件处理函数。
- 每个渲染（以及其中的函数）始终“看到”的是 React 提供给**这个** 渲染的 state 快照。
- 你可以在心中替换事件处理函数中的 state，类似于替换渲染的 JSX。
- 过去创建的事件处理函数拥有的是创建它们的那次渲染中的 state 值。

感受几个代码：

```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        alert(number);
      }}>+5</button>
    </>
  )
}
```

```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setTimeout(() => {
          alert(number);
        }, 3000);
      }}>+5</button>
    </>
  )
}
```



**但是，万一你想在重新渲染之前读取最新的 state 怎么办？你应该使用 [状态更新函数](https://react.docschina.org/learn/queueing-a-series-of-state-updates)**

如果你想在下次渲染之前多次更新同一个 state，你可以像 `setNumber(n => n + 1)` 这样传入一个根据队列中的前一个 state 计算下一个 state 的 **函数**，而不是像 `setNumber(number + 1)` 这样传入 **下一个 state 值**。这是一种告诉 React “用 state 值做某事”而不是仅仅替换它的方法。

原理：[把一系列 state 更新加入队列](https://react.docschina.org/learn/queueing-a-series-of-state-updates#updating-the-same-state-multiple-times-before-the-next-render)

```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(n => n + 1);
        setNumber(n => n + 1);
        setNumber(n => n + 1);
      }}>+3</button>
    </>
  )
}
```



**如果你在替换 state 后更新 state 会发生什么** 

这个事件处理函数会怎么样？你认为 `number` 在下一次渲染中的值是什么？

```
<button onClick={() => {

  setNumber(number + 5);

  setNumber(n => n + 1);

}}>
```

这是事件处理函数告诉 React 要做的事情：

1. `setNumber(number + 5)`：`number` 为 `0`，所以 `setNumber(0 + 5)`。React 将 *“替换为 `5`”* 添加到其队列中。
2. `setNumber(n => n + 1)`：`n => n + 1` 是一个更新函数。 React 将 **该函数** 添加到其队列中。

在下一次渲染期间，React 会遍历 state 队列：

| 更新队列     | `n`           | 返回值      |
| ------------ | ------------- | ----------- |
| “替换为 `5`” | `0`（未使用） | `5`         |
| `n => n + 1` | `5`           | `5 + 1 = 6` |

React 会保存 `6` 为最终结果并从 `useState` 中返回。

**你可能已经注意到，`setState(x)` 实际上会像 `setState(n => x)` 一样运行，只是没有使用 `n`！**



### 更新state中的对象/数组

#### 概念

state 中可以保存任意类型的 JavaScript 值，包括对象/数组。但是，你不应该直接修改存放在 React state 中的对象/数组。相反，当你想要更新一个对象/数组时，你需要创建一个新的对象/数组（或者将其拷贝一份），然后将 state 更新为此对象/数组。



#### 表单

```jsx
setPerson({
  firstName: e.target.value, // 从 input 中获取新的 first name
  lastName: person.lastName,
  email: person.email
});

// 你可以使用 ... 对象展开 语法，这样你就不需要单独复制每个属性。
setPerson({
  ...person, // 复制上一个 person 中的所有字段
  firstName: e.target.value // 但是覆盖 firstName 字段 
});

// 表单中使用
setPerson({
  ...person,
  [e.target.name]: e.target.value
});
```



#### 嵌套对象

```jsx
const [person, setPerson] = useState({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
});

// 创建新对象
const nextArtwork = { ...person.artwork, city: 'New Delhi' };
const nextPerson = { ...person, artwork: nextArtwork };
setPerson(nextPerson);

// 复制
setPerson({
  ...person, // 复制其它字段的数据 
  artwork: { // 替换 artwork 字段 
    ...person.artwork, // 复制之前 person.artwork 中的数据
    city: 'New Delhi' // 但是将 city 的值替换为 New Delhi！
  }
});
```



#### 数组

在 JavaScript 中，数组只是另一种对象。同对象一样，**你需要将 React state 中的数组视为只读的**。这意味着你不应该使用类似于 `arr[0] = 'bird'` 这样的方式来重新分配数组中的元素，也不应该使用会直接修改原始数组的方法，例如 `push()` 和 `pop()`。

相反，每次要更新一个数组时，你需要把一个**新**的数组传入 state 的 setting 方法中。为此，你可以通过使用像 `filter()` 和 `map()` 这样不会直接修改原始值的方法，从原始数组生成一个新的数组。然后你就可以将 state 设置为这个新生成的数组。

下面是常见数组操作的参考表。当你操作 React state 中的数组时，你需要避免使用左列的方法，而首选右列的方法：

|          | 避免使用 (会改变原始数组)     | 推荐使用 (会返回一个新数组）                                 |
| -------- | ----------------------------- | ------------------------------------------------------------ |
| 添加元素 | `push`，`unshift`             | `concat`，`[...arr]` 展开语法（[例子](https://react.docschina.org/learn/updating-arrays-in-state#adding-to-an-array)） |
| 删除元素 | `pop`，`shift`，`splice`      | `filter`，`slice`（[例子](https://react.docschina.org/learn/updating-arrays-in-state#removing-from-an-array)） |
| 替换元素 | `splice`，`arr[i] = ...` 赋值 | `map`（[例子](https://react.docschina.org/learn/updating-arrays-in-state#replacing-items-in-an-array)） |
| 排序     | `reverse`，`sort`             | 先将数组复制一份（[例子](https://react.docschina.org/learn/updating-arrays-in-state#making-other-changes-to-an-array)） |





## 状态管理

### 不要在 state 中镜像 props 

以下代码是体现 state 冗余的一个常见例子：

```
function Message({ messageColor }) {

  const [color, setColor] = useState(messageColor);
```

这里，一个 `color` state 变量被初始化为 `messageColor` 的 prop 值。这段代码的问题在于，**如果父组件稍后传递不同的 `messageColor` 值（例如，将其从 `'blue'` 更改为 `'red'`），则 `color`** state 变量**将不会更新！** state 仅在第一次渲染期间初始化。

这就是为什么在 state 变量中，“镜像”一些 prop 属性会导致混淆的原因。相反，你要在代码中直接使用 `messageColor` 属性。如果你想给它起一个更短的名称，请使用常量：

```
function Message({ messageColor }) {

  const color = messageColor;
```

这种写法就不会与从父组件传递的属性失去同步。

只有当你 **想要** 忽略特定 props 属性的所有更新时，将 props “镜像”到 state 才有意义。按照惯例，prop 名称以 `initial` 或 `default` 开头，以阐明该 prop 的新值将被忽略：

```
function Message({ initialColor }) {

  // 这个 `color` state 变量用于保存 `initialColor` 的 **初始值**。

  // 对于 `initialColor` 属性的进一步更改将被忽略。

  const [color, setColor] = useState(initialColor);
```





### 对state状态进行保留和重置

- 只要在相同位置渲染的是相同组件， React 就会保留状态。
- state 不会被保存在 JSX 标签里。它与你在树中放置该 JSX 的位置相关联。
- 你可以通过为一个子树指定一个不同的 key 来重置它的 state。
- 不要嵌套组件的定义，否则你会意外地导致 state 被重置。





## 深入讨论

### 万物皆组件

[万物皆组件](https://react.docschina.org/learn/your-first-component#components-all-the-way-down)



### 为什么多个 JSX 标签需要被一个父元素包裹？

[为什么多个 JSX 标签需要被一个父元素包裹](https://react.docschina.org/learn/writing-markup-with-jsx#why-do-multiple-jsx-tags-need-to-be-wrapped)

JSX 虽然看起来很像 HTML，但在底层其实被转化为了 JavaScript 对象，你不能在一个函数中返回多个对象，除非用一个数组把他们包装起来。这就是为什么多个 JSX 标签必须要用一个父元素或者 Fragment 来包裹



### React 为何侧重于纯函数? 

[React 为何侧重于纯函数? ](https://react.docschina.org/learn/keeping-components-pure#why-does-react-care-about-purity)

编写纯函数需要遵循一些习惯和规程。但它开启了绝妙的机遇：

- 你的组件可以在不同的环境下运行 — 例如，在服务器上！由于它们针对相同的输入，总是返回相同的结果，因此一个组件可以满足多个用户请求。
- 你可以为那些输入未更改的组件来 [跳过渲染](https://react.docschina.org/reference/react/memo)，以提高性能。这是安全的做法，因为纯函数总是返回相同的结果，所以可以安全地缓存它们。
- 如果在渲染深层组件树的过程中，某些数据发生了变化，React 可以重新开始渲染，而不会浪费时间完成过时的渲染。纯粹性使得它随时可以安全地停止计算。

我们正在构建的每个 React 新特性都利用到了纯函数。从数据获取到动画再到性能，保持组件的纯粹可以充分释放 React 范式的能力。



### React 如何知道返回哪个 state

[React 如何知道返回哪个 state](https://react.docschina.org/learn/state-a-components-memory#how-does-react-know-which-state-to-return)



### 为什么在 React 中不推荐直接修改 state？

[为什么在 React 中不推荐直接修改 state？](https://react.docschina.org/learn/updating-objects-in-state#why-is-mutating-state-not-recommended-in-react)

有以下几个原因：

- **调试**：如果你使用 `console.log` 并且不直接修改 state，你之前日志中的 state 的值就不会被新的 state 变化所影响。这样你就可以清楚地看到两次渲染之间 state 的值发生了什么变化
- **优化**：React 常见的 [优化策略](https://react.docschina.org/reference/react/memo) 依赖于如果之前的 props 或者 state 的值和下一次相同就跳过渲染。如果你从未直接修改 state ，那么你就可以很快看到 state 是否发生了变化。如果 `prevObj === obj`，那么你就可以肯定这个对象内部并没有发生改变。
- **新功能**：我们正在构建的 React 的新功能依赖于 state 被 [像快照一样看待](https://react.docschina.org/learn/state-as-a-snapshot) 的理念。如果你直接修改 state 的历史版本，可能会影响你使用这些新功能。
- **需求变更**：有些应用功能在不出现任何修改的情况下会更容易实现，比如实现撤销/恢复、展示修改历史，或是允许用户把表单重置成某个之前的值。这是因为你可以把 state 之前的拷贝保存到内存中，并适时对其进行再次使用。如果一开始就用了直接修改 state 的方式，那么后面要实现这样的功能就会变得非常困难。
- **更简单的实现**：React 并不依赖于 mutation ，所以你不需要对对象进行任何特殊操作。它不需要像很多“响应式”的解决方案一样去劫持对象的属性、总是用代理把对象包裹起来，或者在初始化时做其他工作。这也是为什么 React 允许你把任何对象存放在 state 中——不管对象有多大——而不会造成有任何额外的性能或正确性问题的原因。

在实践中，你经常可以“侥幸”直接修改 state 而不出现什么问题，但是我们强烈建议你不要这样做，这样你就可以使用我们秉承着这种理念开发的 React 新功能。未来的贡献者甚至是你未来的自己都会感谢你的！



### useRef 内部是如何运行的？

尽管 `useState` 和 `useRef` 都是由 React 提供的，原则上 `useRef` 可以在 `useState` **的基础上** 实现。 你可以想象在 React 内部，`useRef` 是这样实现的：

```
// React 内部

function useRef(initialValue) {

  const [ref, unused] = useState({ current: initialValue });

  return ref;

}
```

第一次渲染期间，`useRef` 返回 `{ current: initialValue }`。 该对象由 React 存储，因此在下一次渲染期间将返回相同的对象。 请注意，在这个示例中，state 设置函数没有被用到。它是不必要的，因为 `useRef` 总是需要返回相同的对象！

React 提供了一个内置版本的 `useRef`，因为它在实践中很常见。 但是你可以将其视为没有设置函数的常规 state 变量。 如果你熟悉面向对象编程，ref 可能会让你想起实例字段 —— 但是你写的不是 `this.something`，而是 `somethingRef.current`。



## React Hooks

## React 组件

### `<Fragment> (<>...</>)`

#### 概念

当你需要单个元素时，你可以使用 `<Fragment>` 将其他元素组合起来，使用 `<Fragment>` 组合后的元素不会对 DOM 产生影响，就像元素没有被组合一样。在大多数情况下，`<Fragment></Fragment>` 可以简写为空的 JSX 元素 `<></>`。

```
<>
  <OneChild />
  <AnotherChild />
</>
```

**参数**

- **可选** `key`：列表中 `<Fragment>` 的可以拥有 [keys](https://react.docschina.org/learn/rendering-lists#keeping-list-items-in-order-with-key)。

**注意事项**

- 如果你要传递 `key` 给一个 `<Fragment>`，你不能使用 `<>...</>`，你必须从 `'react'` 中导入 `Fragment` 且表示为`<Fragment key={yourKey}>...</Fragment>`。
- 当你要从 `<><Child /></>` 转换为  `[<Child />]` 或 `<><Child /></>` 转换为 `<Child />`，React 并不会[重置 state](https://react.docschina.org/learn/preserving-and-resetting-state)。这个规则只在一层深度的情况下生效，如果从 `<><><Child /></></>` 转换为 `<Child />` 则会重置 state。在[这里](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)查看更详细的介绍。



### `<Profiler>`

#### 概念

`<Profiler>` 允许你编程式测量 React 树的渲染性能。

```
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

**参数**

- `id`：字符串，用于标识正在测量的 UI 部分。
- `onRender``onRender` 回调函数，当包裹的组件树更新时，React 都会调用它。它接收有关渲染内容和所花费时间的信息。

**注意**

- 进行性能分析会增加一些额外的开销，因此 **在默认情况下，它在生产环境中是被禁用的**。如果要启用生产环境下的性能分析，你需要启用一个 [特殊的带有性能分析功能的生产构建](https://fb.me/react-profiling)。



#### `onRender` 回调函数

```jsx
// 当调用 onRender 回调函数时，React 会告诉你相关信息
function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  // 对渲染时间进行汇总或记录...
}
```

参数：

- `id`：字符串，为 `<Profiler>` 树的 `id` 属性，用于标识刚刚提交的部分。如果使用多个 profiler，可以通过此属性识别提交的是树中的哪一部分。
- `phase`：为 `"mount"`、`"update"` 或 `"nested-update"` 中之一。这可以让你知道组件树是首次挂载还是由于 props、state 或 hook 的更改而重新渲染。
- `actualDuration`：在此次更新中，渲染 `<Profiler>` 组件树的毫秒数。这可以显示子树在使用记忆化（例如`memo`和 [`useMemo`）后的效果如何。理想情况下，此值在挂载后应显著减少，因为许多后代组件只会在特定的 props 变化时重新渲染。
- `baseDuration`：估算在没有任何优化的情况下重新渲染整棵 `<Profiler>` 子树所需的毫秒数。它通过累加树中每个组件的最近一次渲染持续时间来计算。此值估计了渲染的最差情况成本（例如初始挂载或没有使用记忆化的树）。将其与 `actualDuration` 进行比较，以确定记忆化是否起作用。
- `startTime`：当 React 开始渲染此次更新时的时间戳。
- `commitTime`：当 React 提交此次更新时的时间戳。此值在提交的所有 profiler 中共享，如果需要，可以对它们进行分组。



#### 用法

使用 `<Profiler>` 组件包裹 React 树以测量其渲染性能。

这需要两个属性：`id`（字符串）和 `onRender` 回调函数（函数），每当 React 树中的任何组件“提交”更新时都将调用该函数。

```jsx
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```





### `<StrictMode>`

`<StrictMode>` 帮助你在开发过程中尽早地发现组件中的常见错误。

```
<StrictMode>
  <App />
</StrictMode>
```

严格模式启用了以下仅在开发环境下有效的行为：

- 组件将重新渲染一次，以查找由于非纯渲染而引起的错误。
- 组件将重新运行 Effect 一次，以查找由于缺少 Effect 清理而引起的错误。
- 组件将被检查是否使用了已弃用的 API。

**所有这些检查仅在开发环境中进行，不会影响生产构建。**



### `<Suspense>`

#### 概念

`<Suspense>` 允许在子组件完成加载前展示一个 fallback。React 将展示  fallback  直到  children  需要的所有代码和数据都加载完成。

```
<Suspense fallback={<Loading />}>
  <SomeComponent />
</Suspense>
```

**参数**

- `children`：真正的 UI 渲染内容。如果 `children` 在渲染中被挂起，Suspense 边界将会渲染 `fallback`。
- `fallback`：真正的 UI 未渲染完成时代替其渲染的备用 UI，它可以是任何有效的 React 节点。fallback 通常是一个轻量的占位符，例如表示加载中的图标或者骨架屏。当 `children` 被挂起时，Suspense 将自动切换至渲染 `fallback`；当数据准备好时，又会自动切换至渲染 `children`。如果 `fallback` 在渲染中被挂起，那么将自动激活最近的 Suspense 边界。

::: note 注意

**只有启用了 Suspense 的数据源才会激活 Suspense 组件**，它们包括：

- 支持 Suspense 的框架如 [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) 和 [Next.js](https://nextjs.org/docs/getting-started/react-essentials)。
- 使用 [`lazy`](https://react.docschina.org/reference/react/lazy) 懒加载组件代码。
- 使用 [`use`](https://react.docschina.org/reference/react/use) 读取 Promise 的值。

Suspense **无法** 检测在 Effect 或事件处理程序中获取数据的情况。

在上面的 `Albums` 组件中，正确的数据加载方法取决于你使用的框架。如果你使用了支持 Suspense 的框架，你会在其数据获取文档中找到详细信息。

目前尚不支持在不使用固定框架的情况下进行启用 Suspense 的数据获取。实现支持 Suspense 数据源的要求是不稳定的，也没有文档。React 将在未来的版本中发布官方 API，用于与 Suspense 集成数据源。

::: 



#### 同时展示内容

默认情况下，Suspense 内部的整棵组件树都被视为一个单独的单元。例如，即使 **只有一个** 组件因等待数据而被挂起，Suspense 内部的整棵组件树中的 **所有** 的组件都将被替换为加载中指示器：

```jsx
<Suspense fallback={<Loading />}>
  <Biography />
  <Panel>
    <Albums />
  </Panel>
</Suspense>
```

然后，当它们都准备好展示时，它们将一起出现。



#### 逐步加载内容

当一个组件被挂起时，最近的父级 `Suspense` 组件会展示 fallback。这允许你嵌套多个 `Suspense` 组件创建一个加载序列。每个 `Suspense` 边界的 fallback 都会在下一级内容可用时填充。例如，你可以给专辑列表设置自己的 fallback：

```jsx
<Suspense fallback={<BigSpinner />}>
  <Biography />
  <Suspense fallback={<AlbumsGlimmer />}>
    <Panel>
      <Albums />
    </Panel>
  </Suspense>
</Suspense>
```

调整之后，`Biography` 不需要“等待” `Albums` 加载完成就可以展示。

加载序列将会是：

1. 如果 `Biography` 没有加载完成，`BigSpinner` 会显示在整个内容区域的位置。
2. 一旦 `Biography` 加载完成，`BigSpinner` 会被内容替换。
3. 如果 `Albums` 没有加载完成，`AlbumsGlimmer` 会显示在 `Albums` 和它的父级 `Panel` 的位置。
4. 最后，一旦 `Albums` 加载完成，它会替换 `AlbumsGlimmer`。



## API

### createContext

`createContext` 能让你创建一个context以便组件能够提供和读取。

```
const SomeContext = createContext(defaultValue)
```

```jsx
import { createContext } from 'react';

const ThemeContext = createContext('light');
```





### forwardRef

`forwardRef` 允许你的组件使用ref将一个 DOM 节点暴露给父组件。

```
const SomeComponent = forwardRef(render)
```

```JSX
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  // ...
});
```



### lazy

`lazy` 能够让你在组件第一次被渲染之前延迟加载组件的代码。

```
const SomeComponent = lazy(load)
```

```jsx
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```



### memo

`memo` 允许你的组件在 props 没有改变的情况下跳过重新渲染。

```
const MemoizedComponent = memo(SomeComponent, arePropsEqual?)
```

使用 `memo` 将组件包装起来，以获得该组件的一个 **记忆化** 版本。通常情况下，只要该组件的 props 没有改变，这个记忆化版本就不会在其父组件重新渲染时重新渲染。但 React 仍可能会重新渲染它：记忆化是一种性能优化，而非保证。

```jsx
import { memo } from 'react';

const SomeComponent = memo(function SomeComponent(props) {
  // ...
});
```



### startTransition

`startTransition` 可以让你在不阻塞 UI 的情况下更新 state。

```
startTransition(scope)
```



## 补充

- React 组件必须以大写字母开头，而 HTML 标签则必须是小写字母。
- JSX 比 HTML 更加严格。你必须闭合标签，如 `<br />`。你的组件也不能返回多个 JSX 标签。你必须将它们包裹到一个共享的父级中，比如 `<div>...</div>` 或使用空的 `<>...</>` 包裹
- React 组件是常规的 JavaScript 函数，但 **组件的名称必须以大写字母开头**，否则它们将无法运行
- 在 JSX 中，只能在以下两种场景中使用大括号：
  1. 用作 JSX 标签内的**文本**：`<h1>{name}'s To Do List</h1>` 是有效的，但是 `<{tag}>Gregorio Y. Zara's To Do List</{tag}>` 无效
  2. 用作紧跟在 `=` 符号后的 **属性**：`src={avatar}` 会读取 `avatar` 变量，但是 `src="{avatar}"` 只会传一个字符串 `{avatar}`
- 在 JSX 中看到 `{{` 和 `}}`时，它只不过是包在大括号里的一个对象罢了!
- 在 JSX 里，React 会将 `false` 视为一个“空值”，就像 `null` 或者 `undefined`，这样 React 就不会在这里进行任何渲染。

- 阻止事件传播：`e.stopPropagation()`

- 阻止默认事件：`e.preventDefault()`

- **如果一个值可以基于现有的 props 或 state 计算得出，不要把它作为一个 state，而是在渲染期间直接计算这个值**

  - ```jsx
    function Form() {
      const [firstName, setFirstName] = useState('Taylor');
      const [lastName, setLastName] = useState('Swift');
    
      // × 避免：多余的 state 和不必要的 Effect
      const [fullName, setFullName] = useState('');
      useEffect(() => {
        setFullName(firstName + ' ' + lastName);
      }, [firstName, lastName]);
      // ...
    }
    ```

  - ```jsx
    function Form() {
      const [firstName, setFirstName] = useState('Taylor');
      const [lastName, setLastName] = useState('Swift');
      // √ 非常好：在渲染期间进行计算
      const fullName = firstName + ' ' + lastName;
      // ...
    }
    ```

- **自定义 Hook 共享的只是状态逻辑而不是状态本身。对 Hook 的每个调用完全独立于对同一个 Hook 的其他调用**

















