# 实战案例

## 案例一：从零搭建 Express API

### 需求
创建一个用户管理 RESTful API，支持 CRUD 操作。

### 步骤 1：初始化项目

```
帮我初始化一个 Express + TypeScript 项目：
1. 创建 package.json
2. 安装依赖（express, typescript, @types/*）
3. 配置 tsconfig.json
4. 创建基础项目结构
```

### 步骤 2：编写数据模型

```
在 src/models/user.ts 中创建用户模型：
- id: string
- name: string
- email: string
- createdAt: Date

使用内存存储，不需要数据库。
```

### 步骤 3：实现 API 路由

```
在 src/routes/user.ts 中实现：
- GET /api/users - 获取所有用户
- GET /api/users/:id - 获取单个用户
- POST /api/users - 创建用户
- PUT /api/users/:id - 更新用户
- DELETE /api/users/:id - 删除用户

添加输入验证和错误处理。
```

### 步骤 4：编写测试

```
为所有 API 端点编写测试：
- 使用 supertest
- 覆盖正常流程和异常情况
- 测试输入验证
```

### 步骤 5：部署准备

```
添加以下部署相关配置：
1. Dockerfile
2. docker-compose.yml
3. .env.example
4. README.md
```

## 案例二：React 组件库开发

### 需求
创建一个简单的 UI 组件库，包含 Button、Input、Card 组件。

### 步骤 1：项目搭建

```
初始化 React 组件库项目：
1. 使用 Vite + React + TypeScript
2. 配置 Storybook
3. 设置 Tailwind CSS
4. 配置构建和发布流程
```

### 步骤 2：创建组件

```
创建 Button 组件：
- 支持 primary/secondary/ghost 三种类型
- 支持 small/medium/large 三种尺寸
- 支持 loading 状态
- 支持 disabled 状态
- 完整的 TypeScript 类型定义
```

### 步骤 3：编写文档

```
为 Button 组件编写 Storybook 文档：
1. 基础用法
2. 不同类型
3. 不同尺寸
4. 加载状态
5. 禁用状态
6. 事件处理
```

## 案例三：全栈博客系统

### 需求
创建一个支持 Markdown 的博客系统。

### 技术栈
- 前端：Next.js + Tailwind CSS
- 后端：Next.js API Routes
- 数据库：SQLite (Prisma ORM)
- 认证：NextAuth.js

### 实施步骤

```
Phase 1: 基础搭建
1. 初始化 Next.js 项目
2. 配置 Prisma + SQLite
3. 创建数据库模型
4. 实现基础布局

Phase 2: 核心功能
1. 用户注册/登录
2. 文章 CRUD
3. Markdown 渲染
4. 评论系统

Phase 3: 高级功能
1. 标签分类
2. 全文搜索
3. RSS 订阅
4. 暗色模式
```

## 经验总结

### 好的提示词特点

1. **具体明确**：说明文件路径、函数签名、数据结构
2. **分步骤**：复杂任务拆分成小步骤
3. **提供上下文**：说明技术栈、现有代码、约束条件
4. **预期输出**：说明期望的结果格式

### 常见陷阱

1. **一次要求太多**：容易出错，分步进行更可靠
2. **忽略测试**：让 AI 帮你写测试，保证代码质量
3. **不审查代码**：AI 生成的代码需要人工审查
4. **不保存上下文**：利用 CLAUDE.md 保持一致性

## 下一步

遇到问题？查看 [常见问题](/claude-code/faq)。
