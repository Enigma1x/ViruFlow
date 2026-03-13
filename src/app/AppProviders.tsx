import { AppRouter } from './router'
import { Toaster } from '../components/shared/Toaster'

export function AppProviders() {
  return (
    <>
      <AppRouter />
      <Toaster />
    </>
  )
}
