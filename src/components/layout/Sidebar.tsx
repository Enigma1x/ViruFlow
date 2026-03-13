import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderKanban,
  StickyNote,
  ListTodo,
  MessageSquare,
  User,
  Network,
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { useAuthStore } from '../../store/authStore'
import * as chatService from '../../services/chat'
import { NotificationsBell } from '../ui/NotificationsBell'

const LOGO_SOURCES = ['/logo.svg', '/logo.png']

function Logo() {
  const [srcIndex, setSrcIndex] = useState(0)
  const useFallback = srcIndex >= LOGO_SOURCES.length
  return useFallback ? (
    <LayoutDashboard className="w-7 h-7 shrink-0 text-brand" aria-hidden />
  ) : (
    <img
      src={LOGO_SOURCES[srcIndex]}
      alt="Viruflow"
      className="h-7 w-7 shrink-0 object-contain"
      onError={() => setSrcIndex((i) => i + 1)}
    />
  )
}

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/chat', label: 'Chat', icon: MessageSquare },
  { to: '/notes', label: 'Notas', icon: StickyNote },
  { to: '/tasks', label: 'Tareas', icon: ListTodo },
  { to: '/workspaces', label: 'Espacios', icon: FolderKanban },
  { to: '/organigrama', label: 'Organigrama', icon: Network },
  { to: '/profile', label: 'Perfil', icon: User },
] as const

interface SidebarProps {
  isOpen: boolean
  onClose?: () => void
  className?: string
}

export function Sidebar({ isOpen, onClose, className }: SidebarProps) {
  const userId = useAuthStore((s) => s.user?.id)
  const profile = useAuthStore((s) => s.profile)
  const location = useLocation()
  const [unreadChatsCount, setUnreadChatsCount] = useState(0)

  useEffect(() => {
    if (!userId) return
    chatService
      .getUnreadChatsCount(userId)
      .then(setUnreadChatsCount)
      .catch(() => setUnreadChatsCount(0))
  }, [userId, location.pathname])

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-hidden
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          'group fixed left-0 top-0 z-50 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-200 ease-out',
          'w-72 lg:w-[4.5rem] lg:hover:w-72',
          'lg:overflow-hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0 lg:static lg:z-auto lg:shadow-none',
          className
        )}
      >
        <div className="flex flex-col h-full pt-14 lg:pt-6 min-w-0">
          <div className="flex items-center shrink-0 px-3 lg:px-4 py-5 border-b border-gray-100 dark:border-gray-700 gap-3">
            <Logo />
            <span className="text-xl lg:text-2xl font-semibold text-brand tracking-tight whitespace-nowrap overflow-hidden lg:max-w-0 lg:group-hover:max-w-[12rem] transition-[max-width] duration-200 ease-out">
              Viruflow
            </span>
          </div>
          <nav className="flex-1 flex flex-col justify-center overflow-y-auto px-3 py-3 space-y-1">
            {navItems.map(({ to, label, icon: Icon }) => {
              const isChat = to === '/chat'
              return (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={() => onClose?.()}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-3 rounded-xl text-base font-medium transition-colors min-w-0 w-full text-left',
                      'py-2.5 pl-3 pr-4',
                      isActive
                        ? 'text-brand'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-brand/15 dark:hover:bg-brand/20 hover:text-gray-900 dark:hover:text-gray-100'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="relative shrink-0">
                        <span
                          className={cn(
                            'flex items-center justify-center w-9 h-9 shrink-0 rounded-lg transition-colors',
                            isActive && 'bg-brand/15 dark:bg-brand/30',
                            !isActive && 'group-hover:bg-brand/15 dark:group-hover:bg-brand/25'
                          )}
                        >
                          <Icon
                            className="w-5 h-5"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden
                          />
                        </span>
                        {isChat && unreadChatsCount > 0 && (
                          <span
                            className="absolute -top-0.5 -right-0.5 min-w-[1.25rem] h-5 px-1.5 flex items-center justify-center rounded-full bg-green-500 text-white text-xs font-semibold"
                            aria-label={`${unreadChatsCount} mensajes no leídos`}
                          >
                            {unreadChatsCount > 99 ? '99+' : unreadChatsCount}
                          </span>
                        )}
                      </span>
                      <span className="whitespace-nowrap overflow-hidden text-left lg:max-w-0 lg:opacity-0 lg:group-hover:max-w-[10rem] lg:group-hover:opacity-100 transition-all duration-200 ease-out">
                        {label}
                      </span>
                    </>
                  )}
                </NavLink>
              )
            })}
            <NotificationsBell />
          </nav>
          {userId && profile && (
            <div className="shrink-0 border-t border-gray-100 dark:border-gray-700 p-3">
              <Link
                to="/profile"
                onClick={() => onClose?.()}
                className={cn(
                  'flex items-center gap-3 rounded-xl py-2 pl-3 pr-4 w-full text-left',
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
                  'min-w-0'
                )}
                aria-label="Ir a mi perfil"
              >
                <span className="shrink-0 w-9 h-9 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getInitials(profile.full_name)
                  )}
                </span>
                <span className="whitespace-nowrap overflow-hidden text-ellipsis lg:max-w-0 lg:opacity-0 lg:group-hover:max-w-[10rem] lg:group-hover:opacity-100 transition-all duration-200 ease-out">
                  {profile.full_name}
                </span>
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
