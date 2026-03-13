import { useState, useMemo } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/workspaces': 'Espacios de trabajo',
  '/notes': 'Notas',
  '/tasks': 'Tareas',
  '/chat': 'Chat',
  '/profile': 'Perfil',
  '/organigrama': 'Organigrama',
}

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const title = useMemo(
    () => ROUTE_TITLES[location.pathname] ?? 'Viruflow',
    [location.pathname]
  )

  return (
    <div className="flex h-screen bg-gray-50/80 dark:bg-gray-950">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        className="shrink-0"
      />
      <div className="flex flex-1 flex-col min-w-0 min-h-0">
        <Header title={title} onMenuClick={() => setSidebarOpen((o) => !o)} />
        <div className="flex-1 min-h-0 overflow-auto overflow-x-hidden flex flex-col">
          <main
            className={
              location.pathname === '/chat' || location.pathname === '/notes'
                ? 'flex-1 flex flex-col min-h-0 min-w-0 w-full p-0'
                : 'flex-1 flex flex-col min-w-0 w-full max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8'
            }
          >
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
