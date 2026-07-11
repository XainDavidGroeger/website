<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => `${t('sandbox.areas.ui.title')} — David Gröger`,
  description: () => t('sandbox.areas.ui.desc'),
})

/* Button-Knobs */
const btnVariant = ref<'primary' | 'ghost'>('primary')
const btnSize = ref<'md' | 'lg'>('md')
const btnDisabled = ref(false)
const btnLabel = ref('→ projekt starten')
const btnCode = computed(() => {
  const attrs = [
    btnVariant.value !== 'primary' ? `variant="${btnVariant.value}"` : '',
    btnSize.value !== 'md' ? `size="${btnSize.value}"` : '',
    btnDisabled.value ? 'disabled' : '',
  ].filter(Boolean).join(' ')
  return `<DgButton${attrs ? ` ${attrs}` : ''}>${btnLabel.value}</DgButton>`
})

/* Tag-Knobs */
const tagColor = ref<'amber' | 'mint' | 'muted'>('mint')
const tagOutline = ref(true)
const tagLabel = ref('approved ✓')
const tagCode = computed(() =>
  `<DgTag color="${tagColor.value}"${tagOutline.value ? '' : ' :outline="false"'}>${tagLabel.value}</DgTag>`,
)

/* Window-Knobs */
const winVariant = ref<'terminal' | 'holo'>('terminal')
const winTitle = ref('~/demo — bash')
const winCode = computed(() =>
  `<DgWindow title="${winTitle.value}"${winVariant.value !== 'terminal' ? ` variant="${winVariant.value}"` : ''}>\n  …\n</DgWindow>`,
)
</script>

<template>
  <div class="wrap page">
    <div v-reveal class="sec-head">
      <p class="eyebrow">
        <NuxtLinkLocale to="/sandbox" class="crumb">/* sandbox */</NuxtLinkLocale> → ui
      </p>
      <h2>{{ t('sandbox.ui.title') }}</h2>
      <p class="lede">{{ t('sandbox.ui.lede') }}</p>
    </div>

    <!-- DgButton -->
    <section v-reveal class="lab">
      <h3><span class="tick">&lt;</span>DgButton<span class="tick"> /&gt;</span></h3>
      <div class="grid">
        <div class="stage">
          <DgButton :variant="btnVariant" :size="btnSize" :disabled="btnDisabled">{{ btnLabel }}</DgButton>
        </div>
        <div class="knobs">
          <label>variant
            <select v-model="btnVariant">
              <option value="primary">primary</option>
              <option value="ghost">ghost</option>
            </select>
          </label>
          <label>size
            <select v-model="btnSize">
              <option value="md">md</option>
              <option value="lg">lg</option>
            </select>
          </label>
          <label>label
            <input v-model="btnLabel" type="text">
          </label>
          <label class="check">
            <input v-model="btnDisabled" type="checkbox"> disabled
          </label>
        </div>
      </div>
      <pre class="code">{{ btnCode }}</pre>
    </section>

    <!-- DgTag -->
    <section v-reveal class="lab">
      <h3><span class="tick">&lt;</span>DgTag<span class="tick"> /&gt;</span></h3>
      <div class="grid">
        <div class="stage">
          <DgTag :color="tagColor" :outline="tagOutline">{{ tagLabel }}</DgTag>
        </div>
        <div class="knobs">
          <label>color
            <select v-model="tagColor">
              <option value="amber">amber</option>
              <option value="mint">mint</option>
              <option value="muted">muted</option>
            </select>
          </label>
          <label>text
            <input v-model="tagLabel" type="text">
          </label>
          <label class="check">
            <input v-model="tagOutline" type="checkbox"> outline
          </label>
        </div>
      </div>
      <pre class="code">{{ tagCode }}</pre>
    </section>

    <!-- DgWindow -->
    <section v-reveal class="lab">
      <h3><span class="tick">&lt;</span>DgWindow<span class="tick"> /&gt;</span></h3>
      <div class="grid">
        <div class="stage">
          <DgWindow :title="winTitle" :variant="winVariant" class="win-demo">
            <p>$ echo "{{ t('sandbox.ui.windowLine') }}"</p>
          </DgWindow>
        </div>
        <div class="knobs">
          <label>variant
            <select v-model="winVariant">
              <option value="terminal">terminal</option>
              <option value="holo">holo</option>
            </select>
          </label>
          <label>title
            <input v-model="winTitle" type="text">
          </label>
        </div>
      </div>
      <pre class="code">{{ winCode }}</pre>
    </section>

    <p v-reveal class="note">{{ t('sandbox.ui.note') }}</p>
  </div>
</template>

<style scoped>
.page {
  padding-block: 110px;
}
.crumb {
  color: var(--amber);
}

.lab {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
  padding: 26px 28px;
  margin-bottom: 20px;
}
.lab h3 {
  font-family: var(--font-mono);
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 20px;
}
.lab h3 .tick {
  color: var(--amber);
}

.grid {
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 24px;
  align-items: center;
}
@media (max-width: 700px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.stage {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 140px;
  border: 1px dashed var(--line);
  border-radius: 6px;
  padding: 24px;
  background:
    linear-gradient(var(--line) 1px, transparent 1px) 0 0 / 100% 28px,
    linear-gradient(90deg, var(--line) 1px, transparent 1px) 0 0 / 28px 100%;
  background-color: var(--bg);
  background-blend-mode: normal;
}
.stage > :deep(.dg-window) {
  width: 100%;
}

.knobs {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.knobs label {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--faint);
}
.knobs label.check {
  flex-direction: row;
  align-items: center;
  gap: 8px;
  color: var(--muted);
}
.knobs select,
.knobs input[type='text'] {
  background: var(--bg-deep);
  border: 1px solid var(--line);
  border-radius: 5px;
  color: var(--text);
  font-family: var(--font-mono);
  font-size: 13px;
  padding: 8px 10px;
}
.knobs input[type='checkbox'] {
  accent-color: var(--amber);
}

.code {
  margin: 18px 0 0;
  padding: 14px 16px;
  border-radius: 6px;
  background: var(--bg-deep);
  border: 1px solid var(--line);
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--mint);
  overflow-x: auto;
  white-space: pre;
}

.note {
  margin-top: 20px;
  font-size: 13.5px;
  color: var(--faint);
}
</style>
