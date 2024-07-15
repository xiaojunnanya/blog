---
id: detailvue
slug: /detailvue
title: Vue
date: 2002-09-26
authors: 鲸落
tags: [抓住小细节]
keywords: [抓住小细节]
---



## Vue基础

### vue的响应式原理

**Vue 2 的响应式原理：**

在Vue 2中，响应式系统通过使用`Object.defineProperty`来实现。它的核心思想是，当一个对象被添加到Vue实例中作为一个数据属性时，Vue会将这个对象的属性转化为getter和setter。这样，当属性被访问或者修改时，Vue能够捕捉到这些操作并触发视图的更新。

**Vue 3 的响应式原理：**

Vue 3对响应式系统进行了重大改进，引入了Proxy API来实现响应式。Proxy是一种代理机制，它可以拦截对象的各种操作，包括属性的访问、修改和删除。

在Vue 3中，当您创建一个响应式对象时，Vue会使用Proxy来监听该对象的操作。这意味着，不需要像Vue 2那样显式地转化为getter和setter，而是直接使用原生JavaScript对象，并通过Proxy进行监听。



### 双向数据绑定的原理

Vue.js是采用数据劫持结合发布者-订阅者模式的方式，通过Object.defineProperty()来劫持各个属性的setter,getter，在数据变动时发布消息给订阅者，触发相应的监听回调。主要分为以下几个步骤:

- Observer数据监听器，通过递归方法遍历所有属性值，如果有变动的，就通知订阅者
- compile解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图
- Watcher订阅者是Observer和Compile之间通信的桥梁，主要做的事情是：
  - ①在自身实例化时往属性订阅器(dep)里面添加自己
  - ②自身必须有一个update()方法
  - ③待属性变动dep.notice()通知时，能调用自身的update()方法，并触发Compile中绑定的回调，则功成身退。
- MVM作为数据绑定的入口，整合Observer、Compile和Watcher三者，通过Observer来监听自己的model数据变化，通过Compile来解析编译模板指令，最终利用Watcher搭起Observer和Compile之间的通信桥梁，达到数据变化->视图更新;视图交互变化(input)->数据model变更的双向绑定效果。



### 使用Object.definePrototype()来进行数据劫持有什么缺点

- 监听对象需要递归遍历， 一次性递归到底开销很大，如果数据很大，大量的递归导致调用栈溢出

- 不能监听对象的新增属性和删除属性
- 当监听的下标对应的数据发生改变时，无法正确的监听数组的方法
- 在Vue3.0中使用Proxy对对象进行代理，从而实现数据劫持。使用Proxy的好处是它可以完美的监听到任何方式的数据改变，唯一的缺点是兼容性的问题，因为Proxy是ES6的语法。



### 使用proxy的优势

- `proxy性能整体上优于Object.defineProperty`
- `vue3支持更多数据类型的劫持`（vue2只支持Object、Array；vue3支持Object、Array、Map、WeakMap、Set、WeakSet）
- vue3支持更多时机来进行依赖收集和触发通知`（vue2只在get时进行依赖收集，vue3在get/has/iterate时进行依赖收集；vue2只在set时触发通知，vue3在set/add/delete/clear时触发通知），`所以vue2中的响应式缺陷vue3可以实现

- `vue3做到了“精准数据”的数据劫持`（vue2会把整个data进行递归数据劫持，而vue3只有在用到某个对象时，才进行数据劫持，所以响应式更快并且占内存更小）
- `vue3的依赖收集器更容易维护`（vue3监听和操作的是原生数组；vue2是通过重写的方法实现对数组的监控）



### 能谈一下defineProperty和Proxy的区别嘛？

- Object.defineProperty监听对象属性。而Proxy监听的是整个对象
  - Object.defineProperty的三个参数是（监听对象，监听对象的某一个值，函数）
    - 所以这就导致了一个vue2的问题，那就是我想给对象**obj**加个**newName**属性，可是我监听**obj**对象在前，而监听**obj**对象的时候，**obj**是没有**newName**属性的。所以`Object.defineProperty`内的参数就只有两个一个是**obj**，一个是**function**。所以vue2监听不到你新增的obj的新属性。所以vue2会有 **$set**
  - Proxy的两个参数是（监听对象，函数）



### MVVM框架

MVVM框架是为了将一个特别大的页面进行拆分，形成单个页面进行维护

- model：模型【数据层：vue中的data数据】
- view : 视图【dom ==> 在页面中展示的内容（template）】
- viewModel：视图模型层【Vue源码】



### computed和watch区别

- computed是计算属性，在调用的时候触发
- watch是监听，数据发生变化的时候触发，可以看到过去值和现在值，最重要的是他可以完成一些computed不能完成的操作，比如一些异步操作



### computed和method的区别

可以将同一函数定义为一个method或者一个计算属性。对于最终的结果，两种方式是相同的。不同点:

- computed是计算属性，在调用的时候触发
- methods是方法，放函数，在调用的时候触发



### slot

slot又名插槽，分为三类：默认插槽、具名插槽和作用域插槽

**作用**：

- 扩展组件能力，提高组件的复用性;
- 使用插槽可以将一些比较复杂的父传子的通信去掉，直接在父组件中完成后利用插槽显示到子组件中

**原理：**当子组件vm实例化时，获取到父组件传入的slot标签的内容，存放在`vm.$slot`中，默认插槽为`vm.$slot.default`，具名插槽为`vm.$slot.xxx`，xxx为插槽名，当组件执行渲染函数时候，遇到slot标签，使用`$slot`中的内容进行替换，此时可以为插槽传递数据，若存在数据，则可称该插槽为作用域插槽。



### props和data优先级

这个在源码中有体现，如果冲突的话，他会先判断props最高，然后是methods、data之后是computed，最后是watch



### 常见事件修饰器及其作用

- `.stop`：阻止捕获和冒泡阶段中当前事件的进一步传播
- `.prevent`：阻止默认事件
- `capture`：事件捕获
- `.self`：只会触发自己范围内的事件，不包含子元素
- `.once`：只会触发一次。



### v-if和v-show区别

如果切换频率很高，建议使用v-show，因为不展示的dom节点还在，只是动态控制隐藏和显示，而v-if是直接将dom元素移除



当v-show值为false时，绑定DOM的 display:none 当v-show值为true时，绑定DOM会 移除display:none ，此时并不是把display变为block，而是保持元素style的原始性，也就是说，不管初始条件是什么，元素总是会被渲染。



### data为什么是一个函数不是一个对象

- Vue组件可能存在多个实例，如果使用对象形式定义data，则会导致它们共用一个data对象，那么状态变更将会影响所有组件实例，这是不合理的;采用函数形式定义，在initData时会将其作为工厂函数返回全新data对象，有效规避多实例之间状态污染问题。
- 而在Vue根实例创建过程中则不存在该限制，也是因为根实例只能有一个，不需要担心这种情况。



### 对keep-alive的理解

`keep-alive`是`vue`中的内置组件，能在组件切换过程中将状态保留在内存中，防止重复渲染DOM



### $nextTick的原理和作用

作用：

- 在数据变化后执行的某个操作，而这个操作需要使用随数据变化而变化的DOM结构的时候，这个操作就需要方法在nextTick()的回调函数中。
- 在vue生命周期中，如果在created()钩子进行DOM操作，也一定要放在nextTick()的回调函数中。

原理：将传入的回调函数包装成宏微任务加入到Vue异步队列

**nextTick既可以是宏任务，又可以是微任务**，它优先微任务。

那什么时候使用宏任务，什么时候使用微任务呢？？

它对于浏览器异步API的选用规则如下，Promise存在取由Promise.then，不存在Promise则取MutationObserver，MutationObserver不存在setImmediate，setImmediate不存在最后取setTimeout来实现。



### Vue中封装的数组方法有哪些，其如何实现页面更新

在Vue中，对响应式处理利用的是Object.defineProperty对数据进行拦截，而是 Vue 为了性能，没有对数组进行响应式处理。

使用7个可以改变原数组的方法：push、unshif、shift、pop、reverse、sort、splice



### 子组件可以直接修改父组件的数据吗

vue是单向数据流，数据流向从上到下，父级 props的更新向下流动到子组件，但是反过来则不行。这样防止从子组件意外变更父级组件的状态。子组件只能通过$emit派发一个自定义事件，父组件接收到后，由父组件修改。



### vue如何监听对象或数组某个属性的变化

当在项目中直接设置数组的某一项的值，或者直接设置对象的某个属性值，这个时候，页面并没有更新。因为Object.defineProperty()限制，监听不到变化。

解决办法：

- 使用`this.$set()`
- 使用改变数组的那七个方法



### vm.$set的实现原理

- 如果目标是数组，直接使用数组的splice方法触发响应式
- 如果目标是对象，会先判读属性是否存在、对象是否是响应式，最终如果要对属性进行响应式处理，则是通过调用defineReactive方法进行响应式处理( defineReactive方法就是Vue在初始化对象时，给对象属性采用Object.defineProperty动态添加getter和setter的功能所调用的方法)



### 什么是mixin

将多个组件共用的代码逻辑提取成一个混入对象，钩子函数如created重复时，两者都会保留，先触发mixin的，再触发组件内的；methods、computed、data里的值存在冲突的属性时，以组件内部的属性为主



### 对SSR的理解

SSR就是服务器渲染，服务端直接渲染出 HTML 字符串模板，浏览器直接解析该字符串模版显示页面

SSR的优势：

- 更好的seo
- 首屏的加载速度更快

SSR的缺点:

- 开发条件会受到限制，服务器端渲染只支持beforeCreate和created两个钩子;
- 当需要一些外部扩展库时需要特殊处理，服务端渲染应用程序也需要处于Node.js的运行环境
- 更多的服务端负载。



### 对spa单页面的理解，优缺点有什么

SPA ( single-page application）仅在 Web页面初始化时加载相应的HTML、JavaScript和CSs。一旦页面加载完成，SPA 不会因为用户的操作而进行页面的重新加载或跳转;取而代之的是利用路由机制实现HTML内容的变换，UI与用户的交互，避免页面的重新加载。

- 优点:

  - 用户体验好、快，内容的改变不需要重新加载整个页面，避免了不必要的跳转和重复渲染;·基于上面一点，SPA相对对服务器压力小

  - 前后端职责分离，架构清晰，前端进行交互逻辑，后端负责数据处理

- 缺点:
  - 初次加载耗时多：为实现单页Web应用功能及显示效果，需要在加载页面的时候将JavaScript、CSS统一加载，部分页面按需加载
  - 前进后退路由管理:由于单页应用在一个页面中显示所有的内容，所以不能使用浏览器的前进后退功能，所有的页面切换需要自己建立堆栈管理
  - SEO难度较大:由于所有的内容都在一个页面中动态替换显示，所以在SEO上其有着天然的弱势。



### v-if和v-for哪个优先级更高

v-for的优先级要比v-if的优先级高【v-if和v-for不要写在同一个节点上，这个性能很差。（v-if要写在父节点上）】



### vue性能优化的方式

- 路由懒加载
- keep-alive缓存页面
- 使用v-show而不是v-if
- 使用v-for避免同时使用v-if
- 图片懒加载
- 第三方的插件按需引用
- SSR



### v-model实现原理

vue中v-model可以实现数据的双向绑定，他是vue的一个语法糖。即利用v-model绑定数据后，既绑定了数据，又添加了一个input事件监听
实现原理：首先v-bind绑定响应数据，然后触发input事件并传递数据





## 生命周期

### 说说生命周期

1、自带的有八个

- beforeCreate：创建前
- created：创建后
- beforeMount：挂载前
- mounted：挂载后
- beforeUpdate：更新前
- updated：更新后
- beforeDestroy：销毁前
- destroyed：销毁后

但要涉及到keep-alive会多两个【activated、deactivated】【用keep-alive包裹的组件在切换时不会进行销毁，而是缓存到内存中并执行deactivated 钩子函数，命中缓存渲染后会执行activated钩子函数】

2. 一旦进入到页面或者组件，会执行哪些生命周期，顺序。
    beforeCreate
    created
    beforeMount
    mounted

3. 在哪个阶段有`$el`，在哪个阶段有`data`
    beforeCreate 啥也没有
    created  有data没有el
    beforeMount 有data没有el
    mounted 都有

4. 如果加入了keep-alive会多俩个生命周期
     activated、deactivated

5. 如果加入了keep-alive，第一次进入组件会执行哪些生命？
     beforeCreate
     created
     beforeMount
     mounted
     activated

6. 如果加入了keep-alive，第二次或者第N次进入组件会执行哪些生命周期？
     只执行一个生命周期：activated

7. **父子组件生命周期执行顺序**

     挂载阶段：父beforeCreate -> 父created -> 父beforeMount -> 子beforeCreate -> 子created -> 子beforeMount -> 子mounted -> 父mounted

     更新阶段：父beforeUpdate -> 子beforeUpdate -> 子updated -> 父updated

     销毁阶段：父beforeDestroy -> 子beforeDestroy -> 子destroyed -> 父destroyed

     规律就是：父组件先开始执行，然后等到子组件执行完，父组件收尾。



### created和mounted的区别

- created：在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图。
- mounted：在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。



## 组件通讯

- 父传子：子通过props接收
- 子传父：自定义事件【子组件`$emit`绑定自定义事件，父组件可以用$on接收，`$off`解绑】
- 任意组件之间的：有那个`$bus`,就全局总线，先在main.js中定义，然后发数据用`$emit`,接受数据用`$bus`
- .
- 父组件在使用子组件的时候设置`ref`，父组件通过设置子组件`ref`来获取数据
- vuex



## 路由

### 懒加载如何实现

- 第一种，也是最常用的，使用箭头函数+import动态加载
- 方案二：使用箭头函数+require动态加载
- 使用webpack打包技术



### 路由hash和history模式的区别

- hash模式较丑，history模式较优雅
- hash兼容IE8以上，history兼容IE10以上
- history需要后台正确的配置，否则访问会返回404



### `$route`和`$router`的区别

- `$route`是“路由信息对象”，包括path，params，hash，query，fullPath，matched,name等路由信息参数
- `$router`是“路由实例”对象包括了路由的跳转方法，钩子函数等。



### Vue导航守卫

- 全局前置/钩子: beforeEach、beforeResolve、afterEach
- 路由独享的守卫: beforeEnter
- 组件内的守卫: beforeRouteEnter、beforeRouteUpdate、beforeRouteLeave





### vue-router和location.href有什么区别

- vue-router使用pushState更新路由，不会刷新页面；location.href会触发浏览器，页面刷新
- vue-router是路由跳转或同一个页面跳转；location.href是不同页面间跳转
- vue-router是异步加载this.$nextTick(()=>{获取url})；location.href是同步加载



### params和query的区别

- query
  - 拼接在url后面的参数
  - 参数在?后面，且参数之间用&符分隔
  - query相当于get请求，可以在地址栏看到参数

- params
  - 是路由的一部分。以对象的形式传递参数
  - params只能使用name传参跳转，如果写成path页面会显示警告，说参数会被忽略
  - params相当于post请求，参数不会在地址栏中显示



### 解决跨域问题

解决跨域的方法：

- jsonp
- cors【需要后端配合】
- proxy设置代理服务器

```js
//在vue.config.js页面配置：
devServer:{
    proxy:{
        '/api':{【这个/api当然可以随便起名字，是我们配置的名字，在请求的时候解析路径，发现/api就走这下面的东西】
            target:'http://localhost:5000',【我们请求的地址】
            pathRewrite:{【路径重写：特别特别重要，要是我们不加上这个，在请求的时候，我们设置代码后，请求的是				                        http://localhost:5000/api/student，他不会将我们的/api给去掉，配置'^/api':''，将/api变成空】
            	'^/api':''，
            },
        }
    }
}
```



### 缓存路由

使用keep-alive

keep-alive缓存的路由中我有的想缓存有的不想缓存怎么设置

- 在路由配置中设置 meta

  - ```vue
    const router = new VueRouter({
      routes: [
        {
          path: '/',
          name: 'Home',
          component: Home,
          meta: { keepAlive: true } // 需要缓存的页面
        },
        {
          path: '/about',
          name: 'About',
          component: About,
          meta: { keepAlive: false } // 不需要缓存的页面
        }
      ]
    });
    ```

- 在页面组件中使用

  - ```vue
    <template>
      <div>
        <!-- 使用 <keep-alive> 标签根据 meta.keepAlive 决定是否缓存 -->
        <keep-alive v-if="$route.meta.keepAlive">
          <router-view />
        </keep-alive>
        <!-- 不使用缓存的内容 -->
        <router-view v-else />
      </div>
    </template>
    ```

    



## Vuex

### vuex如何做持久化存储

- 使用sessionStorage或者localStorage存储
- 使用第三方插件【vuex-persistedstate或者vuex-persist】



### vuex的属性

他有五个属性

- actions 通过commit提交给mutations的，在这个可以做一些别的操作，比如向服务器获取数据呀
- mutations 类似于组件中methods，一些方法呀
- state 类似于组件中data，存放数据
- getters 类型于组件中computed，有一些计算操作会放在这
- modules 把以上4个属性细分，让仓库更好管理



### vuex的原理

Vuex实现了一个单向数据流，在全局拥有一个State存放数据，当组件要更改State 中的数据时，必须通过Mutation提交修改信息,Mutation同时提供了订阅者模式供外部插件调用获取 State数据的更新。而当所有异步操作(常见于调用后端接口异步获取更新数据)或批量的同步操作需要走Action，但Action也是无法直接修改State的，还是需要通过Mutation来修改State的数据。最后，根据State的变化，渲染到视图上。



### vuex中action和mutation的区别

mutaitons都是同步的而actions可以包含异步操作，



### Vuex、cookie和localStorage的区别

- vuex存储在内存中。localstorage则以文件的方式存储在本地，只能存储字符串类型的数据，存储对象需要JSON的stringify和parse方法进行处理。读取内存比读取硬盘速度要快
- localstorage是本地存储，是将数据存储到浏览器的方法，一般是在跨页面传递数据时使用。Vuex能做到数据的响应式，localstorage不能
- cookie本身用于浏览器和 server 通讯。被“借用”到本地存储来的。可用 document.cookie = '...' 来修改。其缺点是存储大小限制为 4KB。http 请求时需要发送到服务端，增加请求数量。并且只能用 document.cookie = '...' 来修改



## vue3.0

### vue2和vue3的区别

- vue2和vue3双向数据绑定原理发生了改变【vue2是definepropoty。。vue3是proxy】
- 组合式API
  - **Vue2**是选项API（Options API），一个逻辑会散乱在文件不同位置（`data、props、computed、watch、生命周期钩子等`），导致代码的可读性变差。当需要修改某个逻辑时，需要上下来回跳转文件位置。
  - **Vue3**组合式API（Composition API）则很好地解决了这个问题，可将同一逻辑的内容写到一起，增强了代码的可读性、内聚性，其还提供了较为完美的逻辑复用性方案。所有逻辑在`setup`函数中，使用 `ref、watch` 等函数组织代码

- ref 和 reactive

  - 我们都知道在选项式api中，data函数中的数据都具有响应式，页面会随着data中的数据变化而变化，而组合式api中不存在data函数该如何呢？所以为了解决这个问题Vue3引入了ref和reactive函数来将使得变量成为响应式的数据

  - ```js
    <script setup>
    import { ref,reactive } from "vue";
    let msg = ref('hello world')
    let obj = reactive({
        name:'juejin',
        age:3
    })
    const changeData = () => {
      msg.value = 'hello juejin'
      obj.name = 'hello world'
    }
    </script>
    ```

- 生命周期

  - ```js
    vue2     ------------------------------   vue3
    beforeCreate                         ->   setup()
    Created                              ->   setup()
    beforeMount                          ->   onBeforeMount
    mounted                              ->   onMounted
    beforeUpdate                         ->   onBeforeUpdate
    updated                              ->   onUpdated
    beforeDestroyed                      ->    onBeforeUnmount
    destroyed                            ->    onUnmounted
    activated                            ->    onActivated
    deactivated                          ->    onDeactivated
    ```

- 多根节点

  - vue2只能有一个根节点，vue3可多个

- diff算法的优化

- hooks

  - 以函数形式抽离一些**可复用的方法**像钩子一样挂着，随时可以引入和调用

- 父子组件传参：

  - vue2：父传子：子组件通过prop接收。子传父：子组件中通过$emit向父组件触发一个监听方法，传递一个参数
  - vue3：使用setup()中的第二个参数content对象中有emit，只需要在setup()接收第二个参数中使用分解对象法取出emit就可以使用了。

- v-if和v-show优先级改变

  - vue2：不建议将v-for和v-if写在一起使用，当在同一个元素上使用`v-if`时，将优先`v-for`
  - Vue3：v-if优先，再v-for
- `Teleport` 是一种能够将我们的模板移动到 `DOM` 中 `Vue app` 之外的其他位置的技术





### 能谈一下defineProperty和Proxy的区别嘛？

- Object.defineProperty监听对象属性。而Proxy监听的是整个对象
  - Object.defineProperty的三个参数是（监听对象，监听对象的某一个值，函数）
    - 所以这就导致了一个vue2的问题，那就是我想给对象**obj**加个**newName**属性，可是我监听**obj**对象在前，而监听**obj**对象的时候，**obj**是没有**newName**属性的。所以`Object.defineProperty`内的参数就只有两个一个是**obj**，一个是**function**。所以vue2监听不到你新增的obj的新属性。所以vue2会有 **$set**
  - Proxy的两个参数是（监听对象，函数）



### ref和reactive的区别



## 虚拟DOM

### 对虚拟dom的理解

虚拟DOM其实就是用一个JS对象描述一个DOM节点，实际上对真实 DOM 的一层抽象。最终可以通过一系列操作使这棵树映射到真实环境上。相当于在js与DOM之间做了一个缓存，利用patch（diff算法）对比新旧虚拟DOM记录到一个对象中按需更新， 最后创建真实的DOM



### 虚拟DOM的解析过程

- 首先对将要插入到文档中的DOM树结构进行分析，使用js对象将其表示出来，比如一个元素对象，包含TagName、props和Children这些属性。然后将这个js对象树给保存下来，最后再将DOM片段插入到文档中。
- 当页面的状态发生改变，需要对页面的DOM的结构进行调整的时候，首先根据变更的状态，重新构建起一棵对象树，然后将这棵新的对象树和旧的对象树进行比较，记录下两棵树的的差异。
- 最后将记录的有差异的地方应用到真正的DOM树中去，这样视图就更新了。



### 为什么要虚拟DOM

`DOM`是很慢的，其元素非常庞大，页面的性能问题，大部分都是由`DOM`操作引起的。真实的`DOM`节点，哪怕一个最简单的`div`也包含着很多属性。操作`DOM`的代价是昂贵的，频繁操作还是会出现页面卡顿，影响用户的体验

当你在一次操作时，需要更新10个`DOM`节点，浏览器执行10次。而通过虚拟DOM，同样更新10个`DOM`节点，虚拟`DOM`不会立即操作`DOM`，而是将其保存到本地的一个`js`对象中，最终将这个`js`对象一次性挂载到`DOM`树上



### diff算法的原理

对比新老虚拟DOM：

- 首先，对比节点本身，判断是否为同一节点，如果不为相同节点，则删除该节点重新创建节点进行替换
- 如果为相同节点，进行patchVnode(vnode1,vnode2)，后者替换前者，判断如何对该节点的子节点进行处理，先判断一方有子节点一方没有子节点的情况(如果新的children没有子节点，将旧的子节点移除)
- 比较如果都有子节点，则进行updateChildren，判断如何对这些新老节点的子节点进行操作(diff核心)。
- 匹配时，找到相同的子节点，递归比较子节点



### vue中key的作用

- key是为Vue 中vnode的唯一标记，通过这个key,diff 操作可以更准确、更快速
  - 更准确：因为带 key 就不是就地复用了，在sameNode 函数a.key===b.key对比中可以避免就地复用的情况。所以会更加准确。
  - 更快速:利用key的唯一性生成map对象来获取对应节点，比遍历方式更快



1. 虚拟DOM中key的作用：key是虚拟DOM对象的标识，当数据发生变化时，Vue会根据【新数据】生成【新的虚拟DOM】,随后Vue进行【新虚拟DOM】与【旧虚拟DOM】的差异比较，比较规则如下:

2. 对比规则:

   1. 旧虚拟DOM中找到了与新虚拟DOM相同的key:
      1. 若虚拟DOM中内容没变,直接使用之前的真实DOM !
      2. 若虚拟DOM中内容变了，则生成新的真实DOM，随后替换掉页面中之前的真实DOM。
   2. 旧虚拟DOM中未找到与新虚拟DOM相同的key，创建新的真实DOM,随后渲染到到页面。

3. 用index作为key可能会引发的问题:

   1. 若对数据进行:逆序添加、逆序删除等破坏顺序操作:
      会产生没有必要的真实DOM更新 ——> 界面效果没问题,但效率低.

   2. 如果结构中还包含输入类的DOM：

      会产生错误DOM更新 ——> 界面有问题。

4. 开发中如何选择key? :

   1. 最好使用每条数据的唯一标识作为key,比如id、手机号、身份证号、学号等唯一值。
   2. 如果不存在对数据的逆序添加、逆序删除等破坏顺序操作，仅用于渲染列表用于展示，使用index作为key是没有问题的。


