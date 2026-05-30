# 配置详解

## 配置文件位置

默认配置文件位于 `~/.openclaw/config.yaml`

## 核心配置项

### 模型配置

```yaml
models:
  default: claude-3-5-sonnet
  providers:
    anthropic:
      apiKey: your-key
    openai:
      apiKey: your-key
```

### 通道配置

```yaml
channels:
  weixin:
    enabled: true
  telegram:
    enabled: true
    token: your-token
```

### 安全配置

```yaml
security:
  exec:
    security: elevated
  nodes:
    allowCommands:
      - file.fetch
      - file.write
```

## 环境变量

敏感信息建议使用环境变量：

```bash
export ANTHROPIC_API_KEY="your-key"
export OPENAI_API_KEY="your-key"
```

## 配置命令

```bash
# 查看配置
openclaw config get

# 设置配置
openclaw config set key value

# 重置配置
openclaw config reset
```
