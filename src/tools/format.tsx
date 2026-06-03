import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TwoPane, useTransform } from '../components/TransformTool'
import { Field, Select } from '../components/ui'
import { formatJson, formatSql, formatXml, minifyJson } from '../lib/format'

const JSON_SAMPLE = '{"ad":"Batın","roller":["admin","dev"],"aktif":true,"adres":{"sehir":"İstanbul"}}'
const SQL_SAMPLE = 'select id, name, email from users where active = 1 and created_at > now() order by name asc limit 10;'
const XML_SAMPLE = '<rss version="2.0"><channel><title>Başlık</title><item><title>Haber</title></item></channel></rss>'

export function JsonFormatTool() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<'beautify' | 'minify'>('beautify')
  const [indent, setIndent] = useState(2)
  const fn = useCallback(
    (s: string) => (mode === 'minify' ? minifyJson(s) : formatJson(s, indent === 0 ? '\t' : indent)),
    [mode, indent],
  )
  const { output, error } = useTransform(input, fn)
  return (
    <TwoPane
      input={input}
      setInput={setInput}
      output={output}
      error={error}
      sample={JSON_SAMPLE}
      toolbar={
        <>
          <Field label={t('common.mode')}>
            <Select value={mode} onChange={(e) => setMode(e.target.value as 'beautify' | 'minify')}>
              <option value="beautify">{t('format.beautify')}</option>
              <option value="minify">{t('format.minify')}</option>
            </Select>
          </Field>
          {mode === 'beautify' && (
            <Field label={t('format.indent')}>
              <Select value={indent} onChange={(e) => setIndent(Number(e.target.value))}>
                <option value={2}>2</option>
                <option value={4}>4</option>
                <option value={0}>Tab</option>
              </Select>
            </Field>
          )}
        </>
      }
    />
  )
}

export function SqlFormatTool() {
  const [input, setInput] = useState('')
  const { output, error } = useTransform(input, formatSql)
  return <TwoPane input={input} setInput={setInput} output={output} error={error} sample={SQL_SAMPLE} />
}

export function XmlFormatTool() {
  const [input, setInput] = useState('')
  const fn = useCallback((s: string) => formatXml(s), [])
  const { output, error } = useTransform(input, fn)
  return <TwoPane input={input} setInput={setInput} output={output} error={error} sample={XML_SAMPLE} />
}
