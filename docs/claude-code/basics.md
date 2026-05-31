# Claude Code 基础用法

## 一、启动方式

### 交互模式（最常用）

```bash
# 进入项目目录后启动
cd my-project
claude
```

启动后你会看到一个交互式界面，直接输入你的需求即可。

### 单次命令模式

```bash
# 直接在命令行传入问题
claude "解释一下 src/utils.js 的功能"

# 适合快速查询，不进入交互模式
claude --print "列出项目中所有的 TODO 注释"
```

### 从文件读取输入

```bash
# 从文件读取提示词
claude < prompt.txt

# 管道输入
echo "分析这个项目的架构" | claude
```

## 二、核心命令

### 对话控制

| 命令 | 说明 |
|------|------|
| `/help` | 显示帮助信息 |
| `/clear` | 清空当前对话上下文 |
| `/compact` | 压缩对话历史，节省 token |
| `/cost` | 显示当前会话的 token 用量 |
| `/exit` | 退出 Claude Code |

### 文件与代码操作

| 命令 | 说明 |
|------|------|
| `/read <file>` | 读取指定文件 |
| `/write <file>` | 创建或写入文件 |
| `/edit <file>` | 编辑文件内容 |

### Git 操作

| 命令 | 说明 |
|------|------|
| `/git status` | 查看 git 状态 |
| `/git diff` | 查看变更差异 |
| `/git commit` | 创建提交 |

### 快捷键

| 快捷键 | 说明 |
|--------|------|
| `Enter` | 发送消息 |
| `Shift+Enter` | 换行（不发送） |
| `Esc` | 取消当前生成 |
| `Ctrl+C` | 中断当前操作 |

## 三、常用场景

### 场景 1：分析项目结构

```
> 帮我分析一下这个项目的整体架构，包括主要模块和它们之间的关系
```

Claude Code 会：
1. 读取项目根目录的文件结构
2. 分析 `package.json` 或其他配置文件
3. 读取主要源代码文件
4. 输出清晰的架构分析

### 场景 2：编写新功能

```
> 在 src/api/ 下创建一个用户认证模块，包含登录、注册、
> 密码重置功能，使用 JWT 认证
```

Claude Code 会：
1. 先了解项目现有的技术栈和代码风格
2. 创建必要的文件结构
3. 实现完整的功能代码
4. 添加必要的类型定义
5. 询问是否需要编写测试

### 场景 3：调试 Bug

```
> 用户报告说登录接口返回 500 错误，帮我排查一下
> 错误日志：TypeError: Cannot read property 'hash' of undefined
> at AuthController.login (src/controllers/auth.js:42:25)
```

Claude Code 会：
1. 定位到出错的文件和行号
2. 分析上下文代码
3. 找出问题原因
4. 提供修复方案并直接修改

### 场景 4：代码重构

```
> src/services/ 下的 UserService.js 太长了，帮我拆分成
> 更小的模块，按照职责分离原则重构
```

Claude Code 会：
1. 分析现有代码的职责划分
2. 提出重构方案
3. 逐步执行重构
4. 确保功能不变

### 场景 5：编写测试

```
> 为 src/utils/math.js 中的所有导出函数编写单元测试，
> 使用 Jest 框架，覆盖率目标 90% 以上
```

Claude Code 会：
1. 读取被测试文件的代码
2. 分析函数签名和边界情况
3. 创建测试文件
4. 运行测试确认通过

## 四、实用提示词模板

### 代码审查

```
审查以下文件的代码质量，关注：
1. 潜在的 bug 和安全问题
2. 性能优化机会
3. 代码风格一致性
4. 错误处理是否完善
```

### 文档生成

```
为 src/api/ 目录下的所有接口生成 API 文档，
使用 OpenAPI 3.0 格式，包含请求示例和响应说明
```

### 性能优化

```
分析这个项目的性能瓶颈，特别是：
1. 数据库查询效率
2. 前端渲染性能
3. 打包体积优化
给出具体的优化建议和代码修改
```

### 代码迁移

```
将这个项目从 JavaScript 迁移到 TypeScript，
保持功能不变，逐步添加类型定义
```

## 五、最佳实践

### 1. 提供清晰的上下文

```
❌ "修复这个 bug"
✅ "src/api/orders.js 第 87 行的 calculateTotal 函数在
   处理空购物车时抛出 TypeError，帮我修复"
```

### 2. 分步骤完成复杂任务

```
第一步：分析现有的数据模型
第二步：设计新的 API 接口
第三步：实现后端逻辑
第四步：编写前端页面
第五步：添加测试
```

### 3. 善用 `/compact` 保持上下文

长时间对话时，使用 `/compact` 压缩历史，避免超出上下文窗口：

```
/compact 保留最近的关键信息，删除中间讨论过程
```

### 4. 结合 IDE 使用

Claude Code 处理逻辑和架构，IDE 处理实时预览和调试：

```bash
# 终端 1：Claude Code
claude

# 终端 2：开发服务器
npm run dev

# IDE：编辑器 + 浏览器预览
```

## 六、常用命令详解

### 文件操作命令

```bash
# 读取文件
> read src/main.js

# 写入文件
> write src/utils.js "function add(a, b) { return a + b; }"

# 编辑文件
> edit src/main.js
# 然后告诉 Claude 要修改什么

# 搜索文件
> search *.py
> search src/ "function"
```

### 终端命令

```bash
# 执行 npm 命令
> bash npm install
> bash npm run build
> bash npm test

# 执行 git 命令
> bash git status
> bash git diff
> bash git log --oneline

# 列出目录
> ls src/
> ls -la
```

### Claude Code 专用命令

```bash
# 初始化项目配置
> /init

# 查看帮助
> /help

# 退出
> /quit
> /exit

# 清除对话历史
> /clear

# 压缩对话历史
> /compact

# 查看 token 用量
> /cost
```

## 七、实用场景示例

### 场景 1：代码审查

```bash
# 启动 Claude Code
claude

# 请求代码审查
> 请审查 src/api/auth.js 的代码质量
> 关注安全性、错误处理和性能

# 让 Claude 修复问题
> 请修复你发现的问题
```

### 场景 2：学习新框架

```bash
# 启动 Claude Code
claude

# 学习 React
> 我想学习 React，请从基础开始教我
> 先解释什么是组件

# 实践学习
> 请帮我创建一个简单的 Todo 应用
> 使用 React 和 TypeScript
```

### 场景 3：优化性能

```bash
# 启动 Claude Code
claude

# 分析性能
> 请分析 src/utils/dataProcessor.js 的性能问题
> 这个函数处理大数据时很慢

# 实施优化
> 请按照你的建议优化这个函数
```

### 场景 4：编写文档

```bash
# 启动 Claude Code
claude

# 生成 API 文档
> 请为 src/api/users.js 生成 API 文档
> 使用 OpenAPI 3.0 格式

# 生成 README
> 为这个项目生成详细的 README.md
```

### 场景 5：数据库操作

```bash
# 启动 Claude Code
claude

# 设计数据库
> 请为这个电商项目设计数据库
> 需要用户、商品、订单、支付等表

# 生成 SQL
> 请生成创建这些表的 SQL 语句
```

## 八、错误处理和调试

### 常见错误及解决方案

#### 错误 1：Token 超出限制

```
错误信息：Context window exceeded
解决方案：
> /compact  # 压缩对话历史
> 或者重新启动 Claude Code
```

#### 错误 2：文件不存在

```
错误信息：File not found
解决方案：
> ls  # 先查看目录结构
> read src/  # 查看具体文件
```

#### 错误 3：权限被拒绝

```
错误信息：Permission denied
解决方案：
> 检查文件权限
> 使用 sudo（谨慎）
> 或者让 Claude 帮你修改权限
```

### 调试技巧

```bash
# 1. 查看 Claude 的思考过程
> 请解释你是如何得出这个结论的

# 2. 让 Claude 分析错误
> 这个错误是什么意思？如何修复？

# 3. 让 Claude 追踪代码
> 请追踪这个函数的调用链

# 4. 让 Claude 解释代码
> 请逐行解释这段代码的作用
```

## 九、性能优化技巧

### 1. 使用具体的文件路径

```bash
# ❌ 不好的做法
> 帮我修改代码

# ✅ 好的做法
> 请修改 src/utils/validation.js 中的 validateEmail 函数
```

### 2. 限制搜索范围

```bash
# ❌ 不好的做法
> 搜索所有文件

# ✅ 好的做法
> 只搜索 src/components/ 目录
```

### 3. 使用明确的指令

```bash
# ❌ 不好的做法
> 优化代码

# ✅ 好的做法
> 请优化 src/utils/dataProcessor.js 中的 processData 函数
> 这个函数处理 10000 条数据时需要 5 秒，目标是优化到 1 秒以内
```

### 4. 分步骤执行

```bash
# 第一步：分析
> 请先分析这个问题

# 第二步：设计
> 基于你的分析，请设计解决方案

# 第三步：实现
> 按照你的方案开始实现

# 第四步：测试
> 请测试你的实现是否正确
```

## 十、安全最佳实践

### 1. 始终确认修改

```bash
# Claude 修改文件前会请求确认
# 仔细检查修改内容再确认
```

### 2. 避免敏感信息

```bash
# ❌ 不要这样做
> 我的数据库密码是 123456，帮我配置连接

# ✅ 应该这样做
> 请帮我配置数据库连接，使用环境变量
```

### 3. 使用版本控制

```bash
# 在修改重要文件前
> 请先创建一个分支
> 然后再进行修改
```

### 4. 审查生成的代码

```bash
# 生成代码后
> 请解释你生成的代码
> 让我确认每一步的逻辑
```

---

*掌握了基础用法后，前往 [高级技巧](./advanced.md) 了解更强大的功能。*
