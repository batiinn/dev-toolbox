import { describe, expect, it } from 'vitest'
import { decodeJwt } from '../src/lib/jwt'

const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

describe('decodeJwt', () => {
  it('decodes header and payload', () => {
    const d = decodeJwt(TOKEN)
    expect(d.header).toEqual({ alg: 'HS256', typ: 'JWT' })
    expect(d.payload).toMatchObject({ sub: '1234567890', name: 'John Doe', iat: 1516239022 })
  })
  it('throws on malformed token', () => {
    expect(() => decodeJwt('not.a.valid.jwt.token')).toThrow()
    expect(() => decodeJwt('abc')).toThrow()
  })
})
