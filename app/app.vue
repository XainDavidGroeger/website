<script setup lang="ts">
const { locale, t } = useI18n()

useHead({
  htmlAttrs: { lang: () => locale.value },
})

useSeoMeta({
  ogTitle: () => t('meta.title'),
  ogDescription: () => t('meta.description'),
  ogImage: 'https://david-webdev.de/og.jpg',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
