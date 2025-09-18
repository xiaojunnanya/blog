---
id: ClaudeCode
slug: /tool/ClaudeCode
title: ClaudeCode的使用
date: 2002-09-26
authors: 酒辞.
tags: [tool, ClaudeCode]
keywords: [tool, ClaudeCode]
----

已mac为例

## 安装
### 安装node
自己安装，推荐使用nvm，node>20


安装claudeCode
```bash
npm install -g @anthropic-ai/claude-code
# 验证安装
claude --version
```

如果安装过程中遇到网络问题，可以尝试使用国内 npm 镜像：
```bash
sudo npm install -g @anthropic-ai/claude-code --registry https://registry.npmmirror.com
# 验证安装
claude --version
```

## 配置环境变量
为了避免每次使用时重复输入认证信息，建议将环境变量写入配置文件
写入用户环境变量中，这样不需要每个文件配置，但是注意，文件内的配置优先级高于这个
看自己终端是什么版本就复制对应内容:
```bash
# 添加到 bash_profile
echo -e '\nexport ANTHROPIC_API_KEY=sk-你自己的Token' >> ~/.bash_profile
echo -e '\nexport ANTHROPIC_BASE_URL=https://gaccode.com/claudecode' >> ~/.bash_profile

# 添加到 bashrc
echo -e '\nexport ANTHROPIC_API_KEY=sk-你自己的Token' >> ~/.bashrc
echo -e '\nexport ANTHROPIC_BASE_URL=https://gaccode.com/claudecode' >> ~/.bashrc

# 如果使用 zsh
echo -e '\nexport ANTHROPIC_API_KEY=sk-你自己的Token' >> ~/.zshrc
echo -e '\nexport ANTHROPIC_BASE_URL=https://gaccode.com/claudecode' >> ~/.zshrc
```

## 使用
### 首次使用
在你的项目目录下运行 Claude Code：
```bash
# 进入您的项目文件
cd your-project-folder

# 启动交互模式
claude

# 以初始查询启动
claude "解释这个项目"

# 运行单个命令并退出
claude -p "这个函数做什么？"

# 处理管道内容
cat logs.txt | claude -p "分析这些错误"
```

### 选择你的 AI 模型
PS: 对于日常任务，推荐使用 Claude 4 Sonnet，计费倍率仅为 Claude 4 Opus 的 1/5；对于有挑战性的任务，可以尝试更为智能的 Claude 4 Opus。
输入下面命令可以切换模型：`/model`

### 其他命令
- `/exit`: 退出交互模式
- `/help`: 显示帮助信息
<<<<<<< HEAD
<<<<<<< HEAD
- `claude --dangerously-skip-permissions`: 跳过权限检查，基于最高权限
=======
>>>>>>> a0a8029 (feat: change)
=======
- `claude --dangerously-skip-permissions`: 跳过权限检查，基于最高权限
>>>>>>> e0ed8be (feat: update)

### 更多
输入`/` 可以看到很多的命令

## 遇到的问题
### 无法连接到Anthropic服务

#### 问题
```bash
Unable to connect to Anthropic services
Failed to connect to api.anthropic.com: ERR BAD REQUEST
lease check your internet connection and network settings.
Note: Claude Code might not be available in your country, Check supported countries atnttps://anthropic.com/supported-countriesS E:ltoollclaude code
```

#### 解决方案
1. 找到电脑的 .cladue.json 文件，如果没有，则创建一个(mac 在顶级文件夹中的隐藏文件中)
2. 在 .claude.json 文件中添加：`"hasCompletedOnboarding": true`
```json
{
  "installMethod": "unknown",
  "autoUpdates": true,
  "firstStartTime": "...",
  "userID": "...",
  "projects": {
    "/home/nassi": {
      "allowedTools": [],
      "history": [],
      "mcpContextUris": [],
      "mcpServers": {},
      "enabledMcpjsonServers": [],
      "disabledMcpjsonServers": [],
      "hasTrustDialogAccepted": false,
      "projectOnboardingSeenCount": 0,
      "hasClaudeMdExternalIncludesApproved": false,
      "hasClaudeMdExternalIncludesWarningShown": false
    }
  },
  "hasCompletedOnboarding": true  // 新增字段
}
```


## MCP
### 安装
```bash
# 通过json安装
claude mcp add-json ...

# 示例 项目级别安装
claude mcp add-json context7 '{ "command": "npx -y @upstash/context7-mcp", "env": {} }'

# 示例 用户级别安装
claude mcp add-json --scope user context7 '{ "command": "npx -y @upstash/context7-mcp", "env": {} }'
```

### 删除
`claude mcp remove context7`

### 修改
先删除，再添加

### 查看当前MCP
`claude mcp list`

### 常用的MCP
```json
{
  "mcpServers": {
    "hlj-mcp": {
      "command": "node",
      "args": [
        "/Users/mac/jiuci/code/technical-proposal-mcp/dist/index.js"
      ],
      "env": {}
    },
    "context7": {
      "command": "npx -y @upstash/context7-mcp",
      "env": {}
    },
    "ApifoxMCP": {
      "command": "npx",
      "args": ["-y", "apifox-mcp-server@latest", "--project=项目id"],
      "env": {
        "APIFOX_ACCESS_TOKEN": "你的账号的TOKEN"
      }
    },
    "FigmaMCP": {
      "type": "sse",
      "url": "http://127.0.0.1:3845/sse"
    },
    "serena": {
      "command": "uvx",
      "args": [
        "--from",
        "git+GitHub - oraios/serena: A powerful coding agent toolkit providing semantic retrieval and editing cap",
        "serena",
        "start-mcp-server",
        "--context",
        "ide-assistant"
      ]
    }
  }
}
```

## 权限控制
- `claude --dangerously-skip-permissions`：全自动模式 赋予最高的权限
- `/premissions`: 添加权限
