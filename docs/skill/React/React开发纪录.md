---
id: reactuse
slug: /reactuse
title: React开发纪录
date: 2002-09-26
authors: 鲸落
tags: [React]
keywords: [React]
---

## redux开发工具

- **redux-devtool**和**react-devtool**

- 安装好之后在浏览器中，redux默认我们是看不到这个仓库中的数据的（redux默认让我们看不到，我们要设置，**一般设置是在开发中打开，生产中关闭**）

- 在store/index.js中添加代码：

  - ```js
    // 2.引入compose
    import { createStore, applyMiddleware, compose } from "redux"
    
    import thunk from 'redux-thunk'
    import reducer from "./reducer"
    
    // 1.打开redux-devtool
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    
    // 3.组合
    // const store = createStore(reducer, applyMiddleware(thunk))
    const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)))
    
    export default store
    ```

  - 上面这是在开发环境中，在生产环境中，我们记得要将`window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__`删除

  - ```js
    // 生产环境
    const composeEnhancers = compose;
    ```



## 进入新页面在顶部不是底部

```jsx
//在App.jsx中配置，当页面发生跳转的时候，跳转到页面顶部
import { useLocation } from 'react-router-dom'

const App = memo(() => {

  //配置当页面发生跳转的时候，跳转到页面顶部
  const location = useLocation()
  useEffect(()=>{
    window.scrollTo(0,0)
  },[location.pathname])

  return (...)
})

export default App
```



## 添加proxy代理，解决跨域问题

1. 下载代理插件 http-proxy-middleware：`下载代理插件 http-proxy-middleware`

2. 在src目录下创建setupProxy.js文件

   ```js
   // setupProxy.js
   const { createProxyMiddleware } = require('http-proxy-middleware')
   
   module.exports = function(app) {
       app.use(
           createProxyMiddleware('/api', { //`api`是需要转发的请求 
               target: 'www.baidu.com', // 这里是接口服务器地址，我乱填的
               changeOrigin: true,
               pathRewrite: {
                   "^/api": ""
               }
           })
       )
   }
   ```



## react-router守卫路由

作用：没有登录的时候只能路由跳转重定向到登录页面

```tsx
// src\utils\authRouter.tsx

import React from 'react'
import { useLocation, Navigate } from 'react-router-dom'

const AuthRouter = (props: { children: JSX.Element }) =>{
    const { pathname } = useLocation()
	//这里当然可以简写，我这么写方便理解
    
    // 就是路由是登录页面或者有token的情况，页面展示
    if( pathname === '/login' ){
        return props.children
    }
    // 没有token重定向到登录页面
    if(!sessionStorage.getItem('token')){
        return <Navigate to='/login'></Navigate>
    }else{
        return props.children
    }
}

export default AuthRouter
```

```tsx
// src\index.tsx：导入并包裹

import AuthRouter from './utils/authRouter';
root.render(
    <BrowserRouter>
        <AuthRouter>
            <Suspense fallback="">
                <App></App>
            </Suspense>
        </AuthRouter>
    </BrowserRouter>
)
```





## useEffect异步设置数据问题

`setKeepMsgCon((prevKeepMsgCon) => [...prevKeepMsgCon, msg]);`

这行代码中使用了函数形式的 `setKeepMsgCon`，它接收一个函数作为参数，该函数用于计算新的状态值。**这种方式是为了确保在更新状态时，基于先前的状态进行更新，而不依赖于外部的状态。这样可以避免由于异步操作导致的不一致性或错误。**

解释代码的步骤如下：

1. `(prevKeepMsgCon) => [...]`: 这是一个箭头函数，它接收一个参数 `prevKeepMsgCon`，代表先前的状态值 `keepMsgCon`。箭头函数的返回值是一个新的数组，表示更新后的 `keepMsgCon` 状态。
2. `...prevKeepMsgCon`: 这里使用了展开运算符 `...`，它将先前的状态数组 `prevKeepMsgCon` 展开，将数组中的所有元素作为新数组的一部分。
3. `msg`: `msg` 是一个新的消息对象，它是要添加到更新后的状态数组中的新元素。

所以，整体来说，`setKeepMsgCon((prevKeepMsgCon) => [...prevKeepMsgCon, msg])` 的作用是将先前的状态数组 `keepMsgCon` 复制到一个新的数组中，并在新数组的末尾添加 `msg` 这个新的消息对象，然后用这个新的数组来更新 `keepMsgCon` 状态。这样就保证了状态的更新是基于先前的状态值，并且在异步操作中也能正确地更新状态，避免了由于异步操作导致的状态错误。

```tsx
// eg

// 接收画布的信息
socket.on('canvasData',(msg: canavsType)=>{
    const { isDown, x, y, canvasColor, lineSize } = msg
    // 保存绘画信息
    const a: canavsType[] = [...drawed]
    a.push(msg)
    setDrawed((drawed) => [...drawed, msg]);

    if(isDown){// 是不是第一次点下
        ctx.beginPath()
        ctx.moveTo(x, y)
    }else{
        ctx.lineTo(x, y)
        // 填充颜色
        ctx.strokeStyle = canvasColor
        // 设置线条宽度
        ctx.lineWidth = lineSize
        ctx.stroke()
    }

})
```

- `setDrawed((drawed) => drawed.slice(0, -1))`



## 警告与错误

### React报警告，warning: React does not recognize the `subTitle` prop on a DOM element.

在使用 React 和 styled-components时，可能会遇到这样的写法

```ts
// tsx
<CanvasStyled isErasing={isErasing}></CanvasStyled>

// CanvasStyled:style-componets
 cursor: {props => (props.isErasing ? 'move' : 'crosshair')};
```

原因： 不要将组件的属性, 传给DOM节点。

解决办法：防止样式化组件使用的 prop 被传递到底层 React 节点或渲染到 DOM 元素

```ts
<CanvasStyled $isErasing={isErasing}></CanvasStyled>

cursor: ${props => (props.$isErasing ? 'move' : 'crosshair')};
```

官网地址：[styled-components: API Reference](https://styled-components.com/docs/api#transient-props)
