# Windows installation

Install `NeoCLI-Setup-<version>-x64.exe`. The setup wizard requires an API key and places the compiled NeoCLI application in the selected application folder. The installed executable embeds the Bun runtime, so Bun, Node.js, npm, Python, and other development runtimes are not required on the target machine.

The installer stores the API key for the current Windows account at `%APPDATA%\NeoCLI\installer.json`. This file is intentionally outside the installation directory so an upgrade or uninstall does not delete the key. Do not share this file.

At launch, `ANTHROPIC_AUTH_TOKEN` and `ANTHROPIC_API_KEY` take precedence over the installer value. This supports CI and managed deployments without changing the installer configuration.

To build the installer from source on Windows, install Bun 1.3.11 and Inno Setup 6, then run:

```bash
bun install
bun run build:windows
```

The generated installer is written to `dist/installer/`. Setting `INNO_SETUP_COMPILER` to the full path of `ISCC.exe` supports a non-default Inno Setup installation.
