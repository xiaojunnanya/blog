---
id: detailts
slug: /detailts
title: TS
date: 2002-09-26
authors: 鲸落
tags: [抓住小细节]
keywords: [抓住小细节]
---



## 类型

### TypeScript 中 type 和 interface 的区别?

相同点： 

- 都可以描述 '对象' 或者 '函数' 
- 都允许拓展(extends)

不同点： 

- type 可以声明基本类型，联合类型，元组
- type 可以使用 typeof 获取实例的类型进行赋值
- 多个相同的 interface 声明可以自动合并

使用 interface 描述‘数据结构，使用 type 描述‘类型关系



### TypeScript的内置数据类型有哪些？

- boolean（布尔类型）
- number（数字类型）
- string（字符串类型）
- void 类型
- null 和 undefined 类型
- array（数组类型）
- tuple（元组类型）：允许表示一个已知元素数量和类型的数组，各元素的类型不必相同
- enum（枚举类型）：`enum`类型是对JavaScript标准数据类型的一个补充，使用枚举类型可以为一组数值赋予友好的名字
- any（任意类型）
- never 类型
- object 对象类型



### TypeScript 中 const 和 readonly 的区别？

- const可以防止变量的值被修改，在运行时检查，使用const变量保存的数组，可以使用push，pop等方法

- readonly可以防止变量的属性被修改，在编译时检查，使用Readonly Array声明的数组不能使用push，pop等方法



### TypeScript 中 any 类型的作用是什么？

为编程阶段还不清楚类型的变量指定一个类型。 这些值可能来自于动态的内容，比如来**自用户输入或第三方代码库**（不确定用户输入值的类型，第三方代码库是如何工作的）。 这种情况下，我们不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查。

**any的问题**

1. 类型污染：any`类型的对象会导致后续的属性类型都会变成`any
2. 使用不存在的属性或方法而不报错



### TypeScript 中 any、never、unknown、null & undefined 和 void 有什么区别？

- `any`: 动态的变量类型（失去了类型检查的作用）。
- `never`: 永不存在的值的类型。例如：never 类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型。
- `unknown`: 任何类型的值都可以赋给 unknown 类型，但是 unknown 类型的值只能赋给 unknown 本身和 any 类型。
- `null & undefined`: 默认情况下 null 和 undefined 是所有类型的子类型。 就是说你可以把 null 和 undefined 赋值给 number 类型的变量。当你指定了 --strictNullChecks 标记，null 和 undefined 只能赋值给 void 和它们各自。
- `void`: 没有任何类型。例如：一个函数如果没有返回值，那么返回值可以定义为void。









































































