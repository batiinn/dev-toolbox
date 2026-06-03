import { describe, expect, it } from 'vitest'
import { convertCase, deasciify, diffLines, processLines, slugify } from '../src/lib/text'

describe('deasciify', () => {
  it('maps Turkish characters to ASCII', () => {
    expect(deasciify('Şükrü çiğköfte İğneada öğün ü')).toBe('Sukru cigkofte Igneada ogun u')
  })
})

describe('slugify', () => {
  it('produces a Turkish-aware slug', () => {
    expect(slugify('Çağrı Merkezi Çözümleri 2026')).toBe('cagri-merkezi-cozumleri-2026')
  })
  it('trims dashes', () => {
    expect(slugify('  --Merhaba!!  ')).toBe('merhaba')
  })
})

describe('convertCase', () => {
  it('camelCase', () => {
    expect(convertCase('merhaba dunya test', 'camel')).toBe('merhabaDunyaTest')
  })
  it('snake_case', () => {
    expect(convertCase('Merhaba Dunya', 'snake')).toBe('merhaba_dunya')
  })
  it('kebab-case', () => {
    expect(convertCase('Merhaba Dunya', 'kebab')).toBe('merhaba-dunya')
  })
  it('CONSTANT_CASE', () => {
    expect(convertCase('merhaba dunya', 'constant')).toBe('MERHABA_DUNYA')
  })
})

describe('processLines', () => {
  it('dedupes, trims and sorts', () => {
    const out = processLines('b\n a \nb\n\nc', {
      sort: 'asc',
      dedupe: true,
      trim: true,
      removeEmpty: true,
    })
    expect(out).toBe('a\nb\nc')
  })
})

describe('diffLines', () => {
  it('detects add and remove', () => {
    const d = diffLines('a\nb\nc', 'a\nx\nc')
    expect(d.find((l) => l.type === 'remove')?.text).toBe('b')
    expect(d.find((l) => l.type === 'add')?.text).toBe('x')
    expect(d.filter((l) => l.type === 'same').length).toBe(2)
  })
})
