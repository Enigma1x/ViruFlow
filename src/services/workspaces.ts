import { supabase } from '../lib/supabase'
import type { Workspace } from '../types/workspace'

const TABLE = 'workspaces'

export async function listWorkspaces(): Promise<Workspace[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as Workspace[]
}

export type CreateWorkspaceInput = Omit<Workspace, 'id' | 'created_at' | 'updated_at'>

export async function createWorkspace(data: CreateWorkspaceInput): Promise<Workspace> {
  const { data: row, error } = await supabase
    .from(TABLE)
    .insert({
      name: data.name,
      description: data.description,
      created_by: data.created_by,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return row as Workspace
}

export async function updateWorkspace(id: string, data: Partial<Workspace>): Promise<Workspace> {
  const { id: _id, created_at: _ca, updated_at: _ua, ...rest } = data as Workspace
  const { data: row, error } = await supabase
    .from(TABLE)
    .update(rest)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return row as Workspace
}

export async function deleteWorkspace(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) throw new Error(error.message)
}
