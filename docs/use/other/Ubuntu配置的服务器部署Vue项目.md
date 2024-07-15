---
id: ubuntusetvue
slug: /other/ubuntusetvue
title: Ubuntu配置的服务器部署Vue项目
date: 2002-09-26
authors: 鲸落
tags: [tool, Ubuntu]
keywords: [tool, Ubuntu]
---


欢迎来到我的博客。对于一名大学生来说，拥有自己的服务器不论是在考研复试中还是找工作面试中，都是一个加分项，当你购买一个服务器的时候，还需要做一些配置才可以使用他，下面我将带来Ubuntu配置的服务器部署Vue项目的操作步骤。

## 1. 准备工作
>* 购买服务器，这里推荐[阿里云服务器](https://www.aliyun.com/?spm=5176.25353603.J_8058803260.15.a602406075Gl9T)
>* 准备vue项目,提前将vue文件运行`npm run build`,之后将使用dist文件
>* 进入[Xshell与Xftp](https://www.netsarang.com/zh/xshell/)官网,选择个人免费版本下载即可

## 2. 服务器部分
>* 购买完服务器之后，进入控制台，直接搜索云服务器ECS，即可查看你的服务器，点击进入，公网IP即为你服务器的访问地址，主私网IP为局域网访问地址。
>* 在右上方选择重置密码，重置密码之后要记住密码，不要忘记了。
>* 点击安全组，配置规则，选择手动添加，添加一个端口为80端口，其他的默认保存即可。
| 优先级 | 协议类型 | 宽口范围 | 授权对象 | 描述 |
| :-: | :-: | :-: | :-: | :-: |
| 允许 | 1 | 自定义 TCP | 目的80 | 源0.0.0.0/0 |

<!--more-->

## 3. Xshell部分
>* 先打开Xshell,点击新建，名称选择你自己想起的名字，主机为之前查看到公网IP，其他的不管，点击链接。
>* 然后开始配置环境。
>* 先安装nginx：
> ``` bash 
> sudo apt-get update
> sudo apt-get install nginx
> ```


## 4. Xftp部分
>* 打开Xftp,在根目录下找到home文件夹，进入，新建一个文件夹，在该文件夹下放入dist文件。
>* 之后进入`/etc/nginx/sites-enabled/default`目录下，打开default文件
>* 修改前：
> ``` bash 
> #server {
> #       listen 80;
> #       listen [::]:80;
> #
> #       server_name example.com;
> #
> #       root /var/www/example.com;
> #       index index.html;
> #
> #       location / {
> #               try_files $uri $uri/ =404;
> #       }
> #}
> ```
>* 修改为：
> ```bash
> server {
>     listen 80;
>     listen [::]:80;
> 
>     server_name 127.0.0.1;  # 服务器主私网IP地址
> 
>     root /data/blog/backend/dist;  # 打包后的dist目录
>     index index.html;
> 
>     location / {
>             try_files $uri $uri/ @router; # 指向下面的 @router否则会出现 404
>     }
> 
>     # 对应上面的 @router,主要Vue请求并不是真实路径，无法找到文件，需要重定向到 index.html 中，然后交给路由处理
>     location @router {
>             rewrite ^.*$ /index.html last;
>     }
> }
> ```
>* 之后`nginx -s reload`即可。


## 补充
> ## 1. 域名添加新端口(以5000端口为例)
>* 根据上面的第二部分，安全组，配置规则，选择手动添加，添加一个端口为80端口，其他的默认保存即可。
| 优先级 | 协议类型 | 宽口范围 | 授权对象 | 描述 |
| :-: | :-: | :-: | :-: | :-: |
| 允许 | 1 | 自定义 TCP | 目的5000 | 源0.0.0.0/0 |
>* 打开Xftp，进入`/etc/nginx/sites-enabled/default`目录下，打开default文件
>* 复制之前的80端口代码：
> ```bash
> server {
>     listen 80;
>     listen [::]:80;
> 
>     server_name 127.0.0.1;  # 服务器主私网IP地址
> 
>     root /home/home/myself/dist;  # 打包后的dist目录
>     index index.html;
> 
>     location / {
>             try_files $uri $uri/ @router; # 指向下面的 @router否则会出现 404
>     }
> 
>     # 对应上面的 @router,主要Vue请求并不是真实路径，无法找到文件，需要重定向到 index.html 中，然后交给路由处理
>     location @router {
>             rewrite ^.*$ /index.html last;
>     }
> }
> ```
>* 改为5000端口代码：
> ```bash
> server {
>     listen 5000;
>     listen [::]:5000;
> 
>     server_name 127.0.0.1;  # 服务器主私网IP地址
> 
>     root /home/home/myself/dist;  # 目录在home文件夹中新建一个文件夹，放入你的dist问文件，将目录更改一下即可
>     index index.html;
> 
>     location / {
>             try_files $uri $uri/ @router; # 指向下面的 @router否则会出现 404
>     }
> 
>     # 对应上面的 @router,主要Vue请求并不是真实路径，无法找到文件，需要重定向到 index.html 中，然后交给路由处理
>     location @router {
>             rewrite ^.*$ /index.html last;
>     }
> }
> ```


> ## 2. Ubuntu下操作Nginx常用命令
> ``` bash
> sudo apt install nginx  #安装
> sudo /etc/init.d/nginx start #启动
> nginx -s reload #重新加载配置项
> sudo /etc/init.d/nginx quit #关闭
> nginx -s stop #停止
> ```