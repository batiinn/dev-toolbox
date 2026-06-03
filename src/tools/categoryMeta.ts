import { ArrowLeftRight, Binary, Braces, Globe, Sparkles, Type } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ToolCategory } from './types'

export const CATEGORY_ICON: Record<ToolCategory, LucideIcon> = {
  encode: Binary,
  generate: Sparkles,
  convert: ArrowLeftRight,
  format: Braces,
  text: Type,
  web: Globe,
}
