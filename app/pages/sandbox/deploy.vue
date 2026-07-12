<script setup lang="ts">
import type { ConsoleLine } from '~/components/ConsolePlayer.vue'

const { t } = useI18n()

useSeoMeta({
  title: () => `${t('sandbox.areas.deploy.title')} · David Gröger`,
  description: () => t('sandbox.areas.deploy.desc'),
})

/* Konsolen-Output bleibt bewusst englisch · wie echte Pipeline-Logs */
const deployRun: ConsoleLine[] = [
  { text: '$ git push origin main', kind: 'cmd', delay: 700 },
  { text: '→ pipeline #482 triggered · commit 4f2a9c1 "fix: tariff rounding"', kind: 'info', delay: 500 },
  { text: '', delay: 200 },
  { text: '  [1/6] lint & static analysis', kind: 'warn', delay: 420 },
  { text: '  ✓ pint · phpstan level 8 · eslint (12s)', kind: 'ok', delay: 600 },
  { text: '', delay: 150 },
  { text: '  [2/6] tests', kind: 'warn', delay: 380 },
  { text: '  ✓ 38 passed · coverage 94.7 % ≥ gate 90 % (41s)', kind: 'ok', delay: 700 },
  { text: '', delay: 150 },
  { text: '  [3/6] build', kind: 'warn', delay: 380 },
  { text: '  ✓ docker image voltgrid:1.8.3 · 84 MB (58s)', kind: 'ok', delay: 700 },
  { text: '  ✓ pushed to registry.voltgrid.internal', kind: 'ok', delay: 420 },
  { text: '', delay: 150 },
  { text: '  [4/6] migrate', kind: 'warn', delay: 380 },
  { text: '  ✓ 2 migrations applied · 0.4s · rollback plan ready', kind: 'ok', delay: 550 },
  { text: '', delay: 150 },
  { text: '  [5/6] deploy staging', kind: 'warn', delay: 380 },
  { text: '  ✓ health checks green · smoke tests passed (22s)', kind: 'ok', delay: 700 },
  { text: '', delay: 150 },
  { text: '  [6/6] rollout production', kind: 'warn', delay: 380 },
  { text: '  → canary 10 % … error rate 0.00 % · p95 82 ms', kind: 'info', delay: 900 },
  { text: '  → canary 50 % … error rate 0.00 % · p95 84 ms', kind: 'info', delay: 900 },
  { text: '  ✓ rollout 100 % · 6 pods rolling · zero downtime', kind: 'ok', delay: 600 },
  { text: '', delay: 250 },
  { text: '  ● deployment live · 3m 41s from push to production 🚀', kind: 'done', delay: 400 },
]
</script>

<template>
  <div class="wrap page">
    <div v-reveal class="sec-head">
      <p class="eyebrow">
        <NuxtLinkLocale to="/sandbox" class="crumb">/* voltgrid */</NuxtLinkLocale> → deploy
      </p>
      <h2>{{ t('sandbox.deploy.title') }}</h2>
      <p class="lede">{{ t('sandbox.deploy.lede') }}</p>
    </div>

    <div v-reveal>
      <ConsolePlayer title="~/voltgrid · ci/cd · pipeline #482" :lines="deployRun" />
    </div>

    <div v-reveal class="facts">
      <div class="fact">
        <p class="k">gates</p>
        <p>{{ t('sandbox.deploy.factGates') }}</p>
      </div>
      <div class="fact">
        <p class="k">canary</p>
        <p>{{ t('sandbox.deploy.factCanary') }}</p>
      </div>
      <div class="fact">
        <p class="k">rollback</p>
        <p>{{ t('sandbox.deploy.factRollback') }}</p>
      </div>
    </div>

    <p v-reveal class="note">{{ t('sandbox.deploy.note') }}</p>
  </div>
</template>

<style scoped>
.page {
  padding-block: 110px;
}
.crumb {
  color: var(--amber);
}

.facts {
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 14px;
}
.fact {
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--surface);
  padding: 18px 20px;
}
.fact .k {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--amber);
  margin-bottom: 8px;
}
.fact p:last-child {
  color: var(--muted);
  font-size: 14px;
  line-height: 1.65;
}

.note {
  margin-top: 22px;
  font-size: 13.5px;
  color: var(--faint);
}
</style>
