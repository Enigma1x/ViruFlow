/** Esquema real: public.notes. status check ('activa','archivada','completada'). */
export type NoteStatus = 'activa' | 'archivada' | 'completada'

/** priority check ('baja','media','alta'). */
export type NotePriority = 'baja' | 'media' | 'alta'

export interface Note {
  id: string
  title: string
  content: string | null
  color: string
  priority: NotePriority
  status: NoteStatus
  workspace_id: string | null
  task_id: string | null
  assigned_to: string | null
  created_by: string | null
  position: number
  position_x: number
  position_y: number
  created_at: string
  updated_at: string
}
