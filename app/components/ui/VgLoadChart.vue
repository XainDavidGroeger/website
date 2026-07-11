<script setup lang="ts">
withDefaults(defineProps<{
  label?: string
  value?: string
}>(), {
  label: 'netzlast · 24h',
  value: '4,2 MW peak',
})

/* feste, plausible kW-Kurve (24 Stützpunkte = 24 Stunden) */
const points = [12, 10, 8, 7, 7, 9, 18, 34, 46, 52, 55, 58, 54, 50, 48, 52, 60, 72, 78, 74, 58, 40, 26, 16]
const max = 80
const width = 560
const height = 120

const path = points
  .map((p, i) => `${i === 0 ? 'M' : 'L'} ${(i / (points.length - 1)) * width} ${height - (p / max) * height}`)
  .join(' ')
const area = `${path} L ${width} ${height} L 0 ${height} Z`
</script>

<template>
  <div class="vg-chart">
    <header>
      <p class="label">{{ label }}</p>
      <p class="value">{{ value }}</p>
    </header>
    <svg :viewBox="`0 0 ${width} 140`" preserveAspectRatio="none" aria-hidden="true">
      <line v-for="y in 3" :key="y" x1="0" :y1="(y * 120) / 4" x2="560" :y2="(y * 120) / 4" class="grid" />
      <path :d="area" class="area" />
      <path :d="path" class="line" />
      <circle :cx="(18 / 23) * 560" :cy="120 - (78 / 80) * 120" r="4" class="peak" />
    </svg>
    <footer>
      <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span>
    </footer>
  </div>
</template>

<style scoped>
.vg-chart {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 18px 20px 14px;
}
.vg-chart header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 12px;
}
.label {
  font-family: var(--font-mono);
  font-size: 11.5px;
  letter-spacing: 0.06em;
  color: var(--faint);
}
.value {
  font-family: var(--font-mono);
  font-size: 12.5px;
  color: var(--amber);
}
svg {
  display: block;
  width: 100%;
  height: 120px;
}
.grid {
  stroke: var(--line);
  stroke-width: 1;
  stroke-dasharray: 3 6;
}
.line {
  fill: none;
  stroke: var(--mint);
  stroke-width: 2;
}
.area {
  fill: color-mix(in srgb, var(--mint) 12%, transparent);
  stroke: none;
}
.peak {
  fill: var(--amber);
}
.vg-chart footer {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 10.5px;
  color: var(--faint);
  margin-top: 6px;
}
</style>
