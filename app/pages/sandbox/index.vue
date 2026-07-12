<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => `${t('sandbox.title')} — David Gröger`,
  description: () => t('sandbox.lede'),
})

const areas = [
  { key: 'spec', to: '/sandbox/spec', icon: '§' },
  { key: 'arch', to: '/sandbox/architecture', icon: '◫' },
  { key: 'api', to: '/sandbox/api', icon: '{ }' },
  { key: 'code', to: '/sandbox/code', icon: '</>' },
  { key: 'ui', to: '/sandbox/ui', icon: '<∕>' },
  { key: 'demo', to: '/sandbox/demo', icon: '▶' },
  { key: 'tests', to: '/sandbox/tests', icon: '✓' },
  { key: 'deploy', to: '/sandbox/deploy', icon: '↥' },
]
</script>

<template>
  <div class="wrap page">
    <div v-reveal class="sec-head">
      <p class="eyebrow"><span class="tick">/* sandbox */</span> {{ t('sandbox.eyebrow') }}</p>
      <h2>{{ t('sandbox.title') }}</h2>
      <p class="lede">{{ t('sandbox.lede') }}</p>
      <p class="fictional"><DgTag color="amber">{{ t('sandbox.fictionalTag') }}</DgTag></p>
    </div>

    <div class="areas">
      <NuxtLinkLocale
        v-for="area in areas"
        :key="area.key"
        v-tilt
        v-reveal
        :to="area.to"
        class="area"
      >
        <span class="icon" aria-hidden="true">{{ area.icon }}</span>
        <h3>{{ t(`sandbox.areas.${area.key}.title`) }}</h3>
        <p>{{ t(`sandbox.areas.${area.key}.desc`) }}</p>
        <span class="arrow">{{ t('sandbox.open') }}</span>
      </NuxtLinkLocale>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding-block: 110px;
}
.fictional {
  margin-top: 4px;
}

.areas {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.area {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: linear-gradient(160deg, var(--surface-2), var(--surface));
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 28px 26px;
  color: var(--text);
  transform-style: preserve-3d;
  transition: transform 0.2s ease, border-color 0.2s ease;
  will-change: transform;
}
.area:hover {
  border-color: var(--amber);
}

.icon {
  font-family: var(--font-mono);
  font-size: 26px;
  color: var(--amber);
}
.area h3 {
  font-size: 19px;
  font-weight: 700;
}
.area p {
  color: var(--muted);
  font-size: 14px;
  line-height: 1.65;
}
.arrow {
  margin-top: auto;
  padding-top: 10px;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--mint);
}
</style>
