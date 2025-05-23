#!/bin/bash

# 提示用户输入提交信息，如果未输入，则使用默认值
read -p "请输入提交信息 (默认: 新增文章): " commit_message

# 如果用户未输入，使用默认值
if [ -z "$commit_message" ]; then
  commit_message="feat: 新增文章"
fi

# 执行git add
git add .

# 执行git commit，使用用户输入的提交信息或默认值
git commit -m "$commit_message"

# 执行git push
git push
