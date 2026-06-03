import { useCallback, useEffect, useState } from 'react'

const KEY = 'devtoolbox-recents'
const MAX = 6

function read(): string[] {
  try {
    const raw = globalThis.localStorage?.getItem(KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export function useRecents() {
  const [recents, setRecents] = useState<string[]>(read)

  const push = useCallback((id: string) => {
    setRecents((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, MAX)
      try {
        globalThis.localStorage?.setItem(KEY, JSON.stringify(next))
      } catch {
        /* empty */
      }
      return next
    })
  }, [])

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setRecents(read())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return { recents, push }
}
