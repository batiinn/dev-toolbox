import { describe, expect, it } from 'vitest'
import { textStats } from '../src/lib/textstats'
import { curlToFetch, parseCurl } from '../src/lib/curl'
import { jsonEscape, jsonUnescape } from '../src/lib/jsonescape'
import { buildPalette } from '../src/lib/palette'
import { nextCronRuns } from '../src/lib/cron'

describe('textStats', () => {
  it('counts words, lines and characters', () => {
    const s = textStats('Merhaba dünya\nikinci satır.')
    expect(s.words).toBe(4)
    expect(s.lines).toBe(2)
    expect(s.sentences).toBe(1)
  })
  it('counts emoji as a single character', () => {
    expect(textStats('🌍').characters).toBe(1)
  })
  it('reports empty for empty input', () => {
    const s = textStats('')
    expect(s.words).toBe(0)
    expect(s.paragraphs).toBe(0)
  })
})

describe('curl', () => {
  it('parses method, headers and body', () => {
    const p = parseCurl(
      "curl -X POST https://api.x.com/u -H 'Content-Type: application/json' -d '{\"a\":1}'",
    )
    expect(p.method).toBe('POST')
    expect(p.url).toBe('https://api.x.com/u')
    expect(p.headers['Content-Type']).toBe('application/json')
    expect(p.body).toBe('{"a":1}')
  })
  it('defaults to GET and emits fetch code', () => {
    const code = curlToFetch('curl https://api.x.com/ping')
    expect(code).toContain('"GET"')
    expect(code).toContain('fetch("https://api.x.com/ping"')
  })
  it('converts basic auth to a header', () => {
    expect(parseCurl('curl -u user:pass https://x.com').headers['Authorization']).toBe(
      `Basic ${btoa('user:pass')}`,
    )
  })
})

describe('jsonEscape', () => {
  it('round-trips quotes, newlines and backslashes', () => {
    const s = 'He said "hi"\n\tand\\done'
    expect(jsonUnescape(jsonEscape(s))).toBe(s)
  })
  it('escapes without surrounding quotes', () => {
    expect(jsonEscape('a"b')).toBe('a\\"b')
  })
})

describe('buildPalette', () => {
  it('returns 9 shades and harmony colors', () => {
    const p = buildPalette('#6366F1')
    expect(p.shades).toHaveLength(9)
    expect(p.shades.every((c) => /^#[0-9A-F]{6}$/.test(c))).toBe(true)
    expect(p.analogous).toHaveLength(2)
    expect(p.triadic).toHaveLength(2)
  })
})

describe('nextCronRuns', () => {
  it('computes deterministic next runs from a fixed date', () => {
    const from = new Date('2026-06-03T00:00:00Z')
    const runs = nextCronRuns('0 9 * * 1-5', 3, from)
    expect(runs).toHaveLength(3)
    expect(runs[0].getTime()).toBeGreaterThan(from.getTime())
  })
  it('throws on invalid expression', () => {
    expect(() => nextCronRuns('not a cron', 3)).toThrow()
  })
})
