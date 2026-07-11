<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => `${t('sandbox.areas.code.title')} — David Gröger`,
  description: () => t('sandbox.areas.code.desc'),
})

const backendCode = `<?php

declare(strict_types=1);

namespace VoltGrid\\Charging\\Actions;

final class StartChargingSession
{
    public function __construct(
        private readonly StationRepository $stations,
        private readonly TariffCalculator $tariff,
        private readonly EventDispatcher $events,
    ) {
    }

    public function handle(StartSessionRequest $request): SessionReceipt
    {
        $station = $this->stations->findOrFail($request->stationId);

        if (! $station->supports($request->connectorType)) {
            throw new UnsupportedConnectorException($station, $request->connectorType);
        }

        if (! $station->isAvailable()) {
            throw new StationUnavailableException($station);
        }

        $estimate = $this->tariff->estimate($station, $request->estimatedKwh);
        $session = ChargingSession::start($station, $request->connectorType, $estimate);

        $this->events->dispatch(new SessionStarted($session));

        return SessionReceipt::fromSession($session);
    }
}`

const frontendCode = `// composables/useChargingSession.ts

type SessionState =
  | { status: 'idle' }
  | { status: 'starting' }
  | { status: 'charging', session: SessionReceipt }
  | { status: 'failed', errors: Record<string, string> }

export function useChargingSession() {
  const state = ref<SessionState>({ status: 'idle' })

  async function start(payload: StartSessionPayload): Promise<void> {
    state.value = { status: 'starting' }
    try {
      const { data } = await $fetch<{ data: SessionReceipt }>('/api/v1/sessions', {
        method: 'POST',
        body: payload,
      })
      state.value = { status: 'charging', session: data }
    }
    catch (error) {
      state.value = { status: 'failed', errors: extractFieldErrors(error) }
    }
  }

  const isCharging = computed(() => state.value.status === 'charging')

  return { state: readonly(state), start, isCharging }
}`
</script>

<template>
  <div class="wrap page">
    <div v-reveal class="sec-head">
      <p class="eyebrow">
        <NuxtLinkLocale to="/sandbox" class="crumb">/* voltgrid */</NuxtLinkLocale> → code
      </p>
      <h2>{{ t('sandbox.code.title') }}</h2>
      <p class="lede">{{ t('sandbox.code.lede') }}</p>
    </div>

    <!-- Backend -->
    <section v-reveal class="pair">
      <p class="sub">// {{ t('sandbox.code.backendTitle') }}</p>
      <CodePanel title="app/Charging/Actions/StartChargingSession.php" lang="php" :code="backendCode" />
      <ul class="why">
        <li>{{ t('sandbox.code.backendWhy1') }}</li>
        <li>{{ t('sandbox.code.backendWhy2') }}</li>
        <li>{{ t('sandbox.code.backendWhy3') }}</li>
      </ul>
    </section>

    <!-- Frontend -->
    <section v-reveal class="pair">
      <p class="sub">// {{ t('sandbox.code.frontendTitle') }}</p>
      <CodePanel title="composables/useChargingSession.ts" lang="ts" :code="frontendCode" />
      <ul class="why">
        <li>{{ t('sandbox.code.frontendWhy1') }}</li>
        <li>{{ t('sandbox.code.frontendWhy2') }}</li>
        <li>{{ t('sandbox.code.frontendWhy3') }}</li>
      </ul>
    </section>

    <p v-reveal class="note">{{ t('sandbox.code.note') }}</p>
  </div>
</template>

<style scoped>
.page {
  padding-block: 110px;
}
.crumb {
  color: var(--amber);
}
.sub {
  font-family: var(--font-mono);
  font-size: 12.5px;
  letter-spacing: 0.06em;
  color: var(--faint);
  margin-bottom: 14px;
}

.pair {
  margin-bottom: 44px;
}

.why {
  margin: 16px 0 0;
  padding-left: 20px;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.8;
  max-width: 75ch;
}
.why li::marker {
  color: var(--amber);
}

.note {
  font-size: 13.5px;
  color: var(--faint);
}
</style>
