import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import QRCode from 'qrcode'
import { Upload } from 'lucide-react'
import { Button, CopyButton, Field, Input, Output, Row, Select, TextArea, Toggle } from '../components/ui'
import {
  generatePassword,
  loremIpsum,
  uuidV4,
  uuidV7,
  type PasswordOptions,
} from '../lib/generators'
import { hashAll, hashAllBuffer, type HashAlgo } from '../lib/hash'

export function UuidTool() {
  const { t } = useTranslation()
  const [version, setVersion] = useState<'v4' | 'v7'>('v4')
  const [count, setCount] = useState(5)
  const [list, setList] = useState<string[]>([])
  const generate = () => {
    const gen = version === 'v4' ? uuidV4 : () => uuidV7()
    setList(Array.from({ length: Math.min(Math.max(count, 1), 100) }, gen))
  }
  useEffect(generate, []) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <Row>
        <Field label={t('common.version')}>
          <Select value={version} onChange={(e) => setVersion(e.target.value as 'v4' | 'v7')}>
            <option value="v4">UUID v4 (rastgele)</option>
            <option value="v7">UUID v7 (zaman sıralı)</option>
          </Select>
        </Field>
        <Field label={t('generate.count')}>
          <Input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-24"
          />
        </Field>
        <Button variant="primary" onClick={generate} className="self-end">
          {t('generate.generate')}
        </Button>
      </Row>
      <Output value={list.join('\n')} />
      <Row className="justify-end">
        <CopyButton value={list.join('\n')} label={t('common.copy')} />
      </Row>
    </>
  )
}

const DEFAULT_PW: PasswordOptions = {
  length: 20,
  lowercase: true,
  uppercase: true,
  numbers: true,
  symbols: true,
  avoidAmbiguous: false,
}

export function PasswordTool() {
  const { t } = useTranslation()
  const [opts, setOpts] = useState<PasswordOptions>(DEFAULT_PW)
  const [pw, setPw] = useState('')
  const [error, setError] = useState<string | null>(null)
  const set = <K extends keyof PasswordOptions>(k: K, v: PasswordOptions[K]) =>
    setOpts((o) => ({ ...o, [k]: v }))
  const generate = () => {
    try {
      setPw(generatePassword(opts))
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }
  useEffect(generate, [opts]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <Row className="rounded-lg border border-border bg-surface px-4 py-3 text-lg font-mono break-all min-h-12 items-center">
        {pw || '—'}
      </Row>
      <Row className="justify-between">
        <CopyButton value={pw} label={t('common.copy')} />
        <Button variant="primary" onClick={generate}>
          {t('generate.regenerate')}
        </Button>
      </Row>
      <Field label={`${t('generate.length')}: ${opts.length}`}>
        <input
          type="range"
          min={4}
          max={64}
          value={opts.length}
          onChange={(e) => set('length', Number(e.target.value))}
          className="accent-accent"
        />
      </Field>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Toggle label={t('generate.lowercase')} checked={opts.lowercase} onChange={(v) => set('lowercase', v)} />
        <Toggle label={t('generate.uppercase')} checked={opts.uppercase} onChange={(v) => set('uppercase', v)} />
        <Toggle label={t('generate.numbers')} checked={opts.numbers} onChange={(v) => set('numbers', v)} />
        <Toggle label={t('generate.symbols')} checked={opts.symbols} onChange={(v) => set('symbols', v)} />
        <Toggle label={t('generate.avoidAmbiguous')} checked={opts.avoidAmbiguous} onChange={(v) => set('avoidAmbiguous', v)} />
      </div>
      {error && <div className="text-sm text-danger">{error}</div>}
    </>
  )
}

export function HashTool() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [hashes, setHashes] = useState<Record<HashAlgo, string> | null>(null)
  const [file, setFile] = useState<{ name: string; size: number } | null>(null)
  useEffect(() => {
    if (!input) {
      if (!file) setHashes(null)
      return
    }
    setFile(null)
    let active = true
    hashAll(input).then((h) => active && setHashes(h))
    return () => {
      active = false
    }
  }, [input]) // eslint-disable-line react-hooks/exhaustive-deps

  const onFile = async (f: File | undefined) => {
    if (!f) return
    setInput('')
    setFile({ name: f.name, size: f.size })
    const buf = await f.arrayBuffer()
    setHashes(await hashAllBuffer(buf))
  }

  return (
    <>
      <TextArea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={t('common.inputPlaceholder')}
        className="min-h-24"
      />
      <Row className="justify-between">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm text-fg transition hover:bg-border">
          <Upload size={14} /> {t('hash.chooseFile')}
          <input type="file" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        </label>
        {file && (
          <span className="text-xs text-muted">
            {file.name} · {(file.size / 1024).toFixed(1)} KB
          </span>
        )}
      </Row>
      {hashes && (
        <div className="flex flex-col gap-3">
          {(Object.keys(hashes) as HashAlgo[]).map((algo) => (
            <div key={algo} className="flex flex-col gap-1">
              <Row className="justify-between">
                <span className="text-xs font-medium text-muted">{algo}</span>
                <CopyButton value={hashes[algo]} label={t('common.copy')} />
              </Row>
              <Output value={hashes[algo]} />
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export function LoremTool() {
  const { t } = useTranslation()
  const [count, setCount] = useState(3)
  const output = useMemo(() => loremIpsum(Math.min(Math.max(count, 1), 50)), [count])
  return (
    <>
      <Field label={t('generate.paragraphs')}>
        <Input
          type="number"
          min={1}
          max={50}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="w-24"
        />
      </Field>
      <Output value={output} mono={false} />
      <Row className="justify-end">
        <CopyButton value={output} label={t('common.copy')} />
      </Row>
    </>
  )
}

export function QrTool() {
  const { t } = useTranslation()
  const [input, setInput] = useState('https://github.com')
  const [dataUrl, setDataUrl] = useState('')
  useEffect(() => {
    if (!input) {
      setDataUrl('')
      return
    }
    QRCode.toDataURL(input, { width: 320, margin: 2 })
      .then(setDataUrl)
      .catch(() => setDataUrl(''))
  }, [input])
  return (
    <>
      <TextArea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="https://..."
        className="min-h-20"
      />
      {dataUrl && (
        <div className="flex flex-col items-center gap-3">
          <img src={dataUrl} alt="QR" className="rounded-lg bg-white p-3" width={256} height={256} />
          <a href={dataUrl} download="qr.png">
            <Button variant="primary">{t('generate.downloadPng')}</Button>
          </a>
        </div>
      )}
    </>
  )
}
