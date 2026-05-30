# 安装部署

## 系统要求

- **Node.js** 18+
- **操作系统**：Windows / macOS / Linux

## 安装步骤

### 1. 安装 OpenClaw

```bash
npm install -g openclaw
```

### 2. 初始化项目

```bash
openclaw init
```

这会创建默认配置文件和目录结构。

### 3. 配置 API Key

编辑配置文件，添加你的 AI 模型 API Key：

```yaml
# ~/.openclaw/config.yaml
models:
  default: claude-3-5-sonnet
  providers:
    anthropic:
      apiKey: your-api-key
```

### 4. 启动服务

```bash
openclaw start
```

## 连接消息通道

### 微信

```bash
# 安装微信插件
openclaw plugin install openclaw-weixin

# 登录
openclaw channel login openclaw-weixin
```

### Telegram

```bash
# 安装 Telegram 插件
openclaw plugin install openclaw-telegram

# 配置 Bot Token
openclaw config set telegram.token "your-bot-token"
```

## 验证安装

```bash
# 检查状态
openclaw status

# 查看日志
openclaw logs
```
