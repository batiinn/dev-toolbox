export interface ParsedUrl {
  protocol: string
  host: string
  hostname: string
  port: string
  pathname: string
  hash: string
  params: { key: string; value: string }[]
}

export function parseUrl(input: string): ParsedUrl {
  const u = new URL(input.trim())
  return {
    protocol: u.protocol.replace(':', ''),
    host: u.host,
    hostname: u.hostname,
    port: u.port,
    pathname: u.pathname,
    hash: u.hash.replace('#', ''),
    params: [...u.searchParams.entries()].map(([key, value]) => ({ key, value })),
  }
}
