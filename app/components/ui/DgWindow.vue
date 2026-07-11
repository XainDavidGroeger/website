<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  variant?: 'terminal' | 'holo'
}>(), {
  title: '~/window',
  variant: 'terminal',
})
</script>

<template>
  <div class="dg-window" :class="variant">
    <div class="bar">
      <span class="dots"><i /><i /><i /></span>
      <span class="title">{{ title }}</span>
    </div>
    <div class="body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.dg-window {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--bg-deep);
  overflow: hidden;
}
.dg-window.holo {
  border-color: color-mix(in srgb, var(--mint) 35%, var(--line));
  background:
    linear-gradient(160deg, color-mix(in srgb, var(--mint) 6%, transparent), transparent 55%),
    var(--bg-deep);
  box-shadow: 0 0 42px color-mix(in srgb, var(--mint) 10%, transparent);
}
.bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-bottom: 1px solid var(--line);
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
.title {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--faint);
}
.body {
  padding: 16px 18px;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.9;
  color: var(--muted);
}
</style>
