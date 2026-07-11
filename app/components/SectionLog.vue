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
          viewBox="0 0 900 190"
          width="900"
          height="190"
          role="img"
          :aria-label="t('log.graphAlt')"
        >
          <line class="lane" x1="30" y1="95" x2="870" y2="95" stroke-dasharray="3 6" />
          <path class="commitline draw" d="M 60 95 L 220 95 L 300 45 L 460 45 L 540 95 L 700 95 L 840 95" />
          <circle class="node" cx="60" cy="95" r="7" />
          <circle class="node" cx="220" cy="95" r="7" />
          <circle class="node" cx="380" cy="45" r="7" />
          <circle class="node" cx="540" cy="95" r="7" />
          <circle class="node head" cx="840" cy="95" r="8" />
          <text x="60" y="128" text-anchor="middle">modotex</text>
          <text class="year" x="60" y="144" text-anchor="middle">2013</text>
          <text x="220" y="128" text-anchor="middle">HTW Berlin</text>
          <text class="year" x="220" y="144" text-anchor="middle">B.Sc. 2017</text>
          <text x="380" y="28" text-anchor="middle">XAIN AG</text>
          <text class="tag" x="380" y="70" text-anchor="middle">tag: teamlead</text>
          <text x="540" y="128" text-anchor="middle">{{ t('log.freelance') }}</text>
          <text class="tag" x="540" y="144" text-anchor="middle">{{ t('log.freelanceTag') }}</text>
          <text x="840" y="128" text-anchor="middle">Pflegehelden</text>
          <text class="tag" x="840" y="144" text-anchor="middle">HEAD → senior</text>
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
  min-width: 860px;
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
}
.git-svg .node {
  fill: var(--bg);
  stroke: var(--amber);
  stroke-width: 2.5;
}
.git-svg .node.head {
  fill: var(--amber);
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

/* Linie zeichnet sich, sobald der Container im Viewport ist (.reveal.in) */
.git-svg .draw {
  stroke-dasharray: 900;
  stroke-dashoffset: 900;
}
.reveal.in .draw {
  animation: dash 2.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
@keyframes dash {
  to {
    stroke-dashoffset: 0;
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
  .git-svg .draw {
    stroke-dashoffset: 0;
  }
  .reveal.in .draw {
    animation: none;
  }
}
</style>
