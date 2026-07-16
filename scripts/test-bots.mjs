/* Smoke-Test: reagieren Hero- und Agents-Bots auf Hover/Klick? */
import puppeteer from 'puppeteer-core'

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
})
const page = await browser.newPage()
await page.setViewport({ width: 1400, height: 900 })
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 120_000 })
await new Promise(r => setTimeout(r, 1500))

async function poseOf(selector) {
  return page.$eval(selector, el => el.getAttribute('src'))
}

async function testBot(label, selector) {
  await page.$eval(selector, el => el.scrollIntoView({ block: 'center' }))
  await new Promise(r => setTimeout(r, 600))
  const base = await poseOf(selector)
  await page.hover(selector)
  await new Promise(r => setTimeout(r, 300))
  const hover = await poseOf(selector)
  await page.click(selector)
  await new Promise(r => setTimeout(r, 300))
  const click = await poseOf(selector)
  await new Promise(r => setTimeout(r, 2200))
  await page.mouse.move(10, 10)
  await new Promise(r => setTimeout(r, 300))
  const back = await poseOf(selector)
  console.log(`${label}: base=${base} hover=${hover} click=${click} zurueck=${back}`)
}

await testBot('hero-pixel', '.build .bot')
await testBot('agents-pixel', '#agents .bot-pixel')
await testBot('agents-forge', '#agents .bot-forge')
await testBot('term-prompt', '#init .term-bot')

await browser.close()
