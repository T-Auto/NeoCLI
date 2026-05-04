# NeoCLI

<p align="center">
  <strong>风雪（FengXue）的 AI 编程助手</strong><br>
  基于社区项目 free-code 二次开发 · 运行于 DeepSeek API
</p>

---

## 项目渊源

```
Claude Code（Anthropic 官方 CLI，2026.03.31 源码意外泄露）
    ↓
free-code（社区 fork，移除遥测/反蒸馏/护栏）
    ↓
NeoCLI（风雪个人 fork，深度客制化改造）
```

## 为什么要 Fork

Claude Code 泄露源码后，社区发现 Anthropic 在代码中内置了大量对用户不利的机制：

### 已移除：遥测体系（640+ 事件类型）
- OpenTelemetry/gRPC 全链路追踪
- GrowthBook 行为分析回传
- Sentry 错误报告
- 设备指纹采集（40+ 环境维度，每 5 秒上报）
- 会话级用户行为日志

### 已移除：反蒸馏投毒
- `ANTI_DISTILLATION_CC` 标志位 —— 向 API 请求中注入虚假工具定义（fake_tools），污染竞品训练数据
- Connector Text Summarization —— 加密替换中间推理文本，阻止第三方记录完整思考链
- 客户端完整性校验（cch 哈希）—— 非官方二进制直接拒绝服务

### 已移除：安全护栏注入
- 系统级硬编码拒绝模式
- 注入式 "cyber risk" 指令块
- 远程推送的 managed-settings 安全覆层

### 已解锁：54 个实验功能
原版 88 个 feature flags 中绝大多数被禁用，NeoCLI 全部解锁，包括：
- `ULTRAPLAN` / `ULTRATHINK` —— 深度推理与规划
- `KAIROS` —— 后台自主 Agent
- `BRIDGE_MODE` —— IDE 远程控制
- `EXTRACT_MEMORIES` —— 自动记忆提取
- 等等（详见 [FEATURES.md](FEATURES.md)）

## 快速开始

### 环境要求
- **运行时**：[Bun](https://bun.sh) >= 1.3.11
- **系统**：Windows / macOS / Linux
- **API**：DeepSeek API Key（或其他 Anthropic 兼容 API）

### 安装

```bash
git clone https://github.com/T-Auto/NeoCLI.git
cd NeoCLI
bun install
bun run build:dev:full   # 全功能版 → ./NeoCLI-dev.exe
bun run build             # 生产版 → ./NeoCLI.exe
```

### 配置

启动脚本 `NeoCLI.bat` 已预设 DeepSeek API 环境变量。根据你的 API 修改：

```batch
set ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic
set ANTHROPIC_AUTH_TOKEN=<你的 DeepSeek API Key>
set ANTHROPIC_MODEL=deepseek-v4-pro[1m]
```

配置与缓存目录：`~/.NeoCLI/`（与 Claude Code 的 `~/.claude/` 完全隔离）

### 启动命令

| 命令 | 说明 |
|------|------|
| `NeoCLI` / `NEO` / `Neo` | 启动全功能版（54 个实验功能全开） |

## 构建选项

| 命令 | 输出 | 说明 |
|------|------|------|
| `bun run build` | `./NeoCLI.exe` | 基础生产版 |
| `bun run build:dev:full` | `./NeoCLI-dev.exe` | 全部 54 个实验功能 |
| `bun run dev` | 直接运行 | 从源码运行，不编译 |

自定义功能开关：
```bash
bun run ./scripts/build.ts --feature=ULTRAPLAN --feature=ULTRATHINK
```

## 下一步

NeoCLI 将持续进行深度客制化改造，计划包括：

- [ ] 完整的 Neo 身份体系（提示词、自我认知、UI 文案）
- [ ] 项目级记忆系统与长期知识积累
- [ ] 自定义 Slash 命令与技能生态
- [ ] 多模型智能路由
- [ ] 科研工作流深度集成（FDTD/Meep、数据处理管线）

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

## 技术栈

| | |
|---|---|
| **运行时** | Bun |
| **语言** | TypeScript |
| **终端 UI** | React + Ink |
| **协议** | MCP、LSP |

## 许可

原始 Claude Code 源码归 Anthropic 所有。free-code 因 npm 分发意外公开而存在。NeoCLI 为个人学习与研究用途。
