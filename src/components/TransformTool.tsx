import { useMemo, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, CopyButton, ErrorNote, Output, Row, TextArea } from './ui'

export function useTransform(input: string, fn: (s: string) => string): {
  output: string
  error: string | null
} {
  return useMemo(() => {
    if (!input.trim()) return { output: '', error: null }
    try {
      return { output: fn(input), error: null }
    } catch (e) {
      return { output: '', error: e instanceof Error ? e.message : String(e) }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, fn])
}

interface TwoPaneProps {
  input: string
  setInput: (v: string) => void
  output: string
  error: string | null
  toolbar?: ReactNode
  sample?: string
  outputNode?: ReactNode
  placeholder?: string
}

export function TwoPane({
  input,
  setInput,
  output,
  error,
  toolbar,
  sample,
  outputNode,
  placeholder,
}: TwoPaneProps) {
  const { t } = useTranslation()
  return (
    <>
      <TextArea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder ?? t('common.inputPlaceholder')}
      />
      <Row className="justify-between">
        <Row>{toolbar}</Row>
        <Row>
          {sample !== undefined && (
            <Button variant="ghost" onClick={() => setInput(sample)}>
              {t('common.loadSample')}
            </Button>
          )}
          <Button variant="ghost" onClick={() => setInput('')} disabled={!input}>
            {t('common.clear')}
          </Button>
        </Row>
      </Row>
      {error ? <ErrorNote>{error}</ErrorNote> : outputNode ?? <Output value={output} />}
      {!error && !outputNode && <Row className="justify-end"><CopyButton value={output} label={t('common.copy')} /></Row>}
    </>
  )
}

export function useInput(initial = '') {
  return useState(initial)
}
