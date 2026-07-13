/**
 * Vermisst die Bildschirm-Öffnung eines Geräte-Mockups:
 * findet die größte zusammenhängende sehr dunkle Fläche (der leere Screen)
 * und gibt ihre Bounding-Box in Pixeln und Prozent aus.
 *
 * Aufruf: node scripts/measure-screen.mjs <frame-alpha.png>
 */
import sharp from 'sharp'

const file = process.argv[2]
if (!file) {
  console.error('Aufruf: node scripts/measure-screen.mjs <datei.png>')
  process.exit(1)
}

const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const { width: w, height: h } = info

const isScreen = (i) => {
  const a = data[i + 3]
  if (a < 200) return false
  const r = data[i]
  const g = data[i + 1]
  const b = data[i + 2]
  return Math.max(r, g, b) < 45
}

const labels = new Int32Array(w * h)
let best = null
let nextLabel = 0

for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const p = y * w + x
    if (labels[p] !== 0 || !isScreen(p * 4)) continue
    nextLabel++
    const comp = { size: 0, minX: x, minY: y, maxX: x, maxY: y }
    const stack = [p]
    labels[p] = nextLabel
    while (stack.length) {
      const q = stack.pop()
      const qx = q % w
      const qy = (q - qx) / w
      comp.size++
      if (qx < comp.minX) comp.minX = qx
      if (qx > comp.maxX) comp.maxX = qx
      if (qy < comp.minY) comp.minY = qy
      if (qy > comp.maxY) comp.maxY = qy
      for (const n of [q - 1, q + 1, q - w, q + w]) {
        if (n < 0 || n >= w * h) continue
        if (Math.abs((n % w) - qx) > 1) continue
        if (labels[n] === 0 && isScreen(n * 4)) {
          labels[n] = nextLabel
          stack.push(n)
        }
      }
    }
    if (!best || comp.size > best.size) best = comp
  }
}

if (!best) {
  console.error('keine Screen-Fläche gefunden')
  process.exit(1)
}

const pct = (v, total) => ((v / total) * 100).toFixed(2)
const bw = best.maxX - best.minX + 1
const bh = best.maxY - best.minY + 1

console.log(`Bild: ${w}×${h}`)
console.log(`Screen: x=${best.minX} y=${best.minY} w=${bw} h=${bh} (ratio ${(bw / bh).toFixed(3)})`)
console.log(`CSS (Prozent vom Frame):`)
console.log(`  left:   ${pct(best.minX, w)}%`)
console.log(`  top:    ${pct(best.minY, h)}%`)
console.log(`  width:  ${pct(bw, w)}%`)
console.log(`  height: ${pct(bh, h)}%`)
