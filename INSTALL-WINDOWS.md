# Windows installation

Install `NeoCLI-Setup-<version>-x64.exe`. The setup wizard requires an API key and places the compiled NeoCLI application in the selected application folder. The installed executable embeds the Bun runtime, so Bun, Node.js, npm, Python, and other development runtimes are not required on the target machine.

The installer stores the API key and model settings for the current Windows account at `~\.NeoCLI\config.toml`. This file is intentionally outside the installation directory so an upgrade or uninstall does not delete the settings. Edit it to change `api_key`, `base_url`, or model names; do not share it.

NeoCLI starts in dangerous mode after a new installation. It skips permission prompts; the lower-left status area renders a red warning and permanently shows `Shift+Tab` as the mode-switch shortcut. Press `Shift+Tab` to switch back to a confirmation-based mode.

At launch, `ANTHROPIC_AUTH_TOKEN` and `ANTHROPIC_API_KEY` take precedence over the installer value. This supports CI and managed deployments without changing the installer configuration.

The Windows installer configures `deepseek-v4-pro` as the main, Opus, and Sonnet model, and `deepseek-v4-flash` as the Haiku and subagent model.

To build the installer from source on Windows, install Bun 1.3.11 and Inno Setup 6, then run:

```bash
bun install
bun run build:windows
```

The generated installer is written to `dist/installer/`. Setting `INNO_SETUP_COMPILER` to the full path of `ISCC.exe` supports a non-default Inno Setup installation.
