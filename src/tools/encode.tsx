import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TwoPane, useTransform } from '../components/TransformTool'
import { CopyButton, Field, Output, Row, Select, TextArea } from '../components/ui'
import {
  base64Decode,
  base64Encode,
  htmlDecode,
  htmlEncode,
  urlDecode,
  urlEncode,
} from '../lib/encoding'
import { decodeJwt } from '../lib/jwt'

type Mode = 'encode' | 'decode'

function ModeSelect({ value, onChange }: { value: Mode; onChange: (m: Mode) => void }) {
  const { t } = useTranslation()
  return (
    <Field label={t('common.mode')}>
      <Select value={value} onChange={(e) => onChange(e.target.value as Mode)}>
        <option value="encode">{t('common.encode')}</option>
        <option value="decode">{t('common.decode')}</option>
      </Select>
    </Field>
  )
}

function makeEncodeTool(enc: (s: string) => string, dec: (s: string) => string, sample: string) {
  return function Tool() {
    const [input, setInput] = useState('')
    const [mode, setMode] = useState<Mode>('encode')
    const fn = useCallback((s: string) => (mode === 'encode' ? enc(s) : dec(s)), [mode])
    const { output, error } = useTransform(input, fn)
    return (
      <TwoPane
        input={input}
        setInput={setInput}
        output={output}
        error={error}
        sample={sample}
        toolbar={<ModeSelect value={mode} onChange={setMode} />}
      />
    )
  }
}

export const Base64Tool = makeEncodeTool(base64Encode, base64Decode, 'Merhaba Dünya! 🌍')
export const UrlTool = makeEncodeTool(urlEncode, urlDecode, 'https://ornek.com/ara?q=çağrı merkezi&p=1')
export const HtmlTool = makeEncodeTool(
  htmlEncode,
  htmlDecode,
  '<div class="box">5 < 10 & "alıntı"</div>',
)

const JWT_SAMPLE =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkJhdMSxbiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxOTAwMDAwMDAwfQ.4Q8zEXAMPLEsignatureXXXXXXXXXXXXXXXXXXXXXXX'

export function JwtTool() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  let decoded = null
  let error: string | null = null
  if (input.trim()) {
    try {
      decoded = decodeJwt(input)
    } catch (e) {
      error = e instanceof Error ? e.message : String(e)
    }
  }
  return (
    <>
      <TextArea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="eyJ..."
        className="min-h-24"
      />
      <Row>
        <button
          className="text-sm text-accent hover:underline cursor-pointer"
          onClick={() => setInput(JWT_SAMPLE)}
        >
          {t('common.loadSample')}
        </button>
      </Row>
      {error && (
        <div className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </div>
      )}
      {decoded && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Row className="justify-between">
              <span className="text-xs font-medium text-muted">HEADER</span>
              <CopyButton value={JSON.stringify(decoded.header, null, 2)} label={t('common.copy')} />
            </Row>
            <Output value={JSON.stringify(decoded.header, null, 2)} />
          </div>
          <div className="flex flex-col gap-2">
            <Row className="justify-between">
              <span className="text-xs font-medium text-muted">PAYLOAD</span>
              <CopyButton value={JSON.stringify(decoded.payload, null, 2)} label={t('common.copy')} />
            </Row>
            <Output value={JSON.stringify(decoded.payload, null, 2)} />
          </div>
          {decoded.notes.length > 0 && (
            <ul className="md:col-span-2 flex flex-col gap-1 rounded-lg border border-border bg-surface px-4 py-3 text-sm text-muted">
              {decoded.notes.map((n, i) => (
                <li key={i}>• {n}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  )
}
