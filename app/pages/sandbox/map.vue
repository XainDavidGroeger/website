<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => `${t('sandbox.areas.map.title')} — David Gröger`,
  description: () => t('sandbox.areas.map.desc'),
})

/* ------------------------------------------------------------------ */
/*  Daten: live aus der Sandbox-API                                    */
/* ------------------------------------------------------------------ */
interface Connector {
  type: string
  powerKw: number
}
interface Station {
  id: number
  name: string
  city: string
  status: 'available' | 'charging' | 'maintenance'
  connectors: Connector[]
  pricePerKwhCents: number
  uptimePercent: number
}

const { data: stationsRes } = await useFetch<{ data: Station[] }>('/api/v1/stations')
const stations = computed(() => stationsRes.value?.data ?? [])

/* ------------------------------------------------------------------ */
/*  Projektion: vereinfachtes Low-Poly-Deutschland                     */
/* ------------------------------------------------------------------ */
const W = 480
const H = 640

function project(lon: number, lat: number): { x: number, y: number } {
  return {
    x: ((lon - 5.5) / 10) * W,
    y: ((55.2 - lat) / 8.2) * H,
  }
}

const OUTLINE: [number, number][] = [
  [7.0, 53.7], [8.5, 54.0], [8.3, 54.9], [9.9, 54.8], [10.9, 54.0],
  [12.5, 54.4], [13.8, 54.1], [14.2, 53.7], [14.1, 52.8], [14.7, 52.5],
  [14.6, 51.8], [15.0, 51.3], [14.3, 51.0], [12.1, 50.3], [12.5, 49.7],
  [13.8, 48.7], [13.0, 48.3], [12.9, 47.7], [11.6, 47.5], [10.2, 47.3],
  [9.5, 47.6], [8.5, 47.6], [7.5, 47.6], [7.6, 48.5], [8.1, 49.0],
  [6.7, 49.2], [6.1, 49.6], [6.0, 50.3], [5.9, 51.0], [6.8, 51.9],
  [7.0, 52.4], [6.7, 53.0],
]

const outlinePath = OUTLINE
  .map(([lon, lat], i) => {
    const { x, y } = project(lon, lat)
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
  })
  .join(' ') + ' Z'

const CITY_COORDS: Record<string, [number, number]> = {
  Hamburg: [10.0, 53.55],
  Berlin: [13.4, 52.52],
  Köln: [6.96, 50.94],
  Hannover: [9.73, 52.37],
  München: [11.58, 48.14],
}

const markers = computed(() => {
  const seen: Record<string, number> = {}
  return stations.value.map((station) => {
    const coords = CITY_COORDS[station.city] ?? [10.4, 51.2]
    const { x, y } = project(coords[0], coords[1])
    // mehrere Säulen in einer Stadt leicht versetzen
    const offset = (seen[station.city] = (seen[station.city] ?? 0) + 1) - 1
    return { station, x: x + offset * 20, y: y + offset * 10 }
  })
})

/* ------------------------------------------------------------------ */
/*  Modal + Session-Start gegen die echte API                          */
/* ------------------------------------------------------------------ */
const selected = ref<Station | null>(null)
const selectedConnector = ref<string | null>(null)

interface SessionResult {
  ok: boolean
  receipt?: { sessionId: string, estimatedCostCents: number }
  errors?: Record<string, string>
}
const sessionResult = ref<SessionResult | null>(null)
const starting = ref(false)

function openStation(station: Station) {
  selected.value = station
  selectedConnector.value = station.connectors[0]?.type ?? null
  sessionResult.value = null
}
function closeModal() {
  selected.value = null
}

async function startSession() {
  if (!selected.value || !selectedConnector.value || starting.value) return
  starting.value = true
  sessionResult.value = null
  try {
    const res = await $fetch<{ data: { sessionId: string, estimatedCostCents: number } }>('/api/v1/sessions', {
      method: 'POST',
      body: {
        stationId: selected.value.id,
        connectorType: selectedConnector.value,
        estimatedKwh: 40,
      },
    })
    sessionResult.value = { ok: true, receipt: res.data }
  }
  catch (error: unknown) {
    const fetchError = error as { statusCode?: number, data?: { data?: { errors?: Record<string, string> } } }
    sessionResult.value = {
      ok: false,
      errors: fetchError.data?.data?.errors ?? { _global: t('sandbox.map.unknownError') },
    }
  }
  finally {
    starting.value = false
  }
}

function onKey(ev: KeyboardEvent) {
  if (ev.key === 'Escape') closeModal()
}
watch(selected, (value) => {
  document.body.style.overflow = value ? 'hidden' : ''
})
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})

const statusColor = { available: 'mint', charging: 'amber', maintenance: 'muted' } as const
function euro(cents: number): string {
  return (cents / 100).toFixed(2).replace('.', ',') + ' €'
}
</script>

<template>
  <div class="wrap page">
    <div v-reveal class="sec-head">
      <p class="eyebrow">
        <NuxtLinkLocale to="/sandbox" class="crumb">/* voltgrid */</NuxtLinkLocale> → map
      </p>
      <h2>{{ t('sandbox.map.title') }}</h2>
      <p class="lede">{{ t('sandbox.map.lede') }}</p>
    </div>

    <div v-reveal class="map-wrap">
      <div class="map-stage">
        <svg :viewBox="`0 0 ${W} ${H}`" class="map" role="img" :aria-label="t('sandbox.map.mapAria')">
          <path :d="outlinePath" class="country" />
          <g v-for="marker in markers" :key="marker.station.id">
            <circle
              v-if="marker.station.status !== 'maintenance'"
              class="pulse"
              :class="marker.station.status"
              :cx="marker.x"
              :cy="marker.y"
              r="8"
            />
            <circle
              class="marker"
              :class="marker.station.status"
              :cx="marker.x"
              :cy="marker.y"
              r="7"
              tabindex="0"
              role="button"
              :aria-label="`${marker.station.name} · ${marker.station.city}`"
              @click="openStation(marker.station)"
              @keydown.enter="openStation(marker.station)"
            >
              <title>{{ marker.station.name }} · {{ marker.station.city }}</title>
            </circle>
          </g>
          <text
            v-for="(coords, city) in CITY_COORDS"
            :key="city"
            :x="project(coords[0], coords[1]).x + 14"
            :y="project(coords[0], coords[1]).y + 4"
            class="city-label"
          >{{ city }}</text>
        </svg>
      </div>

      <div class="side">
        <p class="side-head">// {{ t('sandbox.map.legend') }}</p>
        <ul class="legend">
          <li><i class="dot mint" /> {{ t('sandbox.map.statusAvailable') }}</li>
          <li><i class="dot amber" /> {{ t('sandbox.map.statusCharging') }}</li>
          <li><i class="dot muted" /> {{ t('sandbox.map.statusMaintenance') }}</li>
        </ul>
        <p class="hint">{{ t('sandbox.map.hint') }}</p>
        <VgStatTile :label="t('sandbox.map.kpiLabel')" :value="String(stations.length)" :delta="t('sandbox.map.kpiDelta')" />
      </div>
    </div>

    <p v-reveal class="note">{{ t('sandbox.map.note') }}</p>

    <!-- Stations-Modal -->
    <Teleport to="body">
      <Transition name="smodal" :duration="220">
        <div v-if="selected" class="overlay" @click.self="closeModal">
          <div class="modal" role="dialog" :aria-label="selected.name">
            <header>
              <div>
                <p class="eyebrow"><span class="tick">/* station #{{ selected.id }} */</span> {{ selected.city }}</p>
                <h3>{{ selected.name }}</h3>
              </div>
              <button class="close" type="button" :aria-label="t('work.close')" @click="closeModal">✕</button>
            </header>

            <div class="row">
              <DgTag :color="statusColor[selected.status]">● {{ t(`sandbox.map.status.${selected.status}`) }}</DgTag>
              <span class="meta">{{ euro(selected.pricePerKwhCents) }} / kWh</span>
              <span class="meta">uptime {{ selected.uptimePercent }} %</span>
            </div>

            <p class="sub">// {{ t('sandbox.map.connectors') }}</p>
            <div class="connectors">
              <button
                v-for="connector in selected.connectors"
                :key="connector.type"
                class="connector"
                :class="{ active: selectedConnector === connector.type }"
                type="button"
                @click="selectedConnector = connector.type"
              >
                {{ connector.type }} · {{ connector.powerKw }} kW
              </button>
            </div>

            <div class="start">
              <DgButton :disabled="starting" @click="startSession">
                {{ starting ? '⚡ …' : t('sandbox.map.startSession') }}
              </DgButton>
              <span class="start-hint">{{ t('sandbox.map.startHint') }}</span>
            </div>

            <div v-if="sessionResult" class="result" :class="{ ok: sessionResult.ok }">
              <template v-if="sessionResult.ok && sessionResult.receipt">
                <p>201 Created ✓</p>
                <p>{{ sessionResult.receipt.sessionId }} · {{ t('sandbox.map.estCost') }} {{ euro(sessionResult.receipt.estimatedCostCents) }}</p>
              </template>
              <template v-else>
                <p>422 Validation Failed</p>
                <p v-for="(message, field) in sessionResult.errors" :key="field">{{ field }}: {{ message }}</p>
              </template>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.page {
  padding-block: 110px;
}
.crumb {
  color: var(--amber);
}

.map-wrap {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 250px;
  gap: 20px;
  align-items: start;
}
@media (max-width: 760px) {
  .map-wrap {
    grid-template-columns: 1fr;
  }
}

.map-stage {
  border: 1px solid var(--line);
  border-radius: 8px;
  background:
    linear-gradient(var(--line) 1px, transparent 1px) 0 0 / 100% 44px,
    linear-gradient(90deg, var(--line) 1px, transparent 1px) 0 0 / 44px 100%;
  background-color: var(--bg-deep);
  padding: 26px;
}
.map {
  display: block;
  width: 100%;
  max-width: 440px;
  height: auto;
  margin: 0 auto;
}

.country {
  fill: color-mix(in srgb, var(--surface-2) 70%, transparent);
  stroke: var(--line);
  stroke-width: 2;
  stroke-linejoin: round;
}

.marker {
  stroke-width: 2.5;
  cursor: pointer;
  transition: r 0.15s ease;
}
.marker:hover,
.marker:focus-visible {
  r: 9;
}
.marker.available {
  fill: var(--bg);
  stroke: var(--mint);
}
.marker.charging {
  fill: var(--bg);
  stroke: var(--amber);
}
.marker.maintenance {
  fill: var(--bg);
  stroke: var(--faint);
  stroke-dasharray: 3 3;
}

.pulse {
  fill: none;
  stroke-width: 2;
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
  animation: map-pulse 2.6s ease-out infinite;
}
.pulse.available {
  stroke: var(--mint);
}
.pulse.charging {
  stroke: var(--amber);
  animation-duration: 1.6s;
}
@keyframes map-pulse {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  70%,
  100% {
    transform: scale(2.6);
    opacity: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .pulse {
    display: none;
  }
}

.city-label {
  font-family: var(--font-mono);
  font-size: 11px;
  fill: var(--faint);
}

.side {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.side-head {
  font-family: var(--font-mono);
  font-size: 11.5px;
  letter-spacing: 0.07em;
  color: var(--faint);
}
.legend {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 12.5px;
  color: var(--muted);
}
.legend li {
  display: flex;
  align-items: center;
  gap: 10px;
}
.dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  border: 2.5px solid;
}
.dot.mint {
  border-color: var(--mint);
}
.dot.amber {
  border-color: var(--amber);
}
.dot.muted {
  border-color: var(--faint);
  border-style: dashed;
}
.hint {
  font-size: 13px;
  color: var(--muted);
  line-height: 1.6;
}

.note {
  margin-top: 22px;
  font-size: 13.5px;
  color: var(--faint);
}

/* ---------- Modal ---------- */
.overlay {
  position: fixed;
  inset: 0;
  z-index: 70;
  background: color-mix(in srgb, var(--bg-deep) 62%, transparent);
  backdrop-filter: blur(7px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 10vh 16px 24px;
  overflow-y: auto;
}
.modal {
  width: min(520px, 100%);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 8px;
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.55);
  padding: 28px 30px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.modal header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}
.modal h3 {
  font-family: var(--font-display);
  font-size: clamp(22px, 3.5vw, 30px);
  font-weight: 700;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  margin-top: 8px;
}
.modal .close {
  background: none;
  border: 1px solid var(--line);
  border-radius: 5px;
  color: var(--muted);
  font-size: 14px;
  padding: 6px 11px;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease;
}
.modal .close:hover {
  color: var(--amber);
  border-color: var(--amber);
}

.row {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}
.meta {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--amber);
}
.meta + .meta {
  color: var(--muted);
}

.sub {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.06em;
  color: var(--faint);
}
.connectors {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.connector {
  font-family: var(--font-mono);
  font-size: 12.5px;
  background: var(--bg-deep);
  border: 1px solid var(--line);
  border-radius: 5px;
  color: var(--muted);
  padding: 8px 13px;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease;
}
.connector.active {
  border-color: var(--amber);
  color: var(--text);
}

.start {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}
.start-hint {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--faint);
}

.result {
  font-family: var(--font-mono);
  font-size: 12.5px;
  line-height: 1.8;
  border: 1px solid color-mix(in srgb, #e06c75 50%, var(--line));
  border-radius: 6px;
  background: var(--bg-deep);
  padding: 12px 15px;
  color: #e06c75;
}
.result.ok {
  border-color: color-mix(in srgb, var(--mint) 50%, var(--line));
  color: var(--mint);
}

.smodal-enter-active,
.smodal-leave-active {
  transition: opacity 0.2s ease;
}
.smodal-enter-from,
.smodal-leave-to {
  opacity: 0;
}
</style>
