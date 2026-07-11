<script setup lang="ts">
const { t } = useI18n()

const logEl = ref<HTMLElement | null>(null)
const logLines = ref<{ agent: string, text: string }[]>([])

const jobs = computed(() => [
  { agent: 'agent:refactor', text: t('agents.jobs.refactor') },
  { agent: 'agent:test', text: t('agents.jobs.test') },
  { agent: 'agent:review', text: t('agents.jobs.review') },
  { agent: 'agent:docs', text: t('agents.jobs.docs') },
  { agent: 'agent:perf', text: t('agents.jobs.perf') },
  { agent: 'agent:deploy', text: t('agents.jobs.deploy') },
])

let jobIndex = 0
let timer: ReturnType<typeof setInterval> | null = null
let observer: IntersectionObserver | null = null

function addLine() {
  const job = jobs.value[jobIndex++ % jobs.value.length]!
  logLines.value.push(job)
  if (logLines.value.length > 6) logLines.value.shift()
}

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting && !timer) {
        addLine()
        timer = setInterval(addLine, 2100)
      }
      else if (!entry.isIntersecting && timer) {
        clearInterval(timer)
        timer = null
      }
    }
  }, { threshold: 0.2 })
  if (logEl.value) observer.observe(logEl.value)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  observer?.disconnect()
})
</script>

<template>
  <section id="agents" class="section">
    <div class="wrap">
      <div v-reveal class="sec-head">
        <p class="eyebrow"><span class="tick">/* agents */</span> {{ t('agents.eyebrow') }}</p>
        <h2>{{ t('agents.title') }}</h2>
        <p class="lede">{{ t('agents.lede') }}</p>
      </div>

      <div class="stage">
        <div v-reveal class="panel-wrap">
          <img
            class="bot bot-pixel"
            src="/img/crew/pixel-2.webp"
            :alt="t('agents.pixelAlt')"
            height="140"
          >
          <img
            class="bot bot-forge"
            src="/img/crew/forge-2.webp"
            :alt="t('agents.forgeAlt')"
            height="120"
          >
          <div class="holo" aria-hidden="true">
            <div class="holo-head">~/pipeline — running <span class="pulse">●</span></div>
            <pre class="holo-code"><span class="kw">while</span> (project.<span class="fn">isRunning</span>()) {
  crew.<span class="fn">refactor</span>(<span class="str">"legacy"</span>)
  crew.<span class="fn">test</span>({ coverage: <span class="str">"high"</span> })
  crew.<span class="fn">document</span>()
  david.<span class="fn">review</span>() <span class="cmt">// always</span>
}</pre>
          </div>
        </div>

        <div ref="logEl" v-reveal class="agentlog">
          <div class="hd">{{ t('agents.logTitle') }}</div>
          <TransitionGroup name="logline">
            <div v-for="(line, i) in logLines" :key="`${line.agent}-${i}`" class="ln">
              <span class="a">▸ {{ line.agent }}</span>&nbsp;&nbsp;{{ line.text }} <span class="ok">✓</span>
            </div>
          </TransitionGroup>
        </div>
      </div>

      <p v-reveal class="closing">{{ t('agents.closing') }}</p>
    </div>
  </section>
</template>

<style scoped>
.stage {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 18px;
  align-items: stretch;
}
@media (max-width: 820px) {
  .stage {
    grid-template-columns: 1fr;
  }
}

.panel-wrap {
  position: relative;
  padding: 56px 24px 8px 64px;
}

.bot {
  position: absolute;
  width: auto;
  z-index: 2;
  animation: crew-float 3.6s ease-in-out infinite;
}
.bot-pixel {
  left: -8px;
  bottom: 34px;
  height: 140px;
}
.bot-forge {
  right: 6px;
  top: 0;
  height: 120px;
  animation-delay: -1.6s;
}
@keyframes crew-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.holo {
  border: 1px solid color-mix(in srgb, var(--mint) 35%, var(--line));
  border-radius: 8px;
  background:
    linear-gradient(160deg, color-mix(in srgb, var(--mint) 6%, transparent), transparent 55%),
    var(--bg-deep);
  box-shadow: 0 0 42px color-mix(in srgb, var(--mint) 10%, transparent);
  padding: 18px 22px;
  font-family: var(--font-mono);
  min-height: 230px;
}
.holo-head {
  font-size: 12px;
  color: var(--faint);
  border-bottom: 1px solid var(--line);
  padding-bottom: 8px;
  margin-bottom: 12px;
}
.holo-head .pulse {
  color: var(--mint);
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
  50% {
    opacity: 0.25;
  }
}
.holo-code {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.9;
  color: var(--muted);
  overflow-x: auto;
}
.holo-code .kw {
  color: var(--mint);
}
.holo-code .fn {
  color: var(--amber);
}
.holo-code .str {
  color: var(--text);
}
.holo-code .cmt {
  color: var(--faint);
}

.agentlog {
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--bg-deep);
  padding: 18px 20px;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 2.1;
  color: var(--muted);
  min-height: 230px;
  overflow: hidden;
}
.agentlog .hd {
  color: var(--faint);
  border-bottom: 1px solid var(--line);
  padding-bottom: 8px;
  margin-bottom: 10px;
}
.agentlog .a {
  color: var(--amber);
}
.agentlog .ok {
  color: var(--mint);
}
.agentlog .ln {
  white-space: nowrap;
}

.logline-enter-active {
  transition: opacity 0.45s ease, transform 0.45s ease;
}
.logline-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.logline-leave-active {
  display: none;
}

.closing {
  margin-top: 30px;
  color: var(--muted);
  max-width: 62ch;
}

@media (prefers-reduced-motion: reduce) {
  .bot,
  .holo-head .pulse {
    animation: none;
  }
  .logline-enter-active {
    transition: none;
  }
}
</style>
