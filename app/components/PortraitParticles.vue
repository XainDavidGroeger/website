<script setup lang="ts">
/**
 * Partikel-Portrait: zerlegt das Foto in ein Raster aus „Pixeln“ (Canvas).
 * — Beim ersten Scroll-Kontakt fliegen die Partikel zusammen (Assemble)
 * — Der Cursor schiebt sie auseinander, losgelassen „heilt“ das Bild
 * — Ruhezustand im Nachtblau/Bernstein-Duotone, Hover blendet pro Partikel
 *   zur echten Farbe („source → render“, auf das Foto angewendet)
 * Bei prefers-reduced-motion bleibt das normale <img> samt CSS-Duotone aktiv.
 */
const props = defineProps<{ src: string, alt: string }>()
const emit = defineEmits<{ active: [] }>()

const wrapEl = ref<HTMLDivElement | null>(null)
const canvasEl = ref<HTMLCanvasElement | null>(null)
const active = ref(false)

const GAP = 7
const DUO_DARK = [11, 15, 26] as const // #0B0F1A
const DUO_LIGHT = [255, 173, 59] as const // #FFAD3B

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const wrap = wrapEl.value
  const canvas = canvasEl.value
  if (!wrap || !canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    hx: number
    hy: number
    or: number
    og: number
    ob: number
    dr: number
    dg: number
    db: number
  }

  let particles: Particle[] = []
  let w = 0
  let h = 0
  let mx = -9999
  let my = -9999
  let hoverMix = 1 // 1 = Duotone, 0 = Originalfarben
  let hovering = false
  let assembled = false
  let raf = 0

  const img = new Image()
  img.src = props.src

  function build() {
    w = wrap!.clientWidth
    h = wrap!.clientHeight
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas!.width = w * dpr
    canvas!.height = h * dpr
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

    const cols = Math.max(1, Math.floor(w / GAP))
    const rows = Math.max(1, Math.floor(h / GAP))
    const off = document.createElement('canvas')
    off.width = cols
    off.height = rows
    const octx = off.getContext('2d')!
    // cover-crop des Fotos auf das Zellenraster
    const scale = Math.max(cols / img.naturalWidth, rows / img.naturalHeight)
    const dw = img.naturalWidth * scale
    const dh = img.naturalHeight * scale
    octx.drawImage(img, (cols - dw) / 2, (rows - dh) / 2, dw, dh)
    const data = octx.getImageData(0, 0, cols, rows).data

    const keepPositions = particles.length > 0
    const old = particles
    particles = []
    let i = 0
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const px = (row * cols + col) * 4
        const or_ = data[px]!
        const og = data[px + 1]!
        const ob = data[px + 2]!
        const lum = (0.2126 * or_ + 0.7152 * og + 0.0722 * ob) / 255
        const prev = keepPositions ? old[i] : undefined
        particles.push({
          x: prev ? prev.x : w / 2 + (Math.random() - 0.5) * w * 2.4,
          y: prev ? prev.y : h / 2 + (Math.random() - 0.5) * h * 2.4,
          vx: 0,
          vy: 0,
          hx: col * GAP + GAP / 2,
          hy: row * GAP + GAP / 2,
          or: or_,
          og,
          ob,
          dr: DUO_DARK[0] + (DUO_LIGHT[0] - DUO_DARK[0]) * lum,
          dg: DUO_DARK[1] + (DUO_LIGHT[1] - DUO_DARK[1]) * lum,
          db: DUO_DARK[2] + (DUO_LIGHT[2] - DUO_DARK[2]) * lum,
        })
        i++
      }
    }
  }

  function tick() {
    raf = requestAnimationFrame(tick)
    if (!assembled) return
    const rect = canvas!.getBoundingClientRect()
    if (rect.bottom < 0 || rect.top > window.innerHeight) return

    hoverMix += ((hovering ? 0 : 1) - hoverMix) * 0.08

    ctx!.clearRect(0, 0, w, h)
    const size = GAP - 1.4
    const mixing = hoverMix > 0.01 && hoverMix < 0.99
    for (const p of particles) {
      p.vx += (p.hx - p.x) * 0.055
      p.vy += (p.hy - p.y) * 0.055
      const dx = p.x - mx
      const dy = p.y - my
      const d2 = dx * dx + dy * dy
      if (d2 < 5625 && d2 > 0.01) {
        const d = Math.sqrt(d2)
        const force = ((75 - d) / 75) * 3.2
        p.vx += (dx / d) * force
        p.vy += (dy / d) * force
      }
      p.vx *= 0.8
      p.vy *= 0.8
      p.x += p.vx
      p.y += p.vy

      if (mixing) {
        const r = p.or + (p.dr - p.or) * hoverMix
        const g = p.og + (p.dg - p.og) * hoverMix
        const b = p.ob + (p.db - p.ob) * hoverMix
        ctx!.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`
      }
      else if (hoverMix >= 0.99) {
        ctx!.fillStyle = `rgb(${p.dr | 0},${p.dg | 0},${p.db | 0})`
      }
      else {
        ctx!.fillStyle = `rgb(${p.or},${p.og},${p.ob})`
      }
      ctx!.fillRect(p.x - size / 2, p.y - size / 2, size, size)
    }
  }

  function onPointerMove(ev: PointerEvent) {
    const rect = canvas!.getBoundingClientRect()
    mx = ev.clientX - rect.left
    my = ev.clientY - rect.top
  }
  function onEnter() {
    hovering = true
  }
  function onLeave() {
    hovering = false
    mx = -9999
    my = -9999
  }

  let resizeTimer: ReturnType<typeof setTimeout> | null = null
  function onResize() {
    if (resizeTimer) clearTimeout(resizeTimer)
    resizeTimer = setTimeout(build, 200)
  }

  function init() {
    build()
    active.value = true
    emit('active')
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          assembled = true
          io.disconnect()
        }
      }
    }, { threshold: 0.25 })
    io.observe(wrap!)

    wrap!.addEventListener('pointermove', onPointerMove)
    wrap!.addEventListener('pointerenter', onEnter)
    wrap!.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', onResize)
    raf = requestAnimationFrame(tick)
  }

  // onload statt decode(): feuert unabhängig von der Render-Pipeline;
  // bei Fehlern bleibt das <img>-Fallback einfach sichtbar
  if (img.complete && img.naturalWidth > 0) init()
  else img.onload = init

  onUnmounted(() => {
    cancelAnimationFrame(raf)
    wrap?.removeEventListener('pointermove', onPointerMove)
    wrap?.removeEventListener('pointerenter', onEnter)
    wrap?.removeEventListener('pointerleave', onLeave)
    window.removeEventListener('resize', onResize)
  })
})
</script>

<template>
  <div ref="wrapEl" class="pp" :class="{ active }">
    <img :src="src" :alt="alt" width="900" height="1350" loading="lazy">
    <canvas ref="canvasEl" aria-hidden="true" />
  </div>
</template>

<style scoped>
.pp {
  position: relative;
  aspect-ratio: 2 / 3;
  overflow: hidden;
}
.pp img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.pp canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.pp.active img {
  opacity: 0;
}
.pp.active canvas {
  opacity: 1;
}
</style>
