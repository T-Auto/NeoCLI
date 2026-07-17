import type { Command } from '../../commands.js'

const cleanupChats: Command = {
  type: 'local',
  name: 'cleanup-chats',
  description:
    'Manually clean up old chat history. /cleanup-chats --all to delete all, /cleanup-chats --older-than 30d for custom retention',
  aliases: ['clean-chats', 'cleanup'],
  argumentHint: '[--all | --older-than <duration>]',
  load: () => import('./cleanup-chats.js'),
}

export default cleanupChats
