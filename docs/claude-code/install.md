# Claude Code 安装与配置

## 一、系统要求

### 操作系统

| 系统 | 最低版本 | 推荐 |
|------|----------|------|
| macOS | 12.0 (Monterey) | 14.0+ (Sonoma) |
| Linux | Ubuntu 20.04 / Debian 11 | Ubuntu 22.04+ |
| Windows | 10 (Build 19041) | Windows 11 |

### 环境依赖

- **Node.js**：v18.0 或更高版本（推荐 v20 LTS）
- **npm**：v9.0 或更高版本（随 Node.js 一起安装）
- **Git**：任意较新版本
- **终端**：macOS Terminal、iTerm2、Windows Terminal、PowerShell 等

### API Key

Claude Code 需要 Anthropic API Key 才能运行：

- 前往 [Anthropic Console](https://console.anthropic.com/) 注册账号
- 在 API Keys 页面创建新的密钥
- 密钥格式为 `sk-ant-api03-...`

## 二、安装步骤

### 方式一：通过 npm 全局安装（推荐）

```bash
# 安装 Claude Code
npm install -g @anthropic-ai/claude-code

# 验证安装
claude --version
```

### 方式二：通过 npx 临时使用

如果不想全局安装，可以直接运行：

```bash
npx @anthropic-ai/claude-code
```

### 方式三：macOS 用户可通过 Homebrew

```bash
# 添加 tap（如果尚未添加）
brew tap anthropic-ai/claude

# 安装
brew install claude
```

## 三、API Key 配置

### 方法一：环境变量（推荐）

```bash
# 在 shell 配置文件中添加（~/.zshrc 或 ~/.bashrc）
export ANTHROPIC_API_KEY="sk-ant-api03-xxxxxxxxxxxx"

# 重新加载配置
source ~/.zshrc  # 或 source ~/.bashrc
```

### 方法二：首次启动时交互式输入

```bash
claude
# 首次启动会提示输入 API Key
# 粘贴你的 Key 并回车即可
```

### 方法三：使用 .env 文件

在项目根目录创建 `.env` 文件：

```env
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxx
```

> **安全提示**：务必将 `.env` 添加到 `.gitignore` 中！

### API Key 安全最佳实践

```bash
# 使用direnv管理项目级环境变量（推荐）
# 安装direnv
brew install direnv  # macOS
apt install direnv   # Linux

# 创建 .envrc
echo 'export ANTHROPIC_API_KEY="your-key-here"' > .envrc
direnv allow
```

## 四、IDE 集成

### VS Code 集成

Claude Code 可以直接在 VS Code 的终端中运行：

1. 安装 VS Code
2. 打开内置终端（`` Ctrl+` ``）
3. 在终端中运行 `claude` 启动

**推荐配置**：

```json
// .vscode/settings.json
{
  "terminal.integrated.defaultProfile.windows": "PowerShell",
  "terminal.integrated.fontSize": 14
}
```

### JetBrains IDE 集成

1. 打开 IDE 内置终端（View → Tool Windows → Terminal）
2. 运行 `claude` 启动
3. Claude Code 会自动检测项目结构

### Neovim / Vim 集成

通过终端分屏使用：

```vim
" 在 .vimrc 中配置快捷键
nnoremap <leader>cc :terminal claude<CR>
```

### tmux 分屏工作流

```bash
# 创建分屏
tmux new-session -s dev

# 左边编辑代码，右边运行 Claude Code
# Ctrl+B, % 分屏
# Ctrl+B, → 切换到右窗格
# 运行 claude
```

## 五、代理配置（中国开发者）

由于网络原因，中国开发者可能需要配置代理：

### 设置 HTTP 代理

```bash
# 临时设置
export HTTP_PROXY="http://127.0.0.1:7890"
export HTTPS_PROXY="http://127.0.0.1:7890"

# 或者在 .zshrc / .bashrc 中永久设置
```

### 使用 Clash / V2Ray

确保终端能够访问外部网络：

```bash
# 测试连接
curl https://api.anthropic.com/v1/messages

# 如果代理工具不走终端，尝试
export ALL_PROXY="socks5://127.0.0.1:7890"
```

## 六、验证安装

```bash
# 检查版本
claude --version

# 检查 API 连接
claude --print "Hello, are you working?"

# 如果看到回复，说明安装成功
```

## 七、更新 Claude Code

```bash
# npm 全局更新
npm update -g @anthropic-ai/claude-code

# 或指定版本安装
npm install -g @anthropic-ai/claude-code@latest
```

## 八、卸载

```bash
# npm 卸载
npm uninstall -g @anthropic-ai/claude-code

# 清理配置文件
rm -rf ~/.claude  # 注意：会删除所有配置和对话历史
```

---

*安装完成后，前往 [基础用法](./basics.md) 了解如何使用 Claude Code。*
