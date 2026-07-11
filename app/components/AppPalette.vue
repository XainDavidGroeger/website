<script setup lang="ts">
const { t, locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const localePath = useLocalePath()
const { toggle: toggleTheme } = useTheme()

const open = useState('palette-open', () => false)
const query = ref('')
const active = ref(0)
const inputEl = ref<HTMLInputElement | null>(null)

const otherLocale = computed(() => locales.value.find(l => l.code !== locale.value))

interface PaletteItem {
  id: string
  label: string
  hint: string
  action: () => void
}

function goTo(hash: string) {
  const el = document.querySelector(hash)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
  // von Unterseiten (z. B. /sandbox) zurück zur Startseite mit Anker
  else navigateTo(`${localePath('/')}${hash}`)
}

const items = computed<PaletteItem[]>(() => [
  { id: 'work', label: t('palette.work'), hint: 'P', action: () => goTo('#work') },
  { id: 'agents', label: t('palette.agents'), hint: 'K', action: () => goTo('#agents') },
  { id: 'log', label: t('palette.log'), hint: 'W', action: () => goTo('#log') },
  { id: 'about', label: t('palette.about'), hint: 'A', action: () => goTo('#about') },
  { id: 'contact', label: t('palette.contact'), hint: '↵', action: () => goTo('#init') },
  { id: 'sandbox', label: t('palette.sandbox'), hint: 'S', action: () => navigateTo(localePath('/sandbox')) },
  { id: 'theme', label: t('palette.theme'), hint: 'T', action: () => toggleTheme() },
  {
    id: 'lang',
    label: t('palette.lang'),
    hint: 'L',
    action: () => {
      if (otherLocale.value) navigateTo(switchLocalePath(otherLocale.value.code))
    },
  },
  { id: 'cv', label: t('palette.cv'), hint: 'C', action: () => window.open('/david_groeger_lebenslauf.pdf', '_blank') },
])

const filtered = computed(() =>
  items.value.filter(item => item.label.toLowerCase().includes(query.value.trim().toLowerCase())),
)

function close() {
  open.value = false
}

function run(item: PaletteItem) {
  close()
  item.action()
}

function onKey(ev: KeyboardEvent) {
  if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'k') {
    ev.preventDefault()
    open.value = !open.value
    return
  }
  if (ev.key === 'Escape' && open.value) close()
}

function onListKey(ev: KeyboardEvent) {
  if (ev.key === 'ArrowDown') {
    ev.preventDefault()
    active.value = (active.value + 1) % filtered.value.length
  }
  else if (ev.key === 'ArrowUp') {
    ev.preventDefault()
    active.value = (active.value - 1 + filtered.value.length) % filtered.value.length
  }
  else if (ev.key === 'Enter') {
    ev.preventDefault()
    const item = filtered.value[active.value]
    if (item) run(item)
  }
}

watch(open, (value) => {
  if (value) {
    query.value = ''
    active.value = 0
    nextTick(() => inputEl.value?.focus())
  }
})

watch(query, () => {
  active.value = 0
})

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <Transition name="palette" :duration="200">
      <div v-if="open" class="overlay" @click.self="close">
        <div class="palette" role="dialog" :aria-label="t('palette.aria')">
          <div class="search">
            <span class="chev">❯</span>
            <input
              ref="inputEl"
              v-model="query"
              type="text"
              :placeholder="t('palette.placeholder')"
              :aria-label="t('palette.placeholder')"
              autocomplete="off"
              spellcheck="false"
              @keydown="onListKey"
            >
            <kbd>esc</kbd>
          </div>
          <ul>
            <li
              v-for="(item, i) in filtered"
              :key="item.id"
              :class="{ active: i === active }"
              @mouseenter="active = i"
              @click="run(item)"
            >
              <span>{{ item.label }}</span>
              <kbd>{{ item.hint }}</kbd>
            </li>
            <li v-if="!filtered.length" class="empty">{{ t('palette.empty') }}</li>
          </ul>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: color-mix(in srgb, var(--bg-deep) 55%, transparent);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  padding-top: 16vh;
}

.palette {
  width: min(560px, calc(100vw - 32px));
  height: fit-content;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--bg-deep);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.search {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 18px;
  border-bottom: 1px solid var(--line);
  font-family: var(--font-mono);
}
.search .chev {
  color: var(--amber);
}
.search input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font: inherit;
  font-size: 14px;
  color: var(--text);
  caret-color: var(--amber);
}

kbd {
  font-family: var(--font-mono);
  font-size: 11px;
  border: 1px solid var(--line);
  border-radius: 4px;
  padding: 2px 7px;
  color: var(--faint);
  background: var(--surface);
}

.palette ul {
  list-style: none;
  margin: 0;
  padding: 8px;
  max-height: 320px;
  overflow-y: auto;
}
.palette li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 11px 12px;
  border-radius: 5px;
  font-size: 14px;
  color: var(--muted);
  cursor: pointer;
}
.palette li.active {
  background: var(--amber-dim);
  color: var(--text);
}
.palette li.active kbd {
  color: var(--amber);
  border-color: var(--amber);
}
.palette li.empty {
  cursor: default;
  color: var(--faint);
  font-family: var(--font-mono);
  font-size: 13px;
}

.palette-enter-active,
.palette-leave-active {
  transition: opacity 0.18s ease;
}
.palette-enter-from,
.palette-leave-to {
  opacity: 0;
}
</style>
