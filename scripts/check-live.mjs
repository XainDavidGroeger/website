/* Live-Check: Konsole-Fehler + API-Mock + Karte auf david-webdev.de */
import puppeteer from 'puppeteer-core'

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
})
for (const path of ['/', '/en', '/sandbox/demo', '/sandbox/api', '/sandbox/spec']) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1400, height: 900 })
  const errors = []
  page.on('pageerror', e => errors.push(String(e).slice(0, 150)))
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 150)) })
  await page.goto(`https://david-webdev.de${path}`, { waitUntil: 'networkidle2', timeout: 90_000 })
  await new Promise(r => setTimeout(r, 3000))
  let extra = ''
  if (path === '/sandbox/demo') {
    const canvas = await page.$('canvas.maplibregl-canvas')
    extra = canvas ? ' · Karte gerendert ✓' : ' · KEINE Karte!'
  }
  if (path === '/sandbox/api') {
    const api = await page.evaluate(async () => {
      const r = await fetch('/api/v1/stations')
      return { status: r.status, count: (await r.json()).data?.length }
    })
    extra = ` · Mock-API: ${api.status}, ${api.count} Stationen`
    const swagger = await page.$('.swagger-ui')
    extra += swagger ? ' · Swagger ✓' : ' · KEIN Swagger!'
  }
  console.log(`${path}: ${errors.length === 0 ? 'keine Fehler ✓' : 'FEHLER: ' + errors.join(' | ')}${extra}`)
  await page.close()
}
await browser.close()
