# Claude Code 实战案例

## 案例一：从零搭建 Express REST API

### 1. 项目初始化

```
> 帮我初始化一个 Node.js 项目，要求：
> - 使用 TypeScript
> - 框架选择 Express
> - 数据库使用 SQLite + Prisma
> - 包管理器用 pnpm
> - 配置 ESLint + Prettier
```

Claude Code 会自动执行：

```bash
# 创建项目目录
mkdir my-api && cd my-api

# 初始化 package.json
pnpm init

# 安装依赖
pnpm add express prisma @prisma/client
pnpm add -D typescript @types/express tsx nodemon

# 初始化 TypeScript
npx tsc --init

# 初始化 Prisma
npx prisma init --datasource-provider sqlite
```

### 2. 项目结构搭建

```
> 帮我创建以下目录结构和基础文件：
> src/
>   ├── app.ts          # Express 应用实例
>   ├── server.ts       # 启动入口
>   ├── routes/         # 路由
>   │   ├── index.ts    # 路由聚合
>   │   └── user.routes.ts
>   ├── controllers/    # 控制器
>   │   └── user.controller.ts
>   ├── middleware/      # 中间件
>   │   ├── error.ts
>   │   └── validate.ts
>   └── lib/
>       └── prisma.ts   # Prisma 客户端
```

### 3. 实现用户 CRUD

```
> 基于 prisma/schema.prisma 中的 User 模型，
> 实现完整的用户 CRUD 接口：
> - GET /api/users       获取用户列表（分页）
> - GET /api/users/:id   获取单个用户
> - POST /api/users      创建用户
> - PUT /api/users/:id   更新用户
> - DELETE /api/users/:id 删除用户
>
> 要求：
> - 使用 Zod 进行参数验证
> - 统一响应格式 { success, data, error }
> - 添加分页支持
> - 包含错误处理中间件
```

### 4. 生成的代码示例

Claude Code 会生成类似这样的代码：

```typescript
// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Zod 验证 schema
const CreateUserSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  role: z.enum(['ADMIN', 'USER']).optional(),
});

export class UserController {
  // 获取用户列表
  static async list(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      },
    });
  }

  // 创建用户
  static async create(req: Request, res: Response) {
    const body = CreateUserSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: '该邮箱已被注册',
      });
    }

    const user = await prisma.user.create({ data: body });
    res.status(201).json({ success: true, data: user });
  }
}
```

### 5. 添加测试

```
> 为所有 API 接口编写集成测试，使用 Vitest + supertest，
> 覆盖正常流程和异常场景
```

### 6. 启动并验证

```bash
# 启动开发服务器
pnpm dev

# 运行测试
pnpm test

# 启动数据库 GUI（可选）
npx prisma studio
```

---

## 案例二：React 组件库开发

### 1. 项目初始化

```
> 帮我创建一个 React 组件库项目：
> - 使用 Vite + React + TypeScript
> - 支持 ES Module 和 CommonJS 输出
> - 使用 Tailwind CSS
> - Storybook 用于组件预览
> - Changeset 管理版本发布
```

### 2. 组件设计

```
> 设计一个 Button 组件，要求：
> - 支持 variant：primary, secondary, outline, ghost
> - 支持 size：sm, md, lg
> - 支持 loading 状态（带 spinner）
> - 支持 icon 按钮
> - 支持 disabled 状态
> - 完整的 TypeScript 类型定义
> - 使用 React.forwardRef
```

### 3. 生成组件代码

```typescript
// src/components/Button/Button.tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Spinner } from '../Spinner';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        outline: 'border border-gray-300 bg-transparent hover:bg-gray-50',
        ghost: 'hover:bg-gray-100',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, icon, children, disabled, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <Spinner className="mr-2 h-4 w-4" /> : icon}
        {children}
      </button>
    );
  }
);
```

### 4. 编写 Storybook

```
> 为 Button 组件创建完整的 Storybook 故事，
> 包含所有变体和状态的展示
```

### 5. 导出配置

```typescript
// src/index.ts
export { Button, type ButtonProps } from './components/Button';
export { Input, type InputProps } from './components/Input';
// ... 其他组件
```

---

## 案例三：全栈博客系统

### 1. 技术架构设计

```
> 帮我设计一个全栈博客系统的技术架构：
> - 前端：Next.js 14 (App Router) + Tailwind + Shadcn UI
> - 后端：Next.js API Routes
> - 数据库：PostgreSQL + Prisma
> - 认证：NextAuth.js
> - 部署：Vercel + PlanetScale
>
> 请先输出整体架构图和数据模型设计
```

### 2. 数据库设计

```
> 根据以下需求设计 Prisma Schema：
>
> 用户系统：
> - 用户名、邮箱、密码（加密）、头像、角色
> - OAuth 支持（GitHub, Google）
>
> 文章系统：
> - 标题、内容（Markdown）、摘要、封面图
> - 发布状态（草稿/发布/归档）
> - 分类和标签（多对多）
> - 阅读量、点赞数
>
> 评论系统：
> - 支持嵌套评论
> - Markdown 内容
> - 评论审核
>
> 请生成完整的 schema.prisma 文件
```

### 3. 生成的 Schema 示例

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  password      String?
  role          Role      @default(USER)
  accounts      Account[]
  sessions      Session[]
  posts         Post[]
  comments      Comment[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@map("users")
}

model Post {
  id          String      @id @default(cuid())
  title       String
  slug        String      @unique
  content     String
  excerpt     String?
  coverImage  String?
  status      PostStatus  @default(DRAFT)
  viewCount   Int         @default(0)
  likeCount   Int         @default(0)
  author      User        @relation(fields: [authorId], references: [id])
  authorId    String
  categories  Category[]
  tags        Tag[]
  comments    Comment[]
  publishedAt DateTime?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@index([authorId])
  @@index([status])
  @@map("posts")
}
```

### 4. 页面开发

```
> 实现以下页面：
> 1. 首页（文章列表 + 分页）
> 2. 文章详情页（Markdown 渲染 + 评论）
> 3. 后台管理页（文章 CRUD）
> 4. 个人设置页
> 5. 登录/注册页
>
> 要求响应式设计，移动端适配
```

### 5. API 开发

```
> 实现以下 API 接口：
> - POST /api/auth/register     用户注册
> - POST /api/auth/login        用户登录
> - GET  /api/posts             获取文章列表
> - POST /api/posts             创建文章
> - PUT  /api/posts/:id         更新文章
> - GET  /api/posts/:slug       获取文章详情
> - POST /api/comments          发表评论
> - GET  /api/categories        获取分类列表
>
> 要求：JWT 认证、输入验证、错误处理
```

### 6. 部署配置

```
> 帮我配置部署：
> 1. 创建 vercel.json
> 2. 配置 GitHub Actions CI/CD
> 3. 添加 Dockerfile（备用部署方案）
> 4. 配置环境变量模板 .env.example
```

### 7. 完整的部署文件示例

```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npx prisma generate && next build",
  "outputDirectory": ".next",
  "installCommand": "pnpm install",
  "env": {
    "DATABASE_URL": "@database-url",
    "NEXTAUTH_SECRET": "@nextauth-secret",
    "NEXTAUTH_URL": "https://your-domain.com"
  }
}
```

---

## 总结

通过这三个实战案例，你可以看到 Claude Code 在不同场景下的强大能力：

| 场景 | 效率提升 | 适用团队规模 |
|------|----------|-------------|
| Express API | 3-5x | 1-3 人 |
| React 组件库 | 2-4x | 2-5 人 |
| 全栈博客 | 4-6x | 1-4 人 |

**关键心得**：
1. **分步提问**比一次给出所有需求效果更好
2. **提供上下文**（技术栈、现有代码风格）能提高代码质量
3. **及时验证**——让 Claude 生成代码后立即测试
4. **善用 CLAUDE.md**——把项目约定写进去，避免重复说明

---

*遇到问题？查看 [常见问题](./faq.md) 获取帮助。*
