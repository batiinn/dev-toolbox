export type CssUnit = 'px' | 'rem' | 'em'

export interface CssUnitResult {
  px: number
  rem: number
  em: number
}

export function convertCssUnit(value: number, from: CssUnit, base: number): CssUnitResult {
  if (!base) throw new Error('Temel font boyutu sıfır olamaz.')
  const px = from === 'px' ? value : value * base
  const round = (n: number) => Math.round(n * 10000) / 10000
  return { px: round(px), rem: round(px / base), em: round(px / base) }
}
