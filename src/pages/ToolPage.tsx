import { Suspense, useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ToolShell } from '../components/ToolShell'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { getTool } from '../tools/registry'
import { useRecents } from '../hooks/useRecents'

function ToolFallback() {
  return (
    <div className="flex flex-col gap-3">
      <div className="h-32 animate-pulse rounded-lg bg-surface-2" />
      <div className="h-8 w-40 animate-pulse rounded-lg bg-surface-2" />
    </div>
  )
}

function LoadError() {
  const { t } = useTranslation()
  return (
    <div className="rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
      {t('app.loadError')}
    </div>
  )
}

export function ToolPage() {
  const { id } = useParams<{ id: string }>()
  const { push } = useRecents()
  const tool = id ? getTool(id) : undefined

  useEffect(() => {
    if (tool) push(tool.id)
  }, [tool, push])

  if (!tool) return <Navigate to="/" replace />
  const Component = tool.component
  return (
    <ToolShell id={tool.id}>
      <ErrorBoundary key={tool.id} fallback={<LoadError />}>
        <Suspense fallback={<ToolFallback />}>
          <Component />
        </Suspense>
      </ErrorBoundary>
    </ToolShell>
  )
}
