<script setup lang="ts">
withDefaults(defineProps<{
  name?: string
  city?: string
  status?: 'available' | 'charging' | 'maintenance'
  connectors?: string[]
  price?: string
}>(), {
  name: 'Hafenstraße 12',
  city: 'Hamburg',
  status: 'available',
  connectors: () => ['CCS · 150 kW', 'Typ2 · 22 kW'],
  price: '0,49 € / kWh',
})

const statusColor = { available: 'mint', charging: 'amber', maintenance: 'muted' } as const
const statusLabel = { available: 'frei', charging: 'lädt', maintenance: 'wartung' } as const
</script>

<template>
  <article class="vg-station">
    <header>
      <div>
        <h4>{{ name }}</h4>
        <p class="city">{{ city }}</p>
      </div>
      <DgTag :color="statusColor[status]">● {{ statusLabel[status] }}</DgTag>
    </header>
    <div class="connectors">
      <span v-for="c in connectors" :key="c">{{ c }}</span>
    </div>
    <footer>
      <span class="price">{{ price }}</span>
      <DgButton :disabled="status !== 'available'">→ laden</DgButton>
    </footer>
  </article>
</template>

<style scoped>
.vg-station {
  background: linear-gradient(160deg, var(--surface-2), var(--surface));
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 380px;
}
.vg-station header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}
.vg-station h4 {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}
.city {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--faint);
  margin-top: 3px;
}
.connectors {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.connectors span {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--muted);
  border: 1px solid var(--line);
  border-radius: 4px;
  padding: 5px 10px;
}
.vg-station footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.price {
  font-family: var(--font-mono);
  font-size: 13.5px;
  color: var(--amber);
}
</style>
