<script setup lang="ts">
const { t } = useI18n()

const groups = computed(() => [
  {
    key: 'backend',
    items: ['PHP', 'Laravel', 'Livewire', 'Python', 'Django', 'MySQL', 'REST APIs'],
  },
  {
    key: 'frontend',
    items: ['Vue', 'Nuxt', 'React', 'TypeScript', 'Tailwind', 'SASS', 'GSAP'],
  },
  {
    key: 'tooling',
    items: ['Git', 'Docker', 'CI/CD', 'Jira', t('stack.aiAgents'), 'Claude Code'],
  },
])
</script>

<template>
  <section id="stack" class="section">
    <div class="wrap">
      <div v-reveal class="sec-head">
        <p class="eyebrow"><span class="tick">/* stack */</span> {{ t('stack.eyebrow') }}</p>
        <h2>{{ t('stack.title') }}</h2>
        <p class="lede">{{ t('stack.lede') }}</p>
      </div>

      <div v-reveal class="matrix">
        <div v-for="group in groups" :key="group.key" class="group">
          <h3>
            <span class="dot" aria-hidden="true">▸</span>
            {{ t(`stack.groups.${group.key}`) }}
          </h3>
          <ul>
            <li v-for="item in group.items" :key="item">{{ item }}</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.matrix {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.group {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.group h3 {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.07em;
  color: var(--faint);
  text-transform: lowercase;
}
.group h3 .dot {
  color: var(--amber);
}

.group ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.group li {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--text);
  border: 1px solid var(--line);
  border-radius: 4px;
  padding: 7px 12px;
  transition: border-color 0.2s ease, transform 0.15s ease, color 0.2s ease;
  cursor: default;
}
.group li:hover {
  border-color: var(--amber);
  color: var(--amber);
  transform: translateY(-2px);
}
</style>
