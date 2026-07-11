<script setup lang="ts">
withDefaults(defineProps<{
  color?: 'amber' | 'mint' | 'muted'
  outline?: boolean
}>(), {
  color: 'mint',
  outline: true,
})
</script>

<template>
  <span class="dg-tag" :class="[color, { outline }]">
    <slot />
  </span>
</template>

<style scoped>
.dg-tag {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 12.5px;
  letter-spacing: 0.04em;
  border-radius: 999px;
  padding: 5px 13px;
  border: 1px solid transparent;
}
.dg-tag.outline {
  border-color: var(--line);
}
.dg-tag.amber {
  color: var(--amber);
}
.dg-tag.amber.outline {
  border-color: color-mix(in srgb, var(--amber) 45%, var(--line));
}
.dg-tag.mint {
  color: var(--mint);
}
.dg-tag.mint.outline {
  border-color: color-mix(in srgb, var(--mint) 45%, var(--line));
}
.dg-tag.muted {
  color: var(--muted);
}
</style>
