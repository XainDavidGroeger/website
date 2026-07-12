<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => `${t('sandbox.areas.demo.title')} · David Gröger`,
  description: () => t('sandbox.areas.demo.desc'),
})

/* ------------------------------------------------------------------ */
/*  Daten: aus der Sandbox-API, dann lokal verwaltbar (Demo-State)     */
/* ------------------------------------------------------------------ */
type StationStatus = 'available' | 'charging' | 'maintenance'

interface Connector {
  type: string
  powerKw: number
}
interface Station {
  id: number
  name: string
  city: string
  status: StationStatus
  connectors: Connector[]
  pricePerKwhCents: number
  uptimePercent: number
  lng: number
  lat: number
}

const { data: stationsRes } = await useAsyncData<{ data: Station[] }>('voltgrid-demo-stations', () => {
  if (import.meta.server) return $fetch('/api/v1/stations')
  return window.fetch('/api/v1/stations').then(res => res.json())
})

const stations = ref<Station[]>([])
watch(stationsRes, (value) => {
  if (value?.data && !stations.value.length) {
    stations.value = value.data.map(s => ({ ...s }))
  }
}, { immediate: true })

const selectedId = ref<number | null>(null)

/* ------------------------------------------------------------------ */
/*  KPIs: live aus dem Demo-State                                      */
/* ------------------------------------------------------------------ */
const kpiCharging = computed(() => stations.value.filter(s => s.status === 'charging').length)
const kpiAvailable = computed(() => stations.value.filter(s => s.status === 'available').length)
const kpiMaintenance = computed(() => stations.value.filter(s => s.status === 'maintenance').length)
const kpiUtilization = computed(() => {
  const active = stations.value.filter(s => s.status !== 'maintenance').length
  if (!active) return '0 %'
  return Math.round((kpiCharging.value / active) * 100) + ' %'
})

/* ------------------------------------------------------------------ */
/*  Backoffice-Log                                                     */
/* ------------------------------------------------------------------ */
const log = ref<string[]>([])
function pushLog(station: Station, message: string) {
  const time = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  log.value.push(`${time}  station#${station.id} (${station.city}) → ${message}`)
  if (log.value.length > 7) log.value.shift()
}

/* ------------------------------------------------------------------ */
/*  Verwaltung: Status ändern → Karte, KPIs und Log ziehen live nach   */
/* ------------------------------------------------------------------ */
function setStatus(station: Station, status: StationStatus, logKey: string) {
  station.status = status
  pushLog(station, t(logKey))
  repaintMarker(station)
}

/* ------------------------------------------------------------------ */
/*  MapLibre                                                           */
/* ------------------------------------------------------------------ */
const mapEl = ref<HTMLDivElement | null>(null)
interface MarkerHandle {
  remove: () => void
}
let mapInstance: { remove: () => void, flyTo: (opts: object) => void } | null = null
let maplibre: typeof import('maplibre-gl').default | null = null
const markerById = new Map<number, MarkerHandle>()

const STATUS_COLOR: Record<StationStatus, string> = {
  available: '#6FE3C2',
  charging: '#FFAD3B',
  maintenance: '#5C6B8A',
}

function addMarker(station: Station) {
  if (!maplibre || !mapInstance) return
  markerById.get(station.id)?.remove()

  const marker = new maplibre.Marker({ color: STATUS_COLOR[station.status] })
    .setLngLat([station.lng, station.lat])
    .addTo(mapInstance as never)

  const el = marker.getElement()
  el.classList.add('vg-pin', station.status)
  el.setAttribute('role', 'button')
  el.setAttribute('tabindex', '0')
  el.setAttribute('aria-label', `${station.name} · ${station.city}`)
  el.title = `${station.name} · ${station.city}`
  el.addEventListener('click', () => selectStation(station, false))
  el.addEventListener('keydown', (ev: KeyboardEvent) => {
    if (ev.key === 'Enter') selectStation(station, false)
  })

  if (station.status !== 'maintenance') {
    const pulse = document.createElement('span')
    pulse.className = 'vg-pin-pulse'
    el.appendChild(pulse)
  }

  markerById.set(station.id, marker)
}

function repaintMarker(station: Station) {
  addMarker(station)
}

function selectStation(station: Station, fly = true) {
  selectedId.value = station.id
  if (fly && mapInstance) {
    mapInstance.flyTo({ center: [station.lng, station.lat], zoom: 12, duration: 1400 })
  }
}

onMounted(async () => {
  if (!mapEl.value) return

  const [mod] = await Promise.all([
    import('maplibre-gl'),
    // @ts-expect-error CSS-Import
    import('maplibre-gl/dist/maplibre-gl.css'),
  ])
  maplibre = mod.default

  const instance = new maplibre.Map({
    container: mapEl.value,
    style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
    center: [10.3, 51.2],
    zoom: 5.0,
    minZoom: 4.5,
    maxZoom: 16,
    maxBounds: [[1.5, 45.0], [19.5, 57.5]],
    attributionControl: { compact: true },
  })
  mapInstance = instance as never
  instance.addControl(new maplibre.NavigationControl({ showCompass: false }), 'top-right')

  for (const station of stations.value) addMarker(station)
})

onUnmounted(() => mapInstance?.remove())

const statusColorName = { available: 'mint', charging: 'amber', maintenance: 'muted' } as const
</script>

<template>
  <div class="wrap page">
    <div v-reveal class="sec-head">
      <p class="eyebrow">
        <NuxtLinkLocale to="/sandbox" class="crumb">/* voltgrid */</NuxtLinkLocale> → demo
      </p>
      <h2>{{ t('sandbox.demo.title') }}</h2>
      <p class="lede">{{ t('sandbox.demo.lede') }}</p>
    </div>

    <!-- Dashboard -->
    <div v-reveal class="dash">
      <header class="dash-head">
        <div>
          <p class="eyebrow"><span class="tick">/* voltgrid */</span> {{ t('sandbox.demo.dashEyebrow') }}</p>
          <h3>{{ t('sandbox.demo.dashTitle') }}</h3>
        </div>
        <DgTag color="mint">● live</DgTag>
      </header>

      <!-- KPI-Zeile: rechnet live aus dem Demo-State -->
      <div class="kpis">
        <VgStatTile :label="t('sandbox.demo.kpiSessions')" :value="String(kpiCharging)" :delta="t('sandbox.demo.kpiLive')" />
        <VgStatTile :label="t('sandbox.demo.kpiFree')" :value="String(kpiAvailable)" :delta="t('sandbox.demo.kpiLive')" />
        <VgStatTile :label="t('sandbox.demo.kpiMaintenance')" :value="String(kpiMaintenance)" :delta="t('sandbox.demo.kpiLive')" delta-color="amber" />
        <VgStatTile :label="t('sandbox.demo.kpiUtilization')" :value="kpiUtilization" :delta="t('sandbox.demo.kpiLive')" />
      </div>

      <!-- Verwaltung + Karte -->
      <div class="split">
        <div class="panel">
          <p class="panel-head">// {{ t('sandbox.demo.listTitle') }}</p>
          <ul class="station-list">
            <li
              v-for="station in stations"
              :key="station.id"
              :class="{ selected: selectedId === station.id }"
              @click="selectStation(station)"
            >
              <div class="row-top">
                <span class="name">{{ station.name }}</span>
                <DgTag :color="statusColorName[station.status]">● {{ t(`sandbox.demo.status.${station.status}`) }}</DgTag>
              </div>
              <div class="row-meta">
                <span>{{ station.city }}</span>
                <span>{{ (station.pricePerKwhCents / 100).toFixed(2).replace('.', ',') }} € / kWh</span>
              </div>
              <div class="row-actions" @click.stop>
                <button
                  v-if="station.status === 'available'"
                  type="button"
                  @click="setStatus(station, 'maintenance', 'sandbox.demo.logMaintenance')"
                >{{ t('sandbox.demo.actMaintenance') }}</button>
                <button
                  v-if="station.status === 'charging'"
                  type="button"
                  @click="setStatus(station, 'available', 'sandbox.demo.logEndSession')"
                >{{ t('sandbox.demo.actEndSession') }}</button>
                <button
                  v-if="station.status === 'maintenance'"
                  type="button"
                  class="release"
                  @click="setStatus(station, 'available', 'sandbox.demo.logRelease')"
                >{{ t('sandbox.demo.actRelease') }}</button>
              </div>
            </li>
          </ul>
          <p class="panel-hint">{{ t('sandbox.demo.selectHint') }}</p>
        </div>

        <div class="map-stage">
          <div ref="mapEl" class="map-el" role="application" :aria-label="t('sandbox.demo.mapAria')" />
        </div>
      </div>

      <!-- Lastkurve + Backoffice-Log -->
      <div class="bottom">
        <VgLoadChart :label="t('sandbox.demo.chartLabel')" :value="t('sandbox.demo.chartValue')" />
        <DgWindow :title="t('sandbox.demo.logTitle')" class="log-win">
          <p v-if="!log.length" class="log-empty">{{ t('sandbox.demo.logEmpty') }}</p>
          <p v-for="(line, i) in log" :key="i" class="log-line">▸ {{ line }}</p>
        </DgWindow>
      </div>
    </div>

    <p v-reveal class="note">{{ t('sandbox.demo.note') }}</p>
  </div>
</template>

<style scoped>
.page {
  padding-block: 110px;
}
.crumb {
  color: var(--amber);
}

.dash {
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--bg-deep);
  padding: 26px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dash-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}
.dash-head h3 {
  font-family: var(--font-display);
  font-size: clamp(22px, 3.4vw, 30px);
  font-weight: 700;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  margin-top: 8px;
}

.kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.split {
  display: grid;
  grid-template-columns: minmax(280px, 0.9fr) minmax(0, 1.4fr);
  gap: 16px;
  align-items: stretch;
}
@media (max-width: 860px) {
  .split {
    grid-template-columns: 1fr;
  }
}

.panel {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.panel-head {
  font-family: var(--font-mono);
  font-size: 11.5px;
  letter-spacing: 0.07em;
  color: var(--faint);
}

.station-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  max-height: 460px;
}
.station-list li {
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--bg-deep);
  padding: 12px 14px;
  cursor: pointer;
  transition: border-color 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.station-list li:hover {
  border-color: color-mix(in srgb, var(--amber) 55%, var(--line));
}
.station-list li.selected {
  border-color: var(--amber);
}

.row-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
.row-top .name {
  font-weight: 600;
  font-size: 14.5px;
}
.row-meta {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--faint);
}
.row-actions {
  display: flex;
  gap: 8px;
}
.row-actions button {
  font-family: var(--font-mono);
  font-size: 11.5px;
  background: none;
  border: 1px solid var(--line);
  border-radius: 4px;
  color: var(--muted);
  padding: 5px 10px;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease;
}
.row-actions button:hover {
  color: var(--amber);
  border-color: var(--amber);
}
.row-actions button.release:hover {
  color: var(--mint);
  border-color: var(--mint);
}

.panel-hint {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--faint);
  margin-top: auto;
}

.map-stage {
  position: relative;
  border: 1px solid var(--line);
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg-deep);
  min-height: 480px;
}
.map-el {
  position: absolute;
  inset: 0;
}

.bottom {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
  gap: 16px;
}
@media (max-width: 860px) {
  .bottom {
    grid-template-columns: 1fr;
  }
}
.log-win :deep(.body) {
  min-height: 150px;
}
.log-empty {
  color: var(--faint);
}
.log-line {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.note {
  margin-top: 22px;
  font-size: 13.5px;
  color: var(--faint);
}

/* ---------- MapLibre-Pins (wie /sandbox-Karte) ---------- */
.map-el :deep(.vg-pin) {
  cursor: pointer;
}
.map-el :deep(.vg-pin svg) {
  transition: transform 0.15s ease;
  transform-origin: bottom center;
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.5));
}
.map-el :deep(.vg-pin:hover svg),
.map-el :deep(.vg-pin:focus-visible svg) {
  transform: scale(1.18);
}
.map-el :deep(.vg-pin.maintenance svg) {
  opacity: 0.75;
}
.map-el :deep(.vg-pin-pulse) {
  position: absolute;
  left: 50%;
  bottom: -5px;
  width: 14px;
  height: 14px;
  margin-left: -7px;
  border-radius: 50%;
  border: 2px solid var(--mint);
  pointer-events: none;
  animation: map-pulse 2.6s ease-out infinite;
}
.map-el :deep(.vg-pin.charging .vg-pin-pulse) {
  border-color: var(--amber);
  animation-duration: 1.6s;
}
@keyframes map-pulse {
  0% {
    transform: scale(0.6);
    opacity: 0.8;
  }
  70%,
  100% {
    transform: scale(2.2);
    opacity: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .map-el :deep(.vg-pin-pulse) {
    display: none;
  }
}

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
</style>
