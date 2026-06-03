export interface TextStats {
  characters: number
  charactersNoSpaces: number
  words: number
  lines: number
  sentences: number
  paragraphs: number
  bytes: number
  readingTimeSec: number
}

function countChars(s: string): number {
  let n = 0
  for (const _ of s) n++
  return n
}

export function textStats(input: string): TextStats {
  const characters = countChars(input)
  const charactersNoSpaces = countChars(input.replace(/\s/g, ''))
  const words = input.trim() ? input.trim().split(/\s+/).length : 0
  const lines = input ? input.split('\n').length : 0
  const sentences = (input.match(/[^.!?…]+[.!?…]+/g) || []).length
  const paragraphs = input.trim() ? input.trim().split(/\n\s*\n/).length : 0
  const bytes = new TextEncoder().encode(input).length
  const readingTimeSec = Math.round((words / 200) * 60)
  return { characters, charactersNoSpaces, words, lines, sentences, paragraphs, bytes, readingTimeSec }
}
