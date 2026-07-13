<script setup lang="ts">
const { t } = useI18n()

interface Project {
  key: string
  url: string
  logo?: string
  /* Fallback-Wasserzeichen, wenn kein Logo vorliegt */
  mark?: string
  /* Scroll-Aufnahme fürs Laptop-Mockup im Detail-Modal */
  rec?: string
}

const featured: Project[] = [
  { key: 'schnappern', url: 'https://schnappern.com', logo: '/img/work/schnappern.webp', rec: '/img/work/rec/schnappern.gif' },
  { key: 'singalong', url: 'https://singalong.de', logo: '/img/work/singalong.webp', rec: '/img/work/rec/singalong.gif' },
  { key: 'teamevent', url: 'https://mein-teamevent.de', logo: '/img/work/teamevent.webp', rec: '/img/work/rec/teamevent.gif' },
  { key: 'weinhopping', url: 'https://www.weinhopping.com', logo: '/img/work/weinhopping.webp' },
  { key: 'matchingnight', url: 'https://speeddating-xxl.de/matching-night', mark: 'MN' },
  { key: 'speeddating', url: 'https://speeddating-xxl.de', mark: 'XXL' },
  { key: 'socialmatch', url: 'https://socialmatch.de', logo: '/img/work/socialmatch.webp' },
]

const freelance: Project[] = [
  { key: 'muziqme', url: 'https://self-booking.muziqme.de', logo: '/img/work/muziqme.webp' },
  { key: 'buggyfit', url: 'https://www.buggyfit.de', logo: '/img/work/buggyfit.webp' },
]

const all = [...featured, ...freelance]
const selectedKey = ref<string | null>(null)
const selected = computed(() => all.find(p => p.key === selectedKey.value) ?? null)

function openModal(key: string) {
  selectedKey.value = key
}
function closeModal() {
  selectedKey.value = null
}

function onKey(ev: KeyboardEvent) {
  if (ev.key === 'Escape') closeModal()
}
watch(selectedKey, (value) => {
  document.body.style.overflow = value ? 'hidden' : ''
})
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})

const selectedTasks = computed(() =>
  selected.value ? t(`work.cases.${selected.value.key}.tasks`).split('\n') : [],
)
</script>

<template>
  <section id="work" class="section">
    <div class="wrap">
      <div v-reveal class="sec-head">
        <p class="eyebrow"><span class="tick">/* work */</span> {{ t('work.eyebrow') }}</p>
        <h2>{{ t('work.title') }}</h2>
        <p class="lede">{{ t('work.lede') }}</p>
      </div>

      <p v-reveal class="shelf-label">// {{ t('work.shelfOwn') }}</p>
      <div class="cases">
        <button
          v-for="item in featured"
          :key="item.key"
          v-tilt
          v-reveal
          class="case"
          type="button"
          @click="openModal(item.key)"
        >
          <img v-if="item.logo" class="wm" :src="item.logo" alt="" aria-hidden="true" loading="lazy">
          <span v-else-if="item.mark" class="wm-text" aria-hidden="true">{{ item.mark }}</span>
          <span class="tag">{{ t('work.tagOwn') }}</span>
          <h3>{{ t(`work.cases.${item.key}.name`) }}</h3>
          <p>{{ t(`work.cases.${item.key}.desc`) }}</p>
          <span class="arrow">{{ t('work.details') }}</span>
        </button>
      </div>

      <p v-reveal class="shelf-label">// {{ t('work.shelfFreelance') }}</p>
      <div class="cases two">
        <button
          v-for="item in freelance"
          :key="item.key"
          v-tilt
          v-reveal
          class="case"
          type="button"
          @click="openModal(item.key)"
        >
          <img v-if="item.logo" class="wm" :src="item.logo" alt="" aria-hidden="true" loading="lazy">
          <span class="tag mint">{{ t('work.tagFreelance') }}</span>
          <h3>{{ t(`work.cases.${item.key}.name`) }}</h3>
          <p>{{ t(`work.cases.${item.key}.desc`) }}</p>
          <span class="arrow">{{ t('work.details') }}</span>
        </button>
      </div>

      <p v-reveal class="archive">
        <span class="label">// {{ t('work.shelfArchive') }}:</span>
        {{ t('work.archive') }}
      </p>
    </div>

    <!-- Detail-Overlay -->
    <Teleport to="body">
      <Transition name="wmodal" :duration="220">
        <div v-if="selected" class="overlay" @click.self="closeModal">
          <div class="modal" role="dialog" :aria-label="t(`work.cases.${selected.key}.name`)">
            <header>
              <div>
                <p class="eyebrow">
                  <span class="tick">/* case */</span>
                  {{ t(featured.includes(selected) ? 'work.tagOwn' : 'work.tagFreelance') }}
                </p>
                <h3>{{ t(`work.cases.${selected.key}.name`) }}</h3>
              </div>
              <button class="close" type="button" :aria-label="t('work.close')" @click="closeModal">✕</button>
            </header>

            <!-- Scroll-Aufnahme im Laptop-Mockup (Screen-Position exakt vermessen) -->
            <figure v-if="selected.rec" class="device">
              <img class="device-frame" src="/img/work/laptop-frame.webp" alt="" width="1400" height="788">
              <img class="device-screen" :src="selected.rec" :alt="t('work.recAlt')" loading="lazy">
              <figcaption>{{ t('work.recCaption') }}</figcaption>
            </figure>

            <p class="about">{{ t(`work.cases.${selected.key}.about`) }}</p>

            <p class="sub">// {{ t('work.myWork') }}</p>
            <ul class="tasks">
              <li v-for="task in selectedTasks" :key="task">{{ task }}</li>
            </ul>

            <div class="meta">
              <p><span class="k">stack</span> {{ t(`work.cases.${selected.key}.stack`) }}</p>
              <p><span class="k">{{ t('work.since') }}</span> {{ t(`work.cases.${selected.key}.date`) }}</p>
            </div>

            <footer>
              <a class="btn btn-primary" :href="selected.url" target="_blank" rel="noopener">{{ t('work.website') }}</a>
              <button class="btn" type="button" @click="closeModal">{{ t('work.back') }}</button>
            </footer>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
.shelf-label {
  font-family: var(--font-mono);
  font-size: 12.5px;
  letter-spacing: 0.06em;
  color: var(--faint);
  margin-bottom: 14px;
}
.cases + .shelf-label,
.shelf-label:not(:first-of-type) {
  margin-top: 36px;
}

.cases {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}
.cases.two {
  max-width: 720px;
}

.case {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: 10px;
  background: linear-gradient(160deg, var(--surface-2), var(--surface));
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 26px 24px;
  color: var(--text);
  font: inherit;
  cursor: pointer;
  overflow: hidden;
  transform-style: preserve-3d;
  transition: transform 0.2s ease, border-color 0.2s ease;
  will-change: transform;
}
.case:hover {
  border-color: var(--amber);
}

/* Logo-Wasserzeichen: klein und scharf statt hochskaliert (Favicon-Quellen ~128px) */
.wm {
  position: absolute;
  right: 16px;
  bottom: 14px;
  width: 64px;
  height: 64px;
  object-fit: contain;
  opacity: 0.1;
  filter: grayscale(1) brightness(1.7);
  pointer-events: none;
  transition: opacity 0.25s ease, filter 0.25s ease;
}
.case:hover .wm {
  opacity: 0.28;
  filter: grayscale(0.2) brightness(1.15);
}
.wm-text {
  position: absolute;
  right: 12px;
  bottom: 4px;
  font-family: var(--font-display);
  font-size: 58px;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--text);
  opacity: 0.06;
  pointer-events: none;
  transition: opacity 0.25s ease;
}
.case:hover .wm-text {
  opacity: 0.12;
}

.case .tag {
  font-family: var(--font-mono);
  font-size: 11.5px;
  letter-spacing: 0.06em;
  color: var(--amber);
}
.case .tag.mint {
  color: var(--mint);
}
.case h3 {
  font-size: 19px;
  font-weight: 700;
}
.case p {
  color: var(--muted);
  font-size: 14px;
  line-height: 1.6;
}
.case .arrow {
  margin-top: auto;
  padding-top: 8px;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--mint);
}

.archive {
  margin-top: 34px;
  font-size: 14px;
  color: var(--faint);
  line-height: 1.9;
}
.archive .label {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--muted);
  margin-right: 8px;
}

/* ---------- Modal ---------- */
.overlay {
  position: fixed;
  inset: 0;
  z-index: 70;
  background: color-mix(in srgb, var(--bg-deep) 62%, transparent);
  backdrop-filter: blur(7px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 7vh 16px 24px;
  overflow-y: auto;
}

.modal {
  width: min(680px, 100%);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 8px;
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.55);
  padding: 30px 32px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.modal header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}
.modal h3 {
  font-family: var(--font-display);
  font-size: clamp(24px, 4vw, 34px);
  font-weight: 700;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  margin-top: 8px;
}
.modal .close {
  background: none;
  border: 1px solid var(--line);
  border-radius: 5px;
  color: var(--muted);
  font-size: 14px;
  padding: 6px 11px;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease;
}
.modal .close:hover {
  color: var(--amber);
  border-color: var(--amber);
}

/* Laptop-Mockup mit Scroll-Aufnahme: Screen-Öffnung per Pixel-Vermessung
   (scripts/measure-screen.mjs) — Werte gelten für laptop-frame.webp */
.device {
  margin: 0 auto;
  position: relative;
  max-width: 430px;
}
.device-frame {
  display: block;
  width: 100%;
  height: auto;
  position: relative;
  z-index: 2;
  pointer-events: none;
}
.device-screen {
  position: absolute;
  left: 10.79%;
  top: 8.51%;
  width: 78.37%;
  height: 63.45%;
  object-fit: cover;
  object-position: top center;
  z-index: 1;
  border-radius: 4px;
}
.device figcaption {
  margin-top: 8px;
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--faint);
  text-align: center;
}

.modal .about {
  color: var(--muted);
  line-height: 1.7;
  font-size: 15px;
}

.modal .sub {
  font-family: var(--font-mono);
  font-size: 12.5px;
  letter-spacing: 0.06em;
  color: var(--faint);
}

.tasks {
  margin: 0;
  padding-left: 20px;
  color: var(--muted);
  font-size: 14.5px;
  line-height: 1.9;
}
.tasks li::marker {
  color: var(--amber);
}

.meta {
  border-top: 1px solid var(--line);
  padding-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  color: var(--muted);
}
.meta .k {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--amber);
  display: inline-block;
  width: 64px;
}

.modal footer {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.btn {
  font-family: var(--font-mono);
  font-size: 13.5px;
  border: 1px solid var(--line);
  border-radius: 5px;
  padding: 11px 20px;
  color: var(--text);
  background: none;
  cursor: pointer;
  transition: transform 0.15s ease, border-color 0.2s ease;
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

@media (max-width: 640px) {
  .overlay {
    padding: 14px 10px 20px;
  }
  .modal {
    padding: 20px 16px;
    gap: 14px;
  }
  .tasks {
    font-size: 13.5px;
  }
}

.wmodal-enter-active,
.wmodal-leave-active {
  transition: opacity 0.2s ease;
}
.wmodal-enter-active .modal {
  transition: transform 0.2s ease;
}
.wmodal-enter-from,
.wmodal-leave-to {
  opacity: 0;
}
.wmodal-enter-from .modal {
  transform: translateY(10px) scale(0.985);
}
</style>
