---
slug: /observerapi
title: Observer API
date: 2025-06-13
authors: jl
tags: [知识点, js ]
keywords: [知识点, js ]
---





## 汇总

- `MutationObserver`：监视对象树结构、属性、文本内容的变化
- `ResizeObserver`：监听元素尺寸变化，适合自适应组件 / 虚拟滚动 / 画布
- `IntersectionObserver`：检测元素与视口（或自定义根元素）的交叉情况，用于懒加载、无限滚动、埋点曝光
- `PerformanceObserver`：实时监听性能条目（FP/FCP/LCP、长任务、资源加载等），前端监控必备



## MutationObserver

https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver



### 作用

监视对象树结构、属性、文本内容的变化

- 能监听：childList（增删节点）、attributes、characterData、subtree
- 回调时机：**微任务**（与 `Promise.then` 同批），高频修改易塞满队列



### 方法

- `disconnect()`：阻止 `MutationObserver` 实例继续接收的通知，直到再次调用其 `observe()`方法，该观察者对象包含的回调函数都不会再被调用。
- `observe()`：配置 `MutationObserver` 在 DOM 更改匹配给定选项时，通过其回调函数开始接收通知。
- `takeRecords()`：从 `MutationObserver`的通知队列中删除所有待处理的通知，并将它们返回到`MutationRecord`对象的新 `Array`中。



### 详解`observe`

https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver/observe

`mutationObserver.observe(target[, options])`

两个参数，第一个参数：DOM 树中的一个要观察变化的 DOM，或者是被观察的子节点树的根节点。

第二个参数是一个对象，此对象的配置项描述了 DOM 的哪些变化应该报告给 `MutationObserver` 的 `callback`。当调用`observe()`时，`childList`、`attributes` 和 `characterData` 中，必须有一个参数为 `true`。否则会抛出 `TypeError` 异常。

- `subtree`：当为 `true` 时，将会监听以 `target` 为根节点的整个子树。包括子树中所有节点的属性，而不仅仅是针对 `target`。默认值为 `false`
- `childList`：当为 `true` 时，监听 `target` 节点中发生的节点的新增与删除（同时，如果 `subtree` 为 `true`，会针对整个子树生效）。默认值为 `false`。
- `attributes`：当为 `true` 时观察所有监听的节点属性值的变化。默认值为 `true`，当声明了 `attributeFilter` 或 `attributeOldValue`，默认值则为 `false`。
- `attributefilter`：一个用于声明哪些属性名会被监听的数组。如果不声明该属性，所有属性的变化都将触发通知。
- `attributeoldvalue`：当为 `true` 时，记录上一次被监听的节点的属性变化；可查阅[监听属性值](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver#监听属性值)了解关于观察属性变化和属性值记录的详情。默认值为 `false`。
- `characterdata`：当为 `true` 时，监听声明的 `target` 节点上所有字符的变化。默认值为 `true`，如果声明了 `characterDataOldValue`，默认值则为 `false`
- `characterdataoldvalue`：当为 `true` 时，记录前一个被监听的节点中发生的文本变化。默认值为 `false`。



### 示例

```js
// 选择需要观察变动的节点
const targetNode = document.getElementById("some-id");

// 观察器的配置（需要观察什么变动）
const config = { attributes: true, childList: true, subtree: true };

// 当观察到变动时执行的回调函数
const callback = function (mutationsList, observer) {
  // Use traditional 'for loops' for IE 11
  for (let mutation of mutationsList) {
    if (mutation.type === "childList") {
      console.log("A child node has been added or removed.");
    } else if (mutation.type === "attributes") {
      console.log("The " + mutation.attributeName + " attribute was modified.");
    }
  }
};

// 创建一个观察器实例并传入回调函数
const observer = new MutationObserver(callback);

// 以上述配置开始观察目标节点
observer.observe(targetNode, config);

// 之后，可停止观察
observer.disconnect();
```

```react
useEffect(() => {
    const observer = new MutationObserver((mutations) => {
        const gridLayouts = document.getElementsByClassName('portal_grid_layout_edit');
        Array.from(gridLayouts).forEach((gridLayout) => {});
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    return () => {
        observer.disconnect();
    };
}, [layout, widgets, componentCollapse]);
```





## ResizeObserver

## IntersectionObserver

## PerformanceObserver
