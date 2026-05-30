# 快速上手

## 环境准备

在开始之前，确保你的开发环境满足以下要求：

### 必需
- **Node.js** 18+ （推荐使用 nvm 管理版本）
- **Git** 最新版
- **终端/命令行** 熟悉基本操作

### 推荐
- **VS Code** 或其他现代代码编辑器
- **GitHub 账号** 用于代码托管

## 选择你的第一个 AI Agent 工具

### 方案一：Claude Code（推荐入门）

适合：命令行用户、想要最纯粹 AI 编程体验的人

```bash
# 安装
npm install -g @anthropic-ai/claude-code

# 启动
claude
```

👉 [查看 Claude Code 完整教程 →](/claude-code/)

### 方案二：Cursor

适合：习惯 GUI 编辑器、想要可视化操作的人

1. 下载 [Cursor](https://cursor.sh)
2. 安装并登录
3. 打开项目文件夹
4. 使用 `Cmd/Ctrl + K` 调出 AI

👉 [查看 Cursor 教程 →](/cursor/)

### 方案三：OpenClaw

适合：想要打造私人 AI 助手、连接多种服务的人

```bash
# 安装
npm install -g openclaw

# 初始化
openclaw init
```

👉 [查看 OpenClaw 教程 →](/openclaw/)

## 你的第一个 AI 编程任务

选好工具后，试试这个简单的任务：

1. 创建一个新项目文件夹
2. 让 AI 帮你写一个 Hello World 程序
3. 运行并查看结果
4. 让 AI 添加更多功能

记住：**好的提示词（Prompt）是成功的关键**。尽量具体描述你想要什么，而不是模糊地说"帮我写个程序"。
