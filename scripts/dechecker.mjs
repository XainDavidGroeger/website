/**
 * Entfernt eingebackenen Schachbrett-Hintergrund aus den Crew-Sheets
 * per Flood-Fill von den Bildrändern: helle, ungesättigte Pixel (Checker-Grau/Weiß)
 * werden transparent, bis eine farbige/dunkle Kontur stoppt.
 *
 * Aufruf: node scripts/dechecker.mjs <datei.png> [...weitere]
 * Ergebnis je Datei: <datei>-alpha.png
 */
import sharp from 'sharp'

const files = process.argv.slice(2)
if (!files.length) {
  console.error('Aufruf: node scripts/dechecker.mjs <datei.png> [...]')
  process.exit(1)
}

for (const file of files) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: w, height: h } = info

  const idx = (x, y) => (y * w + x) * 4

  const isChecker = (x, y) => {
    const i = idx(x, y)
    const r = data[i], g = data[i + 1], b = data[i + 2]
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    return max - min < 14 && min > 190
  }

  const visited = new Uint8Array(w * h)
  const stack = []
  for (let x = 0; x < w; x++) stack.push([x, 0], [x, h - 1])
  for (let y = 0; y < h; y++) stack.push([0, y], [w - 1, y])

  let cleared = 0
  while (stack.length) {
    const [x, y] = stack.pop()
    if (x < 0 || y < 0 || x >= w || y >= h) continue
    const v = y * w + x
    if (visited[v]) continue
    visited[v] = 1
    if (!isChecker(x, y)) continue
    data[idx(x, y) + 3] = 0
    cleared++
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1])
  }

  const out = file.replace(/\.png$/i, '-alpha.png')
  await sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toFile(out)
  console.log(`${file}: ${Math.round((cleared / (w * h)) * 100)} % transparent → ${out}`)
}
