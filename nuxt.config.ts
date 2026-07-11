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
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/ClashDisplay-Variable.woff2', crossorigin: '' },
        { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/Satoshi-Variable.woff2', crossorigin: '' },
      ],
      script: [
        // Theme vor dem ersten Paint setzen (kein FOUC beim Light-Theme)
        { innerHTML: '(function(){try{var t=localStorage.getItem("theme");if(t)document.documentElement.dataset.theme=t}catch(e){}})()' },
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
