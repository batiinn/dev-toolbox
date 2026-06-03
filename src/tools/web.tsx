import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ErrorNote, Field, Input, Row, TextArea } from '../components/ui'
import { runRegex } from '../lib/regex'
import { explainCron, nextCronRuns } from '../lib/cron'
import { parseUrl } from '../lib/url'

export function RegexTool() {
  const { t } = useTranslation()
  const [pattern, setPattern] = useState('\\b\\w+@\\w+\\.\\w+\\b')
  const [flags, setFlags] = useState('gi')
  const [input, setInput] = useState('İletişim: info@ornek.com, satis@firma.com.tr')
  const result = useMemo(() => {
    if (!pattern) return null
    try {
      return { r: runRegex(pattern, flags, input), error: null }
    } catch (e) {
      return { r: null, error: e instanceof Error ? e.message : String(e) }
    }
  }, [pattern, flags, input])
  return (
    <>
      <Row className="items-end">
        <Field label={t('regex.pattern')}>
          <Input value={pattern} onChange={(e) => setPattern(e.target.value)} className="w-80 max-w-full" />
        </Field>
        <Field label={t('regex.flags')}>
          <Input value={flags} onChange={(e) => setFlags(e.target.value)} className="w-24" placeholder="gim" />
        </Field>
      </Row>
      <Field label={t('regex.testString')}>
        <TextArea value={input} onChange={(e) => setInput(e.target.value)} />
      </Field>
      {result?.error && <ErrorNote>{result.error}</ErrorNote>}
      {result?.r && (
        <>
          <div className="rounded-lg border border-border bg-surface px-3 py-2 text-sm whitespace-pre-wrap break-words leading-relaxed">
            {result.r.segments.map((seg, i) =>
              seg.isMatch ? (
                <mark key={i} className="rounded bg-accent/30 text-fg px-0.5">
                  {seg.text}
                </mark>
              ) : (
                <span key={i}>{seg.text}</span>
              ),
            )}
          </div>
          <p className="text-sm text-muted">
            {result.r.matches.length} {t('regex.matchCount')}
          </p>
          {result.r.matches.length > 0 && (
            <div className="flex flex-col gap-1 text-sm font-mono">
              {result.r.matches.map((m, i) => (
                <div key={i} className="rounded border border-border bg-surface px-3 py-1.5">
                  <span className="text-muted">#{i + 1}</span> {m.match}
                  {m.groups.length > 0 && (
                    <span className="text-muted"> — [{m.groups.join(', ')}]</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </>
  )
}

const CRON_EXAMPLES = ['*/5 * * * *', '0 9 * * 1-5', '0 0 1 * *', '30 23 * * 0']

export function CronTool() {
  const { t, i18n } = useTranslation()
  const [expr, setExpr] = useState('0 9 * * 1-5')
  const result = useMemo(() => {
    if (!expr.trim()) return null
    try {
      const text = explainCron(expr, i18n.language.startsWith('tr') ? 'tr' : 'en')
      let runs: string[] = []
      try {
        runs = nextCronRuns(expr, 5).map((d) => d.toLocaleString())
      } catch {
        /* empty */
      }
      return { text, runs, error: null }
    } catch (e) {
      return { text: null, runs: [], error: e instanceof Error ? e.message : String(e) }
    }
  }, [expr, i18n.language])
  return (
    <>
      <Field label={t('cron.expression')} hint="dakika saat gün ay haftanın-günü">
        <Input value={expr} onChange={(e) => setExpr(e.target.value)} className="font-mono" />
      </Field>
      <Row>
        {CRON_EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => setExpr(ex)}
            className="rounded border border-border bg-surface px-2 py-1 font-mono text-xs text-muted hover:text-fg hover:border-accent transition cursor-pointer"
          >
            {ex}
          </button>
        ))}
      </Row>
      {result?.error && <ErrorNote>{result.error}</ErrorNote>}
      {result?.text && (
        <div className="rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-fg">
          {result.text}
        </div>
      )}
      {result?.runs && result.runs.length > 0 && (
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">
            {t('cron.nextRuns')}
          </span>
          {result.runs.map((r, i) => (
            <div key={i} className="rounded-lg border border-border bg-surface px-3 py-1.5 font-mono text-sm text-fg">
              <span className="mr-2 text-muted">#{i + 1}</span>
              {r}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export function UrlParseTool() {
  const { t } = useTranslation()
  const [input, setInput] = useState('https://kullanici:gizli@ornek.com:8080/yol/sayfa?ad=batın&sayi=42#bolum')
  const result = useMemo(() => {
    if (!input.trim()) return null
    try {
      return { p: parseUrl(input), error: null }
    } catch (e) {
      return { p: null, error: e instanceof Error ? e.message : String(e) }
    }
  }, [input])
  return (
    <>
      <Field label="URL">
        <Input value={input} onChange={(e) => setInput(e.target.value)} className="font-mono" />
      </Field>
      {result?.error && <ErrorNote>{result.error}</ErrorNote>}
      {result?.p && (
        <div className="flex flex-col gap-2 text-sm">
          <KV label={t('url.protocol')} value={result.p.protocol} />
          <KV label={t('url.hostname')} value={result.p.hostname} />
          <KV label={t('url.port')} value={result.p.port || '—'} />
          <KV label={t('url.path')} value={result.p.pathname} />
          <KV label={t('url.hash')} value={result.p.hash || '—'} />
          {result.p.params.length > 0 && (
            <div className="mt-2 flex flex-col gap-1">
              <span className="text-xs font-medium text-muted">{t('url.params')}</span>
              {result.p.params.map((p, i) => (
                <KV key={i} label={p.key} value={p.value} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3 py-2">
      <span className="text-xs text-muted">{label}</span>
      <span className="font-mono text-fg break-all text-right">{value}</span>
    </div>
  )
}
