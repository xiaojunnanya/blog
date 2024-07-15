---
id: detailjs
slug: /detailjs
title: JS
date: 2002-09-26
authors: 鲸落
tags: [抓住小细节]
keywords: [抓住小细节]
---

## 数据类型

###  JavaScript有哪些数据类型？

JavaScript共有八种数据类型，分别是 Undefined、Null、Boolean、Number、String、Object、Symbol、BigInt。

- 这些数据可以分为原始数据类型和引用数据类型：
  - 栈：原始数据类型（Undefined、Null、Boolean、Number、String、Symbol、bigint）
  - 堆：引用数据类型（对象、数组和函数）

- Symbol 代表创建后独一无二且不可变的数据类型，它主要是为了解决可能出现的全局变量冲突的问题。



### 为什么会有Biglnt的提案?

- js中有`Number.MAX_SAFE_INTEGER`表示最大安全整数（2^53^ - 1）
- 在这个数范围内不会出现精度丢失(小数除外)
- 但是一旦超过这个范围，js就会出现计算不准确的情况，这在大数计算的时候不得不依靠一些第三方库进行解决，因此官方提出了BigInt来解决此问题
- Bigint表示超过2^53^ - 1



### 基本数据类型和引用数据类型的区别

基本数据类型存放在栈区。引用数据类型存放在堆区，引用数据类型在栈中存储了指针，该指针指向堆中该实体的起始地址



### 数据类型检测的方式有哪些

- typeof：数组、对象、null都会被判断为object
- instanceof：判断构造函数的 prototype 属性是否出现在对象的原型链中，只能正确判断引用数据类型，而不能判断基本数据类型
- constructor：两个作用，一是判断数据的类型，二是对象实例通过 constrcutor 对象访问它的构造函数。
  - 需要注意，如果通过new创建一个对象来改变它的原型，constructor就不能用来判断数据类型了

- Object.prototype.toString.call
  - 同样是检测对象obj调用toString方法，obj.toString()的结果和Object.prototype.toString.call(obj)的结果不一样，这是为什么？
  - 这是因为toString是Object的原型方法，而Array、function等类型作为Object的实例，都重写了toString方法




### 判断数组的方式

- Object.prototype.toString.call，判断是否为`'[object Array]'`
- 原型链：`obj.___proto__ === Array.prototype`
- 通过ES6的Array.isArray()做判断
- instanceof
- Array.prototype.isPrototypeOf(arr)
  - `isPrototypeOf()` 方法用于检查一个对象是否存在于另一个对象的原型链中




### null和undefined区别

- 首先 Undefined 和 Null 都是基本数据类型，这两个基本数据类型分别都只有一个值，就是 undefined 和 null。

- undefined 代表的含义是未定义，null 代表的含义是空对象。一般变量声明了但还没有定义的时候会返回 undefined，null主要用于赋值给一些可能会返回对象的变量，作为初始化。

- 当对这两种类型使用 typeof 进行判断时，Null 类型化会返回 “object”，undefined还是undefined。

- 当使用双等号对两种类型的值进行比较时会返回 true，使用三个等号时会返回 false。

- undefined是原生属性window.undefined。当在控制台输入两个的时候颜色也是不一样的



### typeof null 结果是什么，为什么

typeof null的结果是Object。null的类型标签也是000，和Object的类型标签一样，所以会被判定为Object。



### typeof NaN的结果是什么

- 结果是number。
- NaN 指“不是一个数字”(not a number)，用于指出数字类型中的错误情况，即“执行数学运算没有成功，这是失败后返回的结果”。

- NaN是一个特殊值，它和自身不相等，是唯一一个非自反(自反，reflexive，即x == = x不成立）的值。而NaN !== NaN和NaN != NaN为true。



### 为什么0.1+0.2!==0.3

- 计算机是通过二进制的方式存储数据的，所以计算机计算0.1+0.2的时候，实际上是计算的两个数的二进制的和。这两个数的二进制都是无限循环的数

- 它的实现遵循IEEE 754标准，双精度浮点数的小数部分最多只能保留52位，再加上前面的1，其实就是保留53位有效数字，剩余的需要舍去，遵从“0舍1入”的原则。



### isNaN 和 Number.isNaN的区别

- 函数isNaN 接收参数后，会尝试将这个参数转换为数值，任何不能被转换为数值的的值都会返回true，因此非数字值传入也会返回true，会影响NaN的判断。
- 函数Number.isNaN 会首先判断传入参数是否为数字，如果是数字再继续判断是否为NaN，不会进行数据类型的转换，这种方法对于NaN 的判断更为准确。



### ||和&&操作符的返回值?

- ||和&&首先会对第一个操作数执行条件判断，如果其不是布尔值就先强制转换为布尔类型，然后再执行条件判断。

  - 对于||来说，如果条件判断结果为true就返回第一个操作数的值，如果为false就返回第二个操作数的值。

  - &&则相反，如果条件判断结果为true就返回第二个操作数的值，如果为false就返回第一个操作数的值。


- ||和&&返回它们其中一个操作数的值，而非条件判断的结果



### Object.is()与比较操作符“== = ”、“== ” 的区别?

- 使用双等号(= =）进行相等判断时，如果两边的类型不一致，则会进行强制类型转化后再进行比较。
  - 特殊处理：`NaN != NaN`， `-0 == +0， null == undefined`

- 使用三等号(===）进行相等判断时，如果两边的类型不一致时，不会做强制类型准换，直接返回false。
  - 特殊处理：`NaN !== NaN`， `-0 === +0, null !== undefined`

- `Object.is()` 既不进行类型转换，也不对 `NaN`、`-0` 和 `+0` 进行特殊处理（这使它和 `===` 在除了那些特殊数字值之外的情况具有相同的表现）。
  - Object.is(NaN, NaN)：true
  - Object.is(-0,+0)：false
  - Object.is(null, undefined)：false




### object.assign和扩展运算法是深拷贝还是浅拷贝，两者区别

- 两者都是浅拷贝。拓展运算符在只有一层的时候是属于深拷贝，在多层的时候就是浅拷贝
- 对象合并，数组合并，Object.assign的性能会比展开运算符“...”的性能高
- Object.assign会触发Object.defineProperty的set方法，展开运算符“...”不会触发



### 如何判断一个对象是空对象?

- 使用JSON自带的.stringify方法来判断，`JSON.stringify(obj) === '{}'`
- 使用ES6新增的方法object.keys()来判断【判断length = 0】
- 使用ES6新增的方法object.values()来判断【判断length = 0】



### 判断一个数是不是整数

- `Number.isInteger`
- `% 1`：对1取模看剩下的是不是0



### js数组去重的方式

- indexOf、includes、filter、splice：创建新数组，遍历原数组，indexof等于-1加入新数组中

- set+Array.from：Array.from(new Set(arr));

- map+遍历：has(key):判断是否包括某一个key，返回Boolean类型,value设置为固定值

- ```js
  let arr = [11,23,1,22,32,23,11];
  let map = new Map();
  let newArr = [];
  for (let item of arr) {
    if(!map.has(item)){
      map.set(item,true);
      newArr.push(item);
    }
  }
  console.log(newArr)
  ```



### sort对字符串的排序

- 字符串默认的排序方式是按照数组的首字母大小顺序

- 字母和数字：数字优先字母，数字1和字符串1没有顺序优先级，按原数组中先后顺序排列



## js基础

### new操作符的实现过程（原理）

- 在内存中创建一个新的对象（空对象)
- 将构造函数的显式原型赋给这个对象的隐式原型（也就是将对象的`__proto__`属性指向构造函数的prototype属性)
- 执行构造函数中的代码，构造函数中的this指向该对象（也就是为这个对象添加属性和方法)
- 返回创建出来的新对象



### map和object的区别

- 键的类型：Map的键可以是任意值，包括函数、对象或任意基本类型。Object的键必须是 String或是Symbol。
- 键的顺序：Map 中的 key 是有序的。因此，当迭代的时候， Map 对象以插入的顺序返回键值。Object 的键是无序的
- size：Map 的键值对个数可以轻易地通过size 属性获取，Object 的键值不容易获取
- 迭代：map是可迭代的，可以被for of遍历，object不可以



### map和weakMap的区别

- Map的键可以是任意类型，WeakMap只接受对象作为键，不接受其它类型的值作为键
- 在Map中，如果某个键不再被引用，它仍然会被Map引用，并且不会被垃圾回收。而在WeakMap中，如果某个键不再被引用，它会被自动从WeakMap中删除，这也是WeakMap的一个特性，可以避免内存泄漏。
- Map可以被遍历，WeakMap不能被遍历



### js脚本延迟加载的方式

- defer属性：告诉浏览器不要等待脚本下载，而继续解析HTML，构建DOM Tree。如果脚本提前下载好了，它会等待DOM Tree构建完成，在DOMContentLoaded事件之前先执行defer中的代码。另外多个带defer的脚本是可以保持正确的执行顺序的
- async属性：async特性与defer有些类似，它也能够让脚本不阻塞页面。但async脚本不能保证顺序，它是独立下载、独立运行，不会等待其他脚本。async不会能保证在DOMContentLoaded之前或者之后执行。
- 区别：defer通常用于需要在文档解析后操作DOM的JavaScript代码，并且对多个script文件有顺序要求的。async通常用于独立的脚本，对其他脚本，甚至DOM没有依赖的
- 使用 setTimeout 延迟方法



### JavaScript类数组对象的定义

一个拥有length属性和若干索引属性的对象就可以被称为类数组对象，类数组对象和数组类似，但是不能调用数组的方法。常见的类数组对象有arguments和DOM方法的返回结果，还有一个函数也可以被看作是类数组对象，因为它含有length 属性值，代表可接收的参数个数。

常见的类数组对象转为数组的方式：

- `Array.prototype.slice.call(arrayLike)`
- `Array.prototype.splice.call(arrayLike,0)`
- `Array.prototype.concat.apply([],arrayLike)`
- `Array.from`
- `...`（展开运算符）



### 为什么函数的arguments 参数是类数组而不是数组?如何遍历类数组?

arguments是一个对象，它的属性是从О开始依次递增的数字，还有length等属性，与数组相似。但是它却没有数组常见的方法属性，如forEach , reduce等，所以叫它们类数组。

遍历类数组的方式：

- 使用apply、call等方法将数组的方法应用到类数组上
- 将类数组转为数组(方法：展开运算符、Array.from)



### 什么是DOM和BOM

- DOM指的是文档对象模型，它指的是把文档当做一个对象，这个对象主要定义了处理网页内容的一些方法。
- BOM指的是浏览器对象模型，它指的是把浏览器当做一个对象来对待，这个对象主要定义了与浏览器进行交互的一些放法。



### JavaScript为什么要进行变量提升，它导致了什么问题

- 变量提升的表现是，无论在何处声明的变量，好像都被提升到了的首部，可以在变量声明前访问到而不会报错。
- 造成变量声明提升的本质原因是js引擎在代码执行前有一个解析的过程，创建了执行上下文，初始化了一些代码执行时需要用到一些变量。
- 执行js代码有两步，解析和执行。
  - 在解析阶段，JS会检查语法，并对函数进行预编译。解析的时候会先创建一个全局执行上下文环境，先把代码中即将执行的变量、函数声明都拿出来，变量先赋值为undefined，函数先声明好可使用。在一个函数执行之前，也会创建一个函数执行上下文环境，跟全局执行上下文类似，不过函数执行上下文会多出this、arguments和函数的参数。
  - 在执行阶段，就是按照代码的顺序依次执行。
- 那为什么会进行变量提升呢？
  - 提高性能
  - 容错性更好



### 什么是包装类型

在 JavaScript 中，基本类型是没有属性和方法的，但是为了便于操作基本类型的值，在调用基本类型的属性或方法时 JavaScript 会在后台隐式地将基本类型的值转换为对象



### use strict是什么意思？使用它区别是什么?

- use strict是一种ECMAscript5添加的(严格模式)运行模式，这种模式使得Javascript 在更严格的条件下运行。设立严格模式的目的如下:
  - 消除Javascript语法的不合理、不严谨之处，减少怪异行为
  - 消除代码运行的不安全之处，保证代码运行的安全
  - 提高编译器效率，增加运行速度
- 区别：
  - 禁止使用with语句。
  - 禁止this 关键字指向全局对象
  - 对象不能有重名的属性



###  ES6模块与CommonJS模块有什么异同？

- **语法差异**：
  - ES6 模块使用 `import` 和 `export` 关键字来导入和导出模块
  - CommonJS 模块使用 `require()` 函数来导入模块，使用 `module.exports` 或 `exports` 来导出模块。
- **编译时 vs 运行时**：
  - ES6 模块在代码编译时确定导入和导出关系，使得静态分析和优化更容易。这也使得浏览器可以在加载脚本之前进行更好的优化。
  - CommonJS 模块在运行时加载，模块加载的顺序可能会影响模块的行为。
- **加载方式**：
  - ES6 模块的加载是异步的，浏览器和 Node.js 都支持 ES6 模块加载。
  - CommonJS 模块的加载是同步的，适用于服务器端 Node.js 环境。
- **导入/导出的本质**：
  - ES6 模块在导入和导出时，实际上是创建了一个不可变的绑定关系。这意味着导入的值是只读的，不能直接修改导出的值。
  - CommonJS 模块在导入和导出时，实际上是拷贝了值的引用，这允许在导入后修改导出的值。
- **动态 vs 静态**：
  - ES6 模块在编译时就已经确定了导入和导出的模块关系，因此不支持动态导入。
  - CommonJS 模块支持动态导入，可以在运行时根据需要进行模块的加载和引用。



### for...in和for...of的区别

for..of是ES6新增的遍历方式，允许遍历一个含有iterator接口的数据结构（数组、对象等）并且返回各项的值，和ES3中的for..in的区别如下

- for...of遍历获取的是对象的键值，for...in 获取的是对象的键名
-  for..in 会遍历对象的整个原型链，而for ... of 只遍历当前对象不会遍历原型链
-  对于数组的遍历，for..in 会返回下标值，for...of 返回属性值

- 【break可以停止for...in和for...of循环】



### for和forEach的区别

- for中return break continue生效。
- forEach中不能使用这三个，打断迭代可以try...catch
  - 将循环体放到try块中，当满足某个条件需要中断时抛出foreach.break异常，循环会提前中止



### forEach和map遍历的区别

- 相同点
  - 都是循环遍历数组中的每一项
  - 每次执行匿名函数都支持三个参数，参数分别为item(当前每一项)，index(索引值)，arr(原数组)
  -  匿名函数中的this都是指向window。
  - 只能遍历数组。

- 不同点
  -  map()会分配内存空间存储新数组并返回，forEach()不会返回数据
  -  forEach()可以改变原数组的元素，map()返回新的数组（map() 不会对空数组进行检测）



### 判断字符串以abc开头

- slice切割判断
- substr/substring
  - substr() 方法可在字符串中抽取从 *start* 下标开始的指定数目的字符。
  - substring() 方法用于提取字符串中介于两个指定下标之间的字符。
- indexOf()
- startsWith()/endsWith()



### 对象+数组+字符串操作

**遍历**：对象【for，for...in】、数组【for，for...in，for...of，forEach】、字符串【for，for...of】

**字符串操作**：

- str.indexOf：查找
- str.includes：是否包含字符串
- str.replace：替换
- str.slice：截取字符串
- str.split：字符串切割



**对象**

- 获取key：Object.keys()
- 获取value：Objtec.values()
- 获取key和value：Object.entries()
- Obj.assign
- 将 Object.entries()生成的二维数组转成对象：Object.fromEntries()



**数组操作**：

- splice：增删改
- 增：push（尾）、unshift（头）
- 删：pop（尾）、shift（头）
- 遍历：for...in（出来index，可以通过index获取值）、for...of（只能获取到值）、for、forEach
- slice()：截取
- concat()：合并多个数组/字符串
- join()：用字符拼接将数组转字符串
- 查找：indexOf、find、include、findIndex
- 排序：sort()【reverse()：反转】
- filter()：过滤
- map()：映射
- reduce()：累加
- Array.from()：就是将一个类数组对象或者可遍历对象转换成一个真正的数组
- fill()：向默认数组中填充一个固定的值
- flat：扁平化



**操作原数组**

1. push()：向数组尾部插入元素。

2. unshift()：向数组头部插入元素。

3. pop()：删除最后一个元素

4. shift()：删除第一个元素

5. splice()：替换数组的指定元素【slice()也截取数据，但他不改变数组】

6. sort()：对数组进行排序

7. reverse()：对数组进行反转



### localStorage、sessionStorage、cookie区别+

[session、token、cookie的区别 - 鲸落 (xiaojunnan.cn)](http://www.xiaojunnan.cn/sessionTokenCookie)



### JS中绑定事件的几种方式

- dom直接绑定

  - ```js
    <button id="btn" onclick="submit()">提交</button>
    <script>
        function submit() {
         	console.log('DOM click......');
     	};
    </script>
    ```

- js代码里获取DOM元素进行事件绑定

  - ```js
    <button id="btn">提交</button>
    <script>
        document.getElementById('btn').onclick = function() {
            console.log('脚本 click......');
        };
    </script>
    ```

- addEventListener

- 区别

  - 在DOM结构如果绑定两个 “onclick” 事件，只会执行第一个
  - 在脚本通过匿名函数的方式绑定的只会执行最后一个事件
  - 用 `addeventlistener`可以绑定同一个事件多次，且都会执行



### addEventListener有几个参数，第三个参数是什么

五个，最后一个参数不是标准的

- 第一个表示所要监听事件类型
- 第二个回调函数
- 第三个参数options是一个可选参数，可以传一个boolean，也可以传一个对象
  - 当传入一个boolean时，false表示事件在冒泡阶段触发（默认），true表示事件在捕获阶段触发，
  - 对象
    - capture：true/false，捕获/冒泡
    - one：第一次执行



### 图片懒加载的实现+

[前端一次渲染10万条数据的常见方法 - 鲸落 (xiaojunnan.cn)](http://www.xiaojunnan.cn/rendering#懒加载)



## ES6

### ES6以及之后有哪些新特性

- let/const
- 剩余运算符`...`
- 可选链?.
- 箭头函数
- 解构
  - `let { a,b:y } = {a:1, b:2}`：a为1，y为2，`b is not defined`：`et { a:a, b:y } = {a:1, b:2}`
- 模板字符串
- Map + set + weakmap + weakset：新的数据结构
- Proxy
- symbols
- Promise/async/await
- 幂运算 **
- obj
  - values
  - includes()
  - find/findIndex
  - object.entries和object.fromEntries
  - Object.at（类似于arr[index]）
  - Object.assgin
- array.flat
- for of
- 类中增添新成员和私有属性



### let/const/var区别

- 块级作用域：let和const具有块级作用域，var不存在块级作用域。块级作用域解决了ES5中的两个问题：
  - 内层变量可能覆盖外层变量
  - 用来计数的循环变量泄露为全局变量
- 变量提升：var存在变量提升，let和const不存在变量提升，即在变量只能在声明之后使用，否在会报错
- 暂时性死区︰在使用let、const命令声明变量之前，该变量都是不可用的。这在语法上，称为暂时性死区。使用var声明的变量不存在暂时性死区
- 给全局添加属性：浏览器的全局对象是window，Node的全局对象是global。var声明的变量会变成全局变量，并且会将该变量添加为全局对象的属性，但是let和const不会
- 重复声明: var声明变量时，可以重复声明变量，后声明的同名变量会覆盖之前声明的遍历。const和let不允许重复声明变量。
- 初始值设置:在变量声明时，var和let可以不用设置初始值。而const声明变量必须设置初始值
- 重新赋值：let和var可以重新赋值，const不行



### const对象的属性可以被修改吗

- const保证的并不是变量的值不能改动，而是变量指向的那个内存地址不能改动。
- 对于基本类型的数据（数值、字符串、布尔值)，其值就保存在变量指向的那个内存地址，因此等同于常量。

- 但对于引用类型的数据（主要是对象和数组）来说，变量指向数据的内存地址保存的只是一个指针，const只能保证这个指针是固定不变的



### 如果new一个箭头函数会咋样

- 箭头函数是ES6中的提出来的，它没有prototype，也没有自己的this指向，更不可以使用arguments参数，所以不能New一个箭头函数。

- **new操作符的实现步骤如下：**
  - 在内存中创建一个新的对象（空对象)
  - 将构造函数的显式原型赋给新对象的隐式原型（也就是将对象的`__proto__`属性指向构造函数的prototype属性)
  - 执行构造函数中的代码，构造函数中的this指向该对象（也就是为这个对象添加属性和方法)
  - 返回创建出来的新对象



### 箭头函数和普通函数的区别

- 箭头函数比普通函数更加简洁
- 箭头函数没有自己的this、arguments、prototype
- 箭头函数不能作为构造函数使用
- 箭头函数继承的this永远不会改变
- call、apply、bind等方法不能改变箭头函数中this的指向



### 箭头函数的this指向哪

箭头函数不同于传统JavaScript中的函数，箭头函数并没有属于自己的this，它所谓的this是捕获其所在上下文的this 值，作为自己的 this值，并且由于没有属于自己的this，所以是不会被new调用的，这个所谓的this也不会被改变。



## js高级

### 原型与原型链的理解

- 在JavaScript中是使用构造函数来新建一个对象的，每一个构造函数的内部都有一个prototype属性，它的属性值是一个对象，这个对象包含了该构造函数的所有的属性和方法。
- 当使用构造函数新建一个对象后，在这个对象的内部将包含一个指针，这个指针指向构造函数的prototype属性，在ES5中这个指针被称为对象的原型。
- 一般来说不应该能够获取到这个值的，但是现在浏览器中都实现了`__proto__`属性来访问这个属性，但是最好不要使用这个属性，因为它不是规范中规定的。ES5中新增了一个Object.getPrototypeOf()方法，可以通过这个方法来获取对象的原型。
- 当访问一个对象的属性时，如果这个对象内部不存在这个属性，那么它就会去它的原型对象里找这个属性，这个原型对象又会有自己的原型，于是就这样一直找下去，也就是原型链的概念。原型链的尽头一般来说都是null
- 【可以通过`hasOwnProperty()`方法来判断属性是否属于原型链的属性】



### 闭包+

[了解闭包与内存泄漏以及垃圾回收机制 - 鲸落 (xiaojunnan.cn)](http://www.xiaojunnan.cn/docs/javascript/closure)



### 作用域与作用域链+

[了解作用域与作用域链 - 鲸落 (xiaojunnan.cn)](http://www.xiaojunnan.cn/docs/javascript/scope)



### 执行上下文

[js运行原理 - 鲸落 (xiaojunnan.cn)](http://www.xiaojunnan.cn/docs/javascript/jsRunPrinciple)



### 对this的理解

this是执行上下文中的一个属性，它指向最后一次调用这个方法的对象。在实际开发中，this 的指向可以通过四种调用模式来判断。

- 默认绑定，就是独立函数调用，this指向window，但在严格模式下，独立调用的函数this指向的是undefined
- 隐式绑定：如果一个函数作为一个对象的方法来调用时，this 指向这个对象。
- new绑定：如果一个函数用new调用时，函数执行前会新创建一个对象，this指向这个新创建的对象
- 显示绑定：使用call、bind、apply

使用构造器调用模式的优先级最高，然后是 apply、call 和 bind 调用模式，然后是方法调用模式，然后是函数调用模式。



### call/apply/bind的区别

- apply接受两个参数，第一个参数是this的指向，第二个参数是函数接受的参数，以数组的形式传入

- call方法的第一个参数也是this的指向，后面传入的是一个参数列表

- bind方法和call很相似，第一参数也是this的指向，后面传入的也是一个参数列表(但是这个参数列表可以分多次传入，call则必须一次性传入所有参数)

- bind 方法的返回值是函数，需要手动调用才会执行，而 apply 和 call 则是立即调用

  



### 异步

#### 同步和异步的区别

- 同步指的是当一个线程在执行某个请求时，如果这个请求需要等待一段时间才能返回，那么这个进程会一直等待下去，直到消息返回为止再继续向下执行
- 异步指的是当一个进程在执行某个请求时，如果这个请求需要等待一段时间才能返回，这个时候进程会继续往下执行，不会阻塞等待消息的返回，当消息返回时系统再通知进程进行处理



#### async/await

async 函数返回一个Promise对象，当函数执行的时候，一旦遇到 await就会先返回，等到触发的异步操作完成，再执行函数体内后面的语句。

它能实现的效果都能用then链来实现，它是为优化then链而开发出来的。

单一的 Promise 链并不能发现 async/await 的优势，但是，如果需要处理由多个 Promise 组成的 then 链的时候，优势就能体现出来了（很有意思，Promise 通过 then 链来解决多层回调的问题，现在又用 async/await 来进一步优化它）



#### async/await对比promise的优势

- 代码读起来更加同步，Promise虽然摆脱了回调地狱，但是then的链式调用也会带来额外的阅读负担
- Promise传递中间值非常麻烦，而async/await几乎是同步的写法，非常优雅
- 错误处理友好，async/await可以用成熟的try/catch，Promise的错误捕获非常冗余
- 调试友好，Promise的调试很差，由于没有代码块，你不能在一个返回表达式的箭头函数中设置断点，如果你在一个then代码块中使用调试器的步进(step-over)功能，调试器并不会进入后续的.then代码块，因为调试器只能跟踪同步代码的每一步。



#### promise的理解

- Promise 是一个构造函数，接收一个函数作为参数，返回一个 Promise 实例。一个 Promise 实例有三种状态，分别是pending、fulfilled和 rejected，分别代表了进行中、已成功和已失败。实例的状态只能由 pending 转变 fulfilled 或者rejected 状态，并且状态一经改变，就凝固了，无法再被改变了。

- 状态的改变是通过 resolve() 和 reject() 函数来实现的，可以在异步操作结束后调用这两个函数改变 Promise 实例的状态，它的原型上定义了一个 then 方法，使用这个 then 方法可以为两个状态的改变注册回调函数。这个回调函数属于微任务，会在本轮事件循环的末尾执行。

- 常见方法：then、catch、finally（不管fulfilled还是rejected都会执行）

- 类方法：

  - resolve

  - reject

  - all
    - 所有fulfilled将所有Promise的返回值组成一个数组，
    - 当有一个Promise状态为reject时，新的Promise状态为reject，并且会将第一个reject的返回值作为参数
    - 全部成功才成功，一个失败全失败
    - promise.all是一个失败就全部失败吗，有没有办法让一个失败，但还是让他走resove？
    - 对所有的值进行catch捕获处理


  - allSettled（全部状态：数组）

  - race（第一个有结果就返回那个结果）

  - any（any方法会等到一个fulfilled状态，才会决定新Promise的状态，如果所有的Promise都是reject的，那么也会等到所有的Promise都变成rejected状态）




#### 其他

- trycatch不能捕获promise，可以捕获await
- 异步编程的解决方案? 为什么用promise而不用callback的方式？
  - 其实他俩差不多，并不能完全解决回调地狱的问题 ，但是为什么平时用promise呢? 因为callback会被调用多次 



### 创建对象的方式/js设计模式

- 第一种是工厂模式，工厂模式的主要工作原理是用函数来封装创建对象的细节，从而通过调用函数来达到复用的目的。
- 第二种构造函数模式，用new来调用
- 第三种模式是原型模式，每一个函数都有一个prototype属性，这个属性是一个对象，它包含了通过构造函数创建的所有实例都能共享的属性和方法。因此可以使用原型对象来添加公用属性和方法，从而实现代码的复用。
- 第四种是一个组合模式，组合使用构造函数模式和原型模式。通过构造函数来初始化对象的属性，通过原型对象来实现函数方法的复用



### 对象继承的方法

- 第一种是原型链
- 第二种是借用构造函数
- 第三种是组合继承，将原型链和构造函数结合在一起使用
- 第四种是原型式继承，将子类的原型设为父类的原型【es5中Object.create()方法】



### 垃圾回收和内存泄漏+

[了解闭包与内存泄漏以及垃圾回收机制 - 鲸落 (xiaojunnan.cn)](http://www.xiaojunnan.cn/docs/javascript/closure)



### 深浅拷贝+

[深拷贝与浅拷贝 - 鲸落 (xiaojunnan.cn)](http://www.xiaojunnan.cn/docs/javascript/lightDeppCopy)



### 回流和重绘+

[浏览器输入url会发生什么 - 鲸落 (xiaojunnan.cn)](http://www.xiaojunnan.cn/docs/network/inputUrlHappen#其他相关概念)



### js引擎—v8引擎的执行原理+

[js运行原理 - 鲸落 (xiaojunnan.cn)](http://www.xiaojunnan.cn/docs/javascript/jsRunPrinciple#v8引擎执行原理)



### js执行原理+

[js运行原理 - 鲸落 (xiaojunnan.cn)](http://www.xiaojunnan.cn/docs/javascript/jsRunPrinciple/)



### js循环机制+

[了解宏任务和微任务谁先执行 - 鲸落 (xiaojunnan.cn)](http://www.xiaojunnan.cn/docs/javascript/eventLoop)



### js宏任务和微任务+

[了解宏任务和微任务谁先执行 - 鲸落 (xiaojunnan.cn)](http://www.xiaojunnan.cn/docs/javascript/eventLoop)



### 事件委托的理解

事件委托本质上是利用了浏览器事件冒泡的机制。因为事件在冒泡过程中会上传到父节点，父节点可以通过事件对象获取到目标节点，因此可以把子节点的监听函数定义在父节点上，由父节点的监听函数统一处理多个子元素的事件，这种方式称为事件委托（事件代理)。

使用事件委托可以不必要为每一个子元素都绑定一个监听事件，这样减少了内存上的消耗。并且使用事件代理还可以实现事件的动态绑定，比如说新增了一个子节点，并不需要单独地为它添加一个监听事件，它绑定的事件会交给父元素中的监听函数来处理。





## 场景

### 如何阻止冒泡

普通浏览器使用: event.stopPropagation()

IE浏览器使用: event.cancelBubble = true



### 如何禁止复制粘贴

- css：`user-select:none`
- js
  - onselectstart
  - oncopy
