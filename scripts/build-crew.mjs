/**
 * Zerlegt die Crew-Sheets (-alpha-Varianten aus scripts/dechecker.mjs) in einzelne
 * Posen und exportiert WebP nach public/img/crew/. Außerdem Gruppenbild + Porträt.
 *
 * Slicing über Connected-Component-Labeling statt starrem Raster: Die Bots stehen
 * nicht exakt im 3×2-Grid, daher werden Pixel-Blobs erkannt, per Schwerpunkt der
 * Rasterzelle zugeordnet (Pose-Nr. = Zelle, row-major 1–6) und nur die Pixel der
 * eigenen Komponenten extrahiert — keine Fragmente von Nachbar-Posen.
 *
 * Aufruf: node scripts/build-crew.mjs
 */
import { mkdirSync } from 'node:fs'
import sharp from 'sharp'

const OUT = 'public/img/crew'
mkdirSync(OUT, { recursive: true })

const sheets = [
  ['crew/pixel-sheet-alpha.png', 'pixel'],
  ['crew/forge-sheet-alpha.png', 'forge'],
  ['crew/prompt-sheet-alpha.png', 'prompt'],
  ['crew/idle-sheet-alpha.png', 'idle'],
]

const MIN_COMPONENT_PX = 50

for (const [file, name] of sheets) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: w, height: h } = info
  const cellW = w / 3
  const cellH = h / 2

  // Connected-Component-Labeling (4er-Nachbarschaft) auf alpha > 0
  const labels = new Int32Array(w * h)
  const components = [] // { id, size, minX, minY, maxX, maxY, sumX, sumY }
  let nextLabel = 0

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const p = y * w + x
      if (labels[p] !== 0 || data[p * 4 + 3] === 0) continue
      nextLabel++
      const comp = { id: nextLabel, size: 0, minX: x, minY: y, maxX: x, maxY: y, sumX: 0, sumY: 0 }
      const stack = [p]
      labels[p] = nextLabel
      while (stack.length) {
        const q = stack.pop()
        const qx = q % w
        const qy = (q - qx) / w
        comp.size++
        comp.sumX += qx
        comp.sumY += qy
        if (qx < comp.minX) comp.minX = qx
        if (qx > comp.maxX) comp.maxX = qx
        if (qy < comp.minY) comp.minY = qy
        if (qy > comp.maxY) comp.maxY = qy
        const neighbors = [q - 1, q + 1, q - w, q + w]
        for (const n of neighbors) {
          if (n < 0 || n >= w * h) continue
          const nx = n % w
          if (Math.abs(nx - qx) > 1) continue // kein Zeilenumbruch
          if (labels[n] === 0 && data[n * 4 + 3] > 0) {
            labels[n] = nextLabel
            stack.push(n)
          }
        }
      }
      components.push(comp)
    }
  }

  // Komponenten per Schwerpunkt einer Zelle (Pose) zuordnen
  const cells = Array.from({ length: 6 }, () => ({ comps: new Set(), minX: w, minY: h, maxX: 0, maxY: 0 }))
  for (const comp of components) {
    if (comp.size < MIN_COMPONENT_PX) continue
    const cx = comp.sumX / comp.size
    const cy = comp.sumY / comp.size
    const col = Math.min(2, Math.floor(cx / cellW))
    const row = Math.min(1, Math.floor(cy / cellH))
    const cell = cells[row * 3 + col]
    cell.comps.add(comp.id)
    cell.minX = Math.min(cell.minX, comp.minX)
    cell.minY = Math.min(cell.minY, comp.minY)
    cell.maxX = Math.max(cell.maxX, comp.maxX)
    cell.maxY = Math.max(cell.maxY, comp.maxY)
  }

  for (let i = 0; i < 6; i++) {
    const cell = cells[i]
    if (!cell.comps.size) {
      console.warn(`  ${name}-${i + 1}: keine Komponenten gefunden — übersprungen`)
      continue
    }
    const bw = cell.maxX - cell.minX + 1
    const bh = cell.maxY - cell.minY + 1
    // Nur Pixel der eigenen Komponenten in den Ausschnitt kopieren
    const buf = Buffer.alloc(bw * bh * 4)
    for (let y = cell.minY; y <= cell.maxY; y++) {
      for (let x = cell.minX; x <= cell.maxX; x++) {
        const src = y * w + x
        if (!cell.comps.has(labels[src])) continue
        const dst = ((y - cell.minY) * bw + (x - cell.minX)) * 4
        data.copy(buf, dst, src * 4, src * 4 + 4)
      }
    }
    await sharp(buf, { raw: { width: bw, height: bh, channels: 4 } })
      .resize({ width: 512, height: 512, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 84 })
      .toFile(`${OUT}/${name}-${i + 1}.webp`)
  }
  console.log(`${name}: 6 Posen exportiert (${components.length} Komponenten erkannt)`)
}

await sharp('crew/crew-group-alpha.png')
  .resize({ width: 1600, withoutEnlargement: true })
  .webp({ quality: 84 })
  .toFile(`${OUT}/group.webp`)
console.log('group.webp exportiert')

await sharp('crew/david-portrait-original.jpg')
  .resize({ width: 900 })
  .webp({ quality: 84 })
  .toFile('public/img/david.webp')
console.log('david.webp (Porträt, 900w) exportiert')
