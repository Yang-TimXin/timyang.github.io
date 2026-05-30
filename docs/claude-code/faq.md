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

*更多问题欢迎在 [GitHub Issues](https://github.com/anthropics/claude-code/issues) 中反馈。*
