import { md5 } from 'js-md5'

export type HashAlgo = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512'

export const HASH_ALGOS: HashAlgo[] = ['MD5', 'SHA-1', 'SHA-256', 'SHA-512']

function toHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function hashText(input: string, algo: HashAlgo): Promise<string> {
  if (algo === 'MD5') return md5(input)
  const data = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest(algo, data)
  return toHex(digest)
}

export async function hashAll(input: string): Promise<Record<HashAlgo, string>> {
  const entries = await Promise.all(
    HASH_ALGOS.map(async (a) => [a, await hashText(input, a)] as const),
  )
  return Object.fromEntries(entries) as Record<HashAlgo, string>
}

export async function hashBuffer(buffer: ArrayBuffer, algo: HashAlgo): Promise<string> {
  if (algo === 'MD5') return md5(buffer)
  const digest = await crypto.subtle.digest(algo, buffer)
  return toHex(digest)
}

export async function hashAllBuffer(buffer: ArrayBuffer): Promise<Record<HashAlgo, string>> {
  const entries = await Promise.all(
    HASH_ALGOS.map(async (a) => [a, await hashBuffer(buffer, a)] as const),
  )
  return Object.fromEntries(entries) as Record<HashAlgo, string>
}
