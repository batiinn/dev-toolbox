import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Clock, Search, ShieldCheck, Star, WifiOff, Zap } from 'lucide-react'
import { CATEGORY_ORDER } from '../tools/types'
import { CATEGORY_ICON } from '../tools/categoryMeta'
import { TOOLS, getTool } from '../tools/registry'
import { useRecents } from '../hooks/useRecents'

function openPalette() {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true }))
}

export function Home() {
  const { t } = useTranslation()
  const { recents } = useRecents()
  const recentTools = recents.map(getTool).filter(Boolean)

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12 [animation:var(--animate-fade-in)]">
      <section className="mb-10 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted">
          <ShieldCheck size={13} className="text-accent" /> {TOOLS.length}+ {t('app.toolCount')} · MIT
        </span>
        <h1 className="mx-auto mt-5 max-w-2xl bg-gradient-to-br from-fg to-muted bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
          {t('app.homeTitle')}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-muted">{t('app.homeDesc')}</p>

        <button
          onClick={openPalette}
          className="mx-auto mt-7 flex w-full max-w-md items-center justify-between gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted shadow-[var(--shadow-glow)] transition hover:border-accent cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Search size={16} /> {t('app.searchPlaceholder')}
          </span>
          <kbd className="rounded border border-border px-1.5 py-0.5 text-xs">⌘K</kbd>
        </button>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-muted">
          <Badge icon={<WifiOff size={13} />}>{t('app.badgeOffline')}</Badge>
          <Badge icon={<ShieldCheck size={13} />}>{t('app.badgePrivacy')}</Badge>
          <Badge icon={<Zap size={13} />}>{t('app.badgeFast')}</Badge>
        </div>
      </section>

      {recentTools.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-muted">
            <Clock size={14} /> {t('app.recents')}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentTools.map((tool) => tool && <ToolCard key={tool.id} id={tool.id} category={tool.category} />)}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-8">
        {CATEGORY_ORDER.map((cat) => {
          const Icon = CATEGORY_ICON[cat]
          return (
            <div key={cat}>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted">
                <Icon size={15} className="text-accent" /> {t(`app.categories.${cat}`)}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {TOOLS.filter((tool) => tool.category === cat).map((tool) => (
                  <ToolCard key={tool.id} id={tool.id} category={tool.category} />
                ))}
              </div>
            </div>
          )
        })}
      </section>

      <footer className="mt-12 flex items-center justify-center gap-2 border-t border-border pt-6 text-sm text-muted">
        <Star size={14} />
        <a href="https://github.com/batiinn/dev-toolbox" target="_blank" rel="noreferrer" className="hover:text-fg">
          {t('app.openSource')} — MIT
        </a>
      </footer>
    </div>
  )
}

function Badge({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5">
      {icon} {children}
    </span>
  )
}

function ToolCard({ id, category }: { id: string; category: string }) {
  const { t } = useTranslation()
  const Icon = CATEGORY_ICON[category as keyof typeof CATEGORY_ICON]
  return (
    <Link
      to={`/tool/${id}`}
      className="group flex gap-3 rounded-xl border border-border bg-surface p-4 transition hover:-translate-y-0.5 hover:border-accent hover:shadow-[var(--shadow-glow)]"
    >
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
        <Icon size={16} />
      </span>
      <span className="min-w-0">
        <span className="block font-medium text-fg group-hover:text-accent">{t(`tools.${id}.name`)}</span>
        <span className="mt-0.5 line-clamp-2 block text-sm text-muted">{t(`tools.${id}.desc`)}</span>
      </span>
    </Link>
  )
}
