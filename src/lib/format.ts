import { format as sqlFormat } from 'sql-formatter'

export function formatJson(input: string, indent: number | string = 2): string {
  const obj = JSON.parse(input)
  return JSON.stringify(obj, null, indent)
}

export function minifyJson(input: string): string {
  return JSON.stringify(JSON.parse(input))
}

export function formatSql(input: string): string {
  return sqlFormat(input, { language: 'sql', keywordCase: 'upper' })
}

export function formatXml(input: string, indentSize = 2): string {
  const pad = ' '.repeat(indentSize)
  const xml = input.replace(/>\s*</g, '>\n<').trim()
  let depth = 0
  const lines: string[] = []
  for (const raw of xml.split('\n')) {
    const line = raw.trim()
    if (!line) continue
    const isClosing = /^<\//.test(line)
    const isOpening = /^<[A-Za-z][\w:-]*(\s[^>]*)?>$/.test(line)
    if (isClosing) depth = Math.max(0, depth - 1)
    lines.push(pad.repeat(depth) + line)
    if (isOpening) depth++
  }
  return lines.join('\n')
}
