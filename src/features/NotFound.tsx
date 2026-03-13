import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        404 – Página no encontrada
      </h1>
      <Link
        to="/"
        className="text-brand hover:underline font-medium"
      >
        Volver al Dashboard
      </Link>
    </div>
  )
}
