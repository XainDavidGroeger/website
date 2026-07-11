<script setup lang="ts">
/**
 * Spielt Konsolen-Output demonstrativ ab: Zeilen erscheinen nacheinander,
 * sobald der Player im Viewport ist. Mit Replay-Button; bei
 * prefers-reduced-motion steht alles sofort da.
 */
export interface ConsoleLine {
  text: string
  kind?: 'cmd' | 'ok' | 'info' | 'warn' | 'fail' | 'done' | 'dim'
  delay?: number
}

const props = withDefaults(defineProps<{
  title?: string
  lines: ConsoleLine[]
  autoplay?: boolean
}>(), {
  title: '~/console',
  autoplay: true,
})

const shown = ref(0)
const running = ref(false)
const rootEl = ref<HTMLElement | null>(null)
let timer: ReturnType<typeof setTimeout> | null = null
let reduced = false

function step() {
  if (shown.value >= props.lines.length) {
    running.value = false
    return
  }
  shown.value++
  const next = props.lines[shown.value]
  timer = setTimeout(step, next?.delay ?? 380)
}

function play() {
  if (timer) clearTimeout(timer)
  if (reduced) {
    shown.value = props.lines.length
    running.value = false
    return
  }
  shown.value = 0
  running.value = true
  timer = setTimeout(step, 350)
}

onMounted(() => {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced || !props.autoplay) {
    shown.value = reduced ? props.lines.length : 0
    if (!reduced && props.autoplay === false) return
  }
  const io = new IntersectionObserver((entries, obs) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        play()
        obs.disconnect()
      }
    }
  }, { threshold: 0.3 })
  if (rootEl.value) io.observe(rootEl.value)
  onUnmounted(() => {
    io.disconnect()
    if (timer) clearTimeout(timer)
  })
})
</script>

<template>
  <div ref="rootEl" class="player">
    <div class="bar">
      <span class="dots"><i /><i /><i /></span>
      <span class="title">{{ title }}</span>
      <button class="replay" type="button" aria-label="Replay" @click="play">↻ replay</button>
    </div>
    <div class="body">
      <p v-for="(line, i) in lines.slice(0, shown)" :key="i" :class="line.kind ?? 'dim'">
        {{ line.text }}
      </p>
      <p v-if="running" class="dim"><span class="caret" /></p>
    </div>
  </div>
</template>

<style scoped>
.player {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--bg-deep);
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
.replay {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 11.5px;
  background: none;
  border: 1px solid var(--line);
  border-radius: 4px;
  color: var(--muted);
  padding: 4px 10px;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease;
}
.replay:hover {
  color: var(--amber);
  border-color: var(--amber);
}

.body {
  padding: 18px 20px;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.95;
  min-height: 220px;
  overflow-x: auto;
}
.body p {
  white-space: pre;
  color: var(--muted);
}
.body .cmd {
  color: var(--text);
}
.body .cmd::first-letter {
  color: var(--amber);
}
.body .ok {
  color: var(--muted);
}
.body .ok::first-letter {
  color: var(--mint);
}
.body .info {
  color: var(--faint);
}
.body .warn {
  color: var(--amber);
}
.body .fail {
  color: #e06c75;
}
.body .done {
  color: var(--mint);
}
.body .dim {
  color: var(--faint);
}

.caret {
  display: inline-block;
  width: 0.55em;
  height: 1.05em;
  background: var(--amber);
  vertical-align: text-bottom;
  animation: blink 1s steps(1) infinite;
}
@keyframes blink {
  50% {
    opacity: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .caret {
    animation: none;
  }
}
</style>
