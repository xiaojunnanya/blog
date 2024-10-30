---
id: javascript3
slug: /javascript/highCon
title: Javascript高级 - 续
date: 2002-09-26
authors: 鲸落
tags: [JavaScript]
keywords: [JavaScript]
---

## Proxy和Reflect

### 监听对象属性的操作

```js
//vue2的响应式原理
var obj = {
    name:'jl',
    age:18,
    height:1.8,
    address:'中国'
}

//遍历所有的key，对每一个属性使用defineProperty
const keys = Object.keys(obj)
for(const key of keys){
    let value = obj[key]
    Object.defineProperty(obj,key,{
        set:function(newKey){
            console.log(`${key}设置了新的值：${newKey}`);
            value = newKey
        },
        get:function(){
            console.log(`${key}取值,取值为：${value}`);
            return value
        }
    })
}

console.log(obj.name);
obj.name = "鲸落"
console.log(obj.name);
```

- 上面这段代码就利用了前面讲过的 Object.defineProperty 的存储属性描述符来对属性的操作进行监听。
- 但是这样做有什么缺点呢?
  - 首先，Object.defineProperty设计的初衷，不是为了去监听截止一个对象中所有的属性的。我们在定义某些属性的时候，初衷其实是定义普通的属性，但是后面我们强行将它变成了数据属性描述符。
  - 其次，如果我们想监听更加丰富的操作，比如新增属性、删除属性，那么Object.defineProperty是无能为力的。



### Proxy的基本使用

- 在ES6中，新增了一个Proxy类，这个类从名字就可以看出来，是用于帮助我们创建一个代理的
  - 也就是说，如果我们希望监听一个对象的相关操作，那么我们可以先创建一个代理对象(Proxy对象) 
  - 之后对该对象的所有操作，都通过代理对象来完成，代理对象可以监听我们想要对原对象进行哪些操作

- 我们可以将上面的案例用Proxy来实现一次:
  - 首先，我们需要new Proxy对象，并且传入需要侦听的对象以及一个处理对象，可以称之为handler
    - `const p = new Proxy(target, handler)`
  - 其次，我们之后的操作都是直接对Proxy的操作，而不是原有的对象，因为我们需要在handler里面进行侦听;
- 如果我们想要侦听某些具体的操作，那么就可以在handler中添加对应的**捕捉器**（Trap)
- set和get分别对应的是函数类型
  - set函数有四个参数：
    - target:目标对象(侦听的对象)
    - property:将被设置的属性key
    - value:新属性值
    - receiver:调用的代理对象
  - get函数有三个参数：
    - target:目标对象（侦听的对象)
    - property:被获取的属性key
    - receiver:调用的代理对象



```js
var obj = {
    name:'jl',
    age:18,
    height:1.8,
    address:'中国'
}

// 1.创建一个Proxy对象
const objProxy = new Proxy(obj,{
    set:function(target,key,value){
        console.log(`${key}被修改，值为${value}`);
        target[key] = value
    },
    get:function(target,key){
        console.log(`监听${key}`);
        return target[key]
    }
})

// 2.对obj的所有操作，应该去操作objProxy
console.log(objProxy.name);//jl
objProxy.age = 20
//新增属性也可以被监听
objProxy.sex = "男"
```





### Proxy其他捕获器

- handler.get()：属性读取操作的捕捉器。
- handler.set()：属性设置操作的捕捉器。
- handler.has()：in 操作符的捕捉器。
- handler.deleteProperty()：delete 操作符的捕捉器。

- handler.ownKeys()：Object.getOwnPropertyNames方法和Object.getOwnPropertySymbols方法的捕捉器。
- handler.apply()：函数调用操作的捕捉器。
- handler.construct()：new操作符的捕捉器。

- handler.getPrototypeOf()：Object.getPrototypeOf方法的捕捉器。
- handler.setPrototypeOf()：Object.setPrototypeOf方法的捕捉器。
- handler.isExtensible()：Object.isExtensible方法的捕捉器(判断是否可以新增属性)。
- handler.preventExtensions()：Object.preventExtensions方法的捕捉器。
- handler.getOwnPropertyDescriptor()：Object.getOwnPropertyDescriptor方法的捕捉器。
- handler.defineProperty()：Object.defineProperty方法的捕捉器。



**Proxy的constructor和apply**

当然，我们还会看到捕捉器中还有construct和apply，它们是应用于函数对象的：

```js
function foo(){}

const fooProxy = new Proxy(foo,{
    apply:function(){},
    constructor:function(){}
})
```



### Reflect

- Reflect也是ES6新增的一个API，它是一个对象，字面的意思是反射
- 那么这个Reflect有什么用呢?
  - 它主要提供了很多操作JavaScript对象的方法，有点像Object中操作对象的方法
  - 比如Reflect.getPrototypeOf(target)类似于Object.getPrototypeOf()
  - 比如Reflect.defineProperty(target, propertyKey, attributes)类似于Object.defineProperty)

- 如果我们有Object可以做这些操作，那么为什么还需要有Reflect这样的新增对象呢?【面试的时候可以聊一聊】
  - 这是因为在早期的ECMA规范中没有考虑到这种对对象本身的操作如何设计会更加规范，所以将这些API放到了Object上面
  - 但是Object作为一个构造函数，这些操作实际上放到它身上并不合适
  - 另外还包含一些类似于in、delete操作符，让JS看起来是会有一些奇怪的
  - 所以在ES6中新增了Reflect，让我们这些操作都集中到了Reflect对象上
  - 另外在使用Proxy时，可以做到不操作原对象;



### Reflect常见方法

与Proxy是一一对应，也有13个



### Proxy和Reflect共同完成代理

```js
var obj = {
    _name:'jl',
    set name(newValue){
        console.log("this:",this);
        this._name = newValue
    },
    get name(){
        console.log("获取方法被调用");
        return this._name
    }
}


const objProxy = new Proxy(obj,{
    set:function(target,key,newValue, receiver){
        //其实我们还是直接修改了原对象
        // target[key] = value
        // 使用映射的好处一：不在直接操作原对象
        // 好处二：使用映射他会有一个返回值，布尔类型，可以用来做判断，判断是否操作成功
        // 好处三：receiver就是外层Proxy对象】，并且reflect.set/get 最后一个参数，可以决定对象访问器setter/getter的this指向
        console.log("proxy中设置被调用");
        Reflect.set(target, key, newValue, receiver)
    },
    get:function(target,key, receiver){
        console.log("proxy中获取被调用");
        return Reflect.get(target, key, receiver)
    }
})


console.log(objProxy.name);//jl
```





## Promise

### 什么是Promise

- 我们来看一下Promise的API是怎么样的：
  - Promise是一个类，可以翻译成承诺、许诺、期约
  - 当我们需要的时候，给予调用者一个承诺：待会儿我会给你回调数据时，就可以创建一个Promise的对象
  - 在通过new创建Promise对象时，我们需要传入一个回调函数，我们称之为executor
    - 这个回调函数会被立即执行，并且给传入另外两个回调函数resolve、reject【resolve：成功，reject：失败】
    - 当我们调用resolve回调函数时，会执行Promise对象的then方法传入的回调函数
    - 当我们调用reject回调函数时，会执行Promise对象的catch方法传入的回调函数

```js
// 1.创建一个promise对象
const promise = new Promise((resolve,reject)=>{
    //这里的回调函数会被立即执行
    console.log("promise立即执行的函数");
    // 成功的回调：可以传参，在then的value中可以获取到
    // resolve("成功")

    // 失败的回调：可以传参，在catch的error中可以获取到
    // reject("失败")

    //当然如果我们即调用resolve又调用reject，只会执行在前面的，且多次调用只会执行一次
})

//第一种写法：
promise.then(()=>{})
promise.catch(()=>{})

//第二种写法【推荐】
promise.then((value)=>{
    console.log("成功的回调");
}).catch((error)=>{
    console.log("失败的回调");
})

//第三中写法，将成功和失败都在then中接收
promise.then((value)=>{
    
},(error)=>{
    
})
```





### promise状态

- 上面Promise使用过程，我们可以将它划分成三个状态:
  - 待定(pending)：初始状态，既没有被兑现，也没有被拒绝。当执行executor中的代码时，处于该状态
    - Executor是在创建Promise时需要传入的一个回调函数，这个回调函数会被立即执行，并且传入两个参数：resolve、reject
  - 已兑现(fulfilled)：味着操作成功完成。执行了resolve时，处于该状态，Promise已经被兑现
  - 已拒绝(rejected)：意味着操作失败。执行了reject时，处于该状态，Promise已经被拒绝
- 注意：**Promise的状态一旦被确定下来，就不会再更改，也不能再执行某回调函数来改变状态**





### Promise的resolve的值

- 情况一：如果resolve传入一个普通的值或者对象，那么这个值会作为then回调的参数

  - ```js
    //普通值：
    resolve("dd")
    resolve({name:"jl"})
    resolve([
        {},
        {},
        {}
    ])
    ```

- 情况二：如果resolve中传入的是另外一个Promise，那么这个新Promise会决定原Promise的状态

  - ```js
    //resolve(promise)：如果resoLve的值本身Promise对象，那么当前的Promise的状态会有传入的Promise来决定
    
    resolve(new Promise((resolve,reject)=>{
        setTimeout(()=>{
            console.log("等我一会");
            resolve("我好了")
        },3000)
    }))
    ```

- 情况三：如果resolve中传入的是一个对象，并且这个对象有实现then方法，那么会执行该then方法，并且根据then方法结果来决定Promise的状态【了解】

  - ```js
    resolve({
        name:"resolve",
        then:function(resolve){
            resolve("111")
        }
    })
    ```





### Promise的then方法

- then方法是返回一个新的Promise，这个新Promise的决议是等到then方法传入的回调函数有返回值时，进行换议

  - ```js
    const promise = new Promise((resolve,reject)=>{
        resolve("aaa")
    })
    
    promise.then((value)=>{
        console.log(value)//aaa
        return "bbb"//你的返回值会给下一个then，他其实就是在内部创建了一个新的promise，调resolve进行返回
    }).then((value)=>{
        console.log(value)//bbb
    }).catch((err)=>{
        
    })
    ```



### Promise的catch方法

catch也返回一个新的Promise，与then方法相同，在catch后面return，返回值给下一个then

当我们想在then中，去指向catch的时候，不能使用return，使用return回继续执行下一个then，可以使用抛出异常的方式

```js
const promise = new Promise((resolve,reject)=>{
    resolve("aaa")
})

promise.then((value)=>{
    console.log(value)//aaa
    return "bbb"//你的返回值会给下一个then，他其实就是在内部创建了一个新的promise，调resolve进行返回
}).then((value)=>{
    console.log(value)//bbb
    throw new Error("异常错误err")
}).catch((err)=>{
    console.log(err)//异常错误err
})
```



### finally方法

- finally是在ES9 (ES2018)中新增的一个特性：表示无论Promise对象无论变成fulfilled还是rejected状态，最终都会被执行的代码

- finally方法是不接收参数的，因为无论前面是fulfilled状态，还是rejected状态，它都会执行

- ```js
  const promise = new Promise((resolve,reject)=>{
      
  })
  
  promise.then((value)=>{
      console.log(value)
  }).catch((err)=>{
      console.log(err)
  }).finally(()=>{
      console.log("不管是走then还是走catch，最后都会执行")
  })
  ```



### 类方法resolve

回顾：

- 类方法：可以直接调用的，`Promise.resolve()`
- 实例方法：得构建实例对象进行调用，`const promise = new Promise();promise.then()`

- 前面我们学习的then、catch、finally方法都属于Promise的实例方法，都是存放在Promise的prototype上的
- 有时候我们已经有一个现成的内容了，希望将其转成Promise来使用，这个时候我们可以使用Promise.resolve方法来完成。
  - Promise.resolve的用法相当于new Promise，并且执行resolve操作



```js
Promise.resolve("hello world")//类似于下面的代码

new Promise((resolve,reject)=>{
    resolve("hello world")
})


Promise.resolve("hello world").then((value)=>{
    console.log("then结果:",value)//then结果:hello world
})
```





### 类方法reject

与类方法resolve相似

```js
Promise.reject("错误error").catch((err)=>{
    console.log(err)//错误error
})
```





### 类方法all

- 另外一个类方法是Promise.all：
  - 它的作用是将多个Promise包裹在一起形成一个新的Promise
  - 新的Promise状态由包裹的所有Promise共同决定：
    - 当所有的Promise状态变成fulfilled状态时，新的Promise状态为fulfilled，并且会将所有Promise的返回值组成一个数组
    - 当有一个Promise状态为reject时，新的Promise状态为reject，并且会将第一个reject的返回值作为参数

```js
const p1 = new Promise((resolve,reject)=>{
    // resolve("111")
    reject("p1 err")
})

const p2 = new Promise((resolve,reject)=>{
    resolve("222")
})

const p3 = new Promise((resolve,reject)=>{
    resolve("333")
})

Promise.all([p1,p2,p3]).then((res)=>{
    console.log("all res:",res);//['111', '222', '333']
}).catch((err)=>{
    console.log(err);//当其中一个出现err的时候，调用catch方法，并且后续的then也不会执行
})
```



### 类方法allSettled

- all方法有一个缺陷:当有其中一个Promise变成reject状态时，新Promise就会立即变成对应的reject状态。那么对于resolved的，以及依然处于pending状态的Promise，我们是获取不到对应的结果的
- 在ES11 (ES2020)中，添加了新的API **Promise.allSettled**：
  - 该方法会在所有的Promise都有结果(settled)，无论是fulfilled，还是rejected时，才会有最终的状态
  - 并且这个Promise的结果一定是fulfilled的

```js
const p1 = new Promise((resolve,reject)=>{
    // resolve("111")
    reject("p1 err")
})

const p2 = new Promise((resolve,reject)=>{
    resolve("222")
})

const p3 = new Promise((resolve,reject)=>{
    resolve("333")
})

Promise.allSettled([p1,p2,p3]).then((res)=>{
    console.log("all res:",res);//返回一个对象，将所有的都放在里面。里面有状态和值
})
```



### 类方法race

- 如果有一个Promise有了结果，我们就希望决定最终新Promise的状态，那么可以使用race方法：
  - race是竞技、竞赛的意思,表示多个Promise相互竞争，谁先有结果，那么就使用谁的结果



### 类方法any

- any方法是ES12中新增的方法，和race方法是类似的：
  - any方法会等到一个fulfilled状态，才会决定新Promise的状态
  - 如果所有的Promise都是reject的，那么也会等到所有的Promise都变成rejected状态
- 如果所有的Promise都是reject的，那么会报一个AggregateError的错误。





## 迭代器

### 概念

- **迭代器**(iterator)，使用户**在容器对象(container，例如链表或数组)上遍访的对象**，使用该接口无需关心对象的内部实现细节
- **从迭代器的定义我们可以看出来，迭代器是帮助我们对某个数据结构进行遍历的对象。**
- **在JavaScript中，迭代器也是一个具体的对象，这个对象需要符合迭代器协议**(iterator protocol) 
  - 迭代器协议定义了产生一系列值(无论是有限还是无限个）的标准方式
  - 在JavaScript中这个标准就是一个特定的next方法
  
- **next方法有如下的要求**：
  - 一个无参数或者一个参数的函数，返回一个应当拥有以下两个属性的对象
  - done (boolean)
    - 如果迭代器可以产生序列中的下一个值，则为 false。(这等价于没有指定done这个属性。)
    - 如果迭代器已将序列迭代完毕，则为 true。这种情况下，value是可选的，如果它依然存在，即为迭代结束之后的默认返回值
  - value：迭代器返回的任何JavaScript值。done为true时可省略。【done为true的时候，应该设置为返回undefined】



### 可迭代对象

- 什么又是可迭代对象呢？
  - 它和迭代器是不同的概念
  - 当一个对象实现了iterable protocol协议时，它就是一个可迭代对象
  - 这个对象的要求是必须实现@@iterator方法，在代码中我们使用Symbol.iterator访问该属性
- 好处
  - 当一个对象变成一个可迭代对象的时候，就可以进行某些迭代操作
  - 比如for...of操作时，其实就会调用它的@@iterator方法
- 原生可迭代对象：
  - 事实上我们平时创建的很多原生对象已经实现了可迭代协议，会生成一个可迭代对象的
  - String、Array、Map、Set、arguments对象、NodeList集合;



### 构建可迭代对象

```js
//将infos变成一个可迭代对象的条件
/*
	1.必须实现一个特点的函数[Symbol.iterator](){}
	2.这个函数需要返回一个迭代器（这个迭代器用户迭代当前的对象）
*/

const infos = {
    firends:['a','b','c'],
    [Symbol.iterator](){
        let index = 0
        //迭代器
        const infosInterator = {
            next: function(){
                if(index < infos.firends.length){
                    return { done:false, value:infos.firends[index++] }
                }else{
                    return { done:true }
                }
            }
        }
        return infosInterator
    }
}

//infos已经变成了一个可迭代对象
const iterator = infos[Symbol.iterator]()
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
```



### 优化可迭代对象

```js
const infos = {
    name:"jl",
    age:18,
    height:1.8,
    [Symbol.iterator](){
        const keys = Object.keys(this)
        let index = 0
        const infosIterator = {
            next:()=>{
                if(index < keys.length){
                    return {done:false, value: keys[index++]}
                }else{
                    return {done:true}
                }
            }
        }

        return infosIterator
    }
}


for (const iterator of infos) {
    console.log(iterator);
}
```





## 生成器

[10.14-11.3](E:\coderwhy\03-JavaScript-高级)





## 异步函数

### async

- async关键字用于声明一个异步函数    `async function foo(){}`

- 异步函数的内部代码执行过程和普通的函数是一致的，默认情况下也是会被同步执行。

- 异步函数有返回值时，和普通函数会有区别:

  - 情况一︰异步函数也可以有返回值，但是异步函数的返回值相当于被包裹到Promise.resolve中

    - ```js
      async function foo(){
          return 111
          // 相当于返回 Promise.resolve(111)
      }
      
      foo().then(value =>{
          console.log(value)//111
      })
      ```

  - 情况二：如果我们的异步函数的返回值是Promise，状态由会由Promise决定

  - 情况三∶如果我们的异步函数的返回值是一个对象并且实现了thenable，那么会由对象的then方法来决定

- **如果我们在async中抛出了异常，那么程序它并不会像普通函数一样报错，而是会作为Promise的reject来传递**



### await

- await关键字特点
  - await必须在异步函数中使用
  - 通常使用await是后面会跟上一个表达式，这个表达式会返回一个Promise
  - 那么await会等到Promise的状态变成fulfilled状态，之后继续执行异步函数【等待promise有结果之后，才会继续执行后续的代码】



```js
function requestData(url){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve(url)
            // 如果返回了reject，我们可以在getData中用catch捕获
            // reject("message err")
        },2000)
    })
}

async function getData(){
    //可以拿到resolve的结果，在继续执行下一步代码
    const result = await requestData("abc")
    console.log("result:",result);

    const res = await requestData(result + "ddd")
    console.log("res:",res);
}

getData().catch(err=>{
    console.log(err);
})
```



## 进程和线程

- 线程和进程是操作系统中的两个概念：
  - 进程(process)：计算机已经运行的程序，是操作系统管理程序的一种方式
  - 线程(thread)：操作系统能够运行运算调度的最小单位，通常情况下它被包含在进程中

- 听起来很抽象，这里还是给出我的解释：
  - 进程：我们可以认为，启动一个应用程序，就会默认启动一个进程（也可能是多个进程)
  - 线程：每一个进程中，都会启动至少一个线程用来执行程序中的代码，这个线程被称之为主线程
  - 所以我们也可以说进程是线程的容器;



## 微任务和宏任务

### 概念

- 事件循环中并非只维护着一个队列，事实上是有两个队列
  - 宏任务队列(macrotask queue) ：**ajax**、**setTimeout**、**setInterval**、**DOM监听**、Ul Rendering等
  - 微任务队列(microtask queue)：**Promise的then回调**、Mutation Observer API、queueMicrotask()等
  - 【**注意：new Promise中的代码会直接执行的，只有Promise的then回调才会加入到微任务队列中**】
- 那么事件循环对于两个队列的优先级是怎么样的呢?
  - main script中的代码优先执行(编写的顶层script代码)
  - 在执行任何一个宏任务之前(不是队列，是一个宏任务)，都会先查看微任务队列中是否有任务需要执行
    - 也就是宏任务执行之前，必须保证微任务队列是空的;
    - 如果不为空，那么就优先执行微任务队列中的任务(回调)



### 面试题一

画微任务、宏任务、执行上下文的图去分析

```js
console.log("script start");
        
setTimeout(function(){
    console.log("setTimeout1");
    new Promise(function(resolve){
        resolve()
    }).then(function(){
        new Promise(function(resolve){
            resolve
        }).then(function(){
            console.log("then4");
        })
        console.log("then2");
    })
})

new Promise(function(resolve){
    console.log("promise1");
    resolve()
}).then(function(){
    console.log("then1");
})

setTimeout(function(){
    console.log("setTimeout2");
})

console.log(2);

queueMicrotask(()=>{
    console.log("queueMicrotask1");
})

new Promise(function(resolve){
    resolve()
}).then(function(){
    console.log("then3");
})

console.log("script end");
```

```js
script start
promise1
2
script end
then1
queueMicrotask1
then3
setTimeout1
then2
then4
setTimeout2
```



### 面试题二

```js
console.log("script start");

function requestData(url){
    return new Promise((resolve)=>{
        setTimeout(()=>{
            console.log("setTimeout");
            resolve(url)
        },2000)
    })
}

function getData(){
    console.log("getData start");
    requestData("why").then(res =>{
        console.log("res:",res);
    })
    console.log("getData end");
}

getData()

console.log("script end");
```

```js
script start
getData start
getData end
script end
setTimeout
res:why
```



### 面试题三

解析 async 和 await 的执行顺序

在异步函数中，await后续的代码相当于在then中，等到promise.resolve有结果才执行，但出了async代码后不会等await，会立即执行

```js
console.log("script start");

function requestData(url){
    console.log("requestData");
    return new Promise((resolve)=>{
        setTimeout(()=>{
            console.log("setTimeout");
            resolve(url)
        },2000)
    })
}

async function getData(){
    // 1和2就是普通的执行函数，一起执行，执行完2后，3和4相当于一起加入到then（微任务）中，等待执行上下文执行完，在执行微任务
    console.log("getData start");//1
    const result = await requestData("why")//2
    console.log("res:",result);//3
    console.log("getData end");//4
}

getData()

console.log("script end");
```

```js
script start
getData start
requestData
script end
setTimeout
res:why
getData end
```



### 面试题四

```js
async function async1(){
    console.log("async1 start");
    await async2()
    console.log("ascyn1 end");
}

async function async2(){
    console.log("async2");
}

console.log("script start");

setTimeout(function(){
    console.log("setTimeout");
})

async1()

new Promise(function(resolve){
    console.log("promise1");
    resolve()
}).then(function(){
    console.log("promise2");
})

console.log("script end");
```

```js
script star
async1 start
async2
promise1
script end
async1 end
promise2
setTimeout
```



## 异常处理

- throw语句：throw表达式就是在throw后面可以跟上一个表达式来表示具体的异常信息
  - throw语句用于抛出一个用户自定义的异常
  - 当遇到throw语句时，当前的函数执行会被停止(**throw后面的语句不会执行**)
- 事实上，JavaScript已经给我们提供了一个Error类，我们可以直接创建这个类的对象
- Error包含三个属性:
  - **messsage**：创建Error对象时传入的message
  - name：Error的名称，通常和类的名称一致
  - stack：整个Error的错误信息，包括函数的调用栈，当我们直接打印Error对象时，打印的就是stack
- **我们会发现在之前的代码中，一个函数抛出了异常，调用它的时候程序会被强制终止**。如果我们在调用一个函数时，这个函数抛出了异常，但是我们并没有对这个异常进行处理，那么这个异常会继续传递到上一个函数调用中，而如果到了最顶层(全局)的代码中依然没有对这个异常的处理代码，这个时候就会报错并且终止程序的运行
- **捕获异常：try...catch**
  - 自己捕获了异常的话，那么异常就不会传递给浏览器，那么后续的代码可以正常执行
  - 当然，如果有一些必须要执行的代码，我们可以使用finally来执行。





## Storage

- WebStorage主要提供了一种机制，可以让浏览器提供一种比cookie更直观的key、value存储方式
  - **localStorage**：本地存储，提供的是一种永久性的存储方法，在关闭掉网页重新打开时，存储的内容依然保留
  - **sessionStorage**：会话存储，提供的是本次会话的存储，在关闭掉会话时，存储的内容会被清除

- localStorage和sessionStorage区别呢
  - 验证一：关闭网页后重新打开，localStorage会保留，而sessionStorage会被删除
  - 验证二：在页面内实现跳转，localStorage会保留，sessionStorage也会保留
  - 验证三：在页面外实现跳转（打开新的网页)，localStorage会保留，sessionStorage不会被保留
- Storage的属性：Storage.length：只读属性，返回一个整数，表示存储在Storage对象中的数据项数量。
- Storage的方法：
  - Storage.key(index)：该方法接受一个数值n作为参数，返回存储中的第n个key名称
  - Storage.getltem()：该方法接受一个key作为参数，并且返回key对应的value
  - Storage.setltem()：该方法接受一个key和value，并且将会把key和value添加到存储中。如果key存储，则更新其对应的值
  - Storage.removeltem()：该方法接受一个key作为参数，并把该key从存储中删除
  - Storage.clear()：该方法的作用是清空存储中的所有key;



## 正则表达式

[12.5-12.16](E:\coderwhy\03-JavaScript-高级\12-Storage存储-正则表达式-认识防抖)



## 防抖节流

### 防抖函数

#### 概念

- 我们理解一下它的过程:
  - 当事件触发时，相应的函数并不会立即触发，而是会等待一定的时间
  - 当事件密集触发时，函数的触发会被频繁的推迟
  - 只有等待了一段时间也没有事件触发，才会真正的执行响应函数
- 防抖的应用场景：
  - 输入框中频繁的输入内容，搜索或者提交信息
  - 频繁的点击按钮，触发某个事件
  - 监听浏览器滚动事件，完成某些特定操作
  - 用户缩放浏览器的resize事件
- **这就是防抖的操作：只有在某个时间内，没有再次触发某个函数时，才真正的调用这个函数**【在一定的时间内，频繁的触发某一个时事件，只有最后一次才会执行】



#### 基本功能

```js
<input type="text" name="" id="">
   
<script>

    function myDebounce(fn, delay){
        // 1.纪录上一次事件触发的timer
        let timer = null
        // 2.触发事件执行的函数
        const _debounce = function(...args){
            // 3.如果再次触发，取消上一次的触发
            if(timer) clearTimeout(timer)
            timer = setTimeout(()=>{
                fn.apply(this,args)
                // 执行函数之后，将timer重置为null
                timer = null
            }, delay)
        }

        return _debounce
    }

</script>

<script>

const ipt = document.querySelector("input")

let index = 0
ipt.oninput = myDebounce(function(event){
    console.log(`执行次数${++index}`,this.value,event);
},1000)

</script>
```



#### 其他功能

[13.4-7](E:\coderwhy\03-JavaScript-高级\13_手写防抖和节流-浅拷贝和深拷贝-事件总线)



### 节流函数

#### 概念

- 理解一下节流的过程
  - 当事件触发时，会执行这个事件的响应函数
  - 如果这个事件会被频繁触发，那么节流函数会按照一定的频率来执行函数
  - 不管在这个中间有多少次触发这个事件，执行函数的频繁总是固定的
- 节流的应用场景：
  - 监听页面的滚动事件
  - 鼠标移动事件
  - 用户频繁点击按钮操作
  - 游戏中的一些设计



#### 基本功能

```js
<input type="text" name="" id="">
   
<script>

    function myThrottle(fn, interval){
    let startTime = 0
    const _myThrottle = function(...args){
        const nowTime = new Date().getTime()
        const waitTime =interval - (nowTime - startTime)
        if(waitTime <= 0){
            fn.apply(this,args)
            startTime = nowTime
        }
    }

    return _myThrottle

}

</script>

<script>

    const ipt = document.querySelector("input")

let index = 0
ipt.oninput = myThrottle(function(event){
    console.log(`执行次数${++index}`,this.value,event);
},1000)

</script>
```



## 深浅拷贝

### 概念



### 浅拷贝

- 方式一：直接赋值

- 方式二：展开运算符 ...

  - ```js
    const info = {
        name:"a",
        age:18,
        friend:{
            name:"b"
        }
    }
    
    const obj1 = {...info}
    
    obj1.name = "c"
    console.log(info.name)//a
    obj1.friend.name = "d"
    console.log(info.friend.name)//d
    ```

- 方式三：Object.assgin()



### 深拷贝

- 方式一：JSON

  - ```js
    const info = {
        name:"a",
        age:18,
        friend:{
            name:"b"
        }
    }
    
    const info1 = JSON.parse(JSON.stringify(info))
    ```

  - 缺点：

    - JSON.stringify在转换的时候，会默认忽略掉对象里面的函数、Symbo等值

    - 不能处理循环引用：

    - ```js
      const info = {
          name:"a",
          age:18,
          friend:{
              name:"b"
          }
      }
      
      info.info = info//之后json无法转换，报错
      ```

- 方式二：自定义



**手写**

```js
//工具函数，判断是不是对象
function isObject(value){
    //null,object,array都会返回object，但null是应该返回false
    //function也应该返回true
    const valueType = typeof value
    return (value !== null) && (valueType === 'object' || valueType === 'function')
}

function deepCopy(obj){
    //判断：如果是对象类型，才需要创建新对象。原始类型直接返回
    if(!isObject(obj)) return obj

    //判断是不是数组，是定义[],不是定义{}
    const newObj = Array.isArray(obj) ? [] :{}
    for(const key in obj){
        if(typeof obj[key] === 'function'){
            newObj[key] = obj[key]
        }else{
            newObj[key] = deepCopy(obj[key])
        }
    }

    return newObj
}

const info = {
    name:"a",
    age:18,
    friend:{
        name:"b",
        address:{
            name:"c",
            detail:"d"
        }
    }
}       

const newObj = deepCopy(info)
console.log(newObj);

newObj.friend.address.name = "dwasdas"

console.log(info.friend.address.name);//c
```























