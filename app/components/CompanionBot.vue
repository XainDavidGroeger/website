<script setup lang="ts">
/**
 * Idle, der Companion: klebt unten rechts, schläft bei Inaktivität,
 * wacht beim Scrollen auf und gibt per Klick einen Tipp zur aktuellen Sektion.
 * Posen: 1 schläft · 2 schreckt hoch · 5 kaffee · 6 salutiert
 * Versteckt sich in der Kontakt-Sektion — dort arbeitet schon Prompt (max. 1 Bot im Bild).
 */
const { t } = useI18n()

const pose = ref(1)
const hidden = ref(false)
const bubbleText = ref('')
const bubbleShow = ref(false)

let poseTimer: ReturnType<typeof setTimeout> | null = null
let sleepTimer: ReturnType<typeof setTimeout> | null = null
let bubbleTimer: ReturnType<typeof setTimeout> | null = null
let ticking = false

const sectionIds = ['about', 'stack', 'agents', 'log', 'work', 'refs', 'init']

function currentSection(): string {
  const y = window.scrollY + window.innerHeight * 0.35
  let current = 'hero'
  for (const id of sectionIds) {
    const el = document.getElementById(id)
    if (el && el.offsetTop <= y) current = id
  }
  return current
}

function scheduleSleep(ms: number) {
  if (sleepTimer) clearTimeout(sleepTimer)
  sleepTimer = setTimeout(() => {
    pose.value = 1
  }, ms)
}

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    ticking = false
    hidden.value = currentSection() === 'init'
    if (pose.value === 1) {
      pose.value = 2
      if (poseTimer) clearTimeout(poseTimer)
      poseTimer = setTimeout(() => {
        pose.value = 5
      }, 900)
    }
    scheduleSleep(9000)
  })
}

function onClick() {
  const section = currentSection()
  const key = section === 'init' ? 'work' : section
  bubbleText.value = t(`companion.tips.${key}`)
  bubbleShow.value = true
  pose.value = 6
  if (bubbleTimer) clearTimeout(bubbleTimer)
  bubbleTimer = setTimeout(() => {
    bubbleShow.value = false
    pose.value = 5
  }, 4200)
  scheduleSleep(11000)
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  ;[poseTimer, sleepTimer, bubbleTimer].forEach(timer => timer && clearTimeout(timer))
})
</script>

<template>
  <div class="companion" :class="{ hidden }">
    <Transition name="bubble" :duration="260">
      <div v-if="bubbleShow" class="bubble">{{ bubbleText }}</div>
    </Transition>
    <button type="button" :aria-label="t('companion.aria')" @click="onClick">
      <img :src="`/img/crew/idle-${pose}.webp`" alt="" height="58">
    </button>
  </div>
</template>

<style scoped>
.companion {
  position: fixed;
  right: 18px;
  bottom: 14px;
  z-index: 40;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease;
}
.companion.hidden {
  transform: translateY(140%);
  opacity: 0;
  pointer-events: none;
}

.companion button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  line-height: 0;
  filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.45));
}
.companion img {
  height: 58px;
  width: auto;
  transition: transform 0.2s ease;
}
.companion button:hover img {
  transform: scale(1.08);
}
.companion button:focus-visible {
  outline: 2px solid var(--mint);
  outline-offset: 3px;
  border-radius: 8px;
}

.bubble {
  max-width: 220px;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.55;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 8px 8px 2px 8px;
  padding: 9px 12px;
  color: var(--muted);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
}

.bubble-enter-active,
.bubble-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.bubble-enter-from,
.bubble-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

@media (max-width: 640px) {
  .companion img {
    height: 48px;
  }
}
</style>
