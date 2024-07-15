---
id: gitee
slug: /tool/gitee
title: gitee的使用
date: 2002-09-26
authors: 鲸落
tags: [tool, gitee]
keywords: [tool, gitee]
----

在工作中，对于远程仓库的使用是特别重要的，国外的github在访问的时候速度是比较慢的，接下来我为大家带来国内的gitee的使用的保姆式教程

## 1. 准备工作
>* 在电脑上安装 [git](https://git-scm.com/downloads) 与 [node](https://nodejs.org/zh-cn/download/)
>* 准备[gitee](https://gitee.com/)账号,并在设置中填写相关的账号信息

## 2. 绑定SSH公钥
>* 在安装完git之后，在桌面鼠标右击打开Git Bash Here
>* 输入命令,完成与github的信息绑定(输入后回车进行下一行命令)
> ``` bash
> git config --global user.name "你的gitee用户名"
> ```
> ``` bash
> git config --global user.email "你的gitee注册邮箱"
> ```
>* 输入`ssh-keygen -t rsa -C "你的GitHub注册邮箱"`,生成ssh密钥文件(直接三个回车即可，默认不需要设置密码)
>* 找到刚刚生成的.ssh的文件夹，点击进入文件夹，用记事本打开id_rsa.pub文件，即为密钥，将内容全部复制
>* 你可以将你的gitee的账号与github的账号进行绑定，这样SSH公钥在gitee与github中可以一起使用



## 3. gitee中创建仓库并与本地文件夹进行绑定
>* 绑定仓库之中，点击 克隆/下载 复制链接
>* 在本地创建文件夹之后，在改文件夹中鼠标右击打开Git Bash Here
>* 输入命令,将项目的内容克隆下来，完成与gitee中你刚刚创建的仓库绑定
>* 若将克隆下来的项目复制到别的文件夹中，别的文件夹也与该仓库进行了绑定
>* 进行相关项目的书写....(也可以在你项目写好之后，再与仓库进行绑定)

## 4. 将项目上传到gitee中
>* 按顺序进行下面的命令，其实备注信息是必须要填写的
>* 第一步命令是将项目上传至缓存区，第二步命令是将缓存区的项目上传是至本地仓库中，第三步命令是将本地仓库的项目上传至gitee仓库中
> ```
> git add .
> git commit -m '备注信息'
> git push
> ```
> 随后刷新你的gitee仓库即可查看到项目上传成功
> 在下次使用的时候还是运行上述命令即可

## 补充

>* 在根目录中，.gitignore文件可以配置过滤资源，即用来设置哪些文件不会被上传
>* 常用的设置：
    - /index/:表示过滤掉index这个文件夹
    - .html,.vue:表示过滤掉这种类型的文件
    - /index/hello.html：表示过滤掉某个文件下具体文件
    - !.c , !/dir/subdir/  :!开头表示不过滤