<script setup lang="ts">
const { t } = useI18n()

const stations = ['ph', 'free', 'xain'] as const
</script>

<template>
  <section id="log" class="section">
    <div class="wrap">
      <div v-reveal class="sec-head">
        <p class="eyebrow"><span class="tick">/* log */</span> git log --oneline --graph</p>
        <h2>{{ t('log.title') }}</h2>
        <p class="lede">{{ t('log.lede') }}</p>
      </div>

      <div v-reveal class="git-wrap">
        <svg
          class="git-svg"
          viewBox="0 0 920 250"
          width="920"
          height="250"
          role="img"
          :aria-label="t('log.graphAlt')"
        >
          <!-- Basis-Lane -->
          <line class="lane" x1="30" y1="165" x2="890" y2="165" stroke-dasharray="3 6" />

          <!-- main: Anstellungen (Bernstein), XAIN als Bump -->
          <path class="commitline main-draw" d="M 60 165 L 240 165 L 320 95 L 420 95 L 500 165 L 830 165" />
          <!-- branch: freelance (Mint), forkt 2018 und ist bis heute offen -->
          <path class="branchline branch-draw" d="M 500 165 C 545 165 545 60 595 60 L 872 60" />
          <path class="branch-tip" d="M 872 52 L 886 60 L 872 68" />

          <!-- Komet, der die main-Line entlangfliegt -->
          <circle class="comet" r="4.5" />

          <!-- Nodes (gestaffelt aufpoppend) -->
          <circle class="node" style="--d: 0.25s" cx="60" cy="165" r="7" />
          <circle class="node" style="--d: 0.5s" cx="240" cy="165" r="7" />
          <circle class="node" style="--d: 0.75s" cx="370" cy="95" r="7" />
          <circle class="node mint" style="--d: 1.7s" cx="660" cy="60" r="7" />
          <circle class="head-ring" cx="830" cy="165" r="9" />
          <circle class="node head" style="--d: 1.5s" cx="830" cy="165" r="8" />

          <!-- Labels (gestaffelt einblendend) -->
          <g class="lbl" style="--d: 0.35s">
            <text x="60" y="198" text-anchor="middle">modotex</text>
            <text class="year" x="60" y="214" text-anchor="middle">2013</text>
          </g>
          <g class="lbl" style="--d: 0.6s">
            <text x="240" y="198" text-anchor="middle">HTW Berlin</text>
            <text class="year" x="240" y="214" text-anchor="middle">B.Sc. 2017</text>
          </g>
          <g class="lbl" style="--d: 0.85s">
            <text x="370" y="72" text-anchor="middle">XAIN AG</text>
            <text class="tag" x="370" y="122" text-anchor="middle">tag: teamlead</text>
          </g>
          <g class="lbl" style="--d: 1.8s">
            <text x="660" y="38" text-anchor="middle">{{ t('log.freelance') }}</text>
            <text class="tag" x="660" y="86" text-anchor="middle">{{ t('log.freelanceTag') }}</text>
          </g>
          <g class="lbl" style="--d: 2.15s">
            <text class="year" x="886" y="86" text-anchor="end">{{ t('log.branchActive') }}</text>
          </g>
          <g class="lbl" style="--d: 1.6s">
            <text x="830" y="198" text-anchor="middle">Pflegehelden</text>
            <text class="tag" x="830" y="214" text-anchor="middle">HEAD → senior</text>
          </g>
        </svg>
      </div>

      <div class="stations">
        <article v-for="key in stations" :key="key" v-reveal class="station">
          <header>
            <span class="hash">{{ t(`log.stations.${key}.hash`) }}</span>
            <h3>{{ t(`log.stations.${key}.role`) }}</h3>
            <p class="where">{{ t(`log.stations.${key}.where`) }}</p>
          </header>
          <p class="what">{{ t(`log.stations.${key}.what`) }}</p>
        </article>
      </div>

      <p v-reveal class="archive">
        <span class="label">{{ t('log.archiveLabel') }}</span>
        {{ t('log.archive') }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.git-wrap {
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--surface);
  padding: 24px 10px;
  overflow-x: auto;
  margin-bottom: 28px;
}

.git-svg {
  display: block;
  min-width: 880px;
  margin: 0 auto;
}
.git-svg .lane {
  stroke: var(--line);
  stroke-width: 2;
}

.git-svg .commitline {
  stroke: var(--amber);
  stroke-width: 2.5;
  fill: none;
  filter: drop-shadow(0 0 6px color-mix(in srgb, var(--amber) 55%, transparent));
}
.git-svg .branchline {
  stroke: var(--mint);
  stroke-width: 2.5;
  fill: none;
  filter: drop-shadow(0 0 6px color-mix(in srgb, var(--mint) 45%, transparent));
}
.git-svg .branch-tip {
  stroke: var(--mint);
  stroke-width: 2.5;
  fill: none;
  opacity: 0;
}

.git-svg .node {
  fill: var(--bg);
  stroke: var(--amber);
  stroke-width: 2.5;
  transform-box: fill-box;
  transform-origin: center;
  transform: scale(0);
}
.git-svg .node.mint {
  stroke: var(--mint);
}
.git-svg .node.head {
  fill: var(--amber);
}
.git-svg .head-ring {
  fill: none;
  stroke: var(--amber);
  stroke-width: 2;
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
}

.git-svg text {
  font-family: var(--font-mono);
  font-size: 11.5px;
  fill: var(--muted);
}
.git-svg .tag {
  fill: var(--mint);
}
.git-svg .year {
  fill: var(--faint);
}

.git-svg .lbl {
  opacity: 0;
  transform: translateY(6px);
}

.git-svg .comet {
  fill: #ffd08a;
  opacity: 0;
  offset-path: path('M 60 165 L 240 165 L 320 95 L 420 95 L 500 165 L 830 165');
  filter: drop-shadow(0 0 9px color-mix(in srgb, var(--amber) 90%, transparent));
}

/* Choreografie startet, sobald der Container im Viewport ist (.reveal.in):
   main zeichnet → Komet fliegt mit → Nodes poppen gestaffelt → branch forkt → HEAD pulsiert */
.git-svg .main-draw {
  stroke-dasharray: 830;
  stroke-dashoffset: 830;
}
.reveal.in .main-draw {
  animation: dash 1.7s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards;
}
.git-svg .branch-draw {
  stroke-dasharray: 430;
  stroke-dashoffset: 430;
}
.reveal.in .branch-draw {
  animation: dash 1.1s cubic-bezier(0.4, 0, 0.2, 1) 1.35s forwards;
}
.reveal.in .branch-tip {
  animation: fade-in 0.4s ease 2.3s forwards;
}
.reveal.in .comet {
  animation: comet 1.7s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards;
}
.reveal.in .node {
  animation: pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) var(--d, 0.3s) forwards;
}
.reveal.in .lbl {
  animation: fade-up 0.5s ease var(--d, 0.4s) forwards;
}
.reveal.in .head-ring {
  animation: ring 2.4s ease-out 1.9s infinite;
}

@keyframes dash {
  to {
    stroke-dashoffset: 0;
  }
}
@keyframes comet {
  0% {
    offset-distance: 0%;
    opacity: 1;
  }
  82% {
    opacity: 1;
  }
  100% {
    offset-distance: 100%;
    opacity: 0;
  }
}
@keyframes pop {
  0% {
    transform: scale(0);
  }
  62% {
    transform: scale(1.35);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes fade-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes fade-in {
  to {
    opacity: 1;
  }
}
@keyframes ring {
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

.stations {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.station {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.station .hash {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--amber);
}
.station h3 {
  font-size: 17px;
  font-weight: 600;
  margin-top: 6px;
}
.station .where {
  font-family: var(--font-mono);
  font-size: 12.5px;
  color: var(--faint);
}
.station .what {
  color: var(--muted);
  font-size: 14.5px;
}

.archive {
  margin-top: 26px;
  font-size: 14px;
  color: var(--faint);
  line-height: 1.9;
}
.archive .label {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--muted);
  margin-right: 8px;
}

@media (prefers-reduced-motion: reduce) {
  .git-svg .main-draw,
  .git-svg .branch-draw {
    stroke-dashoffset: 0;
    animation: none !important;
  }
  .git-svg .node {
    transform: none;
    animation: none !important;
  }
  .git-svg .lbl,
  .git-svg .branch-tip {
    opacity: 1;
    transform: none;
    animation: none !important;
  }
  .git-svg .comet,
  .git-svg .head-ring {
    display: none;
  }
}
</style>
