<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => `${t('sandbox.areas.ui.title')} · David Gröger`,
  description: () => t('sandbox.areas.ui.desc'),
})

/* ------------------------------------------------------------------ */
/*  Composer: aus Bausteinen ein VoltGrid-Dashboard zusammenbauen      */
/* ------------------------------------------------------------------ */
type BlockKind = 'headline' | 'stats' | 'chart' | 'station' | 'stationRow' | 'actions' | 'terminal'

interface Block {
  uid: number
  kind: BlockKind
}

const blockDefs: { kind: BlockKind, code: string }[] = [
  { kind: 'headline', code: '<VgPageHead title="…" />' },
  { kind: 'stats', code: '<VgStatTile v-for="kpi in kpis" … />' },
  { kind: 'chart', code: '<VgLoadChart :series="load24h" />' },
  { kind: 'station', code: '<VgStationCard :station="station" />' },
  { kind: 'stationRow', code: '<VgStationCard v-for="s in stations" … />' },
  { kind: 'actions', code: '<DgButton>…</DgButton> <DgButton variant="ghost">…</DgButton>' },
  { kind: 'terminal', code: '<DgWindow title="~/voltgrid · events">…</DgWindow>' },
]

let nextUid = 1
const canvas = ref<Block[]>([
  { uid: nextUid++, kind: 'headline' },
  { uid: nextUid++, kind: 'stats' },
  { uid: nextUid++, kind: 'chart' },
  { uid: nextUid++, kind: 'station' },
])

function addBlock(kind: BlockKind) {
  canvas.value.push({ uid: nextUid++, kind })
}
function removeBlock(uid: number) {
  canvas.value = canvas.value.filter(b => b.uid !== uid)
}
function moveBlock(uid: number, dir: -1 | 1) {
  const i = canvas.value.findIndex(b => b.uid === uid)
  const j = i + dir
  if (i < 0 || j < 0 || j >= canvas.value.length) return
  const copy = [...canvas.value]
  const a = copy[i]!
  copy[i] = copy[j]!
  copy[j] = a
  canvas.value = copy
}

const generatedCode = computed(() => {
  const inner = canvas.value
    .map(b => `  ${blockDefs.find(d => d.kind === b.kind)!.code}`)
    .join('\n')
  return `<template>\n${inner || '  <!-- leer -->'}\n</template>`
})
</script>

<template>
  <div class="wrap page">
    <div v-reveal class="sec-head">
      <p class="eyebrow">
        <NuxtLinkLocale to="/sandbox" class="crumb">/* voltgrid */</NuxtLinkLocale> → ui-kit
      </p>
      <h2>{{ t('sandbox.ui.title') }}</h2>
      <p class="lede">{{ t('sandbox.ui.lede') }}</p>
    </div>

    <!-- Galerie: die Bausteine, so wie sie auf der Seite aussehen -->
    <section v-reveal class="gallery">
      <p class="sub">// {{ t('sandbox.ui.galleryTitle') }}</p>
      <div class="gallery-grid">
        <div class="cell">
          <p class="cell-name">&lt;DgButton /&gt;</p>
          <div class="cell-stage">
            <DgButton>→ laden</DgButton>
            <DgButton variant="ghost">abbrechen</DgButton>
          </div>
        </div>
        <div class="cell">
          <p class="cell-name">&lt;DgTag /&gt;</p>
          <div class="cell-stage">
            <DgTag color="mint">● frei</DgTag>
            <DgTag color="amber">● lädt</DgTag>
            <DgTag color="muted">● wartung</DgTag>
          </div>
        </div>
        <div class="cell">
          <p class="cell-name">&lt;VgStatTile /&gt;</p>
          <div class="cell-stage">
            <VgStatTile :label="t('sandbox.ui.kpiSessions')" value="312" delta="+12 %" />
          </div>
        </div>
        <div class="cell wide">
          <p class="cell-name">&lt;VgStationCard /&gt; <span class="dim">{{ t('sandbox.ui.composed') }}</span></p>
          <div class="cell-stage">
            <VgStationCard />
          </div>
        </div>
        <div class="cell wide">
          <p class="cell-name">&lt;VgLoadChart /&gt;</p>
          <div class="cell-stage block">
            <VgLoadChart />
          </div>
        </div>
      </div>
    </section>

    <!-- Composer -->
    <section v-reveal class="composer">
      <p class="sub">// {{ t('sandbox.ui.composerTitle') }}</p>
      <p class="composer-lede">{{ t('sandbox.ui.composerLede') }}</p>

      <div class="composer-grid">
        <aside class="palette-col">
          <p class="col-head">{{ t('sandbox.ui.blocks') }}</p>
          <button
            v-for="def in blockDefs"
            :key="def.kind"
            class="block-btn"
            type="button"
            @click="addBlock(def.kind)"
          >
            <span class="plus">+</span> {{ t(`sandbox.ui.block.${def.kind}`) }}
          </button>
        </aside>

        <div class="canvas">
          <p class="col-head">{{ t('sandbox.ui.canvas') }} <span class="dim">({{ canvas.length }})</span></p>
          <TransitionGroup name="blk" tag="div" class="canvas-inner" :duration="250">
            <div v-for="block in canvas" :key="block.uid" class="blk">
              <div class="blk-tools">
                <span class="blk-name">{{ t(`sandbox.ui.block.${block.kind}`) }}</span>
                <button type="button" :aria-label="t('sandbox.ui.moveUp')" @click="moveBlock(block.uid, -1)">↑</button>
                <button type="button" :aria-label="t('sandbox.ui.moveDown')" @click="moveBlock(block.uid, 1)">↓</button>
                <button type="button" class="del" :aria-label="t('sandbox.ui.remove')" @click="removeBlock(block.uid)">✕</button>
              </div>

              <!-- Block-Renderings -->
              <div v-if="block.kind === 'headline'" class="b-headline">
                <p class="eyebrow"><span class="tick">/* voltgrid */</span> {{ t('sandbox.ui.demoEyebrow') }}</p>
                <h3>{{ t('sandbox.ui.demoTitle') }}</h3>
              </div>
              <div v-else-if="block.kind === 'stats'" class="b-stats">
                <VgStatTile :label="t('sandbox.ui.kpiSessions')" value="312" delta="+12 %" />
                <VgStatTile :label="t('sandbox.ui.kpiStations')" value="2.418" delta="+38" />
                <VgStatTile :label="t('sandbox.ui.kpiUptime')" value="99,2 %" delta="−0,1 %" delta-color="amber" />
              </div>
              <VgLoadChart v-else-if="block.kind === 'chart'" />
              <div v-else-if="block.kind === 'station'" class="b-station">
                <VgStationCard />
              </div>
              <div v-else-if="block.kind === 'stationRow'" class="b-station-row">
                <VgStationCard name="Parkhaus Mitte" city="Berlin" status="charging" :connectors="['CCS · 300 kW']" price="0,59 € / kWh" />
                <VgStationCard name="Rewe Südring" city="Köln" :connectors="['Typ2 · 22 kW']" price="0,39 € / kWh" />
              </div>
              <div v-else-if="block.kind === 'actions'" class="b-actions">
                <DgButton>→ {{ t('sandbox.ui.demoCta') }}</DgButton>
                <DgButton variant="ghost">{{ t('sandbox.ui.demoCta2') }}</DgButton>
              </div>
              <DgWindow v-else-if="block.kind === 'terminal'" title="~/voltgrid · events">
                <p>21:14:03 station#2 → session chg_a81x gestartet (CCS · 300 kW)</p>
                <p>21:14:41 station#6 → 74 % geladen · 18,2 kWh</p>
                <p>21:15:09 station#4 → wartung gemeldet · ticket #4711</p>
              </DgWindow>
            </div>
          </TransitionGroup>
          <p v-if="!canvas.length" class="empty">{{ t('sandbox.ui.empty') }}</p>
        </div>
      </div>

      <pre class="code">{{ generatedCode }}</pre>
    </section>

    <p v-reveal class="note">{{ t('sandbox.ui.note') }}</p>
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
.dim {
  color: var(--faint);
  font-weight: 400;
}

/* ---------- Galerie ---------- */
.gallery {
  margin-bottom: 56px;
}
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 14px;
}
.cell {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
  padding: 16px 18px;
}
.cell.wide {
  grid-column: span 2;
}
@media (max-width: 640px) {
  .cell.wide {
    grid-column: span 1;
  }
}
.cell-name {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--amber);
  margin-bottom: 14px;
}
.cell-stage {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}
.cell-stage.block {
  display: block;
}
.cell-stage.block > :deep(.vg-chart) {
  width: 100%;
}

/* ---------- Composer ---------- */
.composer-lede {
  color: var(--muted);
  max-width: 62ch;
  margin-bottom: 22px;
}

.composer-grid {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 16px;
  align-items: start;
}
@media (max-width: 760px) {
  .composer-grid {
    grid-template-columns: 1fr;
  }
}

.col-head {
  font-family: var(--font-mono);
  font-size: 11.5px;
  letter-spacing: 0.07em;
  color: var(--faint);
  margin-bottom: 12px;
}

.palette-col {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: sticky;
  top: 76px;
}
.block-btn {
  font-family: var(--font-mono);
  font-size: 12.5px;
  text-align: left;
  background: var(--bg-deep);
  border: 1px solid var(--line);
  border-radius: 5px;
  color: var(--muted);
  padding: 9px 12px;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease, transform 0.15s ease;
}
.block-btn:hover {
  border-color: var(--amber);
  color: var(--text);
  transform: translateY(-1px);
}
.block-btn .plus {
  color: var(--amber);
  margin-right: 4px;
}

.canvas {
  border: 1px dashed var(--line);
  border-radius: 8px;
  padding: 18px;
  background:
    linear-gradient(var(--line) 1px, transparent 1px) 0 0 / 100% 32px,
    linear-gradient(90deg, var(--line) 1px, transparent 1px) 0 0 / 32px 100%;
  background-color: var(--bg);
  min-height: 260px;
}
.canvas-inner {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.blk {
  position: relative;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 10px;
  transition: border-color 0.2s ease;
}
.blk:hover {
  border-color: color-mix(in srgb, var(--amber) 55%, var(--line));
}
.blk-tools {
  position: absolute;
  top: -12px;
  right: 10px;
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 2;
}
.blk:hover .blk-tools {
  opacity: 1;
}
.blk-name {
  font-family: var(--font-mono);
  font-size: 10.5px;
  color: var(--bg);
  background: var(--amber);
  border-radius: 3px;
  padding: 2px 8px;
  margin-right: 4px;
}
.blk-tools button {
  font-family: var(--font-mono);
  font-size: 11px;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  border: 1px solid var(--line);
  background: var(--bg-deep);
  color: var(--muted);
  cursor: pointer;
}
.blk-tools button:hover {
  border-color: var(--amber);
  color: var(--text);
}
.blk-tools button.del:hover {
  border-color: #e06c75;
  color: #e06c75;
}

.b-headline h3 {
  font-family: var(--font-display);
  font-size: 30px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  margin-top: 8px;
}
.b-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}
.b-station-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
}
.b-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.empty {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--faint);
  text-align: center;
  padding: 40px 0;
}

.blk-enter-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.blk-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.blk-leave-active {
  display: none;
}

.code {
  margin: 18px 0 0;
  padding: 14px 16px;
  border-radius: 6px;
  background: var(--bg-deep);
  border: 1px solid var(--line);
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--mint);
  overflow-x: auto;
  white-space: pre;
}

.note {
  margin-top: 22px;
  font-size: 13.5px;
  color: var(--faint);
}
</style>
