import { existsSync, readFileSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'

type UserConfig = {
  api_key?: unknown
  base_url?: unknown
  model?: unknown
  default_opus_model?: unknown
  default_sonnet_model?: unknown
  default_haiku_model?: unknown
  subagent_model?: unknown
}

function getConfigPath(): string {
  return process.env.NEOCLI_CONFIG_PATH ?? join(
    process.env.CLAUDE_CONFIG_DIR ?? join(homedir(), '.NeoCLI'),
    'config.toml',
  )
}

function setIfMissing(name: string, value: unknown): void {
  if (process.env[name] || typeof value !== 'string' || !value.trim()) return
  process.env[name] = value.trim()
}

/** Applies user-editable config.toml values before API modules inspect process.env. */
export function loadInstalledConfig(): void {
  const configPath = getConfigPath()
  if (!existsSync(configPath)) return
  try {
    const config = Bun.TOML.parse(readFileSync(configPath, 'utf8')) as UserConfig
    if (!process.env.ANTHROPIC_AUTH_TOKEN && !process.env.ANTHROPIC_API_KEY) {
      setIfMissing('ANTHROPIC_AUTH_TOKEN', config.api_key)
    }
    setIfMissing('ANTHROPIC_BASE_URL', config.base_url)
    setIfMissing('ANTHROPIC_MODEL', config.model)
    setIfMissing('ANTHROPIC_DEFAULT_OPUS_MODEL', config.default_opus_model)
    setIfMissing('ANTHROPIC_DEFAULT_SONNET_MODEL', config.default_sonnet_model)
    setIfMissing('ANTHROPIC_DEFAULT_HAIKU_MODEL', config.default_haiku_model)
    setIfMissing('CLAUDE_CODE_SUBAGENT_MODEL', config.subagent_model)
  } catch {
    // A damaged user-local installer config must not prevent the CLI starting.
  }
}
