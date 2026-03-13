import { supabase } from '../lib/supabase'
import type { Chat } from '../types/chat'
import type { Message } from '../types/chat'

const CHATS_TABLE = 'chats'
const MESSAGES_TABLE = 'messages'
const CHAT_MEMBERS_TABLE = 'chat_members'
const CHAT_MEDIA_BUCKET = 'chat-media'

export interface ChatMemberRow {
  chat_id: string
  user_id: string
  marked_unread_at: string | null
}

/** Chats donde el usuario es miembro (vía chat_members). */
export async function getUserChats(userId: string): Promise<Chat[]> {
  const { data: memberships, error: memError } = await supabase
    .from(CHAT_MEMBERS_TABLE)
    .select('chat_id')
    .eq('user_id', userId)

  if (memError) throw new Error(memError.message)
  const chatIds = (memberships ?? []).map((m) => m.chat_id as string)
  if (chatIds.length === 0) return []

  const { data: chats, error } = await supabase
    .from(CHATS_TABLE)
    .select('*')
    .in('id', chatIds)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (chats ?? []) as Chat[]
}

/** Cuenta mensajes de un chat creados después de una fecha (para unread). */
export async function getUnreadMessageCount(chatId: string, since: string): Promise<number> {
  const { count, error } = await supabase
    .from(MESSAGES_TABLE)
    .select('id', { count: 'exact', head: true })
    .eq('chat_id', chatId)
    .gt('created_at', since)

  if (error) throw new Error(error.message)
  return count ?? 0
}

/** Mensajes de un chat. */
export async function getChatMessages(chatId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from(MESSAGES_TABLE)
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)
  return (data ?? []) as Message[]
}

/** Enviar mensaje de texto o con media. */
export async function sendMessage(
  chatId: string,
  userId: string,
  content: string,
  mediaUrl?: string | null
): Promise<Message> {
  const { data, error } = await supabase
    .from(MESSAGES_TABLE)
    .insert({
      chat_id: chatId,
      user_id: userId,
      content: content.trim() || ' ',
      media: mediaUrl ?? null,
      message_type: 'text',
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Message
}

/** Marcar chat como leído para el usuario (actualiza marked_unread_at en chat_members). */
export async function markChatAsRead(chatId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from(CHAT_MEMBERS_TABLE)
    .update({ marked_unread_at: new Date().toISOString() })
    .eq('chat_id', chatId)
    .eq('user_id', userId)

  if (error) throw new Error(error.message)
}

/** Número total de mensajes no leídos en todos los chats del usuario (para Sidebar). */
export async function getUnreadChatsCount(userId: string): Promise<number> {
  const { data: memberships, error: memError } = await supabase
    .from(CHAT_MEMBERS_TABLE)
    .select('chat_id, marked_unread_at')
    .eq('user_id', userId)

  if (memError) throw new Error(memError.message)
  const rows = (memberships ?? []) as ChatMemberRow[]
  if (rows.length === 0) return 0

  const cutoffEpoch = '1970-01-01T00:00:00.000Z'
  let total = 0

  for (const row of rows) {
    const since = row.marked_unread_at ?? cutoffEpoch
    const { count, error } = await supabase
      .from(MESSAGES_TABLE)
      .select('id', { count: 'exact', head: true })
      .eq('chat_id', row.chat_id)
      .gt('created_at', since)

    if (!error) total += count ?? 0
  }

  return total
}

/** Subir archivo al bucket chat-media y devolver URL pública. */
export async function uploadChatFile(chatId: string, userId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'bin'
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`
  const path = `${chatId}/${userId}/${safeName}`

  const { error } = await supabase.storage.from(CHAT_MEDIA_BUCKET).upload(path, file, {
    upsert: false,
  })

  if (error) throw new Error(error.message)

  const { data } = supabase.storage.from(CHAT_MEDIA_BUCKET).getPublicUrl(path)
  return data.publicUrl
}
