---
id: useubuntu
slug: /other/useubuntu
title: Ubuntu系统操作记录
date: 2002-09-26
authors: 鲸落
tags: [tool, Ubuntu]
keywords: [tool, Ubuntu]
---

## 所遇问题解决

### 字体大小

1. 打开终端，安装gnome-tweaks：`sudo apt install gnome-tweaks`。如果遇到问题按提示安装即可
2. 启动gnome-tweaks：`gnome-tweaks`
3. 设置字体大小：在Fonts页面调整字体大小即Scaling Factor，调节缩放比例，就可以调整字体大小，设置为1.5即可



### 下载VSCode安装失败

官网下载.deb的文件直接安装

如果安装不成功解决方法：

1. 到安装包所在的位置，右键在此打开终端
2. 执行：`sudo dpkg -i XXX(你下载的安装包名).deb`
3. 可以了，有别的问题在解决



### 安装python2.7



### 安装mvn



### 解压tar和tar.gz格式的文件

**tar**

- 解压：`tar -xvf studio.tar`



**tar.gz**

- 压缩：`tar -zcvf studio.tar.gz directory_to_compress`
- 解压：`tar -zxvf studio.tar.gz`





### 彻底解决【“curl: (7) Failed to connect to raw.githubusercontent.com port 443: Connection refused”】错误

[彻底解决【“curl: (7) Failed to connect to raw.githubusercontent.com port 443: Connection refused”】错误_curl: (7) failed to connect to nodejs.org port 443-CSDN博客](https://blog.csdn.net/donaldsy/article/details/107482368)

- 打开文件：`vim /etc/hosts`

- 添加配置：

- ```
  199.232.68.133 raw.githubusercontent.com
  199.232.68.133 user-images.githubusercontent.com
  199.232.68.133 avatars2.githubusercontent.com
  199.232.68.133 avatars1.githubusercontent.com
  ```

上面内容中**199.232.68.133**是raw.githubusercontent.com所在的服务器IP



### 虚拟机和物理机之间复制粘贴

```
sudo apt-get autoremove open-vm-tools
sudo apt-get install open-vm-tools
sudo apt-get install open-vm-tools-desktop
```

然后重启即可



### 主机与虚拟机共享文件

#### 主机设置

1. 在主机建立一个新的文件夹-share-用来当作共享文件夹
2. .点击share文件夹，右键 -> 属性 -> 共享 -> 高级共享 -> 勾选共享此文件夹 -> 确定



#### 虚拟机设置

1. 启动虚拟机
2. 顶部菜单栏处 -> 虚拟机 -> 设置 -> 选项 -> 共享文件夹
3. 文件共享 选择 总是启用
4. 文件夹 选择 添加，选择主机共享文件夹（share）路径，填写虚拟机共享文件夹名称
5. 启用此共享，完成。



#### 虚拟机共享文件夹

虚拟机中共享文件夹路径一般在/mnt/hgfs/

检查是否生成共享文件夹

```
打开终端
cd /mnt/hgfs
ls
```





### Ubuntu 上运行 Shell 脚本

- 将一个脚本保存为带有扩展名的文件，如 test1.sh
- 在终端上输入: chmod +x test1.sh，赋予可执行权限
- 在终端上输入: ./test1.sh 或者 sh test1.sh 就能运行成功
- 另外，如果脚本文件没有扩展名的话，在终端上输入: ./test1 或者 test1 脚本都能执行成功
