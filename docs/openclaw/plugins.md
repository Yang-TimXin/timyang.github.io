# OpenClaw 插件开发指南

> 扩展 OpenClaw 的能力，构建你的专属工具集。

## 插件系统概述

OpenClaw 的插件系统允许你扩展 Agent 的能力。插件可以：

- 注册新的工具（Tool）
- 添加新的技能（Skill）
- 集成外部服务
- 自定义消息处理逻辑
- 扩展浏览器控制能力

### 插件类型

| 类型 | 说明 | 用途 |
|------|------|------|
| **Tool Plugin** | 注册新工具 | 扩展 Agent 可调用的功能 |
| **Skill Plugin** | 添加技能文件 | 指导 Agent 完成特定任务 |
| **Channel Plugin** | 消息通道 | 接入新的聊天平台 |
| **Service Plugin** | 外部服务集成 | 连接第三方 API |

## 创建插件

### 插件目录结构

```
openclaw-plugin-xxx/
├── package.json          # 包信息
├── index.js              # 插件入口
├── tools/                # 工具定义
│   ├── tool-a.js
│   └── tool-b.js
├── skills/               # 技能定义
│   └── my-skill/
│       └── SKILL.md
├── README.md             # 使用文档
└── LICENSE               # 许可证
```

### package.json

```json
{
  "name": "openclaw-plugin-xxx",
  "version": "1.0.0",
  "description": "OpenClaw 插件：xxx 功能",
  "main": "index.js",
  "keywords": [
    "openclaw",
    "openclaw-plugin"
  ],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {},
  "peerDependencies": {
    "openclaw": ">=1.0.0"
  }
}
```

### 插件入口 (index.js)

```javascript
// index.js
module.exports = {
  name: 'openclaw-plugin-xxx',
  version: '1.0.0',
  
  // 插件初始化
  async setup(context) {
    const { config, logger, registerTool } = context;
    
    logger.info('Plugin xxx loaded');
    
    // 注册工具
    registerTool({
      name: 'my_tool',
      description: '这是一个自定义工具',
      parameters: {
        type: 'object',
        properties: {
          input: {
            type: 'string',
            description: '输入参数'
          }
        },
        required: ['input']
      },
      async execute(params, context) {
        const { input } = params;
        // 工具逻辑
        return { result: `处理结果: ${input}` };
      }
    });
  },
  
  // 插件清理
  async teardown() {
    // 清理资源
  }
};
```

### 注册工具

```javascript
// 注册带验证的工具
registerTool({
  name: 'weather',
  description: '获取天气信息',
  parameters: {
    type: 'object',
    properties: {
      city: {
        type: 'string',
        description: '城市名称'
      },
      unit: {
        type: 'string',
        enum: ['celsius', 'fahrenheit'],
        default: 'celsius'
      }
    },
    required: ['city']
  },
  async execute(params, context) {
    const { city, unit } = params;
    const { config, logger } = context;
    
    // 参数验证
    if (!city || city.trim() === '') {
      throw new Error('城市名称不能为空');
    }
    
    // 调用天气 API
    try {
      const apiKey = config.get('plugins.xxx.weatherApiKey');
      const response = await fetch(
        `https://api.weather.com/v1/current?city=${city}&key=${apiKey}`
      );
      const data = await response.json();
      
      return {
        city: data.location.name,
        temperature: unit === 'celsius' 
          ? data.current.temp_c 
          : data.current.temp_f,
        unit: unit === 'celsius' ? '°C' : '°F',
        condition: data.current.condition.text,
        humidity: data.current.humidity
      };
    } catch (error) {
      logger.error('Weather API error:', error);
      throw new Error(`获取天气失败: ${error.message}`);
    }
  }
});
```

### 创建技能 (Skill)

技能是 Markdown 格式的指令文件，指导 Agent 如何完成特定任务：

```markdown
<!-- skills/my-skill/SKILL.md -->
# My Skill

> 这个技能帮助 Agent 完成 xxx 任务。

## 触发条件

当用户说以下关键词时激活此技能：
- "帮我xxx"
- "处理xxx"
- "xxx任务"

## 执行步骤

1. 首先使用 `web_search` 搜索相关信息
2. 使用 `read` 读取相关文件
3. 分析数据并生成报告
4. 使用 `write` 保存结果

## 注意事项

- 确保网络连接正常
- 处理大文件时注意内存使用
- 保存结果前先备份原文件

## 示例

用户：帮我分析这个数据集
Agent：好的，我来帮你分析。首先让我搜索一下相关资料...
```

## 插件开发流程

### 1. 初始化项目

```bash
# 使用模板创建插件
mkdir openclaw-plugin-mytool
cd openclaw-plugin-mytool
npm init -y

# 安装开发依赖
npm install --save-dev eslint jest
```

### 2. 开发工具

```javascript
// tools/my-api.js
const axios = require('axios');

module.exports = {
  name: 'api_call',
  description: '调用外部 API',
  parameters: {
    type: 'object',
    properties: {
      url: { type: 'string', description: 'API URL' },
      method: { 
        type: 'string', 
        enum: ['GET', 'POST', 'PUT', 'DELETE'],
        default: 'GET'
      },
      data: { type: 'object', description: '请求数据' }
    },
    required: ['url']
  },
  
  async execute(params, context) {
    const { url, method, data } = params;
    const { logger } = context;
    
    logger.info(`API Call: ${method} ${url}`);
    
    try {
      const response = await axios({ method, url, data });
      return {
        status: response.status,
        headers: response.headers,
        data: response.data
      };
    } catch (error) {
      return {
        error: error.message,
        status: error.response?.status
      };
    }
  }
};
```

### 3. 测试插件

```javascript
// tests/my-api.test.js
const apiTool = require('../tools/my-api');

describe('api_call tool', () => {
  it('should call API successfully', async () => {
    const result = await apiTool.execute(
      { url: 'https://httpbin.org/get', method: 'GET' },
      { logger: console }
    );
    
    expect(result.status).toBe(200);
    expect(result.data).toBeDefined();
  });
  
  it('should handle errors gracefully', async () => {
    const result = await apiTool.execute(
      { url: 'https://invalid-url.test', method: 'GET' },
      { logger: console }
    );
    
    expect(result.error).toBeDefined();
  });
});
```

### 4. 本地测试安装

```bash
# 在 OpenClaw 项目中安装本地插件
openclaw plugin install ./openclaw-plugin-mytool

# 验证安装
openclaw plugin list

# 查看插件日志
openclaw logs --filter "plugin-mytool"
```

## 发布插件

### 发布到 npm

```bash
# 登录 npm
npm login

# 发布
npm publish
```

### 发布到 OpenClaw 插件市场

```bash
# 注册开发者账号
openclaw plugin register

# 验证插件
openclaw plugin validate

# 发布到市场
openclaw plugin publish
```

### 插件文档要求

发布时需要提供完整的 README.md：

```markdown
# openclaw-plugin-xxx

> 简短描述

## 功能

- 功能点 1
- 功能点 2

## 安装

```bash
openclaw plugin install openclaw-plugin-xxx
```

## 配置

```json
{
  "plugins": {
    "xxx": {
      "apiKey": "your-api-key"
    }
  }
}
```

## 使用

描述如何使用插件提供的工具和技能。

## 许可证

MIT
```

## 官方插件列表

| 插件 | 说明 | 安装命令 |
|------|------|----------|
| `openclaw-weixin` | 微信通道 | `openclaw plugin install openclaw-weixin` |
| `openclaw-telegram` | Telegram 通道 | `openclaw plugin install openclaw-telegram` |
| `openclaw-discord` | Discord 通道 | `openclaw plugin install openclaw-discord` |
| `openclaw-whatsapp` | WhatsApp 通道 | `openclaw plugin install openclaw-whatsapp` |
| `openclaw-email` | 邮件收发 | `openclaw plugin install openclaw-email` |
| `openclaw-calendar` | 日历集成 | `openclaw plugin install openclaw-calendar` |
| `openclaw-github` | GitHub 操作 | `openclaw plugin install openclaw-github` |
| `openclaw-notion` | Notion 集成 | `openclaw plugin install openclaw-notion` |

### 查看可用插件

```bash
# 搜索插件
openclaw plugin search weather

# 查看插件详情
openclaw plugin info openclaw-weather

# 更新插件
openclaw plugin update openclaw-xxx
```

## 插件最佳实践

1. **单一职责**：每个插件专注于一个功能领域
2. **错误处理**：完善的错误处理和用户友好的错误信息
3. **日志记录**：使用 context.logger 记录关键操作
4. **配置灵活**：通过 config 获取配置，支持环境变量
5. **文档完善**：清晰的 README 和使用示例
6. **版本管理**：遵循语义化版本控制
7. **向后兼容**：重大变更需要迁移指南

## 下一步

学习 [浏览器自动化](browser.md) 来让 AI 操控浏览器。
