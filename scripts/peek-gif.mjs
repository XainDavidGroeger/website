/* Kontroll-Frames aus einem beliebigen GIF ziehen: node scripts/peek-gif.mjs <gif> <outdir> <prefix> */
import sharp from 'sharp'
import { join } from 'node:path'

const [src, outDir, prefix] = process.argv.slice(2)
const meta = await sharp(src, { animated: true }).metadata()
console.log(`frames: ${meta.pages}, ${meta.width}x${meta.pageHeight ?? meta.height}`)
for (const i of [0, Math.floor(meta.pages / 2), meta.pages - 1]) {
  await sharp(src, { page: i }).resize({ width: 800 }).png().toFile(join(outDir, `${prefix}-f${i}.png`))
}
