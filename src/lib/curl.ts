interface ParsedCurl {
  url: string
  method: string
  headers: Record<string, string>
  body?: string
}

function tokenize(cmd: string): string[] {
  const tokens: string[] = []
  const re = /"((?:\\.|[^"\\])*)"|'([^']*)'|(\S+)/g
  let m: RegExpExecArray | null
  const cleaned = cmd.replace(/\\\r?\n/g, ' ')
  while ((m = re.exec(cleaned)) !== null) {
    tokens.push(m[1] !== undefined ? m[1].replace(/\\"/g, '"') : m[2] !== undefined ? m[2] : m[3])
  }
  return tokens
}

export function parseCurl(cmd: string): ParsedCurl {
  const tokens = tokenize(cmd.trim())
  if (tokens[0] !== 'curl') throw new Error('Komut "curl" ile başlamalı.')
  const result: ParsedCurl = { url: '', method: '', headers: {} }

  for (let i = 1; i < tokens.length; i++) {
    const t = tokens[i]
    switch (t) {
      case '-X':
      case '--request':
        result.method = tokens[++i]?.toUpperCase() ?? ''
        break
      case '-H':
      case '--header': {
        const h = tokens[++i] ?? ''
        const idx = h.indexOf(':')
        if (idx > -1) result.headers[h.slice(0, idx).trim()] = h.slice(idx + 1).trim()
        break
      }
      case '-d':
      case '--data':
      case '--data-raw':
      case '--data-binary':
        result.body = tokens[++i] ?? ''
        break
      case '-u':
      case '--user': {
        const cred = tokens[++i] ?? ''
        result.headers['Authorization'] = `Basic ${btoa(cred)}`
        break
      }
      case '--compressed':
      case '-L':
      case '--location':
      case '-s':
      case '--silent':
        break
      default:
        if (!t.startsWith('-')) result.url = t
    }
  }

  if (!result.url) throw new Error('URL bulunamadı.')
  if (!result.method) result.method = result.body ? 'POST' : 'GET'
  return result
}

export function curlToFetch(cmd: string): string {
  const { url, method, headers, body } = parseCurl(cmd)
  const opts: string[] = [`  method: ${JSON.stringify(method)}`]
  if (Object.keys(headers).length) {
    opts.push(`  headers: ${JSON.stringify(headers, null, 2).replace(/\n/g, '\n  ')}`)
  }
  if (body !== undefined) opts.push(`  body: ${JSON.stringify(body)}`)
  return `const res = await fetch(${JSON.stringify(url)}, {\n${opts.join(',\n')}\n})\nconst data = await res.json()`
}
