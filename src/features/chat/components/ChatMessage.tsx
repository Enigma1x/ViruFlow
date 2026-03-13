import type { Message } from '../../../types/chat'
import { cn } from '../../../utils/cn'

interface ChatMessageProps {
  message: Message
  senderName: string
  isOwn: boolean
}

function formatMessageTime(iso: string): string {
  try {
    const d = new Date(iso)
    const now = new Date()
    const sameDay =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    if (sameDay) return d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
    return d.toLocaleDateString('es', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

export function ChatMessage({ message, senderName, isOwn }: ChatMessageProps) {
  if (message.message_type === 'system') {
    return (
      <div className="flex justify-center my-2">
        <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">
          {message.content}
        </span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col max-w-[85%]',
        isOwn ? 'self-end items-end' : 'self-start items-start'
      )}
    >
      <div
        className={cn(
          'rounded-2xl px-4 py-2 shadow-sm',
          isOwn
            ? 'bg-brand text-white rounded-br-md'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-md'
        )}
      >
        {!isOwn && (
          <p className="text-xs font-medium opacity-90 mb-0.5">{senderName}</p>
        )}
        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        {message.media && (
          <div className="mt-2">
            <a
              href={message.media}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'text-xs underline',
                isOwn ? 'text-white/90' : 'text-brand'
              )}
            >
              Ver archivo adjunto
            </a>
          </div>
        )}
      </div>
      <time
        className="text-xs text-gray-500 dark:text-gray-400 mt-0.5"
        dateTime={message.created_at}
      >
        {formatMessageTime(message.created_at)}
      </time>
    </div>
  )
}
