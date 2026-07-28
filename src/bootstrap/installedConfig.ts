import { existsSync, readFileSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'

type InstallerConfig = {
  apiKey?: unknown
  baseUrl?: unknown
  model?: unknown
}

function getInstallerConfigPath(): string | undefined {
  if (process.env.NEOCLI_INSTALLER_CONFIG_PATH) {
    return process.env.NEOCLI_INSTALLER_CONFIG_PATH
  }
  if (process.platform !== 'win32') {
    return undefined
  }
  return join(process.env.APPDATA ?? join(homedir(), 'AppData', 'Roaming'), 'NeoCLI', 'installer.json')
}

function setIfMissing(name: string, value: unknown): void {
  if (process.env[name] || typeof value !== 'string' || !value.trim()) return
  process.env[name] = value.trim()
}

/** Applies installer credentials before API modules inspect process.env. */
export function loadInstalledConfig(): void {
  const configPath = getInstallerConfigPath()
  if (!configPath || !existsSync(configPath)) return
  try {
    const config = JSON.parse(readFileSync(configPath, 'utf8')) as InstallerConfig
    if (!process.env.ANTHROPIC_AUTH_TOKEN && !process.env.ANTHROPIC_API_KEY) {
      setIfMissing('ANTHROPIC_AUTH_TOKEN', config.apiKey)
    }
    setIfMissing('ANTHROPIC_BASE_URL', config.baseUrl)
    setIfMissing('ANTHROPIC_MODEL', config.model)
  } catch {
    // A damaged user-local installer config must not prevent the CLI starting.
  }
}
