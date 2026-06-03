import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, Moon, Search, Star, Sun, Wrench, X } from 'lucide-react'
import { CATEGORY_ORDER } from '../tools/types'
import { CATEGORY_ICON } from '../tools/categoryMeta'
import { TOOLS } from '../tools/registry'
import { useTheme } from '../hooks/useTheme'
import { CommandPalette } from './CommandPalette'

const GITHUB_URL = 'https://github.com/batiinn/dev-toolbox'

export function Layout() {
  const { t, i18n } = useTranslation()
  const { theme, toggle } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const sidebar = (
    <nav className="flex h-full flex-col">
      <NavLink
        to="/"
        onClick={() => setMobileOpen(false)}
        className="flex items-center gap-2 px-4 py-4 text-fg"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-fg">
          <Wrench size={18} />
        </span>
        <span className="text-base font-semibold">{t('app.title')}</span>
      </NavLink>

      <button
        onClick={() => {
          setMobileOpen(false)
          document.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true }),
          )
        }}
        className="mx-3 mb-2 flex items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-muted hover:text-fg transition cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <Search size={14} /> {t('app.search')}
        </span>
        <kbd className="rounded border border-border px-1.5 py-0.5 text-xs">⌘K</kbd>
      </button>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {CATEGORY_ORDER.map((cat) => {
          const CatIcon = CATEGORY_ICON[cat]
          return (
          <div key={cat} className="mb-3">
            <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted">
              <CatIcon size={13} /> {t(`app.categories.${cat}`)}
            </div>
            {TOOLS.filter((tool) => tool.category === cat).map((tool) => (
              <NavLink
                key={tool.id}
                to={`/tool/${tool.id}`}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-1.5 text-sm transition ${
                    isActive
                      ? 'bg-accent/15 text-accent font-medium'
                      : 'text-muted hover:bg-surface-2 hover:text-fg'
                  }`
                }
              >
                {t(`tools.${tool.id}.name`)}
              </NavLink>
            ))}
          </div>
          )
        })}
      </div>

      <div className="flex items-center gap-1 border-t border-border px-3 py-2">
        <button
          onClick={toggle}
          aria-label="theme"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-fg transition cursor-pointer"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button
          onClick={() => i18n.changeLanguage(i18n.language.startsWith('tr') ? 'en' : 'tr')}
          className="flex h-8 items-center rounded-lg px-2 text-xs font-medium text-muted hover:bg-surface-2 hover:text-fg transition cursor-pointer"
        >
          {i18n.language.startsWith('tr') ? 'TR' : 'EN'}
        </button>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-fg transition"
        >
          <Star size={16} />
        </a>
      </div>
    </nav>
  )

  return (
    <div className="flex h-full">
      <CommandPalette />

      <aside className="hidden w-64 shrink-0 border-r border-border bg-bg md:block">{sidebar}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 border-r border-border bg-bg">
            {sidebar}
          </aside>
        </div>
      )}

      <main className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3 md:hidden">
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="menu"
            className="text-fg"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="font-semibold text-fg">{t('app.title')}</span>
        </div>
        <div key={location.pathname}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
