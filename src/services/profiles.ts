import { supabase } from '../lib/supabase'
import type { Profile } from '../types/profile'

const TABLE = 'profiles'
const AVATAR_BUCKET = 'avatars'

export async function listProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('full_name')

  if (error) throw new Error(error.message)
  return (data ?? []) as Profile[]
}

export async function getProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw new Error(error.message)
  return data as Profile
}

export async function updateProfile(userId: string, data: Partial<Profile>): Promise<Profile> {
  const { id: _id, created_at: _ca, updated_at: _ua, ...rest } = data as Profile
  const { data: row, error } = await supabase
    .from(TABLE)
    .update({ ...rest, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return row as Profile
}

const ALLOWED_EXT = ['jpg', 'jpeg', 'png', 'gif', 'webp'] as const
const FALLBACK_EXT = 'jpg'

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const rawExt = (file.name.split('.').pop() ?? '').toLowerCase()
  const ext = ALLOWED_EXT.includes(rawExt as (typeof ALLOWED_EXT)[number])
    ? rawExt
    : FALLBACK_EXT
  const path = `${userId}/avatar.${ext}`

  const { data: { session } } = await supabase.auth.getSession()
  console.log('=== DEBUG AVATAR ===')
  console.log('userId param:', userId)
  console.log('auth.uid from session:', session?.user?.id)
  console.log('JWT sub:', session?.user?.id)
  console.log('path que se va a subir:', `${userId}/avatar.${ext}`)
  console.log('content-type:', file.type)
  console.log('====================')

  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(path, file, {
      upsert: true,
      contentType: file.type || `image/${ext}`,
    })

  if (uploadError) {
    const msg =
      uploadError.message ||
      'Error al subir. Comprueba que el bucket "avatars" existe y tiene políticas en Storage.'
    throw new Error(msg)
  }

  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path)
  return data.publicUrl
}
