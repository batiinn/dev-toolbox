import { useEffect, useState } from 'react'
import { Command } from 'cmdk'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'
import { CATEGORY_ORDER } from '../tools/types'
import { TOOLS } from '../tools/registry'

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const go = (id: string) => {
    setOpen(false)
    navigate(`/tool/${id}`)
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-[12vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <Command
        label={t('app.search')}
        className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        filter={(value, search) => (value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0)}
      >
        <div className="flex items-center gap-2 border-b border-border px-4">
          <Search size={16} className="text-muted" />
          <Command.Input
            autoFocus
            placeholder={t('app.searchPlaceholder')}
            className="w-full bg-transparent py-3.5 text-sm text-fg outline-none placeholder:text-muted"
          />
        </div>
        <Command.List className="max-h-80 overflow-auto p-2">
          <Command.Empty className="py-6 text-center text-sm text-muted">
            {t('app.noResults')}
          </Command.Empty>
          {CATEGORY_ORDER.map((cat) => {
            const tools = TOOLS.filter((tool) => tool.category === cat)
            return (
              <Command.Group
                key={cat}
                heading={t(`app.categories.${cat}`)}
                className="mb-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted"
              >
                {tools.map((tool) => (
                  <Command.Item
                    key={tool.id}
                    value={`${t(`tools.${tool.id}.name`)} ${tool.keywords.join(' ')}`}
                    onSelect={() => go(tool.id)}
                    className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-fg aria-selected:bg-accent aria-selected:text-accent-fg"
                  >
                    <span>{t(`tools.${tool.id}.name`)}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )
          })}
        </Command.List>
      </Command>
    </div>
  )
}
