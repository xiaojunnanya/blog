---
id: qiankun
slug: /technology/qiankun
title: qiankun的使用
date: 2002-09-26
authors: 鲸落
tags: [tool, qiankun]
keywords: [tool, qiankun]
---

## qiankun官网

[qiankun - qiankun (umijs.org)](https://qiankun.umijs.org/zh)



## 使用前安装配置

- 安装：`yarn add qiankun # 或者 npm i qiankun -S`   【每一个应用中都需要安装qiankun】

- 配置端口号：在对应的项目根目录下建立`.env`文件，填入`PORT=3010`来设置端口号



## react项目

### 步骤一

**主应用**：在主应用根文件配置【index.js文件】

```js
import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
  {
    name: 'react app', // 子应用的名称
    entry: '//localhost:3011',
    container: '#containerReact',   // 加载容器
    activeRule: '/react', //  主页面展示子页面执行的路由
  }
]);

start();
```



### 步骤二

**子应用**：在src目录下添加`public-path.js`文件，并写入，同时在index.js 下引入

```js
if (window.__POWERED_BY_QIANKUN__) {
    __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```

修改package.json文件

添加globals的目的是为了设置全局环境

```json
"eslintConfig": {
    "extends": [
        "react-app",
        "react-app/jest"
    ],
    "globals": {
        "__webpack_public_path__": true
    }
},
```





### 步骤三

**子应用**：在index.js文件中添加添加限制与生命周期

```js
// 原来的index.js
import ReactDOM from 'react-dom/client'
import App from './App'

const root = ReactDOM.createRoot(document.querySelector("#root"))

root.render(<App></App>)
```

```js
// 添加限制
import ReactDOM from 'react-dom/client'
import App from './App'
import './public-path.js'

// 路由 history
import { BrowserRouter } from 'react-router-dom'


// 将原先的封装成函数，在mount生命周期的时候执行
function render(props){
    const { container } = props;
    // 也是判断哪哪个环境下，挂载到哪个盒子中
    const dom = container ? container.querySelector('#root') : document.querySelector('#root')
    const root = ReactDOM.createRoot(dom)
    // 这里的basename与我们在主应用中配置的activeRule对应，这是路由匹配
    root.render(
        <BrowserRouter basename={window.__POWERED_BY_QIANKUN__ ? '/react' : '/'}>
            <App></App>
        </BrowserRouter>
    );
}

// 判断是否在qiankun环境下运行，非qiankun环境下独立运行
if (!window.__POWERED_BY_QIANKUN__) {
    render({});
}

// bootstrap：只会在应用初始化的时候调用一次，下次进入会走mount
export async function bootstrap() {
    console.log('[react16] react app bootstraped');
}

// 每次进入都会执行，通常我们在这个触发应用的渲染方法
export async function mount(props) {
    console.log('[react16] props from main framework', props);
    render(props);
}

// 卸载
export async function unmount(props) {
    const { container } = props;
    ReactDOM.unmountComponentAtNode(container ? container.querySelector('#root') : document.querySelector('#root'));
}
```



### 步骤四

**子应用**：

1、为了不eject所有的webpack配置，我们使用`react-app-rewired`工具来改造webpack配置【安装：`npm install react-app-rewired`】

2、然后=在根目录下新增`config-overrides.js`，加入：

注意：在qiankun官网中使用的是config.output.jsonpFunction = `webpackJsonp_${name}`。但是我们在使用过程中

```js
const { name } = require('./package');

module.exports = {
  webpack: (config) => {
    config.output.library = `${name}-[name]`;
    config.output.libraryTarget = 'umd';
    config.output.chunkLoadingGlobal = `webpackJsonp_${name}`;
    config.output.globalObject = 'window';

    return config;
  },

  devServer: (_) => {
    const config = _;

    config.headers = {
      'Access-Control-Allow-Origin': '*',
    };
    config.historyApiFallback = true;
    config.hot = false;
    config.watchContentBase = false;
    config.liveReload = false;

    return config;
  },
};
```



3、修改package.json

```json
"scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-app-rewired eject"
},
```



## vue项目

### 步骤一

主页面配置



### 步骤二

**子应用**：在src目录下添加`public-path.js`文件，并写入，同时在index.js 下引入

```js
if (window.__POWERED_BY_QIANKUN__) {
    __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```

修改package.json文件

```json
"eslintConfig": {
    "extends": [
        "react-app",
        "react-app/jest"
    ],
    "globals": {
        "__webpack_public_path__": true
    }
},
```



### 步骤三

**子应用**：在index.js文件中添加添加限制与生命周期

```js
// 原来的index.js
import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
```

```js
// 选择的index.js【还有其他的路由什么的看官网】
import Vue from 'vue'
import App from './App.vue'
import './public-path.js'
Vue.config.productionTip = false


let instance = null;
function render(props = {}) {
  const { container } = props;

  instance = new Vue({
    render: (h) => h(App),
  }).$mount(container ? container.querySelector('#app') : '#app');
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap() {
  console.log('[vue] vue app bootstraped');
}
export async function mount(props) {
  console.log('[vue] props from main framework', props);
  render(props);
}
export async function unmount() {
  instance.$destroy();
  instance.$el.innerHTML = '';
  instance = null;
}

```





### 步骤四

**子页面**：`vue.config.js`

```js
const { name } = require('./package');
module.exports = {
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  configureWebpack: {
    output: {
      library: `${name}-[name]`,
      libraryTarget: 'umd', // 把微应用打包成 umd 库格式
      chunkLoadingGlobal: `webpackJsonp_${name}`,
    },
  },
};
```



## 常见问题

### `__webpack_public_path__ `is not defined

qiankun配置子应用后报‘__webpack_public_path__‘ is not defined

是 eslint 的问题， **webpack_public_path** 不是全局变量所导致的

在 **子应用 package.json 文件中 eslintConfig 配置全局变量**后 重起服务 解决

```json
 "eslintConfig": {
    ...,
    "globals": {
      "__webpack_public_path__": true
    }
}
```



### jsonpFunction

#### 详细错误信息

```
// 报错信息
ValidationError: Invalid configuration object. Webpack has been initialized using a configuration object that does not match the API schema.
         - configuration.output has an unknown property 'jsonpFunction'. These properties are valid:
           object { assetModuleFilename?, auxiliaryComment?, charset?, chunkFilename?, chunkFormat?, chunkLoadTimeout?, chunkLoading?, chunkLoadingGlobal?, clean?, compareBeforeEmit?, crossOriginLoading?, devtoolFallbackModuleFilenameTemplate?, devtoolModuleFilenameTemplate?, devtoolNamespace?, enabledChunkLoadingTypes?, enabledLibraryTypes?, enabledWasmLoadingTypes?, environment?, filename?, globalObject?, hashDigest?, hashDigestLength?, hashFunction?, hashSalt?, hotUpdateChunkFilename?, hotUpdateGlobal?, hotUpdateMainFilename?, iife?, importFunctionName?, importMetaName?, library?, libraryExport?, libraryTarget?, module?, path?, pathinfo?, publicPath?, scriptType?, sourceMapFilename?, sourcePrefix?, strictModuleErrorHandling?, strictModuleExceptionHandling?, trustedTypes?, umdNamedDefine?, uniqueName?, wasmLoading?, webassemblyModuleFilename?, workerChunkLoading?, workerWasmLoading? }
           -> Options affecting the output of the compilation. `output` options tell webpack how to write the compiled files to disk.
           Did you mean output.chunkLoadingGlobal (BREAKING CHANGE since webpack 5)?
```



#### 问题分析

主要是该段代码导致的

```
output: {
        // 该值需要与主项目中注册时的name值相对应
            library: `${packageName}`,
            libraryTarget: 'umd',
            jsonpFunction: `webpackJsonp_${packageName}`
        }
```

该问题主要是微应用导出时jsonpFunction的设置值导致的，该值随着webpack5的升级没有该属性了，改为 chunkLoadingGlobal



#### 解决方案

将 **jsonpFunction** 配置修改为 **chunkLoadingGlobal**























