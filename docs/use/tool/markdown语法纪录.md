---
id: markdown
slug: /tool/markdown
title: markdown语法纪录
date: 2002-09-26
authors: 鲸落
tags: [tool, markdown]
keywords: [tool, markdown]
---

[Markdown 官方教程](https://markdown.com.cn/) 
## 基本语法

### 标题

标题就不展示了

```markdown
# H1
## H2
### H3
```



### 粗体

**text**     `**text**`



### 有序列表

1. First item
2. Second item
3. Third item

```markdown
1. First item
2. Second item
3. Third item
```



### 无序列表

- First item
- Second item
- Third item

```markdown
- First item
- Second item
- Third item
```



### 引用块

> blockquote
>
> blockquote

```markdown
> blockquote
> blockquote
```



### 代码

`c`  ' `` '



### 代码块

````js
```js

```
````



### 分割线

---

`---`



### 链接

[Markdown 官方教程](https://markdown.com.cn/)    `[Markdown 官方教程](https://markdown.com.cn/)`



### 图片

![这里就不展示图片了](http://www.xiaojunnan.cn)

`![logo](http://www.xiaojunnan.cn/img/logo.webp)`



### 删除线

~~The world is flat.~~   `~~The world is flat.~~ `



## 拓展语法

### 表格

|  Syntax   | Description |
| :-------: | :---------: |
|  Header   |    Title    |
| Paragraph |    Text     |

```markdown
| Syntax      | Description |
| ----------- | ----------- |
| Header      | Title       |
| Paragraph   | Text        |
```



### 任务列表

- [x] Write the press release
- [ ] Update the website
- [ ] Contact the media

```markdown
- [x] Write the press release
- [ ] Update the website
- [ ] Contact the media
```



### 表情

:blush:     其他表情参照这个地址：[github markdown emoji](https://gist.github.com/rxaviers/7360908)



## 其他

:::success 成功
:::

:::info 补充
:::

:::note 备注
:::

:::caution 警告
:::

:::danger 危险
:::

```markdown
成功、补充等字可以修改

:::success 成功
:::

:::info 补充
:::

:::note 备注
:::

:::caution 警告
:::

:::danger 危险
:::
```