/**
 * Zerlegt die LoveArt-Charakter-Sheets (3×2-Raster) in einzelne Posen,
 * trimmt transparente Ränder und exportiert WebP nach public/img/crew/.
 * Außerdem: Gruppenbild + Porträt (public/img/david.webp).
 *
 * Aufruf: node scripts/build-crew.mjs
 */
import { mkdirSync } from 'node:fs'
import sharp from 'sharp'

const OUT = 'public/img/crew'
mkdirSync(OUT, { recursive: true })

const sheets = [
  // pixel: Alpha-Variante aus scripts/dechecker.mjs (Original hatte eingebackenes Schachbrett)
  ['crew/pixel-sheet-alpha.png', 'pixel'],
  ['crew/forge-sheet.png', 'forge'],
  ['crew/prompt-sheet.png', 'prompt'],
  ['crew/idle-sheet.png', 'idle'],
]

for (const [file, name] of sheets) {
  const meta = await sharp(file).metadata()
  if (!meta.hasAlpha) {
    console.warn(`⚠ ${file}: KEIN Alpha-Kanal — Export mit Transparenz nötig!`)
  }
  const cellW = Math.floor(meta.width / 3)
  const cellH = Math.floor(meta.height / 2)
  let i = 0
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 3; col++) {
      i++
      const outFile = `${OUT}/${name}-${i}.webp`
      const cell = { left: col * cellW, top: row * cellH, width: cellW, height: cellH }
      try {
        await sharp(file)
          .extract(cell)
          .trim()
          .resize({ width: 512, height: 512, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 84 })
          .toFile(outFile)
      } catch {
        // trim schlägt bei (fast) leeren Zellen fehl — dann ohne trim exportieren
        console.warn(`  ${name}-${i}: trim fehlgeschlagen, exportiere ungetrimmt`)
        await sharp(file)
          .extract(cell)
          .resize({ width: 512, height: 512, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 84 })
          .toFile(outFile)
      }
    }
  }
  console.log(`${name}: 6 Posen exportiert (alpha: ${meta.hasAlpha}, Zelle ${cellW}×${cellH})`)
}

await sharp('crew/crew-group.png')
  .resize({ width: 1600, withoutEnlargement: true })
  .webp({ quality: 84 })
  .toFile(`${OUT}/group.webp`)
console.log('group.webp exportiert')

await sharp('crew/david-portrait-original.jpg')
  .resize({ width: 900 })
  .webp({ quality: 84 })
  .toFile('public/img/david.webp')
console.log('david.webp (Porträt, 900w) exportiert')
