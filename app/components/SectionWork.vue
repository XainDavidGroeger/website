<script setup lang="ts">
const { t } = useI18n()

const featured = [
  { key: 'schnappern', url: 'https://schnappern.com' },
  { key: 'socialmatch', url: 'https://socialmatch.de' },
  { key: 'teamevent', url: 'https://mein-teamevent.de' },
  { key: 'singalong', url: 'https://singalong.de' },
  { key: 'weinhopping', url: 'https://www.weinhopping.com' },
  { key: 'speeddating', url: 'https://speeddating-xxl.de' },
]

const freelance = [
  { key: 'muziqme', url: 'https://self-booking.muziqme.de' },
  { key: 'buggyfit', url: 'https://www.buggyfit.de' },
]
</script>

<template>
  <section id="work" class="section">
    <div class="wrap">
      <div v-reveal class="sec-head">
        <p class="eyebrow"><span class="tick">/* work */</span> {{ t('work.eyebrow') }}</p>
        <h2>{{ t('work.title') }}</h2>
        <p class="lede">{{ t('work.lede') }}</p>
      </div>

      <p v-reveal class="shelf-label">// {{ t('work.shelfOwn') }}</p>
      <div class="cases">
        <a
          v-for="item in featured"
          :key="item.key"
          v-tilt
          v-reveal
          class="case"
          :href="item.url"
          target="_blank"
          rel="noopener"
        >
          <span class="tag">{{ t('work.tagOwn') }}</span>
          <h3>{{ t(`work.cases.${item.key}.name`) }}</h3>
          <p>{{ t(`work.cases.${item.key}.desc`) }}</p>
          <span class="arrow">{{ t('work.visit') }}</span>
        </a>
      </div>

      <p v-reveal class="shelf-label">// {{ t('work.shelfFreelance') }}</p>
      <div class="cases two">
        <a
          v-for="item in freelance"
          :key="item.key"
          v-tilt
          v-reveal
          class="case"
          :href="item.url"
          target="_blank"
          rel="noopener"
        >
          <span class="tag mint">{{ t('work.tagFreelance') }}</span>
          <h3>{{ t(`work.cases.${item.key}.name`) }}</h3>
          <p>{{ t(`work.cases.${item.key}.desc`) }}</p>
          <span class="arrow">{{ t('work.visit') }}</span>
        </a>
      </div>

      <p v-reveal class="archive">
        <span class="label">// {{ t('work.shelfArchive') }}:</span>
        {{ t('work.archive') }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.shelf-label {
  font-family: var(--font-mono);
  font-size: 12.5px;
  letter-spacing: 0.06em;
  color: var(--faint);
  margin-bottom: 14px;
}
.cases + .shelf-label,
.shelf-label:not(:first-of-type) {
  margin-top: 36px;
}

.cases {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}
.cases.two {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  max-width: 720px;
}

.case {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: linear-gradient(160deg, var(--surface-2), var(--surface));
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 26px 24px;
  color: var(--text);
  transform-style: preserve-3d;
  transition: transform 0.2s ease, border-color 0.2s ease;
  will-change: transform;
}
.case:hover {
  border-color: var(--amber);
}

.case .tag {
  font-family: var(--font-mono);
  font-size: 11.5px;
  letter-spacing: 0.06em;
  color: var(--amber);
}
.case .tag.mint {
  color: var(--mint);
}

.case h3 {
  font-size: 19px;
  font-weight: 700;
}

.case p {
  color: var(--muted);
  font-size: 14px;
  line-height: 1.6;
}

.case .arrow {
  margin-top: auto;
  padding-top: 8px;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--mint);
}

.archive {
  margin-top: 34px;
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
</style>
