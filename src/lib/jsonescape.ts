export function jsonEscape(input: string): string {
  const quoted = JSON.stringify(input)
  return quoted.slice(1, -1)
}

export function jsonUnescape(input: string): string {
  const trimmed = input.trim()
  const quoted = trimmed.startsWith('"') && trimmed.endsWith('"') ? trimmed : `"${trimmed}"`
  const result = JSON.parse(quoted)
  if (typeof result !== 'string') throw new Error('Geçerli bir JSON metni değil.')
  return result
}
