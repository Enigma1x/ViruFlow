import { useEffect, useRef, useState } from 'react'
import { getProfile } from '../../../services/profiles'
import type { Message } from '../../../types/chat'
import type { Chat } from '../../../types/chat'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { cn } from '../../../utils/cn'

interface ChatWindowProps {
  chat: Chat | null
  messages: Message[]
  loading: boolean
  userId: string | undefined
  onSendMessage: (content: string, mediaUrl?: string | null) => Promise<void>
  onSendFile: (file: File) => Promise<void>
  onMarkRead: () => void
}

export function ChatWindow({
  chat,
  messages,
  loading,
  userId,
  onSendMessage,
  onSendFile,
  onMarkRead,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const [senderNames, setSenderNames] = useState<Record<string, string>>({})

  useEffect(() => {
    if (messages.length === 0) return
    const ids = [...new Set(messages.map((m) => m.user_id).filter(Boolean))] as string[]
    if (ids.length === 0) return
    Promise.all(ids.map((id) => getProfile(id)))
      .then((profiles) => {
        const map: Record<string, string> = {}
        profiles.forEach((p) => {
          map[p.id] = p.full_name
        })
        setSenderNames(map)
      })
      .catch(() => {})
  }, [messages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (chat) onMarkRead()
  }, [chat?.id, onMarkRead])

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-950 text-gray-500 dark:text-gray-400">
        <p className="text-sm">Selecciona una conversación</p>
      </div>
    )
  }

  const canSend = chat.members_can_send_messages

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-900">
      <header className="shrink-0 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
          {chat.name ?? `Chat ${chat.type}`}
        </h2>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-8 text-gray-500 dark:text-gray-400 text-sm">
            Cargando mensajes...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400 text-sm">
            <p>No hay mensajes aún.</p>
            <p className="text-xs mt-1">Sé el primero en escribir.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              senderName={msg.user_id ? senderNames[msg.user_id] ?? 'Desconocido' : 'Sistema'}
              isOwn={msg.user_id === userId}
            />
          ))
        )}
        <div ref={bottomRef} aria-hidden />
      </div>

      <ChatInput
        onSend={onSendMessage}
        onSendFile={onSendFile}
        disabled={!canSend}
      />
    </div>
  )
}
