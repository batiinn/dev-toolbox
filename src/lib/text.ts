export type CaseMode =
  | 'upper'
  | 'lower'
  | 'title'
  | 'sentence'
  | 'camel'
  | 'snake'
  | 'kebab'
  | 'constant'

export function convertCase(input: string, mode: CaseMode): string {
  const words = input
    .replace(/([a-zçğıöşü])([A-ZÇĞİÖŞÜ])/g, '$1 $2')
    .split(/[\s_\-.]+/)
    .filter(Boolean)
  switch (mode) {
    case 'upper':
      return input.toLocaleUpperCase('tr-TR')
    case 'lower':
      return input.toLocaleLowerCase('tr-TR')
    case 'title':
      return input.replace(/\S+/g, (w) =>
        w.charAt(0).toLocaleUpperCase('tr-TR') + w.slice(1).toLocaleLowerCase('tr-TR'),
      )
    case 'sentence': {
      const lower = input.toLocaleLowerCase('tr-TR')
      return lower.replace(/(^\s*\p{L})|([.!?]\s+\p{L})/gu, (m) => m.toLocaleUpperCase('tr-TR'))
    }
    case 'camel':
      return words
        .map((w, i) =>
          i === 0
            ? w.toLocaleLowerCase('tr-TR')
            : w.charAt(0).toLocaleUpperCase('tr-TR') + w.slice(1).toLocaleLowerCase('tr-TR'),
        )
        .join('')
    case 'snake':
      return words.map((w) => w.toLocaleLowerCase('tr-TR')).join('_')
    case 'kebab':
      return words.map((w) => w.toLocaleLowerCase('tr-TR')).join('-')
    case 'constant':
      return words.map((w) => w.toLocaleUpperCase('tr-TR')).join('_')
  }
}

export interface LineOptions {
  sort: 'none' | 'asc' | 'desc'
  dedupe: boolean
  trim: boolean
  removeEmpty: boolean
}

export function processLines(input: string, opts: LineOptions): string {
  let lines = input.split('\n')
  if (opts.trim) lines = lines.map((l) => l.trim())
  if (opts.removeEmpty) lines = lines.filter((l) => l.length > 0)
  if (opts.dedupe) lines = [...new Set(lines)]
  if (opts.sort !== 'none') {
    lines.sort((a, b) => a.localeCompare(b, 'tr'))
    if (opts.sort === 'desc') lines.reverse()
  }
  return lines.join('\n')
}

const TR_MAP: Record<string, string> = {
  ç: 'c',
  Ç: 'C',
  ğ: 'g',
  Ğ: 'G',
  ı: 'i',
  İ: 'I',
  ö: 'o',
  Ö: 'O',
  ş: 's',
  Ş: 'S',
  ü: 'u',
  Ü: 'U',
}

export function deasciify(input: string): string {
  return input.replace(/[çÇğĞıİöÖşŞüÜ]/g, (c) => TR_MAP[c] ?? c)
}

export function slugify(input: string): string {
  return deasciify(input)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export interface DiffLine {
  type: 'same' | 'add' | 'remove'
  text: string
}

export function diffLines(a: string, b: string): DiffLine[] {
  const left = a.split('\n')
  const right = b.split('\n')
  const n = left.length
  const m = right.length
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = left[i] === right[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1])
    }
  }
  const out: DiffLine[] = []
  let i = 0
  let j = 0
  while (i < n && j < m) {
    if (left[i] === right[j]) {
      out.push({ type: 'same', text: left[i] })
      i++
      j++
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      out.push({ type: 'remove', text: left[i] })
      i++
    } else {
      out.push({ type: 'add', text: right[j] })
      j++
    }
  }
  while (i < n) out.push({ type: 'remove', text: left[i++] })
  while (j < m) out.push({ type: 'add', text: right[j++] })
  return out
}
