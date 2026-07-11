<script setup lang="ts">
const { t } = useI18n()

/* true, sobald das Partikel-Portrait läuft — dann übernimmt der Canvas Duotone + Hover */
const particlesOn = ref(false)
</script>

<template>
  <section id="about" class="section">
    <div class="wrap grid">
      <div
        v-reveal
        class="portrait"
        :class="{ 'canvas-on': particlesOn }"
        tabindex="0"
        :aria-label="t('about.inspectHint')"
      >
        <PortraitParticles src="/img/david.webp" :alt="t('about.alt')" @active="particlesOn = true" />
        <div class="duo" aria-hidden="true" />
        <div class="marquee" aria-hidden="true" />
        <span class="sel" aria-hidden="true">img.portrait</span>
        <span class="dims" aria-hidden="true">900 × 1350</span>
      </div>

      <div v-reveal class="body">
        <p class="eyebrow"><span class="tick">/* about */</span> {{ t('about.eyebrow') }}</p>
        <h2>{{ t('about.title') }}</h2>
        <p class="text">{{ t('about.text') }}</p>
        <ul class="chips">
          <li>{{ t('about.chip1') }}</li>
          <li>{{ t('about.chip2') }}</li>
          <li>{{ t('about.chip3') }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: minmax(280px, 420px) 1fr;
  gap: 48px;
  align-items: center;
}
@media (max-width: 760px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.portrait {
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  cursor: crosshair;
}
.portrait :deep(.pp img) {
  filter: grayscale(0.35) contrast(1.02);
  transition: filter 0.5s ease, opacity 0.3s ease;
}

/* CSS-Duotone: nur Fallback (reduced-motion / bevor der Canvas übernimmt) */
.duo {
  position: absolute;
  inset: 0;
  background: linear-gradient(160deg, rgba(255, 173, 59, 0.3), rgba(11, 15, 26, 0.62) 70%);
  mix-blend-mode: multiply;
  transition: opacity 0.5s ease;
  pointer-events: none;
}
.portrait:hover :deep(.pp img),
.portrait:focus-visible :deep(.pp img) {
  filter: none;
}
.portrait:hover .duo,
.portrait:focus-visible .duo {
  opacity: 0;
}
.portrait.canvas-on .duo {
  display: none;
}
.portrait.canvas-on :deep(.pp img) {
  filter: none;
}

/* DevTools-Inspektion bei Hover */
.marquee {
  position: absolute;
  inset: 10px;
  border: 1.5px dashed var(--amber);
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}
.sel {
  position: absolute;
  left: 10px;
  top: 10px;
  transform: translateY(-45%);
  font-family: var(--font-mono);
  font-size: 11px;
  background: var(--amber);
  color: var(--bg);
  border-radius: 3px;
  padding: 3px 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}
.dims {
  position: absolute;
  right: 14px;
  bottom: 12px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--amber);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}
.portrait:hover .marquee,
.portrait:hover .sel,
.portrait:hover .dims,
.portrait:focus-visible .marquee,
.portrait:focus-visible .sel,
.portrait:focus-visible .dims {
  opacity: 1;
}

.body {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.body h2 {
  font-size: clamp(30px, 4.4vw, 46px);
  font-weight: 700;
  letter-spacing: -0.02em;
  text-transform: uppercase;
}
.text {
  color: var(--muted);
  max-width: 58ch;
}

.chips {
  list-style: none;
  margin: 6px 0 0;
  padding: 0;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.chips li {
  font-family: var(--font-mono);
  font-size: 12.5px;
  color: var(--mint);
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 6px 14px;
}
</style>
