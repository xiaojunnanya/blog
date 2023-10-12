---
id: commonjsnode
slug: /node/commonjsnode
title: 了解CommonJs在Nodejs中实现的本质
date: 2002-09-26
authors: 鲸落
tags: [Node]
keywords: [Node]
---

## 基本使用

在Nodejs中我们要导入导出一个变量或函数的时候，我们使用`exports/module.exports、require`

```js
//one.js
let a = '111'
let b = '222'

exports.a = a
exports.b = b
//或者
module.exports = {
    a: a,
    b: b,
}
```

```js
// two.js
const all = require('./one')

console.log(all);//{ a: '111', b: '222' }
```



## 本质探讨 - exports导出

exports是一个对象，我们可以在这个对象中添加很多个属性，添加的属性会导出

```js
let a = '111'
let b = '222'

console.log('exports1', exports);// exports1 {}

exports.a = a

console.log('exports2', exports);// exports2 { a: '111' }

exports.b = b

console.log('exports3', exports);// exports3 { a: '111', b: '222' }
```



`const all = require('./one')`那么我们这一步操作就是想办法通过这个`require`这个函数拿到`exports`对象，对于all拿到了当前这个对象的引用内存地址，所有这里所做的一种操作相当于引用赋值



我们可以验证一下这个`引用赋值`

**在导出的地方修改我们的值：**

```js
let a = '111'
let b = '222'

exports.a = a

exports.b = b

setTimeout(()=>{
    exports.b = '333'
}, 2000)
```

```js
const all = require('./one')

console.log(all.b);//222

setTimeout(()=>{
  console.log(all.b);//333
},4000)
```

**在导入的地方修改我们的值**

```js
let a = '111'
let b = '222'

exports.a = a

exports.b = b

setTimeout(()=>{
    console.log('exports.b', exports.b); // exports.b 333
}, 4000)
```

```js
const all = require('./one')

console.log('all.b', all.b);//all.b 222

setTimeout(()=>{
  all.b = '333'
},2000)
```



## 本质探讨 - module.exports导出

我们在`require('./one')`的时候，并不是在查找`exports`，而是`module.exports`，但是`exports`和`module.exports`是相同的对象，`exports === module.exports`为true



同时在开发中我们导入一个数据的时候，我们修改这个数据并不希望他去影响原来的数据。我们会选择这样导入

```js
//one.js
let a = '111'
let b = '222'

module.exports = {
    a,
    b,
}
// 将a和b赋值给一个新的对象
// 当我们修改exports.a = '333',并不会影响导入的数据
// 当然我们要是通过这样修改也会改变的：module.exports.a = '444'
```



## 思考

当我们了解exports和module.exports后，我们在想，对于这个exports，没有存在的意义呀，module.exports将事情都做了

那为什么node中要设计两个呢。这个和CommonJs的规范有关的

- CommonJs中是没有`module.exports`的概念的
- 但是为了实现模块的导出，Node中使用的是**Module的类，每一个模块都是Module的一个实例，也就是module**
- 所以在Node中真正用于导出的其实根本不是exports，而是module.exports
- 因为module才是导出的真正实现者









