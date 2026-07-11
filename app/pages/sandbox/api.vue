<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => `${t('sandbox.areas.api.title')} — David Gröger`,
  description: () => t('sandbox.areas.api.desc'),
})

const swaggerEl = ref<HTMLElement | null>(null)
const origin = useRequestURL().origin

onMounted(async () => {
  // Swagger UI nur hier laden (~1 MB) — nicht ins Haupt-Bundle
  const [mod] = await Promise.all([
    // @ts-expect-error kein Typ-Paket für den ES-Bundle-Einstieg
    import('swagger-ui-dist/swagger-ui-es-bundle.js'),
    // @ts-expect-error CSS-Import
    import('swagger-ui-dist/swagger-ui.css'),
  ])
  const SwaggerUIBundle = mod.default ?? mod.SwaggerUIBundle
  SwaggerUIBundle({
    url: '/openapi.json',
    domNode: swaggerEl.value,
    deepLinking: false,
    tryItOutEnabled: true,
    defaultModelsExpandDepth: 0,
  })
})
</script>

<template>
  <div class="wrap page">
    <div v-reveal class="sec-head">
      <p class="eyebrow">
        <NuxtLinkLocale to="/sandbox" class="crumb">/* sandbox */</NuxtLinkLocale> → api
      </p>
      <h2>{{ t('sandbox.api.title') }}</h2>
      <p class="lede">{{ t('sandbox.api.lede') }}</p>
    </div>

    <div v-reveal class="quick">
      <DgWindow title="~/quickstart — curl">
        <pre>curl {{ origin }}/api/v1/events?city=Berlin

curl -X POST {{ origin }}/api/v1/bookings \
  -H "Content-Type: application/json" \
  -d '{"eventId": 3, "name": "Ada", "email": "ada@example.org", "seats": 2}'</pre>
      </DgWindow>
    </div>

    <ClientOnly>
      <div ref="swaggerEl" class="swagger-host" />
      <template #fallback>
        <p class="loading">// swagger ui lädt …</p>
      </template>
    </ClientOnly>

    <p v-reveal class="note">{{ t('sandbox.api.note') }}</p>
  </div>
</template>

<style scoped>
.page {
  padding-block: 110px;
}
.crumb {
  color: var(--amber);
}
.quick {
  margin-bottom: 34px;
}
.quick pre {
  margin: 0;
  overflow-x: auto;
  color: var(--mint);
}
.loading {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--faint);
}
.note {
  margin-top: 26px;
  font-size: 13.5px;
  color: var(--faint);
}
</style>

<style>
/* Swagger UI aufs Design-System einfärben (global, da Fremd-DOM) */
.swagger-host .swagger-ui {
  font-family: var(--font-body);
  color: var(--text);
}
.swagger-host .swagger-ui,
.swagger-host .swagger-ui .wrapper {
  background: transparent;
}
.swagger-host .swagger-ui .info .title,
.swagger-host .swagger-ui .opblock-tag,
.swagger-host .swagger-ui .opblock .opblock-summary-description,
.swagger-host .swagger-ui .opblock-description-wrapper p,
.swagger-host .swagger-ui .info li,
.swagger-host .swagger-ui .info p,
.swagger-host .swagger-ui table thead tr th,
.swagger-host .swagger-ui .parameter__name,
.swagger-host .swagger-ui .parameter__type,
.swagger-host .swagger-ui .response-col_status,
.swagger-host .swagger-ui .response-col_links,
.swagger-host .swagger-ui .responses-inner h4,
.swagger-host .swagger-ui .responses-inner h5,
.swagger-host .swagger-ui .opblock .opblock-section-header h4,
.swagger-host .swagger-ui .tab li,
.swagger-host .swagger-ui .model,
.swagger-host .swagger-ui .model-title,
.swagger-host .swagger-ui section.models h4 {
  color: var(--text);
}
.swagger-host .swagger-ui .markdown p,
.swagger-host .swagger-ui .response-col_description__inner p,
.swagger-host .swagger-ui table.parameters td {
  color: var(--muted);
}
.swagger-host .swagger-ui .opblock {
  background: var(--surface);
  border-color: var(--line);
  box-shadow: none;
}
.swagger-host .swagger-ui .opblock .opblock-section-header {
  background: var(--surface-2);
  box-shadow: none;
}
.swagger-host .swagger-ui section.models,
.swagger-host .swagger-ui section.models .model-container {
  background: var(--surface);
  border-color: var(--line);
}
.swagger-host .swagger-ui input,
.swagger-host .swagger-ui textarea,
.swagger-host .swagger-ui select {
  background: var(--bg-deep);
  color: var(--text);
  border-color: var(--line);
}
.swagger-host .swagger-ui .btn {
  color: var(--text);
  border-color: var(--line);
}
.swagger-host .swagger-ui .btn.execute {
  background: var(--amber);
  border-color: var(--amber);
  color: var(--bg);
}
.swagger-host .swagger-ui .info .base-url,
.swagger-host .swagger-ui .info a {
  color: var(--amber);
}
</style>
