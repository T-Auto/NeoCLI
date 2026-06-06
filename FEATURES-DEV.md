# NeoCLI 实验性功能说明

本文档介绍**全功能开发版**（`bun run build:dev:full`）相比基础生产版额外提供的实验性功能。基础功能见 [FEATURES.md](./FEATURES.md)。

---

## 如何编译全功能版

```bash
bun run build:dev:full
```

输出文件：`./NeoCLI-dev.exe`

---

## 实验功能一览（36 项）

全功能版通过 `--feature-set=dev-full` 编译标志开启以下 36 个实验功能：

| Feature Flag | 功能说明 |
|-------------|---------|
| `ULTRATHINK` | **扩展思考模式**。允许模型使用更深度的推理能力，复杂任务表现更好 |
| `ULTRAPLAN` | **超强规划**。在远程会话中多 Agent 并行规划，适合大型重构 |
| `KAIROS_CHANNELS` | **频道系统**。支持插件/服务器频道的通知与信任模型 |
| `KAIROS_BRIEF` | **简报模式**。模型以简洁格式回复，支持主动推送通知 |
| `BRIDGE_MODE` | **远程控制**。支持从网页或移动端远程控制 NeoCLI 终端 |
| `CCR_AUTO_CONNECT` | **自动远程连接**。启动时默认连接远程控制服务 |
| `CCR_MIRROR` | **远程镜像**。本地会话自动启动仅出站的远程控制 |
| `CCR_REMOTE_SETUP` | **远程设置向导**。通过 Web 界面配置远程连接 |
| `EXTRACT_MEMORIES` | **后台记忆提取**。对话结束后自动从消息中提取并保存记忆 |
| `AGENT_MEMORY_SNAPSHOT` | **Agent 记忆快照**。自定义 Agent 的记忆持久化与自动加载 |
| `AGENT_TRIGGERS` | **Agent 定时任务**。支持 `CronCreate`/`CronDelete`/`CronList` 定时触发 |
| `AGENT_TRIGGERS_REMOTE` | **远程触发**。允许从外部来源触发 Agent 执行 |
| `TEAMMEM` | **团队记忆**。在 memdir 中管理团队级别的共享记忆文件 |
| `LODESTONE` | **深度链接**。支持 `claude-cli://` 自定义 URI 协议处理 |
| `VOICE_MODE` | **语音模式**。注册 `/voice` 命令，支持语音交互（生产版唯一默认开启的功能） |
| `AWAY_SUMMARY` | **离开摘要**。你离开电脑后自动生成对话摘要 |
| `COMPACTION_REMINDERS` | **压缩提醒**。在系统提示中加入上下文压缩提示 |
| `CACHED_MICROCOMPACT` | **缓存微压缩**。优化多轮对话中的提示缓存管理 |
| `PROMPT_CACHE_BREAK_DETECTION` | **缓存破坏检测**。监控和记录提示缓存失效原因 |
| `TOKEN_BUDGET` | **Token 预算**。提示中加入预算约束，超预算时触发压缩 |
| `SHOT_STATS` | **对话统计**。显示 API 调用次数分布和平均调用数 |
| `UNATTENDED_RETRY` | **无人值守重试**。429/529 错误时自动无限重试并保持心跳 |
| `VERIFICATION_AGENT` | **验证 Agent**。完成任务后由独立 Agent 验证才能报告完成 |
| `HOOK_PROMPTS` | **Hook 注入**。允许钩子向对话注入自定义 prompt |
| `MESSAGE_ACTIONS` | **消息操作**。对消息执行复制、编辑等快捷操作 |
| `HISTORY_PICKER` | **历史搜索**。快捷键搜索和选择历史对话 |
| `QUICK_SEARCH` | **全局搜索**。Ctrl+Shift+F 全局搜索，Ctrl+P 快速打开文件 |
| `NEW_INIT` | **新版初始化**。`/init` 支持 NeoCLI.md 多文件设置、skills、hooks |
| `BASH_CLASSIFIER` | **Bash 分类器**。基于分类的自动权限决策 |
| `TREE_SITTER_BASH` | **语法解析**。用 tree-sitter AST 解析 Bash 命令，用于权限分析 |
| `TREE_SITTER_BASH_SHADOW` | **影子解析**。并行运行 AST 解析以评估效果（不影响实际行为） |
| `POWERSHELL_AUTO_MODE` | **PowerShell 自动模式**。PS 命令像 Bash 一样自动放行 |
| `CONNECTOR_TEXT` | **Connector Text**。支持处理新格式的内容块 |
| `NATIVE_CLIPBOARD_IMAGE` | **原生剪贴板图片**。macOS 剪贴板图片检测 |
| `MCP_RICH_OUTPUT` | **MCP 美化输出**。改善 MCP 工具调用结果的终端渲染 |
| `BUILTIN_EXPLORE_PLAN_AGENTS` | **内置 Explore/Plan Agent**。默认启用的代码探索和规划 Agent |

---

## 开发版独有的命令

以下命令仅在 dev-full 版本中可用：

| 命令 | Feature Flag | 说明 |
|------|-------------|------|
| `/voice` | `VOICE_MODE` | 开关语音模式（生产版也有） |
| `/brief` | `KAIROS_BRIEF` | 切换简报模式 |
| `/assistant` | `KAIROS` | 管理 Assistant Agent |
| `/rc` / `/remote-control` | `BRIDGE_MODE` | 连接远程控制 |
| `/web-setup` | `CCR_REMOTE_SETUP` | Web 配置远程连接（绑定 GitHub） |
| `/ultraplan` | `ULTRAPLAN` | 高级规划模式（10-30 分钟，多 Agent 并行） |

---

## 功能详解

### 思考与规划增强

**ULTRATHINK** — 开启后，模型在回答前会进行更深度的内部推理。对于需要多步骤分析的复杂问题（如算法设计、架构评审、大型重构），效果提升明显。代价是响应时间稍长。

**ULTRAPLAN** — `/ultraplan` 命令会在远程 NeoCLI 会话中启动多 Agent 并行规划。适合拆分大型任务：每个 Agent 负责一个子模块，最后汇总。超时 30 分钟。

**BUILTIN_EXPLORE_PLAN_AGENTS** — 默认启用 Explore（代码探索）和 Plan（方案规划）两个专业 Agent。Explore Agent 适合大规模代码搜索，Plan Agent 适合设计实现方案。

### 远程控制生态（BRIDGE_MODE / CCR 系列）

这三个 flag 构成了 NeoCLI 的完整远程控制能力：

- **CCR_AUTO_CONNECT**：启动时自动建立远程连接，不需要手动操作
- **CCR_MIRROR**：本地会话自动暴露为远程可访问（仅出站连接，安全）
- **BRIDGE_MODE**：完整远程控制，可通过网页或移动端操控本地终端

`/rc`（remote-control）命令用于手动建立远程连接，`/web-setup` 通过 Web 界面配置。

### 记忆系统增强

- **EXTRACT_MEMORIES**：对话结束后，后台自动分析对话内容，提取关键信息写入记忆文件
- **AGENT_MEMORY_SNAPSHOT**：自定义 Agent 可以持久化自己的记忆，下次创建时自动恢复
- **TEAMMEM**：团队共享记忆目录，多人协作时共享上下文

### 定时任务（AGENT_TRIGGERS）

通过 `CronCreate` 工具（在对话中使用，非 slash 命令）创建定时任务：

```
"每 5 分钟检查一下构建状态"     → */5 * * * *
"每天早上 9 点跑一次测试"       → 0 9 * * *
"工作日下午 6 点提醒我提交代码"  → 0 18 * * 1-5
```

任务触发时，Agent 会执行你预设的 prompt。使用 `CronList` 查看所有定时任务，`CronDelete` 删除。

### Bash 智能分类

**BASH_CLASSIFIER** + **TREE_SITTER_BASH** — 用 AST（抽象语法树）解析 Bash 命令，自动判断命令是"安全"还是"需要确认"。这让 `/permissions` 规则更智能：

- 读文件命令（`cat`、`ls`）→ 自动放行
- 修改文件命令（`rm`、`mv`）→ 触发确认
- 网络操作（`curl`、`wget`）→ 拦截询问

### 缓存优化

**CACHED_MICROCOMPACT** + **PROMPT_CACHE_BREAK_DETECTION** — 优化 API 调用缓存命中率，降低 Token 消耗。缓存破坏检测会告诉你为什么缓存失效了。

### Token 预算（TOKEN_BUDGET）

在提示中加入 Token 预算限制。当对话上下文接近预算上限时，自动触发压缩以控制成本。

### 质量保证

**VERIFICATION_AGENT** — 开启后，主 Agent 完成任务时，必须经过一个独立的验证 Agent 审查通过，才能向你报告"完成"。相当于给 AI 干活加了个质检员。

---

## 自定义编译：按需开启功能

不需要全部 36 个功能？可以精确指定要开启哪些：

```bash
# 只开启语音 + 超强规划
bun run ./scripts/build.ts --dev --feature=VOICE_MODE --feature=ULTRAPLAN

# 开启远程控制全家桶
bun run ./scripts/build.ts --dev --feature=BRIDGE_MODE --feature=CCR_AUTO_CONNECT --feature=CCR_MIRROR
```

开启的功能越多，编译出来的 .exe 越大（全功能版约 220MB）。

---

## 开发版特有的配置项

`settings.json` 中部分配置项仅在特定 feature flag 开启时才生效，例如：

| 配置项 | 需要的 flag |
|--------|------------|
| `voiceEnabled` | `VOICE_MODE` |
| `autoMemoryEnabled` | `EXTRACT_MEMORIES` |
| `autoMemoryDirectory` | `EXTRACT_MEMORIES` |
| `sandbox` | `SANDBOX` |
| `worktree` | Git worktree 相关功能 |

---

## 注意事项

1. **实验功能尚未充分测试** — 这些功能来自上游 Claude Code 的 feature flag 体系，部分功能的真正实现代码可能不在本仓库（来自内部闭源树），因此可能以 "stub"（空壳）形式存在
2. **CRON 定时任务存活周期** — 定时任务在 NeoCLI 会话结束后自动失效，要持久化请用 `durable: true` 参数
3. **远程控制** — BRIDGE_MODE 系列功能需要网络环境支持，部分功能依赖 Anthropic 的云端服务，在纯 DeepSeek API 环境下可能不可用
4. **编译体积** — 全功能版约 220MB，是因为把整个 Bun 运行时和所有依赖都打包进去了
