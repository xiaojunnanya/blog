---
slug: /codespecification
title: 配置React+TS代码规范
date: 2024-10-21
authors: jl
tags: [知识点, 代码规范 ]
keywords: [知识点, 代码规范 ]
---



## 前言

在前端项目工程日益复杂的今天，一套完善的开发环境配置可以极大的提升开发效率，提高代码质量，方便多人合作，以及后期的项目迭代和维护，项目规范分项目**目录结构规范**，**代码格式规范**和**git提交规范**，本文主要讲后两种。



## 代码规范技术栈

### 代码格式规范和语法检测

1. `vscode`：统一前端编辑器。
2. `editorconfig`: 统一团队vscode编辑器默认配置。
3. `prettier`: 保存文件自动格式化代码。
4. `eslint`: 检测代码语法规范和错误。
5. `lint-staged`: 只检测暂存区文件代码，优化eslint检测速度。



### 代码git提交规范

1. `husky`:可以监听git执行，在对应hook执行阶段做一些处理的操作。
2. `pre-commit`：githooks之一， 在commit提交前使用tsc和eslint对语法进行检测。
3. `commit-msg`：githooks之一，在commit提交前对commit备注信息进行检测。
4. `commitlint`：在githooks的pre-commit阶段对commit备注信息进行检测。
5. `commitizen`：git的规范化提交工具，辅助填写commit信息。



## editorconfig统一编辑器配置

由于每个人的**vsocde**编辑器默认配置可能不一样，比如有的默认缩进是**4**个空格，有的是**2**个空格，如果自己编辑器和项目代码缩进不一样，会给开发和项目代码规范带来一定影响，所以需要在项目中为编辑器配置下格式。



### 安装vscode插件EditorConfig

打开**vsocde**插件商店，搜索**EditorConfig for VS Code**，然后进行安装



### 添加.editorconfig配置文件

安装插件后，在根目录新增 **.editorconfig**配置文件:

```
# https://editorconfig.org
root = true # 控制配置文件 .editorconfig 是否生效的字段

[**] # 匹配全部文件
indent_style = space # 缩进风格，可选space｜tab
indent_size = 2 # 缩进的空格数
charset = utf-8 # 设置字符集
trim_trailing_whitespace = true # 删除一行中的前后空格
insert_final_newline = true # 设为true表示使文件以一个空白行结尾
end_of_line = lf

[**.md] # 匹配md文件
trim_trailing_whitespace = false
```



上面的配置可以规范本项目中文件的缩进风格，和缩进空格数等，会覆盖**vscode**的配置，来达到不同编辑器中代码默认行为一致的作用。



## prettier自动格式化代码

每个人写代码的风格习惯不一样，比如代码换行，结尾是否带分号，单双引号，缩进等，而且不能只靠口头规范来约束，项目紧急的时候可能会不太注意代码格式，这时候需要有工具来帮我们自动格式化代码，而**prettier**就是帮我们做这件事的。



### 安装vscode插件Prettier

打开**vsocde**插件商店，搜索**Prettier - Code formatter**，然后进行安装。



### 添加.prettierrc.js配置文件

安装插件后，在根目录新增 **.prettierrc.js**配置文件，配置内容如下：

```js
module.exports = {
  printWidth: 80, // 一行的字符数，如果超过会进行换行
  tabWidth: 2, // 一个tab代表几个空格数，默认就是2
  singleQuote: true, // 字符串是否使用单引号
  trailingComma: 'all', // 对象或数组末尾是否添加逗号 none| es5| all
  bracketSpacing: true, // 对象大括号直接是否有空格，默认为true，效果：{ foo: bar }
  arrowParens: 'avoid', // 箭头函数如果只有一个参数则省略括号
  semi: false, // 行尾是否使用分号，默认为true
};
```

各个字段配置就是后面注释中的说明



### 添加.vscode/settings.json

配置前两步后，虽然已经配置**prettier**格式化规则，但还需要让**vscode**来支持保存后触发格式化

在项目根目录新建 **.vscode**文件夹，内部新建**settings.json**文件配置文件，内容如下：

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
}
```

这一步配置完成后，修改项目代码，把格式打乱，点击保存时就会看到编辑器自动把代码格式规范化了。



## eslint+lint-staged检测代码

### 安装vscode插件ESLint

打开**vsocde**插件商店，搜索**ESLint**，然后进行安装。



### 安装eslint依赖

`npm i eslint -D`



### 配置.eslintrc.js文件

安装**eslint**后，执行`npm init @eslint/config`，选择自己需要的配置

选择完成后会在根目录下生成 **.eslint.js**文件



### 添加eslint语法检测脚本

有些**eslint**报错和警告都是我们用眼睛看到的，有时候需要通过脚本执行能检测出来，在**package.json**的**scripts**中新增

`"eslint": "eslint src/**/*.{ts,tsx}"`

代表检测**src**目录下以**.ts**,**.tsx**为后缀的文件



### 使用lint-staged优化eslint检测速度

上面配置的**eslin**t会检测**src**文件下所有的 **.ts**, **.tsx**文件，虽然功能可以实现，但是当项目文件多的时候，检测的文件会很多，需要的时间也会越来越长，但其实只需要检测提交到暂存区，就是**git add**添加的文件，不在暂存区的文件不用再次检测，而**lint-staged**就是来帮我们做这件事情的。

安装依赖：`npm i lint-staged@12.5.0 -D`

在**package.json**添加**lint-staged**配置

```
"lint-staged": {
  "src/**/*.{ts,tsx}": [
    "npm run eslint"
  ]
},
"eslint": "eslint"
```

因为要检测**git**暂存区代码，所以需要执行`git init`初始化一下git，初始化完成后就可以进行测试了，先提交一下文件，执行`npx lint-staged`



### 使用tsc检测类型和报错

在项目中使用了**ts**,但一些类型问题，现在配置的**eslint**是检测不出来的，需要使用**ts**提供的**tsc**工具进行检测,如：

在**main.tsx**定义了函数**say**,参数**name**是**string**类型，当调用传**number**类型参数时，页面有了明显的**ts**报错，但此时提交**main.tsx**文件到暂存区后执行**npx lint-staged**

发现没有检测到报错，所以需要配置下**tsc**来检测类型，在**package.json**添加脚本命令

`"pre-check": "tsc && npx lint-staged"`



## git提交时检测语法规范

为了避免把不规范的代码提交到远程仓库，一般会在**git**提交代码时对代码语法进行检测，只有检测通过时才能被提交，**git**提供了一系列的githooks ，而我们需要其中的**pre-commit**钩子，它会在**git commit**把代码提交到本地仓库之前执行，可以在这个阶段检测代码，如果检测不通过就退出命令行进程停止**commit**。



### 代码提交前husky检测语法

而**husky**就是可以监听**githooks**的工具，可以借助它来完成这件事情。

安装husky：`npm i husky -D`



### 配置husky的pre-commit钩子

生成 **.husky**配置文件夹（如果项目中没有初始化**git**,需要先执行`git init`）

`npx husky init`

会在项目根目录生成 **.husky**文件夹，生成文件成功后，需要让**husky**支持监听**pre-commit**钩子，监听到后执行上面定义的**npm run pre-check**语法检测。

在`.husky`下创建`pre-commit`，添加

```
#!/usr/bin/env sh
. "$(dirname "$0")/_/husky.sh"

npm run pre-check
```



## 代码提交时检测commit备注规范

在提交代码时，良好的提交备注会方便多人开发时其他人理解本次提交修改的大致内容，也方便后面维护迭代，但每个人习惯都不一样，需要用工具来做下限制，在**git**提供的一系列的githooks中，**commit-msg**会在**git commit**之前执行，并获取到**git commit**的备注，可以通过这个钩子来验证备注是否合理，而验证是否合理肯定需要先定义一套规范，而commitlint就是用来做这件事情的，它会预先定义一套规范，然后验证**git commit**的备注是否符合定义的规范。



### 安装和配置commitlint

安装**commitlint**：`npm i @commitlint/config-conventional @commitlint/cli -D`

在根目录创建**commitlint.config.js**文件,添加配置如下

```js
module.exports = {
  // 继承的规则
  extends: ['@commitlint/config-conventional'],
  // 定义规则类型
  rules: {
    // type 类型定义，表示 git 提交的 type 必须在以下类型范围内
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能 feature
        'fix', // 修复 bug
        'docs', // 文档注释
        'style', // 代码格式(不影响代码运行的变动)
        'refactor', // 重构(既不增加新功能，也不是修复bug)
        'perf', // 性能优化
        'test', // 增加测试
        'chore', // 构建过程或辅助工具的变动
        'revert', // 回退
        'ci', //持续集成变更
        'build', // 打包
      ],
    ],
    // subject 大小写不做校验
    'subject-case': [0],
  },
}
```



### 配置husky监听commit-msg

上面已经安装了**husky**,现在需要再配置下**husky**，让**husky**支持监听**commit-msg**钩子，在钩子函数中使用**commitlint**来验证

在`.husky`下创建`commit-msg`，添加

```
#!/usr/bin/env sh
. "$(dirname "$0")/_/husky.sh"

npx --no-install commitlint --edit "$1"
```





## 参考链接

[【前端工程化】配置React+ts企业级代码规范及样式格式和git提交规范](https://juejin.cn/post/7101596844181962788)



















