# AI Agent 快速上手指南 —— 5 分钟搭建你的私人助手

## 前言

你想拥有一个能帮你写代码、整理文件、自动处理任务的私人 AI 助手吗？本指南将带你从零开始，在 5 分钟内搭建并运行你的第一个 AI Agent。

无论你是程序员还是普通用户，都能找到适合自己的方案。

## 一、环境准备

在开始之前，你需要安装一些基础工具。

### 1.1 安装 Node.js

Node.js 是 OpenClaw 的运行环境，也是很多 AI Agent 工具的基础。

**Windows 用户：**
1. 访问 https://nodejs.org
2. 下载 LTS 版本（推荐 18.x 或更高）
3. 双击安装包，按默认选项安装
4. 打开命令行，验证安装：
```bash
node --version
# 应显示类似 v18.17.0 的版本号

npm --version
# 应显示类似 9.6.7 的版本号
```

**macOS 用户：**
```bash
# 使用 Homebrew 安装
brew install node
```

**Linux 用户：**
```bash
# 使用 nvm 安装（推荐）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

### 1.2 安装 Git

Git 用于版本控制和下载开源项目。

**Windows/macOS：**
- 下载并安装 https://git-scm.com

**验证安装：**
```bash
git --version
# 应显示类似 git version 2.41.0
```

### 1.3 准备 API Key

大多数 AI Agent 需要大语言模型的 API Key。推荐准备：

- **OpenAI API Key**：https://platform.openai.com/api-keys（用于 GPT-4）
- **Anthropic API Key**：https://console.anthropic.com（用于 Claude）
- **或者使用本地模型**：如 Ollama（免费，无需 API Key）

## 二、方案选择

根据你的需求和技术水平，选择最适合的方案：

### 方案 A：Claude Code（推荐开发者）

**适合人群**：程序员、技术人员
**特点**：专注编程，直接在终端运行，代码能力强
**价格**：需要 Anthropic API Key，按使用量付费

**安装和使用：**
```bash
# 安装 Claude Code
npm install -g @anthropic-ai/claude-code

# 在项目目录中启动
cd your-project
claude

# 然后直接用自然语言描述你的需求
> 帮我创建一个 Express 服务器，包含路由和错误处理
```

### 方案 B：Cursor（推荐 IDE 用户）

**适合人群**：喜欢图形界面的开发者
**特点**：基于 VS Code 的 AI IDE，可视化操作
**价格**：有免费额度，Pro 版 $20/月

**安装和使用：**
1. 下载安装 https://cursor.sh
2. 打开任意项目文件夹
3. 按 `Cmd/Ctrl + K` 打开 AI 聊天
4. 描述你的需求，Cursor 会自动编写代码

### 方案 C：OpenClaw（推荐全场景用户）

**适合人群**：所有人，特别是非程序员
**特点**：功能全面，支持自然语言，跨平台
**价格**：开源免费（只需 API 费用或使用本地模型）

**安装和使用：**
```bash
# 安装 OpenClaw
npm install -g openclaw

# 启动
openclaw start

# 开始对话
openclaw chat

# 或者直接执行任务
openclaw run "帮我创建一个待办事项应用"
```

### 选择建议

| 你的需求 | 推荐方案 |
|---------|---------|
| 纯编程开发 | Claude Code 或 Cursor |
| 日常任务自动化 | OpenClaw |
| 不想写代码 | OpenClaw |
| 预算有限 | OpenClaw + 本地模型 |
| 需要图形界面 | Cursor |

## 三、第一个任务实操

让我们用 OpenClaw 完成第一个任务：**创建一个简单的网页计算器**。

### 步骤 1：启动 OpenClaw

```bash
# 打开终端，进入你想要创建项目的目录
cd ~/projects

# 启动 OpenClaw
openclaw chat
```

### 步骤 2：描述你的需求

在 OpenClaw 中输入：

```
帮我创建一个网页计算器，要求：
1. 支持加减乘除
2. 有清晰的按钮布局
3. 界面美观，有动画效果
4. 保存为 index.html 文件
```

### 步骤 3：观察 Agent 执行

你会看到 OpenClaw 自动：
1. 分析你的需求
2. 创建 HTML 文件结构
3. 编写 CSS 样式
4. 实现 JavaScript 计算逻辑
5. 保存文件到当前目录

### 步骤 4：查看结果

```bash
# 在浏览器中打开生成的文件
open index.html  # macOS
start index.html  # Windows
xdg-open index.html  # Linux
```

你应该能看到一个功能完整的网页计算器！

### 更多入门任务示例

**任务 1：文件整理**
```
帮我整理下载目录，按文件类型分到不同文件夹：
- 图片 → images/
- 文档 → documents/
- 视频 → videos/
- 其他 → others/
```

**任务 2：数据分析**
```
读取 sales.csv 文件，分析每个月的销售额，生成柱状图，保存为 report.html
```

**任务 3：代码转换**
```
把这个 Python 脚本转换成 JavaScript 版本，保持功能完全一致
```

## 四、常见问题解决

### 问题 1：安装时出现权限错误

**现象**：`EACCES: permission denied`

**解决方案**：
```bash
# Windows：以管理员身份运行命令行

# macOS/Linux：使用 nvm 或修改 npm 全局目录
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### 问题 2：API Key 无效或余额不足

**现象**：`Invalid API key` 或 `Insufficient credits`

**解决方案**：
1. 检查 API Key 是否正确复制（注意前后空格）
2. 确认 API 账户有余额
3. 尝试使用免费的本地模型：
```bash
# 安装 Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 下载模型
ollama pull llama3

# 在 OpenClaw 中配置使用本地模型
openclaw config set model ollama/llama3
```

### 问题 3：Agent 执行任务时卡住

**现象**：长时间无响应

**解决方案**：
1. 按 `Ctrl + C` 中断当前任务
2. 尝试更具体地描述你的需求
3. 检查网络连接是否正常
4. 查看日志：`openclaw logs`

### 问题 4：生成的代码有错误

**现象**：代码运行报错

**解决方案**：
1. 把错误信息发给 Agent：
```
运行时出现这个错误：[粘贴错误信息]
请帮我修复这个问题
```
2. Agent 通常能自动修复大部分错误

### 问题 5：中文输出出现乱码

**现象**：中文显示为方块或乱码

**解决方案**：
```bash
# 设置终端编码为 UTF-8
# Windows PowerShell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# macOS/Linux
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
```

## 五、进阶技巧

### 技巧 1：使用项目专属配置

在项目根目录创建 `.openclaw.json`：
```json
{
  "model": "gpt-4",
  "temperature": 0.7,
  "maxTokens": 4096,
  "systemPrompt": "你是一个专业的 Python 开发者，注重代码质量和最佳实践。"
}
```

### 技巧 2：创建常用快捷指令

创建 `~/.openclaw/commands.json`：
```json
{
  "review": "请审查当前目录的代码，检查潜在问题并给出改进建议",
  "test": "为当前项目生成单元测试",
  "deploy": "将当前项目部署到 GitHub Pages"
}
```

使用：`openclaw run @review`

### 技巧 3：多 Agent 协作

OpenClaw 支持子 Agent（Subagent），你可以让一个 Agent 管理其他 Agent：
```
帮我做一个调研报告：
1. 子任务 1：调研 React 和 Vue 的区别
2. 子任务 2：调研适合新手的教程资源
3. 合并成一份完整的对比报告
```

## 六、下一步学习路径

### 第 1 周：基础使用
- 熟练使用自然语言描述需求
- 学会查看和理解 Agent 生成的代码
- 掌握常用命令和快捷键

### 第 2-4 周：深入实践
- 尝试完成更复杂的项目
- 学习 Prompt Engineering 技巧
- 探索 Agent 的高级功能

### 第 2 个月：定制化
- 编写自定义工具/插件
- 配置个性化工作流
- 优化 Agent 的响应速度和准确性

### 推荐资源

- **官方文档**：每个工具的 GitHub 仓库
- **社区论坛**：GitHub Discussions、Discord
- **实践项目**：从自动化个人任务开始
- **进阶阅读**：LLM 原理、Agent 架构设计

## 总结

恭喜！你已经完成了 AI Agent 的入门之旅。现在你拥有了一个强大的数字伙伴，它能：

- 帮你写代码、调 bug
- 自动整理文件和数据
- 生成报告和文档
- 自动化重复性任务

**记住**：AI Agent 是工具，不是魔法。它的效果取决于你的需求描述和引导方式。多实践、多尝试，你会越来越熟练。

**立即行动**：
1. 选择一个方案完成安装
2. 尝试完成第一个任务
3. 思考：你的工作/生活中，哪些任务可以交给 Agent？

AI Agent 的时代已经到来，欢迎加入这场效率革命！🚀
