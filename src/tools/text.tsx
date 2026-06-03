import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TwoPane, useTransform } from '../components/TransformTool'
import { Field, Row, Select, TextArea, Toggle } from '../components/ui'
import {
  convertCase,
  deasciify,
  diffLines,
  processLines,
  slugify,
  type CaseMode,
  type LineOptions,
} from '../lib/text'

const CASE_MODES: CaseMode[] = ['upper', 'lower', 'title', 'sentence', 'camel', 'snake', 'kebab', 'constant']

export function CaseTool() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<CaseMode>('title')
  const fn = useCallback((s: string) => convertCase(s, mode), [mode])
  const { output, error } = useTransform(input, fn)
  return (
    <TwoPane
      input={input}
      setInput={setInput}
      output={output}
      error={error}
      sample={'merhaba dünya, bu bir örnek METİN'}
      toolbar={
        <Field label={t('common.mode')}>
          <Select value={mode} onChange={(e) => setMode(e.target.value as CaseMode)}>
            {CASE_MODES.map((m) => (
              <option key={m} value={m}>
                {t(`case.${m}`)}
              </option>
            ))}
          </Select>
        </Field>
      }
    />
  )
}

const DEFAULT_LINES: LineOptions = { sort: 'asc', dedupe: true, trim: true, removeEmpty: true }

export function LinesTool() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [opts, setOpts] = useState<LineOptions>(DEFAULT_LINES)
  const fn = useCallback((s: string) => processLines(s, opts), [opts])
  const { output, error } = useTransform(input, fn)
  const set = <K extends keyof LineOptions>(k: K, v: LineOptions[K]) => setOpts((o) => ({ ...o, [k]: v }))
  return (
    <TwoPane
      input={input}
      setInput={setInput}
      output={output}
      error={error}
      sample={'çilek\nelma\narmut\nelma\n\nmuz'}
      toolbar={
        <>
          <Field label={t('lines.sort')}>
            <Select value={opts.sort} onChange={(e) => set('sort', e.target.value as LineOptions['sort'])}>
              <option value="none">{t('lines.sortNone')}</option>
              <option value="asc">A → Z</option>
              <option value="desc">Z → A</option>
            </Select>
          </Field>
          <Toggle label={t('lines.dedupe')} checked={opts.dedupe} onChange={(v) => set('dedupe', v)} />
          <Toggle label={t('lines.trim')} checked={opts.trim} onChange={(v) => set('trim', v)} />
          <Toggle label={t('lines.removeEmpty')} checked={opts.removeEmpty} onChange={(v) => set('removeEmpty', v)} />
        </>
      }
    />
  )
}

export function SlugifyTool() {
  const [input, setInput] = useState('')
  const { output, error } = useTransform(input, slugify)
  return (
    <TwoPane input={input} setInput={setInput} output={output} error={error} sample={'Çağrı Merkezi Çözümleri 2026'} />
  )
}

export function DeasciifyTool() {
  const [input, setInput] = useState('')
  const { output, error } = useTransform(input, deasciify)
  return (
    <TwoPane input={input} setInput={setInput} output={output} error={error} sample={'Şükrü çiğköfteyi İğneada\'da yedi.'} />
  )
}

export function DiffTool() {
  const { t } = useTranslation()
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const diff = useMemo(() => diffLines(a, b), [a, b])
  const stats = useMemo(() => {
    const add = diff.filter((d) => d.type === 'add').length
    const remove = diff.filter((d) => d.type === 'remove').length
    return { add, remove }
  }, [diff])
  return (
    <>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label={t('diff.original')}>
          <TextArea value={a} onChange={(e) => setA(e.target.value)} />
        </Field>
        <Field label={t('diff.changed')}>
          <TextArea value={b} onChange={(e) => setB(e.target.value)} />
        </Field>
      </div>
      {(a || b) && (
        <>
          <Row className="text-xs">
            <span className="text-success">+{stats.add} {t('diff.added')}</span>
            <span className="text-danger">-{stats.remove} {t('diff.removed')}</span>
          </Row>
          <div className="overflow-auto rounded-lg border border-border bg-surface font-mono text-sm">
            {diff.map((line, i) => (
              <div
                key={i}
                className={
                  line.type === 'add'
                    ? 'bg-success/15 text-success px-3 py-0.5'
                    : line.type === 'remove'
                      ? 'bg-danger/15 text-danger px-3 py-0.5'
                      : 'px-3 py-0.5 text-muted'
                }
              >
                <span className="select-none opacity-60 mr-2">
                  {line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ' '}
                </span>
                {line.text || ' '}
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}
