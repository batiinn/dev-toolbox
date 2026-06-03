import { describe, expect, it } from 'vitest'
import { formatSql, formatXml } from '../src/lib/format'
import { convertCase } from '../src/lib/text'
import { generatePassword, loremIpsum } from '../src/lib/generators'
import { htmlDecode } from '../src/lib/encoding'
import { hashBuffer } from '../src/lib/hash'

describe('formatSql', () => {
  it('uppercases keywords and breaks lines', () => {
    const out = formatSql('select a,b from t where a=1')
    expect(out).toContain('SELECT')
    expect(out).toContain('FROM')
    expect(out.split('\n').length).toBeGreaterThan(1)
  })
})

describe('formatXml', () => {
  it('indents nested elements', () => {
    const out = formatXml('<a><b>x</b></a>')
    const lines = out.split('\n')
    expect(lines[0]).toBe('<a>')
    expect(lines[1]).toMatch(/^\s+<b>x<\/b>$/)
    expect(lines[2]).toBe('</a>')
  })
})

describe('convertCase extras', () => {
  it('Title Case is Turkish-aware', () => {
    expect(convertCase('istanbul izmir', 'title')).toBe('İstanbul İzmir')
  })
  it('sentence case capitalizes first letter', () => {
    expect(convertCase('merhaba. nasılsın?', 'sentence')).toBe('Merhaba. Nasılsın?')
  })
})

describe('generatePassword ambiguity filter', () => {
  it('excludes ambiguous characters when requested', () => {
    const pw = generatePassword({
      length: 200,
      lowercase: true,
      uppercase: true,
      numbers: true,
      symbols: false,
      avoidAmbiguous: true,
    })
    expect(pw).not.toMatch(/[l1IO0o]/)
  })
})

describe('loremIpsum', () => {
  it('produces the requested number of paragraphs', () => {
    const out = loremIpsum(3)
    expect(out.split('\n\n')).toHaveLength(3)
    expect(out.startsWith('Lorem')).toBe(true)
  })
})

describe('htmlDecode', () => {
  it('decodes named and mixed entities', () => {
    expect(htmlDecode('&lt;p&gt;a &amp; b&lt;/p&gt;')).toBe('<p>a & b</p>')
  })
})

describe('hashBuffer (file hashing)', () => {
  it('matches known digests for the bytes of "abc"', async () => {
    const buf = new TextEncoder().encode('abc').buffer
    expect(await hashBuffer(buf, 'SHA-256')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    )
    expect(await hashBuffer(buf, 'MD5')).toBe('900150983cd24fb0d6963f7d28e17f72')
  })
})
