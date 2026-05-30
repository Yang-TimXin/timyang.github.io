# Claude Code 高级技巧

## 一、CLAUDE.md 配置文件

CLAUDE.md 是 Claude Code 的核心配置文件，相当于给 AI 一个"项目说明书"。它让 Claude 理解你的项目约定、编码规范和工作流。

### 项目级 CLAUDE.md

在项目根目录创建 `CLAUDE.md`：

```markdown
# 项目说明

## 技术栈
- 前端：React 18 + TypeScript + Vite
- 后端：Node.js + Express + Prisma
- 数据库：PostgreSQL
- 测试：Vitest + Testing Library

## 代码规范
- 使用 2 空格缩进
- 使用单引号字符串
- 组件使用 PascalCase 命名
- 工具函数使用 camelCase 命名

## 项目结构
- src/components/ — 可复用 UI 组件
- src/pages/ — 页面组件
- src/api/ — API 路由和控制器
- src/lib/ — 工具函数和配置
- prisma/ — 数据库 schema

## 重要约定
- 所有 API 必须有错误处理
- 数据库操作使用 Prisma，禁止原生 SQL
- 组件必须有 TypeScript 类型定义
- Git 提交信息遵循 Conventional Commits 规范
```

### 用户级 CLAUDE.md

在 `~/.claude/CLAUDE.md` 中放置个人偏好：

```markdown
# 个人偏好

## 语言
- 回复使用中文
- 代码注释使用英文

## 编码习惯
- 优先使用函数式编程
- 避免使用 any 类型
- 错误处理要详细，包含用户友好的消息
```

### 目录级 CLAUDE.md

在特定目录下放置更具体的指令：

```markdown
# src/api/CLAUDE.md

## API 开发规范
- 所有路由使用 Express Router
- 控制器函数返回统一格式：{ success, data, error }
- 使用 Zod 进行请求参数验证
- 每个接口必须有 JSDoc 注释
```

## 二、自定义指令技巧

### 链式指令

```
请按以下步骤执行：
1. 先读取 src/config/database.ts 了解数据库配置
2. 分析 prisma/schema.prisma 中的数据模型
3. 检查现有 API 中是否有 N+1 查询问题
4. 输出优化建议和修改后的代码
```

### 角色扮演

```
你是一个资深的 DevOps 工程师。请审查这个项目的部署配置，
从安全性、可扩展性、成本三个维度给出建议。
假设这是一个面向中国用户的 SaaS 应用，日活约 10 万。
```

### 约束条件

```
重构 src/utils/helpers.ts，要求：
- 不能改变任何导出函数的签名
- 保持向后兼容
- 所有新函数必须有 TypeScript 类型
- 测试覆盖率不能下降
```

## 三、高效提示词模板

### 模板 1：功能开发

```markdown
## 需求
实现用户个人资料编辑功能

## 技术要求
- 前端：React 表单 + Formik + Yup 验证
- 后端：Express PATCH 接口
- 数据库：Prisma 更新操作

## 具体需求
1. 前端表单包含：用户名、邮箱、头像、简介
2. 支持头像上传（限制 2MB，格式 jpg/png）
3. 表单验证：用户名必填且 3-20 字符，邮箱格式验证
4. 后端验证：邮箱唯一性检查
5. 保存成功后显示提示并跳转

## 参考
- 参考 src/components/UserSettings/ 的现有代码风格
- API 格式参考 src/api/users.ts
```

### 模板 2：Bug 修复

```markdown
## Bug 描述
用户反馈：在移动端下拉选择框点击无响应

## 复现步骤
1. 在 iPhone 14 上打开 /dashboard
2. 点击"选择项目"下拉框
3. 选项列表出现后点击某个选项
4. 下拉框关闭但选中值未更新

## 环境信息
- 浏览器：Safari 17.2
- 组件：src/components/Select/index.tsx
- 相关依赖：react-select v5.8.0

## 已尝试
- 清除缓存无效
- 电脑端正常
- 其他下拉框也有同样问题
```

### 模板 3：代码审查

```markdown
请审查以下文件，重点关注：

## 审查维度
1. **安全性**：XSS、SQL 注入、敏感信息泄露
2. **性能**：不必要的渲染、内存泄漏、大列表处理
3. **可维护性**：代码重复、复杂度、命名规范
4. **错误处理**：异常捕获、用户反馈、日志记录

## 输出格式
按严重程度分为：
- 🔴 必须修复
- 🟡 建议优化
- 🟢 小建议

每个问题给出：位置、问题描述、修改建议
```

## 四、工作流自动化

### Git 工作流

```
# 功能开发完成后，让 Claude 帮你完成 Git 流程：
> 帮我把刚才的修改提交到 Git，创建一个新分支 feature/user-profile-edit，
> 提交信息用中文，遵循 Conventional Commits
```

### CI/CD 配合

```
> 读取 .github/workflows/ci.yml，分析 CI 流程，
> 然后帮我添加一个 lint 检查步骤
```

### 代码审查自动化

```
> 对比 main 分支和当前分支的差异，做一次完整的代码审查，
> 输出审查报告
```

## 五、高级技巧汇总

### 1. 利用 `/compact` 管理长对话

```
/compact 请保留以下信息：
- 我们正在开发用户认证模块
- 数据库使用 PostgreSQL + Prisma
- 已完成登录和注册接口
- 下一步要做密码重置
```

### 2. 批量操作

```
> 批量重命名 src/components/ 下所有文件：
> 将 xxx.tsx 改为 Xxx.tsx（首字母大写）
> 同时更新所有 import 语句
```

### 3. 项目初始化

```
> 帮我从零初始化一个 Next.js 14 项目：
> - 使用 App Router
> - TypeScript + Tailwind CSS
> - ESLint + Prettier 配置
> - GitHub Actions CI/CD
> - Docker 部署配置
```

### 4. 代码迁移

```
> 帮我把这个项目从 Webpack 迁移到 Vite：
> 1. 分析现有 Webpack 配置
> 2. 创建等效的 Vite 配置
> 3. 更新 package.json 脚本
> 4. 测试确认所有功能正常
```

## 六、性能优化建议

### 减少 Token 消耗

```bash
# 用 /compact 压缩对话
/compact

# 针对性提问，避免让 Claude 扫描不必要的文件
> 读取 src/api/auth.ts 并分析其中的 JWT 验证逻辑
```

### 并行任务

```
同时帮我做两件事：
1. 为 src/utils/ 下的工具函数编写测试
2. 更新 README.md 中的 API 文档
```

---

*更多实战案例请查看 [实战案例](./workflows.md)。*
