export interface DecodedJwt {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  signature: string
  notes: string[]
}

function base64UrlDecode(segment: string): string {
  let s = segment.replace(/-/g, '+').replace(/_/g, '/')
  while (s.length % 4) s += '='
  const binary = atob(s)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

export function decodeJwt(token: string): DecodedJwt {
  const parts = token.trim().split('.')
  if (parts.length !== 3) {
    throw new Error('Geçersiz JWT: token üç bölümden oluşmalı (header.payload.signature).')
  }
  const header = JSON.parse(base64UrlDecode(parts[0])) as Record<string, unknown>
  const payload = JSON.parse(base64UrlDecode(parts[1])) as Record<string, unknown>

  const notes: string[] = []
  const now = Math.floor(Date.now() / 1000)
  const fmt = (n: number) => new Date(n * 1000).toLocaleString()

  if (typeof payload.exp === 'number') {
    notes.push(
      payload.exp < now
        ? `Süresi dolmuş (exp: ${fmt(payload.exp)})`
        : `Geçerli, son kullanma: ${fmt(payload.exp)}`,
    )
  }
  if (typeof payload.iat === 'number') notes.push(`Oluşturulma (iat): ${fmt(payload.iat)}`)
  if (typeof payload.nbf === 'number') notes.push(`Geçerlilik başlangıcı (nbf): ${fmt(payload.nbf)}`)

  return { header, payload, signature: parts[2], notes }
}
