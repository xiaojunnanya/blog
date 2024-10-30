---
slug: /cleargit
title: .git文件过大如何清除
date: 2024-10-30
authors: jl
tags: [知识点, git ]
keywords: [知识点, git ]
---

## 大文件历史删除

如果你的 Git 提交历史中有大的包（例如大文件）需要删除，比如说你的包中有一个大视频之前被上传过，你可以使用以下方法：

### git filter-repo

**使用 `git filter-repo`（推荐）**： `git filter-repo` 是一个更现代的工具，可以有效地清理历史。首先，确保安装了这个工具：`pip install git-filter-repo`

然后，运行以下命令来删除历史中的大文件：`git filter-repo --strip-blobs-bigger-than 10M`

这个命令会删除历史中大于 10MB 的文件。你可以根据需要调整大小限制。

注意：`git filter-repo` 是用 Python 编写的工具，因此需要安装 Python



### git filter-branch

**使用 `git filter-branch`（较旧的方法）**： 如果你无法使用 `git filter-repo`，可以使用 `git filter-branch`

`git filter-branch --index-filter 'git rm --cached --ignore-unmatch path/to/large-file' --prune-empty --tag-name-filter cat -- --all`

替换 `path/to/large-file` 为你想删除的文件路径。

- `git filter-branch`：用于重写 Git 历史的命令。
- `--index-filter 'git rm --cached --ignore-unmatch path/to/large-file'`：这是一个索引过滤器，用于在每个提交中从索引中删除指定的文件（在这里是 `path/to/large-file`）。`--cached` 表示仅从索引中删除，而不从工作区删除；`--ignore-unmatch` 表示如果文件在某些提交中不存在，也不会导致错误。
- `--prune-empty`：在删除文件后，如果某个提交没有其他内容（变成空提交），则将其删除。
- `--tag-name-filter cat`：在重写历史时，保留标签的名称。
- `-- --all`：表示对所有分支和标签进行操作。





当你的文件内容过于复杂，（笔者的情况就是，我的个人博客有很多的图片，但是之前上传图片没有压缩，所以导致.git 文件很大，我选择直接重置.git 提交历史）

当然你得确定你以后不需要回溯历史信息



## 直接删除 Git 历史

假设当前的分支为main

1. **备份当前分支**（可选）： 如果你想保留当前状态，可以创建一个新的分支：`git checkout -b dev`

2. **重置当前分支**： 使用 `--orphan` 创建一个新的分支，该分支没有任何历史：`git checkout --orphan develop`

3. **添加文件并提交**： 将当前工作区的文件添加到新的分支并提交：`git add .`   `git commit -m "Initial commit without history"`

4. **删除旧分支**：`git branch -D main`

5. **将新的分支重命名为旧分支的名称**：`git branch -m main`

6. **强制推送到远程**：`git push origin main --force`

7. **未清理未引用的对象**：在删除历史后，Git 可能仍然保留了一些未引用的对象。你可以通过以下命令来清理它们：

   1. `git reflog expire --expire=now --all`：
      - `git reflog`：用于查看和管理 Git 的引用日志（reflog），记录了所有的引用变更（例如，分支的移动）。
      - `expire`：这个子命令用于过期处理，将不再使用的引用标记为过期。
      - `--expire=now`：指定所有引用立即过期，意味着将所有未引用的对象标记为可以删除。
      - `--all`：作用于所有的引用，包括所有分支和标签。

   2. `git gc --prune=now --aggressive`：
      - `git gc`：执行垃圾回收，清理未引用的对象，并优化 Git 存储
      - `--prune=now`：指示 Git 删除所有未引用的对象，而不保留任何过期对象。`now` 的意思是立即删除
      - `--aggressive`：执行更深入的优化，可能会耗费更多时间，但能更有效地减少 `.git` 文件夹的大小。

8. **最后强制推到远程即可**：`git push origin main --force`



这样你的git提交纪录就变成首次了，.git也被清除缩小了