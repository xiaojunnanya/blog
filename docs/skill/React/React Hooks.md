---
id: reacthooks
slug: /reacthooks
title: React Hooks
date: 2023-07-17
authors: 鲸落
tags: [React]
keywords: [React]
---

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

|      hooks名      |                 作用                  |           说明            |
| :---------------: | :-----------------------------------: | :-----------------------: |
|    `useParams`    |             返回当前参数              |     根据路径读取参数      |
|   `useNavigate`   |             返回当前路由              | 代替原有V5中的 useHistory |
|    `useOutlet`    |       返回根据路由生成的element       |                           |
|   `useLocation`   |        返回当前的location 对象        |                           |
|    `useRoutes`    | 同Routers组件一样，只不过是在js中使用 |                           |
| `useSearchParams` |     用来匹配URL中?后面的搜索参数      |                           |



### redux hooks

- useSelector
- useDispatch





## React hooks

### useState解析

- useState来自react，需要从react中导入，它是一个hook

- 接受唯一参数，**在第一次组件被调用的时候用来做初始化值**，如果不设置为undefined

- **useState设置的初始值，只有在组建第一次被调用的时候有效，第二次调用无法修改初始值**

- 返回值：数组，包含两个元素【一般用数组解构来完成赋值】

  - 元素一：当前状态的值(第一调用为初始化值)
  - 元素二：设置状态值的函数

- ```jsx
  //使用详见上述计算器案例
  ```



### useEffect

#### Effect Hook

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
  - useEffect实际上有两个参数： `useEffect(函数,[])`
    - 参数一：执行的回调函数
    - 参数二：该useEffect在哪些state发生变化时，才重新执行(受哪个state的影响)
  - 当我们想仅在组件第一次渲染的时候执行，在之后更新组件的时候不执行，我们就放一个空数组就行，表示不受任何state的影响（`useEffect(()=>{},[])`）
  - 当然同样的，如果我们加了空数组，useEffect的返回值也只在组件卸载的时候才执行
  - 不写第二个参数的意思就是第一次执行和每一次更新都会执行



#### 补充

`setKeepMsgCon((prevKeepMsgCon) => [...prevKeepMsgCon, msg]);`

这行代码中使用了函数形式的 `setKeepMsgCon`，它接收一个函数作为参数，该函数用于计算新的状态值。**这种方式是为了确保在更新状态时，基于先前的状态进行更新，而不依赖于外部的状态。这样可以避免由于异步操作导致的不一致性或错误。**

解释代码的步骤如下：

1. `(prevKeepMsgCon) => [...]`: 这是一个箭头函数，它接收一个参数 `prevKeepMsgCon`，代表先前的状态值 `keepMsgCon`。箭头函数的返回值是一个新的数组，表示更新后的 `keepMsgCon` 状态。
2. `...prevKeepMsgCon`: 这里使用了展开运算符 `...`，它将先前的状态数组 `prevKeepMsgCon` 展开，将数组中的所有元素作为新数组的一部分。
3. `, msg`: `msg` 是一个新的消息对象，它是要添加到更新后的状态数组中的新元素。

所以，整体来说，`setKeepMsgCon((prevKeepMsgCon) => [...prevKeepMsgCon, msg])` 的作用是将先前的状态数组 `keepMsgCon` 复制到一个新的数组中，并在新数组的末尾添加 `msg` 这个新的消息对象，然后用这个新的数组来更新 `keepMsgCon` 状态。这样就保证了状态的更新是基于先前的状态值，并且在异步操作中也能正确地更新状态，避免了由于异步操作导致的状态错误。



### useLayoutEffect

useLayoutEffect看起来和useEffect非常的相似，事实上他们也只有一点区别而已：

- **useEffect会在渲染的内容更新到DOM上后执行，不会阻塞DOM的更新**
- **useLayoutEffect会在渲染的内容更新到DOM上之前执行，会阻塞DOM的更新**



### useCallback

#### 概念

[React - 鲸落 (xiaojunnan.cn)](http://www.xiaojunnan.cn/docs/react#usecallback)

- useCallback实际的目的是为了进行性能的优化。
- 如何进行性能的优化呢?
  - useCallback会返回一个函数的memoized (记忆的)值
  - 在依赖不变的情况下，多次定义的时候，返回的值是相同的
- **使用useCallback和不使用useCallback定义一个函数并不会会带来性能的优化，使用useCallback和不使用useCallback定义一个函数传递给子组件才会带来性能的优化**
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

-  useCalLback性能优化的点：**当需要将一个函数传递给升组件时，最好使用useCallback进行优化，将优化之后的函数，传递给子组件**

-  **使用useCallback和不使用useCallback定义一个函数并不会会带来性能的优化，使用useCallback和不使用useCallback定义一个函数传递给子组件才会带来性能的优化**





### useMemo

#### 概念

类似于useCallback，但是他优化的的不是一个函数本身，而是**函数的返回值**



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

- useRef返回一个ref对象，返回的ref对象再组件的整个生命周期保持不变。
- 最常用的ref是两种用法:
  - 用法一：引入DOM(或者组件，但是需要是class组件)元素
  - 用法二：**保存一个数据，这个对象在整个生命周期中可以保存不变**`titleRef.current`

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



### useContext

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



### useReducer

- 很多人看到useReducer的第一反应应该是redux的某个替代品,其实并不是。
- useReducer仅仅是useState的一种替代方案:
  - 在某些场景下，如果state的处理逻辑比较复杂，我们可以通过useReducer来对其进行拆分
  - 或者这次修改的state需要依赖之前的state时，也可以使用



### useTransition

- 官方解释:返回一个状态值表示过渡任务的等待状态，以及一个启动该过渡任务的函数。
- useTransition到底是干嘛的呢?它其实在告诉react对于某部分任务的更新优先级较低，可以稍后进行更新。



## 路由hooks

### useNavigate

路由跳转

```jsx
import { useNavigate } from 'react-router-dom'
const navigate = useNavigate()
function clickHome(){
    navigate("/home")
}
```



### useParams

params参数



### useLocation

拿到动态路由

```jsx
const loaction = useLocation()
console.log(loaction)
```







## redux hooks

**useSelector和useDispatch**

- 在之前的redux开发中，为了让组件和redux结合起来，我们使用了react-redux中的connect
  - 但是这种方式必须使用高阶函数结合返回的高阶组件;
  - 并且必须编写: mapStateToProps和mapDispatchToProps映射的函数
- 在redux7.1之后，提供了hook方法，不需要在编写connect以及对应的映射函数了【当然之后函数式组件中才可以使用】

不需要像之前一样

```jsx
// 导入
import { useSelector, useDispatch } from "react-redux"
import { addNumberAction } from './store/modules/count'

//使用 diapatch直接派发action
const App = memo(()=>{
    // 使用useSelector将redux中的store数据映射到组件中
    // 箭头函数可以简写+解构，在下面
    const count = useSelector((state)=>{
        return state.counter.count
    })
    
    // 派发,让store发请求获取数据
    const dispatch = useDispatch()
    funtion addNum(num){
        dispatch(addNumberAction(num))
    }
})
```



- useSelector的作用是将state映射到组件中：

  - 参数一：将state映射到需要的数据中

  - 参数二：可以进行比较来决定是否组件重新渲染【比如当这个组件使用store，但是他使用的数据并没有修改的时候，不需要重新渲染，使用shallowEqual比较】

  - ```jsx
    // 导入
    import { useSelector, useDispatch, shallowEqual } from "react-redux"
    
    const App = memo(()=>{
        //派发数据
        const dispatch = useDispatch()
        funtion addNum(num){
            dispatch(addNumberAction(num))
        }
        
        //取数据
        // 一般我们在使用到useSelector的时候就会使用shallowEqual，进行一个比较
        // 当我们使用到的cout发生改变的时候，组件才会重新渲染
        const { count, num } = useSelector((state)=>({
            count: state.counter.count,
            num: state.counter.num
        }),shallowEqual)
        
        
    })
    ```





## 自定义hook

### 什么是自定义hook

自定义Hook本质上只是一种函数代码逻辑的抽取，严格意义上来说，它本身并不算React的特性。

**自定义hook必须要用use开头**



### 基本使用

案例：在每一个组件被创建销毁的时候都打印一次：

```jsx
import React, { memo, useEffect } from 'react'

function useLife(cname){
  useEffect(()=>{
    console.log(cname+"组件被创建");
    
    return ()=>{
     console.log("组件被销毁");
    }
  })
}

const Home = memo(()=>{
    //我们可以将公共的部分抽离出来，而不是在每一个组件中都是用一次
  useLife("Home")

  return <h1>Home</h1>
})
const Page = memo(()=>{
  useLife("Page")

  return <h1>Page</h1>
})

const Fun = memo(() => {

  return (
    <div>
      <h1>Fun</h1>
      <Home></Home>
      <Page></Page>
    </div>
  )
})

export default Fun
```

