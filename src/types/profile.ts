/** Esquema real: public.profiles. role check ('jefe','empleado'). */
export type Role = 'jefe' | 'empleado'

/** job_title check ('cajero','vendedor','bodeguero','encomiendero','chepe'). */
export type JobTitle = 'cajero' | 'vendedor' | 'bodeguero' | 'encomiendero' | 'chepe' | null

export interface Profile {
  id: string
  full_name: string
  email: string | null
  username: string | null
  role: Role
  job_title: JobTitle
  avatar_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  reports_to_id: string | null
}

export type ProfileInsert = Omit<Profile, 'created_at' | 'updated_at'> & {
  created_at?: string
  updated_at?: string
}

export type ProfileUpdate = Partial<Omit<ProfileInsert, 'id'>>
