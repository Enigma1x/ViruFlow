/** Esquema real: public.chats. type check ('general','workspace','direct'). Sin participants[]; miembros en chat_members. */
export type ChatType = 'general' | 'workspace' | 'direct'

export interface Chat {
  id: string
  name: string | null
  type: ChatType
  workspace_id: string | null
  created_by: string | null
  created_at: string
  members_can_edit_settings: boolean
  members_can_send_messages: boolean
  members_can_add_members: boolean
  admins_approve_new_members: boolean
}

/** Esquema real: public.messages. user_id (no sender_id), media (no file_url), sin read_at. */
export type MessageType = 'text' | 'system'

export interface Message {
  id: string
  chat_id: string
  user_id: string | null
  content: string
  media: string | null
  message_type: MessageType
  created_at: string
}
