<script setup lang="ts">
const { t } = useI18n()

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
  <section id="sandbox" class="section">
    <div class="wrap">
      <div v-reveal class="sec-head">
        <p class="eyebrow"><span class="tick">/* sandbox */</span> {{ t('sandboxTeaser.eyebrow') }}</p>
        <h2>{{ t('sandboxTeaser.title') }}</h2>
        <p class="lede">{{ t('sandboxTeaser.lede') }}</p>
      </div>

      <div v-reveal class="areas">
        <NuxtLinkLocale
          v-for="area in areas"
          :key="area.key"
          :to="area.to"
          class="area-chip"
        >
          <span class="icon" aria-hidden="true">{{ area.icon }}</span>
          {{ t(`sandbox.areas.${area.key}.title`) }}
        </NuxtLinkLocale>
      </div>

      <div v-reveal class="cta">
        <NuxtLinkLocale to="/sandbox" class="btn-primary">
          {{ t('sandboxTeaser.cta') }}
        </NuxtLinkLocale>
        <span class="cta-hint">{{ t('sandboxTeaser.ctaHint') }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.areas {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 30px;
}

.area-chip {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--muted);
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 10px 16px;
  transition: border-color 0.2s ease, color 0.2s ease, transform 0.15s ease;
}
.area-chip:hover {
  border-color: var(--amber);
  color: var(--text);
  transform: translateY(-2px);
}
.area-chip .icon {
  color: var(--amber);
  font-size: 14px;
}

.cta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.btn-primary {
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 600;
  background: var(--amber);
  border: 1px solid var(--amber);
  border-radius: 5px;
  padding: 13px 26px;
  color: var(--bg);
  transition: transform 0.15s ease, box-shadow 0.2s ease;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px var(--amber-dim);
}
.cta-hint {
  font-family: var(--font-mono);
  font-size: 12.5px;
  color: var(--faint);
}
</style>
