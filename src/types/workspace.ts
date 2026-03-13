/** Esquema real: public.workspaces. owner es created_by. */
export interface Workspace {
  id: string
  name: string
  description: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}
