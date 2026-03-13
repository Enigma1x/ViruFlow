import { useEffect, useState } from 'react'
import * as chatService from '../../../services/chat'
import type { Chat } from '../../../types/chat'
import type { ChatMemberRow } from '../../../services/chat'
import { supabase } from '../../../lib/supabase'

export interface ChatWithUnread extends Chat {
  unreadCount: number
}

const CUTOFF = '1970-01-01T00:00:00.000Z'

export function useChatList(userId: string | undefined) {
  const [chats, setChats] = useState<ChatWithUnread[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setChats([])
      setLoading(false)
      return
    }

    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const { data: membershipsData, error: memError } = await supabase
          .from('chat_members')
          .select('chat_id, marked_unread_at')
          .eq('user_id', userId)

        if (memError) throw new Error(memError.message)
        const memberships = (membershipsData ?? []) as ChatMemberRow[]

        const chatList = await chatService.getUserChats(userId)
        if (cancelled) return

        const byChatId = new Map<string, string | null>()
        for (const m of memberships) {
          byChatId.set(m.chat_id, m.marked_unread_at)
        }

        const withUnread: ChatWithUnread[] = await Promise.all(
          chatList.map(async (chat) => {
            const since = byChatId.get(chat.id) ?? CUTOFF
            const unreadCount = await chatService.getUnreadMessageCount(chat.id, since)
            return { ...chat, unreadCount }
          })
        )

        setChats(withUnread)
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : 'Error al cargar chats')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [userId])

  return { chats, loading, error }
}
