---
id: tsreact
slug: /tsreact
title: TS与React结合小细节
date: 2002-09-26
authors: 鲸落
tags: [React, TypeScript]
keywords: [React, TypeScript]
---

## 零碎

- 创建项目：`create-react-app 名字 --template typescript`

- router中需要创建index.tsx

- 用ts的话，既然写了tsx，就需要导入react：`import React from 'react'`

- 组件导出首字母必须要大写

- `const [ banner, setBanner ] = useState<any []>([])`   【设置类型】

- 定义了promise，需要传入参数，是为了显示resolve的类型

  - ```ts
    const a = new Promise<string>((resolev, reject)=>{
        // 限制它的类型
        resolve("aaa")
    }).then(res =>{
        console.log(res)
    })
    ```

- 初始化构建渲染页面的时候

  - ```ts
    import React from 'react';
    import ReactDOM from 'react-dom/client';
    import App from './App';
    
    const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
    
    root.render(<App></App>)
    ```

- ts+react导入图片模块

  - ```ts
    // 在src加创建：react-app-env.d.ts
    
    // 加入：
    /// <reference types="react-scripts" />
    ```

- 配置路径：

  - ```json
    // 在tsconfig.json加入：
    
    {
      "compilerOptions": {
        ...
         // 加入baseUrl和paths
        "baseUrl": ".",
        "paths": {
          "@/*":[
            "src/*"
          ]
        }
      },
      "include": [
        "src"
      ]
    }
    ```

  - 




## 函数式组件参数类型约束

```tsx
// 第一中写法
import React, { memo } from 'react'

interface IPerson{
  name: string,
  age: number,
  height?: string
}

const download = memo((props: IPerson) => {
  return (
    <div>download</div>
  )
})

export default download
```



```tsx
// 第二种写法：推荐
import React, { memo, FC } from 'react'

interface IPerson{
  name: string,
  age: number,
  height?: string
}

// 使用泛型将类型设置给props
const Download: FC<IPerson> = memo((props) => {
  return (
    <div>
      <div>{ props.name }</div>
      <div>{ props.age }</div>
      <div>{ props.height }</div>
    </div>
  )
})

export default download
```



```tsx
// 当我们设置React.FC<IPerson>后，然后我们想要实现类似于插槽的作用，需要在IPerson中设置children
import React, { memo } from 'react'
import type { ReactNode, FC } from 'react'

interface IPerson{
  name: string,
  age: number,
  height?: string,
  children?: ReactNode
}

const Download: FC<IPerson> = memo((props) => {
    // 这里我们可以设置默认值
    const { name = 'hh', ... } = props
    
  return (
    <div>
      <div>{ props.name }</div>
      <div>{ props.age }</div>
      <div>{ props.height }</div>
      <div>{ props.children }</div>
    </div>
  )
})

export default Download
```



## 类组件参数类型约束

**props约束**

```ts
import React, { PureComponent } from 'react'

interface IPerson{
  name: string,
  age?: number
}

// 接收类型在PureComponent的泛型写法中
export class index extends PureComponent<IPerson> {

  constructor(props: IPerson){
    super(props)
  }

  render() {
    return (
      <div>index</div>
    )
  }
}

export default index
```



**state类型**

```ts
import React, { PureComponent } from 'react'

interface IProps{
  name: string,
  age?: number
}

interface IState{
  aa: string,
  bb: number
}
// 接收第二个参数
export class index extends PureComponent<IProps, IState> {

  constructor(props: IProps){
    super(props)

    this.state = {
      aa:'aaa',
      bb:11,
    }
  }

  render() {
    return (
      <div>index</div>
    )
  }
}

export default index
```

```ts
//简便写法：成员变量可以在constructor外定义，同时constructor默认就会进行super操作，可以隐藏

import React, { PureComponent } from 'react'

interface IProps{
  name: string,
  age?: number
}

interface IState{
  aa: string,
  bb: number
}

export class index extends PureComponent<IProps, IState> {

  state: IState = {
    aa:'aa',
    bb:11
  }

  // constructor(props: IProps){
  //   super(props)

  //   this.state = {
  //     aa:'aaa',
  //     bb:11,
  //   }
  // }

  render() {
    return (
      <div>index</div>
    )
  }
}

export default index
```





## redux的类型封装

最主要是要封装useSelector，useDispatch和shallowEqual是为了统一在一个文件中加进来的

```tsx
// store/modules/count.ts

import { createSlice } from '@reduxjs/toolkit'

const countSlice = createSlice({
    name:"count",
    initialState:{
        num:10
    },
    reducers:{
        addNum(state, action){
            state.num = action.payload
        }
    }
})

export const { addNum } = countSlice.actions

export default countSlice.reducer
```



```tsx
// store/index.ts

import { configureStore } from "@reduxjs/toolkit"
import countReducer from './modules/count'

import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'

const store = configureStore({
    reducer: {
        count: countReducer,
    }
})

// 好好理解理解
// 将 useSelector 与ts进行一个结合封装一下 到时候我们直接使用 useAppSelector 就会类型推断自动判断我们的类型

// 拿useSelector的类型
type StateFnType = typeof store.getState
type RootState = ReturnType<StateFnType>

// 拿useDispatch的类型
type DispatchType = typeof store.dispatch


export const useAppSelector: TypedUseSelectorHook<RootState>= useSelector
export const useAppDispatch: ()=> DispatchType = useDispatch
// 这部其实意义不大，但是为了统一一下，我们就进行一个赋值，然后都在这个文件导出
export const useAppShallowEqual = shallowEqual

export default store 
```



```tsx
// 项目文件中

import React, { memo } from 'react'

// 自己封装的类型
import { useAppSelector, useAppDispatch, useAppShallowEqual } from '@/store'

import { addNum } from './store/modules/count'

const App = memo(() => {

  const { count } = useAppSelector((state) =>({
    count: state.count.num,
  }), useAppShallowEqual)

  const dispatch = useAppDispatch()
  const change = () =>{
    dispatch(addNum(20))
  }

  return (
    <div>
      { count }

      <button onClick={change}>11</button>
    </div>
  )
})

export default App

```



## redux类型推导补充

当我们在定义initialState的时候，一般我们是不需要进行类型声明的，因为他会自动进行类型推导，但是如果我们定义的变量不容易进行类型推导的话（比如我们定义了常量联合类型、数组等），我们也可以对其进行一个类型声明

```ts
import { createSlice } from '@reduxjs/toolkit'

interface ISate{
    num: num,
    info: string
    position: 'left' | 'right'
}

const initialState: IState = {
    num:10,
    inof: '信息',
    position: 'right'
}

const countSlice = createSlice({
    name:"count",
    initialState,
    reducers:{
        addNum(state, action){
            state.num = action.payload
        }
    }
})

export const { addNum } = countSlice.actions

export default countSlice.reducer
```

同时我们也可以对action.payload定义类型

```ts
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const countSlice = createSlice({
    name:"count",
    initialState:{
        num:10
    },
    reducers:{
        // 接收泛型，当然结构的写法也是可以这样的  { payload }: PayloadAction<number>
        addNum(state, action: PayloadAction<number>){
            state.num = action.payload
        }
    }
})

export const { addNum } = countSlice.actions

export default countSlice.reducer
```



## redux异步操作的类型

createAsyncThunk也可以传入类型

```tsx
// jsx
createAsyncThunk("fetch", async (payload, {dispatch, getState })=>{...})

// tsx:三个类型：返回值类型 + payload类型 + state类型（一般是我们在总模块中定义的类型）
createAsyncThunk<void, number, { state: RootState }>("fetch", async (payload, {dispatch, getState })=>{...})
```





## useRef类型指定

当我们将useRef绑定给一个组件的时候，必须要设置类型，因为我们拿current的时候需要有自己的类型

```tsx
// 我们以antd中的Carousel为例，我们需要拿到Carousel

import React, { memo, useRef } from 'react'
import type { FC, ReactNode, ElementRef } from 'react'
import { Carousel } from 'antd';

interface IPerson{
  children?: ReactNode
}

const Banner: FC<IPerson> = memo(() => {
	// 获取Carousel的类型，使用ElementRef，并且不能初始化为空，所有我们设置初始化为null
  const bannerRel = useRef<ElementRef<typeof Carousel>>(null)

  return (
    <BannerStyled>
          <Carousel autoplay ref={bannerRel}>
              {
                  banners.map((item, index) =>{
                      return (
                          <div key={index} className='banner-item'>
                              <a href={item.url} target='blank'>
                                  <img className='image' src={item.imageUrl} alt="" />
                              </a>
                          </div>
                      )
                  })
              }
          </Carousel>
    </BannerStyled>
  )
})
```





















