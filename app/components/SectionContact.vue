<script setup lang="ts">
const { t } = useI18n()

interface TermLine {
  cmd?: string
  res?: string
  ok?: boolean
}

const input = ref('')
const outEl = ref<HTMLElement | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)
const lines = ref<TermLine[]>([])

onMounted(() => {
  lines.value = [{ cmd: 'motd' }, { res: t('term.motd') }]
})

const commands = computed<Record<string, string>>(() => ({
  'help': t('term.help'),
  'stack': t('term.stackOut'),
  [t('term.logCmd')]: t('term.logOut'),
  [t('term.contactCmd')]: t('term.contactOut'),
  'sudo hire-david': t('term.sudoOut'),
  'startx': t('term.startxOut'),
}))

function run() {
  const value = input.value.trim()
  input.value = ''
  if (!value) return
  const key = value.toLowerCase()
  if (key === 'clear') {
    lines.value = []
    return
  }
  const res = commands.value[key]
  lines.value.push({
    cmd: value,
    res: res ?? t('term.notFound', { cmd: value }),
    ok: key === 'sudo hire-david',
  })
  nextTick(() => {
    outEl.value?.scrollTo({ top: outEl.value.scrollHeight })
  })
}
</script>

<template>
  <section id="init" class="section">
    <div class="wrap">
      <div v-reveal class="sec-head">
        <p class="eyebrow"><span class="tick">/* init */</span> $ new-project --with david</p>
        <h2>{{ t('contact.title') }}</h2>
        <p class="lede">{{ t('contact.lede') }}</p>
      </div>

      <div class="grid">
        <div v-reveal class="term" @click="inputEl?.focus()">
          <div ref="outEl" class="term-out">
            <template v-for="(line, i) in lines" :key="i">
              <div v-if="line.cmd">
                <span class="p">{{ t('term.prompt') }}</span>:~$ {{ line.cmd }}
              </div>
              <div v-if="line.res" :class="line.ok ? 'ok' : 'dim'">{{ line.res }}</div>
            </template>
          </div>
          <div class="term-line">
            <span class="p">{{ t('term.prompt') }}</span>:~$
            <input
              ref="inputEl"
              v-model="input"
              type="text"
              autocomplete="off"
              spellcheck="false"
              :aria-label="t('term.inputLabel')"
              @keydown.enter="run"
            >
          </div>
        </div>

        <div v-reveal class="card">
          <h3>{{ t('contact.direct') }}</h3>
          <a class="row" href="mailto:groeger.david@gmail.com">
            <span class="k">email</span> groeger.david@gmail.com
          </a>
          <a class="row" href="tel:+491741691490">
            <span class="k">{{ t('contact.mobile') }}</span> 0174 169 149 0
          </a>
          <a class="row" href="/david_groeger_lebenslauf.pdf" target="_blank" rel="noopener">
            <span class="k">cv</span> {{ t('contact.cv') }}
          </a>
          <p class="note">{{ t('contact.note') }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 18px;
  align-items: stretch;
}
@media (max-width: 760px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.term {
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--bg-deep);
  font-family: var(--font-mono);
  font-size: 13.5px;
  line-height: 1.8;
  padding: 18px 20px;
  cursor: text;
  display: flex;
  flex-direction: column;
  min-height: 280px;
}

.term-out {
  flex: 1;
  max-height: 300px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--muted);
}

.term .p {
  color: var(--amber);
}
.term .dim {
  color: var(--faint);
}
.term .ok {
  color: var(--mint);
}

.term-line {
  display: flex;
  align-items: baseline;
  color: var(--muted);
}
.term-line input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font: inherit;
  color: var(--text);
  caret-color: var(--amber);
  padding: 0;
  margin-left: 8px;
}

.card {
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--surface);
  padding: 26px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.card h3 {
  font-size: 17px;
  font-weight: 600;
  margin-bottom: 4px;
}
.row {
  font-family: var(--font-mono);
  font-size: 13.5px;
  color: var(--text);
  border: 1px solid var(--line);
  border-radius: 5px;
  padding: 12px 16px;
  transition: border-color 0.2s ease, transform 0.15s ease;
}
.row:hover {
  border-color: var(--amber);
  transform: translateY(-2px);
}
.row .k {
  color: var(--amber);
  margin-right: 10px;
}
.note {
  font-size: 13.5px;
  color: var(--faint);
  margin-top: auto;
}
</style>
