import { useEffect, useRef, useState } from 'react'
import { Bell, X } from 'lucide-react'
import { cn } from '../../utils/cn'
import { useAuthStore } from '../../store/authStore'
import { useNotificationsStore } from '../../store/notificationsStore'
import type { Notification } from '../../types/notification'

function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return 'ahora'
  if (diffMin < 60) return `hace ${diffMin} min`
  if (diffHour < 24) return `hace ${diffHour} h`
  if (diffDay === 1) return 'ayer'
  if (diffDay < 7) return `hace ${diffDay} días`
  return date.toLocaleDateString()
}

export function NotificationsBell() {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const userId = useAuthStore((s) => s.user?.id)

  const notifications = useNotificationsStore((state) =>
    userId ? state.userData[userId]?.notifications ?? [] : []
  )
  const markAsRead = useNotificationsStore((s) => s.markAsRead)
  const markAllAsRead = useNotificationsStore((s) => s.markAllAsRead)
  const dismissNotification = useNotificationsStore((s) => s.dismissNotification)
  const clearAll = useNotificationsStore((s) => s.clearAll)

  const unreadCount = notifications.filter((n) => !n.read).length
  const hasUnread = unreadCount > 0

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [open])

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'group flex items-center gap-3 rounded-xl text-base font-medium transition-colors min-w-0 w-full',
          'py-2.5 pl-3 pr-4 text-left',
          'text-gray-600 dark:text-gray-400 hover:bg-brand/15 dark:hover:bg-brand/20 hover:text-gray-900 dark:hover:text-gray-100'
        )}
        aria-label={open ? 'Cerrar notificaciones' : 'Ver notificaciones'}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span className="relative shrink-0">
          <span
            className={cn(
              'flex items-center justify-center w-9 h-9 shrink-0 rounded-lg transition-colors',
              'group-hover:bg-brand/15 dark:group-hover:bg-brand/25'
            )}
          >
            <Bell className="w-5 h-5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden />
          </span>
          {unreadCount > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 min-w-[1.25rem] h-5 px-1.5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-semibold"
              aria-label={`${unreadCount} notificaciones no leídas`}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </span>
        <span className="whitespace-nowrap overflow-hidden text-left lg:max-w-0 lg:opacity-0 lg:group-hover:max-w-[10rem] lg:group-hover:opacity-100 transition-all duration-200 ease-out">
          Notificaciones
        </span>
      </button>

      {open && (
        <div
          className={cn(
            'absolute left-0 right-0 lg:left-auto lg:right-0 bottom-full lg:bottom-auto lg:top-full mb-1 lg:mt-1 z-50',
            'min-w-[18rem] max-w-[calc(100vw-1.5rem)] max-h-[24rem] overflow-hidden',
            'rounded-xl border border-gray-200 dark:border-gray-600',
            'bg-white dark:bg-gray-800 shadow-lg'
          )}
          role="dialog"
          aria-label="Lista de notificaciones"
        >
          <div className="p-2 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between gap-2 flex-wrap">
            {hasUnread && userId && (
              <button
                type="button"
                onClick={() => markAllAsRead(userId)}
                className="text-sm font-medium text-brand hover:underline"
              >
                Marcar todo como leído
              </button>
            )}
            {userId && (
              <button
                type="button"
                onClick={() => clearAll(userId)}
                className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:underline"
              >
                Limpiar
              </button>
            )}
          </div>
          <div className="overflow-y-auto max-h-[20rem]">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">
                No hay notificaciones
              </div>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                {userId &&
                  notifications.map((item) => (
                    <NotificationItem
                      key={item.id}
                      item={item}
                      onDismiss={() => dismissNotification(userId, item.id)}
                      onMarkRead={() => markAsRead(userId, item.id)}
                      formatTime={formatRelativeTime}
                    />
                  ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function NotificationItem({
  item,
  onDismiss,
  onMarkRead,
  formatTime,
}: {
  item: Notification
  onDismiss: () => void
  onMarkRead: () => void
  formatTime: (iso: string) => string
}) {
  const isUnread = !item.read
  return (
    <li
      className={cn(
        'flex items-start gap-2 p-3 text-left transition-colors',
        isUnread && 'bg-brand/10 dark:bg-brand/15'
      )}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800 dark:text-gray-200">{item.message}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{formatTime(item.createdAt)}</p>
      </div>
      <button
        type="button"
        onClick={() => {
          if (isUnread) onMarkRead()
          onDismiss()
        }}
        className="shrink-0 p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        aria-label="Descartar notificación"
      >
        <X className="w-4 h-4" />
      </button>
    </li>
  )
}
