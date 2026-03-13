import { MessageSquare, Users, Hash } from 'lucide-react'
import { cn } from '../../../utils/cn'
import type { ChatType } from '../../../types/chat'
import type { ChatWithUnread } from '../hooks/useChatList'

interface ChatListProps {
  chats: ChatWithUnread[]
  loading: boolean
  error: string | null
  activeChatId: string | null
  onSelectChat: (chatId: string) => void
}

function ChatTypeIcon({ type }: { type: ChatType }) {
  switch (type) {
    case 'direct':
      return <Users className="w-4 h-4 shrink-0" aria-hidden />
    case 'workspace':
      return <Hash className="w-4 h-4 shrink-0" aria-hidden />
    default:
      return <MessageSquare className="w-4 h-4 shrink-0" aria-hidden />
  }
}

export function ChatList({
  chats,
  loading,
  error,
  activeChatId,
  onSelectChat,
}: ChatListProps) {
  if (error) {
    return (
      <div className="p-4 text-sm text-red-600 dark:text-red-400">
        {error}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500 dark:text-gray-400 text-sm">
        Cargando chats...
      </div>
    )
  }

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500 dark:text-gray-400">
        <MessageSquare className="w-12 h-12 mb-3 opacity-50" aria-hidden />
        <p className="text-sm font-medium">No hay conversaciones</p>
        <p className="text-xs mt-1">Las conversaciones en las que participes aparecerán aquí.</p>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-700" role="list">
      {chats.map((chat) => (
        <li key={chat.id}>
          <button
            type="button"
            onClick={() => onSelectChat(chat.id)}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors',
              activeChatId === chat.id
                ? 'bg-brand/15 dark:bg-brand/20 text-brand'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100'
            )}
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0">
              <ChatTypeIcon type={chat.type} />
            </span>
            <span className="flex-1 min-w-0 truncate">
              {chat.name ?? `Chat ${chat.type}`}
            </span>
            {chat.unreadCount > 0 && (
              <span
                className="shrink-0 min-w-[1.25rem] h-5 px-1.5 flex items-center justify-center rounded-full bg-green-500 text-white text-xs font-semibold"
                aria-label={`${chat.unreadCount} no leídos`}
              >
                {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
              </span>
            )}
          </button>
        </li>
      ))}
    </ul>
  )
}
