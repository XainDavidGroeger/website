<script setup lang="ts">
/**
 * Build-Panel rechts im Hero: „kompiliert“ die Seite Zeile für Zeile
 * (Erfahrung, Plattformen, Stack, Crew → build successful).
 * Pixel schwebt daneben und zeigt aufs Panel. Dezenter Cursor-Parallax.
 */
const { t } = useI18n()

const lines = computed(() => [
  { text: t('hero.build.cmd'), kind: 'cmd' },
  { text: t('hero.build.l1'), kind: 'ok' },
  { text: t('hero.build.l2'), kind: 'ok' },
  { text: t('hero.build.l3'), kind: 'ok' },
  { text: t('hero.build.l4'), kind: 'ok' },
  { text: t('hero.build.done'), kind: 'done' },
])

const shown = ref(0)
const panelEl = ref<HTMLElement | null>(null)

onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) {
    shown.value = lines.value.length
    return
  }
  let i = 0
  const timer = setInterval(() => {
    shown.value = ++i
    if (i >= lines.value.length) clearInterval(timer)
  }, 520)

  // dezenter Parallax zum Cursor (nur Maus-Geräte)
  if (window.matchMedia('(pointer: fine)').matches) {
    const onMove = (ev: PointerEvent) => {
      if (!panelEl.value) return
      const x = (ev.clientX / window.innerWidth - 0.5) * -10
      const y = (ev.clientY / window.innerHeight - 0.5) * -7
      panelEl.value.style.transform = `translate(${x}px, ${y}px)`
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    onUnmounted(() => window.removeEventListener('pointermove', onMove))
  }
})
</script>

<template>
  <div class="build" aria-hidden="true">
    <div ref="panelEl" class="panel-wrap">
      <img class="bot" src="/img/crew/pixel-2.webp" alt="" height="120">
      <div class="panel">
        <div class="bar">
          <span class="dots"><i /><i /><i /></span>
          <span class="title">~/david-webdev · build</span>
        </div>
        <div class="body">
          <p
            v-for="(line, i) in lines"
            :key="line.kind + i"
            v-show="i < shown"
            :class="line.kind"
          >
            {{ line.text }}<span v-if="i === shown - 1 && shown < lines.length" class="caret" />
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.build {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.panel-wrap {
  position: relative;
  width: min(400px, 100%);
  transition: transform 0.35s ease-out;
  animation: panel-float 5.2s ease-in-out infinite;
}
@keyframes panel-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-9px);
  }
}

.bot {
  position: absolute;
  left: -82px;
  bottom: 66px;
  height: 96px;
  width: auto;
  z-index: 2;
  animation: bot-float 3.6s ease-in-out infinite;
  filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.45));
}
@keyframes bot-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.panel {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: color-mix(in srgb, var(--bg-deep) 88%, transparent);
  backdrop-filter: blur(4px);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.45);
  overflow: hidden;
}

.bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-bottom: 1px solid var(--line);
}
.dots {
  display: flex;
  gap: 5px;
}
.dots i {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--line);
}
.bar .title {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--faint);
}

.body {
  padding: 16px 18px;
  font-family: var(--font-mono);
  font-size: 12.5px;
  line-height: 2.05;
  min-height: 178px;
}
.body p {
  color: var(--muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.body .cmd {
  color: var(--text);
}
.body .ok {
  color: var(--muted);
}
.body .ok::first-letter {
  color: var(--mint);
}
.body .done {
  color: var(--mint);
}

.caret {
  display: inline-block;
  width: 0.55em;
  height: 1.05em;
  background: var(--amber);
  vertical-align: text-bottom;
  margin-left: 3px;
  animation: blink 1s steps(1) infinite;
}
@keyframes blink {
  50% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .panel-wrap,
  .bot,
  .caret {
    animation: none;
  }
}
</style>
