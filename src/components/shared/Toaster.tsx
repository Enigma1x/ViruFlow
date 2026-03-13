import { useToastStore } from '../../store/toastStore'
import { cn } from '../../utils/cn'

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)

  return (
    <div
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="alert"
          className={cn(
            'pointer-events-auto px-4 py-3 rounded-lg shadow-lg border text-sm font-medium',
            t.type === 'success' && 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
            t.type === 'error' && 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
            t.type === 'info' && 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
          )}
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}
