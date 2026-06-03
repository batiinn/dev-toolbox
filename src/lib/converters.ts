import yaml from 'js-yaml'

export function jsonToYaml(json: string): string {
  const obj = JSON.parse(json)
  return yaml.dump(obj, { indent: 2, lineWidth: -1 })
}

export function yamlToJson(text: string): string {
  const obj = yaml.load(text)
  return JSON.stringify(obj, null, 2)
}

function csvCell(value: unknown): string {
  if (value === null || value === undefined) return ''
  const s = typeof value === 'object' ? JSON.stringify(value) : String(value)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export function jsonToCsv(json: string, delimiter = ','): string {
  const data = JSON.parse(json)
  if (!Array.isArray(data)) throw new Error('CSV için girdi bir nesne dizisi (array) olmalı.')
  if (data.length === 0) return ''
  const headers = Array.from(
    data.reduce<Set<string>>((set, row) => {
      if (row && typeof row === 'object') Object.keys(row).forEach((k) => set.add(k))
      return set
    }, new Set()),
  )
  const lines = [headers.map(csvCell).join(delimiter)]
  for (const row of data) {
    lines.push(headers.map((h) => csvCell((row as Record<string, unknown>)?.[h])).join(delimiter))
  }
  return lines.join('\n')
}

export interface TimestampInfo {
  iso: string
  utc: string
  local: string
  relative: string
}

export function timestampToDate(input: number, now = Date.now()): TimestampInfo {
  const ms = input > 1e12 ? input : input * 1000
  const d = new Date(ms)
  if (isNaN(d.getTime())) throw new Error('Geçersiz zaman damgası.')
  const diff = ms - now
  const abs = Math.abs(diff)
  const units: [number, string][] = [
    [86400000, 'gün'],
    [3600000, 'saat'],
    [60000, 'dakika'],
    [1000, 'saniye'],
  ]
  let relative = 'şimdi'
  for (const [unit, label] of units) {
    if (abs >= unit) {
      const n = Math.round(abs / unit)
      relative = diff < 0 ? `${n} ${label} önce` : `${n} ${label} sonra`
      break
    }
  }
  return {
    iso: d.toISOString(),
    utc: d.toUTCString(),
    local: d.toLocaleString(),
    relative,
  }
}

export function dateToTimestamp(dateStr: string): { seconds: number; millis: number } {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) throw new Error('Geçersiz tarih.')
  return { seconds: Math.floor(d.getTime() / 1000), millis: d.getTime() }
}

export interface BaseResult {
  binary: string
  octal: string
  decimal: string
  hex: string
}

export function convertBase(value: string, fromBase: number): BaseResult {
  const cleaned = value.trim().replace(/^0[xXbBoO]/, '')
  const n = parseInt(cleaned, fromBase)
  if (isNaN(n)) throw new Error(`"${value}" değeri ${fromBase} tabanında geçerli bir sayı değil.`)
  return {
    binary: n.toString(2),
    octal: n.toString(8),
    decimal: n.toString(10),
    hex: n.toString(16).toUpperCase(),
  }
}

export interface RgbColor {
  r: number
  g: number
  b: number
}

export function hexToRgb(hex: string): RgbColor {
  const m = hex.trim().replace('#', '')
  const full = m.length === 3 ? m.split('').map((c) => c + c).join('') : m
  if (!/^[0-9a-fA-F]{6}$/.test(full)) throw new Error('Geçersiz HEX renk kodu.')
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  }
}

export function rgbToHex({ r, g, b }: RgbColor): string {
  const h = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0')
  return `#${h(r)}${h(g)}${h(b)}`.toUpperCase()
}

export function rgbToHsl({ r, g, b }: RgbColor): { h: number; s: number; l: number } {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  let h = 0
  let s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0)
        break
      case gn:
        h = (bn - rn) / d + 2
        break
      default:
        h = (rn - gn) / d + 4
    }
    h /= 6
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}
