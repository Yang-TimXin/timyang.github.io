# OpenClaw 实战案例

> 从理论到实践，用 OpenClaw 打造真正的私人助手。

## 案例一：打造私人助手

### 场景描述

你希望有一个 AI 助手，能帮你处理日常事务：查天气、管日程、回复消息、整理笔记。

### 搭建步骤

#### 1. 基础配置

```json
// openclaw.json
{
  "agent": {
    "name": "小助手",
    "systemPrompt": "你是一个友好的私人助手，擅长日程管理、信息查询和任务协调。回复简洁有用。",
    "tools": ["read", "write", "exec", "web_search", "web_fetch", "browser", "memory_search"]
  },
  "channels": {
    "weixin": { "enabled": true },
    "telegram": { "enabled": true }
  },
  "heartbeat": {
    "enabled": true,
    "interval": 1800000,
    "prompt": "检查日程和待办事项"
  }
}
```

#### 2. 创建 Agent 行为指南

```markdown
<!-- AGENTS.md -->
# 私人助手行为准则

## 日程管理
- 每天早上 9 点检查日程
- 重要事项提前 30 分钟提醒
- 使用 `exec` 运行日历命令

## 信息查询
- 使用 `web_search` 搜索信息
- 使用 `web_fetch` 获取网页内容
- 总结时要简洁明了

## 笔记整理
- 使用 `write` 保存重要信息
- 使用 `read` 读取已有笔记
- 定期整理 memory 目录
```

#### 3. 使用示例

```
用户：明天有什么安排？

Agent：
让我查看一下你的日程...

exec: cat ~/calendar/tomorrow.json

你明天有：
- 10:00 团队周会
- 14:00 客户会议
- 16:30 牙医预约

需要我设置提醒吗？
```

### 进阶功能

#### 定时任务

```json
// 创建定时任务
{
  "cron": {
    "jobs": [
      {
        "name": "早间简报",
        "schedule": "0 8 * * 1-5",
        "prompt": "生成今日简报：天气、日程、待办事项",
        "channel": "weixin"
      },
      {
        "name": "晚间回顾",
        "schedule": "0 22 * * *",
        "prompt": "回顾今天的工作，记录到 memory 目录",
        "channel": "telegram"
      }
    ]
  }
}
```

#### 多通道协作

```
用户（微信）：帮我查一下 Python 3.12 的新特性

Agent：让我搜索一下...

web_search: "Python 3.12 new features"

找到了！Python 3.12 主要新特性：
1. 类型系统改进
2. f-string 改进
3. 性能提升

详细信息已保存到 notes/python312.md

用户（Telegram）：把刚才 Python 3.12 的笔记发到 Discord

Agent：好的，让我读取笔记并发送...

read: notes/python312.md
message: (发送到 Discord)
```

## 案例二：自动化工作流

### 场景：自动化代码审查

自动监控 GitHub 仓库，对新 PR 进行初步审查。

#### 1. 安装 GitHub 插件

```bash
openclaw plugin install openclaw-github
```

#### 2. 配置

```json
{
  "plugins": {
    "github": {
      "token": "${GITHUB_TOKEN}",
      "repos": ["your-org/your-repo"]
    }
  },
  "cron": {
    "jobs": [
      {
        "name": "PR 审查",
        "schedule": "*/30 * * * *",
        "prompt": "检查 GitHub 仓库的待审查 PR，对每个 PR 进行初步代码审查",
        "tools": ["exec", "web_fetch"]
      }
    ]
  }
}
```

#### 3. Agent 执行流程

```
用户：检查 PR #123

Agent：
让我查看这个 PR 的变更...

exec: gh pr diff 123

代码变更分析：
- 文件: src/utils.py
- 变更: 修改了数据处理逻辑
- 问题: 缺少错误处理

建议：
1. 添加 try-except 块
2. 增加日志记录
3. 补充单元测试

需要我自动添加 review comment 吗？
```

### 场景：自动化文档生成

#### 1. 创建文档生成技能

```markdown
<!-- skills/doc-gen/SKILL.md -->
# 文档生成技能

## 触发条件
当用户要求生成文档时激活。

## 执行步骤

1. 使用 `read` 读取源代码文件
2. 分析代码结构和功能
3. 使用 `web_search` 搜索文档模板
4. 生成文档并保存

## 输出格式
- README.md
- API 文档
- 使用说明
```

#### 2. 使用示例

```
用户：帮我给这个项目生成文档

Agent：好的，让我先读取项目结构...

exec: find . -name "*.py" -type f | head -20

发现 15 个 Python 文件，开始分析...

read: main.py
read: utils.py
read: models.py

正在生成文档...

write: docs/README.md
write: docs/api.md
write: docs/usage.md

文档已生成：
- docs/README.md - 项目介绍
- docs/api.md - API 文档
- docs/usage.md - 使用说明
```

## 案例三：多通道协作

### 场景：团队协作助手

一个 AI 助手同时服务多个团队成员，通过不同通道接收任务。

#### 1. 多用户配置

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "allowedUsers": {
        "123456": {
          "name": "张三",
          "role": "developer",
          "permissions": ["read", "write", "exec"]
        },
        "789012": {
          "name": "李四",
          "role": "manager",
          "permissions": ["read", "write"]
        }
      }
    },
    "discord": {
      "enabled": true,
      "guildId": "team-server-id",
      "allowedChannels": ["dev-channel", "manager-channel"]
    }
  }
}
```

#### 2. 权限控制

```json
// AGENTS.md 中添加权限控制
{
  "permissions": {
    "developer": {
      "tools": ["read", "write", "exec", "web_search"],
      "shellAllowed": true
    },
    "manager": {
      "tools": ["read", "write", "web_search"],
      "shellAllowed": false
    },
    "viewer": {
      "tools": ["read"],
      "shellAllowed": false
    }
  }
}
```

#### 3. 使用示例

```
[Telegram - 张三(开发者)]
张三：帮我运行一下测试

Agent：好的，正在运行测试...

exec: npm test

测试结果：
✅ 12 个测试通过
❌ 1 个测试失败

失败测试：utils.test.js - testParseDate
错误信息：期望 '2024-01-01'，得到 '2024/01/01'

需要我查看详细错误信息吗？

---

[Discord - 李四(经理)]
李四：这周的工作进度怎么样？

Agent：让我整理一下本周的工作记录...

read: memory/2024-w03.md

本周工作总结：
- 完成：用户管理模块开发
- 进行中：支付系统集成
- 待办：性能优化

关键指标：
- 代码提交：23 次
- PR 合并：5 个
- Bug 修复：8 个

详细报告已发送到 #reports 频道
```

## 案例四：个人知识库

### 场景

建立一个 AI 驱动的个人知识库，支持语义搜索和智能问答。

#### 1. 知识库结构

```
knowledge/
├── articles/          # 收藏的文章
├── notes/            # 个人笔记
├── bookmarks/        # 书签
├── index.json        # 索引文件
└── README.md         # 使用说明
```

#### 2. 知识库管理技能

```markdown
<!-- skills/knowledge/SKILL.md -->
# 知识库管理

## 功能
- 保存新知识
- 搜索知识
- 整理分类

## 保存知识
1. 提取关键信息
2. 添加标签
3. 保存到对应目录
4. 更新索引

## 搜索知识
1. 使用 memory_search 语义搜索
2. 使用 grep 关键词搜索
3. 返回相关结果
```

#### 3. 使用示例

```
用户：保存这篇文章 https://example.com/article

Agent：让我读取这篇文章...

web_fetch: https://example.com/article

文章标题：如何提高编程效率
关键要点：
1. 使用代码片段库
2. 掌握快捷键
3. 定期重构

保存到知识库...

write: knowledge/articles/2024-01-15-programming-efficiency.md

已保存！标签：#编程 #效率 #开发

---

用户：搜索一下关于性能优化的笔记

Agent：让我搜索一下...

memory_search: "性能优化"

找到 3 条相关记录：
1. 数据库查询优化 (2024-01-10)
2. 前端加载优化 (2024-01-12)
3. 缓存策略 (2024-01-14)

需要查看详细内容吗？
```

## 最佳实践总结

### 1. 渐进式配置

```bash
# 第一步：基础配置
openclaw init
openclaw config set llm.model gpt-4o
openclaw start

# 第二步：添加通道
openclaw config set channels.telegram.enabled true
openclaw restart

# 第三步：安装插件
openclaw plugin install openclaw-github

# 第四步：高级配置
openclaw config set heartbeat.enabled true
```

### 2. 安全实践

```json
{
  "security": {
    "allowShell": true,
    "shellTimeout": 30000,
    "blockedCommands": ["rm -rf", "sudo", "shutdown"],
    "allowedPaths": ["~/workspace", "~/.openclaw"],
    "maxFileSize": 10485760
  }
}
```

### 3. 监控和日志

```bash
# 查看实时日志
openclaw logs -f

# 查看特定插件日志
openclaw logs --filter "github"

# 查看错误日志
openclaw logs --level error
```

### 4. 备份策略

```bash
# 备份配置
openclaw config export > backup/config-$(date +%Y%m%d).json

# 备份记忆
cp -r memory/ backup/memory-$(date +%Y%m%d)/

# 定期清理
find backup/ -mtime +30 -delete
```

## 下一步

现在你已经掌握了 OpenClaw 的核心用法，可以：

1. 探索更多 [插件](plugins.md)
2. 学习 [浏览器自动化](browser.md) 进阶技巧
3. 加入社区分享你的使用经验
4. 开发自己的插件和技能

欢迎来到 OpenClaw 的世界！🎉
