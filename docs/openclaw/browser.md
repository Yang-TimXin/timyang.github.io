# OpenClaw 浏览器自动化指南

> 让 AI 操控浏览器，实现网页自动化任务。

## 两种浏览器模式

OpenClaw 支持两种浏览器控制模式，适用于不同场景：

### 1. OpenClaw 托管浏览器 (openclaw profile)

OpenClaw 自己启动和管理一个 Chromium 实例，完全隔离，无登录状态。

**适用场景**：
- 需要干净的浏览器环境
- 不涉及个人登录状态
- 自动化任务和数据采集
- 测试和调试

**特点**：
- 隔离的浏览器实例
- 无 Cookie 和登录状态
- 每次启动都是全新环境
- 完全由 OpenClaw 控制

### 2. Chrome 扩展中继 (chrome profile)

通过 Chrome 扩展连接到你正在使用的 Chrome 浏览器，共享登录状态。

**适用场景**：
- 需要操作已登录的网站
- 使用个人账号执行任务
- 操作企业内网系统
- 需要复用浏览器历史和插件

**特点**：
- 共享 Chrome 的登录状态
- 可以访问需要认证的网站
- 复用已安装的 Chrome 插件
- 需要安装 OpenClaw Chrome 扩展

## CDP 架构

OpenClaw 的浏览器控制基于 Chrome DevTools Protocol (CDP)：

```
┌─────────────────────────────────────────────┐
│              OpenClaw Agent                  │
│    (工具调用: browser.snapshot/act/...)      │
└──────────────────┬──────────────────────────┘
                   │ HTTP API
┌──────────────────▼──────────────────────────┐
│         Browser Control Service              │
│         (端口 18791, gateway+2)              │
└──────────────────┬──────────────────────────┘
                   │ CDP Protocol
┌──────────────────▼──────────────────────────┐
│              Chromium Browser                │
│    (OpenClaw 托管 or Chrome 扩展中继)        │
└─────────────────────────────────────────────┘
```

### 端口说明

| 服务 | 端口 | 说明 |
|------|------|------|
| Gateway | 18789 | OpenClaw 核心服务 |
| Browser Control | 18791 | 浏览器控制服务 (gateway+2) |
| Local Relay | 18792 | 本地中继 (gateway+3) |
| CDP (openclaw) | 18800 | 托管浏览器 CDP 端口 |
| CDP (chrome) | 18801 | Chrome 扩展中继端口 |

### 配置文件

```json
// openclaw.json
{
  "browser": {
    "headless": true,           // 是否无头模式
    "defaultProfile": "openclaw", // 默认使用的 profile
    "profiles": {
      "openclaw": {
        "cdpPort": 18800,
        "userDataDir": null     // null = 临时目录
      },
      "chrome": {
        "cdpPort": 18801,
        "userDataDir": "~/.openclaw/chrome-profile"
      }
    }
  }
}
```

## 浏览器状态管理

### 启动浏览器

```bash
# 检查浏览器状态
openclaw browser status

# 启动托管浏览器
openclaw browser start

# 启动 Chrome 扩展中继
openclaw browser start --profile chrome

# 指定 headless 模式
openclaw browser start --headless
```

### 使用工具控制

```bash
# 通过 Agent 工具控制
# browser.status - 查看状态
# browser.start - 启动浏览器
# browser.open - 打开网页
# browser.screenshot - 截图
# browser.snapshot - 获取页面快照（AI 可读格式）
# browser.act - 执行操作
```

## 实际操作案例

### 案例 1：网页截图

让 AI 截取指定网页的截图：

```
用户：帮我截个图，看看 GitHub 首页长什么样

Agent 执行：
1. browser.start() - 启动浏览器
2. browser.open({ url: "https://github.com" })
3. browser.screenshot() - 截图
4. 返回截图给用户
```

### 案例 2：表单填写

自动填写网页表单：

```
用户：帮我在某个网站注册账号，用户名 test123，密码 xxx

Agent 执行：
1. browser.open({ url: "https://example.com/register" })
2. browser.snapshot() - 获取页面结构
3. browser.act({ kind: "click", ref: "用户名输入框" })
4. browser.act({ kind: "type", ref: "用户名输入框", text: "test123" })
5. browser.act({ kind: "type", ref: "密码输入框", text: "xxx" })
6. browser.act({ kind: "click", ref: "注册按钮" })
7. browser.screenshot() - 截图确认结果
```

### 案例 3：数据采集

从网页提取结构化数据：

```
用户：帮我抓取这个页面的产品信息

Agent 执行：
1. browser.open({ url: "https://example.com/products" })
2. browser.snapshot() - 获取页面结构
3. 分析页面内容
4. 返回结构化数据
```

### 案例 4：自动化测试

执行简单的 Web 测试：

```
用户：测试一下这个登录页面是否正常工作

Agent 执行：
1. browser.open({ url: "https://example.com/login" })
2. browser.snapshot()
3. browser.act({ kind: "type", ref: "email", text: "test@example.com" })
4. browser.act({ kind: "type", ref: "password", text: "testpass" })
5. browser.act({ kind: "click", ref: "login button" })
6. browser.screenshot() - 验证登录结果
```

## 浏览器工具详解

### browser.snapshot

获取页面的可读快照，返回 AI 可理解的页面结构：

```javascript
// 返回示例
{
  "url": "https://github.com",
  "title": "GitHub: Let's build from here",
  "snapshot": "[link] Sign in [1] [link] Sign up [2] ..."
}
```

snapshot 返回的是带有 ref 标记的文本，每个交互元素都有唯一的 ref ID，后续操作通过 ref 定位。

### browser.act

执行页面操作，支持多种类型：

```javascript
// 点击
browser.act({ kind: "click", ref: "e12" })

// 输入文本
browser.act({ kind: "type", ref: "e15", text: "Hello" })

// 填充（覆盖现有内容）
browser.act({ kind: "fill", ref: "e15", text: "Hello" })

// 按键
browser.act({ kind: "press", key: "Enter" })

// 悬停
browser.act({ kind: "hover", ref: "e20" })

// 滚动
browser.act({ kind: "scrollIntoView", ref: "e30" })

// 拖拽
browser.act({ kind: "drag", startRef: "e10", endRef: "e20" })

// 选择下拉框
browser.act({ kind: "select", ref: "e25", values: ["option1"] })

// 等待
browser.act({ kind: "wait", timeMs: 2000 })

// 执行 JavaScript
browser.act({ kind: "evaluate", fn: "document.title" })
```

### browser.navigate

导航到指定 URL：

```javascript
browser.navigate({ url: "https://example.com" })
```

### browser.open

在新标签页打开 URL：

```javascript
browser.open({ url: "https://example.com" })
```

### browser.tabs

管理标签页：

```javascript
// 列出所有标签页
browser.tabs()

// 切换到指定标签页
browser.focus({ targetId: "tab-id" })

// 关闭标签页
browser.close({ targetId: "tab-id" })
```

## Chrome 扩展安装

### 安装步骤

```bash
# 1. 安装 Chrome 扩展
openclaw browser extension install

# 2. 获取扩展路径
openclaw browser extension path

# 3. 在 Chrome 中加载扩展
# 打开 chrome://extensions
# 开启"开发者模式"
# 点击"加载已解压的扩展程序"
# 选择上一步显示的路径

# 4. 连接到 OpenClaw
# 在扩展弹窗中点击"连接"
```

### 创建自定义 Profile

```bash
# 创建连接到本地 Chrome 的 profile
openclaw browser create-profile \
  --name my-chrome \
  --driver extension \
  --cdp-url http://127.0.0.1:18792

# 使用自定义 profile
openclaw browser start --profile my-chrome
```

## 常见问题

### 浏览器启动失败

```bash
# 检查端口占用
netstat -ano | findstr 18800

# 检查 Chromium 是否安装
openclaw browser doctor

# 手动安装 Chromium
npx playwright install chromium
```

### 页面加载超时

```javascript
// 增加超时时间
browser.open({ 
  url: "https://slow-site.com", 
  timeoutMs: 60000 
})

// 等待特定元素
browser.act({ kind: "wait", ref: "content", timeoutMs: 10000 })
```

### Ref 过期

页面变化后，之前的 ref 可能失效。需要重新获取快照：

```javascript
// 重新获取快照
browser.snapshot()

// 使用新的 ref 执行操作
browser.act({ kind: "click", ref: "new-ref" })
```

## 性能优化

1. **复用标签页**：多次操作在同一标签页中进行，避免重复打开
2. **精确定位**：使用 `refs="aria"` 获取更稳定的 ref
3. **避免截图**：截图消耗资源，只在必要时使用
4. **批量操作**：多个操作尽量在一次 snapshot 后连续执行
5. **关闭不用的标签页**：及时释放资源

## 下一步

学习 [实战案例](workflows.md) 来了解完整的应用场景。
