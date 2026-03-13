import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Notification } from '../types/notification'

export interface UserNotifications {
  notifications: Notification[]
  dismissedIds: string[]
}

interface NotificationsState {
  /** Estado por usuario: cada usuario tiene su propia lista y sus ids descartados. */
  userData: Record<string, UserNotifications>
  addNotification: (userId: string, n: Notification) => void
  markAsRead: (userId: string, id: string) => void
  markAllAsRead: (userId: string) => void
  dismissNotification: (userId: string, id: string) => void
  clearAll: (userId: string) => void
  getForUser: (userId: string) => UserNotifications
}

function defaultUserState(): UserNotifications {
  return { notifications: [], dismissedIds: [] }
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      userData: {},

      getForUser(userId: string): UserNotifications {
        const { userData } = get()
        return userData[userId] ?? defaultUserState()
      },

      addNotification(userId: string, n: Notification) {
        const { userData } = get()
        const current = userData[userId] ?? defaultUserState()
        if (current.dismissedIds.includes(n.id)) return
        set({
          userData: {
            ...userData,
            [userId]: {
              ...current,
              notifications: [n, ...current.notifications],
            },
          },
        })
      },

      markAsRead(userId: string, id: string) {
        const { userData } = get()
        const current = userData[userId] ?? defaultUserState()
        set({
          userData: {
            ...userData,
            [userId]: {
              ...current,
              notifications: current.notifications.map((item) =>
                item.id === id ? { ...item, read: true } : item
              ),
            },
          },
        })
      },

      markAllAsRead(userId: string) {
        const { userData } = get()
        const current = userData[userId] ?? defaultUserState()
        set({
          userData: {
            ...userData,
            [userId]: {
              ...current,
              notifications: current.notifications.map((item) => ({ ...item, read: true })),
            },
          },
        })
      },

      dismissNotification(userId: string, id: string) {
        const { userData } = get()
        const current = userData[userId] ?? defaultUserState()
        set({
          userData: {
            ...userData,
            [userId]: {
              dismissedIds: [...current.dismissedIds, id],
              notifications: current.notifications.filter((item) => item.id !== id),
            },
          },
        })
      },

      clearAll(userId: string) {
        const { userData } = get()
        const current = userData[userId] ?? defaultUserState()
        const idsToDismiss = current.notifications.map((n) => n.id)
        set({
          userData: {
            ...userData,
            [userId]: {
              dismissedIds: [...current.dismissedIds, ...idsToDismiss],
              notifications: [],
            },
          },
        })
      },
    }),
    { name: 'viruflow-notifications' }
  )
)
