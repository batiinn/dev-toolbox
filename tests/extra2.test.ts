import { describe, expect, it } from 'vitest'
import { octalToPerms, permsToOctal, permsToSymbolic } from '../src/lib/chmod'
import { convertCssUnit } from '../src/lib/cssunits'
import { HTTP_STATUS } from '../src/lib/httpStatus'

describe('chmod', () => {
  it('octal 755 -> symbolic', () => {
    expect(permsToSymbolic(octalToPerms('755'))).toBe('rwxr-xr-x')
  })
  it('octal 644 -> symbolic', () => {
    expect(permsToSymbolic(octalToPerms('644'))).toBe('rw-r--r--')
  })
  it('round-trips through octal', () => {
    expect(permsToOctal(octalToPerms('640'))).toBe('640')
  })
  it('throws on invalid octal', () => {
    expect(() => octalToPerms('999')).toThrow()
    expect(() => octalToPerms('75')).toThrow()
  })
})

describe('convertCssUnit', () => {
  it('px -> rem with base 16', () => {
    expect(convertCssUnit(24, 'px', 16)).toEqual({ px: 24, rem: 1.5, em: 1.5 })
  })
  it('rem -> px', () => {
    expect(convertCssUnit(2, 'rem', 16).px).toBe(32)
  })
  it('throws on zero base', () => {
    expect(() => convertCssUnit(10, 'px', 0)).toThrow()
  })
})

describe('HTTP_STATUS data', () => {
  it('has bilingual entries for common codes', () => {
    const codes = HTTP_STATUS.map((s) => s.code)
    expect(codes).toContain(404)
    expect(codes).toContain(500)
    const notFound = HTTP_STATUS.find((s) => s.code === 404)!
    expect(notFound.name.tr).toBe('Bulunamadı')
    expect(notFound.name.en).toBe('Not Found')
  })
  it('every entry has tr and en name + desc', () => {
    expect(HTTP_STATUS.every((s) => s.name.tr && s.name.en && s.desc.tr && s.desc.en)).toBe(true)
  })
})
