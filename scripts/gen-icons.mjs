import sharp from 'sharp'
import fs from 'fs'

const icon = fs.readFileSync('public/favicon.svg')
const maskable = fs.readFileSync('scripts/icon-maskable.svg')
const og = fs.readFileSync('scripts/og-image.svg')
const out = (name) => `public/${name}`

await sharp(icon, { density: 384 }).resize(192, 192).png().toFile(out('pwa-192.png'))
await sharp(maskable, { density: 384 }).resize(512, 512).png().toFile(out('pwa-512.png'))
await sharp(maskable, { density: 384 }).resize(512, 512).png().toFile(out('pwa-maskable-512.png'))
await sharp(maskable, { density: 384 }).resize(180, 180).png().toFile(out('apple-touch-icon.png'))
await sharp(og, { density: 144 }).resize(1200, 630).png().toFile(out('og-image.png'))
console.log('icons generated')
