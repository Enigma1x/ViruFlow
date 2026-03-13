import { useState, useCallback } from 'react'
import { useAuthStore } from '../../store/authStore'
import { toast } from '../../store/toastStore'
import * as chatService from '../../services/chat'
import { useChatList } from './hooks/useChatList'
import { useChatMessages } from './hooks/useChatMessages'
import { ChatList } from './components/ChatList'
import { ChatWindow } from './components/ChatWindow'
import { ArrowLeft } from 'lucide-react'
import { cn } from '../../utils/cn'

export function Chat() {
  const userId = useAuthStore((s) => s.user?.id)
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [mobileShowList, setMobileShowList] = useState(true)

  const { chats, loading: listLoading, error: listError } = useChatList(userId)
  const {
    messages,
    loading: messagesLoading,
    sendMessage,
    sendFile,
  } = useChatMessages(activeChatId, userId)

  const activeChat = activeChatId ? chats.find((c) => c.id === activeChatId) ?? null : null

  const handleSelectChat = useCallback((chatId: string) => {
    setActiveChatId(chatId)
    setMobileShowList(false)
  }, [])

  const handleMarkRead = useCallback(() => {
    if (activeChatId && userId) {
      chatService.markChatAsRead(activeChatId, userId).catch(() => {})
    }
  }, [activeChatId, userId])

  const handleSendMessage = useCallback(
    async (content: string, mediaUrl?: string | null) => {
      try {
        await sendMessage(content, mediaUrl)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Error al enviar el mensaje')
      }
    },
    [sendMessage]
  )

  const handleSendFile = useCallback(
    async (file: File) => {
      try {
        await sendFile(file)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Error al enviar el archivo')
      }
    },
    [sendFile]
  )

  const showBackOnMobile = !mobileShowList && activeChatId

  return (
    <div className="flex flex-col h-full min-h-0 bg-gray-50 dark:bg-gray-950">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <aside
          className={cn(
            'flex flex-col w-72 shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900',
            'lg:flex',
            mobileShowList ? 'flex' : 'hidden'
          )}
        >
          <div className="shrink-0 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Conversaciones
            </h2>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            <ChatList
              chats={chats}
              loading={listLoading}
              error={listError}
              activeChatId={activeChatId}
              onSelectChat={handleSelectChat}
            />
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 min-h-0">
          {showBackOnMobile && (
            <button
              type="button"
              onClick={() => setMobileShowList(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
              aria-label="Volver a conversaciones"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </button>
          )}
          <ChatWindow
            chat={activeChat}
            messages={messages}
            loading={messagesLoading}
            userId={userId}
            onSendMessage={handleSendMessage}
            onSendFile={handleSendFile}
            onMarkRead={handleMarkRead}
          />
        </main>
      </div>
    </div>
  )
}
