import { useEffect, useState, useCallback } from 'react'
import * as chatService from '../../../services/chat'
import type { Message } from '../../../types/chat'
import { supabase } from '../../../lib/supabase'

export function useChatMessages(chatId: string | null, userId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  const loadMessages = useCallback(async () => {
    if (!chatId) {
      setMessages([])
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const list = await chatService.getChatMessages(chatId)
      setMessages(list)
    } finally {
      setLoading(false)
    }
  }, [chatId])

  useEffect(() => {
    loadMessages()
  }, [loadMessages])

  useEffect(() => {
    if (!chatId) return

    const channel = supabase
      .channel(`messages:${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          const newRow = payload.new as Message
          setMessages((prev) => [...prev, newRow])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [chatId])

  const sendMessage = useCallback(
    async (content: string, mediaUrl?: string | null) => {
      if (!chatId || !userId) return
      await chatService.sendMessage(chatId, userId, content, mediaUrl)
    },
    [chatId, userId]
  )

  const sendFile = useCallback(
    async (file: File) => {
      if (!chatId || !userId) return
      const url = await chatService.uploadChatFile(chatId, userId, file)
      await chatService.sendMessage(chatId, userId, file.name, url)
    },
    [chatId, userId]
  )

  return { messages, loading, sendMessage, sendFile }
}
