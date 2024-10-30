---
slug: /gitSpecification
title: Git 代码提交规范
date: 2024-09-10
authors: jl
tags: [知识点, Git ]
keywords: [知识点, Git ]
---



`commit message = subject + ：+ 空格 + message 主体`

**例如：** `git commit -m "feat：增加用户注册功能"`





常见的 subject 种类以及含义如下：

1. **feat**: 新功能（feature）
   - 用于提交新功能
   - 例如：`feat: 增加用户注册功能`
2. **fix**: 修复 bug
   - 用于提交 bug 修复
   - 例如：`fix: 修复登录页面崩溃的问题`
3. **docs**: 文档变更
   - 用于提交仅文档相关的修改
   - 例如：`docs: 更新README文件`
4. **style**: 代码风格变动（不影响代码逻辑）
   - 用于提交仅格式化、标点符号、空白等不影响代码运行的变更
   - 例如：`style: 删除多余的空行`
5. **refactor**: 代码重构（既不是新增功能也不是修复bug的代码更改）
   - 用于提交代码重构
   - 例如：`refactor: 重构用户验证逻辑`
6. **perf**: 性能优化
   - 用于提交提升性能的代码修改
   - 例如：`perf: 优化图片加载速度`
7. **test**: 添加或修改测试
   - 用于提交测试相关的内容
   - 例如：`test: 增加用户模块的单元测试`
8. **chore**: 杂项（构建过程或辅助工具的变动）
   - 用于提交构建过程、辅助工具等相关的内容修改
   - 例如：`chore: 更新依赖库`
9. **build**: 构建系统或外部依赖项的变更
   - 用于提交影响构建系统的更改
   - 例如：`build: 升级webpack到版本5`
10. **ci**: 持续集成配置的变更
    - 用于提交CI配置文件和脚本的修改
    - 例如：`ci: 修改GitHub Actions配置文件`
11. **revert**: 回滚
    - 用于提交回滚之前的提交
    - 例如：`revert: 回滚feat: 增加用户注册功能`