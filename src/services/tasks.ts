import { supabase } from '../lib/supabase'
import type { Task } from '../types/task'

const TABLE = 'tasks'

export async function listTasks(workspaceId?: string): Promise<Task[]> {
  let query = supabase.from(TABLE).select('*').order('created_at', { ascending: false })

  if (workspaceId) {
    query = query.eq('workspace_id', workspaceId)
  }

  const { data, error } = await query

  if (error) throw new Error(error.message)
  return (data ?? []) as Task[]
}

export type CreateTaskInput = Omit<Task, 'id' | 'created_at' | 'updated_at'>

export async function createTask(data: CreateTaskInput): Promise<Task> {
  const { data: row, error } = await supabase
    .from(TABLE)
    .insert({
      workspace_id: data.workspace_id,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      assigned_to: data.assigned_to,
      assigned_by: data.assigned_by,
      created_by: data.created_by,
      due_date: data.due_date,
      started_at: data.started_at,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return row as Task
}

export async function updateTask(id: string, data: Partial<Task>): Promise<Task> {
  const { id: _id, created_at: _ca, updated_at: _ua, ...rest } = data as Task
  const { data: row, error } = await supabase
    .from(TABLE)
    .update(rest)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return row as Task
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) throw new Error(error.message)
}
