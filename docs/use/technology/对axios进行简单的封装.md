---
id: tsaxios
slug: /technology/tsaxios
title: 用ts对axios进行一个简单的封装
date: 2002-09-26
authors: 鲸落
tags: [tool, axios]
keywords: [tool, axios]
---

## 目录结构

```
├── service							# 请求的文件夹
    └── config
    	└── idnex.ts				# 定义常量
    └── modules
    	└── idnex.ts				# 测试模块
    └── request
    	└── idnex.ts				# 封装
    	└── type.ts					# 定义类型
    └── idnex.ts					# 创建实例
```



## 定义常量

```ts
// service\config\index.ts
export const TIMEOUT = 10000

// 设置开发环境和生产环境
export let BASE_URL = ''
if(process.env.NODE_ENV === 'development'){
    BASE_URL = ''
}else{
    BASE_URL = ''
}
```



## 封装

```ts
// service\request\index.ts
import axios from 'axios'
import type { AxiosInstance } from 'axios'

import { jlRequestConfig } from './type'


class jlRequest{
    instance: AxiosInstance

    // 创建axios实例
    constructor(config: jlRequestConfig){
        this.instance = axios.create(config)

        // 请求拦截器
        this.instance.interceptors.request.use((config)=>{
            console.log("全局请求成功拦截，这里可以开启loading、header携带token等");
            if(sessionStorage.getItem('token')){
                config.headers['Authorization'] = sessionStorage.getItem('token')
            }
            return config
        },(error) =>{
            console.log(error);
        })

        // 响应拦截器
        this.instance.interceptors.response.use((res)=>{
            console.log("全局响应成功拦截，这里可以去掉loading");
            
            return res
        },(error) =>{
            console.log(error);
        })

        // 针对特定的实例添加拦截器
        this.instance.interceptors.request.use(
            config.interceptors?.requestSuccessFn,
            config.interceptors?.requestFailureFn
        )

        this.instance.interceptors.response.use(
            config.interceptors?.responseSuccessFn,
            config.interceptors?.responseFailureFn
        )
    }

    // 创建网络请求的方法
    request<T=any>(config: jlRequestConfig){

        // 可以设置单次请求的成功拦截
        // if(config.interceptors?.requestSuccessFn){
        //     config = config.interceptors.requestSuccessFn(config)
        // }
 
        return this.instance.request<T>(config)
    }

    get<T=any>(config: jlRequestConfig){
        return this.request<T>({...config, method:'GET'})
    }

    post<T=any>(config: jlRequestConfig){
        return this.request<T>({...config, method:'POST'})
    }

}

export default jlRequest
```



## 定义类型

```ts
// service\request\type.ts
import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

// 在这里配置拦截器的类型，这样我们就可以动态的设置哪个请求有对应的拦截器
export interface jlRequestConfig extends AxiosRequestConfig{
    // 可选
    interceptors?: {
        requestSuccessFn?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig,
        // requestSuccessFn?: (config: AxiosRequestConfig) => AxiosRequestConfig,
        requestFailureFn?: (error: any) => any,
        responseSuccessFn?: (res: AxiosResponse) => AxiosResponse,
        responseFailureFn?: (error :any) => any,
    }
}
```



## 创建实例

```ts
// service\modules
import { BASE_URL, TIMEOUT } from "./config";
import jlRequest from "./request";

const jlReq = new jlRequest({
    baseURL:BASE_URL,
    timeout:TIMEOUT
})

const jlReq1 = new jlRequest({
    baseURL:BASE_URL,
    timeout:TIMEOUT,
    // 当我们这个接口需要额外的拦截器的时候，我们就可以配置
    interceptors:{
        requestSuccessFn(config){
            console.log('jlReq1的请求拦截');
            
            return config
        },
        requestFailureFn(error){
            return error
        },
        responseSuccessFn(res) {
            return res
        },
        responseFailureFn(error) {
            return error
        },
    }
})

export { jlReq, jlReq1 }
```





## 测试

```ts
import { jlReq1 } from "..";
// 在发请求的时候在这里就可以添加类型，让我们获取参数更方便
// jlReq1.request<{data:any, code: number}>
jlReq1.request({
    url:'/home'
}).then(res =>{
    console.log(res.data);
    // <> 的提示就是提示我们的res.data中的data、code
})
```

