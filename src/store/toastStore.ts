import { create } from 'zustand'

let id = 0

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastState {
  toasts: Toast[]
  add: (message: string, type?: ToastType) => void
  remove: (id: number) => void
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  add(message: string, type: ToastType = 'info') {
    const toast: Toast = { id: ++id, message, type }
    set((s) => ({ toasts: [...s.toasts, toast] }))
    setTimeout(() => get().remove(toast.id), 4000)
  },
  remove(id: number) {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
  },
}))

export const toast = {
  success: (message: string) => useToastStore.getState().add(message, 'success'),
  error: (message: string) => useToastStore.getState().add(message, 'error'),
  info: (message: string) => useToastStore.getState().add(message, 'info'),
}
