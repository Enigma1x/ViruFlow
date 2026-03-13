import { supabase } from '../lib/supabase'
import type { Note } from '../types/note'

const TABLE = 'notes'

export interface ListNotesFilters {
  workspace_id?: string
  task_id?: string
  search?: string
}

export async function listNotes(filters?: ListNotesFilters): Promise<Note[]> {
  let query = supabase.from(TABLE).select('*').order('updated_at', { ascending: false })

  if (filters?.workspace_id) {
    query = query.eq('workspace_id', filters.workspace_id)
  }
  if (filters?.task_id != null) {
    query = query.eq('task_id', filters.task_id)
  }
  if (filters?.search && filters.search.trim() !== '') {
    query = query.or(
      `title.ilike.%${filters.search.trim()}%,content.ilike.%${filters.search.trim()}%`
    )
  }

  const { data, error } = await query

  if (error) throw new Error(error.message)
  return (data ?? []) as Note[]
}

export type CreateNoteInput = Omit<Note, 'id' | 'created_at' | 'updated_at'>

export async function createNote(data: CreateNoteInput): Promise<Note> {
  const { data: row, error } = await supabase
    .from(TABLE)
    .insert({
      title: data.title,
      content: data.content,
      color: data.color,
      priority: data.priority,
      status: data.status,
      workspace_id: data.workspace_id,
      task_id: data.task_id,
      assigned_to: data.assigned_to,
      created_by: data.created_by,
      position: data.position,
      position_x: data.position_x,
      position_y: data.position_y,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return row as Note
}

export async function updateNote(id: string, data: Partial<Note>): Promise<Note> {
  const { id: _id, created_at: _ca, updated_at: _ua, ...rest } = data as Note
  const { data: row, error } = await supabase
    .from(TABLE)
    .update({ ...rest, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return row as Note
}

export async function deleteNote(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function duplicateNote(id: string): Promise<Note> {
  const { data: existing, error: fetchError } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError) throw new Error(fetchError.message)
  const original = existing as Note

  const insert: CreateNoteInput = {
    title: `${original.title} (copia)`,
    content: original.content,
    color: original.color,
    priority: original.priority,
    status: original.status,
    workspace_id: original.workspace_id,
    task_id: original.task_id,
    assigned_to: original.assigned_to,
    created_by: original.created_by,
    position: original.position,
    position_x: original.position_x + 20,
    position_y: original.position_y + 20,
  }
  return createNote(insert)
}

export async function updateNoteCanvasPosition(id: string, x: number, y: number): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update({ position_x: x, position_y: y, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error(error.message)
}
