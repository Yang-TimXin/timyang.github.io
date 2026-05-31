# Claude Code 常见问题

## 一、安装问题

### Q1: `npm install -g` 报权限错误

**错误信息**：
```
npm ERR! code EACCES
npm ERR! permission denied
```

**解决方案**：

```bash
# 方案 1：使用 nvm 管理 Node.js（推荐）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 20
nvm use 20

# 方案 2：修复 npm 全局目录权限（Linux/macOS）
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# 方案 3：Windows 用户使用管理员权限打开终端
```

### Q2: Node.js 版本过低

**错误信息**：
```
Error: Claude Code requires Node.js 18.0 or higher
```

**解决方案**：

```bash
# 检查当前版本
node --version

# 升级到最新 LTS
nvm install 20
nvm use 20

# 验证
node --version  # 应显示 v20.x.x
```

### Q3: Windows 上安装失败

**常见原因**：
- 路径过长
- 杀毒软件拦截
- 网络代理问题

**解决方案**：

```bash
# 1. 启用 Windows 长路径支持（需要管理员权限）
reg add "HKLM\SYSTEM\CurrentControlSet\Control\FileSystem" /v LongPathsEnabled /t REG_DWORD /d 1 /f

# 2. 临时关闭杀毒软件后重试

# 3. 配置代理
npm config set proxy http://127.0.0.1:7890
npm config set https-proxy http://127.0.0.1:7890
```

### Q4: 网络连接超时

**问题**：在中国大陆可能无法直接访问 npm registry 和 Anthropic API。

**解决方案**：

```bash
# 使用淘宝镜像安装 npm 包
npm config set registry https://registry.npmmirror.com

# 安装完成后切换回官方源
npm config set registry https://registry.npmjs.org

# 配置代理访问 Anthropic API
export HTTPS_PROXY="http://127.0.0.1:7890"
```

---

## 二、API Key 问题

### Q5: API Key 无效或过期

**错误信息**：
```
AuthenticationError: Invalid API key
```

**排查步骤**：

```bash
# 1. 检查环境变量是否设置
echo $ANTHROPIC_API_KEY

# 2. 检查 Key 格式（应该以 sk-ant- 开头）
# 3. 登录 Anthropic Console 检查 Key 状态
# 4. 如果过期，创建新的 Key
```

### Q6: API 额度用完

**错误信息**：
```
Error: Rate limit exceeded
```

**解决方案**：
- 检查 [Anthropic Console](https://console.anthropic.com/) 的使用量
- 升级 Plan 或等待额度重置
- 使用 `/compact` 减少 token 消耗

---

## 三、使用问题

### Q7: Claude 不理解我的项目

**问题**：Claude 的回答偏离你的项目实际。

**解决方案**：

```
# 1. 创建 CLAUDE.md 文件，说明项目上下文
在项目根目录创建 CLAUDE.md，写入：
- 技术栈
- 项目结构
- 编码规范
- 重要约定

# 2. 提问时提供更多上下文
❌ "修复这个 bug"
✅ "src/api/orders.js 中的 calculateTotal 函数在处理空数组时抛出错误，
   请查看该函数并修复边界情况"

# 3. 使用 /compact 后重新描述上下文
```

### Q8: 生成的代码风格不一致

**解决方案**：

```markdown
# 在 CLAUDE.md 中明确代码风格
## 代码规范
- 使用 2 空格缩进
- 使用单引号
- 语句末尾加分号
- 优先使用 const，避免 var
- 函数组件使用箭头函数
```

### Q9: 对话上下文丢失

**问题**：长对话后 Claude 忘记之前讨论的内容。

**解决方案**：

```bash
# 使用 /compact 压缩上下文
/compact 保留以下关键信息：
- 项目使用 React + TypeScript
- 正在开发用户认证模块
- 已完成登录接口，正在做注册功能

# 定期清理不必要的上下文
/clear  # 如果需要全新开始
```

### Q10: Claude 生成了错误的代码

**应对策略**：

```
# 1. 明确指出问题
> 你生成的代码中，第 15 行的类型定义有问题，
>应该使用 string 而不是 number

# 2. 提供正确示例
> 参考 src/utils/format.ts 中的 formatDate 函数，
> 用类似的模式重写这个函数

# 3. 分步骤验证
> 先只生成函数签名，不要写实现
> 确认签名正确后再写完整实现
```

### Q11: 命令执行被拒绝

**问题**：Claude 请求执行某些命令但被安全策略阻止。

**解决方案**：

```bash
# 检查 .claude/settings.json 中的安全配置
cat ~/.claude/settings.json

# 如果需要允许特定命令，可以配置 allowlist
# 但请注意安全风险
```

---

## 四、性能问题

### Q12: 响应速度慢

**可能原因和解决方案**：

| 原因 | 解决方案 |
|------|----------|
| 网络延迟 | 配置代理，选择近的 API endpoint |
| 上下文过长 | 使用 `/compact` 压缩对话 |
| 项目过大 | 指定具体文件，避免扫描整个项目 |
| API 限流 | 等待后重试，或升级 Plan |

### Q13: Token 消耗过快

**优化方法**：

```bash
# 1. 针对性提问，减少无关文件扫描
> 读取 src/api/auth.ts，分析其中的登录逻辑

# 2. 定期压缩对话
/compact

# 3. 复杂任务拆分成小步骤
# 而不是一次性给出所有需求

# 4. 查看当前消耗
/cost
```

---

## 五、高级问题

### Q14: 如何在 CI/CD 中使用 Claude Code？

```bash
# 在 GitHub Actions 中使用（需要 API Key 作为 Secret）
- name: AI Code Review
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
  run: |
    npx @anthropic-ai/claude-code --print \
      "审查这次 PR 的代码变更，重点关注安全性和性能"
```

### Q15: 如何自定义 Claude Code 的行为？

```bash
# 1. 项目级配置：CLAUDE.md
# 2. 用户级配置：~/.claude/CLAUDE.md
# 3. 目录级配置：在特定目录下放置 CLAUDE.md

# 配置优先级
# 项目 CLAUDE.md > 用户 CLAUDE.md > 目录 CLAUDE.md
```

### Q16: 如何处理大型项目？

```
# 策略 1：分模块处理
> 先分析 src/api/ 目录的结构

# 策略 2：指定文件范围
> 只查看 src/components/Button/ 下的文件

# 策略 3：使用 .gitignore 排除不需要的目录
# 在项目根目录创建 .claudeignore
node_modules/
dist/
build/
*.log
```

---

## 六、故障排除清单

当遇到问题时，按以下顺序排查：

```
□ 1. 检查 Node.js 版本（需要 18+）
□ 2. 检查 Claude Code 版本（claude --version）
□ 3. 检查 API Key 是否有效
□ 4. 检查网络连接（代理配置）
□ 5. 检查磁盘空间
□ 6. 尝试重新安装（npm install -g @anthropic-ai/claude-code@latest）
□ 7. 查看错误日志
□ 8. 搜索 GitHub Issues
```

### 获取帮助

```bash
# 查看帮助
claude --help

# 查看版本
claude --version

# 重置配置
rm -rf ~/.claude
claude  # 重新开始
```

---

## 七、使用技巧常见问题

### Q17: 如何让 Claude Code 更好地理解我的代码？

**解决方案**：

```markdown
# 1. 在项目根目录创建 CLAUDE.md 文件
# 说明项目的技术栈、架构和编码规范

# 示例 CLAUDE.md：
# 技术栈：React + TypeScript + Tailwind CSS
# 项目结构：
# - src/components/ - React 组件
# - src/utils/ - 工具函数
# - src/api/ - API 接口
# 编码规范：
# - 使用函数式组件
# - 使用 TypeScript 严格模式
# - 样式使用 Tailwind CSS
```

### Q18: Claude Code 能帮我学习新技术吗？

**当然可以！**

```bash
# 1. 让 Claude 解释概念
> 什么是 React 的虚拟 DOM？
> 请用简单的比喻解释

# 2. 让 Claude 写示例代码
> 请写一个简单的 React 组件示例
> 包含详细的注释

# 3. 让 Claude 教你最佳实践
> 什么是 TypeScript 的最佳实践？
> 请给我一些具体的例子

# 4. 让 Claude 评审你的代码
> 我写的这段代码有什么问题？
> 如何改进？
```

### Q19: Claude Code 和其他 AI 编程工具相比有什么优势？

| 特性 | Claude Code | GitHub Copilot | Cursor |
|------|-------------|----------------|--------|
| 运行方式 | 命令行 | IDE 插件 | IDE |
| 上下文理解 | 整个项目 | 当前文件 | 当前项目 |
| 交互方式 | 对话式 | 代码补全 | 对话+补全 |
| 灵活性 | 高（可与任何编辑器配合） | 中（依赖特定 IDE） | 低（绑定 Cursor IDE） |
| 成本 | 按使用量计费 | 订阅制 | 订阅制 |

### Q20: 如何在团队中推广 Claude Code？

**建议步骤**：

```markdown
# 1. 从一个小项目开始
选择一个非核心项目进行试点

# 2. 建立共享的 CLAUDE.md
团队共同维护项目规范

# 3. 分享最佳实践
定期分享使用技巧和经验

# 4. 建立代码审查流程
Claude Code 生成的代码也需要人工审查

# 5. 量化效果
跟踪开发效率的提升
```

### Q21: Claude Code 能处理哪些类型的项目？

**支持的项目类型**：

```markdown
# 前端项目
- React, Vue, Angular, Svelte
- Next.js, Nuxt.js, Gatsby
- TypeScript, JavaScript

# 后端项目
- Node.js, Python, Java, Go, Rust
- Express, Django, Flask, Spring Boot
- 数据库：PostgreSQL, MySQL, MongoDB

# 移动端项目
- React Native, Flutter
- Swift (iOS), Kotlin (Android)

# 全栈项目
- Next.js + Prisma
- MERN (MongoDB, Express, React, Node.js)
- JAMstack
```

### Q22: 如何避免 Claude Code 生成不安全的代码？

**安全检查清单**：

```markdown
# 1. SQL 注入
- 确保使用参数化查询
- 不要直接拼接 SQL 字符串

# 2. XSS 攻击
- 对用户输入进行转义
- 使用 Content Security Policy

# 3. 敏感数据泄露
- 不要在代码中硬编码密码
- 使用环境变量存储敏感信息

# 4. 权限控制
- 确保 API 有适当的权限检查
- 实现角色-based 访问控制

# 5. 依赖安全
- 定期更新依赖包
- 使用 npm audit 检查漏洞
```

### Q23: Claude Code 的使用限制是什么？

**主要限制**：

```markdown
# 1. 上下文窗口限制
- 单次对话不能处理无限长的代码
- 解决方案：使用 /compact 压缩历史

# 2. 网络依赖
- 需要连接 Anthropic API
- 离线环境无法使用

# 3. 代码生成质量
- 可能生成有 bug 的代码
- 需要人工审查和测试

# 4. 安全性
- 不要在生产环境直接使用生成的代码
- 需要进行安全审查

# 5. 成本
- 按 token 使用量计费
- 大型项目可能产生较高费用
```

### Q24: 如何优化 Claude Code 的使用成本？

**成本优化技巧**：

```bash
# 1. 使用 /cost 监控消耗
> /cost

# 2. 使用 /compact 压缩历史
> /compact

# 3. 针对性提问
> 只询问必要的文件和功能

# 4. 复杂任务拆分
> 分步骤完成，而不是一次性完成

# 5. 使用 CLAUDE.md
> 减少重复说明项目背景

# 6. 避免不必要的文件扫描
> 指定具体文件路径
```

### Q25: Claude Code 未来会有什么新功能？

**可能的未来发展方向**：

```markdown
# 1. 更强的上下文理解
- 支持更大的代码库
- 更好的跨文件理解

# 2. 更多集成
- 与更多 IDE 集成
- 与 CI/CD 工具集成

# 3. 更好的协作功能
- 团队协作模式
- 代码审查集成

# 4. 更多语言支持
- 支持更多编程语言
- 更好的多语言项目支持

# 5. 性能优化
- 更快的响应速度
- 更低的成本
```

---

*更多问题欢迎在 [GitHub Issues](https://github.com/anthropics/claude-code/issues) 中反馈。*
