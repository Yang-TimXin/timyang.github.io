# OpenClaw 配置详解

> 深入了解 OpenClaw 的配置系统，打造个性化的 AI 助手。

## 配置文件结构

OpenClaw 使用 JSON 格式的配置文件，主要文件位于项目根目录：

```
my-openclaw/
├── openclaw.json       # 主配置文件（必须）
├── .env                # 环境变量（敏感信息）
└── config/
    ├── agents.json     # Agent 配置
    └── plugins.json    # 插件配置
```

## 主配置文件 (openclaw.json)

### 完整配置示例

```json
{
  "version": "1.0",
  "gateway": {
    "port": 18789,
    "host": "0.0.0.0",
    "cors": true
  },
  "llm": {
    "provider": "openai",
    "model": "gpt-4o",
    "apiKey": "${OPENAI_API_KEY}",
    "baseUrl": "https://api.openai.com/v1",
    "maxTokens": 4096,
    "temperature": 0.7,
    "timeout": 60000
  },
  "agent": {
    "name": "小助手",
    "description": "一个友好的 AI 助手",
    "systemPrompt": "你是用户的私人助手，乐于助人。",
    "tools": ["read", "write", "exec", "web_search", "browser"],
    "maxTurns": 50,
    "contextWindow": 128000
  },
  "channels": {
    "weixin": {
      "enabled": true,
      "name": "微信助手",
      "whitelist": ["wxid_xxx1", "wxid_xxx2"]
    },
    "telegram": {
      "enabled": true,
      "token": "${TELEGRAM_BOT_TOKEN}",
      "allowedUsers": [123456789]
    },
    "discord": {
      "enabled": true,
      "token": "${DISCORD_BOT_TOKEN}",
      "guildId": "1234567890"
    }
  },
  "browser": {
    "headless": true,
    "defaultProfile": "openclaw",
    "profiles": {
      "openclaw": {
        "cdpPort": 18800,
        "userDataDir": null
      },
      "chrome": {
        "cdpPort": 18801,
        "userDataDir": "~/.openclaw/chrome-profile"
      }
    }
  },
  "memory": {
    "enabled": true,
    "dailyLogs": true,
    "longTermMemory": true,
    "maxDailyEntries": 100
  },
  "security": {
    "allowShell": true,
    "shellTimeout": 30000,
    "maxFileSize": 10485760,
    "blockedCommands": ["rm -rf /", "shutdown", "reboot"],
    "sandbox": false
  },
  "logging": {
    "level": "info",
    "file": "logs/openclaw.log",
    "maxSize": "10MB",
    "maxFiles": 5
  }
}
```

### 配置项详解

#### Gateway 配置

```json
{
  "gateway": {
    "port": 18789,        // Gateway 端口，默认 18789
    "host": "0.0.0.0",    // 监听地址，0.0.0.0 表示所有接口
    "cors": true,         // 是否启用 CORS
    "auth": {             // 可选：API 认证
      "enabled": false,
      "token": "your-api-token"
    }
  }
}
```

#### LLM 配置

```json
{
  "llm": {
    "provider": "openai",       // 提供商：openai | ollama | anthropic | custom
    "model": "gpt-4o",          // 模型名称
    "apiKey": "sk-xxx",         // API 密钥（建议用环境变量）
    "baseUrl": "https://...",   // 自定义 API 地址
    "maxTokens": 4096,          // 最大输出 token
    "temperature": 0.7,         // 温度参数 (0-2)
    "timeout": 60000,           // 请求超时 (毫秒)
    "retryAttempts": 3,         // 重试次数
    "stream": true              // 是否启用流式输出
  }
}
```

#### Agent 配置

```json
{
  "agent": {
    "name": "小助手",                    // Agent 名称
    "description": "描述",               // Agent 描述
    "systemPrompt": "系统提示词",        // 系统提示词
    "tools": ["read", "write", "exec"], // 可用工具列表
    "maxTurns": 50,                     // 单次对话最大轮数
    "contextWindow": 128000,            // 上下文窗口大小
    "thinking": {                       // 思考模式配置
      "enabled": false,
      "model": "o1"
    },
    "subagent": {                       // 子 Agent 配置
      "maxDepth": 3,
      "defaultTimeout": 120000
    }
  }
}
```

#### 通道配置

```json
{
  "channels": {
    "weixin": {
      "enabled": true,
      "name": "微信助手",
      "whitelist": ["wxid_xxx"],  // 白名单（空=所有人）
      "groupMode": false           // 是否在群聊中启用
    },
    "telegram": {
      "enabled": true,
      "token": "${TELEGRAM_BOT_TOKEN}",
      "allowedUsers": [123456],    // 允许的用户 ID
      "webhook": {                 // Webhook 模式（生产推荐）
        "enabled": false,
        "url": "https://your-domain.com/webhook/telegram",
        "secret": "your-webhook-secret"
      }
    },
    "discord": {
      "enabled": true,
      "token": "${DISCORD_BOT_TOKEN}",
      "guildId": "123456",
      "allowedChannels": ["123456"], // 限制响应的频道
      "prefix": "!"                  // 命令前缀
    }
  }
}
```

## 环境变量 (.env)

敏感信息应放在 `.env` 文件中，不要提交到版本控制：

```bash
# LLM 配置
OPENAI_API_KEY=sk-xxxxxxxxxxxx
OPENAI_BASE_URL=https://api.openai.com/v1
ANTHROPIC_API_KEY=sk-ant-xxx

# 通道配置
TELEGRAM_BOT_TOKEN=123456:ABC-DEF
DISCORD_BOT_TOKEN=MTEx...
DISCORD_APPLICATION_ID=123456789

# 安全配置
OPENCLAW_ADMIN_PASSWORD=your-strong-password

# 浏览器配置
BROWSER_CDP_PORT=18800
BROWSER_HEADLESS=true

# 日志
LOG_LEVEL=info
```

### 环境变量优先级

配置值的解析顺序（优先级从高到低）：

1. 命令行参数
2. 环境变量 (`OPENCLAW_*`)
3. `.env` 文件
4. `openclaw.json` 中的值
5. 默认值

## 配置命令

OpenClaw 提供了便捷的配置命令：

```bash
# 查看所有配置
openclaw config get

# 获取特定配置项
openclaw config get llm.model

# 设置配置项
openclaw config set llm.model gpt-4o

# 设置嵌套配置
openclaw config set channels.telegram.enabled true

# 删除配置项
openclaw config unset llm.apiKey

# 导出配置
openclaw config export > config-backup.json

# 导入配置
openclaw config import config-backup.json

# 验证配置
openclaw config validate
```

## 高级配置

### 多 Agent 配置

```json
{
  "agents": {
    "default": {
      "model": "gpt-4o",
      "systemPrompt": "你是通用助手"
    },
    "coder": {
      "model": "gpt-4o",
      "systemPrompt": "你是编程专家",
      "tools": ["read", "write", "exec", "browser"]
    },
    "researcher": {
      "model": "gpt-4o",
      "systemPrompt": "你是研究员",
      "tools": ["web_search", "web_fetch", "read"]
    }
  },
  "routing": {
    "default": "default",
    "keywords": {
      "代码|编程|bug|开发": "coder",
      "搜索|研究|调查": "researcher"
    }
  }
}
```

### 工具权限配置

```json
{
  "tools": {
    "exec": {
      "enabled": true,
      "allowedCommands": ["ls", "cat", "git", "npm", "python"],
      "blockedPatterns": ["rm -rf", "sudo", "chmod 777"],
      "timeout": 30000,
      "cwd": "~"
    },
    "browser": {
      "enabled": true,
      "allowedDomains": ["github.com", "google.com"],
      "blockedDomains": ["malware.com"]
    },
    "file_write": {
      "enabled": true,
      "allowedPaths": ["~/workspace", "~/.openclaw"],
      "maxFileSize": 10485760
    }
  }
}
```

### 心跳配置

```json
{
  "heartbeat": {
    "enabled": true,
    "interval": 1800000,        // 30 分钟
    "prompt": "检查新邮件和日程",
    "quietHours": {
      "start": "23:00",
      "end": "08:00"
    }
  }
}
```

### Cron 定时任务

```json
{
  "cron": {
    "jobs": [
      {
        "name": "每日摘要",
        "schedule": "0 9 * * *",
        "prompt": "生成今日待办摘要",
        "channel": "telegram"
      },
      {
        "name": "周报",
        "schedule": "0 18 * * 5",
        "prompt": "总结本周工作并生成周报",
        "channel": "email"
      }
    ]
  }
}
```

## 配置最佳实践

1. **安全第一**：敏感信息用环境变量，不要硬编码在配置文件中
2. **渐进配置**：先用默认配置运行，再逐步调整
3. **备份配置**：修改前导出备份：`openclaw config export > backup.json`
4. **验证配置**：修改后运行 `openclaw config validate`
5. **分环境配置**：开发/测试/生产使用不同的配置文件

## 下一步

了解 [插件开发](plugins.md) 来扩展 OpenClaw 的能力。
