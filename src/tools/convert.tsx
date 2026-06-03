import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TwoPane, useTransform } from '../components/TransformTool'
import { Button, CopyButton, ErrorNote, Field, Input, Row, Select } from '../components/ui'
import {
  convertBase,
  dateToTimestamp,
  hexToRgb,
  jsonToCsv,
  jsonToYaml,
  rgbToHex,
  rgbToHsl,
  timestampToDate,
  yamlToJson,
} from '../lib/converters'

const JSON_SAMPLE = '[\n  { "ad": "Ali", "yas": 30, "sehir": "İstanbul" },\n  { "ad": "Ayşe", "yas": 25, "sehir": "İzmir" }\n]'

export function JsonYamlTool() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [dir, setDir] = useState<'j2y' | 'y2j'>('j2y')
  const fn = useCallback((s: string) => (dir === 'j2y' ? jsonToYaml(s) : yamlToJson(s)), [dir])
  const { output, error } = useTransform(input, fn)
  return (
    <TwoPane
      input={input}
      setInput={setInput}
      output={output}
      error={error}
      sample={JSON_SAMPLE}
      toolbar={
        <Field label={t('common.direction')}>
          <Select value={dir} onChange={(e) => setDir(e.target.value as 'j2y' | 'y2j')}>
            <option value="j2y">JSON → YAML</option>
            <option value="y2j">YAML → JSON</option>
          </Select>
        </Field>
      }
    />
  )
}

export function JsonCsvTool() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [delim, setDelim] = useState(',')
  const fn = useCallback((s: string) => jsonToCsv(s, delim), [delim])
  const { output, error } = useTransform(input, fn)
  return (
    <TwoPane
      input={input}
      setInput={setInput}
      output={output}
      error={error}
      sample={JSON_SAMPLE}
      toolbar={
        <Field label={t('convert.delimiter')}>
          <Select value={delim} onChange={(e) => setDelim(e.target.value)}>
            <option value=",">{t('convert.comma')} (,)</option>
            <option value=";">{t('convert.semicolon')} (;)</option>
            <option value={'\t'}>{t('convert.tab')} (TSV)</option>
          </Select>
        </Field>
      }
    />
  )
}

export function TimestampTool() {
  const { t } = useTranslation()
  const [ts, setTs] = useState('')
  const [date, setDate] = useState('')
  const tsResult = useMemo(() => {
    if (!ts.trim()) return null
    try {
      return { info: timestampToDate(Number(ts)), error: null }
    } catch (e) {
      return { info: null, error: e instanceof Error ? e.message : String(e) }
    }
  }, [ts])
  const dateResult = useMemo(() => {
    if (!date.trim()) return null
    try {
      return { ts: dateToTimestamp(date), error: null }
    } catch (e) {
      return { ts: null, error: e instanceof Error ? e.message : String(e) }
    }
  }, [date])
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="flex flex-col gap-3">
        <Field label={t('convert.unixTimestamp')} hint={t('convert.tsHint')}>
          <Input value={ts} onChange={(e) => setTs(e.target.value)} placeholder="1700000000" />
        </Field>
        <Button variant="ghost" onClick={() => setTs(String(Math.floor(Date.now() / 1000)))}>
          {t('convert.now')}
        </Button>
        {tsResult?.error && <ErrorNote>{tsResult.error}</ErrorNote>}
        {tsResult?.info && (
          <div className="flex flex-col gap-2 text-sm">
            <KV label="ISO 8601" value={tsResult.info.iso} />
            <KV label="UTC" value={tsResult.info.utc} />
            <KV label={t('convert.local')} value={tsResult.info.local} />
            <KV label={t('convert.relative')} value={tsResult.info.relative} />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <Field label={t('convert.dateString')} hint="2026-06-03T12:00:00">
          <Input value={date} onChange={(e) => setDate(e.target.value)} placeholder="2026-06-03" />
        </Field>
        {dateResult?.error && <ErrorNote>{dateResult.error}</ErrorNote>}
        {dateResult?.ts && (
          <div className="flex flex-col gap-2 text-sm">
            <KV label={t('convert.seconds')} value={String(dateResult.ts.seconds)} />
            <KV label={t('convert.millis')} value={String(dateResult.ts.millis)} />
          </div>
        )}
      </div>
    </div>
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

export function BaseTool() {
  const { t } = useTranslation()
  const [value, setValue] = useState('255')
  const [from, setFrom] = useState(10)
  const result = useMemo(() => {
    if (!value.trim()) return null
    try {
      return { r: convertBase(value, from), error: null }
    } catch (e) {
      return { r: null, error: e instanceof Error ? e.message : String(e) }
    }
  }, [value, from])
  return (
    <>
      <Row>
        <Field label={t('convert.value')}>
          <Input value={value} onChange={(e) => setValue(e.target.value)} className="w-48" />
        </Field>
        <Field label={t('convert.fromBase')}>
          <Select value={from} onChange={(e) => setFrom(Number(e.target.value))}>
            <option value={2}>2 (binary)</option>
            <option value={8}>8 (octal)</option>
            <option value={10}>10 (decimal)</option>
            <option value={16}>16 (hex)</option>
          </Select>
        </Field>
      </Row>
      {result?.error && <ErrorNote>{result.error}</ErrorNote>}
      {result?.r && (
        <div className="flex flex-col gap-2 text-sm">
          <KV label="Binary (2)" value={result.r.binary} />
          <KV label="Octal (8)" value={result.r.octal} />
          <KV label="Decimal (10)" value={result.r.decimal} />
          <KV label="Hex (16)" value={result.r.hex} />
        </div>
      )}
    </>
  )
}

export function ColorTool() {
  const { t } = useTranslation()
  const [hex, setHex] = useState('#6366F1')
  const result = useMemo(() => {
    try {
      const rgb = hexToRgb(hex)
      const hsl = rgbToHsl(rgb)
      return {
        rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
        hex: rgbToHex(rgb),
        css: rgbToHex(rgb),
        error: null,
      }
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) }
    }
  }, [hex])
  return (
    <>
      <Row>
        <input
          type="color"
          value={result.error ? '#000000' : result.css}
          onChange={(e) => setHex(e.target.value)}
          className="h-12 w-16 cursor-pointer rounded-lg border border-border bg-transparent"
        />
        <Field label="HEX">
          <Input value={hex} onChange={(e) => setHex(e.target.value)} className="w-40" />
        </Field>
      </Row>
      {result.error ? (
        <ErrorNote>{result.error}</ErrorNote>
      ) : (
        <div className="flex flex-col gap-2 text-sm">
          <KVCopy label="HEX" value={result.hex!} />
          <KVCopy label="RGB" value={result.rgb!} />
          <KVCopy label="HSL" value={result.hsl!} />
        </div>
      )}
      <span className="text-xs text-muted">{t('color.hint')}</span>
    </>
  )
}

function KVCopy({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3 py-2">
      <span className="text-xs text-muted">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-mono text-fg">{value}</span>
        <CopyButton value={value} label="" />
      </div>
    </div>
  )
}
