# NeoCLI 基础功能说明

本文档介绍**稳定生产版**（`bun run build`）可用的全部功能。全功能开发版（`bun run build:dev:full`）在此基础上多了实验性功能，参见 [FEATURES-DEV.md](./FEATURES-DEV.md)。

---

## 构建说明

| 命令 | 输出 | 说明 |
|------|------|------|
| `bun run build` | `./NeoCLI.exe` | 基础生产版，仅含默认功能 |
| `bun run build:dev:full` | `./NeoCLI-dev.exe` | 全功能开发版，全部 36 个实验功能 |
| `bun run dev` | 无（直接运行） | 从源码运行，不编译 |

---

## 目录

- [会话管理](#会话管理)
- [配置与个性化](#配置与个性化)
- [文件与代码操作](#文件与代码操作)
- [诊断与状态](#诊断与状态)
- [权限与安全](#权限与安全)
- [Agent 与 MCP](#agent-与-mcp)
- [Git 与 PR](#git-与-pr)
- [IDE 集成](#ide-集成)
- [高级控制](#高级控制)
- [其他](#其他)

---

## 会话管理

| 命令 | 说明 |
|------|------|
| `/clear` | 清除当前对话历史，释放上下文。别名：`/reset`、`/new` |
| `/compact` | 压缩对话历史：清除详细对话但保留摘要。可选参数：`/compact [额外指示]` |
| `/resume` | 恢复之前的对话，从上次中断的地方继续。别名：`/continue` |
| `/rename` | 重命名当前对话，方便在历史列表中找到 |
| `/export` | 导出当前对话到文件或剪贴板 |
| `/copy` | 复制 NeoCLI 的最后一条回复。`/copy 3` 可复制倒数第 3 条 |
| `/branch` | 从当前对话节点创建分支，在新分支上继续（不回影响原对话） |
| `/rewind` | 把代码或对话恢复到之前的某个时间点。别名：`/checkpoint` |
| `/context` | 可视化显示当前上下文使用情况（彩色方块格子图） |
| `/plan` | 开启计划模式，让 NeoCLI 先出方案再写代码 |
| `/cost` | 显示当前会话的总花费和时长 |
| `/btw` | 快速问一个旁路问题，不打断主对话 |
| `/exit` | 退出 NeoCLI。别名：`/quit` |

---

## 配置与个性化

| 命令 | 说明 |
|------|------|
| `/config` | 打开配置面板，管理 settings.json。别名：`/settings` |
| `/model` | 切换 AI 模型（主模型、Opus、Sonnet、Haiku 等） |
| `/effort` | 设定模型思考深度：`low`（快但浅）、`medium`、`high`、`max`（慢但深） |
| `/fast` | 切换快速模式（减少输出细节，响应更快） |
| `/theme` | 切换终端主题配色 |
| `/color` | 设定当前会话的提示栏颜色 |
| `/output-style` | 已废弃，改用 `/config` → output style |
| `/statusline` | 配置终端状态栏显示 |
| `/vim` | 切换 Vim 编辑模式 / 普通编辑模式 |
| `/keybindings` | 打开或创建键盘快捷键配置文件 |
| `/status` | 显示 NeoCLI 状态：版本、模型、账户、API 连接、工具状态 |

---

## 文件与代码操作

| 命令 | 说明 |
|------|------|
| `/init` | 初始化 NeoCLI.md 项目指引文件（分析项目代码自动生成） |
| `/add-dir` | 添加新的工作目录到当前会话 |
| `/diff` | 查看未提交的改动和每轮对话的 diff |
| `/review` | Review 一个 GitHub Pull Request |
| `/pr-comments` | 获取 GitHub PR 的评论 |
| `/security-review` | 对当前分支的未提交改动做安全检查 |

---

## 诊断与状态

| 命令 | 说明 |
|------|------|
| `/doctor` | 诊断 NeoCLI 安装状态，检查配置是否正确 |
| `/status` | 显示版本、模型、账户、API 连通性、工具状态 |
| `/context` | 可视化当前上下文使用量 |
| `/cost` | 当前会话 API 花费统计 |
| `/stats` | 查看你的 NeoCLI 使用统计数据 |
| `/tasks` | 列出和管理后台任务。别名：`/bashes` |
| `/feedback` | 提交使用反馈或 Bug 报告。别名：`/bug` |

---

## 权限与安全

| 命令 | 说明 |
|------|------|
| `/permissions` | 管理工具的允许/拒绝/询问规则。别名：`/allowed-tools` |
| `/sandbox` | 开关沙箱模式（隔离命令执行环境） |

### 权限规则语法

```
/ permissions

allow  Read   # 无条件允许读文件
deny  Bash  git push*  # 禁止 git push
ask   Write *.env       # 写 .env 文件时询问确认
```

---

## Agent 与 MCP

| 命令 | 说明 |
|------|------|
| `/agents` | 管理 Agent 配置（创建、编辑、删除自定义 Agent） |
| `/mcp` | 管理 MCP 服务器（连接、配置、开关） |

---

## Git 与 PR

| 命令 | 说明 |
|------|------|
| `/review` | Review 一个 GitHub PR |
| `/pr-comments` | 查看 GitHub PR 评论 |
| `/diff` | 查看未提交的改动及 diff 历史 |

---

## IDE 集成

| 命令 | 说明 |
|------|------|
| `/ide` | 管理 IDE 集成，查看连接状态 |
| `/install-github-app` | 为仓库安装 NeoCLI GitHub Actions |

---

## 高级控制

| 命令 | 说明 |
|------|------|
| `/sandbox` | 开关命令执行隔离沙箱 |
| `/hooks` | 查看工具事件的钩子配置（PreToolUse、PostToolUse 等） |
| `/memory` | 编辑 NeoCLI 记忆文件 |

---

## 其他

| 命令 | 说明 |
|------|------|
| `/help` | 查看帮助和所有可用命令 |
| `/release-notes` | 查看版本更新日志 |
| `/init` | 创建 NeoCLI.md 项目指引 |
| `/skills` | 列出所有可用技能（Skills） |
| `/reload-plugins` | 激活等待中的插件变更 |
| `/plugin` | 管理插件（安装、卸载、浏览）。别名：`/plugins`、`/marketplace` |
| `/terminal-setup` | 安装 Shift+Enter 绑定，用于在终端中输入换行（非原生终端） |
| `/mobile` | 显示移动端 App 下载二维码 |

---

## 常用组合操作

```
/clear                 # 卡住了？清空对话重来
/compact               # 上下文快满了？压缩一下
/doctor                # 出问题了？先跑诊断
/status                # 快速看当前状态
/permissions           # 被权限挡了？来这改规则
/config                # 改全局配置
```

---

## 启动参数

| 参数 | 说明 |
|------|------|
| `--dangerously-skip-permissions` | 跳过所有工具权限确认（全自动模式） |
| `--resume GUID` | 恢复指定 GUID 的对话 |
| `--resume-last` | 恢复最近一次对话 |
| `--model <name>` | 临时指定模型 |
| `--settings <path>` | 使用指定路径的 settings.json |
| `-p "<prompt>"` | 非交互模式：直接执行一段 prompt 后退出 |
| `-c "<command>"` | 执行 slash 命令 |

---

> **提示**：全功能开发版（`build:dev:full`）额外提供 36 个实验功能和更多命令，详见 [FEATURES-DEV.md](./FEATURES-DEV.md)。
