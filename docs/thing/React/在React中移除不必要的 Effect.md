---
id: removeeffect
slug: /react/removeeffect
title: 在React中移除不必要的 Effect
date: 2002-09-26
authors: 鲸落
tags: [React]
keywords: [React]
---

## useEffect

> 小知识点补充：依赖数组可以包含多个依赖项。当指定的所有依赖项在上一次渲染期间的值与当前值完全相同时，React 会跳过重新运行该 Effect。React 使用 [`Object.is`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 比较依赖项的值

title：你的useEffect可能一直都用错了

**useEffect的基本使用就不过多介绍了，这里我们介绍一些，你在项目中可以会遇到了一些useEffect的错误用法以及应该如何正确使用**



## 根据 props 或 state 来更新 state

假设你有一个包含了两个 state 变量的组件：`firstName` 和 `lastName`。你想通过把它们联结起来计算出 `fullName`。此外，每当 `firstName` 和 `lastName` 变化时，你希望 `fullName` 都能更新。你的第一直觉可能是添加一个 state 变量：`fullName`，并在一个 Effect 中更新它：

```
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 避免：多余的 state 和不必要的 Effect
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);

  // ...
}
```

大可不必这么复杂。而且这样效率也不高：它先是用 `fullName` 的旧值执行了整个渲染流程，然后立即使用更新后的值又重新渲染了一遍。让我们移除 state 变量和 Effect：

```
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // ✅ 非常好：在渲染期间进行计算
  const fullName = firstName + ' ' + lastName;
  
  // ...
}
```

**如果一个值可以基于现有的 props 或 state 计算得出，不要把它作为一个 state，而是在渲染期间直接计算这个值**。这将使你的代码更快（避免了多余的 “级联” 更新）、更简洁（移除了一些代码）以及更少出错（避免了一些因为不同的 state 变量之间没有正确同步而导致的问题）



## 缓存昂贵的计算 

这个组件使用它接收到的 props 中的 `filter` 对另一个 prop `todos` 进行筛选，计算得出 `visibleTodos`。你的直觉可能是把结果存到一个 state 中，并在 Effect 中更新它：

```
function TodoList({ todos, filter }) {

  const [newTodo, setNewTodo] = useState('');

  // 🔴 避免：多余的 state 和不必要的 Effect
  const [visibleTodos, setVisibleTodos] = useState([]);
  useEffect(() => {
    setVisibleTodos(getFilteredTodos(todos, filter));
  }, [todos, filter]);

  // ...
}
```

就像之前的例子一样，这既没有必要，也很低效。首先，移除 state 和 Effect：

```
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');

  // ✅ 如果 getFilteredTodos() 的耗时不长，这样写就可以了。
  const visibleTodos = getFilteredTodos(todos, filter);

  // ...
}
```

一般来说，这段代码没有问题！但是，`getFilteredTodos()` 的耗时可能会很长，或者你有很多 `todos`。这些情况下，当 `newTodo` 这样不相关的 state 变量变化时，你并不想重新执行 `getFilteredTodos()`。

你可以使用 `useMemo` Hook 缓存一个昂贵的计算。

```
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  const visibleTodos = useMemo(() => {

    // ✅ 除非 todos 或 filter 发生变化，否则不会重新执行
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);
  
  // ...
}
```

或者写成一行：

```
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');

  // ✅ 除非 todos 或 filter 发生变化，否则不会重新执行 getFilteredTodos()

  const visibleTodos = useMemo(() => getFilteredTodos(todos, filter), [todos, filter]);

  // ...
}
```

**这会告诉 React，除非 `todos` 或 `filter` 发生变化，否则不要重新执行传入的函数**。React 会在初次渲染的时候记住 `getFilteredTodos()` 的返回值。在下一次渲染中，它会检查 `todos` 或 `filter` 是否发生了变化。如果它们跟上次渲染时一样，`useMemo` 会直接返回它最后保存的结果。如果不一样，React 将再次调用传入的函数（并保存它的结果）。

你传入 `useMemo`的函数会在渲染期间执行，所以它仅适用于 **纯函数** 场景。



## 当 props 变化时重置所有 state 

`ProfilePage` 组件接收一个 prop：`userId`。页面上有一个评论输入框，你用了一个 state：`comment` 来保存它的值。有一天，你发现了一个问题：当你从一个人的个人资料导航到另一个时，`comment` 没有被重置。这导致很容易不小心把评论发送到不正确的个人资料。为了解决这个问题，你想在 `userId` 变化时，清除 `comment` 变量：

```
export default function ProfilePage({ userId }) {
  const [comment, setComment] = useState('');

  // 🔴 避免：当 prop 变化时，在 Effect 中重置 state
  useEffect(() => {
    setComment('');
  }, [userId]);

  // ...
}
```

但这是低效的，因为 `ProfilePage` 和它的子组件首先会用旧值渲染，然后再用新值重新渲染。并且这样做也很复杂，因为你需要在 `ProfilePage` 里面所有具有 state 的组件中都写这样的代码。例如，如果评论区的 UI 是嵌套的，你可能也想清除嵌套的 comment state。

取而代之的是，你可以通过为每个用户的个人资料组件提供一个明确的键来告诉 React 它们原则上是不同的个人资料组件。将你的组件拆分为两个组件，并从外部的组件传递一个 `key` 属性给内部的组件：

```
export default function ProfilePage({ userId }) {
  return (
    <Profile userId={userId} key={userId}/>
  );
}

function Profile({ userId }) {
  // ✅ 当 key 变化时，该组件内的 comment 或其他 state 会自动被重置
  const [comment, setComment] = useState('');

  // ...
}
```

通常，当在相同的位置渲染相同的组件时，React 会保留状态。**通过将 `userId` 作为 `key` 传递给 `Profile` 组件，使  React 将具有不同 `userId` 的两个 `Profile` 组件视为两个不应共享任何状态的不同组件**。每当 key（这里是 `userId`）变化时，React 将重新创建 DOM，并重置 `Profile` 组件和它的所有子组件的 state。现在，当在不同的个人资料之间导航时，`comment` 区域将自动被清空。

请注意，在这个例子中，只有外部的 `ProfilePage` 组件被导出并在项目中对其他文件可见。渲染 `ProfilePage` 的那些组件不用传递 `key` 给它：它们只需把 `userId` 作为常规 prop 传入即可。而 `ProfilePage` 将其作为 `key` 传递给内部的 `Profile` 组件是它的实现细节而已。



## 当 prop 变化时调整部分 state

有时候，当 prop 变化时，你可能只想重置或调整部分 state ，而不是所有 state。

`List` 组件接收一个 `items` 列表作为 prop，然后用 state 变量 `selection` 来保持已选中的项。当 `items` 接收到一个不同的数组时，你想将 `selection` 重置为 `null`：

```
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // 🔴 避免：当 prop 变化时，在 Effect 中调整 state
  useEffect(() => {
    setSelection(null);
  }, [items]);

  // ...
}
```

这不太理想。每当 `items` 变化时，`List` 及其子组件会先使用旧的 `selection` 值渲染。然后 React 会更新 DOM 并执行 Effect。最后，调用 `setSelection(null)` 将导致 `List` 及其子组件重新渲染，重新启动整个流程。

让我们从删除 Effect 开始。取而代之的是在渲染期间直接调整 state：

```
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // 好一些：在渲染期间调整 state
  const [prevItems, setPrevItems] = useState(items);

  if (items !== prevItems) {
    setPrevItems(items);
    setSelection(null);
  }

  // ...
}
```

像这样 [存储前序渲染的信息](https://react.docschina.org/reference/react/useState#storing-information-from-previous-renders) 可能很难理解，但它比在 Effect 中更新这个 state 要好。上面的例子中，在渲染过程中直接调用了 `setSelection`。当它执行到 `return` 语句退出后，React 将 **立即** 重新渲染 `List`。此时 React 还没有渲染 `List` 的子组件或更新 DOM，这使得 `List` 的子组件可以跳过渲染旧的 `selection` 值。

在渲染期间更新组件时，React 会丢弃已经返回的 JSX 并立即尝试重新渲染。为了避免非常缓慢的级联重试，React 只允许在渲染期间更新 **同一** 组件的状态。如果你在渲染期间更新另一个组件的状态，你会看到一条报错信息。条件判断 `items !== prevItems` 是必要的，它可以避免无限循环。你可以像这样调整 state，但任何其他副作用（比如变化 DOM 或设置的延时）应该留在事件处理函数或 Effect 中，以 [保持组件纯粹](https://react.docschina.org/learn/keeping-components-pure)。

**虽然这种方式比 Effect 更高效，但大多数组件也不需要它**。无论你怎么做，根据 props 或其他 state 来调整 state 都会使数据流更难理解和调试。总是检查是否可以通过添加 [key 来重置所有 state](https://react.docschina.org/learn/you-might-not-need-an-effect#resetting-all-state-when-a-prop-changes)，或者 [在渲染期间计算所需内容](https://react.docschina.org/learn/you-might-not-need-an-effect#updating-state-based-on-props-or-state)。例如，你可以存储已选中的 **item ID** 而不是存储（并重置）已选中的 **item**：

```
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // ✅ 非常好：在渲染期间计算所需内容
  const selection = items.find(item => item.id === selectedId) ?? null;
  
  // ...
}
```

现在完全不需要 “调整” state 了。如果包含已选中 ID 的项出现在列表中，则仍然保持选中状态。如果没有找到匹配的项，则在渲染期间计算的 `selection` 将会是 `null`。行为不同了，但可以说更好了，因为大多数对 `items` 的更改仍可以保持选中状态。



## 在事件处理函数中共享逻辑 

假设你有一个产品页面，上面有两个按钮（购买和付款），都可以让你购买该产品。当用户将产品添加进购物车时，你想显示一个通知。在两个按钮的 click 事件处理函数中都调用 `showNotification()` 感觉有点重复，所以你可能想把这个逻辑放在一个 Effect 中：

```
function ProductPage({ product, addToCart }) {

  // 🔴 避免：在 Effect 中处理属于事件特定的逻辑
  useEffect(() => {
    if (product.isInCart) {
      showNotification(`已添加 ${product.name} 进购物车！`);
    }
  }, [product]);

  function handleBuyClick() {
    addToCart(product);
  }

  function handleCheckoutClick() {
    addToCart(product);
    navigateTo('/checkout');
  }

  // ...
}
```

这个 Effect 是多余的。而且很可能会导致问题。例如，假设你的应用在页面重新加载之前 “记住” 了购物车中的产品。如果你把一个产品添加到购物车中并刷新页面，通知将再次出现。每次刷新该产品页面时，它都会出现。这是因为 `product.isInCart` 在页面加载时已经是 `true` 了，所以上面的 Effect 每次都会调用 `showNotification()`。

**当你不确定某些代码应该放在 Effect 中还是事件处理函数中时，先自问 为什么 要执行这些代码。Effect 只用来执行那些显示给用户时组件 需要执行 的代码**。在这个例子中，通知应该在用户 **按下按钮** 后出现，而不是因为页面显示出来时！删除 Effect 并将共享的逻辑放入一个被两个事件处理程序调用的函数中：

```
function ProductPage({ product, addToCart }) {
  // ✅ 非常好：事件特定的逻辑在事件处理函数中处理
  function buyProduct() {
    addToCart(product);
    showNotification(`已添加 ${product.name} 进购物车！`);
  }

  function handleBuyClick() {
    buyProduct();
  }

  function handleCheckoutClick() {
    buyProduct();
    navigateTo('/checkout');
  }

  // ...
}
```

这既移除了不必要的 Effect，又修复了问题。



## 发送 POST 请求 

这个 `Form` 组件会发送两种 POST 请求。它在页面加载之际会发送一个分析请求。当你填写表格并点击提交按钮时，它会向 `/api/register` 接口发送一个 POST 请求：

```
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ 非常好：这个逻辑应该在组件显示时执行
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  // 🔴 避免：在 Effect 中处理属于事件特定的逻辑
  const [jsonToSubmit, setJsonToSubmit] = useState(null);
  useEffect(() => {
    if (jsonToSubmit !== null) {
      post('/api/register', jsonToSubmit);
    }
  }, [jsonToSubmit]);

  function handleSubmit(e) {
    e.preventDefault();
    setJsonToSubmit({ firstName, lastName });
  }

  // ...
}
```

让我们应用与之前示例相同的准则。

分析请求应该保留在 Effect 中。这是 **因为** 发送分析请求是表单显示时就需要执行的

然而，发送到 `/api/register` 的 POST 请求并不是由表单 **显示** 时引起的。你只想在一个特定的时间点发送请求：当用户按下按钮时。它应该只在这个 **特定的交互** 中发生。删除第二个 Effect，将该 POST 请求移入事件处理函数中：

```
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ 非常好：这个逻辑应该在组件显示时执行
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    // ✅ 非常好：事件特定的逻辑在事件处理函数中处理
    post('/api/register', { firstName, lastName });
  }

  // ...
}
```

当你决定将某些逻辑放入事件处理函数还是 Effect 中时，你需要回答的主要问题是：从用户的角度来看它是 **怎样的逻辑**。如果这个逻辑是由某个特定的交互引起的，请将它保留在相应的事件处理函数中。如果是由用户在屏幕上 **看到** 组件时引起的，请将它保留在 Effect 中。



## 初始化应用 

有些逻辑只需要在应用加载时执行一次。

你可能想把它放在一个顶层组件的 Effect 中：

```
function App() {
  // 🔴 避免：把只需要执行一次的逻辑放在 Effect 中
  useEffect(() => {
    loadDataFromLocalStorage();
    checkAuthToken();
  }, []);

  // ...
}
```

然后，你很快就会发现它在开发环境会执行两次。这会导致一些问题——例如，它可能使身份验证 token 无效，因为该函数不是为被调用两次而设计的。一般来说，当组件重新挂载时应该具有一致性。包括你的顶层 `App` 组件。

尽管在实际的生产环境中它可能永远不会被重新挂载，但在所有组件中遵循相同的约束条件可以更容易地移动和复用代码。如果某些逻辑必须在 **每次应用加载时执行一次**，而不是在 **每次组件挂载时执行一次**，可以添加一个顶层变量来记录它是否已经执行过了：

```
let didInit = false;
function App() {
  useEffect(() => {
    if (!didInit) {
      didInit = true;

      // ✅ 只在每次应用加载时执行一次
      loadDataFromLocalStorage();
      checkAuthToken();

    }
  }, []);

  // ...
}
```

你也可以在模块初始化和应用渲染之前执行它：

```
if (typeof window !== 'undefined') { // 检测我们是否在浏览器环境
   // ✅ 只在每次应用加载时执行一次
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

顶层代码会在组件被导入时执行一次——即使它最终并没有被渲染。为了避免在导入任意组件时降低性能或产生意外行为，请不要过度使用这种方法。将应用级别的初始化逻辑保留在像 `App.js` 这样的根组件模块或你的应用入口中。



## 将数据传递给父组件 

`Child` 组件获取了一些数据并在 Effect 中传递给 `Parent` 组件：

```
function Parent() {
  const [data, setData] = useState(null);

  // ...
  return <Child onFetched={setData} />;
}

function Child({ onFetched }) {
  const data = useSomeAPI();

  // 🔴 避免：在 Effect 中传递数据给父组件
  useEffect(() => {
    if (data) {
      onFetched(data);
    }
  }, [onFetched, data]);

  // ...
}
```

在 React 中，数据从父组件流向子组件。当你在屏幕上看到了一些错误时，你可以通过一路追踪组件树来寻找错误信息是从哪个组件传递下来的，从而找到传递了错误的 prop 或具有错误的 state 的组件。当子组件在 Effect 中更新其父组件的 state 时，数据流变得非常难以追踪。既然子组件和父组件都需要相同的数据，那么可以让父组件获取那些数据，并将其 **向下传递** 给子组件：

```
function Parent() {
  const data = useSomeAPI();

  // ...
  // ✅ 非常好：向子组件传递数据
  return <Child data={data} />;
}

function Child({ data }) {
  // ...
}
```

这更简单，并且可以保持数据流的可预测性：数据从父组件流向子组件。



## 订阅外部 store 

有时候，你的组件可能需要订阅 React state 之外的一些数据。这些数据可能来自第三方库或内置浏览器 API。由于这些数据可能在 React 无法感知的情况下发变化，你需要在你的组件中手动订阅它们。这经常使用 Effect 来实现，例如：

```
function useOnlineStatus() {
  // 不理想：在 Effect 中手动订阅 store
  const [isOnline, setIsOnline] = useState(true);
  
  useEffect(() => {
    function updateState() {
      setIsOnline(navigator.onLine);
    }

    updateState();

    window.addEventListener('online', updateState);
    window.addEventListener('offline', updateState);

    return () => {
      window.removeEventListener('online', updateState);
      window.removeEventListener('offline', updateState);
    };

  }, []);

  return isOnline;
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

这个组件订阅了一个外部的 store 数据（在这里，是浏览器的 `navigator.onLine` API）。由于这个 API 在服务端不存在（因此不能用于初始的 HTML），因此 state 最初被设置为 `true`。每当浏览器 store 中的值发生变化时，组件都会更新它的 state。

尽管通常可以使用 Effect 来实现此功能，但 React 为此针对性地提供了一个 Hook 用于订阅外部 store。删除 Effect 并将其替换为调用 [`useSyncExternalStore`](https://react.docschina.org/reference/react/useSyncExternalStore)：

```
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);

  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function useOnlineStatus() {
  // ✅ 非常好：用内置的 Hook 订阅外部 store

  return useSyncExternalStore(
    subscribe, // 只要传递的是同一个函数，React 不会重新订阅
    () => navigator.onLine, // 如何在客户端获取值
    () => true // 如何在服务端获取值
  );
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

与手动使用 Effect 将可变数据同步到 React state 相比，这种方法能减少错误。通常，你可以写一个像上面的 `useOnlineStatus()` 这样的自定义 Hook，这样你就不需要在各个组件中重复写这些代码。



## 获取数据 

许多应用使用 Effect 来发起数据获取请求。像这样在 Effect 中写一个数据获取请求是相当常见的：

```
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // 🔴 避免：没有清除逻辑的获取数据
    fetchResults(query, page).then(json => {
      setResults(json);
    });
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }

  // ...
}
```

你 **不需要** 把这个数据获取逻辑迁移到一个事件处理函数中。

这可能看起来与之前需要将逻辑放入事件处理函数中的示例相矛盾！但是，考虑到这并不是 **键入事件**，这是在这里获取数据的主要原因。搜索输入框的值经常从 URL 中预填充，用户可以在不关心输入框的情况下导航到后退和前进页面。

`page` 和 `query` 的来源其实并不重要。只要该组件可见，你就需要通过当前 `page` 和 `query` 的值，保持 `results` 和网络数据的 [同步](https://react.docschina.org/learn/synchronizing-with-effects)。这就是为什么这里是一个 Effect 的原因。

然而，上面的代码有一个问题。假设你快速地输入 `“hello”`。那么 `query` 会从 `“h”` 变成 `“he”`，`“hel”`，`“hell”` 最后是 `“hello”`。这会触发一连串不同的数据获取请求，但无法保证对应的返回顺序。例如，`“hell”` 的响应可能在 `“hello”` 的响应 **之后** 返回。由于它的 `setResults()` 是在最后被调用的，你将会显示错误的搜索结果。这种情况被称为 “**竞态条件**”：两个不同的请求 “相互竞争”，并以与你预期不符的顺序返回。

**为了修复这个问题，你需要添加一个清理函数来忽略较早的返回结果：**

```
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    let ignore = false;
    fetchResults(query, page).then(json => {
      if (!ignore) {
        setResults(json);
      }
    });

    return () => {
      ignore = true;
    };
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }

  // ...
}
```

这确保了当你在 Effect 中获取数据时，除了最后一次请求的所有返回结果都将被忽略。

处理竞态条件并不是实现数据获取的唯一难点。你可能还需要考虑缓存响应结果（使用户点击后退按钮时可以立即看到先前的屏幕内容），如何在服务端获取数据（使服务端初始渲染的 HTML 中包含获取到的内容而不是加载动画），以及如何避免网络瀑布（使子组件不必等待每个父组件的数据获取完毕后才开始获取数据）。

**这些问题适用于任何 UI 库，而不仅仅是 React。解决这些问题并不容易，这也是为什么现代框架提供了比在 Effect 中获取数据更有效的内置数据获取机制的原因。**

如果你不使用框架（也不想开发自己的框架），但希望使从 Effect 中获取数据更符合人类直觉，请考虑像这个例子一样，将获取逻辑提取到一个自定义 Hook 中：

```
function SearchResults({ query }) {
  const [page, setPage] = useState(1);
  const params = new URLSearchParams({ query, page });
  const results = useData(`/api/search?${params}`);

  function handleNextPageClick() {
    setPage(page + 1);
  }

  // ...
}



function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch(url)then(response => response.json()).then(json => {
        if (!ignore) {
          setData(json);
        }
      });

    return () => {
      ignore = true;
    };
  }, [url]);

  return data;

}
```

你可能还想添加一些错误处理逻辑以及跟踪内容是否处于加载中。你可以自己编写这样的 Hook，也可以使用 React 生态中已经存在的许多解决方案。**虽然仅仅使用自定义 Hook 不如使用框架内置的数据获取机制高效，但将数据获取逻辑移动到自定义 Hook 中将使后续采用高效的数据获取策略更加容易。**

一般来说，当你不得不编写 Effect 时，请留意是否可以将某段功能提取到专门的内置 API 或一个更具声明性的自定义 Hook 中，比如上面的 `useData`。你会发现组件中的原始 `useEffect` 调用越少，维护应用将变得更加容易。



## 补充

### 如何处理在开发环境中 Effect 执行两次？ 

在开发环境中，React 有意重复挂载你的组件，以查找像上面示例中的错误。**正确的态度是“如何修复 Effect 以便它在重复挂载后能正常工作”，而不是“如何只运行一次 Effect”**。

通常的解决办法是实现清理函数。清理函数应该停止或撤销 Effect 正在执行的任何操作。简单来说，用户不应该感受到 Effect 只执行一次（如在生产环境中）和执行“挂载 → 清理 → 挂载”过程（如在开发环境中）之间的差异。



### 推荐useEffect中的网络请求

```jsx
 useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
        // 卸载的之前没有获取到网络数据可以不设置
      ignore = true;
    }
}, [person]);
```



### 参考链接

[你可能不需要 Effect](https://react.docschina.org/learn/you-might-not-need-an-effect)