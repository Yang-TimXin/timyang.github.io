# 常见问题

## 安装问题

### Q: npm install 报错怎么办？

**A:** 尝试以下解决方案：

```bash
# 清除 npm 缓存
npm cache clean --force

# 使用镜像源
npm install -g @anthropic-ai/claude-code --registry https://registry.npmmirror.com

# 或者使用 cnpm
npm install -g cnpm --registry https://registry.npmmirror.com
cnpm install -g @anthropic-ai/claude-code
```

### Q: 提示 "command not found: claude"？

**A:** 检查 npm 全局安装路径：

```bash
# 查看 npm 全局路径
npm config get prefix

# 确保该路径在 PATH 中
echo $PATH

# 或者使用 npx 运行
npx @anthropic-ai/claude-code
```

## 使用问题

### Q: Claude Code 无法读取我的文件？

**A:** 检查以下几点：

1. 确保在正确的项目目录启动
2. 检查文件权限
3. 查看是否有 `.claudeignore` 排除了文件

### Q: 响应速度很慢？

**A:** 可能的原因和解决方案：

1. **网络问题**：检查网络连接，考虑使用代理
2. **项目太大**：使用 `.claudeignore` 排除不需要的目录
3. **API 限流**：等待一段时间后重试

### Q: 如何保护敏感信息？

**A:** 采取以下措施：

1. 使用 `.claudeignore` 排除包含敏感信息的文件
2. 不要在提示词中直接包含 API Key
3. 使用环境变量管理敏感配置

```
# .claudeignore
.env
.env.local
*.key
*.pem
config/secrets.json
```

### Q: Claude Code 的代码质量如何保证？

**A:** 建议的工作流程：

1. 让 Claude 生成代码后，人工审查
2. 使用 ESLint/Prettier 自动格式化
3. 编写测试用例验证功能
4. 使用 TypeScript 增加类型安全

## 高级问题

### Q: 如何自定义 Claude Code 的行为？

**A:** 通过 `CLAUDE.md` 配置文件：

```markdown
# 项目规范

## 代码生成规则
- 必须使用 TypeScript
- 必须添加错误处理
- 必须编写注释
- 遵循 SOLID 原则
```

### Q: Claude Code 支持哪些编程语言？

**A:** Claude Code 支持几乎所有主流编程语言，包括但不限于：

- JavaScript / TypeScript
- Python
- Java
- Go
- Rust
- C / C++
- Ruby
- PHP
- Swift
- Kotlin

### Q: 如何处理大型项目？

**A:** 优化建议：

1. **分模块处理**：一次专注于一个模块
2. **使用 .claudeignore**：排除构建产物、依赖等
3. **提供明确上下文**：告诉 Claude 需要关注的文件
4. **分步骤进行**：复杂任务拆分成小步骤

## 获取帮助

如果以上内容没有解决你的问题：

1. 查看 [Anthropic 官方文档](https://docs.anthropic.com)
2. 在 GitHub 上搜索相关 issue
3. 社区论坛提问
