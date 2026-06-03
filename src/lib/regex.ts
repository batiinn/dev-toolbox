export interface RegexMatch {
  index: number
  match: string
  groups: string[]
}

export interface RegexResult {
  matches: RegexMatch[]
  segments: { text: string; isMatch: boolean }[]
}

export function runRegex(pattern: string, flags: string, input: string): RegexResult {
  const userFlags = flags.replace(/g/g, '')
  const re = new RegExp(pattern, userFlags + 'g')
  const matches: RegexMatch[] = []
  const segments: { text: string; isMatch: boolean }[] = []
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(input)) !== null) {
    if (m.index > last) segments.push({ text: input.slice(last, m.index), isMatch: false })
    segments.push({ text: m[0], isMatch: true })
    matches.push({ index: m.index, match: m[0], groups: m.slice(1) })
    last = m.index + m[0].length
    if (m[0] === '') re.lastIndex++
  }
  if (last < input.length) segments.push({ text: input.slice(last), isMatch: false })
  return { matches, segments }
}
