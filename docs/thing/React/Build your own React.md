---
id: build-your-own-react
slug: /react/build-your-own-react
title: Build your own React
date: 2002-09-26
authors: 鲸落
tags: [React]
keywords: [React]
---


pomb大神 ：[构建自己的反应 (pomb.us)](https://pomb.us/build-your-own-react/)



## 前言

我们要从头开始一步一步重写一个 React，遵循真实的 React 代码结构，但不会有所有的优化以及非必要的功能。

如果你已经阅读过作者以前写的 `构建你自己的 React` 文章，与之相比，不同之处仅仅是这篇文章基于 React16.8（对于16.8以后都适用），因此我们可以使用 hooks，并删除所有与 class 相关的代码。

您可以在 [Didact 存储库](https://github.com/pomber/didact)中找到旧博客文章和代码的历史记录。还有一个[涵盖相同内容的演讲](https://youtu.be/8Kc2REHdwnQ)。但这是一个独立的帖子。

从头开始，以下是我们逐一添加到 React 版本中的所有内容：

- 第一步: createElement Function
- 第二步: render Function 渲染函数
- 第三步: Concurrent Mode 并发模式
- 第四步: Fibers
- 第五步: Render and Commit 阶段
- 第六步: Reconciliation 调和
- 第七步: Function Components 函数组件
- 第八步: Hooks



## 步骤零：复习

但首先让我们回顾一些基本概念。如果你已经对 React、JSX 和 DOM 元素的工作原理有了很好的了解，你可以跳过这一步。

我们将使用这个 React 应用程序，只有三行代码。第一个定义了一个 React 元素。下一个从DOM获取一个节点。最后一个将 React 元素呈现到容器中。

```jsx
const element = <h1 title="foo">Hello</h1>
const container = document.getElementById("root")
ReactDOM.render(element, container)
```

**让我们删除所有 React 特定的代码，并将其替换为普通的 JavaScript**。



在第一行中，我们用 JSX 定义了元素，但它甚至不是有效 JavaScript，因此为了让它有效，首先我们需要把它替换成有效的 JS。

> JSX 被像 babel 这样的构建工具转成 JS，转换通常很简单：用对 createElement 的调用来替换代码中的标签，并传递标签名称、属性和子元素作为参数（ passing the tag name, the props and the children as parameters）

```diff
- const element = <h1 title="foo">Hello</h1>
+ const element = React.createElement(
+   "h1",
+   { title: "foo" },
+   "Hello"
+ )

const container = document.getElementById("root")
ReactDOM.render(element, container)
```

`React.createElement` 根据他的参数创建了一个对象，除了一些验证，仅此而已。因此我们可以安全的将其函数调用替换成它的输出内容。



```diff
- const element = React.createElement(
-   "h1",
-   { title: "foo" },
-   "Hello"
- )
+ const element = {
+   type: "h1",
+   props: {
+     title: "foo",
+     children: "Hello",
+   }
+ }

const container = document.getElementById("root")
ReactDOM.render(element, container)
```

这就是 React 的元素，一个包含两个属性的对象： `type` 和 `props` （当然，它还有更多的属性，但我们只需要关心这两个）

`type` 是一个字符串，用于指定我们想要创建的 DOM 节点的类型，它是你想要通过 `document.createElement` 创建一个 HTML 元素时的标签名称（tagName）,它也可以是一个函数，但我们将其留给第七步

props是另外一个对象，它具有 JSX 属性中的所有 key 和 value，它还有一个特殊的属性： children

`children`在这个案例里面是一个字符串，但通常是包含更多元素的数组，这也是为什么元素也是树的原因



我们需要替换的另外一部分 React 代码是 `ReactDOM.render`。

`render`是 React 改变 DOM 的地方，所以让我们自己进行更新。

```diff
const element = {
  type: "h1",
  props: {
    title: "foo",
    children: "Hello",
  },
}

const container = document.getElementById("root")

- ReactDOM.render(element, container)
+ const node = document.createElement(element.type)
+ node["title"] = element.props.title

+ const text = document.createTextNode("")
+ text["nodeValue"] = element.props.children

+ node.appendChild(text)
+ container.appendChild(node)
```

首先我们使用元素的 `type` 创建了一个 node 节点，这里是 `h1`。

然后我们将元素的所有 `props` 分配给该 node 节点，这里只有 title。

> 为了避免混淆，我会使用『element』来指代 React 元素，『node』指代DOM元素



然后我们创建节点的 `children`，我们只有一个字符串作为 child，因此我们创建一个文本节点（text node）。

使用 `textNode` 而不是设置 `innerText` 将使我们以后以相同的方式对待所有 element。另外注意，我们像设置`h1`的`title`一样设置`nodeValue`，就像字符串中带有`props`一样：`{nodeValue：“ hello”}`。



最后，我们将 `textNode` 添加到 `h1`，并将`h1`添加到 `container` 容器。

现在，我们拥有和以前相同的 app，但是没有使用 `React`。





## 第一步：createElement Function

让我们从另外一个 app 开始。这次我们将使用我们自己的 React 版本来替换 React 代码。

```jsx
const element = (
  <div id="foo">
    <a>bar</a>
    <br />
  </div>
)
const container = document.getElementById('root')
ReactDOM.render(element, container)
```

> 我们将从编写自己的 `createElement` 开始。



我们先把 JSX 转换为 JS，以便于可以看到 `createElement` 调用。

```jsx
const element = React.createElement(
  'div',
  { id: 'foo' },
  React.createElement('a', null, 'bar'),
  React.createElement('br')
)
const container = document.getElementById('root')
ReactDOM.render(element, container)
```



正如我们在上一步看到的，element 是具有 type 和 props 的对象，我们的 `createElement` 函数唯一需要做的就是创建该对象。

```jsx
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children,
    },
  }
}

```



我们对 props 使用展开操作符，对 children 使用剩余参数语法获取，这样 children 属性永远是一个数组。例如：

`createElement("div")` 返回：

```json
{
  "type": "div",
  "props": { 
      "children": []
  }
}
```

`createElement("div", null, a)` 返回：

```json
{
  "type": "div",
  "props": { 
      "children": [a]
  }
}
```

以及 `createElement("div", null, a, b)` 返回：

```json
{
  "type": "div",
  "props": { 
      "children": [a, b]
  }
}
```



children数组也可以包含原始值，例如字符串和数字。因此，我们需要将所有不是对象的 `element` 也包装成 `element` 对象，并为其创建特殊类型： `TEXT_ELEMENT`

```jsx
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === 'object' ? child : createTextElement(child)
      ),
    },
  }
}

function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  }
}
```

> 在没有 `children` 时， React 不会包装原始值或创建空数组，但我们这样做是因为这样可以简化我们的代码，对于我们的代码库，我们更喜欢简单而不是高性能的代码。



我们仍在使用 React 的 `createElement`。为了替换它，让我们给我们的仓库起一个名字，我们需要一个听起来像 React 的名字，但也暗示了它的教学目的。

```diff
+ const Didact = {
    createElement
+ }

- const element = React.createElement(
+ const element = Didact.createElement(
    'div',
    { id: 'foo' },
-   React.createElement('a', null, 'bar'),
-   React.createElement('br')
+   Didact.createElement('a', null, 'bar'),
+   Didact.createElement('br')
  )
```

我们叫它 Didact。



但是我们仍然想要使用 JSX，我们应该怎样告诉 babel 去使用 Didact 的 `createElement` 而不是 React 的。

```jsx
/** @jsx Didact.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
)
```

如果我们像上面那样添加注释，当 babel 转译 JSX 时，它将使用我们定义的 function





## 第二步： render Function

`ReactDOM.render(element, container)`



接下来，我们需要编写我们的 `ReactDOM.render` 函数

```diff
+ function render(element, container) {
+   // TODO 创建dom节点
+ }

const Didact = {
  createElement,
+ render
}

/** @jsx Didact.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
)

const container = document.getElementById('root')
- ReactDOM.render(element, container)
+ Didact.render(element, container)
```



目前，我们只需要关心向 DOM 添加内容。我们稍后会处理更新和删除。



我们首先使用 element 的 type 创建 DOM 节点，并把创建的新节点添加到 container。

```jsx
function render(element, container) {
  const dom = document.createElement(element.type)

  container.appendChild(dom)
}
```



我们递归地为每个子 element 处理同样的事情

```diff
function render(element, container) {
  const dom = document.createElement(element.type)
  
+ element.props.children.forEach(child => render(child, dom))

  container.appendChild(dom)
}
```



我们也需要去处理文本 element，如果该 element 的 type 为 `TEXT_ELEMENT`，我们创建一个文本节点而不是常规节点。

```diff
function render (element, container) {

- const dom = document.createElement(element.type)
+ const dom =
+   element.type === 'TEXT_ELEMENT'
+     ? document.createTextNode('')
+     : document.createElement(element.type)

  element.props.children.forEach(child => render(child, dom))
  container.appendChild(dom)
}
```



最后我们需要把 element 的 props 分配给 node

```diff
function render (element, container) {
  const dom =
    element.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(element.type)

+ const isProperty = key => key !== "children"
+ Object.keys(element.props)
+   .filter(isProperty)
+   .forEach(name => {
+     dom[name] = element.props[name]
+   })

  element.props.children.forEach(child => render(child, dom))
  container.appendChild(dom)
}
```



到这里。我们现在有了一个可以把 JSX 渲染到 DOM 的库。

```js
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === "object" ? child : createTextElement(child)
      )
    }
  };
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: []
    }
  };
}

function render(element, container) {
  const dom =
    element.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);
  const isProperty = key => key !== "children";
  Object.keys(element.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = element.props[name];
    });
  element.props.children.forEach(child => render(child, dom));
  container.appendChild(dom);
}

const Didact = {
  createElement,
  render
};

/** @jsx Didact.createElement */
const element = (
  <div style="background: salmon">
    <h1>Hello World</h1>
    <h2 style="text-align:right">from Didact</h2>
  </div>
);
const container = document.getElementById("root");
Didact.render(element, container);
```

去 [codesandbox](https://link.juejin.cn/?target=https%3A%2F%2Fcodesandbox.io%2Fs%2Fdidact-2-k6rbj%3Ffile%3D%2Fsrc%2Findex.js) 试一下





## 第三步：Concurrent Mode

> 但是......在我们开始添加更多代码之前，我们需要重构

这里的递归存在一个问题。一但开始 render 后，直到把完整的 element 树 render 完毕，我们才能停止。如果 element 树很大，它可能会阻塞主线程很长时间。如果浏览器需要做高优先级的操作（比如处理用户输入或者保持动画流程），则它必须等待 render 完成为止。

```jsx
function render(element, container) {
  const dom = document.createElement(element.type)
  // 递归问题如上 
  element.props.children.forEach(child => render(child, dom))

  container.appendChild(dom)
}
```



因此，我们将把工作拆分成一个个小单元，在完成每个单元后，如果需要执行其他任何操作，我们会让浏览器中断 render

```jsx
let nextUnitOfWork = null

function workLoop(deadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

function performUnitOfWork(fiber) {
  // TODO
}
```

我们使用 `requestIdleCallback` 创建了一个循环，你可以把 `requestIdleCallback` 视为 `setTimeout`，但不是我们告诉它何时运行，而是浏览器在主线程空闲时运行回调。（[requestIdleCallback | MDN ](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)）



`requestIdleCallback` 也会给我们一个 deadline 参数。我们使用它来检测浏览器需要再次控制之前还有多少时间。

截止 2019 年 11 月，Concurrent Mode 在 React 中并不稳定。循环的稳定版本看起来更像这样：

```js
while (nextUnitOfWork) {    
  nextUnitOfWork = performUnitOfWork(nextUnitOfWork) 
}
```



要开始使用循环，我们需要设置第一个工作单元，然后编写一个 `performUnitOfWork` 函数，该函数不仅执行工作，还返回下一个工作单元。





## 第四步：Fibers

为了组织工作单元(unit of work)，我们需要一个数据结构：一个 fiber 树。我们将为每个 element 都配置一个 fiber，并且每个 fiber 都将成为一个工作单元(unit of work)。让我举一个例子。

假设我们要 render 一个像这样的树：

```jsx
Didact.render(
  <div>
    <h1>
      <p />
      <a />
    </h1>
    <h2 />
  </div>,
  container
)
```



在 render 中，我们会创建 根 fiber，并且设置其为 nextUnitOfWork 。剩下的工作将会在 `performUnitOfWork` 函数进行，在那里将会对每一个 fiber 做三件事：

1. 将 element 添加到 DOM
2. 为每个 element 的 children 创建 fiber
3. 选择下一个工作单元



该数据结构的目标之一是为了使查找下一个工作单元变得容易。这也是为何每一个 fiber 都会链接到自身的第一个子节点、下一个兄弟节点和父节点。



- 当我们完成一个 fiber 工作时，如果该 fiber 有子节点，那么其子节点将会成为下一个工作单元（在我们的实例中，当我们完成 `div` fiber 的工作时，下一个工作单元将是 h1 的 fiber）
- 如果 fiber 没有 `child`（孩子节点），我们将使用 `sibling`（兄弟节点）作为下一个工作单元（例如，`p` fiber 没有 `child`（孩子节点），因此我们完成后讲移到 `a` filber（下一个工作单元））
- 如果该 filber 没有 `child`（孩子节点） 也没有 `sibling`（兄弟节点） ，那就去找『叔叔』：`parent`（父节点）的`sibling`（兄弟节点），就像例子中 `a` 和 `h1`的 filber。
- 另外，如果 `parent`（父节点）没有 `sibling`（兄弟节点），我们会不断检查`parent`（父节点），直到找到有`sibling`（兄弟节点）的`parent`（父节点），或者直接找到 root 节点。如果到达 root 节点，意味着我们已经完成了 render 的所有工作。



现在让我们把它放到代码中。首先，让我们从 `render` 函数中删除此代码。（从第一段代码变成第二段代码）

```jsx
function render(element, container) {
  const dom =
    element.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type)

  const isProperty = key => key !== "children"
  Object.keys(element.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = element.props[name]
    })

  element.props.children.forEach(child =>
    render(child, dom)
  )

  container.appendChild(dom)
}

let nextUnitOfWork = null
```

```jsx
function createDom(filber) {
  const dom =
    filber.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(filber.type)

  const isProperty = key => key !== 'children'
  Object.keys(filber.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = filber.props[name]
    })

  return dom
}

function render(element, container) {
  // TODO 设置下一个工作单元（nextUnitOfWork）
}

let nextUnitOfWork = null
```

我们将创建 DOM 节点的部分提出来作为一个单独的函数，稍后使用它



在 render 函数中，我们 nextUnitOfWork 设置为 filber 树的根（root filber）

```jsx
function render(element, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
  }
}


let nextUnitOfWork = null
```



然后，当浏览器准备就绪后，就会执行我们的 `workLoop` 函数，我们将开始在 root filber 在工作

```jsx
function performUnitOfWork(fiber) {
  // TODO 添加 dom 节点
  // TODO 创建新的fiber
  // TODO 返回 nextUnitOfWork
}
```



首先，我们创建一个新的 `node` 并追加到 DOM。

我们让 filber 的 dom 属性跟踪指向该 DOM node（上面创建的 DOM node）

```jsx
function performUnitOfWork(fiber) {
  if (!filber.dom) {
    filber.dom = createDom(filber)
  }

  if (filber.parent) {
    filber.parent.dom.appendChild(filber.dom)
  }

  // TODO 创建新的fiber
  // TODO 返回 nextUnitOfWork
}
```



然后为每个孩子创建一个新的 filber

```jsx
function performUnitOfWork(fiber) {
  // 添加 dom 节点
  // ...

  // 创建新的fiber
  const elements = fiber.props.children
  let index = 0
  let prevSibling = null
  while (index < elements.length) {
    const element = elements[index]
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    }
  }

  // TODO 返回 nextUnitOfWork
}
```



然后将其添加到 fiber 树，将其设置为 `child` 还是 `sibling` ，取决于它是否是第一个 `child`

```diff
function performUnitOfWork(fiber) {
  // 添加 dom 节点
  // ...

  // 创建新的fiber
  const elements = fiber.props.children
  let index = 0
  let prevSibling = null
  while (index < elements.length) {
    const element = elements[index]
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null
    }

+   if(index === 0) {
+     fiber.child = newFiber
+   } else {
+     prevSibling.sibling = newFiber
+   }

+   prevSibling = newFiber
+   index ++
  }

  // TODO 返回 nextUnitOfWork
}
```



最后，我们开始查找下一个工作单元，我们首先从其子节点开始查找，然后找其兄弟节点，再找叔叔节点，依此推内。

```jsx
function performUnitOfWork(fiber) {
  // 添加 dom 节点
  // ...
  
  // 创建新的fiber
  // ...

  // 返回 nextUnitOfWork
  if(fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber
  while(nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}
```



最终这就是我们的 `performUnitOfWork`

```jsx
function performUnitOfWork(fiber) {
  // 添加 dom 节点
  if(!fiber.dom) {
    fiber.dom = createDom(fiber)
  }

  if(fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom)
  }

  // 创建新的fiber
  const elements = fiber.props.children
  let index = 0
  let prevSibling = null
  while (index < elements.length) {
    const element = elements[index]
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null
    }

    if(index === 0) {
      fiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
    index ++
  }

  // 返回 nextUnitOfWork
  if(fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber
  while(nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}
```





## 第五步：Render and Commit Phases

> 我们这里有另一个问题：每次处理 element 时，我们都会向 DOM 添加一个新节点。而且，请记住，在完成渲染整个树之前，浏览器可能会中断我们的工作。在这种情况，用户将看到不完整的 UI。那不是我们想要的。

因此我们需要移出更新 DOM 的这部分。

```diff
function performUnitOfWork(fiber) {
  // 添加 dom 节点
  if(!fiber.dom) {
    fiber.dom = createDom(fiber)
  }

- if(fiber.parent) {
-   fiber.parent.dom.appendChild(fiber.dom)
- }
  // ...
}
```



相反，我们将保持对 fiber 树的根的追踪，我们称其为进行中的工作根（work in progress root）或者 wipRoot

```diff
function render (element, container) {
- nextUnitOfWork = {
+ wipRoot = {
    dom: container,
    props: {
      children: [element]
    }
  }

+ nextUnitOfWork = wipRoot
}

let nextUnitOfWork = null
+ let wipRoot = null
```



一旦我们结束所有工作（因为没有下一个工作单元，我们就知道了），我们便将整个 fiber 树提交给 DOM

```diff

+ function commitRoot() {
+   // TODO 添加节点到dom
+ }
// ...
function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork
    )
    shouldYield = deadline.timeRemaining() < 1
  }

+ if(!nextUnitOfWork && wipRoot) {
+   commitRoot();
+ }

  requestIdleCallback(workLoop)
}
```



我们在 `commitRoot` 函数中完成。我们将所有节点递归添加到 dom 中。

```js
function commitWork(fiber) {
  if (!fiber) {
    return
  }
  const domParent = fiber.parent.dom
  domParent.appendChild(fiber.dom)
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}
```





## 第六步：Reconciliation

> Reconciliation 调和

到目前为止，我们仅仅向 DOM 添加了内容，但是怎样更新或者删除节点呢？

```js
function commitRoot() {
  commitWork(wipRoot.child)
  wipRoot = null
}

function commitWork(fiber) {
  if (!fiber) {
    return
  }
  const domParent = fiber.parent.dom
  domParent.appendChild(fiber.dom)
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}
```



这也是我们现在要做的，我们需要将在 `render` 函数上收到的 element 和我们前一次提交给 DOM 的 fiber 树进行比较。



因此，在完成提交后，我们需要保存对“最后提交给 DOM 的 fiber 树” 的引用。我们称它为 `currentRoot`。

还需要给每一个 fiber 添加一个 `alternate` 属性。这个属性会指向旧的 fiber，旧的 fiber 就是我们在上一次提交阶段提交给 DOM 的 fiber。

```diff
function commitRoot() {
  commitWork(wipRoot.child)
+ currentRoot = wipRoot
  wipRoot = null
}
// ...
function render (element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element]
    },
+   alternate: currentRoot
  }

  nextUnitOfWork = wipRoot
}

let nextUnitOfWork = null
+ let currentRoot = null
let wipRoot = null
```



现在让我们从 `performUnitOfWork` 中提取用于创建新的 fiber 的代码...



先创建一个新的 `reconcileChildren` 函数。

```jsx
function performUnitOfWork(fiber) {
  // 添加 dom 节点
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }

  // 创建新的fiber
  const elements = fiber.props.children
  reconcileChildren(fiber, elements)

  // 返回 nextUnitOfWork
  if (fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}

function reconcileChildren(wipFiber, elements) {
  let index = 0
  let prevSibling = null
  while (index < elements.length) {
    const element = elements[index]
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: wipFiber,
      dom: null,
    }

    if (index === 0) {
      wipFiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
    index++
  }
}
```



这里我们将老的 fiber 和新的 element 进行调和：`function reconcileChildren(wipFiber, elements) {}`



我们同时遍历旧的 fiber 的子集（wipFiber.alternate）和要调和的 element。

如果我们忽略同时迭代数组和链表所需要的样板，那么只剩下最重要的东西：`旧 fiber` 和 `element` 。`element`是我们想要渲染到 DOM 上的事物，`旧 fiber`是上一次渲染的参照物。

我们需要对它们进行比较，以便于了解是否需要对 dom 进行任何更改。

```jsx
function reconcileChildren(wipFiber, elements) {
  let index = 0
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child
  let prevSibling = null
  while (index < elements.length || oldFiber != null) {
    const element = elements[index]
    let newFiber = null

    // TODO 比较oldFiber和element

    // ...
  }
}
```

```js
// 上述省略号后面代码：（不加在上面为了理解）
if (oldFiber) {
  oldFiber = oldFiber.sibling
}

if (index === 0) {
  wipFiber.child = newFiber
} else {
  prevSibling.sibling = newFiber
}

prevSibling = newFiber
index++
```





为了对比它们，我们使用了以下类型：

- 如果旧的 fiber 和新的 element 有同样的 type，我们可以保留 DOM 节点，并使用新的属性进行更新
- 如果 type 不同，且新的 element 存在，意味着我们需要创建一个新的 DOM 节点
- 如果 type 不同，且旧的 fiber 存在，我们需要删除这个旧的节点

在这里，React 也使用了 keys，这样可以实现更好的调和。例如，当子元素在元素数组中位置变更时，它可以检查到。

```jsx
function reconcileChildren(wipFiber, elements) {
  // ...
  while (index < elements.length || oldFiber != null) {
    const element = elements[index]
    let newFiber = null

    // TODO 比较oldFiber和element
	const sameType = oldFiber && element && element.type == oldFiber.type

    // 更新node
    if (sameType) {
      // TODO update the node
    }
    
    // 新增node
    if (element && !sameType) {
      // TODO add this node
    }
      
    // 删除node
    if (oldFiber && !sameType) {
      // TODO delete the oldFiber's node
    }
      
    // ...：代码在上面
  }
}
```



当旧的 fiber 和 element 居右相同的 type 时，我们将创建一个新的 fiber，让 DOM 节点与旧的 fiber 保持一致，而 props 和 element 保持一致。

我们还向 fiber 添加了一个新属性：effectTag。我们稍后会在 commit 阶段使用此属性。

```jsx
function reconcileChildren(wipFiber, elements) {
  // ...
  while (index < elements.length || oldFiber != null) {
    const element = elements[index]
    let newFiber = null

    // TODO 比较oldFiber和element
	const sameType = oldFiber && element && element.type == oldFiber.type
	
    // 更新node
    if (sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: 'UPDATE',
      }
    }

    if (element && !sameType) {
      // TODO add this node
    }
    if (oldFiber && !sameType) {
      // TODO delete the oldFiber's node
    }
      
    // ...：代码在上面
  }
}
```



然后，对于元素需要新 DOM 节点时，我们使用 `PLACEMENT` 作为 effectTag

```jsx
function reconcileChildren(wipFiber, elements) {
  // ...
  while (index < elements.length || oldFiber != null) {
    const element = elements[index]
    let newFiber = null

    // TODO 比较oldFiber和element
	const sameType = oldFiber && element && element.type == oldFiber.type

    if (sameType) {
      // TODO update the node
    }
      
     // 新增 node
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: 'PLACEMENT',
      }
    }

    if (oldFiber && !sameType) {
      // TODO delete the oldFiber's node
    }
      
    // ...：代码在上面
  }
}
```



当需要删除 node 时，我们不需要一个新的 fiber，因此，直接给旧的 fiber 添加一个 effectTag。但是，当我们将 fiber 树 commit 时，我们是从 wipRoot 开始的，它没有旧的 fiber

```jsx
function reconcileChildren(wipFiber, elements) {
  // ...
  while (index < elements.length || oldFiber != null) {
    const element = elements[index]
    let newFiber = null

    // TODO 比较oldFiber和element
	const sameType = oldFiber && element && element.type == oldFiber.type

    // 更新node
    if (sameType) {
      // TODO update the node
    }
    
    // 新增node
    if (element && !sameType) {
      // TODO add this node
    }
      
    // 删除node
    if (oldFiber && !sameType) {
      oldFiber.effectTag = 'DELETION'
      deletions.push(oldFiber)
    }
      
    // ...：代码在上面
  }
}
```

因此我们需要一个数组用于存放我们想要删除的节点：

```diff
function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  }
  deletions = []
+ nextUnitOfWork = wipRoot
}

let nextUnitOfWork = null
let currentRoot = null
let wipRoot = null
+ let deletions = null
```

然后，当我们提交进行改变 DOM 时，我们也应该使用该数组：

```diff
function commitRoot() {
+ deletions.forEach(commitWork)
  commitWork(wipRoot.child)
  currentRoot = wipRoot
  wipRoot = null
}
```



现在，让我们更改 `commitWork` 函数，让它来处理新的 `effectTags`

如果 fiber 的 `effectTag` 是 `PLACEMENT`，则和之前相同，将 DOM 节点添加到父 fiber 的 DOM 节点上

```jsx
function commitWork(fiber) {
  if (!fiber) {
    return
  }
  const domParent = fiber.parent.dom
  if (fiber.effectTag === 'PLACEMENT' && fiber.dom != null) {
    // 新增节点
    domParent.appendChild(fiber.dom)
  }
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}
```



如果它是 `DELETION`，我们做相反的事，删除这个子节点

```jsx
function commitWork(fiber) {
  if (!fiber) {
    return
  }
  const domParent = fiber.parent.dom
  if (fiber.effectTag === 'PLACEMENT' && fiber.dom != null) {
    // 新增节点
    domParent.appendChild(fiber.dom)
  } else if (fiber.effectTag === 'DELETION') {
    // 删除节点
    domParent.removeChild(fiber.dom)
  }
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}
```



如果它是 `UPDATE`，我们需要用改变后的 props 更新已存在的 DOM 节点

```jsx
function commitRoot() {
  // 先处理需要删除的节点
  deletions.forEach(commitRoot)
  // 剩下就只有添加和更新
  commitWork(wipRoot.child)
  currentRoot = wipRoot
  wipRoot = null
}

function commitWork(fiber) {
  if (!fiber) {
    return
  }
  const domParent = fiber.parent.dom
  if (fiber.effectTag === 'PLACEMENT' && fiber.dom != null) {
    // 新增节点
    domParent.appendChild(fiber.dom)
  } else if (fiber.effectTag === 'UPDATE' && fiber.dom != null) {
    // 更新节点
    updateDom(fiber.dom, fiber.alternate.props, fiber.props)
  } else if (fiber.effectTag === 'DELETION') {
    // 删除节点
    domParent.removeChild(fiber.dom)
  }
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}
```

更新操作将在 `updateDom` 函数进行。

```js
function createDom(fiber) {
  const dom =
    fiber.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(fiber.type)
  // 新增时也改成使用updateDom来处理属性
  updateDom(dom, {}, fiber.props)
  return dom
}

function updateDom(dom, prevProps, nextProps) {
  // TODO
}
```



我们将旧 fiber 的 props 和新 fiber 的 props 的进行比较，删除不再使用的 props，并设置新的或者有变更的 props

```js
const isProperty = key => key !== 'children'
const isNew = (prev, next) => key => prev[key] !== next[key]
const isGone = (prev, next) => key => !(key in next)

// 更新dom
function updateDom(dom, prevProps, nextProps) {
  // 删除旧的属性
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone)
    .forEach(name => {
      dom[name] = ''
    })

  // 设置新的或者变更的属性
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom[name] = nextProps[name]
    })
}
```



我们需要更新的事件监听器是一种特殊的属性，因此，如果属性是以“on”前缀开头，我们将会以不同的方式处理它们。

```js
const isEvent = key => key.startsWith('on')
const isProperty = key => key !== 'children' || !isEvent
```



如果事件处理器有改变，我们把它从 node 中移出。

```js
// 更新dom
function updateDom(dom, prevProps, nextProps) {
  // 删除旧的或者已改变的事件监听器
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(key => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2)
      dom.removeEventListener(eventType, prevProps[name])
    })
  // 删除旧的属性
  // ...
}
```



然后添加新的事件监听器。

```js
// 更新dom
function updateDom(dom, prevProps, nextProps) {
  // ...
  // 添加事件监听器
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2)
      dom.addEventListener(eventType, nextProps[name])
    })
}
```



去 [codesandbox](https://link.juejin.cn/?target=https%3A%2F%2Fcodesandbox.io%2Fs%2Fdidact-6-96533%3Ffile%3D%2Fsrc%2Findex.js) 尝试加入 `reconciliation` 的这个版本

```js
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === "object"
          ? child
          : createTextElement(child)
      ),
    },
  }
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  }
}

function createDom(fiber) {
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type)

  updateDom(dom, {}, fiber.props)

  return dom
}

const isEvent = key => key.startsWith("on")
const isProperty = key =>
  key !== "children" && !isEvent(key)
const isNew = (prev, next) => key =>
  prev[key] !== next[key]
const isGone = (prev, next) => key => !(key in next)
function updateDom(dom, prevProps, nextProps) {
  //Remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(
      key =>
        !(key in nextProps) ||
        isNew(prevProps, nextProps)(key)
    )
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2)
      dom.removeEventListener(
        eventType,
        prevProps[name]
      )
    })

  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {
      dom[name] = ""
    })

  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom[name] = nextProps[name]
    })

  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2)
      dom.addEventListener(
        eventType,
        nextProps[name]
      )
    })
}

function commitRoot() {
  deletions.forEach(commitWork)
  commitWork(wipRoot.child)
  currentRoot = wipRoot
  wipRoot = null
}

function commitWork(fiber) {
  if (!fiber) {
    return
  }

  const domParent = fiber.parent.dom
  if (
    fiber.effectTag === "PLACEMENT" &&
    fiber.dom != null
  ) {
    domParent.appendChild(fiber.dom)
  } else if (
    fiber.effectTag === "UPDATE" &&
    fiber.dom != null
  ) {
    updateDom(
      fiber.dom,
      fiber.alternate.props,
      fiber.props
    )
  } else if (fiber.effectTag === "DELETION") {
    domParent.removeChild(fiber.dom)
  }

  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  }
  deletions = []
  nextUnitOfWork = wipRoot
}

let nextUnitOfWork = null
let currentRoot = null
let wipRoot = null
let deletions = null

function workLoop(deadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork
    )
    shouldYield = deadline.timeRemaining() < 1
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }

  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }

  const elements = fiber.props.children
  reconcileChildren(fiber, elements)

  if (fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}

function reconcileChildren(wipFiber, elements) {
  let index = 0
  let oldFiber =
    wipFiber.alternate && wipFiber.alternate.child
  let prevSibling = null

  while (
    index < elements.length ||
    oldFiber != null
  ) {
    const element = elements[index]
    let newFiber = null

    const sameType =
      oldFiber &&
      element &&
      element.type == oldFiber.type

    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      }
    }
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
      }
    }
    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION"
      deletions.push(oldFiber)
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }

    if (index === 0) {
      wipFiber.child = newFiber
    } else if (element) {
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
    index++
  }
}

const Didact = {
  createElement,
  render,
}

/** @jsx Didact.createElement */
const container = document.getElementById("root")

const updateValue = e => {
  rerender(e.target.value)
}

const rerender = value => {
  const element = (
    <div>
      <input onInput={updateValue} value={value} />
      <h2>Hello {value}</h2>
    </div>
  )
  Didact.render(element, container)
}

rerender("World")
```





## 第七步：Function Components

> 接下来我们需要去添加对 `function components`  函数组件的支持。



首先，我们先更改示例，使用简单的 function component ，它返回 h1 元素。

```jsx
/** @jsx Didact.createElement */
function App(props) {
  return <h1>Hi {props.name}</h1>
}
const element = <App name="foo" />
const container = document.getElementById('root')
Didact.render(element, container)
```

提示：如果我们将 jsx 转换 为 js，它将是：

```jsx
function App(props) {
  return Didact.createElement(
    "h1",
    null,
    "Hi ",
    props.name
  )
}
const element = Didact.createElement(App, {
  name: "foo",
})
```



函数组件有两点不同之处：

- 函数组件的 fiber 没有 DOM 节点
- children 是通过运行函数获取的，而不是直接从 props 获取的



我们检查 fiber 的类型是否是为函数，并根据情况转到不同的更新函数。在 updateHostComponent 中，我们执行与之相同的操作。

```jsx
function performUnitOfWork(fiber) {
  const isFunctionComponent = fiber.type instanceof Function

  if (isFunctionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }

  // 返回 nextUnitOfWork
  if (fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}

function updateFunctionComponent(fiber) {
  // TDO
}

function updateHostComponent(fiber) {
  // 添加 dom 节点
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
  // 调和
  reconcileChildren(fiber, fiber.props.children)
}
```



在 updateFunctionComponent 中，我们运行 该函数，获取其 children。

在我们的示例中，这里的 `fiber.type` 是 `App` 函数，当我们运行它，它会返回 `h1` 元素。

然后，一旦有了 children，调和的方式就以相同的方式进行，我们不需要在那里进行任何更改

```jsx
function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)]
  // 调和
  reconcileChildren(fiber, children)
}
```



我们需要改变的是 commitWork 函数。

现在我们有一个 fiber 没有 DOM 节点，我们需要修改两件事。



首先，要找到一个 DOM 节点的父节点，我们需要沿着 fiber 树网上查找，直到找到带有 DOM 节点的 fiber。

```diff
function commitWork(fiber) {
  if(!fiber) {
    return
  }
+ let domParentFiber = fiber.parent
+ while (!domParentFiber.dom) {
+   domParentFiber = domParentFiber.parent
+ }
+ const domParent = domParentFiber.dom
- const domParent = fiber.parent.dom
  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    // 新增节点
    domParent.appendChild(fiber.dom)
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    // 更新节点
    updateDom(fiber.dom, fiber.alternate.props, fiber.props)
  } else if (fiber.effectTag === "DELETION") {
    // 删除节点
    domParent.removeChild(fiber.dom)
  }
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}
```



在删除节点时，我们也需要继续操作，直到找到具体的带有 DOM 节点的子节点

```diff
function commitWork(fiber) {
  if(!fiber) {
    return
  }
  let domParentFiber = fiber.parent
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent
  }
  const domParent = domParentFiber.dom
  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    // 新增节点
    domParent.appendChild(fiber.dom)
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    // 更新节点
    updateDom(fiber.dom, fiber.alternate.props, fiber.props)
  } else if (fiber.effectTag === "DELETION") {
    // 删除节点
-   domParent.removeChild(fiber.dom)
+   commitDeletion(fiber, domParent)
  }
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

+ function commitDeletion(fiber, domParent) {
+   if(fiber.dom) {
+     domParent.removeChild(fiber.dom)
+   } else {
+     commitDeletion(fiber.child, domParent)
+   }
+ }
```



## 第八步：Hooks

> 最后一步，我们有了 `function components` , 我们还需要添加状态。

让我们来将示例更改为经典的计数器组件。每次点击，状态增加 1 。

请注意，我们正在使用 `Didact.useState` 来获取和更新计算值。

```jsx
/** @jsx Didact.createElement */
function Counter() {
  const [state, setState] = Didact.useState(1)
  return <h1 onClick={() => setState(c => c + 1)}>Count: {state}</h1>
}
const element = <Counter />
```



在这里，我们从示例中调用 Counter 函数。 在该函数内部，我们调用 useState：

```jsx
function useState(initial) {
  // TODO
}
```



我们需要在调用函数组件之前初始化一些全局变量，以便可以在 useState 函数内部使用它们。



首先，我们设置 wipFiber （work in progress fiber）。

我们还向 fiber 添加了一个 hooks 数组，以支持在同一组件中多次调用 useState。 并且我们跟踪当前的 hook 索引。

```jsx
let wipFiber = null
let hookIndex = null

function updateFunctionComponent(fiber) {
  wipFiber = fiber
  hookIndex = 0
  wipFiber.hooks = []
  const children = [fiber.type(fiber.props)]
  // 调和
  reconcileChildren(fiber, children)
}

function useState(initial) {
  // TODO
}
```



当 function component 执行 useState 时，我们将检查是否有旧的 hook。我们使用 hook 索引去 fiber 的 `alternate` 上进行检查。如果我们有旧的 hook，我们将拷贝旧 hook 的 state 给新的 hook，否则，我们将初始化状。然后，将新的 hook 添加到 fiber，将 hookIndex 加 1，然后返回 state。

```jsx
function useState(initial) {
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex]
  
  const hook = {
    state: oldHook ? oldHook.state : initial,
  }

  wipFiber.hooks.push(hook)
  hookIndex++
  return [hook.state]
}
```



`useState` 还应该返回一个更新状态的函数，因此我们定义了一个 `setState` 函数，该函数接收一个 action（对于 Counter 示例，该 action 是将状态加 1 的函数）。

我们将该 action 推送到添加到 hook 的 queue 中。然后，我们执行与 render 功能类似的操作，将 wipRoot 设置为 nextUnitOfWork ，以便 work loop（让 workLoop 开始工作）可以开始新的 render 阶段。

```jsx
function useState(initial) {
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex]
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: [],
  }

  const setState = action => {
    hook.queue.push(action)
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
    }
    nextUnitOfWork = wipRoot
    deletions = []
  }

  wipFiber.hooks.push(hook)
  hookIndex++
  return [hook.state, setState]
}
```



但我们还没有运行 action,

下次渲染组件时，我们会从旧的 hook 队列中获取所有动作，然后将它们逐个应用于新的 hook 状态，因此当我们返回状态时，它会被更新。

```diff
function useState(initial) {
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex]
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: [],
  }

+ const actions = oldHook ? oldHook.queue : [];
+ actions.forEach(action => {
+   hook.state = action(hook.state)
+ })

  const setState = action => {
    hook.queue.push(action)
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
    }
    nextUnitOfWork = wipRoot
    deletions = []
  }

  wipFiber.hooks.push(hook)
  hookIndex++
  return [hook.state, setState]
}
```



到此。我们已经构建了自己的 React 版本。

您可以在 [codeandbox](https://link.juejin.cn/?target=https%3A%2F%2Fcodesandbox.io%2Fs%2Fdidact-8-21ost) 或 [github](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fpomber%2Fdidact) 上玩它。



## 结语

除了帮助您了解 React 的工作原理外，本文的目的之一是使您更轻松地深入 React 代码库。 这就是为什么我们几乎在所有地方都使用相同的变量和函数名称的原因。

例如，如果您在真正的 React 应用程序的功能组件之一中添加断点，则调用堆栈应显示：

- workLoop
- performUnitOfWork
- updateFunctionComponent

我们没有包括很多 React 功能和优化。 例如，以下是 React 可以做的一些事情：

- 在 Didact 中，我们在渲染阶段遍历整棵树。 相反，React 遵循一些提示和试探法，以跳过没有任何更改的整个子树。
- 我们还在提交阶段遍历整棵树。 React 仅保留具有影响力的 fiber 的链接列表，并且仅访问那些 fiber。
- 每次我们建立一个新的进行中的工作树时，我们都会为每根 fiber 创建新的对象。 React 回收了先前树中的 fiber。
- 当 Didact 在渲染阶段收到新的更新时，它将丢弃进行中的工作树，然后从根目录重新开始。 React 使用过期时间戳标记每个更新，并使用它来决定哪个更新具有更高的优先级。
- 还有很多…

您还可以轻松添加一些功能：

- 使用对象作为样式的属性值（style 属性）
- 扁平化 children 数组
- useEffect hook
- 使用 key 来进行调和（reconciliation）

感谢你的阅读！

再次附上原文链接：[Build your own React](https://link.juejin.cn?target=https%3A%2F%2Fpomb.us%2Fbuild-your-own-react%2F) 



## 完整代码

 [codeandbox](https://link.juejin.cn/?target=https%3A%2F%2Fcodesandbox.io%2Fs%2Fdidact-8-21ost) | [github](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fpomber%2Fdidact) 

```js
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === "object" ? child : createTextElement(child)
      )
    }
  };
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: []
    }
  };
}

function createDom(fiber) {
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  updateDom(dom, {}, fiber.props);

  return dom;
}

const isEvent = key => key.startsWith("on");
const isProperty = key => key !== "children" && !isEvent(key);
const isNew = (prev, next) => key => prev[key] !== next[key];
const isGone = (prev, next) => key => !(key in next);
function updateDom(dom, prevProps, nextProps) {
  //Remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(key => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {
      dom[name] = "";
    });

  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom[name] = nextProps[name];
    });

  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}

function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom;

  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DELETION") {
    commitDeletion(fiber, domParent);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function commitDeletion(fiber, domParent) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child, domParent);
  }
}

function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element]
    },
    alternate: currentRoot
  };
  deletions = [];
  nextUnitOfWork = wipRoot;
}

let nextUnitOfWork = null;
let currentRoot = null;
let wipRoot = null;
let deletions = null;

function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function performUnitOfWork(fiber) {
  const isFunctionComponent = fiber.type instanceof Function;
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

let wipFiber = null;
let hookIndex = null;

function updateFunctionComponent(fiber) {
  wipFiber = fiber;
  hookIndex = 0;
  wipFiber.hooks = [];
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

function useState(initial) {
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex];
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: []
  };

  const actions = oldHook ? oldHook.queue : [];
  actions.forEach(action => {
    hook.state = action(hook.state);
  });

  const setState = action => {
    hook.queue.push(action);
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot
    };
    nextUnitOfWork = wipRoot;
    deletions = [];
  };

  wipFiber.hooks.push(hook);
  hookIndex++;
  return [hook.state, setState];
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  reconcileChildren(fiber, fiber.props.children);
}

function reconcileChildren(wipFiber, elements) {
  let index = 0;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling = null;

  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber = null;

    const sameType = oldFiber && element && element.type == oldFiber.type;

    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE"
      };
    }
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT"
      };
    }
    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION";
      deletions.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      wipFiber.child = newFiber;
    } else if (element) {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}

const Didact = {
  createElement,
  render,
  useState
};

/** @jsx Didact.createElement */
function Counter() {
  const [state, setState] = Didact.useState(1);
  return (
    <h1 onClick={() => setState(c => c + 1)} style="user-select: none">
      Count: {state}
    </h1>
  );
}
const element = <Counter />;
const container = document.getElementById("root");
Didact.render(element, container);
```

























































