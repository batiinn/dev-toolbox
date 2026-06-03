import { describe, expect, it } from 'vitest'
import { generatePassword, uuidV4, uuidV7 } from '../src/lib/generators'
import { hashText } from '../src/lib/hash'
import { formatJson, minifyJson } from '../src/lib/format'
import { runRegex } from '../src/lib/regex'
import { explainCron } from '../src/lib/cron'
import { parseUrl } from '../src/lib/url'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

describe('uuid', () => {
  it('v4 matches the format with version nibble 4', () => {
    const id = uuidV4()
    expect(id).toMatch(UUID_RE)
    expect(id[14]).toBe('4')
  })
  it('v7 has version nibble 7 and embeds the timestamp', () => {
    const id = uuidV7(0x017f00000000)
    expect(id).toMatch(UUID_RE)
    expect(id[14]).toBe('7')
    expect(id.startsWith('017f0000')).toBe(true)
  })
})

describe('generatePassword', () => {
  it('respects requested length', () => {
    expect(generatePassword({ length: 24, lowercase: true, uppercase: true, numbers: true, symbols: false, avoidAmbiguous: false })).toHaveLength(24)
  })
  it('only uses numbers when restricted', () => {
    const pw = generatePassword({ length: 50, lowercase: false, uppercase: false, numbers: true, symbols: false, avoidAmbiguous: false })
    expect(pw).toMatch(/^[0-9]+$/)
  })
  it('throws with no character set', () => {
    expect(() => generatePassword({ length: 8, lowercase: false, uppercase: false, numbers: false, symbols: false, avoidAmbiguous: false })).toThrow()
  })
})

describe('hashText', () => {
  it('computes known digests for "abc"', async () => {
    expect(await hashText('abc', 'MD5')).toBe('900150983cd24fb0d6963f7d28e17f72')
    expect(await hashText('abc', 'SHA-1')).toBe('a9993e364706816aba3e25717850c26c9cd0d89d')
    expect(await hashText('abc', 'SHA-256')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    )
  })
})

describe('json format', () => {
  it('beautifies and minifies', () => {
    expect(minifyJson(formatJson('{"a":1}'))).toBe('{"a":1}')
  })
  it('throws on invalid json', () => {
    expect(() => formatJson('{bad}')).toThrow()
  })
})

describe('runRegex', () => {
  it('finds all matches and builds highlight segments', () => {
    const r = runRegex('\\d+', '', 'a1b22c333')
    expect(r.matches.map((m) => m.match)).toEqual(['1', '22', '333'])
    expect(r.segments.filter((s) => s.isMatch).length).toBe(3)
  })
  it('handles zero-width patterns without hanging', () => {
    const r = runRegex('a*', '', 'aa')
    expect(r.matches.length).toBeGreaterThan(0)
  })
})

describe('explainCron', () => {
  it('explains in Turkish', () => {
    const text = explainCron('0 9 * * 1-5', 'tr')
    expect(text.length).toBeGreaterThan(0)
  })
  it('throws on invalid expression', () => {
    expect(() => explainCron('not a cron', 'en')).toThrow()
  })
})

describe('parseUrl', () => {
  it('splits a URL into parts', () => {
    const p = parseUrl('https://ornek.com:8080/yol?a=1&b=2#x')
    expect(p.protocol).toBe('https')
    expect(p.hostname).toBe('ornek.com')
    expect(p.port).toBe('8080')
    expect(p.pathname).toBe('/yol')
    expect(p.hash).toBe('x')
    expect(p.params).toEqual([
      { key: 'a', value: '1' },
      { key: 'b', value: '2' },
    ])
  })
})
