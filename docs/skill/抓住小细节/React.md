---
id: detailreact
slug: /detailreact
title: React
date: 2002-09-26
authors: 鲸落
tags: [抓住小细节]
keywords: [抓住小细节]
---

## 组件基础

### react事件机制

React基于`浏览器事件机制`实现了一套自己的事件机制，包括：`事件注册`、`事件合成`、`事件冒泡`、`事件触发`等。

React并不是将事件绑定到了真实DOM上，而是在document处监听了所有的事件【17之前是document，17将事件委托给根节点而不是document】，然后由统一的事件监听器去监听事件的触发。这样的方式不仅仅减少了内存的消耗，还能在组件挂载销毁时统一订阅和移除事件。

除此之外，冒泡到document上的事件也不是原生的浏览器事件，而是将事件内容封装交给中间层( SyntheticEvent)。然后使用统一的分发函数 `dispatchEvent` 将封装的事件内容交由真正的处理函数执行。因此如果不想要是事件冒泡的话应该调用event.preventDefault()方法，而不是调用event.stopProppagation()方法。（当然在17之后也可以直接调用stopProppagation）



### react怎么做事件代理？他的原理是什么

在React底层，主要对合成事件做了两件事

- **事件委派**:React会把所有的事件绑定到结构的最外层（17之前是document，17之后是root），使用统一的事件监听器，这个事件监听器上维持了一个映射来保存所有组件内部事件监听和处理函数。
- **自动绑定**:React组件中，每个方法的上下文都会指向该组件的实例，即自动绑定this为当前组件。



### react高阶组件（HOC）、reader props、hooks有什么区别

- 简言之，HOC是一种组件的设计模式，HOC接受一个组件和额外的参数(如果需要)，返回一个新的组件。HOC是纯函数，没有副作用。
- render props是指一种在React组件之间使用一个值为函数的prop 共享代码的简单技术，更具体的说，render prop是一个用于告知组件需要渲染什么内容的函数 prop。
- hook解决了hoc的prop覆盖的问题，同时解决了render props因共享数据而出现嵌套地狱的问题。并且能在return之外使用数据



### react.component和react.purecomponent的区别

- PureComponent表示一个纯组件，可以用来优化React程序，减少render函数执行的次数，从而提高组件的性能。
- 在React中，当prop或者state发生变化时，可以通过在shouldComponentUpdate生命周期函数中执行return false来阻止页面的更新，从而减少不必要的render执行。React.PureComponent会自动执行shouldComponentUpdate。
- 【不过,pureComponent中的shouldComponentUpdate()进行的是浅比较，也就是说如果是引用数据类型的数据，只会比较不是同一个地址，而不会比较这个地址里面的数据是否一致。浅比较会忽略属性和或状态突变情况，其实也就是数据引用指针没有变化，而数据发生改变的时候render是不会执行的。如果需要重新渲染那么就需要重新开辟空间引用数据。PureComponent一般会用在一些纯展示组件上。】
- 使用pureComponent的好处:当组件更新时，如果组件的props或者state都没有改变，render函数就不会触发。省去虚拟DOM的生成和对比过程，达到提升性能的目的。



### react.createClass和extends component的区别

- **语法区别：**createClass方式的方法定义使用逗号，隔开，因为creatClass本质上是一个函数，传递给它的是一个Object。而class的方式定义方法时务必谨记不要使用逗号隔开，这是ES6 class的语法规范。
- React.createClass是通过propTypes对象和getDefaultProps()方法来设置和获取props。React.Component是通过设置两个属性propTypes和defaultProps
- **设置初始值不同**：React.createClass通过getInitialState()方法返回一个包含初始值的对象。React.Component通过constructor设置初始状态
- **this绑定**：React.createClass会正确绑定this。React.Component需要开发者手动绑定



### react高阶组件（HOC）是什么,和普通组件有什么区别

高阶组件(HOC)就是一个函数，且该函数接受一个组件作为参数，并返回一个新的组件，它只是一种设计模式。我们将它们称为纯函数，因为它们可以接受任何动态提供的子组件，但它们不会修改或复制其输入组件中的任何行为。



### 哪些方法会触发react重新渲染，重新渲染render会做些什么

**哪些方法会触发react重新渲染**

- setState被调用【有一点需要注意，setState传入null不会触发render】
- 父组件重新渲染，即使我父组件传入子组件的props值未发生变化，子组件也会重新渲染

**重新渲染render会做些什么**

- 会对新l日VNode进行对比，Diff算法。
- 对新旧两棵树进行一个深度优先遍历，这样每一个节点都会一个标记，在到深度遍历的时候，每遍历到一和个节点，就把该节点和新的节点树进行对比，如果有差异就放到一个对象里面
- 遍历差异对象，根据差异的类型，根据对应对规则更新VNode



### react如何判断什么时候重新渲染组件

组件状态的改变可以因为props 的改变，或者直接通过setstate方法改变。组件获得新的状态，然后React决定是否应该重新渲染组件。只要组件的state发生变化，React就会对组件进行重新渲染。这是因为React中的shouldComponentupdate方法默认返回true，这就是导致每次更新都重新渲染的原因。



### react组件声明的方式有哪几种？区别

React声明组件的三种方式

- 函数式定义的无状态组件
- ES5原生方式React.createclass定义的组件
- ES6形式的extends React.component定义的组件



### 对有状态组件和无状态组件的理解

**有状态组件**：

- 是类组件
- 有继承
- 可以使用this
- 可以使用react的生命周期
- 使用较多，容易频繁触发生命周期钩子函数，影响性能
- 内部使用state，维护自身状态的变化，有状态组件根据外部组件传入的props和自身的state进行渲染。

**无状态组件**

- 不依赖自身的状态state
- 可以是类组件或者函数组件。
- 可以完全避免使用this关键字。(由于使用的是箭头函数事件无需绑定)
- 有更高的性能。当不需要使用生命周期钩子时，应该首先使用无状态函数组件
- 组件内部不维护state，只根据外部组件传入的props进行渲染的组件，当props 改变时，组件重新渲染。



### 对react的fragment的理解

在React中，组件返回的元素只能有一个根元素。为了不添加多余的DOM节点，我们可以使用Fragment标签来包裹所有的元素，Fragment标签不会渲染出任何元素。



### react如何获取组件对应的dom元素

- 通过ref+this.refs
- react16提供的api，react.createRef
- 传入一个回调函数，回调函数的第一个参数就是原生DOM
- ref+useRef。



### react可以在render中访问ref吗？

不可以,render阶段 DOM还没有生成，无法获取DOM。



### 在react中如何避免不必要的render

- 使用shouldComponentUpdate和PureComponent
- 使用高阶组件（HOC）
- 函数式组件使用react.memo
- useEffect



### react context的理解

在react中，数据传递一般使用props。单纯对于父子组件来说是没有问题的，当组件之间关系依赖较深就比较麻烦了。

可以把context当做是特定一个组件树内共享的store，用来做数据传递。



### react中受控组件和非受控组件

**受控组件**：在使用表单来收集用户输入时，例如`<input><select><textearea>`等元素都要绑定一个change事件，当表单的状态发生变化，就会触发onChange事件，更新组件的state。这种组件在React中被称为**受控组件**，在受控组件中，组件渲染出的状态与它的value或checked属性相对应，react通过这种方式消除了组件的局部状态，使整个状态可控。简单的说就是表单元素值由react状态掌控

**非受控组件：**如果一个表单组件没有value props(单选和复选按钮对应的是checked props)时，就可以称为非受控组件。在非受控组件中，可以使用一个ref来从DOM获得表单值。



### react中绑定this的方法

- 构造函数中绑定
- 函数定义的时候使用箭头函数
- 函数调用的时候使用bind绑定this
- 函数调用的时候，传递一个箭头函数



### react组件的构造函数作用

构造函数主要用于两个目的:

- 通过将对象分配给this.state来初始化本地状态
- 将事件处理程序方法绑定到实例上

注意：

- constructor () 必须配上 super(), 如果要在constructor 内部使用 this.props 就要 传入props , 否则不用
- JavaScript中的 bind 每次都会返回一个新的函数, 为了性能等考虑, 尽量在constructor中绑定事件



### 类组件与函数组件的区别

- 类组件是基于面向对象编程的，它主打的是继承、生命周期等，而函数组件主打的是没有副作用、引用透明等特点。
- 在没有hook之前，如果需要使用生命周期、继承等，就使用类组件。函数式组件更推荐起一个展示的作用。当hook推出的时候，函数式组件可以代替类组件。其次继承并不是组件最佳的设计模式，官方更推崇“组合优于继承”的设计概念，所以类组件在这方面的优势也在淡出。

- 性能优化上，类组件主要依靠shouldComponentUpdate或继承pureComponent来阻断渲染来提升性能，而函数组件依靠React.memo 缓存渲染结果来提升性能。
- 函数式组件更轻量简洁



### react如何解决css样式冲突的问题

**CSS Modules**



### css in js为什么可以解决样式冲突，底层实现是什么

 CSS-in-JS 将组件的样式封装在其自己的作用域内，防止全局样式冲突

底层实现：动态生成唯一的类名，并将这些类名映射到实际的样式规则。这样可以确保样式的隔离性。



## 数据管理

### react setState调用过程



### react setstate调用后发生什么

- 在代码中调用setState函数之后，React 会将传入的参数对象与组件当前的状态合并，然后触发调和过程，然后根据新的状态构建React元素树并重新渲染整个Ul界面
- 在React得到元素树之后，React 会自动计算出新的树与老树的节点差异，然后根据差异对界面进行最小化重渲染。在差异计算算法中，React能够相对精确地知道哪些位置发生了改变以及应该如何改变，这就保证了按需更新，而不是全部重新渲染。
- 如果在短时间内频繁setState。React会将state的改变压入栈中，在合适的时机，批量更新state和视图，达到提高性能的效果。



### setState是同步的还是异步的

虽然我们讨论的是 setState 的同步异步，但这个不是 setTimeout、Promise 那种异步，只是指 setState 之后是否 state 马上变了，是否马上 render

setState 并不能保证是同步的，在生命周期函数和合成事件中是异步的，在原生事件和 setTimeout 中是同步的

在react18后都是异步的



### react中setState和replaceSate的区别

```jsx
setState(object nextState[, function callback])
replaceState(object nextState[, function callback])
```

setState：将要设置的新状态，该状态会和当前的state合并。合并nextState和当前state，并重新渲染组件。

而replaceState是完全替换原来的状态，相当于赋值，将原来的state替换为另一个对象

**总结**

setState 是修改其中的部分状态，相当于 Object.assign，只是覆盖，不会减少原来的状态。而replaceState 是完全替换原来的状态，相当于赋值，将原来的 state 替换为另一个对象，如果新状态属性减少，那么 state 中就没有这个状态了。



### react组件中this.state和setState的区别

this.state通常是用来初始化state的。this.setState是用来修改state值的。如果初始化了state之后再使用this.state，之前的state会被覆盖掉，如果使用this.setState，只会替换掉相应的state值。所以，如果想要修改state的值，就需要使用setState，而不能直接修改state，直接修改state之后页面是不会更新的。



### state是怎么注入到组件的，从reducer 到组件经历了什么样的过程



### react组件中state和props的区别

- **props：**props是一个从外部传进组件的参数，主要作为就是从父组件向子组件传递数据，它具有可读性和不变性，只能通过外部组件主动传入新的props来重新渲染子组件，否则子组件的props以及展现形式不会改变。
- **state**：state的主要作用是用于组件保存、控制以及修改自己的状态，它只能在constructor中初始化，它算是组件的私有属性，不可通过外部访问和修改，只能通过组件内部的this.setState来修改，修改state属性会导致组件的重新渲染。
- 区别：
  - props是传递给组件的(类似于函数的形参)，而state是在组件内被组件自己管理的(类似于在一个函数内声明的变量)。
  - props是不可修改的，所有React组件都必须像纯函数一样保护它们的 props不被更改。
  - state是在组件中创建的，一般在constructor中初始化state。state是多变的、可以修改，每次setState都异步更新的。



### react如何验证props

React为我们提供了PropTypes以供验证使用。当我们向Props传入的数据无效（向Props传入的数据类型和验证的数据类型不符）就会在控制台发出警告信息。它可以避免随着应用越来越复杂从而出现的问题。并且，它还可以让程序变得更易读。



## 生命周期

### react生命周期有哪些

React通常将组件生命周期分为三个阶段:

- 装载阶段(Mount)，组件第一次在DOM树中被渲染的过程【componentDidMount】
- 更新过程(Update)，组件状态发生变化，重新更新渲染的过程【componentDidUpdate】
- 卸载过程(Unmount)，组件从DOM树中被移除的过程【componentWillUnmount】



React常见生命周期的过程大致如下:

- 挂载阶段，首先执行constructor构造方法，来创建组件
- 创建完成之后，就会执行render方法，该方法会返回需要渲染的内容
- 随后，React会将需要渲染的内容挂载到DOM树上
- 挂载完成之后就会执行componentDidMount生命周期函数
- 如果我们给组件创建一个props(用于组件通信)、调用setState(更改state中的数据)时，都会重新调用render函数
- render函数重新执行之后，就会重新进行DOM树的挂载·挂载完成之后就会执行componentDidUpdate生命周期函数
- 当移除组件时，就会执行componentWillUnmount生命周期函数



### react性能优化在哪个生命周期，优化原理是什么

- shouldComponentUpdate提供了两个参数nextProps和nextState，表示下一次props和一次state的值，当函数返回false时候,render()方法不执行，组件也就不会渲染，返回true时，组件照常重渲染。此方法就是拿当前props中值和下一次props中的值进行对比，数据相等时，返回false，反之返回true
- 需要注意，在进行新旧对比的时候，是浅对比，也就是说如果比较的数据时引用数据类型，只要数据的引用的地址没变，即使内容变了，也会被判定为false。
- 解决办法：
  - 使用setState改变数据之前，先采用ES6中assgin进行拷贝或剩余参数，但是assgin只深拷贝的数据的第一层,
  - 使用json进行深拷贝，但遇到数据为undefined和函数就会报错



## 组件通讯

### 父子

父传子：父组件通过props给子组件传信息

子传父：props+回调的方式



### 跨组件

- 继续使用pros一层一层传递
- 使用context
- 可以使用自定义事件通信（发布订阅模式)
- 可以通过redux等进行全局状态管理
- 如果是兄弟组件通信，可以找到这两个兄弟节点共同的父节点结合父子间通信方式进行通信。



## 路由

### 路由持久化



## redux

### 对redux的理解，主要解决了什么问题

管理不断变化的state是非常困难的，状态之间相互会存在依赖，一个状态的变化会引起另一个状态的变化, View页面也有可能会引起状态的变化，当应用程序复杂时，state在什么时候，因为什么原因而发生了变化，发生了怎么样的变化，会变得非常难以控制和追。Redux就是一个帮助我们管理State的容器



### redux的工作原理及工作流程

首先，用户(通过View）发出Action，发出方式就用到了dispatch方法。然后，Store自动调用Reducer，并且传入两个参数:当前State和收到的Action，Reducer会返回新的State，State—旦有变化，Store就会调用监听函数，来更新View

以store为核心，可以把它看成数据存储中心，但是他要更改数据的时候不能直接修改，数据修改更新的角色由Reducers来担任，store只做存储，中间人，当Reducers的更新完成以后会通过store的订阅来通知react.component，组件把新的状态重新获取渲染，组件中也能主动发送action，创建action后这个动作是不会执行的，所以要dispatch这个action，让store通过reducers去做更新React Component
就是react的每个组件。



### redux异步请求怎么处理

使用react-thunk中间件



### redux怎么实现属性传递

react-redux数据传输: view-->action-->reducer-->store-->view



### redux中的connect有什么作用

- connect负责连接React和Redux，作用如下：
- 获取state：connect 通过context获取 Provider中的store，通过store.getstate()获取所有state
- 【包装原组件：将state和action通过props的方式传入到原组件内部wrapWithConnect返回一个ReactComponent对象Connect,Connect重新render外部传入的原组件WrappedComponent，并把connect 中传入的mapStateToProps，mapDispatchToProps与组件上原有的props合并后，通过属性的方式传给WrappedComponent】
- 监听store tree变化：connect缓存了store tree中state的状态，通过当前state状态和变更前state状态进行比较，从而确定是否调用this.setState()方法触发Connect及其子组件的重新渲染



## Hooks

### 对react hook的理解，他的设计原理是什么，解决了什么问题，有哪些缺陷

- react框架的设计理念是组合大于继承。React的数据应该总是紧紧地和渲染绑定在一起的，而类组件做不到这一点。
- 函数组件就真正地将数据和渲染绑定到了一起。函数组件是一个更加匹配其设计理念、也更有利于逻辑拆分与重用的组件表达形式。

- 解决问题
  - 组件的状态逻辑难以复用
  - 类组件代码量过多，代码逻辑更清晰
- 缺陷
  - **不要在循环，条件或嵌套函数中调用Hook，必须始终在 React函数的顶层使用Hook**
  - 在React的函数组件中调用Hook。



### hoos解决了状态难以复用的问题，那以前是怎么复用的

- **Render Props 模式：** 在 React 之前，通过 render props 模式来实现组件之间的状态共享。这种模式中，一个组件通过将自己的状态以函数属性的方式传递给另一个组件，从而实现状态共享。尽管这种模式可以实现状态复用，但在嵌套过深的情况下，可能会导致代码嵌套和可读性降低。
- **高阶组件（HOC）：** 高阶组件是一个函数，接受一个组件作为参数，并返回一个新的组件。通过高阶组件，可以将共享的状态逻辑包装在一个函数中，然后将这个函数应用于多个组件。这样可以实现状态的复用，但在复杂场景下，可能会导致高阶组件嵌套过多，难以维护。
- **Redux 和其他状态管理库：** 为了在多个组件之间共享状态，开发人员经常会使用状态管理库，如 Redux。这些库提供了一个全局的状态管理机制，允许不同组件之间共享数据。然而，使用状态管理库也可能引入一些复杂性，需要定义多个 action、reducer 等。
- **Context API：** React 16.3 引入了 Context API，允许组件树中的组件共享数据，而不必通过 props 逐层传递。Context API 在一些简单的场景下可以实现状态共享，但在复杂的应用中，可能需要处理嵌套的 Provider 和 Consumer，使代码变得复杂。



### Hooks为什么不能打乱顺序使用

这是因为React需要利用调用顺序来正确更新相应的状态，以及调用相应的钩子函数。一旦在循环或条件分支语句中调用Hook，就容易导致调用顺序的不一致性，从而产生难以预料到的后果。



### 用过哪些hooks

- useState
- useEffect
- useRef
  - `useRef`就是返回一个子元素索引，此索引在整个生命周期中保持不变。作用也就是：长久保存数据。注意事项，保存的对象发生改变，不通知。属性变更不会重新渲染
- useMemo
- usecallback
- useLayoutEffect
- useContext
  - 让子组件之间共享父组件传入的状态的



还有一些第三方的，我了解的，比如阿里的ahooks。社区维护的react-use

- `useRequest`：用于处理数据请求，自动处理 loading、error、data 等状态。
- `useLocalStorageState` 和 `useSessionStorageState`：用于在本地存储中保存状态。
- `useForm`：用于处理表单状态和验证。
- `useDebounce` 和 `useThrottle`：用于处理防抖和节流。
- `useInterval`：用于创建间隔定时器。





### useMemo usecallback对比

- 使用`useMemo`可以传递一个创建函数和依赖项，创建函数会需要返回一个值，只有在依赖项发生改变的时候，才会重新调用此函数，返回一个新的值。简单来说，作用是让组件中的函数跟随状态更新（即优化函数组件中的功能函数）。
- `useCallback`，作用也是让某些操作、方法跟随状态的更新而去执行
- 对比
  - 可以简单这样看作，`useMemo(() => Fn,deps)`相当于`useCallback(Fn,deps)` 不同点：
  - `useCallback`是对传过来的回调函数优化，返回的是一个函数；`useMemo`返回值可以是任何，函数，对象等都可以 
  -  useCallback适用场景：可以对父子组件传参渲染的问题进行优化。简单来说就是，**父组件的传入函数不更新，就不会触发子组件的函数重新执行**

- 相同点
  - 在使用方法上，`useMemo`与`useCallback`相同。接收一个函数作为参数，也同样接收第二个参数作为依赖列表



### 为什么 useState 要使用数组而不是对象

useState 返回的是 array 而不是 object 的原因就是为了降低使用的复杂度，返回数组的话可以直接根据顺序解构，而返回对象的话要想使用多次就需要定义别名了。



### useEffect 与useLayoutEffect的区别

- useEffect与useLayoutEffect 两者都是用于处理副作用，这些副作用包括改变DOM、设置订阅、操作定时器等。在函数组件内部操作副作用是不被允许的，所以需要使用这两个函数去处理。

- 执行时机不同。`useLayoutEffect`在`DOM`更新之后执行；`useEffect`在`render`渲染结束后执行。执行示例代码会发现`useLayoutEffect`永远比`useEffect`先执行，这是因为`DOM`更新之后，渲染才结束或者渲染还会结束



### react hook 和生命周期的关系

函数组件的本质是函数，没有state的概念的，因此不存在生命周期一说。但是引入Hooks之后就变得不同了，它能让组件在不使用class的情况下拥有state，所以就有了生命周期的概念【所谓的生命周期其实就是usestate() .useEffect()和useLayoutEffect()】





## 其他

### react的设计思路和理念是什么

React 的设计理念是构建一个能 **快速响应** 的框架。

React最近的几次大版本更新都围绕着快速 **快速响应** 这个目标, 不断优化用户的使用体验。



### react的状态提升是什么

React的状态提升就是用户对子组件操作，子组件不改变自己的状态，通过自己的props把这个操作改变的数据传递给父组件，改变父组件的状态，从而改变受父组件控制的所有子组件的状态。概括来说就是将多个组件需要共享的状态提升到它们最近的父组件上，在父组件上改变这个状态然后通过props分发给子组件。



### react严格模式有什么用处

- 识别不安全的生命周期
- 关于使用过时字符串ref API的警告
- 关于使用废弃的findDOMNode方法的警告
- 检测意外的副作用
- 检测过时的context APl



### react中遍历的方法有哪些

- 遍历数组：map和forEach
- 遍历对象：map和for.in



### react页面重新加载怎么保留数据

这个问题就设计到了数据持久化，主要的实现方式有以下几种：

- Redux:将页面的数据存储在redux中，在重新加载页面时，获取Redux中的数据
- data.js:使用webpack构建的项目，可以建一个文件，data.js，将数据保存data.js中，跳转页面后获取
- sessionStorge:在进入选择地址页面之前，componentWillUnMount的时候，将数据存储到sessionStorage中，每次进入页面判断sessionStorage中有没有存储的那个值，有，则读取渲染数据;没有，则说明数据是初始化的状态。返回或进入除了选择地址以外的页面，清掉存储的sessionStorage，保证下次进入是初始化的数据
- history API: History API的 pushState函数可以给历史记录关联一个任意的可序列化 state，所以可以在路由push的时候将当前页面的一些信息存到state中，下次返回到这个页面的时候就能从state里面取出离开前的数据重新渲染。react-router直接可以支持。这个方法适合一些需要临时存储的场景。



### react18有哪些新特性

- setState自动批处理

  - 在 18 之前，只有在react事件处理函数中，才会自动执行批处理，其它情况会多次更新

  - 在 18 之后，任何情况都会自动执行批处理，多次更新始终合并为一次

- 退出批量处理：`flushSync`
- 关于 React 组件的返回值
  - 在 `React 17` 中，如果你需要返回一个`空组件`，React只允许返回`null`
  - 在 `React 18` 中，不再检查因返回 `undefined` 而导致崩溃。既能返回 `null`，也能返回 `undefined`

- 严格模式控制台打印
  - 当你使用`严格模式`时，React 会对每个组件进行`两次渲染`，以便你观察一些意想不到的结果
  - 在 `React 18` 中，如果你安装了`React DevTools`，第二次渲染的日志信息将显示为灰色，以柔和的方式显式在控制台。

- Suspense 不再需要 fallback 来捕获
  - 在 `React 18` 的 `Suspense` 组件中，官方对 `空的fallback` 属性的处理方式做了改变：不再跳过 `缺失值` 或 `值为null` 的 `fallback` 的 `Suspense` 边界。相反，会捕获边界并且向外层查找，如果查找不到，将会把 `fallback` 呈现为 `null`。
- 在 React 18 中，引进了一个新的 API —— `startTransition` 还有二个新的 hooks —— `useTransition` 和 `useDeferredValue`，本质上它们离不开一个概念 `transition` 
  - Transition 本质上是用于一些不是很急迫的更新上，在 React 18 之前，所有的更新任务都被视为急迫的任务，在 React 18 诞生了 `concurrent Mode` 模式（并发模式），在这个模式下，渲染是可以中断，低优先级任务，可以让高优先级的任务先更新渲染。











