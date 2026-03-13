export type NotificationType =
  | 'task_completed'
  | 'task_assigned'
  | 'note_assigned'
  | 'mention'
  | 'system'

export interface Notification {
  id: string
  type: NotificationType
  message: string
  read: boolean
  taskId?: string
  noteId?: string
  createdAt: string
}
