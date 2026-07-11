<script setup lang="ts">
/**
 * Dezentes Partikelfeld im Hero: driftende Punkte in Faint-Blau mit
 * vereinzelten Bernstein-Akzenten, verbunden durch feine Linien.
 * Der Cursor schiebt Partikel sanft weg. Pausiert außerhalb des Viewports,
 * deaktiviert bei prefers-reduced-motion.
 */
const canvasEl = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  const canvas = canvasEl.value
  if (!canvas) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const coarse = window.matchMedia('(pointer: coarse)').matches
  const COUNT = coarse ? 42 : 84
  const LINK_DIST = 110

  interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    r: number
    amber: boolean
  }

  let w = 0
  let h = 0
  let particles: Particle[] = []
  let mx = -9999
  let my = -9999
  let raf = 0

  function resize() {
    const parent = canvas!.parentElement!
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = parent.clientWidth
    h = parent.clientHeight
    canvas!.width = w * dpr
    canvas!.height = h * dpr
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    if (!particles.length) {
      particles = Array.from({ length: COUNT }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1 + Math.random() * 1.3,
        amber: i % 8 === 0,
      }))
    }
  }

  function tick() {
    raf = requestAnimationFrame(tick)
    // außerhalb des Viewports nichts zeichnen
    const rect = canvas!.getBoundingClientRect()
    if (rect.bottom < 0 || rect.top > window.innerHeight) return

    ctx!.clearRect(0, 0, w, h)

    for (const p of particles) {
      p.x += p.vx
      p.y += p.vy
      const dx = p.x - mx
      const dy = p.y - my
      const d2 = dx * dx + dy * dy
      if (d2 < 14400 && d2 > 0.01) {
        const d = Math.sqrt(d2)
        const force = ((120 - d) / 120) * 0.5
        p.x += (dx / d) * force
        p.y += (dy / d) * force
      }
      if (p.x < -10) p.x = w + 10
      if (p.x > w + 10) p.x = -10
      if (p.y < -10) p.y = h + 10
      if (p.y > h + 10) p.y = -10
    }

    ctx!.lineWidth = 1
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i]!
        const b = particles[j]!
        const dx = a.x - b.x
        const dy = a.y - b.y
        const d2 = dx * dx + dy * dy
        if (d2 < LINK_DIST * LINK_DIST) {
          const alpha = (1 - Math.sqrt(d2) / LINK_DIST) * 0.22
          ctx!.strokeStyle = `rgba(92, 107, 138, ${alpha})`
          ctx!.beginPath()
          ctx!.moveTo(a.x, a.y)
          ctx!.lineTo(b.x, b.y)
          ctx!.stroke()
        }
      }
    }

    for (const p of particles) {
      ctx!.fillStyle = p.amber ? 'rgba(255, 173, 59, 0.65)' : 'rgba(147, 161, 188, 0.4)'
      ctx!.beginPath()
      ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx!.fill()
    }
  }

  function onPointer(ev: PointerEvent) {
    const rect = canvas!.getBoundingClientRect()
    mx = ev.clientX - rect.left
    my = ev.clientY - rect.top
  }
  function onLeave() {
    mx = -9999
    my = -9999
  }

  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('pointermove', onPointer, { passive: true })
  document.addEventListener('pointerleave', onLeave)
  raf = requestAnimationFrame(tick)

  onUnmounted(() => {
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', resize)
    window.removeEventListener('pointermove', onPointer)
    document.removeEventListener('pointerleave', onLeave)
  })
})
</script>

<template>
  <canvas ref="canvasEl" class="field" aria-hidden="true" />
</template>

<style scoped>
.field {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
