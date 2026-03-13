import { useEffect } from 'react'
import { AppProviders } from './AppProviders'
import { useThemeStore, applyThemeToDocument } from '../store/themeStore'
import './App.css'

function App() {
  const initTheme = useThemeStore((s) => s.init)

  useEffect(() => {
    initTheme()
  }, [initTheme])

  useEffect(() => {
    applyThemeToDocument(useThemeStore.getState().theme)
    const unsub = useThemeStore.subscribe((state) => {
      applyThemeToDocument(state.theme)
    })
    return unsub
  }, [])

  return <AppProviders />
}

export default App
