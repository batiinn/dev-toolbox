import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'
const KEY = 'devtoolbox-theme'

function safeGet(key: string): string | null {
  try {
    return globalThis.localStorage?.getItem(key) ?? null
  } catch {
    return null
  }
}

function safeSet(key: string, value: string): void {
  try {
    globalThis.localStorage?.setItem(key, value)
  } catch {
    /* empty */
  }
}

function getInitial(): Theme {
  const saved = safeGet(KEY)
  if (saved === 'light' || saved === 'dark') return saved
  if (typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'dark'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitial)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    safeSet(KEY, theme)
  }, [theme])
  return { theme, toggle: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) }
}
