import { create } from 'zustand'
import type { Profile } from '../types/profile'

/** Usuario mínimo para UI (sin Supabase: id, email, etc. simulados). */
export interface AuthUser {
  id: string
  email: string | null
}

interface AuthState {
  user: AuthUser | null
  profile: Profile | null
  isLoading: boolean
  isInitialized: boolean
  init: () => void
  loadProfile: (userId: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  setUser: (user: AuthUser | null) => void
  setProfile: (profile: Profile | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isLoading: false,
  isInitialized: true,
  init() {
    set({ isInitialized: true })
  },
  async loadProfile(_userId: string) {
    set({ profile: null })
  },
  async signIn(_email: string, _password: string) {
    set({ isLoading: true })
    set({
      user: { id: 'mock-user-1', email: 'user@example.com' },
      profile: {
        id: 'mock-user-1',
        full_name: 'Usuario Demo',
        email: 'user@example.com',
        username: null,
        role: 'empleado',
        job_title: null,
        avatar_url: null,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        reports_to_id: null,
      },
      isLoading: false,
    })
  },
  async signOut() {
    set({ user: null, profile: null })
  },
  setUser(user) {
    set({ user })
  },
  setProfile(profile) {
    set({ profile })
  },
}))
