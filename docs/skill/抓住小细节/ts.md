---
id: detailts
slug: /detailts
title: TS
date: 2023-07-14
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

使用 interface 描述‘数据结构，使用 type 描述‘类型关系’