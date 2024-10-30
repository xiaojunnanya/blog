---
id: mvn
slug: /tool/mvn
title: node管理工具nvm
date: 2002-09-26
authors: 鲸落
tags: [tool, mvn]
keywords: [tool, mvn]
---

## 前言

配置前，请事先卸载你已经安装的Node版本和配置的环境变量，避免冲突。



## 配置

1. [项目下载地址](https://github.com/coreybutler/nvm-windows/releases)，下载`nvm-noinstall.zip`

2. 解压到一个空白文件内，这个文件夹就是NVM地址目录，比如我这里的地址地址是：`D:\myEnvironment\nvm`

3. 之后，找到电脑的环境变量，比如Windows10：右键`此电脑`-`高级系统设置`-`环境变量`：

4. 最后，添加环境变量：

   - `NVM_HOME`：NVM地址目录，比如：`D:\myEnvironment\nvm`
   - `NVM_SYMLINK`：NVM配置Node.js的软链接，**该目录需指向并不存在的目录（NVM使用时候会自动创建）**，比如：`D:\myEnvironment\nodejs`

5. 追加内容到`Path`，追加的内容：

   ```
   %NVM_HOME%
   %NVM_SYMLINK%
   ```

6. 安装完成后，在`CMD`或者`Powershell`下，输入NVM，即可发现安装完成

7. 中国大陆这边连接Node.js和NPM官方服务器有点困难，甚至不单单是下载慢了，有时候直接无法下载使用。所以我们换NVM和Node.js成国内源。到你NVM安装路径，打开settings.txt文件（如果没有，则创建即可），更改：

   ```
   root: D:\myEnvironment\nvm
   path: D:\myEnvironment\nodejs
   arch: 64
   proxy: none
   
   node_mirror: https://npmmirror.com/mirrors/node/
   npm_mirror: https://npmmirror.com/mirrors/npm/
   ```

   这里解释一下参数：

   - root：NVM的安装地址。即上文的`%NVM_HOME%`
   - path：激活node.js时的存储路径，即上文的`%NVM_SYMLINK%`
   - arch：系统架构，如果你的Windwos不是`x64`，则填`32`
   - proxy：是否走代理
   - node_mirror：node.js的下载源
   - npm_mirror：npm的下载源

8. 现在可以正常使用了



## 常见命令

- 查看已经安装的nodejs：`nvm list`
- 查看可安装的nodejs版本：`nvm list available`
- 安装node：`nvm install node版本`【`nvm install 16.16.0`】
- 使用node：`nvm use 16.16.0`


## 补充
还有一个npm管理工具：nrm，这个是用来切换npm源的，比如切换到淘宝源：`nrm use taobao`
常见命令：
- `nrm ls`：查看哪些npm源可以使用
- `nrm use npm`：切换为npm源
- `nrm test npm`：测试npm源的速度