---
id: reacthooks
slug: /reacthooks
title: React Hooks
date: 2023-07-17
authors: 鲸落
tags: [React]
keywords: [React]
---



以 `use` 开头的函数被称为 **Hook**。`useState` 是 React 提供的一个内置 Hook。你可以在 [React API 参考](https://react.docschina.org/reference/react) 中找到其他内置的 Hook。你也可以通过组合现有的 Hook 来编写属于你自己的 Hook。

Hook 比普通函数更为严格。你只能在你的组件（或其他 Hook）的 **顶层** 调用 Hook。如果你想在一个条件或循环中使用 `useState`，请提取一个新的组件并在组件内部使用它。



## 了解Hooks

- Hook是React 16.8的新增特性，它可以让我们在不编写class的情况下使用state以及其他的React特性(比如生命周期)【在不编写类组件的情况下】

- Hook的使用场景:

  - Hook的出现基本可以代替我们之前所有使用class组件的地方
  - 但是如果是一个旧的项目，你并不需要直接将所有的代码重构为Hooks，因为它宪全向下兼容，你可以渐进式的来使用它
  - Hook只能在函数组件中使用，不能在类组件，或者函数组件之外的地方使用

- **计数器案例**：

  - ```jsx
    import React, { memo, useState } from 'react'
    
    const Fun = memo(() => {
        //数组的解构
        // 数组下标0为我们初始化定义的数值【就是在初始化的时候用一下，就是useState我们传的参数0】
        // 下标1位一个函数，可以调用，调用后页面可以刷新
      const [ count, setCount] = useState(0)
    
      return (
        <div>
            <div>num:{count}</div>
               {/* 
                    点击button按钮后，会完成两件事情
                    - 调用setCount，设置一个新的值
                    - 组件重新渲染，并且根据新的值返回DOM结构 
                */}
            <button onClick={()=>setCount(count+1)}>+1</button>
              {* 这里函数调用没有this *}
            <button onClick={()=>setCount(count-1)}>-1</button>
        </div>
      )
    })
    
    export default Fun
    ```

    

- **使用Hook会有两个额外的规则:**

  - 只能在函数最外层调用Hook。不要在循环、条件判断或者子函数中调用。
  - 只能在 React的函数组件中调用Hook。不要在其他JavaScript函数中调用。

## 常见hooks

### react hooks

与状态的流转相关的：

1. `useState`
2. `useReducer`
3. `useContext`

与处理副作用相关的：

1. `useEffect`
2. `useLayoutEffect`

与提高操作自由度相关的：

1. `useRef`

与性能优化相关的：

1. `useMemo`
2. `useCallback`

与调试相关：

1. `useDebugValue`

随着`React`持续迭代，又引入了几个`hook`，本质来说他们都是为了完善开发模式，对现有`hook`能力进行补充或约束：

1. `useImperativeHandle`（控制`useRef`防止其失控）
2. `useEffectEvent`（对`useEffect`能力的补充）
3. `useInsertionEffect`（对`useEffect`场景的补充）



### 路由hooks

| hooks名           | 作用                                  | 说明                      |
| ----------------- | ------------------------------------- | ------------------------- |
| `useParams`       | 返回当前参数                          | 根据路径读取参数          |
| `useNavigate`     | 返回当前路由                          | 代替原有V5中的 useHistory |
| `useOutlet`       | 返回根据路由生成的element             |                           |
| `useLocation`     | 返回当前的location 对象               |                           |
| `useRoutes`       | 同Routers组件一样，只不过是在js中使用 |                           |
| `useSearchParams` | 用来匹配URL中?后面的搜索参数          |                           |



### redux hooks

- useSelector
- useDispatch
- useStore



## React Hooks

### useState

#### 概念

`useState` 是一个 React Hook，它允许你向组件添加一个 [状态变量](https://react.docschina.org/learn/state-a-components-memory)。

`const [state, setState] = useState(initialState);`

**参数**

`initialState`：

- 你希望 state 初始化的值。它可以是任何类型的值，但对于函数有特殊的行为。在初始渲染后，此参数将被忽略。

- 如果传递函数作为 `initialState`，则它将被视为 **初始化函数**。它应该是纯函数，不应该接受任何参数，并且应该返回一个任何类型的值。当初始化组件时，React 将调用你的初始化函数，并将其返回值存储为初始状态



#### 用法

在组件的顶层调用 `useState` 来声明一个或多个 [状态变量](https://react.docschina.org/learn/state-a-components-memory)。

```
import { useState } from 'react';

function MyComponent() {

  const [age, setAge] = useState(42);

  const [name, setName] = useState('Taylor');

  // ...
```

按照惯例使用 [数组解构](https://javascript.info/destructuring-assignment) 来命名状态变量，例如 `[something, setSomething]`。

`useState` 返回一个只包含两个项的数组：

1. 该状态变量 当前的 state，最初设置为你提供的 初始化 state。
2. `set` 函数，它允许你在响应交互时将 state 更改为任何其他值。

要更新屏幕上的内容，请使用新状态调用 `set` 函数：

```
function handleClick() {
  setName('Robin');
}
```

React 会存储新状态，使用新值重新渲染组件，并更新 UI。



#### 为组件添加状态

:::note 注意

调用 `set` 函数 [**不会** 改变已经执行的代码中当前的 state](https://react.docschina.org/reference/react/useState#ive-updated-the-state-but-logging-gives-me-the-old-value)：

```
function handleClick() {
  setName('Robin');
  console.log(name); // Still "Taylor"!
}
```

它只影响 **下一次** 渲染中 `useState` 返回的内容。

:::



#### 根据先前的 state 更新 state

```jsx
// 错误
function handleClick() {
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
}

// 正确
function handleClick() {
  setAge(a => a + 1); // setAge(42 => 43)
  setAge(a => a + 1); // setAge(43 => 44)
  setAge(a => a + 1); // setAge(44 => 45)
}
```



#### 使用 key 重置状态

在 [渲染列表](https://react.docschina.org/learn/rendering-lists) 时，你经常会遇到 `key` 属性。然而，它还有另外一个用途。

你可以 **通过向组件传递不同的 `key` 来重置组件的状态**。在这个例子中，重置按钮改变 `version` 状态变量，我们将它作为一个 `key` 传递给 `Form` 组件。当 `key` 改变时，React 会从头开始重新创建 `Form` 组件（以及它的所有子组件），所以它的状态被重置了。

```jsx
import { useState } from 'react';

export default function App() {
  const [version, setVersion] = useState(0);

  function handleReset() {
    setVersion(version + 1);
  }

  return (
    <>
      <button onClick={handleReset}>Reset</button>
      <Form key={version} />
    </>
  );
}

function Form() {
  const [name, setName] = useState('Taylor');

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <p>Hello, {name}.</p>
    </>
  );
}
```



#### 将state设置为函数

你不能像这样把函数放入状态：

```
const [fn, setFn] = useState(someFunction);

function handleClick() {
  setFn(someOtherFunction);
}
```

因为你传递了一个函数，React 认为 `someFunction` 是一个初始化函数，而 `someOtherFunction` 是一个更新函数，于是它尝试调用它们并存储结果。要实际 **存储** 一个函数，你必须在两种情况下在它们之前加上 `() =>`。然后 React 将存储你传递的函数。

```
const [fn, setFn] = useState(() => someFunction);

function handleClick() {
  setFn(() => someOtherFunction);
}
```



### useReducer

#### 概念

`useReducer` 是一个 React Hook，它允许你向组件里面添加一个 [reducer](https://react.docschina.org/learn/extracting-state-logic-into-a-reducer)。

`const [state, dispatch] = useReducer(reducer, initialArg, init?)`

```jsx
// 在组件的顶层作用域调用 useReducer 以创建一个用于管理状态的 reducer
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```



**参数**

- `reducer`：用于更新 state 的纯函数。参数为 state 和 action，返回值是更新后的 state。state 与 action 可以是任意合法值。
- `initialArg`：用于初始化 state 的任意值。初始值的计算逻辑取决于接下来的 `init` 参数。
- 可选参数 `init`：用于计算初始值的函数。如果存在，使用 `init(initialArg)` 的执行结果作为初始值，否则使用 `initialArg`。

**返回值**

`useReducer` 返回一个由两个值组成的数组：

1. 当前的 state。初次渲染时，它是 `init(initialArg)` 或 `initialArg` （如果没有 `init` 函数）。
2. `dispatch` 函数。用于更新 state 并触发组件的重新渲染。



#### 使用

```jsx
import React, { memo, useReducer } from 'react';

function reducer(state, action) {
  console.log(state); // { age: 42 }
  console.log(action); // {type: 'incremented_age'}

  if (action.type === 'incremented_age') {
    return {
      age: state.age + 1,
    };
  }
}

const Two = memo(() => {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  console.log(state);
  function handleClick() {
    dispatch({ type: 'incremented_age' });
  }

  return (
    <div>
      <button onClick={handleClick}>{state.age}</button>
    </div>
  );
});

export default Two;
```



:::info 补充：对比 `useState` 和 `useReducer` 

Reducers 并非没有缺点！以下是比较它们的几种方法：

- **代码体积：** 通常，在使用 `useState` 时，一开始只需要编写少量代码。而 `useReducer` 必须提前编写 reducer 函数和需要调度的 actions。但是，当多个事件处理程序以相似的方式修改 state 时，`useReducer` 可以减少代码量。
- **可读性：** 当状态更新逻辑足够简单时，`useState` 的可读性还行。但是，一旦逻辑变得复杂起来，它们会使组件变得臃肿且难以阅读。在这种情况下，`useReducer` 允许你将状态更新逻辑与事件处理程序分离开来。
- **可调试性：** 当使用 `useState` 出现问题时, 你很难发现具体原因以及为什么。 而使用 `useReducer` 时， 你可以在 reducer 函数中通过打印日志的方式来观察每个状态的更新，以及为什么要更新（来自哪个 `action`）。 如果所有 `action` 都没问题，你就知道问题出在了 reducer 本身的逻辑中。 然而，与使用 `useState` 相比，你必须单步执行更多的代码。
- **可测试性：** reducer 是一个不依赖于组件的纯函数。这就意味着你可以单独对它进行测试。一般来说，我们最好是在真实环境中测试组件，但对于复杂的状态更新逻辑，针对特定的初始状态和 `action`，断言 reducer 返回的特定状态会很有帮助。
- **个人偏好：** 并不是所有人都喜欢用 reducer，没关系，这是个人偏好问题。你可以随时在 `useState` 和 `useReducer` 之间切换，它们能做的事情是一样的！

如果你在修改某些组件状态时经常出现问题或者想给组件添加更多逻辑时，我们建议你还是使用 reducer。当然，你也不必整个项目都用 reducer，这是可以自由搭配的。你甚至可以在一个组件中同时使用 `useState` 和 `useReducer`。

:::



:::caution 陷阱

state 是只读的。即使是对象或数组也不要尝试修改它：

```
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // 🚩 不要像下面这样修改一个对象类型的 state：
      state.age = state.age + 1;
      return state;
    }
```

正确的做法是返回新的对象：

```
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ✅ 正确的做法是返回新的对象
      return {
        ...state,
        age: state.age + 1
      };
    }
```

:::



#### 避免重新创建初始值

React 会保存 state 的初始值并在下一次渲染时忽略它。

```
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, createInitialState(username));
  // ...
```

虽然 `createInitialState(username)` 的返回值只用于初次渲染，但是在每一次渲染的时候都会被调用。如果它创建了比较大的数组或者执行了昂贵的计算就会浪费性能。

你可以通过给  `useReducer` 的第三个参数传入 **初始化函数** 来解决这个问题：

```
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, username, createInitialState);
  // ...
```

需要注意的是你传入的参数是 `createInitialState` 这个 **函数自身**，而不是执行 `createInitialState()` 后的返回值。这样传参就可以保证初始化函数不会再次运行。

在上面这个例子中，`createInitialState` 有一个 `username` 参数。如果初始化函数不需要参数就可以计算出初始值，可以把 `useReducer` 的第二个参数改为 `null`

**使用初始化函数和直接传入初始值的区别**：[useReducer – React 中文文档 (docschina.org)](https://react.docschina.org/reference/react/useReducer#examples-initializer)





### useContext

#### 概念

`useContext` 是一个 React Hook，可以让你读取和订阅组件中的context

`const value = useContext(SomeContext)`

**参数**：`SomeContext`：先前用 [`createContext`](https://react.docschina.org/reference/react/createContext) 创建的 context。context 本身不包含信息，它只代表你可以提供或从组件中读取的信息类型。

**返回值**：

- `useContext` 为调用组件返回 context 的值。它被确定为传递给树中调用组件上方最近的 `SomeContext.Provider` 的 `value`。
- 如果没有这样的 provider，那么返回值将会是为创建该 context 传递给 [`createContext`](https://react.docschina.org/reference/react/createContext) 的 `defaultValue`。
- 返回的值始终是最新的。如果 context 发生变化，React 会自动重新渲染读取 context 的组件。



#### 用法

用来共享数据

```js
//创建共享数据：定义一个js文件
import { createContext } from 'react'

const userContext = createContext()
const ThemeContext = createContext()

export { userContext, ThemeContext }
```



```jsx
//先包裹：在大index中包裹使用
//记得先将上述的js导入

root.render (
    <userContext.Provide value={{name:'xjn',age:18}}>
        <ThemeContext.Provide value={{color:red, size:20}}>
            <App/>
        </ThemeContext.Provide>
    </userContext.Provide>
)
```



```jsx
// 在函数式组件中使用
// 先导入我们的定义的js文件和useContext，在使用
import { userContext, ThemeContext } from '..'
import { useContext } from 'react'

const App = memo(()=>{
    const user = useContext(userContext)
    const theme = useContext(ThemeContext)
    
    return (
        <div>
            <div>user：{ user.name }</div>
            <div style={{color:theme.color, fontSize:theme.size}}>Theme</div>
        </div>
    )
})
```



#### createContext

`createContext` 能让你创建一个 [context](https://react.docschina.org/learn/passing-data-deeply-with-context) 以便组件能够提供和读取。

`const SomeContext = createContext(defaultValue)`

**参数**

- `defaultValue`：当包裹需要读取上下文的组件树中没有匹配的上下文时，你可以用该值作上下文的。倘若你没有任何有意义的默认值，可指定其为 `null`。该默认值是用于作为”最后的手段“的备选值。它是静态的，永远不会随时间改变。**该值永远不会发生改变。当 React 无法找到匹配的 provider 时，该值会被作为备选值**





### useCallback

#### 概念

`useCallback` 是一个允许你在多次渲染中缓存函数的 React Hook

`const cachedFn = useCallback(fn, dependencies)`



**参数** 

- `fn`：想要缓存的函数。此函数可以接受任何参数并且返回任何值。React 将会在初次渲染而非调用时返回该函数。当进行下一次渲染时，如果 `dependencies` 相比于上一次渲染时没有改变，那么 React 将会返回相同的函数。否则，React 将返回在最新一次渲染中传入的函数，并且将其缓存以便之后使用。React 不会调用此函数，而是返回此函数。你可以自己决定何时调用以及是否调用。
- `dependencies`：有关是否更新 `fn` 的所有响应式值的一个列表。响应式值包括 props、state，和所有在你组件内部直接声明的变量和函数。如果你的代码检查工具配置了 React，那么它将校验每一个正确指定为依赖的响应式值。依赖列表必须具有确切数量的项，并且必须像 `[dep1, dep2, dep3]` 这样编写。React 使用 `Object.is` 比较每一个依赖和它的之前的值。

**返回值** 

- 在初次渲染时，`useCallback` 返回你已经传入的 `fn` 函数
- 在之后的渲染中, 如果依赖没有改变，`useCallback` 返回上一次渲染中缓存的 `fn` 函数；否则返回这一次渲染传入的 `fn`



- useCallback实际的目的是为了进行性能的优化。
- 如何进行性能的优化呢?
  - useCallback会返回一个函数的memoized (记忆的)值
  - 在依赖不变的情况下，多次定义的时候，返回的值是相同的
- 记住是函数！！！，传递函数，不是传递数据，因为函数会在每次渲染是进行变化，使用useCallback会纪录
- **通常使用useCallback的目的是不希望子组件进行多次渲染并不是为了函数进行缓存**



#### 例子1：三种定义对比

```jsx
const ActivePage = memo(() => {

  const [ count, setCount ] = useState(0)
  
  const addCount1 = () =>{
    setCount( count + 1 )
  }

  const addCount2 = useCallback(function(){
    setCount(count + 1)
  }, [count])

  return (
    <div>
      { count }
      <button onClick={addCount1}>+1</button>
      <button onClick={addCount2}>+1</button>
      <button onClick={()=> { setCount(count+1) }}>+1</button>
    </div>
  )
})
```

**上述三种方法，不管我们使用哪一个对count进行+1的操作，得到的结果都是一样的，并不会带来性能优化，useCallback中的函数在count发生变化的时候也会重新定义执行**



#### 例子2：传递参数

```jsx
const Index = memo((props) => {

  const { addCount } = props
  console.log('子组件重新渲染');
  return (
    <div>
      <button onClick={addCount}>子组件+1</button>
    </div>
  )
})

const ActivePage = memo(() => {

  const [ count, setCount ] = useState(0)
  
  // const addCount = () =>{
  //   setCount( count + 1 )
  // }

  // 这里在count发生变化的时候，给useCallback传递的函数也是新函数
  const addCount = useCallback(function(){
    setCount(count + 1)
  }, [count])

  return (
    <div>
      { count }
      <button onClick={addCount}>父组件+1</button>

      <Index addCount={addCount}></Index>
    </div>
  )
})
```

我们可以发现，不管我们是否使用usecallback，“**子组件都会重新渲染**”，那usecallback的性能优化在哪里呢？？？

- 使用useCallback：count发生变化的时候，给useCallback传递的函数也是新函数，所有useCallback的返回值也是新的
- 没有使用useCallback：组件重新渲染，函数重新定义渲染



#### 例子3

```jsx
const Index = memo((props) => {

  const { addCount } = props
  console.log('子组件重新渲染');
  return (
    <div>
      <button onClick={addCount}>子组件+1</button>
    </div>
  )
})

const ActivePage = memo(() => {

  const [ count, setCount ] = useState(0)
  const [ num, setNum ] = useState(10)
  
  // const addCount = () =>{
  //   setCount( count + 1 )
  // }

  const addCount = useCallback(function(){
    setCount(count + 1)
  }, [count])

  return (
    <div>
      { count }
      <br />
      { num }
      <br />
      <button onClick={addCount}>父组件+1</button>

      <Index addCount={addCount}></Index>

      <button onClick={() => { setNum(num+1) }}>修改num+1</button>
    </div>
  )
})
```

- 这个时候当我们不使用useCallback，点击按钮 修改num+1 的时候，会发现子组件也渲染了，按道理来说，我们没有修改子组件所需要的东西，在性能优化的角度上，子组件不应该被渲染才对
- 因为父组件重新选择的时候，不使用useCallback就相当于重新定义了一个函数，将新的函数传递给了子组件，所有子组件也重新渲染了
- 但是使用了useCallback之后呢，会保存记忆值



#### useCallback进一步性能优化

useCallback的使用类似于useEffect，第二个参数传入改变值进行监听改变，当我们使用空数组的时候，会有一个**闭包陷阱**的问题，对于count+1，仅仅加到1，后面的count一直取的是0，所以一直是1

我们现在想要对其进行进一步的优化：**当count发生改变时，也使用同一个函数**

- 做法一：将第二个参数`[count]`参数，但是会有一个闭包陷阱的问题
- 做法二：使用useRef



#### 总结

- useCalLback性能优化的点：**当需要将一个函数传递给升组件时，最好使用useCallback进行优化，将优化之后的函数，传递给子组件**



### useMemo

#### 概念

`useMemo(calculateValue, dependencies)`类似于useCallback，但是他优化的的不是一个函数本身，而是**函数的返回值**

**参数**

- `calculateValue`：要缓存计算值的函数。它应该是一个没有任何参数的纯函数，并且可以返回任意类型。React 将会在首次渲染时调用该函数；在之后的渲染中，如果 `dependencies` 没有发生变化，React 将直接返回相同值。否则，将会再次调用 `calculateValue` 并返回最新结果，然后缓存该结果以便下次重复使用。
- `dependencies`：所有在 `calculateValue` 函数中使用的响应式变量组成的数组。响应式变量包括 props、state 和所有你直接在组件中定义的变量和函数。如果你在代码检查工具中 [配置了 React](https://react.docschina.org/learn/editor-setup#linting)，它将会确保每一个响应式数据都被正确地定义为依赖项。依赖项数组的长度必须是固定的并且必须写成 `[dep1, dep2, dep3]` 这种形式。React 使用 [`Object.is`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 将每个依赖项与其之前的值进行比较。

**返回值**

- 在初次渲染时，`useMemo` 返回不带参数调用 `calculateValue` 的结果
- 在接下来的渲染中，如果依赖项没有发生改变，它将返回上次缓存的值；否则将再次调用 `calculateValue`，并返回最新结果



#### 案例

```jsx
function foo(num){
  console.log(`计算${num}的平方`);

  return num * num
}

const ActivePage = memo(() => {

  const [ count, setCount ] = useState(0)

  return (
    <div>
      { count }

      <button onClick={() => { setCount(count+1) }}>+1</button>

      <div>{ foo(50) }</div>
    </div>
    
  )
})
```



上述案例中，在每一次我们点击+1的时候，都会重新计算num的平方和，但是其实我们的50是一直没有发生变化的，从性能优化的角度来说，不应该重新计算，那么如何优化呢，就会用到useMemo

```jsx
function foo(num){
  console.log(`计算${num}的平方`);

  return num * num
}

const ActivePage = memo(() => {

  const [ count, setCount ] = useState(0)

  let result = useMemo(()=>{
    return foo(50)
  }, [])

  return (
    <div>
      { count }

      <button onClick={() => { setCount(count+1) }}>+1</button>

      <div>{ result }</div>
    </div>
    
  )
})
```

useMemo也是需要传递依赖的



#### 总结

- `usebackCall(fn, deps)`类似于 `useMemo(() => fn, deps)`
- 对子组件传递相同内容的**对象**时，使用useMemo进行性能的优化





### useRef

#### 概念

- useRef返回一个ref对象，返回的ref对象再组件的整个生命周期保持不变。
- 最常用的ref是两种用法:
  - 用法一：引入DOM(或者组件，但是需要是class组件)元素
  - 用法二：**保存一个数据，这个对象在整个生命周期中可以保存不变**`titleRef.current`



#### 使用

```jsx
//获取Dom

const App = memo(()=>{
    const titleRef = useRef()
    console.log(titleRef)
    
    return (
        <div>
            <h1 ref={titleRef}>hello</h1>
        </div>
    )
})
```



#### 获取自定义组件的ref

如果你尝试像这样传递 `ref` 到你自己的组件：

```
const inputRef = useRef(null);

return <MyInput ref={inputRef} />;
```

你可能会在控制台中得到这样的错误：`Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?`

默认情况下，你自己的组件不会暴露它们内部 DOM 节点的 ref。

为了解决这个问题，首先，找到你想获得 ref 的组件：

```
export default function MyInput({ value, onChange }) {
  return (
    <input value={value} onChange={onChange} />
  );
}
```

然后像这样将其包装在 [`forwardRef`](https://react.docschina.org/reference/react/forwardRef) 里：

```
import { forwardRef } from 'react';

const MyInput = forwardRef(({ value, onChange }, ref) => {
  return (
  	<input value={value} onChange={onChange} ref={ref} />
  );
});

export default MyInput;
```

最后，父级组件就可以得到它的 ref。

但是对于一些自己定义的方法，我们需要暴露其句柄

```js
// 使用forwardRef包裹的子组件
const ChildComponent = forwardRef<ChildMethods, ChildProps>((props, ref) => {
  const childMethod = () => {
    // 子组件的方法逻辑
    console.log('Child method called');
  };

  // 将子组件的方法传递给父组件
  useImperativeHandle(ref, () => ({
    childMethod,
  }));

  return (
    <div>
      {/* 子组件的内容 */}
    </div>
  );
});
```

阅读 [访问另一个组件的 DOM 节点](https://react.docschina.org/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes) 了解更多信息。



#### ref 和 state 的不同之处

:::info 补充：ref 和 state 的不同之处

也许你觉得 ref 似乎没有 state 那样“严格” —— 例如，你可以改变它们而非总是必须使用 state 设置函数。但在大多数情况下，我们建议你使用 state。ref 是一个“应急方案”，你并不会经常用到它。 以下是 state 和 ref 的对比：

|                           ref                           |                            state                             |
| :-----------------------------------------------------: | :----------------------------------------------------------: |
|  `useRef(initialValue)`返回 `{ current: initialValue}`  | `useState(initialValue)` 返回 state 变量的当前值和一个 state 设置函数 ( `[value, setValue]`) |
|                 更改时不会触发重新渲染                  |                     更改时触发重新渲染。                     |
| 可变 —— 你可以在渲染过程之外修改和更新 `current` 的值。 | “不可变” —— 你必须使用 state 设置函数来修改 state 变量，从而排队重新渲染。 |
|      你不应在渲染期间读取（或写入） `current` 值。      | 你可以随时读取 state。但是，每次渲染都有自己不变的 state [快照](https://react.docschina.org/learn/state-as-a-snapshot)。 |

:::



:::info 补充：useRef 内部是如何运行的？

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

:::



#### 何时使用 ref 

通常，当你的组件需要“跳出” React 并与外部 API 通信时，你会用到 ref —— 通常是不会影响组件外观的浏览器 API。以下是这些罕见情况中的几个：

- 存储timeout ID
- 存储和操作DOM 元素
- 存储不需要被用来计算 JSX 的其他对象。

如果你的组件需要存储一些值，但不影响渲染逻辑，请选择 ref。





### useEffect

#### 概念

- 目前我们已经通过hook在函数式组件中定义state，那么类似于生命周期这些呢?
  - Effect Hook可以让你来完成一些类似于class中生命周期的功能
  - 事实上，类似于网络请求、手动更新DOM、一些事件的监听，都是React更新DOM的一些副作用(Side Effects)
  - 所以对于完成这些功能的Hook被称之为Effect Hook



#### 小案例

现在有一个需求：页面的 `title` 总是显示counter的数字，分别使用class组件和Hook实现

**class组件**

```jsx
import React, { PureComponent } from 'react'

export class Home extends PureComponent {
  constructor(){
    super()
    this.state = {
      count:100
    }
  }

  componentDidMount(){
    document.title = this.state.count
  }

  componentDidUpdate(){
    document.title = this.state.count
  }

  changeCount(num,isAdd){
    if(isAdd){
      this.setState({
        count:this.state.count + num
      })
    }else{
      this.setState({
        count:this.state.count - num
      })
    }
  }


  render() {
    const {count} = this.state

    return (
      <div>
        <h1>当前count:{count}</h1>
        <button onClick={()=>{this.changeCount(1,true)}}>+1</button>
        <button onClick={()=>{this.changeCount(1,false)}}>-1</button>
      </div>
    )
  }
}

export default Home
```



**Hook**

```jsx
import React, { memo, useState, useEffect } from 'react'

const Fun = memo(() => {
  const [ count, setCount ] = useState(100)

  //等到我们这个组件渲染完成之后，自动回调这个函数
  useEffect(()=>{
    //这里可以做一些：网络请求、DOM操作（修改标题）、事件监听
    document.title = count
  })

  return (
    <div>
      <h1>当前count:{count}</h1>
      <button onClick={()=>setCount(count+1)}>+1</button>
      <button onClick={()=>setCount(count-1)}>-1</button>
    </div>
  )
})

export default Fun
```



#### useEffect解析

- 通过useEffect的Hook，可以告诉React需要在渲染后执行某些操作
- useEffect要求我们传入一个回调函数，在React执行完更新DOM操作之后，就会回调这个函数
- 默认情况下，无论是第一次渲染之后，还是每次更新之后，都会执行这个回调函数



#### 需要清除Effect

- **在class组件的编写过程中，某些副作用的代码，我们需要在componentWillUnmount中进行清除**：

  - 比如我们之前的事件总线或Redux中手动调用subscribe
  - 都需要在componentWillUnmount有对应的取消订阅
  - Effect Hook通过什么方式来模拟componentWillUnmount呢？【useEffect有一个返回值】

- ```jsx
  //等到我们这个组件渲染完成之后，自动回调这个函数
  useEffect(()=>{
      //这里可以做一些：网络请求、DOM操作（修改标题）、事件监听
      document.title = count
      console.log("开始监听");
      // 返回值：回调函数 => 组件被重新渲染回卸载的时候执行（重新渲染时，先执行 取消监听 ，在执行 开始监听）
      return ()=>{
          console.log("取消监听");
      }
  })
  ```

  

#### useEffect性能优化

- 默认情况下，useEffect的回调函数会在每次渲染时都重新执行，但是这会导致两个问题
  - 某些代码我们只是希望执行一次即可，类似于componentDidMount和componentWillUnmount中完成的事情;(比如网络请求、订阅和取消订阅);
  - 另外，多次执行也会导致一定的性能问题
- 我们如何决定useEffect在什么时候应该执行和什么时候不应该执行呢?
  - useEffect实际上有两个参数：`useEffect(函数,[])`
    - 参数一：执行的回调函数
    - 参数二：该useEffect在哪些state发生变化时，才重新执行(受哪个state的影响)
  - 当我们想仅在组件第一次渲染的时候执行，在之后更新组件的时候不执行，我们就放一个空数组就行，表示不受任何state的影响（`useEffect(()=>{},[])`）
  - 当然同样的，如果我们加了空数组，useEffect的返回值也只在组件卸载的时候才执行
  - 不写第二个参数的意思就是第一次执行和每一次更新都会执行



#### 补充

```
setKeepMsgCon((prevKeepMsgCon) => [...prevKeepMsgCon, msg]);
```

这行代码中使用了函数形式的 `setKeepMsgCon`，它接收一个函数作为参数，该函数用于计算新的状态值。**这种方式是为了确保在更新状态时，基于先前的状态进行更新，而不依赖于外部的状态。这样可以避免由于异步操作导致的不一致性或错误。**

解释代码的步骤如下：

1. `(prevKeepMsgCon) => [...]`: 这是一个箭头函数，它接收一个参数 `prevKeepMsgCon`，代表先前的状态值 `keepMsgCon`。箭头函数的返回值是一个新的数组，表示更新后的 `keepMsgCon` 状态。
2. `...prevKeepMsgCon`: 这里使用了展开运算符 `...`，它将先前的状态数组 `prevKeepMsgCon` 展开，将数组中的所有元素作为新数组的一部分。
3. `, msg`: `msg` 是一个新的消息对象，它是要添加到更新后的状态数组中的新元素。

所以，整体来说，`setKeepMsgCon((prevKeepMsgCon) => [...prevKeepMsgCon, msg])` 的作用是将先前的状态数组 `keepMsgCon` 复制到一个新的数组中，并在新数组的末尾添加 `msg` 这个新的消息对象，然后用这个新的数组来更新 `keepMsgCon` 状态。这样就保证了状态的更新是基于先前的状态值，并且在异步操作中也能正确地更新状态，避免了由于异步操作导致的状态错误。





### useLayoutEffect

#### 概念

useLayoutEffect看起来和useEffect非常的相似，事实上他们也只有一点区别而已：

- **useEffect会在渲染的内容更新到DOM上后执行，不会阻塞DOM的更新**
- **useLayoutEffect会在渲染的内容更新到DOM上之前执行，会阻塞DOM的更新**



`useLayoutEffect` 是 [`useEffect`](https://react.docschina.org/reference/react/useEffect) 的一个版本，在浏览器重新绘制屏幕之前触发

`useLayoutEffect(setup, dependencies?)`



#### 使用

```jsx
// 调用 useLayoutEffect 在浏览器重新绘制屏幕之前进行布局测量：

import { useState, useRef, useLayoutEffect } from 'react';

function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
}, []);
// ...
```





### useId

#### 概念

`useId` 是一个 React Hook，可以生成传递给无障碍属性的唯一 ID。

`const id = useId()`

**参数** 

`useId` 不带任何参数。

**返回值** 

`useId` 返回一个唯一的字符串 ID，与此特定组件中的 `useId` 调用相关联。

**注意事项** 

- `useId` 是一个 Hook，因此你只能 **在组件的顶层** 或自己的 Hook 中调用它。你不能在内部循环或条件判断中调用它。如果需要，可以提取一个新组件并将 state 移到该组件中。
- `useId` **不应该被用来生成列表中的 key**，key 应该由你的数据生成



#### 使用

在 React 中直接编写 ID 并不是一个好的习惯。一个组件可能会在页面上渲染多次，但是 ID 必须是唯一的！不要使用自己编写的 ID，而是使用 `useId` 生成唯一的 ID。

```jsx
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        密码:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        密码应该包含至少 18 个字符
      </p>
    </>
  );
}
```

现在，即使 `PasswordField` 多次出现在屏幕上，生成的 ID 并不会冲突。

```jsx
export default function App() {
  return (
    <>
      <h2>输入密码</h2>
      <PasswordField />
      <h2>验证密码</h2>
      <PasswordField />
    </>
  );
}
```



::: info 思考：为什么 useId 比递增计数器更好？

你可能想知道为什么使用 `useId` 比增加全局变量（如 `nextId++`）更好。

`useId` 的主要好处是 React 确保它能够与服务端渲染一起工作。 在服务器渲染期间，你的组件生成输出 HTML。随后，在客户端，hydration会将你的事件处理程序附加到生成的 HTML 上。由于 hydration，客户端必须匹配服务器输出的 HTML。

使用递增计数器非常难以保证这一点，因为客户端组件被 hydrate 处理后的顺序可能与服务器 HTML 发出的顺序不匹配。通过调用 `useId`，你可以确保 hydration 正常工作，并且服务器和客户端之间的输出将匹配。

在 React 内部，调用组件的“父路径”生成 `useId`。这就是为什么如果客户端和服务器的树相同，不管渲染顺序如何，“父路径”始终都匹配。

:::



#### 为多个相关元素生成 ID

```jsx
// 如果你需要为多个相关元素生成 ID，可以调用 useId 来为它们生成共同的前缀，可以使你避免为每个需要唯一 ID 的元素调用 useId：
import { useId } from 'react';

export default function Form() {
  const id = useId();
  return (
    <form>
      <label htmlFor={id + '-firstName'}>名字：</label>
      <input id={id + '-firstName'} type="text" />
      <hr />
      <label htmlFor={id + '-lastName'}>姓氏：</label>
      <input id={id + '-lastName'} type="text" />
    </form>
  );
}
```



#### 为所有生成的 ID 指定共享前

如果你在单个页面上渲染多个独立的 React 应用程序，请在 `createRoot` 或`hydrateRoot`调用中将 `identifierPrefix` 作为选项传递。这确保了由两个不同应用程序生成的 ID 永远不会冲突，因为使用 `useId` 生成的每个 ID 都将以你指定的不同前缀开头。

```jsx
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root1 = createRoot(document.getElementById('root1'), {
  identifierPrefix: 'my-first-app-'
});
root1.render(<App />);

const root2 = createRoot(document.getElementById('root2'), {
  identifierPrefix: 'my-second-app-'
});
root2.render(<App />);
```





### useImperativeHandle

`useImperativeHandle` 是 React 中的一个 Hook，它能让你自定义由 [ref](https://react.docschina.org/learn/manipulating-the-dom-with-refs) 暴露出来的句柄。

`useImperativeHandle(ref, createHandle, dependencies?)`

**参数**

- `ref`：该 `ref` 是你从`forwardRef` 渲染函数中获得的第二个参数。
- `createHandle`：该函数无需参数，它返回你想要暴露的 ref 的句柄。该句柄可以包含任何类型。通常，你会返回一个包含你想暴露的方法的对象。
- **可选的** `dependencies`：函数 `createHandle` 代码中所用到的所有反应式的值的列表。反应式的值包含 props、状态和其他所有直接在你组件体内声明的变量和函数。该列表的长度必须是一个常数项，并且必须按照 `[dep1, dep2, dep3]` 的形式罗列各依赖项。React 会使用`Object.is`来比较每一个依赖项与其对应的之前值。如果一次重新渲染导致某些依赖项发生了改变，或你没有提供这个参数列表，你的函数 `createHandle` 将会被重新执行，而新生成的句柄则会被分配给 ref。

**返回值**

`useImperativeHandle` 返回 `undefined`。



#### 向父组件暴露一个自定义的 ref 句柄

默认情况下，组件不会将它们的 DOM 节点暴露给父组件。举例来说，如果你想要 `MyInput` 的父组件能访问到 `<input>` DOM 节点，你必须选择使用 `forwardRef`

```
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  return <input {...props} ref={ref} />;
});
```

在上方的代码中，[`MyInput` 的 ref 会接收到 `` DOM 节点](https://react.docschina.org/reference/react/forwardRef#exposing-a-dom-node-to-the-parent-component)。然而，你可以选择暴露一个自定义的值。为了修改被暴露的句柄，在你的顶层组件调用 `useImperativeHandle`：

```
import { forwardRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  useImperativeHandle(ref, () => {
    return {
      // ... 你的方法 ...
    };
  }, []);

  return <input {...props} />;
});
```

注意在上述代码中，该 `ref` 已不再被转发到 `<input>` 中。

举例来说，假设你不想暴露出整个 `<input>` DOM 节点，但你想要它其中两个方法：`focus` 和 `scrollIntoView`。为此，用单独额外的 ref 来指向真实的浏览器 DOM。然后使用 `useImperativeHandle` 来暴露一个句柄，它只返回你想要父组件去调用的方法：

```
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});
```

现在，如果你的父组件获得了 `MyInput` 的 ref，就能通过该 ref 来调用 `focus` 和 `scrollIntoView` 方法。然而，它的访问是受限的，无法读取或调用下方 `<input>` DOM 节点的其他所有属性和方法。

```jsx
// app.js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // 下方代码不起作用，因为 DOM 节点并未被暴露出来：
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput placeholder="Enter your name" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```jsx
// MyInpu.js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});

export default MyInput;
```



#### 暴露你自己的命令式方法 

你通过命令式句柄暴露出来的方法不一定需要完全匹配 DOM 节点的方法。





### useDeferredValue

[useDeferredValue – React 中文文档 (docschina.org)](https://react.docschina.org/reference/react/useDeferredValue)

#### 概念

**`在react18中新增`**

`useDeferredValue` 是一个 React Hook，可以让你延迟更新 UI 的某些部分。

`const deferredValue = useDeferredValue(value)`

在组件的顶层调用 `useDeferredValue` 来获取该值的延迟版本。

```jsx
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```



**参数**

- `value`：你想延迟的值，可以是任何类型。

**返回值**

在组件的初始渲染期间，返回的延迟值将与你提供的值相同。但是在组件更新时，React 将会先尝试使用旧值进行重新渲染（因此它将返回旧值），然后再在后台使用新值进行另一个重新渲染（这时它将返回更新后的值）。

**注意事项**

- 你应该向 `useDeferredValue` 传递原始值（如字符串和数字）或在渲染之外创建的对象。如果你在渲染期间创建了一个新对象，并立即将其传递给 `useDeferredValue`，那么每次渲染时这个对象都会不同，这将导致后台不必要的重新渲染。
- 当 `useDeferredValue` 接收到与之前不同的值（使用`Object.is`进行比较）时，除了当前渲染（此时它仍然使用旧值），它还会安排一个后台重新渲染。这个后台重新渲染是可以被中断的，如果 `value` 有新的更新，React 会从头开始重新启动后台渲染。举个例子，如果用户在输入框中的输入速度比接收延迟值的图表重新渲染的速度快，那么图表只会在用户停止输入后重新渲染。
- `useDeferredValue` 与`<Suspense>`集成。如果由于新值引起的后台更新导致 UI 暂停，用户将不会看到 fallback 效果。他们将看到旧的延迟值，直到数据加载完成。
- `useDeferredValue` 本身并不能阻止额外的网络请求。
- `useDeferredValue` 本身不会引起任何固定的延迟。一旦 React 完成原始的重新渲染，它会立即开始使用新的延迟值处理后台重新渲染。由事件（例如输入）引起的任何更新都会中断后台重新渲染，并被优先处理。
- 由 `useDeferredValue` 引起的后台重新渲染在提交到屏幕之前不会触发 Effect。如果后台重新渲染被暂停，Effect 将在数据加载后和 UI 更新后运行。





#### 在新内容加载期间显示旧内容

**让我们通过一个例子来看看什么时候该使用它**

这个例子中，在获取搜索结果时，`SearchResults` 组件会suspend。尝试输入 `"a"`，**等待结果出现后，将其编辑为 `"ab"`。此时 `"a"` 的结果会被加载中的 fallback 替代。**

```jsx
import { Suspense, useState } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={query} />
      </Suspense>
    </>
  );
}

```

一个常见的备选 UI 模式是 **延迟** 更新结果列表，并继续显示之前的结果，直到新的结果准备好。调用 `useDeferredValue` 并将延迟版本的查询参数向下传递：

`query` 会立即更新，所以输入框将显示新值。然而，`deferredQuery` 在数据加载完成前会保留以前的值，因此 `SearchResults` 将暂时显示旧的结果。

在下面的示例中，输入 `"a"`，等待结果加载完成，然后将输入框编辑为 `"ab"`。注意，现在你看到的不是 suspense fallback，而是旧的结果列表，直到新的结果加载完成：

```jsx
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}

```



在上面的示例中，当最新的查询结果仍在加载时，没有任何提示。如果新的结果需要一段时间才能加载完成，这可能会让用户感到困惑。为了更明显地告知用户结果列表与最新查询不匹配，你可以在显示旧的查询结果时添加一个视觉提示：

```jsx
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1,
}}>
  <SearchResults query={deferredQuery} />
</div>
```

有了上面这段代码，当你开始输入时，旧的结果列表会略微变暗，直到新的结果列表加载完毕。你也可以添加 CSS 过渡来延迟变暗的过程，让用户感受到一种渐进式的过渡，就像下面的例子一样：

```jsx
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <div style={{
          opacity: isStale ? 0.5 : 1,
          transition: isStale ? 'opacity 0.2s 0.2s linear' : 'opacity 0s 0s linear'
        }}>
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}
```



#### 延迟渲染 UI 的某些部分 

你还可以将 `useDeferredValue` 作为性能优化的手段。当你的 UI 某个部分重新渲染很慢、没有简单的优化方法，同时你又希望避免它阻塞其他 UI 的渲染时，使用 `useDeferredValue` 很有帮助。

想象一下，你有一个文本框和一个组件（例如图表或长列表），在每次按键时都会重新渲染：

```
function App() {
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={text} />
    </>
  );
}
```

首先，我们可以优化 `SlowList`，使其在 props 不变的情况下跳过重新渲染。只需将其用 `memo` 包裹 即可：

```
const SlowList = memo(function SlowList({ text }) {
  // ...
});
```

然而，这仅在 `SlowList` 的 props 与上一次的渲染时相同才有用。你现在遇到的问题是，当这些 props **不同** 时，并且实际上需要展示不同的视觉输出时，页面会变得很慢。

具体而言，主要的性能问题在于，每次你输入内容时，`SlowList` 都会接收新的 props，并重新渲染整个树结构，这会让输入感觉很卡顿。使用 `useDeferredValue` 能够优先更新输入框（必须快速更新），而不是更新结果列表（可以更新慢一些），从而缓解这个问题：

```
function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

这并没有让 `SlowList` 的重新渲染变快。然而，它告诉 React 可以将列表的重新渲染优先级降低，这样就不会阻塞按键输入。列表的更新会“滞后”于输入，然后“追赶”上来。与之前一样，React 会尽快更新列表，但不会阻塞用户输入。



::: note 注意

这个优化需要将 `SlowList` 包裹在 [`memo`](https://react.docschina.org/reference/react/memo) 中。这是因为每当 `text` 改变时，React 需要能够快速重新渲染父组件。在重新渲染期间，`deferredText` 仍然保持着之前的值，因此 `SlowList` 可以跳过重新渲染（它的 props 没有改变）。如果没有 [`memo`](https://react.docschina.org/reference/react/memo)，`SlowList` 仍会重新渲染，这将使优化失去意义。

::: 



#### 思考

::: success 思考：延迟一个值与防抖和节流之间有什么不同？

在上述的情景中，你可能会使用这两种常见的优化技术：

- **防抖** 是指在用户停止输入一段时间（例如一秒钟）之后再更新列表。
- **节流** 是指每隔一段时间（例如最多每秒一次）更新列表。

虽然这些技术在某些情况下是有用的，但 `useDeferredValue` 更适合优化渲染，因为它与 React 自身深度集成，并且能够适应用户的设备。

与防抖或节流不同，`useDeferredValue` 不需要选择任何固定延迟时间。如果用户的设备很快（比如性能强劲的笔记本电脑），延迟的重渲染几乎会立即发生并且不会被察觉。如果用户的设备较慢，那么列表会相应地“滞后”于输入，滞后的程度与设备的速度有关。

此外，与防抖或节流不同，`useDeferredValue` 执行的延迟重新渲染默认是可中断的。这意味着，如果 React 正在重新渲染一个大型列表，但用户进行了另一次键盘输入，React 会放弃该重新渲染，先处理键盘输入，然后再次开始在后台渲染。相比之下，防抖和节流仍会产生不顺畅的体验，因为它们是阻*的：它们仅仅是将渲染阻塞键盘输入的时刻推迟了。

如果你要优化的工作不是在渲染期间发生的，那么防抖和节流仍然非常有用。例如，它们可以让你减少网络请求的次数。你也可以同时使用这些技术。

:::





### useSyncExternalStore

[useSyncExternalStore – React 中文文档 (docschina.org)](https://react.docschina.org/reference/react/useSyncExternalStore)

#### 概念

**`在react18中新增`**

`useSyncExternalStore` 是一个让你订阅外部 store 的 React Hook。

`const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)`

它返回 store 中数据的快照。你需要传两个函数作为参数：

1. `subscribe` 函数应当订阅该 store 并返回一个取消订阅的函数。
2. `getSnapshot` 函数应当从该 store 读取数据的快照。



**参数**

- `subscribe`：一个函数，接收一个单独的 `callback` 参数并把它订阅到 store 上。当 store 发生改变，它应当调用被提供的 `callback`。这会导致组件重新渲染。`subscribe` 函数会返回清除订阅的函数。
- `getSnapshot`：一个函数，返回组件需要的 store 中的数据快照。在 store 不变的情况下，重复调用 `getSnapshot` 必须返回同一个值。如果 store 改变，并且返回值也不同了（用`Object.is`比较），React 就会重新渲染组件。
- **可选** `getServerSnapshot`：一个函数，返回 store 中数据的初始快照。它只会在服务端渲染时，以及在客户端进行服务端渲染内容的 hydration 时被用到。快照在服务端与客户端之间必须相同，它通常是从服务端序列化并传到客户端的。如果你忽略此参数，在服务端渲染这个组件会抛出一个错误。

**返回值**

- 该 store 的当前快照，可以在你的渲染逻辑中使用



#### 订阅外部的store

#### 订阅浏览器API

#### 把逻辑抽取到自定义 Hook



### useTransition

#### 概念

`useTransition` 是一个帮助你在不阻塞 UI 的情况下更新状态的 React Hook。

```
const [isPending, startTransition] = useTransition()
```

**参数**

`useTransition` 不需要任何参数。

**返回值** 

`useTransition` 返回一个由两个元素组成的数组：

1. `isPending`，告诉你是否存在待处理的 transition。
2. `startTransition` 函数，你可以使用此方法将状态更新标记为 transition。



#### `startTransition` 函数 

`useTransition` 返回的 `startTransition` 函数允许你将状态更新标记为 transition。

```
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }

  // ……
}
```

**参数** 

- 作用域（scope）：一个通过调用一个或多个`set` 函数更新状态的函数。React 会立即不带参数地调用此函数，并将在 `scope` 调用期间将所有同步安排的状态更新标记为 transition。它们将是非阻塞的，并且不会显示不想要的加载指示器

**返回值**

`startTransition` 不返回任何值

**注意**

- `useTransition` 是一个 Hook，因此只能在组件或自定义 Hook 内部调用。如果需要在其他地方启动 transition（例如从数据库），请调用独立的`startTransition`函数
- 只有在可以访问该状态的 `set` 函数时，才能将其对应的状态更新包装为 transition。如果你想启用 transition 以响应某个 prop 或自定义 Hook 值，请尝试使用`useDeferredValue`
- 传递给 `startTransition` 的函数必须是同步的。React 会立即执行此函数，并将在其执行期间发生的所有状态更新标记为 transition。如果在其执行期间，尝试稍后执行状态更新（例如在一个定时器中执行状态更新），这些状态更新不会被标记为 transition。
- 标记为 transition 的状态更新将被其他状态更新打断。例如在 transition 中更新图表组件，并在图表组件仍在重新渲染时继续在输入框中输入，React 将首先处理输入框的更新，之后再重新启动对图表组件的渲染工作。
- transition 更新不能用于控制文本输入。
- 目前，React 会批处理多个同时进行的 transition。这是一个限制，可能会在未来版本中删除。



#### 将状态更新标记为非阻塞的 transition

[使用 useTransition 与常规状态更新的区别](https://react.docschina.org/reference/react/useTransition#examples)







### useDebugValue

`useDebugValue` 是一个 React Hook，可以让你在 [React 开发工具](https://react.docschina.org/learn/react-developer-tools) 中为自定义 Hook 添加标签。





### useInsertionEffect

`useInsertionEffect` 是为 CSS-in-JS 库的作者特意打造的。除非你正在使用 CSS-in-JS 库并且需要注入样式，否则你应该使用`useEffect`或者 `useLayoutEffect`。

`useInsertionEffect` 可以在布局副作用触发之前将元素插入到 DOM 中。



### use

`use` Hook 仅在 canary 与 experimental 渠道中可用。参阅 [React 发布渠道](https://react.docschina.org/community/versioning-policy#all-release-channels) 以了解更多信息。

`use` 是一个 React Hook，它可以让你读取类似于Promise或context的资源的值。





## 路由 Hooks

### useNavigate

`useNavigate` 钩子返回一个函数，让您可以以编程方式导航，例如：

```jsx
import { useNavigate } from "react-router-dom";

function useLogoutTimer() {
  const navigate = useNavigate();

  const click = () =>{
      navigate('/home')
  }
}
```

`navigate` 函数有两个签名：

- 要么传递一个 `To` 值（与 `<Link to>` 相同的类型），带有可选的第二个 `{ replace, state }` 参数（可以用state携带一些参数）
- 传递您想要在历史堆栈中前进的增量。例如， `navigate(-1)` 等同于点击后退按钮。



```jsx
// useNavigate传递参数的三种方式，也对于三种hoos获取参数

/* 第一种：params传递参数， 此方式传递参数：需要注意的是在路由中需要配置占位符 */
navigate('/login/17');

/* 第二种：search传递参数 */
navigate('/login?name=xiaoming&age=10')

/* 第三种：state属性携带参数 */
navigate('/login',{state: '我从登陆页面过来了！！！'})
```





### useParams

params传递参数的获取，需要在路由中配置占位符

`<Route path"/login/:id" element={}></Route>`

```jsx
/* 第一种params方法传递参数：用useParams来获取 */
  const getParams = useParams();
console.log(getParams, 'getParamsis')
```



### useSearchParams

```jsx
 /* 第二种search方法传递参数：用useSearchParams来获取*/
 const [getSearchArr] = useSearchParams();
 console.log(getSearchArr,getSearchArr.getAll('name'))//['xiaoming']
 console.log(getSearchArr,getSearchArr.getAll('age'))//['10']
```



### useLocation

```jsx
/* 第三种state属性携带参数：用useLocation来获取 */
  const currentLocation = useLocation();

/* 
  第三种：state属性传递参数
  {
    hash: ""
    key: "jtlqbuv6"
    pathname: "/login"
    search: ""
    state: "我从登陆页面过来了！！！"
  } 
*/
console.log(currentLocation);
```





## redux hooks

### useSelector

使用一个 selector 函数从 Redux store state 中提取数据

一般配合`shallowEqual`进行比较跟新

```jsx
import { shallowEqual, useSelector } from 'react-redux'

//从store中获取数据
  const {
    goodPriceInfo,
    highScoreInfo,
  } = useSelector((state) =>({
    goodPriceInfo: state.home.goodPriceInfo,
    highScoreInfo: state.home.highScoreInfo,
  }), shallowEqual)
```



### useDispatch

这个 hook 返回一个对 Redux store 中的 `dispatch` 函数的引用。你可以按需使用它来 dispatch action

```jsx
import { useDispatch } from 'react-redux'
import { fetchHomeDataAction } from '@/store/modules/home'

//派发异步事件：发起网络请求 或者什么点击事件什么的
const dispatch = useDispatch()
useEffect(()=>{
	dispatch(fetchHomeDataAction())
},[dispatch])
```





### useStore

`const store = useStore()`

这个 hook 返回一个 Redux store 引用，该 store 与传递给 `<Provider>` 组件的 store 相同。

不应该频繁使用这个 hook。宁愿将 `useSelector()` 作为主要选择。然而，对于少量需要访问 store 的场景而言，例如替换 reducer，这个 hook 很有用。

```jsx
import React from 'react'
import { useStore } from 'react-redux'

export const CounterComponent = ({ value }) => {
  const store = useStore()

  // 仅仅是示例！不要在实际的应用中这么做。
  // 当 store state 变更时，组件不会自动更新
  return <div>{store.getState()}</div>
}
```

























