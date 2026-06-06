# 从零开始的安装与启动指南

本指南假设你现在面对的是一台**刚刚装好 Windows 系统的全新电脑**，从零开始，一步一步教你装好所有东西，直到能在终端里输入 `NEO` 启动 NeoCLI。

---

## 第一步：安装 Git

Git 是下载代码和版本管理的工具。

1. 打开浏览器，访问 https://git-scm.com/download/win
2. 页面会自动弹出下载，下载完成后双击运行
3. 安装过程中**一路点"下一步"（Next）即可**，默认选项都不用改
4. 装完后，在桌面空白处右键，菜单里会出现 "Open Git Bash Here"，点一下能打开一个命令行窗口，说明装好了

---

## 第二步：安装 Node.js

NeoCLI 的部分底层依赖需要 Node.js 环境（要求 18 以上版本）。

1. 打开浏览器，访问 https://nodejs.org
2. 页面正中会看到两个大按钮，**点左边的 "LTS" 版本**（长期稳定版，目前是 20.x 或 22.x）
3. 下载完成后双击运行安装程序
4. 安装过程中**一路点 "Next" 即可**，默认选项都不用改
5. 装完后，打开 CMD（`Win + R`，输入 `cmd`，回车），输入 `node --version`，如果显示版本号（例如 `v22.1.0`），说明装好了

> Node.js 和 Bun 各管一摊：Bun 负责编译打包，Node.js 给部分底层原生模块提供运行环境。

---

## 第三步：安装 Bun

Bun 是 NeoCLI 的编译和打包工具。

1. 打开浏览器，访问 https://bun.sh
2. 页面正中有一个安装命令，**复制下来**
3. 按键盘 `Win + R`，输入 `powershell`，回车，打开 PowerShell 窗口
4. 在 PowerShell 窗口中**右键粘贴**刚才复制的命令，回车执行
5. 等待安装完成（大约 1-2 分钟，取决于网速）
6. 装完后，**关掉这个 PowerShell 窗口**

> 验证安装：新开一个 PowerShell 或 CMD 窗口，输入 `bun --version`，如果显示版本号（例如 `1.3.11`），说明装好了。

---

## 第四步：获取 DeepSeek API Key

NeoCLI 使用 DeepSeek 的 API 来调用 AI 模型。

1. 打开浏览器，访问 https://platform.deepseek.com
2. 注册账号（用手机号或邮箱）
3. 登录后，点击左侧菜单 "API Keys"
4. 点击 "创建 API Key"，起个名字（比如 `NeoCLI`），复制生成的 key
5. **把 key 保存到一个文本文件里**，格式是 `sk-` 开头的一长串字符

> DeepSeek API 是**按量付费**的，充 10 块钱能用很久。价格很低，不用担心。

---

## 第五步：下载 NeoCLI

打开 Git Bash（桌面右键 → Open Git Bash Here），输入以下命令：

```bash
git clone https://github.com/T-Auto/NeoCLI.git
```

这会在你的用户目录下创建一个 `NeoCLI` 文件夹，把代码下载下来。

> 如果你想放在别的位置（比如 D 盘），先在 Git Bash 里输入 `cd /d/` 切换到 D 盘，再执行上面的命令。

---

## 第六步：安装依赖

继续在 Git Bash 里：

```bash
cd NeoCLI
bun install
```

等待依赖下载完成（大约 2-3 分钟，取决于网速）。这会把 NeoCLI 需要的所有第三方库下载到 `node_modules` 目录。

---

## 第七步：编译 NeoCLI

还是在 Git Bash 里，在 `NeoCLI` 目录下：

```bash
bun run build:dev:full     # 全功能开发版（推荐）
```

如果你想用基础生产版，可以输入：
```bash
bun run build              # 基础生产版
```

两个版本的区别：
- **生产版**（`build`）：稳定，但功能少，只开启基础命令
- **全功能版**（`build:dev:full`）：开启全部实验功能，多出很多高级命令

> 推荐用全功能版。如果以后想换，重新编译一次就行。

编译完成后，当前目录下会生成 `NeoCLI-dev.exe`（全功能版）或 `NeoCLI.exe`（生产版）。

---

## 第八步：配置 API Key（创建启动脚本）

NeoCLI 需要通过环境变量读取你的 API Key。最简单的方法是写一个启动脚本（`.bat` 文件）。

在 NeoCLI 目录下，复制模板文件：

```
在文件管理器里，找到 NeoCLI 目录
右键 NeoCLI.bat.example → 复制 → 粘贴 → 重命名为 NeoCLI.bat
```

然后右键 `NeoCLI.bat` → **用记事本打开**，把内容改成这样：

```batch
@echo off
REM 基础环境变量
set ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic
set ANTHROPIC_AUTH_TOKEN=sk-你的APIKey填在这里
set ANTHROPIC_MODEL=deepseek-v4-pro[1m]
set ANTHROPIC_DEFAULT_OPUS_MODEL=deepseek-v4-pro[1m]
set ANTHROPIC_DEFAULT_SONNET_MODEL=deepseek-v4-pro[1m]
set ANTHROPIC_DEFAULT_HAIKU_MODEL=deepseek-v4-flash
set CLAUDE_CODE_SUBAGENT_MODEL=deepseek-v4-flash
set CLAUDE_CODE_EFFORT_LEVEL=max

REM 启动 NeoCLI
"%~dp0NeoCLI-dev.exe" %*
```

**只需要改一行**：把 `sk-你的APIKey填在这里` 替换成你在第四步获取的 API Key。

---

## 第九步：在任意位置用 `NEO` 启动

现在你只能在 NeoCLI 目录下双击 `NeoCLI.bat` 启动。想要在**任意位置**的终端里输入 `neo` 就能启动，需要把 NeoCLI 目录加到系统 PATH 里。

### 方法一：添加系统环境变量（推荐，一劳永逸）

1. 按 `Win` 键，输入 "环境变量"，点击 "编辑系统环境变量"
2. 在弹出的窗口里点 "环境变量(N)…"
3. 在 "系统变量" 区域找到 `Path`，双击
4. 点 "新建"，输入 NeoCLI 目录的完整路径，例如 `D:\Auto\Github\NEO\NeoCLI`
5. 点 "确定"、"确定"、"确定" 全部关掉
6. **重新打开**终端（CMD 或 PowerShell），输入 `neo`，回车，启动成功！

### 方法二：创建全局别名（便携方案）

在 NeoCLI 目录下创建一个 `NEO.bat` 文件，内容如下：

```batch
@echo off
call "D:\Github\NeoCLI\NeoCLI.bat" %*
```

注意`NEO.bat` 里的`"D:\Github\NeoCLI\NeoCLI.bat"`路径要改成你的实际路径。然后把 `NEO.bat` **所在的目录**加到系统 PATH（参考方法一）。之后在任何地方输入 `neo` 或 `NEO` 即可启动。

---

## 第十步（可选）：启动后初始化项目指引

在任意终端输入 `neo` 启动后，进入到你常用的项目目录，输入：

```
/init
```

NeoCLI 会自动分析项目代码并生成 `NeoCLI.md` 项目指引文件，让 NeoCLI 更了解你的项目。

---

# 高级用法

以下内容写给想更进一步定制启动方式的用户。

---

## 全权模式（危险）

NeoCLI 在执行工具操作（如读写文件、执行命令）时，默认会弹出确认框让你批准。对于信任的项目，每次都要点确认很烦。

在启动命令后面加 `--dangerously-skip-permissions` 参数，可以跳过所有确认：

```batch
@echo off
cd /d "%~dp0"
call "你的文件路径\NeoCLI.bat" --dangerously-skip-permissions %*
pause
```

把这个保存为 `NeoCLI-auto.bat`，复制到你需要的工作目录后双击它即可在本目录启动

---

## 代理 + 全权模式

```batch
@echo off
cd /d "%~dp0"

REM 这三行是代理设置改成你自己的端口；如果你不知道这是什么意思，请跳过
set http_proxy=http://127.0.0.1:7897
set https_proxy=http://127.0.0.1:7897
set all_proxy=socks5://127.0.0.1:7897

REM 全权模式启动，使用shift+tab切换到左下角红色模式即可不再需要手动点击确认，但有风险
call "你的文件路径\NeoCLI.bat" --dangerously-skip-permissions %*

pause
```

把这个保存为 `NeoCLI-auto.bat`，复制到你需要的工作目录后双击它即可在本目录启动

---

## 不编译，直接从源码运行

如果你需要频繁改 NeoCLI 的源码，可以跳过编译环节，直接从源码运行：

```bash
bun run dev
```

启动速度会慢一点（因为每次都要加载 TypeScript 源码），但方便你改完代码立刻看效果。

---

## 常见问题

**Q: 编译时报错，提示找不到某个模块？**
A: 先执行 `bun install` 确保依赖都装好了。如果还报错，可能是网络问题，开代理后再试。

**Q: 启动后 API 报错 401 或 403？**
A: 检查 `NeoCLI.bat` 里的 `ANTHROPIC_AUTH_TOKEN` 是否填对了。API Key 是 `sk-` 开头的那一串。

**Q: DeepSeek API 提示余额不足？**
A: 登录 https://platform.deepseek.com 充值即可，最低充 10 元。

**Q: Git Bash 里中文乱码？**
A: 在 Git Bash 窗口标题栏右键 → Options → Text → Locale 选 `zh_CN`，Character set 选 `UTF-8`。

**Q: 怎么更新 NeoCLI？**
A: 在 NeoCLI 目录下打开 Git Bash，执行：

```bash
git pull
bun install
bun run build:dev:full
```
