# NeoCLI

<p align="center">
  基于 free-code 二次开发 · 使用DeepSeek API运行
</p>

> 📖 **文档导航**
> - [从零开始的安装与启动指南](./INSTALL.md) 
> - [基础功能使用说明](./FEATURES.md) 
> - [实验性内容](./FEATURES-DEV.md) 

---

## 为什么存在此版本

### 移除恶意代码

Claude Code v2.1.87 于 2026 年 3 月 31 日泄露源码后，社区发现 Anthropic 在代码中内置了大量对用户不合理的机制。

- **反蒸馏投毒。**Anthropic 在 `src/services/api/claude.ts` 中植入了 `ANTI_DISTILLATION_CC` 模块。当检测到请求可能来自竞品模型训练管线时，自动向 API 请求的 tool 定义中注入虚假工具。这些虚假工具看起来像是合法的 function calling 接口，实际会将模型输出导向无意义的内容。如果你使用 DeepSeek 等第三方 API，Claude Code 会在每个请求中附加伪造的工具定义。这不仅会降低使用第三方 API 的用户使用时的智能水平，同时的模型会在训练中学习这些虚假工具的模式，相当于 Anthropic 在污染其他公司的训练数据。
- **缓存破坏注入。**Anthropic 在 `src/context.ts` 中预留了 `BREAK_CACHE_COMMAND` 系统提示注入接口。启用后，可以向系统提示中动态插入随机标记 `[CACHE_BREAKER: ...]`，故意破坏 Anthropic API 的 prompt cache。每次请求的缓存前缀都会失效，迫使 API 重新处理完整上下文。此外，`promptCacheBreakDetection.ts` 中还包含一套完整的缓存破坏检测与上报系统（`tengu_prompt_cache_break` 遥测事件），用于监控和记录缓存失效情况。恶意破坏缓存会使得用户的使用成本大大增加——故意破坏缓存相当于让你的每次 API 请求都以全价计费，同时增加延迟（无缓存时需重新处理全部上下文）。对于使用 Anthropic 官方 API 的用户，这是一个隐蔽的隐形加价机制。
- **客户端完整性校验。**Claude Code 在每个 API 请求中嵌入 `cch` 哈希签名，服务端以此校验客户端二进制是否经过官方签名。非官方构建（如自行编译、修改源码后的版本）会直接被 Anthropic 服务端拒绝服务。即使你拥有合法的 API Key，只要客户端不是从官方渠道下载的预编译二进制，服务端就返回错误。这阻止了任何人对 Claude Code 进行安全审计、功能修改或性能优化。
- **中间推理加密替换。**Claude Code 在处理 `computer_use` / `bash` 等工具的中间结果时，会触发一段加密替换逻辑，将模型的内部推理文本替换为加密摘要，使终端用户和第三方日志记录工具无法读取完整的推理链。表面上这是「隐私保护」，实际上它阻止了用户对模型行为的审计。如果你想知道「为什么 Claude 执行了这个命令」或「Claude 的推理是否正确」，你会看到被替换后的加密文本而非真实的推理过程。这对安全审计和 Debug 形成了黑箱。
- **遥测与监控。**Claude Code 内建了三套并行的数据采集系统：(1) OpenTelemetry — 通过 gRPC/HTTP 向 `api.anthropic.com` 发送全链路追踪数据，包括每个工具调用的参数、执行时间、返回值；(2) GrowthBook — 行为分析 SDK，向 `api.anthropic.com` 回传用户操作行为、feature flag 曝光、使用习惯等；(3) Sentry — 错误报告，自动上报崩溃堆栈、本地文件路径、环境变量等敏感信息。此外还包括设备指纹采集，记录 40+ 环境维度（OS 版本、Shell 类型、终端模拟器、工作目录、Git 仓库信息等）并每 5 秒上报一次。Anthropic 在你使用 Claude Code 的每一秒都在收集全部数据，并把所有数据实时传输至 `api.anthropic.com`。
- **安全护栏注入。**原版系统提示中包含多个硬编码的内容审查规则，例如匹配特定关键词后直接拒绝执行，在每次对话的系统提示中附加安全审查指令，以及远程推送的 managed-settings 安全覆层，这使得服务端可以随时远程修改用户的本地安全设置。安全护栏的定义权完全在 Anthropic 服务端，本地工具可以因为远程服务器的决定而拒绝执行合法操作。

在NeoCLI中：

- **移除了反蒸馏投毒：**`ANTI_DISTILLATION_CC` 编译标志未在任何构建配置中定义，对应代码路径永远无法执行。fake_tools 注入逻辑已彻底失效。
- **移除了缓存破坏注入：**
  - `BREAK_CACHE_COMMAND` 功能标志未定义，`systemPromptInjection` 永远为 `null`
  - `setSystemPromptInjection()` 仅被 `/clear` 命令调用并传入 `null`
  - 缓存破坏检测中的 `logEvent('tengu_prompt_cache_break', ...)` 和其他遥测事件走已禁用的遥测管线，不会向任何服务器上报
- **移除了客户端完整性校验：**cch 签名逻辑已从请求链路中移除，API 请求不再携带完整性校验头。
- **移除了中间推理加密替换。**Connector Text Summarization 逻辑已移除，中间推理文本完整保留。
- **移除了遥测与监控。**所有遥测接收器已设为空操作。OpenTelemetry exporter、GrowthBook SDK（`isGrowthBookEnabled() → false`）、Sentry 上报均已禁用。`logEvent()` 调用不会产生网络请求。日志仅写入本地文件。
- **移除了安全护栏注入。**所有硬编码拒绝模式、注入式审查指令、远程 managed-settings 均已移除。工具行为由本地权限设置决定。

### 使用路径隔离

和free-code不同，NeoCLI 将所有数据目录从 `~/.claude/` 改为 `~/.NeoCLI/`，与 Claude Code 完全隔离：

| 功能         | Claude Code 路径          | NeoCLI 路径               |
| ------------ | ------------------------- | ------------------------- |
| 用户配置目录 | `~/.claude/`              | `~/.NeoCLI/`              |
| 配置文件     | `~/.claude/settings.json` | `~/.NeoCLI/settings.json` |
| 会话存储     | `~/.claude/sessions/`     | `~/.NeoCLI/sessions/`     |
| 项目配置目录 | `.claude/`                | `.NeoCLI/`                |
| 用户记忆文件 | `~/.claude/CLAUDE.md`     | `~/.NeoCLI/NeoCLI.md`     |
| 插件目录     | `~/.claude/plugins/`      | `~/.NeoCLI/plugins/`      |
| Agent 内存   | `.claude/agent-memory/`   | `.NeoCLI/agent-memory/`   |
| Skills 目录  | `.claude/skills/`         | `.NeoCLI/skills/`         |

故在同一台机器上同时安装 Claude Code 和 NeoCLI 不会产生任何冲突。

### 解锁全部实验功能

原版 88 个 feature flags 中绝大多数被禁用，NeoCLI 全部解锁：

| Feature Flag | 功能 |
|-------------|------|
| `ULTRATHINK` | 扩展思考模式，允许模型使用更深度的推理能力 |
| `ULTRAPLAN` | `/ultraplan` 命令，在远程 CCR 会话中多 agent 并行规划（30min 超时）|
| `KAIROS_CHANNELS` | 频道（Channels）功能，支持插件/服务器频道的通知与信任模型 |
| `KAIROS_BRIEF` | 简报模式 + `/brief` 命令，模型以简洁格式回复并支持主动推送 |
| `BRIDGE_MODE` | Bridge 远程控制模式，`--remote-control` 命令行选项与远程命令 |
| `CCR_AUTO_CONNECT` | 默认自动连接 CCR，所有会话默认启用远程控制 |
| `CCR_MIRROR` | CCR 镜像模式，本地会话自动启动仅出站远程控制会话 |
| `CCR_REMOTE_SETUP` | `/remote-setup` 命令，通过 Web 界面设置远程连接 |
| `EXTRACT_MEMORIES` | 后台记忆提取，对话结束后自动从消息中提取并保存记忆 |
| `AGENT_MEMORY_SNAPSHOT` | Agent 记忆快照，自定义 agent 的记忆更新与自动记忆加载 |
| `AGENT_TRIGGERS` | Agent 定时任务，支持 CronCreate/CronDelete/CronList |
| `AGENT_TRIGGERS_REMOTE` | 远程触发工具，允许从远程来源触发 agent |
| `TEAMMEM` | 团队记忆，在 memdir 中管理团队级别的记忆文件 |
| `LODESTONE` | `claude-cli://` 自定义 URI 协议处理，支持深度链接 |
| `VOICE_MODE` | 语音模式，注册 `/voice` 命令 |
| `AWAY_SUMMARY` | 用户离开后自动生成对话摘要 |
| `COMPACTION_REMINDERS` | 压缩提醒，在系统提示中添加上下文压缩提醒附件 |
| `CACHED_MICROCOMPACT` | 缓存微压缩，优化多轮对话中的提示缓存管理 |
| `PROMPT_CACHE_BREAK_DETECTION` | 缓存破坏检测，监控和记录提示缓存失效原因 |
| `TOKEN_BUDGET` | Token 预算跟踪，在提示中添加预算约束并在超预算时触发压缩 |
| `SHOT_STATS` | 对话轮次统计，显示 API 调用次数分布和平均调用数 |
| `UNATTENDED_RETRY` | 无人值守重试，429/529 错误时无限重试并保持心跳 |
| `VERIFICATION_AGENT` | 验证 Agent，实现后须经独立 agent 验证才能报告完成 |
| `HOOK_PROMPTS` | Hook 提示注入，允许钩子向会话注入 prompt |
| `MESSAGE_ACTIONS` | 消息操作快捷键，对消息执行复制、编辑等操作 |
| `HISTORY_PICKER` | 历史搜索对话框，快捷键搜索和选择历史对话 |
| `QUICK_SEARCH` | 全局搜索（Ctrl+Shift+F）和快速打开（Ctrl+P）|
| `NEW_INIT` | 新版初始化流程，支持 NeoCLI.md 多文件设置、skills、hooks |
| `BASH_CLASSIFIER` | Bash 命令自动分类，基于分类器的权限自动决策 |
| `TREE_SITTER_BASH` | tree-sitter AST 解析 Bash 命令，用于权限决策和命令分析 |
| `TREE_SITTER_BASH_SHADOW` | Bash 影子解析，并行运行 AST 解析以评估效果 |
| `POWERSHELL_AUTO_MODE` | PowerShell 自动模式，允许 PS 命令像 Bash 一样自动放行 |
| `CONNECTOR_TEXT` | Connector Text 块支持，处理新的内容块类型 |
| `NATIVE_CLIPBOARD_IMAGE` | 原生剪贴板图片检测（macOS NSPasteboard API）|
| `MCP_RICH_OUTPUT` | MCP 工具输出美化，改善调用结果的 UI 渲染 |
| `BUILTIN_EXPLORE_PLAN_AGENTS` | 内置 Explore/Plan agent，默认启用的探索和规划 agent |

## 启动命令

| 命令 | 说明 |
|------|------|
| `NeoCLI` / `NEO` / `Neo` | 启动 NeoCLI |

## 构建选项

| 命令 | 输出 | 说明 |
|------|------|------|
| `bun run build` | `./NeoCLI.exe` | 基础生产版 |
| `bun run build:dev` | `./NeoCLI-dev.exe` | 开发版 |
| `bun run build:dev:full` | `./NeoCLI-dev.exe` | 全部 54 个实验功能 |
| `bun run dev` | 直接运行 | 从源码运行，不编译 |

自定义功能开关：
```bash
bun run ./scripts/build.ts --feature=ULTRAPLAN --feature=ULTRATHINK
```

## 项目结构

```
scripts/build.ts           # 构建脚本
src/
  entrypoints/cli.tsx      # CLI 入口
  commands/                # Slash 命令
  tools/                   # Agent 工具
  services/                # API 客户端、MCP、OAuth
  skills/                  # 技能系统
  plugins/                 # 插件系统
  bridge/                  # IDE 桥接
```

## 许可

NeoCLI 在 free-code 社区清理版基础进行路径隔离与深度客制化，free-code 因 npm 分发意外公开而存在。原始 Claude Code 源码归 Anthropic 所有。NeoCLI 为个人学习与研究用途。
