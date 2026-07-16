/* Screenshot der Referenz-Sektion */
import puppeteer from 'puppeteer-core'

const outDir = String.raw`C:\Users\DAVIDG~2\AppData\Local\Temp\claude\C--\28e0b0c2-035b-4547-ba28-7c232284c8a2\scratchpad\frames`
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
})
const page = await browser.newPage()
await page.setViewport({ width: 1400, height: 950 })
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 120_000 })
const target = await page.$eval('#refs', el => el.getBoundingClientRect().top + scrollY)
for (let y = 0; y < target - 100; y += 400) {
  await page.evaluate(pos => scrollTo(0, pos), y)
  await new Promise(r => setTimeout(r, 100))
}
await page.evaluate(pos => scrollTo(0, pos), target - 100)
await new Promise(r => setTimeout(r, 2500))
await page.screenshot({ path: `${outDir}\\refs.png` })
await browser.close()
console.log('ok')
