#!/usr/bin/env bash


# 1. 打包应用
echo "正在打包应用..."
npm run build  # 打包命令

# 2.  先删除服务器上的文件
echo "正在发布到 178.157 环境..." 
ssh ubuntu@62.234.178.157 "rm -rf /home/ubuntu/blog/build"

# 3. 发布，如果在之前不删除的话，并不会覆盖之前的文件
# 62.234.178.157 ubuntu/xjn926XJN
# 将build文件 推送到 ubuntu是账户名 @后面是指定路径，执行后会让你输入密码
scp -r build ubuntu@62.234.178.157:/home/ubuntu/blog/build

# 4. 检查 scp 命令的退出状态
if [ $? -eq 0 ]; then
    echo "推送成功"
else
    echo "推送失败，请检查错误信息"
fi