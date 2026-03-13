/** Esquema real: public.tasks. status check ('planeado','pendiente','en_proceso','completada','cancelada'). */
export type TaskStatus =
  | 'planeado'
  | 'pendiente'
  | 'en_proceso'
  | 'completada'
  | 'cancelada'

/** priority check ('baja','media','alta'). */
export type TaskPriority = 'baja' | 'media' | 'alta'

export interface Task {
  id: string
  workspace_id: string | null
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  assigned_to: string | null
  assigned_by: string | null
  created_by: string | null
  due_date: string | null
  started_at: string | null
  created_at: string
  updated_at: string
}
