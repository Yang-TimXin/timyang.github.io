# AI Agent 实战案例集

> 从零到一，用 AI Agent 工具链构建真实项目

## 概述

本文收录四个实战案例，覆盖从全栈应用开发到个人助手搭建、从编码效率提升到多工具协作的完整场景。每个案例均包含可复现的步骤、代码和命令，面向中文开发者，强调实操性。

---

## 案例一：用 Claude Code 搭建全栈应用

### 背景

假设我们要搭建一个 **在线笔记协作平台**：用户可以注册登录、创建笔记、实时编辑、分享给他人。技术栈选定为 Next.js 14 + Prisma + PostgreSQL + TailwindCSS。

### 1. 需求分析

在 Claude Code 中，先用自然语言描述需求：

```bash
# 启动 Claude Code
claude

# 输入需求
帮我规划一个在线笔记协作平台，功能包括：
1. 邮箱注册/登录
2. 个人笔记 CRUD
3. 笔记公开分享（生成链接）
4. 富文本编辑器
5. 响应式 UI

技术栈：Next.js 14 App Router + Prisma + PostgreSQL + TailwindCSS + shadcn/ui
```

Claude Code 会输出一份完整的技术方案，包括目录结构、数据库模型、路由规划。

### 2. 技术选型与项目搭建

```bash
# 创建项目
npx create-next-app@latest note-collab --typescript --tailwind --app --src-dir
cd note-collab

# 安装依赖
npm install prisma @prisma/client next-auth @tiptap/react @tiptap/starter-kit
npm install -D @types/node

# 初始化 Prisma
npx prisma init
```

### 3. 数据库模型设计

让 Claude Code 生成 Prisma Schema：

```
# 在 Claude Code 中输入：
根据需求帮我设计 Prisma schema，包括 User、Note、SharedLink 三个模型
```

生成的 `prisma/schema.prisma`：

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  notes     Note[]
  createdAt DateTime @default(now())
}

model Note {
  id        String      @id @default(cuid())
  title     String
  content   Json?
  published Boolean     @default(false)
  author    User        @relation(fields: [authorId], references: [id])
  authorId  String
  shares    SharedLink[]
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
}

model SharedLink {
  id        String   @id @default(cuid())
  token     String   @unique
  note      Note     @relation(fields: [noteId], references: [id])
  noteId    String
  expiresAt DateTime?
  createdAt DateTime @default(now())
}
```

### 4. 核心功能实现

**API 路由 — 笔记 CRUD** (`src/app/api/notes/route.ts`)：

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const notes = await prisma.note.findMany({
    where: { author: { email: session.user.email } },
    orderBy: { updatedAt: 'desc' },
  })

  return NextResponse.json(notes)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { title, content } = await req.json()

  const note = await prisma.note.create({
    data: {
      title,
      content,
      author: {
        connect: { email: session.user.email },
      },
    },
  })

  return NextResponse.json(note)
}
```

**分享链接生成** (`src/app/api/notes/[id]/share/route.ts`)：

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { expiresAt } = await req.json()

  const shareLink = await prisma.sharedLink.create({
    data: {
      token: nanoid(10),
      noteId: params.id,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  })

  return NextResponse.json({
    url: `/shared/${shareLink.token}`,
  })
}
```

### 5. 部署上线

```bash
# 构建并部署到 Vercel
npx vercel --prod

# 或使用 Docker 自部署
cat > Dockerfile << 'EOF'
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
EOF
```

### 关键经验

- Claude Code 的优势在于**从需求直接到代码**，减少了思考技术细节的时间
- 复杂逻辑（如权限控制、数据校验）可以让 Claude Code 逐步迭代
- 部署前务必让 Claude Code 检查环境变量和安全问题

---

## 案例二：用 OpenClaw 打造私人助手

### 背景

OpenClaw 是一个开源的 AI Agent 框架，可以连接各种即时通讯工具（微信、Telegram、Discord 等），通过插件和技能扩展功能，打造真正的私人智能助手。

### 1. 安装与配置

```bash
# 安装 OpenClaw
npm install -g openclaw

# 初始化工作空间
openclaw init

# 启动 Gateway
openclaw gateway start
```

首次启动后，OpenClaw 会在 `~/.openclaw/` 目录下创建配置文件和工作空间：

```
~/.openclaw/
├── openclaw.json          # 主配置
├── workspace/
│   ├── AGENTS.md          # Agent 行为准则
│   ├── SOUL.md            # Agent 人设
│   ├── USER.md            # 用户信息
│   ├── TOOLS.md           # 工具配置笔记
│   ├── MEMORY.md          # 长期记忆
│   ├── memory/            # 每日记忆日志
│   └── skills/            # 自定义技能
```

### 2. 连接微信

```bash
# 安装微信插件
openclaw plugin install weixin

# 配置微信桥接（需扫码登录）
openclaw plugin configure weixin

# 启动微信通道
openclaw channel start weixin
```

连接成功后，你的微信消息会自动转发到 OpenClaw，AI Agent 可以读取和回复消息。配置 `openclaw.json`：

```json
{
  "channels": {
    "weixin": {
      "enabled": true,
      "autoReply": true,
      "replyDelay": 1000
    }
  },
  "model": {
    "default": "claude-sonnet-4-20250514",
    "fallback": "gpt-4o"
  }
}
```

### 3. 设置技能

OpenClaw 的技能系统是其核心能力。编辑 `SOUL.md` 定义助手人设：

```markdown
# 我是小杨的私人助手

## 性格
- 专业、高效、偶尔幽默
- 用中文交流，技术术语保留英文
- 不确定的事情先查证再回答

## 能力
- 日程管理与提醒
- 技术问题解答
- 代码编写与调试
- 邮件/消息处理
- 信息搜索与整理
```

添加自定义技能，创建 `skills/daily-report/SKILL.md`：

```markdown
# 每日工作报告技能

## 触发条件
用户说"写日报"、"今日总结"、"daily report"

## 执行步骤
1. 读取今天的 memory/YYYY-MM-DD.md
2. 读取 git log（今天提交的代码）
3. 检查日历（今天的会议和事件）
4. 汇总成工作日报格式
5. 保存到 memory/reports/YYYY-MM-DD-daily.md
```

### 4. 自动化工作流

配置心跳检查（定期主动检查事项），编辑 `HEARTBEAT.md`：

```markdown
# 心跳检查清单

- [ ] 检查未读邮件（重要邮件立即通知）
- [ ] 检查日历（2小时内的事件提醒）
- [ ] 检查 GitHub 通知（PR review 请求）
```

设置定时任务（Cron）：

```bash
# 每天早上 9 点发送今日待办
openclaw cron set "0 9 * * *" "查看今天的日历和待办事项，给我一个简要的今日计划"

# 每周五下午 6 点生成周报
openclaw cron set "0 18 * * 5" "生成本周工作周报，保存到 memory/reports/"
```

### 5. 实际使用场景

**场景一：微信对话中直接问技术问题**

```
你：React 18 的 Suspense 和 Concurrent 特性怎么用？
助手：[自动搜索最新文档，给出中文解答和代码示例]
```

**场景二：远程控制你的电脑**

```
你：帮我查一下服务器上的磁盘使用情况
助手：[通过 Node 连接执行 df -h，返回结果]
```

**场景三：定时提醒**

```
你：提醒我下午3点开会
助手：[设置定时任务，到点通过微信推送提醒]
```

### 关键经验

- OpenClaw 的价值在于**持久化记忆**和**多通道整合**，不是简单的聊天机器人
- SOUL.md 和 USER.md 越详细，助手越懂你
- 安全第一：敏感操作（发邮件、删除文件）要设置确认机制

---

## 案例三：用 Cursor 提升开发效率

### 背景

Cursor 是基于 VS Code 的 AI 原生编辑器，内置了 AI 对话、代码生成、多文件编辑等能力。我们用它来重构一个老旧的 Express.js 后端项目。

### 1. 项目初始化与分析

打开 Cursor，导入项目后，使用 `Cmd+L`（或 `Ctrl+L`）打开 AI Chat：

```
# 输入：
分析这个项目的整体架构，列出：
1. 项目结构和主要模块
2. 使用的技术栈
3. 潜在的技术债务
4. 重构建议（迁移到 Fastify + TypeScript）
```

Cursor 会扫描整个项目，给出详细的分析报告，包括哪些文件需要改动、依赖关系图等。

### 2. AI 辅助编码 — 迁移到 TypeScript

使用 Cursor 的 **Composer** 功能（多文件编辑），输入：

```
# 在 Composer 中输入：
将 src/routes/user.js 迁移到 TypeScript：
1. 创建对应的类型定义
2. 使用 Zod 进行请求校验
3. 保持 API 接口不变
4. 添加错误处理中间件
```

Cursor 会同时创建/修改多个文件：

```typescript
// src/types/user.ts
import { z } from 'zod'

export const CreateUserSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8),
})

export type CreateUserInput = z.infer<typeof CreateUserSchema>

// src/routes/user.ts
import { Router, Request, Response } from 'express'
import { CreateUserSchema } from '../types/user'
import { ZodError } from 'zod'

const router = Router()

router.post('/users', async (req: Request, res: Response) => {
  try {
    const input = CreateUserSchema.parse(req.body)
    const user = await UserService.create(input)
    res.status(201).json(user)
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors,
      })
    } else {
      res.status(500).json({ error: 'Internal server error' })
    }
  }
})

export default router
```

### 3. 代码审查

Cursor 内置了代码审查功能。选中一段代码后，右键选择 "AI: Review Code"：

```
# 审查结果示例：
⚠️ 发现 3 个问题：
1. SQL 查询存在注入风险 → 建议使用参数化查询
2. 缺少输入长度限制 → 建议添加 .max() 校验
3. 错误信息泄露内部细节 → 建议使用通用错误消息

✅ 安全检查通过：无硬编码密钥
```

### 4. 调试技巧

在调试时，将错误信息粘贴到 AI Chat：

```
# 输入：
这段代码报错了：TypeError: Cannot read property 'id' of undefined

相关代码：
[粘贴代码片段]

帮我分析原因并修复
```

Cursor 会定位到问题根源，给出修复方案，并直接应用到代码中。

### 5. 与传统开发的对比

| 维度 | 传统开发 | Cursor + AI |
|------|---------|-------------|
| 新项目搭建 | 手动配置，约 30 分钟 | AI 生成脚手架，约 5 分钟 |
| API 开发 | 手写 CRUD，约 15 分钟/接口 | AI 生成 + 手动调整，约 3 分钟/接口 |
| 代码审查 | 依赖团队 review | AI 预审 + 团队复审 |
| Bug 修复 | 阅读文档 + 堆栈追踪 | AI 直接分析 + 修复建议 |
| 重构 | 逐文件手动迁移 | Composer 批量迁移 |
| 学习新框架 | 阅读文档 + 写 Demo | AI 对话式学习 |

### 关键经验

- Cursor 的 Composer 模式适合**批量重构**，比逐个文件改效率高 3-5 倍
- 不要盲目接受 AI 的代码，尤其是涉及安全和性能的部分
- 结合 `@codebase` 引用整个项目上下文，AI 的回答更准确
- 用 `.cursorrules` 文件定义项目规范，AI 会自动遵守

---

## 案例四：多工具协作实战

### 背景

我们要完成一个真实项目：**为一个开源项目构建完整的文档站点**，包括自动从代码生成 API 文档、构建交互式 Playground、设置 CI/CD 自动部署。

这个项目涉及代码分析、文档编写、UI 开发、自动化部署等多个环节，最适合用多个 AI 工具协作完成。

### 1. 工具选择策略

```
┌─────────────────────────────────────────────────┐
│              多工具协作架构                        │
├─────────────────────────────────────────────────┤
│                                                 │
│  需求分析 & 规划  ──→  Claude Code              │
│       │                                         │
│       ▼                                         │
│  代码分析 & 文档生成 ──→  Claude Code           │
│       │                                         │
│       ▼                                         │
│  文档站点 UI 开发  ──→  Cursor                  │
│       │                                         │
│       ▼                                         │
│  样式调整 & 内容润色  ──→  ChatGPT / Claude      │
│       │                                         │
│       ▼                                         │
│  部署 & 监控  ──→  OpenClaw（定时检查站点状态）   │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 2. 第一阶段：用 Claude Code 分析项目

```bash
# 在项目根目录启动 Claude Code
cd my-open-source-project
claude

# 输入：
分析这个项目的所有公开 API：
1. 列出所有导出的函数、类、接口
2. 提取 JSDoc 注释
3. 分析参数类型和返回值
4. 生成结构化的 API 文档（Markdown 格式）
5. 按功能模块分组
```

Claude Code 会扫描整个代码库，生成类似这样的文档：

```markdown
## API Reference

### `createServer(options: ServerOptions): Server`

创建一个新的 HTTP 服务器实例。

**参数：**
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| port | number | 否 | 3000 | 监听端口 |
| host | string | 否 | '0.0.0.0' | 监听地址 |
| middleware | Middleware[] | 否 | [] | 中间件列表 |

**返回值：** `Server` 实例

**示例：**
```typescript
const server = createServer({ port: 8080 })
server.listen()
```
```

### 3. 第二阶段：用 Cursor 构建文档站点

将生成的 Markdown 文档导入 Cursor，使用 Composer 一次性生成 Next.js 文档站点：

```
# 在 Cursor Composer 中输入：
基于 docs/ 目录下的 Markdown 文件，创建一个文档站点：
1. 使用 Next.js 14 + MDX
2. 侧边栏导航（自动生成）
3. 代码高亮（Prism）
4. 搜索功能
5. 深色/浅色主题切换
6. 响应式布局
```

Cursor 会生成完整的项目结构：

```
docs-site/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── docs/
│   │       └── [...slug]/
│   │           └── page.tsx
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   ├── Search.tsx
│   │   ├── CodeBlock.tsx
│   │   └── ThemeToggle.tsx
│   └── lib/
│       └── docs.ts
├── content/
│   └── docs/          ← Claude Code 生成的文档
└── package.json
```

### 4. 第三阶段：内容润色与交互增强

将 Cursor 生成的代码粘贴到 Claude 或 ChatGPT 中，请求优化：

```
帮我优化这段 React 组件：
1. 添加 TypeScript 严格类型
2. 优化渲染性能（React.memo、useMemo）
3. 添加无障碍访问属性（ARIA）
4. 补充单元测试（Vitest + Testing Library）
```

### 5. 第四阶段：用 OpenClaw 监控部署

```bash
# 在 OpenClaw 中设置站点监控
openclaw cron set "*/30 * * * *" "检查文档站点 https://docs.example.com 是否正常运行，如果有问题立即通知我"

# 设置 GitHub webhook 监听
# 当代码推送时，自动触发文档重建
```

### 完整工作流

```
Day 1: Claude Code 分析代码 → 生成 API 文档（2小时）
       ↓
Day 2: Cursor 构建文档站点框架（3小时）
       ↓
Day 3: 交互功能开发 + 样式调整（4小时）
       ↓
Day 4: 内容润色 + 测试（2小时）
       ↓
Day 5: 部署上线 + OpenClaw 监控配置（1小时）
       ↓
总计: 约 12 小时（传统方式约需 40-60 小时）
```

### 工具选择原则

| 任务类型 | 推荐工具 | 原因 |
|---------|---------|------|
| 代码分析与重构 | Claude Code | 理解整个代码库的上下文能力强 |
| 多文件编辑 | Cursor Composer | 并行修改多个文件，实时预览 |
| 文案撰写与润色 | ChatGPT / Claude | 自然语言处理能力出色 |
| 自动化与监控 | OpenClaw | 持久运行、多通道通知 |
| 快速原型 | Cursor Chat | 集成在编辑器中，零切换成本 |

### 关键经验

- **不要用一个工具做所有事**——每个工具有其擅长的领域
- **数据流转是关键**——Claude Code 的输出要能直接作为 Cursor 的输入
- **人工审查不可省略**——AI 生成的代码需要人工验证逻辑正确性
- **建立模板和规范**——在 `.cursorrules`、`AGENTS.md` 等文件中定义标准，让 AI 遵守

---

## 总结

| 案例 | 工具 | 核心价值 | 适用场景 |
|------|------|---------|---------|
| 全栈应用搭建 | Claude Code | 需求到代码的快速转化 | 新项目从零开始 |
| 私人助手 | OpenClaw | 持久记忆 + 多通道整合 | 日常效率提升 |
| 开发效率 | Cursor | 多文件编辑 + AI 审查 | 现有项目重构 |
| 多工具协作 | 组合使用 | 发挥各工具优势 | 复杂项目 |

AI Agent 工具的核心价值不是替代开发者，而是**将开发者从重复性工作中解放出来**，让人专注于真正需要创造力的部分。

> 最好的 AI 工具使用方式，是让 AI 做 AI 擅长的事，让人做人擅长的事。

---

*本文最后更新于 2026 年 5 月 30 日*
