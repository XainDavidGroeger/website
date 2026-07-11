export default defineNuxtConfig({
  compatibilityDate: '2026-07-11',
  devtools: { enabled: true },
  modules: ['@nuxtjs/i18n'],
  css: [
    '~/assets/css/tokens.css',
    '@fontsource-variable/jetbrains-mono',
  ],
  app: {
    head: {
      title: 'David Gröger — Webentwickler',
      meta: [
        { name: 'description', content: 'Full-Stack-Webentwickler seit 2013 — ich baue Plattformen, die Menschen zusammenbringen. Laravel, Vue, Python, KI-gestützte Workflows.' },
        { name: 'theme-color', content: '#0B0F1A' },
      ],
      link: [
        { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/ClashDisplay-Variable.woff2', crossorigin: '' },
        { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/Satoshi-Variable.woff2', crossorigin: '' },
      ],
    },
  },
  i18n: {
    defaultLocale: 'de',
    strategy: 'prefix_except_default',
    baseUrl: 'https://david-webdev.de',
    locales: [
      { code: 'de', language: 'de-DE', file: 'de.json', name: 'Deutsch' },
      { code: 'en', language: 'en-US', file: 'en.json', name: 'English' },
    ],
  },
})
