function randomBytes(len: number): Uint8Array {
  const arr = new Uint8Array(len)
  crypto.getRandomValues(arr)
  return arr
}

export function uuidV4(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  const b = randomBytes(16)
  b[6] = (b[6] & 0x0f) | 0x40
  b[8] = (b[8] & 0x3f) | 0x80
  const hex = [...b].map((x) => x.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(
    16,
    20,
  )}-${hex.slice(20)}`
}

export function uuidV7(now: number = Date.now()): string {
  const b = randomBytes(16)
  const ts = BigInt(now)
  b[0] = Number((ts >> 40n) & 0xffn)
  b[1] = Number((ts >> 32n) & 0xffn)
  b[2] = Number((ts >> 24n) & 0xffn)
  b[3] = Number((ts >> 16n) & 0xffn)
  b[4] = Number((ts >> 8n) & 0xffn)
  b[5] = Number(ts & 0xffn)
  b[6] = (b[6] & 0x0f) | 0x70
  b[8] = (b[8] & 0x3f) | 0x80
  const hex = [...b].map((x) => x.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(
    16,
    20,
  )}-${hex.slice(20)}`
}

export interface PasswordOptions {
  length: number
  lowercase: boolean
  uppercase: boolean
  numbers: boolean
  symbols: boolean
  avoidAmbiguous: boolean
}

const SETS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.<>?',
}
const AMBIGUOUS = /[l1IO0o]/g

export function generatePassword(opts: PasswordOptions): string {
  let pool = ''
  if (opts.lowercase) pool += SETS.lowercase
  if (opts.uppercase) pool += SETS.uppercase
  if (opts.numbers) pool += SETS.numbers
  if (opts.symbols) pool += SETS.symbols
  if (opts.avoidAmbiguous) pool = pool.replace(AMBIGUOUS, '')
  if (!pool) throw new Error('En az bir karakter seti seçilmeli.')

  const out: string[] = []
  const rnd = randomBytes(opts.length)
  for (let i = 0; i < opts.length; i++) out.push(pool[rnd[i] % pool.length])
  return out.join('')
}

const LOREM_WORDS =
  'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(
    ' ',
  )

export function loremIpsum(paragraphs: number, wordsPerParagraph = 40): string {
  const out: string[] = []
  let idx = 0
  for (let p = 0; p < paragraphs; p++) {
    const words: string[] = []
    for (let w = 0; w < wordsPerParagraph; w++) {
      words.push(LOREM_WORDS[idx % LOREM_WORDS.length])
      idx++
    }
    let sentence = words.join(' ')
    sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.'
    out.push(sentence)
  }
  return out.join('\n\n')
}
