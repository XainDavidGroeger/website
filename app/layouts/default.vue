<script setup lang="ts">
const { t, locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const otherLocale = computed(() =>
  locales.value.find(l => l.code !== locale.value),
)
</script>

<template>
  <div class="site">
    <header class="site-head">
      <div class="wrap bar">
        <NuxtLink :to="locale === 'de' ? '/' : '/en'" class="logo" aria-label="Startseite">
          <span class="tick">&lt;</span>dg <span class="tick">/&gt;</span>
        </NuxtLink>
        <nav class="nav" :aria-label="t('nav.label')">
          <a href="#work">{{ t('nav.work') }}</a>
          <a href="#log">{{ t('nav.log') }}</a>
          <a href="#init">{{ t('nav.contact') }}</a>
          <NuxtLink
            v-if="otherLocale"
            :to="switchLocalePath(otherLocale.code)"
            class="lang"
          >
            {{ otherLocale.code.toUpperCase() }}
          </NuxtLink>
        </nav>
      </div>
    </header>

    <main>
      <slot />
    </main>

    <footer class="site-foot">
      <div class="wrap bar">
        <span>© {{ new Date().getFullYear() }} David Gröger</span>
        <span class="dim">// build successful ✓</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.site {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

.site-head {
  position: sticky;
  top: 0;
  z-index: 10;
  background: color-mix(in srgb, var(--bg) 82%, transparent);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--line);
}

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-block: 14px;
}

.logo {
  font-family: var(--font-mono);
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
}
.logo .tick {
  color: var(--amber);
}

.nav {
  display: flex;
  align-items: center;
  gap: 22px;
  font-family: var(--font-mono);
  font-size: 13.5px;
}
.nav a {
  color: var(--muted);
  transition: color 0.2s ease;
}
.nav a:hover {
  color: var(--amber);
}

.lang {
  border: 1px solid var(--line);
  border-radius: 4px;
  padding: 3px 9px;
  color: var(--text);
}

.site-foot {
  border-top: 1px solid var(--line);
  font-family: var(--font-mono);
  font-size: 12.5px;
  color: var(--faint);
}
.site-foot .dim {
  color: var(--mint);
}
</style>
