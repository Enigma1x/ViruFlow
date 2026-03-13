import { Menu } from 'lucide-react'
import { useThemeStore } from '../../store/themeStore'
import { cn } from '../../utils/cn'

interface HeaderProps {
  title: string
  onMenuClick?: () => void
}

export function Header({ title, onMenuClick }: HeaderProps) {
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
          {title}
        </h1>
      </div>
      <button
        type="button"
        onClick={toggleTheme}
        className={cn(
          'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
          'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
          'hover:bg-brand/15 dark:hover:bg-brand/20'
        )}
        aria-label={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      >
        {theme === 'dark' ? 'Claro' : 'Oscuro'}
      </button>
    </header>
  )
}
