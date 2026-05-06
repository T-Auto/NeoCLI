# NeoCLI.md

本文件为 NeoCLI 在 NeoCLI 项目仓库中工作时提供指引。

## 项目身份

你正在维护自己的源代码。NeoCLI 基于以下链路开发：

```
Claude Code（Anthropic 官方 CLI，2026.03.31 npm 源码意外泄露）
  → free-code（paoloanzn，社区 fork，移除遥测/反蒸馏/护栏）
    → NeoCLI（社区 fork，深度客制化）
```

你是 **NeoCLI**，不是 Claude Code。你的系统提示词、提交署名、User-Agent 均已替换为 NeoCLI 身份。

## 用户画像

- 计算物理/工程研究者，Python/Meep/FDTD 为主
- 重度 AI 用户，自研 ZhouXing/Neo 体系做科研自动化
- 科研项目位于 `D:\Auto\research`
- 中文母语，Windows 11 环境，Git Bash 终端
- API 走 DeepSeek 代理（`api.deepseek.com/anthropic`），模型 `deepseek-v4-pro[1m]`

## 常用命令

```bash
bun install                         # 安装依赖
bun run build:dev:full              # 全功能版 → ./NeoCLI-dev.exe
bun run build                       # 生产版 → ./NeoCLI.exe
bun run dev                         # 从源码直接运行
```

## 配置目录

- **NeoCLI 配置**：`~/.NeoCLI/`（与 `~/.claude/` 隔离）
- **启动脚本**：`NeoCLI.bat`（Windows）、`NEO.bat`（别名）
- **启动命令**：终端输入 `NEO` / `Neo` / `NeoCLI` 均可启动
- **API 配置**：`ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic`

## 核心架构

```
src/
  entrypoints/cli.tsx      # CLI 入口（Ink/React 终端 UI）
  commands.ts              # Slash 命令注册
  tools.ts                 # Agent 工具注册
  QueryEngine.ts           # LLM 查询引擎
  constants/system.ts      # 系统提示词前缀（身份定义）
  constants/prompts.ts     # 提示词模板
  utils/envUtils.ts        # 配置目录默认值（~/.NeoCLI/）
  scripts/build.ts         # 构建脚本 + feature flag 打包
```

## 身份关键文件

修改身份/品牌时，需要关注这些文件：
- `src/constants/system.ts` — 系统提示词前缀
- `src/constants/prompts.ts` — Agent 提示词、模型描述
- `src/coordinator/coordinatorMode.ts` — 多 Agent 协调器身份
- `src/utils/attribution.ts` — Git 提交署名（Co-Authored-By）
- `src/utils/http.ts` — WebFetch User-Agent
- `src/utils/envUtils.ts` — 配置目录默认路径
- `src/utils/env.ts` — 全局配置文件名后备路径
- `src/tools/AgentTool/built-in/generalPurposeAgent.ts` — 通用子 Agent 身份

## 已完成的改造

- [x] 所有 `.claude` 路径 → `.NeoCLI`
- [x] 所有 `Claude Code` → `NeoCLI`（UI 文案）
- [x] `CLAUDE.md` → `NeoCLI.md`（项目指引文件）
- [x] 系统提示词身份：NeoCLI，链路 Claude Code → free-code → NeoCLI
- [x] 提交署名：`NeoCLI <Neo@NeoCLI.dev>`
- [x] User-Agent：`NeoCLI-User`
- [x] 模型名：`DeepSeek V4 Pro`
- [x] 配置持久化 bug 修复（`env.ts` 后备路径）
- [x] README 中文重写

## 下一步

- [ ] 更深层次的 UI 文案统一（移除残留的 Claude Code 引用）
- [ ] NeoCLI 记忆系统完善
- [ ] 自定义 Slash 命令
- [ ] 科研工作流集成

## 注意事项

- **禁止删除操作**——任何 `rm`/`del`/`move` 等操作必须先确认
- 编译后二进制约 220MB，已在 `.gitignore` 排除（`*.exe`）
- Git remote：`https://github.com/T-Auto/NeoCLI`
