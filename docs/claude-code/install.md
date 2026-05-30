# 安装配置

## 系统要求

| 系统 | 最低版本 | 推荐版本 |
|------|---------|---------|
| macOS | 12.0+ | 最新 |
| Windows | 10+ | 最新 |
| Linux | Ubuntu 20.04+ | 最新 |

## 安装步骤

### 方式一：npm 安装（推荐）

```bash
npm install -g @anthropic-ai/claude-code
```

安装完成后验证：

```bash
claude --version
```

### 方式二：Homebrew（macOS）

```bash
brew install anthropic/claude/claude-code
```

### 方式三：从源码安装

```bash
git clone https://github.com/anthropics/claude-code.git
cd claude-code
npm install
npm link
```

## 首次配置

### 1. 获取 API Key

1. 访问 [Anthropic Console](https://console.anthropic.com)
2. 注册/登录账号
3. 创建 API Key
4. 复制保存

### 2. 配置环境变量

```bash
# macOS/Linux
export ANTHROPIC_API_KEY="your-api-key-here"

# Windows PowerShell
$env:ANTHROPIC_API_KEY="your-api-key-here"
```

建议将环境变量写入 shell 配置文件（如 `~/.zshrc` 或 `~/.bashrc`）以便持久化。

### 3. 首次启动

```bash
claude
```

首次启动会引导你完成基础配置。

## IDE 集成

### VS Code 集成

1. 安装 VS Code 扩展
2. 在终端中使用 `claude` 命令
3. 或使用 VS Code 内置终端

### JetBrains 集成

Claude Code 可以在任何 JetBrains IDE 的终端中使用。

## 常见安装问题

### 权限问题

```bash
# 使用 sudo（不推荐）
sudo npm install -g @anthropic-ai/claude-code

# 推荐：修改 npm 全局目录
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

### 网络问题

```bash
# 使用镜像源
npm install -g @anthropic-ai/claude-code --registry https://registry.npmmirror.com
```

## 下一步

安装完成后，前往 [基础用法](/claude-code/basics) 开始使用。
