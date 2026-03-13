import { create } from 'zustand'

const STORAGE_KEY = 'viruflow-taskmanager-theme'

export type Theme = 'light' | 'dark' | 'system'

function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }
  return theme
}

/** Aplica la clase "dark" al <html> para que Tailwind dark: funcione. */
export function applyThemeToDocument(theme: Theme) {
  if (typeof document === 'undefined') return
  const resolved = resolveTheme(theme)
  const root = document.documentElement
  if (resolved === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

function getStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
  if (stored === 'dark' || stored === 'light' || stored === 'system') return stored
  return null
}

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  init: () => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'light',
  setTheme(theme: Theme) {
    localStorage.setItem(STORAGE_KEY, theme)
    applyThemeToDocument(theme)
    set({ theme })
  },
  toggleTheme() {
    set((state) => {
      const resolved = resolveTheme(state.theme)
      const next: Theme = resolved === 'dark' ? 'light' : 'dark'
      localStorage.setItem(STORAGE_KEY, next)
      applyThemeToDocument(next)
      return { theme: next }
    })
  },
  init() {
    const stored = getStoredTheme()
    const theme: Theme =
      stored ??
      (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light')
    if (!stored) localStorage.setItem(STORAGE_KEY, theme)
    applyThemeToDocument(theme)
    set({ theme })
  },
}))
