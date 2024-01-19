#!/bin/bash

# 提示用户输入提交信息
read -p "请输入提交信息: " commit_message

# 执行git add
git add .

# 执行git commit，使用用户输入的提交信息
git commit -m "$commit_message"

# 执行git push
git push
