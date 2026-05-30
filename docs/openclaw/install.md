# OpenClaw 安装部署指南

> 从零开始搭建你的私人 AI 助手。

## 系统要求

- **操作系统**：Windows 10/11、macOS 12+、Ubuntu 20.04+、Debian 11+
- **Node.js**：v18+（推荐 v20 LTS）
- **内存**：最低 4GB，推荐 8GB+
- **磁盘**：至少 2GB 可用空间
- **网络**：需要访问 LLM API 和消息通道 API

## 一、安装 Node.js

### Windows

```powershell
# 使用 nvm-windows 安装
nvm install 20
nvm use 20
node -v  # 确认版本 >= 18
```

或者直接从 [nodejs.org](https://nodejs.org) 下载安装包。

### macOS

```bash
# 使用 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 20
nvm use 20
```

### Linux (Ubuntu/Debian)

```bash
# 使用 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
```

## 二、安装 OpenClaw

### 方式一：npm 全局安装（推荐）

```bash
npm install -g openclaw
```

安装完成后，验证安装：

```bash
openclaw --version
openclaw help
```

### 方式二：从源码安装

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
npm install
npm link  # 创建全局命令
```

## 三、初始化项目

```bash
# 创建项目目录
mkdir my-openclaw && cd my-openclaw

# 初始化 OpenClaw 项目
openclaw init
```

`openclaw init` 会创建以下结构：

```
my-openclaw/
├── openclaw.json       # 主配置文件
├── .env                # 环境变量（敏感信息）
├── AGENTS.md           # Agent 行为指南
├── TOOLS.md            # 工具本地配置
├── SOUL.md             # Agent 人格定义
├── USER.md             # 用户信息
├── MEMORY.md           # 长期记忆
└── memory/             # 每日记忆目录
    └── 2024-01-01.md
```

## 四、配置 LLM 提供商

### OpenAI

```json
// openclaw.json
{
  "llm": {
    "provider": "openai",
    "model": "gpt-4o",
    "apiKey": "sk-xxx"
  }
}
```

或通过环境变量：

```bash
# .env
OPENAI_API_KEY=sk-xxx
OPENAI_MODEL=gpt-4o
```

### 本地模型 (Ollama)

```bash
# 安装 Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# 拉取模型
ollama pull llama3
```

```json
// openclaw.json
{
  "llm": {
    "provider": "ollama",
    "model": "llama3",
    "baseUrl": "http://localhost:11434"
  }
}
```

### 其他兼容 API

```bash
# .env
OPENAI_API_KEY=your-key
OPENAI_BASE_URL=https://api.your-provider.com/v1
OPENAI_MODEL=your-model
```

## 五、连接消息通道

### 微信

OpenClaw 通过微信 Web 协议接入微信。需要使用第三方桥接工具：

```bash
# 安装微信桥接插件
openclaw plugin install openclaw-weixin
```

启动后会显示二维码，用手机微信扫码登录。

```json
// openclaw.json 中添加通道配置
{
  "channels": {
    "weixin": {
      "enabled": true,
      "name": "微信助手"
    }
  }
}
```

### Telegram

```bash
# 1. 在 Telegram 找 @BotFather 创建 Bot
# 2. 获取 Bot Token

# .env
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
```

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "token": "${TELEGRAM_BOT_TOKEN}"
    }
  }
}
```

```bash
# 安装 Telegram 插件
openclaw plugin install openclaw-telegram
```

### Discord

```bash
# 1. 在 Discord Developer Portal 创建应用
# 2. 创建 Bot，获取 Token
# 3. 邀请 Bot 到服务器

# .env
DISCORD_BOT_TOKEN=MTEx...
DISCORD_APPLICATION_ID=123456789
```

```json
{
  "channels": {
    "discord": {
      "enabled": true,
      "token": "${DISCORD_BOT_TOKEN}"
    }
  }
}
```

```bash
openclaw plugin install openclaw-discord
```

## 六、启动 OpenClaw

```bash
# 前台运行
openclaw start

# 后台运行
openclaw start --daemon

# 查看状态
openclaw status

# 查看日志
openclaw logs
```

启动成功后，你会看到类似输出：

```
🚀 OpenClaw Gateway started on port 18789
📱 Channels: weixin ✓ telegram ✓
🤖 Agent ready with model: gpt-4o
```

## 七、常用运维命令

```bash
# 停止服务
openclaw stop

# 重启服务
openclaw restart

# 查看配置
openclaw config get

# 更新 OpenClaw
npm update -g openclaw

# 查看插件列表
openclaw plugin list

# 安装插件
openclaw plugin install <plugin-name>

# 卸载插件
openclaw plugin remove <plugin-name>
```

## 八、故障排查

### 常见问题

| 问题 | 解决方案 |
|------|----------|
| 端口被占用 | `openclaw config set port 18790` 修改端口 |
| LLM API 报错 | 检查 `.env` 中的 API Key 和网络连通性 |
| 插件加载失败 | `openclaw plugin list` 查看插件状态，重新安装 |
| 内存不足 | 增加系统内存或减少并发会话数 |

### 查看详细日志

```bash
# 开启调试模式
openclaw start --debug

# 查看特定日志
openclaw logs --filter "error"
openclaw logs --filter "plugin"
```

## 下一步

安装完成后，深入了解 [配置详解](config.md) 来定制你的 OpenClaw。
