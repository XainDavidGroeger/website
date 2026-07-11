<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'ghost'
  size?: 'md' | 'lg'
  disabled?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
})
</script>

<template>
  <button class="dg-btn" :class="[variant, size]" :disabled="disabled" type="button">
    <slot />
  </button>
</template>

<style scoped>
.dg-btn {
  font-family: var(--font-mono);
  border-radius: 5px;
  border: 1px solid var(--line);
  background: none;
  color: var(--text);
  cursor: pointer;
  transition: transform 0.15s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}
.dg-btn.md {
  font-size: 13.5px;
  padding: 11px 20px;
}
.dg-btn.lg {
  font-size: 15px;
  padding: 14px 28px;
}
.dg-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  border-color: var(--amber);
}
.dg-btn.primary {
  background: var(--amber);
  border-color: var(--amber);
  color: var(--bg);
  font-weight: 600;
}
.dg-btn.primary:hover:not(:disabled) {
  box-shadow: 0 6px 24px var(--amber-dim);
}
.dg-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>
