# 插件开发

## 插件系统概述

OpenClaw 使用插件系统来扩展功能。插件可以：

- 添加新的消息通道
- 提供自定义工具
- 扩展 Agent 能力

## 创建插件

### 项目结构

```
my-plugin/
├── package.json
├── dist/
│   └── index.js
└── src/
    └── index.ts
```

### 基础模板

```typescript
// src/index.ts
export default {
  name: 'my-plugin',
  version: '1.0.0',
  
  async setup(api) {
    // 注册工具
    api.registerTool({
      name: 'myTool',
      description: 'My custom tool',
      execute: async (params) => {
        // 工具逻辑
        return { result: 'done' };
      }
    });
  }
};
```

### 发布插件

```bash
# 构建
npm run build

# 发布到 npm
npm publish
```

## 安装插件

```bash
openclaw plugin install my-plugin
```

## 官方插件

- `openclaw-weixin` - 微信通道
- `openclaw-telegram` - Telegram 通道
- `openclaw-discord` - Discord 通道
