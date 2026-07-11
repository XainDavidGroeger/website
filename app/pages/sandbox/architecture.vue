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
        <NuxtLinkLocale to="/sandbox" class="crumb">/* sandbox */</NuxtLinkLocale> → architecture
      </p>
      <h2>{{ t('sandbox.arch.title') }}</h2>
      <p class="lede">{{ t('sandbox.arch.lede') }}</p>
    </div>

    <!-- Diagramm 1: Echtzeit-Auktionsplattform -->
    <div v-reveal class="dia-wrap">
      <div class="bar">
        <span class="dots"><i /><i /><i /></span>
        <span class="title">~/architecture — {{ t('sandbox.arch.d1Title') }}</span>
        <span class="hint">{{ t('sandbox.arch.hoverHint') }}</span>
      </div>
      <div class="dia-scroll">
        <svg viewBox="0 0 960 520" width="960" height="520" class="dia" @mouseleave="hot = null">
          <!-- Kanten -->
          <g class="edges">
            <path :class="{ hot: isHot('client cdn') }" d="M 210 72 H 300" />
            <path :class="{ hot: isHot('client lb') }" d="M 125 104 V 192 H 300" />
            <path :class="{ hot: isHot('lb app') }" d="M 470 224 H 540" />
            <path :class="{ hot: isHot('app mysql') }" d="M 740 192 H 790" />
            <path :class="{ hot: isHot('app redis') }" d="M 640 236 V 300" />
            <path :class="{ hot: isHot('redis horizon') }" d="M 725 332 H 780" />
            <path :class="{ hot: isHot('horizon mysql') }" d="M 865 300 V 224" />
            <path :class="{ hot: isHot('app reverb') }" d="M 640 150 V 104" />
            <path class="ws" :class="{ hot: isHot('reverb client') }" d="M 540 72 H 210" stroke-dasharray="5 6" />
            <path :class="{ hot: isHot('app braintree') }" d="M 540 210 H 495 V 332 H 470" stroke-dasharray="5 6" />
            <path :class="{ hot: isHot('horizon sentry') }" d="M 865 364 V 420" stroke-dasharray="5 6" />
            <path :class="{ hot: isHot('app sentry') }" d="M 700 236 V 452 H 780" stroke-dasharray="5 6" />
          </g>

          <!-- Nodes -->
          <g class="node" :class="{ hot: hot === 'client' }" @mouseenter="hot = 'client'">
            <rect x="40" y="40" width="170" height="64" rx="8" />
            <text x="125" y="66" text-anchor="middle" class="name">Browser / App</text>
            <text x="125" y="86" text-anchor="middle" class="sub">Vue · Laravel Echo</text>
          </g>
          <g class="node" :class="{ hot: hot === 'cdn' }" @mouseenter="hot = 'cdn'">
            <rect x="300" y="40" width="170" height="64" rx="8" />
            <text x="385" y="66" text-anchor="middle" class="name">CDN</text>
            <text x="385" y="86" text-anchor="middle" class="sub">assets · caching</text>
          </g>
          <g class="node" :class="{ hot: hot === 'lb' }" @mouseenter="hot = 'lb'">
            <rect x="300" y="192" width="170" height="64" rx="8" />
            <text x="385" y="218" text-anchor="middle" class="name">Load Balancer</text>
            <text x="385" y="238" text-anchor="middle" class="sub">nginx · tls</text>
          </g>
          <g class="node core" :class="{ hot: hot === 'app' }" @mouseenter="hot = 'app'">
            <rect x="540" y="150" width="200" height="86" rx="8" />
            <text x="640" y="182" text-anchor="middle" class="name">App-Cluster</text>
            <text x="640" y="204" text-anchor="middle" class="sub">Laravel 11 · Octane ×3</text>
            <text x="640" y="222" text-anchor="middle" class="sub">Livewire · REST</text>
          </g>
          <g class="node mint" :class="{ hot: hot === 'reverb' }" @mouseenter="hot = 'reverb'">
            <rect x="540" y="40" width="200" height="64" rx="8" />
            <text x="640" y="66" text-anchor="middle" class="name">Reverb</text>
            <text x="640" y="86" text-anchor="middle" class="sub">websockets · broadcast</text>
          </g>
          <g class="node" :class="{ hot: hot === 'redis' }" @mouseenter="hot = 'redis'">
            <rect x="540" y="300" width="185" height="64" rx="8" />
            <text x="632" y="326" text-anchor="middle" class="name">Redis</text>
            <text x="632" y="346" text-anchor="middle" class="sub">cache · queue · presence</text>
          </g>
          <g class="node" :class="{ hot: hot === 'horizon' }" @mouseenter="hot = 'horizon'">
            <rect x="780" y="300" width="170" height="64" rx="8" />
            <text x="865" y="326" text-anchor="middle" class="name">Horizon</text>
            <text x="865" y="346" text-anchor="middle" class="sub">worker · jobs · retries</text>
          </g>
          <g class="node" :class="{ hot: hot === 'mysql' }" @mouseenter="hot = 'mysql'">
            <rect x="790" y="160" width="160" height="64" rx="8" />
            <text x="870" y="186" text-anchor="middle" class="name">MySQL</text>
            <text x="870" y="206" text-anchor="middle" class="sub">primary · backups</text>
          </g>
          <g class="node ext" :class="{ hot: hot === 'braintree' }" @mouseenter="hot = 'braintree'">
            <rect x="300" y="300" width="170" height="64" rx="8" />
            <text x="385" y="326" text-anchor="middle" class="name">Braintree</text>
            <text x="385" y="346" text-anchor="middle" class="sub">payments · extern</text>
          </g>
          <g class="node ext" :class="{ hot: hot === 'sentry' }" @mouseenter="hot = 'sentry'">
            <rect x="780" y="420" width="170" height="64" rx="8" />
            <text x="865" y="446" text-anchor="middle" class="name">Sentry</text>
            <text x="865" y="466" text-anchor="middle" class="sub">errors · tracing · extern</text>
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

    <!-- Diagramm 2: KI-Agenten-Workflow -->
    <div v-reveal class="dia-wrap second">
      <div class="bar">
        <span class="dots"><i /><i /><i /></span>
        <span class="title">~/architecture — {{ t('sandbox.arch.d2Title') }}</span>
      </div>
      <div class="dia-scroll">
        <svg viewBox="0 0 960 300" width="960" height="300" class="dia">
          <g class="edges">
            <path d="M 190 150 H 250" />
            <path d="M 420 150 H 470 V 62 H 510" />
            <path d="M 420 150 H 510" />
            <path d="M 470 150 V 238 H 510" />
            <path d="M 690 62 H 740 V 150 H 770" />
            <path d="M 690 150 H 770" />
            <path d="M 690 238 H 740 V 150" />
          </g>
          <g class="node" >
            <rect x="40" y="118" width="150" height="64" rx="8" />
            <text x="115" y="144" text-anchor="middle" class="name">Ticket</text>
            <text x="115" y="164" text-anchor="middle" class="sub">feature · bug</text>
          </g>
          <g class="node core">
            <rect x="250" y="118" width="170" height="64" rx="8" />
            <text x="335" y="144" text-anchor="middle" class="name">David</text>
            <text x="335" y="164" text-anchor="middle" class="sub">architektur · plan</text>
          </g>
          <g class="node mint">
            <rect x="510" y="30" width="180" height="64" rx="8" />
            <text x="600" y="56" text-anchor="middle" class="name">agent:code</text>
            <text x="600" y="76" text-anchor="middle" class="sub">implementierung</text>
          </g>
          <g class="node mint">
            <rect x="510" y="118" width="180" height="64" rx="8" />
            <text x="600" y="144" text-anchor="middle" class="name">agent:test</text>
            <text x="600" y="164" text-anchor="middle" class="sub">unit · integration</text>
          </g>
          <g class="node mint">
            <rect x="510" y="206" width="180" height="64" rx="8" />
            <text x="600" y="232" text-anchor="middle" class="name">agent:docs</text>
            <text x="600" y="252" text-anchor="middle" class="sub">doku · changelog</text>
          </g>
          <g class="node core">
            <rect x="770" y="118" width="180" height="64" rx="8" />
            <text x="860" y="144" text-anchor="middle" class="name">David · Review</text>
            <text x="860" y="164" text-anchor="middle" class="sub">jede zeile → merge · deploy</text>
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
  font-size: 14px;
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
