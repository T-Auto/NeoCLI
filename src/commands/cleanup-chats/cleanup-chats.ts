import type { LocalCommandCall } from '../../types/command.js'
import {
  cleanupOldMessageFiles,
  cleanupOldSessionFiles,
  type CleanupResult,
} from '../../utils/cleanup.js'

/**
 * Parse a human-readable duration string into milliseconds.
 * Supports: Xd (days), Xw (weeks), Xm (months), Xy (years)
 * Examples: "30d", "2w", "1m", "1y"
 */
function parseDuration(arg: string): number | null {
  const match = arg.match(/^(\d+)\s*(d|w|m|y)$/i)
  if (!match) return null
  const num = parseInt(match[1]!, 10)
  const unit = match[2]!.toLowerCase()
  switch (unit) {
    case 'd':
      return num * 24 * 60 * 60 * 1000
    case 'w':
      return num * 7 * 24 * 60 * 60 * 1000
    case 'm':
      return num * 30 * 24 * 60 * 60 * 1000 // approximate
    case 'y':
      return num * 365 * 24 * 60 * 60 * 1000
    default:
      return null
  }
}

export const call: LocalCommandCall = async (args) => {
  const trimmed = args.trim().toLowerCase()

  let cutoffDate: Date

  if (trimmed === '--all' || trimmed === '-a') {
    // Clean all: set cutoff to now (everything is older than "now")
    cutoffDate = new Date()
  } else if (trimmed.startsWith('--older-than') || trimmed.startsWith('-o')) {
    // Parse --older-than <duration> or -o <duration>
    const parts = trimmed.split(/\s+/)
    const durationArg = parts[1]
    if (!durationArg) {
      return {
        type: 'text',
        value:
          'Usage: /cleanup-chats --older-than <duration>\n' +
          '  Examples: --older-than 30d, --older-than 1m, --older-than 2w\n' +
          '  Units: d=days, w=weeks, m=months, y=years',
      }
    }
    const durationMs = parseDuration(durationArg)
    if (durationMs === null) {
      return {
        type: 'text',
        value:
          `Invalid duration: "${durationArg}"\n` +
          'Usage: /cleanup-chats --older-than <number><unit>\n' +
          '  Examples: 30d, 1m, 2w, 1y\n' +
          '  Units: d=days, w=weeks, m=months, y=years',
      }
    }
    cutoffDate = new Date(Date.now() - durationMs)
  } else if (trimmed === '' || trimmed === '--help' || trimmed === '-h') {
    return {
      type: 'text',
      value:
        '╔══════════════════════════════════════════════╗\n' +
        '║       NeoCLI Chat History Cleanup           ║\n' +
        '╠══════════════════════════════════════════════╣\n' +
        '║  /cleanup-chats                             ║\n' +
        '║    Clean conversations older than 30 days   ║\n' +
        '║                                              ║\n' +
        '║  /cleanup-chats --all                       ║\n' +
        '║    Delete ALL conversation history          ║\n' +
        '║                                              ║\n' +
        '║  /cleanup-chats --older-than <duration>     ║\n' +
        '║    Delete conversations older than duration ║\n' +
        '║    Examples: --older-than 7d, --older-than 1m║\n' +
        '║    Units: d=days, w=weeks, m=months, y=years║\n' +
        '╚══════════════════════════════════════════════╝',
    }
  } else {
    return {
      type: 'text',
      value:
        `Unknown argument: "${args}"\n` +
        'Use /cleanup-chats --help to see usage.\n' +
        'Aliases: /clean-chats, /cleanup',
    }
  }

  // Run cleanup with the calculated cutoff
  const sessionResult: CleanupResult = await cleanupOldSessionFiles(cutoffDate)
  const messageResult: CleanupResult = await cleanupOldMessageFiles(cutoffDate)

  const totalMessages = sessionResult.messages + messageResult.messages
  const totalErrors = sessionResult.errors + messageResult.errors

  const cutoffDisplay =
    trimmed === '--all' || trimmed === '-a'
      ? 'ALL conversations'
      : `conversations older than ${cutoffDate.toLocaleDateString('zh-CN')}`

  let resultText = `Cleanup complete: deleted ${totalMessages} files (${cutoffDisplay})`

  if (totalErrors > 0) {
    resultText += `\n${totalErrors} errors encountered during cleanup.`
  }

  if (totalMessages === 0 && totalErrors === 0) {
    resultText = `No files to clean up (${cutoffDisplay}).`
  }

  return { type: 'text', value: resultText }
}
