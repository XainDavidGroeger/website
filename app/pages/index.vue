<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => t('meta.title'),
  description: () => t('meta.description'),
})

/* Typing-Zeile im Hero — tippt die compile()-Zeile, dann steigt der Name auf */
const typed = ref('')
const typingDone = ref(false)
const typeTarget = 'const seite = compile("erfahrung", "handwerk", "ki-crew");'

onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) {
    typed.value = typeTarget
    typingDone.value = true
    return
  }
  let i = 0
  const step = () => {
    if (i >= typeTarget.length) {
      typingDone.value = true
      return
    }
    typed.value = typeTarget.slice(0, ++i)
    setTimeout(step, 28)
  }
  setTimeout(step, 400)
})
</script>

<template>
  <div>
    <section class="hero">
      <div class="hero-grid" aria-hidden="true" />
      <div class="wrap hero-inner">
        <p class="eyebrow">
          <span class="tick">/*</span> {{ t('hero.eyebrow') }} <span class="tick">*/</span>
        </p>

        <p class="typeline" :aria-label="typeTarget">
          <span aria-hidden="true">{{ typed }}</span><span v-if="!typingDone" class="caret" aria-hidden="true" />
        </p>

        <h1 :class="{ show: typingDone }">
          <span class="row"><span>David</span></span>
          <span class="row"><span class="outline">Gröger</span></span>
        </h1>

        <p class="hero-sub">
          {{ t('hero.sub') }}
        </p>

        <div class="hero-cta">
          <a href="#work" class="btn btn-primary">{{ t('hero.ctaWork') }}</a>
          <a href="#init" class="btn">{{ t('hero.ctaContact') }}</a>
        </div>
      </div>

      <a href="#work" class="scroll-hint" aria-hidden="true">↓ scroll</a>
    </section>

    <SectionAbout />
    <SectionStack />
    <SectionLog />

    <!-- Platzhalter: Case Studies folgen in Phase 3 -->
    <section id="work" class="stub wrap">
      <p class="eyebrow"><span class="tick">/* work */</span> {{ t('stub.work') }}</p>
    </section>

    <SectionContact />
  </div>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  overflow: hidden;
}

.hero-grid {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(var(--line) 1px, transparent 1px) 0 0 / 100% 72px,
    linear-gradient(90deg, var(--line) 1px, transparent 1px) 0 0 / 72px 100%;
  opacity: 0.16;
  mask-image: radial-gradient(ellipse 90% 80% at 50% 30%, black 30%, transparent 75%);
  pointer-events: none;
}

.hero-inner {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding-block: 80px;
  width: 100%;
}

.typeline {
  font-family: var(--font-mono);
  font-size: clamp(13px, 1.6vw, 16px);
  color: var(--muted);
  min-height: 1.5em;
}

.caret {
  display: inline-block;
  width: 0.6em;
  height: 1.15em;
  background: var(--amber);
  vertical-align: text-bottom;
  animation: blink 1s steps(1) infinite;
}
@keyframes blink {
  50% {
    opacity: 0;
  }
}

h1 {
  font-size: clamp(56px, 11vw, 150px);
  line-height: 0.94;
  font-weight: 700;
  letter-spacing: -0.03em;
  text-transform: uppercase;
}
h1 .row {
  display: block;
  overflow: hidden;
}
h1 .row span {
  display: inline-block;
  transform: translateY(110%);
  transition: transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1);
}
h1.show .row span {
  transform: translateY(0);
}
h1 .row:nth-child(2) span {
  transition-delay: 0.1s;
}
h1 .outline {
  color: transparent;
  -webkit-text-stroke: 1.5px var(--amber);
}

.hero-sub {
  max-width: 56ch;
  font-size: clamp(16px, 2vw, 19px);
  color: var(--muted);
}

.hero-cta {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.btn {
  font-family: var(--font-mono);
  font-size: 14px;
  border: 1px solid var(--line);
  border-radius: 5px;
  padding: 12px 22px;
  color: var(--text);
  transition: transform 0.15s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}
.btn:hover {
  transform: translateY(-2px);
  border-color: var(--amber);
}
.btn-primary {
  background: var(--amber);
  border-color: var(--amber);
  color: var(--bg);
  font-weight: 600;
}
.btn-primary:hover {
  box-shadow: 0 6px 24px var(--amber-dim);
}

.scroll-hint {
  position: absolute;
  bottom: 22px;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--faint);
  animation: bob 2.4s ease-in-out infinite;
}
@keyframes bob {
  0%,
  100% {
    transform: translate(-50%, 0);
  }
  50% {
    transform: translate(-50%, 8px);
  }
}

.stub {
  padding-block: 120px;
  border-top: 1px solid var(--line);
}

@media (prefers-reduced-motion: reduce) {
  h1 .row span {
    transform: none;
    transition: none;
  }
  .caret,
  .scroll-hint {
    animation: none;
  }
}
</style>
