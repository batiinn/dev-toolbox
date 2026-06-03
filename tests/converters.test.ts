import { describe, expect, it } from 'vitest'
import {
  convertBase,
  hexToRgb,
  jsonToCsv,
  jsonToYaml,
  rgbToHex,
  rgbToHsl,
  timestampToDate,
  yamlToJson,
} from '../src/lib/converters'

describe('json <-> yaml', () => {
  it('round-trips', () => {
    const json = '{"a":1,"b":["x","y"],"c":{"d":true}}'
    const back = yamlToJson(jsonToYaml(json))
    expect(JSON.parse(back)).toEqual(JSON.parse(json))
  })
})

describe('json -> csv', () => {
  it('builds header and rows', () => {
    const csv = jsonToCsv('[{"a":1,"b":"x"},{"a":2,"b":"y, z"}]')
    expect(csv).toBe('a,b\n1,x\n2,"y, z"')
  })
  it('throws on non-array', () => {
    expect(() => jsonToCsv('{"a":1}')).toThrow()
  })
})

describe('convertBase', () => {
  it('converts decimal 255', () => {
    expect(convertBase('255', 10)).toEqual({
      binary: '11111111',
      octal: '377',
      decimal: '255',
      hex: 'FF',
    })
  })
  it('parses hex input', () => {
    expect(convertBase('ff', 16).decimal).toBe('255')
  })
})

describe('color', () => {
  it('hex -> rgb', () => {
    expect(hexToRgb('#6366F1')).toEqual({ r: 99, g: 102, b: 241 })
  })
  it('expands shorthand', () => {
    expect(hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 })
  })
  it('rgb -> hex round-trip', () => {
    expect(rgbToHex({ r: 99, g: 102, b: 241 })).toBe('#6366F1')
  })
  it('rgb -> hsl for pure red', () => {
    expect(rgbToHsl({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, l: 50 })
  })
})

describe('timestamp', () => {
  it('converts seconds to ISO', () => {
    expect(timestampToDate(0).iso).toBe('1970-01-01T00:00:00.000Z')
  })
  it('computes relative time', () => {
    const now = 1_000_000_000_000
    expect(timestampToDate(999_999_000, now).relative).toContain('önce')
  })
})
