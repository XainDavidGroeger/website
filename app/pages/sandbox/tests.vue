<script setup lang="ts">
import type { ConsoleLine } from '~/components/ConsolePlayer.vue'

const { t } = useI18n()

useSeoMeta({
  title: () => `${t('sandbox.areas.tests.title')} · David Gröger`,
  description: () => t('sandbox.areas.tests.desc'),
})

/* Konsolen-Output bleibt bewusst englisch · wie echte Test-Logs */
const testRun: ConsoleLine[] = [
  { text: '$ pest --coverage --parallel', kind: 'cmd', delay: 700 },
  { text: '', delay: 150 },
  { text: '  PASS  Tests\\Unit\\TariffCalculatorTest', kind: 'ok', delay: 420 },
  { text: '  ✓ calculates price per kwh', kind: 'ok', delay: 180 },
  { text: '  ✓ applies operator discount', kind: 'ok', delay: 160 },
  { text: '  ✓ rounds to full cents', kind: 'ok', delay: 160 },
  { text: '', delay: 120 },
  { text: '  PASS  Tests\\Unit\\ConnectorMatcherTest', kind: 'ok', delay: 380 },
  { text: '  ✓ matches ccs to ccs vehicles', kind: 'ok', delay: 160 },
  { text: '  ✓ rejects unsupported connectors', kind: 'ok', delay: 160 },
  { text: '', delay: 120 },
  { text: '  PASS  Tests\\Feature\\StationApiTest', kind: 'ok', delay: 420 },
  { text: '  ✓ lists stations filtered by city', kind: 'ok', delay: 160 },
  { text: '  ✓ filters by connector and min power', kind: 'ok', delay: 160 },
  { text: '  ✓ returns 404 for unknown station', kind: 'ok', delay: 160 },
  { text: '', delay: 120 },
  { text: '  PASS  Tests\\Feature\\SessionApiTest', kind: 'ok', delay: 420 },
  { text: '  ✓ starts a session on an available station', kind: 'ok', delay: 160 },
  { text: '  ✓ rejects sessions on maintenance stations (422)', kind: 'ok', delay: 160 },
  { text: '  ✓ rejects occupied stations (422)', kind: 'ok', delay: 160 },
  { text: '  ✓ validates estimated kwh range', kind: 'ok', delay: 160 },
  { text: '', delay: 250 },
  { text: '  Tests:    38 passed (112 assertions)', kind: 'info', delay: 300 },
  { text: '  Duration: 4.21s · parallel (8 processes)', kind: 'info', delay: 300 },
  { text: '', delay: 200 },
  { text: '  Http/Controllers ......... 96.4 %', kind: 'info', delay: 220 },
  { text: '  Services ................. 98.1 %', kind: 'info', delay: 220 },
  { text: '  Domain/Tariff ........... 100.0 %', kind: 'info', delay: 220 },
  { text: '', delay: 200 },
  { text: '  ● Total Coverage: 94.7 % · gate ≥ 90 % passed ✓', kind: 'done', delay: 400 },
]
</script>

<template>
  <div class="wrap page">
    <div v-reveal class="sec-head">
      <p class="eyebrow">
        <NuxtLinkLocale to="/sandbox" class="crumb">/* voltgrid */</NuxtLinkLocale> → tests
      </p>
      <h2>{{ t('sandbox.tests.title') }}</h2>
      <p class="lede">{{ t('sandbox.tests.lede') }}</p>
    </div>

    <div v-reveal>
      <ConsolePlayer title="~/voltgrid · pest · coverage" :lines="testRun" />
    </div>

    <div v-reveal class="facts">
      <div class="fact">
        <p class="k">unit</p>
        <p>{{ t('sandbox.tests.factUnit') }}</p>
      </div>
      <div class="fact">
        <p class="k">feature</p>
        <p>{{ t('sandbox.tests.factFeature') }}</p>
      </div>
      <div class="fact">
        <p class="k">gate</p>
        <p>{{ t('sandbox.tests.factGate') }}</p>
      </div>
    </div>

    <p v-reveal class="note">{{ t('sandbox.tests.note') }}</p>
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
