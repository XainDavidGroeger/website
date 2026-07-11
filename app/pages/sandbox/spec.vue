<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => `${t('sandbox.areas.spec.title')} — David Gröger`,
  description: () => t('sandbox.areas.spec.desc'),
})

/* ------------------------------------------------------------------ */
/*  Spec: Akzeptanzkriterien mit Live-Status                           */
/* ------------------------------------------------------------------ */
type CriterionState = 'pending' | 'failed' | 'done'

const criteria = ref<{ id: string, text: string, state: CriterionState }[]>([])

function resetCriteria() {
  criteria.value = [
    { id: 'AC-1', text: 'available station + supported connector → 201 + receipt', state: 'pending' },
    { id: 'AC-2', text: 'station in maintenance → 422 (stationId)', state: 'pending' },
    { id: 'AC-3', text: 'occupied station → 422 (stationId)', state: 'pending' },
    { id: 'AC-4', text: 'unsupported connector → 422 (connectorType)', state: 'pending' },
    { id: 'AC-5', text: 'estimatedKwh outside 1–150 → 422 (estimatedKwh)', state: 'pending' },
    { id: 'AC-6', text: 'receipt contains estimated cost (price/kwh × kwh + base fee)', state: 'pending' },
  ]
}
resetCriteria()

function setCriteria(ids: string[], state: CriterionState) {
  for (const criterion of criteria.value) {
    if (ids.includes(criterion.id)) criterion.state = state
  }
}

/* ------------------------------------------------------------------ */
/*  Harness-Lauf: Konsole + Kriterien-Sync                             */
/* ------------------------------------------------------------------ */
interface HarnessLine {
  text: string
  kind?: 'cmd' | 'ok' | 'info' | 'warn' | 'fail' | 'done' | 'dim'
  delay?: number
  tick?: string[]
  fail?: string[]
}

const lines: HarnessLine[] = [
  { text: '$ agent-harness run SPEC-042 --loop until-green', kind: 'cmd', delay: 700 },
  { text: '→ reading spec … 6 acceptance criteria · api contract · tech notes', kind: 'info', delay: 600 },
  { text: '', delay: 150 },
  { text: '[iter 1] plan: action + guards + TariffCalculator service', kind: 'warn', delay: 500 },
  { text: '[iter 1] agent:code   implements StartChargingSession', kind: 'dim', delay: 450 },
  { text: '[iter 1] agent:test   derives 6 tests from acceptance criteria', kind: 'dim', delay: 450 },
  { text: '[iter 1] agent:docs   drafts openapi.json from api contract', kind: 'dim', delay: 450 },
  { text: '[iter 1] running suite … 4 passed · 2 failed', kind: 'info', delay: 600, tick: ['AC-1', 'AC-2', 'AC-3', 'AC-5'], fail: ['AC-4', 'AC-6'] },
  { text: '  ✗ AC-4 unsupported connector — got 500, want 422', kind: 'fail', delay: 350 },
  { text: '  ✗ AC-6 estimated cost — base fee missing in calculation', kind: 'fail', delay: 350 },
  { text: '', delay: 200 },
  { text: '[iter 2] agent:code   adds UnsupportedConnectorException guard', kind: 'dim', delay: 500 },
  { text: '[iter 2] agent:code   TariffCalculator: include baseFee()', kind: 'dim', delay: 450 },
  { text: '[iter 2] running suite … 6 passed', kind: 'ok', delay: 600, tick: ['AC-4', 'AC-6'] },
  { text: '', delay: 200 },
  { text: '→ docs: openapi.json in sync with contract ✓', kind: 'info', delay: 350 },
  { text: '→ docs: README + sequence diagram updated ✓', kind: 'info', delay: 350 },
  { text: '', delay: 200 },
  { text: '● SPEC-042 green — 2 iterations · handed to david.review()', kind: 'done', delay: 400 },
]

const shown = ref(0)
const running = ref(false)
const stageEl = ref<HTMLElement | null>(null)
let timer: ReturnType<typeof setTimeout> | null = null
let reduced = false

function step() {
  if (shown.value >= lines.length) {
    running.value = false
    return
  }
  const line = lines[shown.value]!
  if (line.tick) setCriteria(line.tick, 'done')
  if (line.fail) setCriteria(line.fail, 'failed')
  shown.value++
  timer = setTimeout(step, lines[shown.value]?.delay ?? 380)
}

function play() {
  if (timer) clearTimeout(timer)
  resetCriteria()
  if (reduced) {
    shown.value = lines.length
    setCriteria(criteria.value.map(c => c.id), 'done')
    running.value = false
    return
  }
  shown.value = 0
  running.value = true
  timer = setTimeout(step, 400)
}

onMounted(() => {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const io = new IntersectionObserver((entries, obs) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        play()
        obs.disconnect()
      }
    }
  }, { threshold: 0.25 })
  if (stageEl.value) io.observe(stageEl.value)
  onUnmounted(() => {
    io.disconnect()
    if (timer) clearTimeout(timer)
  })
})

const mappings = [
  { from: 'acceptance criteria', toKey: 'mapTests', link: '/sandbox/tests' },
  { from: 'api contract', toKey: 'mapApi', link: '/sandbox/api' },
  { from: 'tech notes', toKey: 'mapCode', link: '/sandbox/code' },
]
</script>

<template>
  <div class="wrap page">
    <div v-reveal class="sec-head">
      <p class="eyebrow">
        <NuxtLinkLocale to="/sandbox" class="crumb">/* voltgrid */</NuxtLinkLocale> → spec
      </p>
      <h2>{{ t('sandbox.spec.title') }}</h2>
      <p class="lede">{{ t('sandbox.spec.lede') }}</p>
    </div>

    <!-- Ablauf-Strip -->
    <div v-reveal class="flow-strip">
      <span class="stage-chip">{{ t('sandbox.spec.flowSpec') }}</span>
      <span class="flow-arrow">→</span>
      <span class="stage-chip mint">{{ t('sandbox.spec.flowLoop') }}</span>
      <span class="flow-arrow">→</span>
      <span class="stage-chip">{{ t('sandbox.spec.flowArtifacts') }}</span>
      <span class="flow-arrow">→</span>
      <span class="stage-chip amber">david.review()</span>
    </div>

    <!-- Split: Spec + Harness -->
    <div ref="stageEl" v-reveal class="split">
      <div class="spec-panel">
        <div class="bar">
          <span class="dots"><i /><i /><i /></span>
          <span class="title">specs/SPEC-042-start-charging-session.md</span>
        </div>
        <div class="spec-body">
          <p class="h1"># SPEC-042 — Start Charging Session</p>
          <p class="meta">status: approved · owner: david · agents: enabled</p>
          <p class="h2">## Goal</p>
          <p class="text">Drivers start a charging session from the app; pricing is estimated upfront and billing can never drift from the live estimate.</p>
          <p class="h2">## Acceptance Criteria</p>
          <ul class="criteria">
            <li v-for="criterion in criteria" :key="criterion.id" :class="criterion.state">
              <span class="box">{{ criterion.state === 'done' ? '✓' : criterion.state === 'failed' ? '✗' : ' ' }}</span>
              <span class="cid">{{ criterion.id }}</span>
              <span>{{ criterion.text }}</span>
            </li>
          </ul>
          <p class="h2">## API Contract</p>
          <p class="text mono">POST /api/v1/sessions {'{'} stationId, connectorType, estimatedKwh {'}'} → 201 | 422</p>
          <p class="h2">## Tech Notes</p>
          <p class="text">pricing single source: TariffCalculator (reused by billing worker) · SessionStarted event → realtime hub</p>
        </div>
      </div>

      <div class="harness">
        <div class="bar">
          <span class="dots"><i /><i /><i /></span>
          <span class="title">~/voltgrid — agent-harness · loop</span>
          <button class="replay" type="button" aria-label="Replay" @click="play">↻ replay</button>
        </div>
        <div class="console">
          <p v-for="(line, i) in lines.slice(0, shown)" :key="i" :class="line.kind ?? 'dim'">{{ line.text }}</p>
          <p v-if="running" class="dim"><span class="caret" /></p>
        </div>
      </div>
    </div>

    <!-- Artefakt-Mapping -->
    <section v-reveal class="mapping">
      <p class="sub">// {{ t('sandbox.spec.mappingTitle') }}</p>
      <div class="map-rows">
        <NuxtLinkLocale v-for="mapping in mappings" :key="mapping.toKey" :to="mapping.link" class="map-row">
          <span class="from">{{ mapping.from }}</span>
          <span class="to-arrow">→</span>
          <span class="to">{{ t(`sandbox.spec.${mapping.toKey}`) }}</span>
          <span class="go">↗</span>
        </NuxtLinkLocale>
      </div>
    </section>

    <!-- Vorteile -->
    <section v-reveal class="benefits">
      <p class="sub">// {{ t('sandbox.spec.benefitsTitle') }}</p>
      <div class="cards">
        <div v-for="n in 4" :key="n" class="card">
          <h3>{{ t(`sandbox.spec.b${n}Title`) }}</h3>
          <p>{{ t(`sandbox.spec.b${n}Text`) }}</p>
        </div>
      </div>
    </section>

    <p v-reveal class="note">{{ t('sandbox.spec.note') }}</p>
  </div>
</template>

<style scoped>
.page {
  padding-block: 110px;
}
.crumb {
  color: var(--amber);
}
.sub {
  font-family: var(--font-mono);
  font-size: 12.5px;
  letter-spacing: 0.06em;
  color: var(--faint);
  margin-bottom: 16px;
}

/* ---------- Flow-Strip ---------- */
.flow-strip {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 26px;
}
.stage-chip {
  font-family: var(--font-mono);
  font-size: 12.5px;
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 7px 16px;
  color: var(--text);
}
.stage-chip.mint {
  color: var(--mint);
  border-color: color-mix(in srgb, var(--mint) 45%, var(--line));
}
.stage-chip.amber {
  color: var(--amber);
  border-color: color-mix(in srgb, var(--amber) 45%, var(--line));
}
.flow-arrow {
  color: var(--faint);
  font-family: var(--font-mono);
}

/* ---------- Split ---------- */
.split {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  gap: 16px;
  align-items: stretch;
}
@media (max-width: 900px) {
  .split {
    grid-template-columns: 1fr;
  }
}

.spec-panel,
.harness {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--bg-deep);
  overflow: hidden;
  display: flex;
  flex-direction: column;
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

/* ---------- Spec-Inhalt ---------- */
.spec-body {
  padding: 18px 20px;
  font-family: var(--font-mono);
  font-size: 12.5px;
  line-height: 1.9;
}
.spec-body .h1 {
  color: var(--text);
  font-weight: 600;
}
.spec-body .meta {
  color: var(--faint);
  margin-bottom: 10px;
}
.spec-body .h2 {
  color: var(--amber);
  margin-top: 14px;
}
.spec-body .text {
  color: var(--muted);
}
.spec-body .mono {
  color: var(--mint);
}

.criteria {
  list-style: none;
  margin: 6px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.criteria li {
  display: grid;
  grid-template-columns: 20px 44px 1fr;
  gap: 8px;
  color: var(--muted);
  transition: color 0.3s ease;
}
.criteria .box {
  display: inline-flex;
  justify-content: center;
  border: 1px solid var(--line);
  border-radius: 3px;
  height: 18px;
  width: 18px;
  line-height: 16px;
  font-size: 11px;
  margin-top: 3px;
  transition: all 0.3s ease;
}
.criteria .cid {
  color: var(--faint);
}
.criteria li.done {
  color: var(--text);
}
.criteria li.done .box {
  border-color: var(--mint);
  color: var(--mint);
}
.criteria li.failed .box {
  border-color: #e06c75;
  color: #e06c75;
}
.criteria li.failed {
  color: #e06c75;
}

/* ---------- Konsole ---------- */
.console {
  padding: 18px 20px;
  font-family: var(--font-mono);
  font-size: 12.5px;
  line-height: 1.95;
  flex: 1;
  min-height: 300px;
  overflow-x: auto;
}
.console p {
  white-space: pre;
  color: var(--muted);
}
.console .cmd {
  color: var(--text);
}
.console .cmd::first-letter {
  color: var(--amber);
}
.console .ok {
  color: var(--mint);
}
.console .info {
  color: var(--faint);
}
.console .warn {
  color: var(--amber);
}
.console .fail {
  color: #e06c75;
}
.console .done {
  color: var(--mint);
}
.console .dim {
  color: var(--muted);
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

/* ---------- Mapping ---------- */
.mapping {
  margin-top: 44px;
}
.map-rows {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.map-row {
  display: grid;
  grid-template-columns: 190px 24px 1fr 24px;
  gap: 10px;
  align-items: center;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--surface);
  padding: 13px 18px;
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: 12.5px;
  transition: border-color 0.2s ease, transform 0.15s ease;
}
.map-row:hover {
  border-color: var(--amber);
  transform: translateY(-1px);
}
.map-row .from {
  color: var(--text);
}
.map-row .to-arrow,
.map-row .go {
  color: var(--amber);
}
@media (max-width: 640px) {
  .map-row {
    grid-template-columns: 1fr 24px;
  }
  .map-row .from {
    grid-column: 1 / -1;
  }
}

/* ---------- Vorteile ---------- */
.benefits {
  margin-top: 44px;
}
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
}
.card {
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--surface);
  padding: 22px 24px;
}
.card h3 {
  font-size: 15.5px;
  font-weight: 700;
  margin-bottom: 8px;
}
.card p {
  color: var(--muted);
  font-size: 14px;
  line-height: 1.7;
}

.note {
  margin-top: 26px;
  font-size: 13.5px;
  color: var(--faint);
}

@media (prefers-reduced-motion: reduce) {
  .caret {
    animation: none;
  }
}
</style>
