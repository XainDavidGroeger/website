/**
 * Scroll-Aufnahmen der Referenz-Plattformen als GIF, headless über das
 * installierte Chrome (puppeteer-core). Ein Full-Page-Screenshot wird in
 * Viewport-Slices geschnitten (synthetischer Scroll) — das umgeht
 * Scroll-Jacking und Scroll-Animationen, die Live-Frames weiß malen.
 * sharp joint die Slices animiert im Laptop-Mockup-Verhältnis (2.196).
 *
 * Aufruf: node scripts/record-scroll.mjs [name ...]   (ohne Args: alle)
 */
import puppeteer from 'puppeteer-core'
import sharp from 'sharp'
import { join } from 'node:path'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const OUT = join(import.meta.dirname, '..', 'public', 'img', 'work', 'rec')

/* 1440x656 = 2.195, entspricht dem Screen-Ausschnitt des Laptop-Mockups */
const VIEW = { width: 1440, height: 656, deviceScaleFactor: 1 }
const FRAMES = 9
const DEPTH = 5200
const FRAME_DELAY = 850
const LAST_DELAY = 1600

const SITES = [
  { name: 'matchingnight', url: 'https://speeddating-xxl.de/matching-night', depth: 9000 },
  { name: 'speeddating', url: 'https://speeddating-xxl.de/', depth: 9000 },
  { name: 'socialmatch', url: 'https://socialmatch.de/' },
  { name: 'muziqme', url: 'https://self-booking.muziqme.de/' },
  { name: 'buggyfit', url: 'https://www.buggyfit.de/' },
]

function killOverlays() {
  /* Consent-Dialoge ablehnen bzw. nur lokal fürs Rendering entfernen */
  const ucRoot = document.querySelector('#usercentrics-root')
  ucRoot?.shadowRoot?.querySelector('[data-testid="uc-deny-all-button"]')?.click()
  for (const b of document.querySelectorAll('button, a.button')) {
    if (/^(ablehnen|alle ablehnen|nur essenzielle cookies akzeptieren|auswahl speichern|speichern)$/i
      .test((b.textContent || '').trim())) { b.click(); break }
  }
  ucRoot?.remove()
  document.querySelector('#usercentrics-cmp-ui')?.remove()
  document.querySelectorAll('[id*="BorlabsCookie"], .BorlabsCookie').forEach(e => e.remove())
  for (const el of document.querySelectorAll('body *')) {
    if (el.childElementCount > 40) continue
    const st = getComputedStyle(el)
    if (st.position !== 'fixed' && st.position !== 'sticky') continue
    const txt = (el.innerText || '').toLowerCase()
    if (txt.length < 2500 && /cookie|akzeptieren|privatsphäre|einwilligung|datenschutzeinstellung/.test(txt)) el.remove()
  }
  /* Scroll-Sperren der Consent-Manager aufheben (werden teils laufend neu gesetzt) */
  document.body.classList.remove('modal-open', 'overflowHidden')
  if (!document.getElementById('rec-unlock')) {
    const s = document.createElement('style')
    s.id = 'rec-unlock'
    s.textContent = 'html,body{overflow:auto!important;height:auto!important;position:static!important}'
    document.head.appendChild(s)
  }
}

const wanted = process.argv.slice(2)
const sites = wanted.length ? SITES.filter(s => wanted.includes(s.name)) : SITES

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--hide-scrollbars', '--mute-audio'],
})

try {
  for (const site of sites) {
    const page = await browser.newPage()
    await page.setViewport(VIEW)
    await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 90_000 })
    await new Promise(r => setTimeout(r, 2500))
    await page.evaluate(killOverlays)
    await new Promise(r => setTimeout(r, 2500))
    await page.evaluate(killOverlays)

    /* Kein Scroll-Pass vorab: Scroll-Jacking-Seiten geraten dadurch in einen
       Zustand, in dem sie weiß malen. captureBeyondViewport rendert alles. */
    const full = await page.screenshot({ type: 'png', fullPage: true })
    const meta = await sharp(full).metadata()

    let slices = []
    const allSlices = []
    if (meta.height > VIEW.height * 1.2) {
      /* Normale Seite: Full-Page in Viewport-Slices schneiden */
      const distance = Math.min(meta.height - VIEW.height, site.depth ?? DEPTH)
      for (let i = 0; i < FRAMES; i++) {
        const top = Math.round((distance / (FRAMES - 1)) * i)
        const buf = await sharp(full)
          .extract({ left: 0, top, width: meta.width, height: VIEW.height })
          .png()
          .toBuffer()
        allSlices.push(buf)
        const st = await sharp(buf).stats()
        const spread = st.channels.reduce((a, c) => a + c.stdev, 0) / st.channels.length
        if (spread > 12) slices.push(buf)
      }
      console.log(`${site.name}: slice-Modus, Seite ${meta.width}x${meta.height}, 0..${distance}px`)
    } else {
      /* Seite scrollt in einem inneren Container: den finden und scrollen */
      const scrollInfo = await page.evaluate(() => {
        let best = document.scrollingElement
        for (const el of document.querySelectorAll('body, body *')) {
          const st = getComputedStyle(el)
          if (!/(auto|scroll)/.test(st.overflowY)) continue
          if (el.clientHeight > 300 && el.scrollHeight > best.scrollHeight + 200) best = el
        }
        best.setAttribute('data-rec-scroller', '1')
        return { max: best.scrollHeight - best.clientHeight }
      })
      const distance = Math.min(scrollInfo.max, site.depth ?? DEPTH)
      /* Lazy-Load vorladen */
      for (let y = 0; y <= distance; y += 600) {
        await page.evaluate(pos => { document.querySelector('[data-rec-scroller]').scrollTop = pos }, y)
        await new Promise(r => setTimeout(r, 250))
      }
      for (let i = 0; i < FRAMES; i++) {
        const y = Math.round((distance / (FRAMES - 1)) * i)
        await page.evaluate(pos => { document.querySelector('[data-rec-scroller]').scrollTop = pos }, y)
        await new Promise(r => setTimeout(r, 900))
        const buf = await page.screenshot({ type: 'png' })
        allSlices.push(buf)
        const st = await sharp(buf).stats()
        const spread = st.channels.reduce((a, c) => a + c.stdev, 0) / st.channels.length
        if (spread > 12) slices.push(buf)
      }
      console.log(`${site.name}: inner-scroll-Modus, 0..${distance}px`)
    }
    if (slices.length < 2) slices = allSlices
    await page.close()

    const delay = Array(slices.length).fill(FRAME_DELAY)
    delay[slices.length - 1] = LAST_DELAY
    const out = join(OUT, `${site.name}.gif`)
    /* Zwei Durchgänge: resize direkt nach join würde die Frame-Rolle stauchen */
    const joined = await sharp(slices, { join: { animated: true } })
      .gif({ delay, loop: 0 })
      .toBuffer()
    await sharp(joined, { animated: true })
      .resize({ width: 900, height: 410, fit: 'cover', position: 'top' })
      .gif({ effort: 7, delay, loop: 0 })
      .toFile(out)
    const kb = Math.round((await sharp(out, { animated: true }).toBuffer()).length / 1024)
    console.log(`${site.name}: ${slices.length} Frames, 900x410, ${kb} KB`)
  }
} finally {
  await browser.close()
}
