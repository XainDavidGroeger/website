<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => `${t('sandbox.areas.arch.title')} — David Gröger`,
  description: () => t('sandbox.areas.arch.desc'),
})

/* Hover-Highlight: Node + verbundene Kanten in Bernstein */
const hot = ref<string | null>(null)
function isHot(nodes: string) {
  return hot.value !== null && nodes.split(' ').includes(hot.value)
}
</script>

<template>
  <div class="wrap page">
    <div v-reveal class="sec-head">
      <p class="eyebrow">
        <NuxtLinkLocale to="/sandbox" class="crumb">/* voltgrid */</NuxtLinkLocale> → architecture
      </p>
      <h2>{{ t('sandbox.arch.title') }}</h2>
      <p class="lede">{{ t('sandbox.arch.lede') }}</p>
    </div>

    <!-- Diagramm 1: VoltGrid Systemarchitektur -->
    <div v-reveal class="dia-wrap">
      <div class="bar">
        <span class="dots"><i /><i /><i /></span>
        <span class="title">~/voltgrid — {{ t('sandbox.arch.d1Title') }}</span>
        <span class="hint">{{ t('sandbox.arch.hoverHint') }}</span>
      </div>
      <div class="dia-scroll">
        <svg viewBox="0 0 960 560" width="960" height="560" class="dia" @mouseleave="hot = null">
          <g class="edges">
            <path :class="{ hot: isHot('app api') }" d="M 210 72 H 260 V 120 H 300" />
            <path :class="{ hot: isHot('dash api') }" d="M 210 172 H 260 V 146 H 300" />
            <path :class="{ hot: isHot('api db') }" d="M 490 110 H 560" />
            <path :class="{ hot: isHot('api realtime') }" d="M 380 176 V 316" />
            <path :class="{ hot: isHot('api queue') }" d="M 460 176 V 322 H 560" stroke-dasharray="5 6" />
            <path :class="{ hot: isHot('queue worker') }" d="M 690 322 H 730" stroke-dasharray="5 6" />
            <path :class="{ hot: isHot('worker db') }" d="M 815 290 V 230 H 645 V 142" />
            <path :class="{ hot: isHot('worker psp') }" d="M 815 354 V 430" stroke-dasharray="5 6" />
            <path :class="{ hot: isHot('stations gateway') }" d="M 145 420 V 380" stroke-dasharray="5 6" />
            <path :class="{ hot: isHot('gateway realtime') }" d="M 230 348 H 300" stroke-dasharray="5 6" />
            <path :class="{ hot: isHot('gateway tsdb') }" d="M 165 316 V 250 H 845 V 142" stroke-dasharray="5 6" />
            <path :class="{ hot: isHot('api gateway') }" d="M 300 160 H 240 V 316" />
            <path class="ws" :class="{ hot: isHot('realtime app') }" d="M 300 332 H 272 V 72 H 210" stroke-dasharray="5 6" />
            <path class="ws" :class="{ hot: isHot('realtime dash') }" d="M 300 364 H 256 V 198 H 210" stroke-dasharray="5 6" />
          </g>

          <!-- Clients -->
          <g class="node" :class="{ hot: hot === 'app' }" @mouseenter="hot = 'app'">
            <rect x="40" y="40" width="170" height="64" rx="8" />
            <text x="125" y="66" text-anchor="middle" class="name">Fahrer-App</text>
            <text x="125" y="86" text-anchor="middle" class="sub">map · laden · abrechnung</text>
          </g>
          <g class="node" :class="{ hot: hot === 'dash' }" @mouseenter="hot = 'dash'">
            <rect x="40" y="140" width="170" height="64" rx="8" />
            <text x="125" y="166" text-anchor="middle" class="name">Betreiber-Dashboard</text>
            <text x="125" y="186" text-anchor="middle" class="sub">multi-tenant · kpis</text>
          </g>

          <!-- Kern -->
          <g class="node core" :class="{ hot: hot === 'api' }" @mouseenter="hot = 'api'">
            <rect x="300" y="90" width="190" height="86" rx="8" />
            <text x="395" y="122" text-anchor="middle" class="name">API-Cluster</text>
            <text x="395" y="144" text-anchor="middle" class="sub">REST · auth · rate-limits</text>
            <text x="395" y="162" text-anchor="middle" class="sub">sessions · tarife · roaming</text>
          </g>
          <g class="node mint" :class="{ hot: hot === 'realtime' }" @mouseenter="hot = 'realtime'">
            <rect x="300" y="316" width="190" height="64" rx="8" />
            <text x="395" y="342" text-anchor="middle" class="name">Realtime-Hub</text>
            <text x="395" y="362" text-anchor="middle" class="sub">websockets · status-push</text>
          </g>

          <!-- Daten -->
          <g class="node" :class="{ hot: hot === 'db' }" @mouseenter="hot = 'db'">
            <rect x="560" y="78" width="160" height="64" rx="8" />
            <text x="640" y="104" text-anchor="middle" class="name">PostgreSQL</text>
            <text x="640" y="124" text-anchor="middle" class="sub">stammdaten · sessions</text>
          </g>
          <g class="node" :class="{ hot: hot === 'tsdb' }" @mouseenter="hot = 'tsdb'">
            <rect x="760" y="78" width="170" height="64" rx="8" />
            <text x="845" y="104" text-anchor="middle" class="name">TimescaleDB</text>
            <text x="845" y="124" text-anchor="middle" class="sub">telemetrie · kW-kurven</text>
          </g>

          <!-- Async -->
          <g class="node" :class="{ hot: hot === 'queue' }" @mouseenter="hot = 'queue'">
            <rect x="560" y="290" width="130" height="64" rx="8" />
            <text x="625" y="316" text-anchor="middle" class="name">Queue</text>
            <text x="625" y="336" text-anchor="middle" class="sub">redis · events</text>
          </g>
          <g class="node" :class="{ hot: hot === 'worker' }" @mouseenter="hot = 'worker'">
            <rect x="730" y="290" width="170" height="64" rx="8" />
            <text x="815" y="316" text-anchor="middle" class="name">Billing-Worker</text>
            <text x="815" y="336" text-anchor="middle" class="sub">sessions → rechnungen</text>
          </g>

          <!-- Edge / IoT -->
          <g class="node" :class="{ hot: hot === 'gateway' }" @mouseenter="hot = 'gateway'">
            <rect x="60" y="316" width="170" height="64" rx="8" />
            <text x="145" y="342" text-anchor="middle" class="name">IoT-Gateway</text>
            <text x="145" y="362" text-anchor="middle" class="sub">OCPP · MQTT · ingest</text>
          </g>
          <g class="node ext" :class="{ hot: hot === 'stations' }" @mouseenter="hot = 'stations'">
            <rect x="60" y="420" width="170" height="64" rx="8" />
            <text x="145" y="446" text-anchor="middle" class="name">Ladesäulen ×2.418</text>
            <text x="145" y="466" text-anchor="middle" class="sub">hardware · telemetrie</text>
          </g>

          <!-- Extern -->
          <g class="node ext" :class="{ hot: hot === 'psp' }" @mouseenter="hot = 'psp'">
            <rect x="750" y="430" width="130" height="64" rx="8" />
            <text x="815" y="456" text-anchor="middle" class="name">PSP</text>
            <text x="815" y="476" text-anchor="middle" class="sub">payments · extern</text>
          </g>
        </svg>
      </div>
      <div class="legend">
        <span><i class="solid" /> {{ t('sandbox.arch.legendSync') }}</span>
        <span><i class="dashed" /> {{ t('sandbox.arch.legendAsync') }}</span>
        <span><i class="mintbox" /> {{ t('sandbox.arch.legendRealtime') }}</span>
        <span><i class="extbox" /> {{ t('sandbox.arch.legendExt') }}</span>
      </div>
    </div>
    <p v-reveal class="dia-note">{{ t('sandbox.arch.d1Note') }}</p>

    <!-- Diagramm 2: Lade-Session-Flow -->
    <div v-reveal class="dia-wrap second">
      <div class="bar">
        <span class="dots"><i /><i /><i /></span>
        <span class="title">~/voltgrid — {{ t('sandbox.arch.d2Title') }}</span>
      </div>
      <div class="dia-scroll">
        <svg viewBox="0 0 960 190" width="960" height="190" class="dia">
          <g class="edges">
            <path d="M 180 95 H 210" />
            <path d="M 390 95 H 420" />
            <path d="M 600 95 H 630" stroke-dasharray="5 6" />
            <path d="M 810 95 H 840" stroke-dasharray="5 6" />
          </g>
          <g class="node">
            <rect x="30" y="63" width="150" height="64" rx="8" />
            <text x="105" y="89" text-anchor="middle" class="name">POST /sessions</text>
            <text x="105" y="109" text-anchor="middle" class="sub">app → api · 201</text>
          </g>
          <g class="node core">
            <rect x="210" y="63" width="180" height="64" rx="8" />
            <text x="300" y="89" text-anchor="middle" class="name">Säule startet</text>
            <text x="300" y="109" text-anchor="middle" class="sub">api → gateway → OCPP</text>
          </g>
          <g class="node mint">
            <rect x="420" y="63" width="180" height="64" rx="8" />
            <text x="510" y="89" text-anchor="middle" class="name">Live-Telemetrie</text>
            <text x="510" y="109" text-anchor="middle" class="sub">kW-kurve → app · push</text>
          </g>
          <g class="node">
            <rect x="630" y="63" width="180" height="64" rx="8" />
            <text x="720" y="89" text-anchor="middle" class="name">Session-Ende</text>
            <text x="720" y="109" text-anchor="middle" class="sub">event → queue → worker</text>
          </g>
          <g class="node ext">
            <rect x="840" y="63" width="100" height="64" rx="8" />
            <text x="890" y="89" text-anchor="middle" class="name">Rechnung</text>
            <text x="890" y="109" text-anchor="middle" class="sub">psp · pdf</text>
          </g>
        </svg>
      </div>
    </div>
    <p v-reveal class="dia-note">{{ t('sandbox.arch.d2Note') }}</p>
  </div>
</template>

<style scoped>
.page {
  padding-block: 110px;
}
.crumb {
  color: var(--amber);
}

.dia-wrap {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
  overflow: hidden;
}
.dia-wrap.second {
  margin-top: 40px;
}

.bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-bottom: 1px solid var(--line);
  background: var(--bg-deep);
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
.bar .hint {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--faint);
}

.dia-scroll {
  overflow-x: auto;
  padding: 20px 10px;
}
.dia {
  display: block;
  min-width: 940px;
  margin: 0 auto;
}

.edges path {
  fill: none;
  stroke: var(--line);
  stroke-width: 2;
  transition: stroke 0.2s ease;
}
.edges path.hot {
  stroke: var(--amber);
  filter: drop-shadow(0 0 5px color-mix(in srgb, var(--amber) 60%, transparent));
}

.node {
  cursor: default;
}
.node rect {
  fill: var(--surface-2);
  stroke: var(--line);
  stroke-width: 1.5;
  transition: stroke 0.2s ease;
}
.node.core rect {
  stroke: var(--amber);
}
.node.mint rect {
  stroke: color-mix(in srgb, var(--mint) 55%, var(--line));
}
.node.ext rect {
  stroke-dasharray: 5 5;
}
.node.hot rect {
  stroke: var(--amber);
  stroke-width: 2.5;
}
.node .name {
  font-family: var(--font-mono);
  font-size: 13.5px;
  font-weight: 600;
  fill: var(--text);
}
.node .sub {
  font-family: var(--font-mono);
  font-size: 11px;
  fill: var(--faint);
}

.legend {
  display: flex;
  gap: 22px;
  flex-wrap: wrap;
  padding: 12px 16px;
  border-top: 1px solid var(--line);
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--faint);
}
.legend span {
  display: flex;
  align-items: center;
  gap: 8px;
}
.legend i {
  display: inline-block;
  width: 22px;
  height: 0;
  border-top: 2px solid var(--line);
}
.legend i.dashed {
  border-top-style: dashed;
}
.legend i.mintbox,
.legend i.extbox {
  width: 14px;
  height: 10px;
  border: 1.5px solid color-mix(in srgb, var(--mint) 55%, var(--line));
  border-radius: 3px;
}
.legend i.extbox {
  border: 1.5px dashed var(--line);
}

.dia-note {
  margin-top: 18px;
  color: var(--muted);
  font-size: 14.5px;
  max-width: 68ch;
  line-height: 1.7;
}
</style>
