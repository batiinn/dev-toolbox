import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { marked } from 'marked'
import { Upload } from 'lucide-react'
import { TwoPane, useTransform } from '../components/TransformTool'
import { CopyButton, Field, Input, Output, Row, Select, TextArea, Toggle } from '../components/ui'
import { useToast } from '../components/Toast'
import { textStats } from '../lib/textstats'
import { curlToFetch } from '../lib/curl'
import { jsonEscape, jsonUnescape } from '../lib/jsonescape'
import { buildPalette } from '../lib/palette'
import {
  octalToPerms,
  permsToOctal,
  permsToSymbolic,
  type ChmodPerms,
  type Perm,
} from '../lib/chmod'
import { convertCssUnit, type CssUnit } from '../lib/cssunits'
import { HTTP_STATUS } from '../lib/httpStatus'

export function TextStatsTool() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const stats = useMemo(() => textStats(input), [input])
  const items: [string, string | number][] = [
    [t('stats.characters'), stats.characters],
    [t('stats.charactersNoSpaces'), stats.charactersNoSpaces],
    [t('stats.words'), stats.words],
    [t('stats.lines'), stats.lines],
    [t('stats.sentences'), stats.sentences],
    [t('stats.paragraphs'), stats.paragraphs],
    [t('stats.bytes'), stats.bytes],
    [t('stats.readingTime'), `${stats.readingTimeSec} sn`],
  ]
  return (
    <>
      <TextArea value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('common.inputPlaceholder')} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-border bg-surface px-3 py-3 text-center">
            <div className="text-2xl font-semibold tabular-nums text-fg">{value}</div>
            <div className="mt-0.5 text-xs text-muted">{label}</div>
          </div>
        ))}
      </div>
    </>
  )
}

const CURL_SAMPLE =
  "curl -X POST https://api.ornek.com/v1/users -H 'Content-Type: application/json' -H 'Authorization: Bearer TOKEN' -d '{\"ad\":\"Batın\"}'"

export function CurlTool() {
  const [input, setInput] = useState('')
  const { output, error } = useTransform(input, curlToFetch)
  return (
    <TwoPane
      input={input}
      setInput={setInput}
      output={output}
      error={error}
      sample={CURL_SAMPLE}
      placeholder="curl https://..."
    />
  )
}

export function JsonEscapeTool() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<'escape' | 'unescape'>('escape')
  const fn = useCallback((s: string) => (mode === 'escape' ? jsonEscape(s) : jsonUnescape(s)), [mode])
  const { output, error } = useTransform(input, fn)
  return (
    <TwoPane
      input={input}
      setInput={setInput}
      output={output}
      error={error}
      sample={'Satır1\n\t"alıntılı" metin\\ters bölü'}
      toolbar={
        <Field label={t('common.mode')}>
          <Select value={mode} onChange={(e) => setMode(e.target.value as 'escape' | 'unescape')}>
            <option value="escape">Escape</option>
            <option value="unescape">Unescape</option>
          </Select>
        </Field>
      }
    />
  )
}

export function MarkdownTool() {
  const { t } = useTranslation()
  const [input, setInput] = useState(
    '# Başlık\n\nBu bir **kalın** ve *italik* örnektir.\n\n- Madde 1\n- Madde 2\n\n```js\nconsole.log("merhaba")\n```\n\n> Alıntı satırı\n',
  )
  const html = useMemo(() => marked.parse(input, { async: false }) as string, [input])
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Field label={t('common.input')}>
        <TextArea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-80" />
      </Field>
      <Field label={t('markdown.preview')}>
        <div
          className="prose-toolbox min-h-80 overflow-auto rounded-lg border border-border bg-surface px-4 py-3 text-fg"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </Field>
    </div>
  )
}

export function ColorPaletteTool() {
  const { t } = useTranslation()
  const toast = useToast()
  const [hex, setHex] = useState('#6366F1')
  const result = useMemo(() => {
    try {
      return { p: buildPalette(hex), error: null }
    } catch (e) {
      return { p: null, error: e instanceof Error ? e.message : String(e) }
    }
  }, [hex])

  const Swatch = ({ color }: { color: string }) => (
    <button
      onClick={() => {
        navigator.clipboard.writeText(color)
        toast(t('common.copied'))
      }}
      className="group flex flex-col items-stretch overflow-hidden rounded-lg border border-border transition hover:scale-[1.03] cursor-pointer"
      title={color}
    >
      <span className="h-12" style={{ background: color }} />
      <span className="bg-surface px-1 py-1 text-center font-mono text-[11px] text-muted group-hover:text-fg">
        {color}
      </span>
    </button>
  )

  return (
    <>
      <Row>
        <input
          type="color"
          value={result.error ? '#000000' : hex}
          onChange={(e) => setHex(e.target.value)}
          className="h-12 w-16 cursor-pointer rounded-lg border border-border bg-transparent"
        />
        <Field label="HEX">
          <Input value={hex} onChange={(e) => setHex(e.target.value)} className="w-40" />
        </Field>
      </Row>
      {result.p && (
        <div className="flex flex-col gap-5">
          <Section title={t('palette.shades')}>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-9">
              {result.p.shades.map((c) => (
                <Swatch key={c} color={c} />
              ))}
            </div>
          </Section>
          <Section title={t('palette.harmony')}>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              <Swatch color={result.p.complementary} />
              {result.p.analogous.map((c) => (
                <Swatch key={`a${c}`} color={c} />
              ))}
              {result.p.triadic.map((c) => (
                <Swatch key={`t${c}`} color={c} />
              ))}
            </div>
          </Section>
        </div>
      )}
      <span className="text-xs text-muted">{t('palette.hint')}</span>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-muted">{title}</span>
      {children}
    </div>
  )
}

export function ImageBase64Tool() {
  const { t } = useTranslation()
  const [dataUrl, setDataUrl] = useState('')
  const [meta, setMeta] = useState<{ name: string; size: number; type: string } | null>(null)

  const onFile = (f: File | undefined) => {
    if (!f) return
    setMeta({ name: f.name, size: f.size, type: f.type })
    const reader = new FileReader()
    reader.onload = () => setDataUrl(String(reader.result))
    reader.readAsDataURL(f)
  }

  return (
    <>
      <Row className="justify-between">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm text-fg transition hover:bg-border">
          <Upload size={14} /> {t('image.choose')}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </label>
        {meta && (
          <span className="text-xs text-muted">
            {meta.name} · {(meta.size / 1024).toFixed(1)} KB
          </span>
        )}
      </Row>
      {dataUrl && (
        <>
          <div className="flex justify-center rounded-lg border border-border bg-surface p-4">
            <img src={dataUrl} alt={meta?.name} className="max-h-48 rounded" />
          </div>
          <Field label={t('image.dataUri')}>
            <Output value={dataUrl} />
          </Field>
          <Row className="justify-between">
            <CopyButton value={dataUrl} label={t('image.copyDataUri')} />
            <CopyButton value={`background-image: url('${dataUrl}');`} label={t('image.copyCss')} />
          </Row>
        </>
      )}
    </>
  )
}

const EMPTY: Perm = { r: false, w: false, x: false }

export function ChmodTool() {
  const { t } = useTranslation()
  const [perms, setPerms] = useState<ChmodPerms>({
    owner: { r: true, w: true, x: true },
    group: { r: true, w: false, x: true },
    other: { r: true, w: false, x: true },
  })
  const octal = permsToOctal(perms)
  const symbolic = permsToSymbolic(perms)

  const setBit = (who: keyof ChmodPerms, bit: keyof Perm, val: boolean) =>
    setPerms((p) => ({ ...p, [who]: { ...p[who], [bit]: val } }))

  const onOctal = (value: string) => {
    try {
      setPerms(octalToPerms(value))
    } catch {
      /* empty */
    }
  }

  const groups: [keyof ChmodPerms, string][] = [
    ['owner', t('chmod.owner')],
    ['group', t('chmod.group')],
    ['other', t('chmod.other')],
  ]
  const bits: [keyof Perm, string][] = [
    ['r', t('chmod.read')],
    ['w', t('chmod.write')],
    ['x', t('chmod.exec')],
  ]

  return (
    <>
      <Row>
        <Field label="Octal">
          <Input value={octal} onChange={(e) => onOctal(e.target.value)} className="w-28 text-center" />
        </Field>
        <Field label={t('chmod.symbolic')}>
          <Input value={symbolic} readOnly className="w-40 text-center" />
        </Field>
      </Row>
      <div className="grid gap-3 sm:grid-cols-3">
        {groups.map(([who, label]) => (
          <div key={who} className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-3">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">{label}</span>
            {bits.map(([bit, blabel]) => (
              <Toggle
                key={bit}
                label={blabel}
                checked={perms[who][bit]}
                onChange={(v) => setBit(who, bit, v)}
              />
            ))}
          </div>
        ))}
      </div>
      <Row className="justify-between">
        <code className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm">
          chmod {octal} dosya
        </code>
        <CopyButton value={`chmod ${octal}`} label={t('common.copy')} />
      </Row>
      <button
        onClick={() => setPerms({ owner: EMPTY, group: EMPTY, other: EMPTY })}
        className="self-start text-sm text-muted hover:text-fg cursor-pointer"
      >
        {t('common.clear')}
      </button>
    </>
  )
}

export function CssUnitTool() {
  const { t } = useTranslation()
  const [value, setValue] = useState('24')
  const [from, setFrom] = useState<CssUnit>('px')
  const [base, setBase] = useState('16')
  const result = useMemo(() => {
    const v = Number(value)
    const b = Number(base)
    if (!value.trim() || isNaN(v) || isNaN(b)) return null
    try {
      return convertCssUnit(v, from, b)
    } catch {
      return null
    }
  }, [value, from, base])

  return (
    <>
      <Row>
        <Field label={t('convert.value')}>
          <Input value={value} onChange={(e) => setValue(e.target.value)} className="w-28" />
        </Field>
        <Field label={t('common.mode')}>
          <Select value={from} onChange={(e) => setFrom(e.target.value as CssUnit)}>
            <option value="px">px</option>
            <option value="rem">rem</option>
            <option value="em">em</option>
          </Select>
        </Field>
        <Field label={t('cssunits.base')}>
          <Input value={base} onChange={(e) => setBase(e.target.value)} className="w-24" />
        </Field>
      </Row>
      {result && (
        <div className="grid gap-2 sm:grid-cols-3">
          {(['px', 'rem', 'em'] as const).map((u) => (
            <button
              key={u}
              onClick={() => navigator.clipboard.writeText(`${result[u]}${u}`)}
              className="rounded-xl border border-border bg-surface px-3 py-3 text-center transition hover:border-accent cursor-pointer"
            >
              <div className="text-xl font-semibold tabular-nums text-fg">
                {result[u]}
                <span className="text-sm text-muted">{u}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </>
  )
}

export function HttpStatusTool() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language.startsWith('tr') ? 'tr' : 'en'
  const [query, setQuery] = useState('')
  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return HTTP_STATUS
    return HTTP_STATUS.filter(
      (s) =>
        String(s.code).includes(q) ||
        s.name.tr.toLowerCase().includes(q) ||
        s.name.en.toLowerCase().includes(q),
    )
  }, [query])

  const color = (code: number) =>
    code < 200
      ? 'text-muted'
      : code < 300
        ? 'text-success'
        : code < 400
          ? 'text-accent'
          : 'text-danger'

  return (
    <>
      <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('http.search')} />
      <div className="flex flex-col gap-2">
        {list.map((s) => (
          <div key={s.code} className="flex gap-3 rounded-lg border border-border bg-surface px-4 py-2.5">
            <span className={`font-mono text-lg font-semibold ${color(s.code)}`}>{s.code}</span>
            <div className="min-w-0">
              <div className="font-medium text-fg">{s.name[lang]}</div>
              <div className="text-sm text-muted">{s.desc[lang]}</div>
            </div>
          </div>
        ))}
        {list.length === 0 && <span className="text-sm text-muted">{t('app.noResults')}</span>}
      </div>
    </>
  )
}
