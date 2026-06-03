import { hexToRgb, rgbToHex, rgbToHsl, type RgbColor } from './converters'

function hslToRgb(h: number, s: number, l: number): RgbColor {
  h /= 360
  s /= 100
  l /= 100
  if (s === 0) {
    const v = Math.round(l * 255)
    return { r: v, g: v, b: v }
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  }
}

export interface Palette {
  shades: string[]
  complementary: string
  analogous: string[]
  triadic: string[]
}

export function buildPalette(hex: string): Palette {
  const { h, s } = rgbToHsl(hexToRgb(hex))
  const shades = [95, 85, 72, 60, 50, 40, 30, 20, 12].map((l) => rgbToHex(hslToRgb(h, s, l)))
  const at = (hue: number, l = 50) => rgbToHex(hslToRgb((hue + 360) % 360, s, l))
  return {
    shades,
    complementary: at(h + 180),
    analogous: [at(h - 30), at(h + 30)],
    triadic: [at(h + 120), at(h + 240)],
  }
}
