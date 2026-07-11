<script setup lang="ts">
withDefaults(defineProps<{
  label?: string
  value?: string
  delta?: string
  deltaColor?: 'mint' | 'amber'
}>(), {
  label: 'aktive sessions',
  value: '312',
  delta: '+12 %',
  deltaColor: 'mint',
})
</script>

<template>
  <div class="vg-stat">
    <p class="label">{{ label }}</p>
    <p class="value">{{ value }}</p>
    <p class="delta" :class="deltaColor">{{ delta }}</p>
  </div>
</template>

<style scoped>
.vg-stat {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 150px;
}
.label {
  font-family: var(--font-mono);
  font-size: 11.5px;
  letter-spacing: 0.06em;
  color: var(--faint);
}
.value {
  font-family: var(--font-display);
  font-size: 34px;
  font-weight: 700;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}
.delta {
  font-family: var(--font-mono);
  font-size: 12.5px;
}
.delta.mint {
  color: var(--mint);
}
.delta.amber {
  color: var(--amber);
}
</style>
