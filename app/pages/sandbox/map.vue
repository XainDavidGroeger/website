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
  lng: number
  lat: number
}

/* server/prerender: interner $fetch · client: window.fetch (läuft durch den
   api-mock-Interceptor und funktioniert damit auch auf statischem Hosting) */
const { data: stationsRes } = await useAsyncData<{ data: Station[] }>('voltgrid-stations', () => {
  if (import.meta.server) return $fetch('/api/v1/stations')
  return window.fetch('/api/v1/stations').then(res => res.json())
})
const stations = computed(() => stationsRes.value?.data ?? [])

/* ------------------------------------------------------------------ */
/*  MapLibre GL: echte interaktive Karte (OSM-Daten, Dark-Style)       */
/*  lazy geladen — das Bundle (~250 kB gzip) betrifft nur diese Seite  */
/* ------------------------------------------------------------------ */
const mapEl = ref<HTMLDivElement | null>(null)
let map: { remove: () => void } | null = null

onMounted(async () => {
  if (!mapEl.value || !stations.value.length) return

  const [{ default: maplibregl }] = await Promise.all([
    import('maplibre-gl'),
    // @ts-expect-error CSS-Import
    import('maplibre-gl/dist/maplibre-gl.css'),
  ])

  const instance = new maplibregl.Map({
    container: mapEl.value,
    style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
    center: [10.3, 51.2],
    zoom: 5.1,
    minZoom: 4.5,
    maxZoom: 16,
    maxBounds: [[1.5, 45.0], [19.5, 57.5]],
    attributionControl: { compact: true },
  })
  map = instance

  instance.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')

  for (const station of stations.value) {
    const el = document.createElement('button')
    el.type = 'button'
    el.className = `vg-marker ${station.status}`
    el.title = `${station.name} · ${station.city}`
    el.setAttribute('aria-label', `${station.name} · ${station.city}`)
    el.addEventListener('click', () => openStation(station))
    new maplibregl.Marker({ element: el }).setLngLat([station.lng, station.lat]).addTo(instance)
  }
})

onUnmounted(() => map?.remove())

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
    // window.fetch statt $fetch: läuft durch den api-mock-Interceptor
    const response = await window.fetch('/api/v1/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stationId: selected.value.id,
        connectorType: selectedConnector.value,
        estimatedKwh: 40,
      }),
    })
    const payload = await response.json()
    if (response.status === 201) {
      sessionResult.value = { ok: true, receipt: payload.data }
    }
    else {
      sessionResult.value = {
        ok: false,
        errors: payload.data?.errors ?? { _global: t('sandbox.map.unknownError') },
      }
    }
  }
  catch {
    sessionResult.value = { ok: false, errors: { _global: t('sandbox.map.unknownError') } }
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
        <div ref="mapEl" class="map-el" role="application" :aria-label="t('sandbox.map.mapAria')" />
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
  position: relative;
  border: 1px solid var(--line);
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg-deep);
  height: 580px;
}
.map-el {
  position: absolute;
  inset: 0;
}

/* Säulen-Marker (DOM-Elemente in MapLibre) */
.map-el :deep(.vg-marker) {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 3px solid var(--mint);
  background: var(--bg);
  padding: 0;
  cursor: pointer;
  position: relative;
  transition: transform 0.15s ease;
}
.map-el :deep(.vg-marker:hover),
.map-el :deep(.vg-marker:focus-visible) {
  transform: scale(1.3);
  z-index: 3;
}
.map-el :deep(.vg-marker.charging) {
  border-color: var(--amber);
}
.map-el :deep(.vg-marker.maintenance) {
  border-color: var(--faint);
  border-style: dashed;
}
.map-el :deep(.vg-marker.available)::after,
.map-el :deep(.vg-marker.charging)::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 2px solid var(--mint);
  animation: map-pulse 2.6s ease-out infinite;
}
.map-el :deep(.vg-marker.charging)::after {
  border-color: var(--amber);
  animation-duration: 1.6s;
}
@keyframes map-pulse {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  70%,
  100% {
    transform: scale(2.4);
    opacity: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .map-el :deep(.vg-marker)::after {
    animation: none;
    display: none;
  }
}

/* MapLibre-Controls aufs Design-System einfärben */
.map-el :deep(.maplibregl-ctrl-group) {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 6px;
  box-shadow: none;
}
.map-el :deep(.maplibregl-ctrl-group button) {
  background: transparent;
}
.map-el :deep(.maplibregl-ctrl-group button + button) {
  border-top: 1px solid var(--line);
}
.map-el :deep(.maplibregl-ctrl button .maplibregl-ctrl-icon) {
  filter: invert(0.7);
}
.map-el :deep(.maplibregl-ctrl-attrib) {
  background: color-mix(in srgb, var(--bg-deep) 80%, transparent);
  font-family: var(--font-mono);
  font-size: 10px;
}
.map-el :deep(.maplibregl-ctrl-attrib a) {
  color: var(--muted);
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
