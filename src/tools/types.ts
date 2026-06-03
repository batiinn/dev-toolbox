import type { ComponentType, LazyExoticComponent } from 'react'

export type ToolCategory = 'encode' | 'generate' | 'convert' | 'format' | 'text' | 'web'

export interface ToolDefinition {
  id: string
  category: ToolCategory
  keywords: string[]
  component: LazyExoticComponent<ComponentType> | ComponentType
}

export const CATEGORY_ORDER: ToolCategory[] = [
  'encode',
  'generate',
  'convert',
  'format',
  'text',
  'web',
]
