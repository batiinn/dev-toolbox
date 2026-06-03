import { lazy } from 'react'
import type { ComponentType } from 'react'
import type { ToolDefinition } from './types'

const lazyTool = (loader: () => Promise<{ default: ComponentType }>) => lazy(loader)
const from = <M extends Record<string, ComponentType>>(
  loader: () => Promise<M>,
  key: keyof M,
) => lazyTool(() => loader().then((m) => ({ default: m[key] })))

const encode = () => import('./encode')
const generate = () => import('./generate')
const convert = () => import('./convert')
const format = () => import('./format')
const text = () => import('./text')
const web = () => import('./web')
const extra = () => import('./extra')

export const TOOLS: ToolDefinition[] = [
  { id: 'base64', category: 'encode', keywords: ['base64', 'b64', 'encode', 'decode', 'kodla'], component: from(encode, 'Base64Tool') },
  { id: 'url', category: 'encode', keywords: ['url', 'uri', 'encode', 'percent'], component: from(encode, 'UrlTool') },
  { id: 'html', category: 'encode', keywords: ['html', 'entity', 'escape', 'kaçış'], component: from(encode, 'HtmlTool') },
  { id: 'jwt', category: 'encode', keywords: ['jwt', 'token', 'json web token', 'decode'], component: from(encode, 'JwtTool') },
  { id: 'json-escape', category: 'encode', keywords: ['json', 'escape', 'unescape', 'string', 'kaçış'], component: from(extra, 'JsonEscapeTool') },
  { id: 'image-base64', category: 'encode', keywords: ['image', 'resim', 'base64', 'data uri', 'data url'], component: from(extra, 'ImageBase64Tool') },

  { id: 'uuid', category: 'generate', keywords: ['uuid', 'guid', 'id', 'v4', 'v7'], component: from(generate, 'UuidTool') },
  { id: 'password', category: 'generate', keywords: ['password', 'parola', 'şifre', 'random'], component: from(generate, 'PasswordTool') },
  { id: 'hash', category: 'generate', keywords: ['hash', 'md5', 'sha', 'sha256', 'özet'], component: from(generate, 'HashTool') },
  { id: 'lorem', category: 'generate', keywords: ['lorem', 'ipsum', 'placeholder', 'dummy', 'metin'], component: from(generate, 'LoremTool') },
  { id: 'qr', category: 'generate', keywords: ['qr', 'kare kod', 'barcode'], component: from(generate, 'QrTool') },

  { id: 'json-yaml', category: 'convert', keywords: ['json', 'yaml', 'yml', 'convert', 'dönüştür'], component: from(convert, 'JsonYamlTool') },
  { id: 'json-csv', category: 'convert', keywords: ['json', 'csv', 'tsv', 'excel', 'tablo'], component: from(convert, 'JsonCsvTool') },
  { id: 'timestamp', category: 'convert', keywords: ['timestamp', 'unix', 'epoch', 'tarih', 'zaman'], component: from(convert, 'TimestampTool') },
  { id: 'base', category: 'convert', keywords: ['base', 'binary', 'hex', 'octal', 'taban', 'ikilik'], component: from(convert, 'BaseTool') },
  { id: 'color', category: 'convert', keywords: ['color', 'renk', 'hex', 'rgb', 'hsl'], component: from(convert, 'ColorTool') },
  { id: 'color-palette', category: 'convert', keywords: ['palette', 'palet', 'renk', 'tema', 'shades', 'tonlar'], component: from(extra, 'ColorPaletteTool') },
  { id: 'css-units', category: 'convert', keywords: ['css', 'px', 'rem', 'em', 'birim', 'unit'], component: from(extra, 'CssUnitTool') },

  { id: 'json-format', category: 'format', keywords: ['json', 'format', 'beautify', 'minify', 'pretty', 'düzenle'], component: from(format, 'JsonFormatTool') },
  { id: 'sql-format', category: 'format', keywords: ['sql', 'format', 'query', 'sorgu'], component: from(format, 'SqlFormatTool') },
  { id: 'xml-format', category: 'format', keywords: ['xml', 'format', 'soap', 'rss'], component: from(format, 'XmlFormatTool') },
  { id: 'markdown', category: 'format', keywords: ['markdown', 'md', 'preview', 'önizleme'], component: from(extra, 'MarkdownTool') },

  { id: 'case', category: 'text', keywords: ['case', 'camel', 'snake', 'kebab', 'büyük', 'küçük', 'harf'], component: from(text, 'CaseTool') },
  { id: 'lines', category: 'text', keywords: ['lines', 'sort', 'sırala', 'dedupe', 'tekrar', 'satır'], component: from(text, 'LinesTool') },
  { id: 'slugify', category: 'text', keywords: ['slug', 'slugify', 'url', 'seo'], component: from(text, 'SlugifyTool') },
  { id: 'deasciify', category: 'text', keywords: ['deasciify', 'türkçe', 'ascii', 'çğışöü', 'turkish'], component: from(text, 'DeasciifyTool') },
  { id: 'diff', category: 'text', keywords: ['diff', 'compare', 'karşılaştır', 'fark'], component: from(text, 'DiffTool') },
  { id: 'text-stats', category: 'text', keywords: ['stats', 'count', 'sayaç', 'kelime', 'karakter', 'istatistik'], component: from(extra, 'TextStatsTool') },

  { id: 'regex', category: 'web', keywords: ['regex', 'regexp', 'düzenli ifade', 'pattern', 'test'], component: from(web, 'RegexTool') },
  { id: 'cron', category: 'web', keywords: ['cron', 'crontab', 'schedule', 'zamanlama'], component: from(web, 'CronTool') },
  { id: 'url-parse', category: 'web', keywords: ['url', 'parse', 'parça', 'query', 'parametre'], component: from(web, 'UrlParseTool') },
  { id: 'curl', category: 'web', keywords: ['curl', 'fetch', 'http', 'request', 'istek'], component: from(extra, 'CurlTool') },
  { id: 'chmod', category: 'web', keywords: ['chmod', 'permission', 'izin', 'unix', 'linux', 'octal'], component: from(extra, 'ChmodTool') },
  { id: 'http-status', category: 'web', keywords: ['http', 'status', 'durum', 'kod', '404', '500', 'code'], component: from(extra, 'HttpStatusTool') },
]

export function getTool(id: string): ToolDefinition | undefined {
  return TOOLS.find((t) => t.id === id)
}
