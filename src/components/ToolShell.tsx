import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

export function ToolShell({ id, children }: { id: string; children: ReactNode }) {
  const { t } = useTranslation()
  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-fg">{t(`tools.${id}.name`)}</h1>
        <p className="mt-1 text-sm text-muted">{t(`tools.${id}.desc`)}</p>
      </header>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  )
}
