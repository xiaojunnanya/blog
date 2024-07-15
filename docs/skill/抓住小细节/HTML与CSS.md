---
id: detailhtmlcss
slug: /detailhtmlcss
title: HTML与CSS
date: 2002-09-26
authors: 鲸落
tags: [抓住小细节]
keywords: [抓住小细节]
---

## HTML

### src和href的区别

- src用于替换当前元素，href 用于在当前文档和引用资源之间确立联系。



### HTML语义化的理解

- 语义化是指根据内容的结构化(内容语义化)，选择合适的标签（代码语义化)。通俗来讲就是用正确的标签做正确的事情。

- 语义化的优点如下:

  - 对机器友好，带有语义的文字表现力丰富，更适合搜索引擎的爬虫爬取有效信息，有利于SEO。除此之外，语义类还支持读屏软件，根据文章可以自动生成目录;

  - 对开发者友好，使用语义类标签增强了可读性，结构更加清晰，开发者能清晰的看出网页的结构，便于团队的开发与维护。


常见的语义化标签：

```html
<header></header>  头部
<nav></nav>  导航栏
<section></section>  区块（有语义化的div）
<main></main>  主要区域
<article></article>  主要内容
<aside></aside>  侧边栏
<footer></footer>  底部
```



### js defer和async的区别

defer与async的区别是：前者要等到整个页面正常渲染结束，才会执行；后者一旦下载完，渲染引擎就会中断渲染，执行这个脚本以后，再继续渲染。defer是“渲染完再执行”，async是“下载完就执行”。另外，如果有多个defer脚本，会按照它们在页面出现的顺序加载，而多个async脚本是不能保证加载顺序的。



### 行内元素有哪些?块级元素有哪些?空(void)元素有那些

- 行内元素有:a b span img input select strong 
- 块级元素有:div ul ol li dl dt dd h1 h2 h3 h4 h5 h6 p
- 空元素，即没有内容的HTML元素。空元素是在开始标签中关闭的，也就是空元素没有闭合标签。常见的有：`<br>、<hr> 、<img>、<input> 、<link>`



### title与h1的区别、b与strong的区别、i与em的区别?

- strong标签有语义，是起到加重语气的效果，而b标签是没有的， b标签只是一个简单加粗标签。b标签之间的字符都设为粗体，strong标签加强字符的语气都是通过粗体来实现的，而搜索引擎更侧重strong标签。
- title属性没有明确意义只表示是个标题，H1则表示层次明确的标题，对页面信息的抓取有很大的影响
- i内容展示为斜体，em表示强调的文本



### 页面导入样式时，使用link和@import有什么区别？

- 区别一：link兼容性比@import好
- 区别二：link会异步加载css，而@import会在页面加载完成后才开始加载，会出现页面初始无样式也就是白屏问题。



### iframe有哪些优缺点

- 优点：

  - 用来加载速度较慢的内容（如广告）

  - 可以使脚本可以并行下载

  - 可以实现跨子域通信


- 缺点：

  - iframe 会阻塞主页面的 onload 事件

  - 无法被一些搜索引擎索识别

  - 会产生很多页面，不容易管理




### img是行内元素为什么可以设置宽高

因为img、input等行内元素他是一个可替换元素，他的展示效果不受css来控制的，浏览器会根据元素的标签和属性，来决定可替换元素的具体显示内容



### head标签有什么作用，其中什么标签必不可少?

- head标签用于定义文档的头部，它是所有头部元素的容器。`<head>`中的元素可以引用脚本、指示浏览器在哪里找到样式表、提供元信息等。
- 文档的头部描述了文档的各种属性和信息，包括文档的标题、在Web中的位置以及和其他文档的关系等。绝大多数文档头部包含的数据都不会真正作为内容显示给读者。
- 下面这些标签可用在head部分: `<base>，<link>,<meta>, <script>,<style>, <title>`。
- 其中`<title>`定义文档的标题，它是head部分中唯一必需的元素。



## CSS

### 选择器优先级

优先级比较：!important > 内联样式 > id > class = 属性 = 伪类 > 标签 = 伪元素 > 通配 = 子、后代选择器

​						10k                  1k            100           10                             1                           0



### 伪元素和伪类

- 伪类
  - :th-child/first-child
  - `元素:nth-of-type()`：只计算符合前面元素类型的元素
  - :hover/:focus等

- 伪元素
  - ::before和::after
  - ::first-line（了解）：可以针对**首行文本**设置属性
  - ::first-letter（了解）：可以针对**首字母/首字**设置属性



### CSS选择符有哪些？哪些属性可以继承？

```
CSS选择符：
    通配（*）
    id选择器（#）
    类选择器（.）
    标签选择器（div、p、h1...）
    相邻选择器(+)
    后代选择器(ul li)
    子元素选择器（ > ）
    属性选择器(a[href])
    
CSS属性哪些可以继承：
		文字系列：font-size、color、line-height、text-align...
***不可继承属性：border、padding、margin...
```



### display有哪些值？说明他们的作用。

- none     			隐藏元素
- block    			把某某元素转换成块元素
- inline   			把某某元素转换成内联元素
- inline-block 	    把某某元素转换成行内块元素



### 元素隐藏方式

- 方法一：`display:none;`
  - 元素不显示出来，并且也不占据位置，不占据任何空间(和不存在一样)
- 方法二：`visibility:hidden;`
  - 设置为hidden，虽然元素不可见，但是会占据元素应该占据的空间
  - 默认为visible，元素是可见的
- 方法三：rgba设置颜色，将a的值设置为0
  - rgba的a设置的是alpha值，可以设置透明度，不影响子元素
- 方法四：opacity设置透明度，设置为0
  - 设置整个元素的透明度，会影响子元素



###  link和@import的区别

两者都是外部引用CSS的方式，它们的区别如下：

- link是XHTML标签，除了加载CSS外，还可以定义RSS等其他事务；@import属于CSS范畴，只能加载CSS。
- link引用CSS时，在页面载入时同时加载；@import需要页面网页完全载入以后加载。
- link是XHTML标签，无兼容问题；@import是在CSS2.1提出的，低版本的浏览器不支持。
- link支持使用Javascript控制DOM去改变样式；而@import不支持。



### transition和animation的区别

- transition是过渡属性，强调过度，它的实现需要触发一个事件（比如鼠标移动上去，焦点，点击等）才执行动画。它类似于flash的补间动画，设置一个开始关键帧，一个结束关键帧。
- animation是动画属性，它的实现不需要触发事件，设定好时间之后可以自己执行，且可以循环一个动画。它也类似于flash的补间动画，但是它可以设置多个关键帧（用@keyframe定义）完成动画。



### display: none;与visibility: hidden;的区别

- display: none; 				是不占用位置的，非继承属性
- visibility: hidden;   虽然隐藏了，但是占用位置，继承属性



### 盒子模型的转换

- CSS的盒子模型有哪些：标准盒子模型、IE盒子模型
- CSS的盒子模型区别：
  - 标准盒子模型：margin、border、padding、content
  - IE盒子模型 ：margin、content（ border +  padding  + content ）
- 通过CSS如何转换盒子模型：
  - box-sizing: content-box;	/*标准盒子模型*/
  - box-sizing: border-box;	  /*IE盒子模型*/



### li 与 li 之间有看不见的空白间隔是什么原因引起的？如何解决？

- 浏览器会把inline内联元素间的空白字符（空格、换行、Tab等）渲染成一个空格。为了美观，通常是一个`<li>`放在一行，这导致`<li>`换行后产生换行字符，它变成一个空格，占用了一个字符的宽度。



- 解决办法：
  - 为`<li>`设置float:left。不足：有些容器是不能设置浮动，如左右切换的焦点图等。
  - 将所有`<li>`写在同一行。不足：代码不美观。
  - 将`<ul>`内的字符尺寸直接设为0，即font-size:0。不足：`<ul>`中的其他字符尺寸也被设为0，需要额外重新设定其他字符尺寸，且在Safari浏览器依然会出现空白间隔。
  - 消除`<ul>`的字符间隔letter-spacing:-8px，不足：这也设置了`<li>`内的字符间隔，因此需要将`<li>`内的字符间隔设为默认letter-spacing:normal。



### CSS精灵图

- 是什么：把多个小图标合并成一张大图片。
- 优缺点

  - 优点：减少了http请求的次数，提升了性能。

  - 缺点：维护比较差（例如图片位置进行修改或者内容宽高修改）



### line-height和heigh区别

- line-height指一行文本的高度，包含了字间距，实际上是下一行基线到上一行基线距离
- 如果一个标签没有定义height属性，那么其最终表现的高度由line-height 决定
- height就是盒子的高度



### opacity 和 rgba区别

- 共同性：实现透明效果
  - opacity 取值范围0到1之间，0表示完全透明，1表示不透明
  - rgba   R表示红色，G表示绿色，B表示蓝色，取值可以在正整数或者百分数。A表示透明度取值0到1之间

- 区别：继承的区别：opacity会继承父元素的opacity属性，而RGBA设置的元素的后代元素不会继承不透明属性。



### 清除浮动的方式

- 触发BFC：overflow:auto

- 多创建一个盒子，添加样式：clear: both;

- after方式 ul:after或li:before
  ```
  ul:after{
  
    		content: '';
    		display: block;
    		clear: both;
  
    }
  ```

  



### em和rem区别

- rem单位是相对于html元素的font-size来设置的
- em 根据使用它的元素的大小决定（很多人错误以为是根据父类元素，实际上是使用它的元素继承了父类的属性才会产生的错觉）



### 两栏布局

一般两栏布局指的是左边一栏宽度固定，右边一栏宽度自适应，两栏布局的具体实现:

- 利用浮动，将左边元素宽度设置为200px，并且设置向左浮动。将右边元素的margin-left设置为200px，宽度设置为auto (默认为auto，撑满整个父元素)
- **利用flex布局，将左边元素设置为固定宽度200px，将右边的元素设置为flex:1**



### 三栏布局

三栏布局一般指的是页面中一共有三栏，左右两栏宽度固定，中间自适应的布局，三栏布局的具体实现:

- 利用绝对定位，左右两栏设置为绝对定位，中间设置对应方向大小的margin的值。
- **利用flex布局，左右两栏设置固定大小，中间一栏设置为flex:1**



### 移动端适配

- 方案一：百分比设置【因为不同属性的百分比值，相对的可能是不同参照物，所以百分比往往很难统一，所以百分比在移动端适配中使用是非常少的】
- 方案二：rem单位+动态html的font-size
- 方案三：vw单位
- 方案四：flex的弹性布局



### flex

- flex-direction：用来改变主轴的方向
- flex-wrap：如果一条轴线排不下，怎么办
- flex-flow：是flex-direction属性和flex-wrap属性的简写形式
- justify-content：定义了项目在主轴上的对齐方式
- align-items：定义项目在交叉轴上如何对齐
- align-content：用于控制多行项目的对齐方式，如果项目只有一行则不会起作用



### BFC的理解

- BFC就是页面上一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。他的原则是如果一个元素具有BFC，那么内部元素再怎么弄，都不会影响到外面的元素。

- 如何触发BFC

  - float的值非none

  - overflow的值非visible

  - display的值为：inline-block、flex

  - position的值为:absoute、fixed
  
  - 根元素(`<html>`)




MDN上有整理出在哪些具体的情况下会创建BFC：

- 根元素(`<html>`)
- 浮动元素(元素的float不是none)
- 绝对定位元素（元素的position为 absolute或 fixed)和行内块元素(元素的display 为 inline-block)
- 表格单元格(元素的display 为table-cell，HTML表格单元格默认为该值)，表格标题(元素的display 为 table-caption，HTML表格标题默认为该值)
- 匿名表格单元格元素(元素的display 为 table、table-row、table-row-group、table-header-group、table-footer-group(分别是HTML table、row、tbody、thead、tfoot的默认属性)或inline-table)
- overflow计算值(Computed)不为 visible的块元素
- 弹性元素(display为flex或 inline-flex元素的直接子元素)
- 网格元素(display为grid 或 inline-grid元素的直接子元素)
- display值为flow-root的元素



### css画三角形

```js
<style>
    .box{
        width: 100px;
        height: 100px;
        border: 100px solid red;
        box-sizing: border-box;
        border-top-color: transparent;
        border-left-color: transparent;
        border-right-color: transparent;
    }
</style>


<div class="box"></div>
```



### CSS实现固定宽高比

- padding：相对于父元素的宽度，用padding-top撑开
- aspect-ratio：2/1（长宽2:1）
