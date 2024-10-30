---
id: hexo
slug: /other/hexo
title: Hexo+github搭建个人博客
date: 2002-09-26
authors: 鲸落
tags: [tool, Hexo]
keywords: [tool, Hexo]
---


欢迎来到我的博客。对于一名大学生来说，拥有自己的博客不论是在考研复试中还是找工作面试中，都是一个加分项，接下来我将详细步骤写下来，大家安装我的步骤操作即可

## 1. 准备工作
>* 在电脑上安装 [git](https://git-scm.com/downloads) 与 [node](https://nodejs.org/zh-cn/download/)
>* 准备[github](www.github.com)账号

## 2. Git部分
>* 在安装完git之后，在桌面鼠标右击打开Git Bash Here
>* 输入命令,完成与github的信息绑定(输入后回车进行下一行命令)
> ``` bash
> git config --global user.name "你的GitHub用户名"
> ```
> ``` bash
> git config --global user.email "你的GitHub注册邮箱"
> ```
>* 输入`ssh-keygen -t rsa -C "你的GitHub注册邮箱"`,生成ssh密钥文件(直接三个回车即可，默认不需要设置密码)
>* 找到刚刚生成的.ssh的文件夹，点击进入文件夹，用记事本打开id_rsa.pub文件，即为密钥，将内容全部复制

<!--more-->

## 3. Github部分
>* 在github中创建一个仓库，必须命名为：用户名.github.io  (用户名为你github账号用户名)
>* 点击个人主页图像 找到Setting，点击进入
>* 在左侧部分找到SSH and GPG keys，点击进入
>* 在SSH Keys一行点击New SSH Key进行创建
>* Title名字可以随便起，key部分则将刚刚复制的密钥粘贴上去
>* 最后在Git Bash Here中检测一下GitHub密钥设置是否成功，输入`ssh git@github.com` ，若出现successfully单词，即为成功

## 4. node部分
>* 在github中创建一个仓库，必须命名为：用户名.github.io  (用户名为你github账号用户名)
>* 在电脑本地磁盘中新建一个文件夹，专门用来放置我们的博客相关文件
>* 在该文件夹中cmd，安装Hexo，输入 `npm install -g hexo-cli`
>* 然后输入`hexo init blog`，初始化我们的博客，这时候创建的blog里则为配置的文件
>* 然后按顺序输入以下命令，就可以打开localhost:4000看到我们的博客了
> ``` bash
> cd blog
> hexo g
> hexo s
> ```
>* 出现的则是hexo为我们设置的默认主题，可以打开我们的编译器进行修改，编译器我推荐 [Visual Studio Code](https://code.visualstudio.com/)
>* 也可以跟换主题，在[hexo官网主题](https://hexo.io/themes/)中选择我们喜欢的主题，安装主题创作者给予的步骤进行跟换(温馨提示：更换主题前要保持良好的心态，否则怕你把持不住)
>* 注意：在你运行 hexo s，在运行终端命令是会报错，发现提示错误信息"无法加载文件 C:\Users\10186\AppData\Roaming\npm\hexo.ps1，因为在此系统上禁止运行脚本。解决方法如下：
> ``` bash
> 按下win+s输入powershell。然后右键以管理员身份运行。
> 然后输入 `set-ExecutionPolicy RemoteSigned` 命令，
> 输入y，执行回车。
> 再次运行。
> 成功！
> ```

## 5. 将我们的博客推送至github
>* blog根目录中_config.yml文件为站点配置文件，用vscode打开，到最底部进行必要的配置
>* 寻找到有关deploy的部分
>* 正确写法：
> ``` bash
> deploy:
>    type: git
>    repository: git@github.com:自己仓库的名字/自己仓库的名字.github.io.git
>    branch: master
> ```
>* 错误写法：
> ``` bash
> deploy:
>    type: git
>    repository: https://github.com/自己仓库的名字/自己仓库的名字.github.io.git
>    branch: master
> ```
>* 后面一种写法是hexo2.x的写法，现在已经不行了,要选择github中ssh的连接
>* 最后我们安装一个插件
> ``` bash
> npm install hexo-deployer-git --save
> ```
>* 然后按顺序输入以下命令：
> ``` bash
> hexo clean
> hexo g
> hexo d
> ```
>* 完成后打开浏览器，输入 你的用户名.github.io 即可查看你的博客啦

## 6. 修改博客
>* 在vscode中更改，更改可以在本地边预览边更改
>* 然后按顺序输入以下命令：
> ``` bash
> hexo g
> hexo d
> ```
>* 即可在github上更新，因为网速的问题，过一会即可在你自己的网址上查看到更新

## 补充

  hexo常用命令
> ``` bash
> hexo init [命名] #初始化本地hexo文件
> hexo s #开启预览访问端口（默认端口4000，'ctrl + c'关闭server）
> hexo s -p 5000 #设置打开的端口号
> hexo clean #清除缓存  网页正常情况下可以忽略此条命令
> hexo g #生成静态页面至public目录,将你的博客打包
> hexo d #部署到GitHub
> ```

  绑定自己的域名
>* 先实名认证，然后买域名(推荐[阿里云](https://wanwang.aliyun.com/domain/))，等待域名认证，
>* 认证成功后，解析域名，按照以下的例子进行配置
| 主机记录 | 记录类型 | 解析线路(isp) | 记录值 | TTL |
| :-: | :-: | :-: | :-: | :-: |
| @ | CNAME | 默认 | github用户名.github.io | 10分钟 |
| www | CNAME | 默认 | github用户名.github.io | 10分钟 |
>* 之后我们前往github仓库中，在你的仓库中创建一个名字为CNAME的文件，里面写入购买的域名，点击仓库的setting，往下翻，找到GitHub Pages,点击Check it out here , github会进行自动验证，验证完即可使用自己的域名看到自己的博客啦