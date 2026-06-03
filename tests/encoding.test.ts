import { describe, expect, it } from 'vitest'
import {
  base64Decode,
  base64Encode,
  htmlDecode,
  htmlEncode,
  urlDecode,
  urlEncode,
} from '../src/lib/encoding'

describe('base64', () => {
  it('round-trips unicode and emoji', () => {
    const s = 'Merhaba Dünya! 🌍 çğışöü'
    expect(base64Decode(base64Encode(s))).toBe(s)
  })
  it('encodes a known value', () => {
    expect(base64Encode('abc')).toBe('YWJj')
  })
})

describe('url', () => {
  it('round-trips Turkish query', () => {
    const s = 'çağrı merkezi & test'
    expect(urlDecode(urlEncode(s))).toBe(s)
  })
})

describe('html entities', () => {
  it('escapes special chars', () => {
    expect(htmlEncode('<a href="x">5 & 3</a>')).toBe(
      '&lt;a href=&quot;x&quot;&gt;5 &amp; 3&lt;/a&gt;',
    )
  })
  it('round-trips', () => {
    const s = '<div class="b">x & y \'z\'</div>'
    expect(htmlDecode(htmlEncode(s))).toBe(s)
  })
  it('decodes numeric entities', () => {
    expect(htmlDecode('&#65;&#x42;')).toBe('AB')
  })
})
