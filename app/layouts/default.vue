<script setup lang="ts">
const { t, locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const { toggle: toggleTheme } = useTheme()

const paletteOpen = useState('palette-open', () => false)

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
          <a :href="`${locale === 'de' ? '' : '/en'}/#work`">{{ t('nav.work') }}</a>
          <a :href="`${locale === 'de' ? '' : '/en'}/#log`">{{ t('nav.log') }}</a>
          <NuxtLinkLocale to="/sandbox">{{ t('nav.sandbox') }}</NuxtLinkLocale>
          <a :href="`${locale === 'de' ? '' : '/en'}/#init`">{{ t('nav.contact') }}</a>
          <button class="ctrl" type="button" :aria-label="t('nav.themeAria')" @click="toggleTheme">◐</button>
          <button class="ctrl kbd" type="button" :aria-label="t('nav.paletteAria')" @click="paletteOpen = true">⌘K</button>
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

    <AppPalette />
    <ClientOnly>
      <CompanionBot />
    </ClientOnly>
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

.ctrl {
  font-family: var(--font-mono);
  font-size: 13px;
  background: none;
  border: 1px solid transparent;
  border-radius: 4px;
  padding: 3px 8px;
  color: var(--muted);
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease;
}
.ctrl:hover {
  color: var(--amber);
}
.ctrl.kbd {
  border-color: var(--line);
  font-size: 11.5px;
}
@media (max-width: 560px) {
  .ctrl.kbd {
    display: none;
  }
}

/* Mobil: Nav darf umbrechen und wird kompakter */
@media (max-width: 640px) {
  .bar {
    flex-wrap: wrap;
    row-gap: 2px;
    padding-block: 10px;
  }
  .nav {
    flex-wrap: wrap;
    gap: 8px 14px;
    font-size: 12.5px;
    justify-content: flex-end;
  }
  .lang {
    padding: 2px 7px;
  }
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
