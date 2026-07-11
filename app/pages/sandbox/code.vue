<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => `${t('sandbox.areas.code.title')} — David Gröger`,
  description: () => t('sandbox.areas.code.desc'),
})

/* ---------- Backend: ein Request durch die Schichten ---------- */

const controllerCode = `final class SessionController
{
    public function store(StartSessionRequest $request, StartChargingSession $action): JsonResponse
    {
        return SessionResource::make($action->handle($request->toCommand()))
            ->response()
            ->setStatusCode(201);
    }
}`

const actionCode = `final class StartChargingSession
{
    public function __construct(
        private readonly StationRepository $stations,
        private readonly TariffCalculator $tariff,
        private readonly EventDispatcher $events,
    ) {
    }

    public function handle(StartSessionCommand $command): ChargingSession
    {
        $station = $this->stations->findOrFail($command->stationId);

        if (! $station->supports($command->connectorType)) {
            throw new UnsupportedConnectorException($station, $command->connectorType);
        }

        if (! $station->isAvailable()) {
            throw new StationUnavailableException($station);
        }

        $estimate = $this->tariff->estimate($station, $command->estimatedKwh);
        $session = ChargingSession::start($station, $command->connectorType, $estimate);

        $this->events->dispatch(new SessionStarted($session));

        return $session;
    }
}`

const serviceCode = `final class TariffCalculator
{
    public function __construct(private readonly TariffRepository $tariffs)
    {
    }

    public function estimate(Station $station, KilowattHours $kwh): Money
    {
        $tariff = $this->tariffs->activeFor($station);

        return $tariff->pricePerKwh()
            ->multiply($kwh->value())
            ->add($tariff->baseFee());
    }
}`

const workerCode = `final class FinalizeSessionInvoice implements ShouldQueue
{
    public function __construct(private readonly TariffCalculator $tariff)
    {
    }

    public function handle(SessionCompleted $event): void
    {
        // derselbe TariffCalculator wie im Live-Estimate:
        // ein Preis-Codepfad — Anzeige und Rechnung können nie abweichen
        $amount = $this->tariff->estimate($event->station, $event->chargedKwh);

        Invoice::issueFor($event->session, $amount);
    }
}`

/* ---------- Frontend: Util → Composable → Komponente ---------- */

const utilCode = `// utils/http.ts
export function extractFieldErrors(error: unknown): Record<string, string> {
  if (isFetchError(error) && error.statusCode === 422) {
    return error.data?.data?.errors ?? {}
  }

  return { _global: 'unexpected error — please retry' }
}`

const composableCode = `// composables/useChargingSession.ts
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

const componentCode = `<script setup lang="ts">
const props = defineProps<{ stationId: number }>()
const { state, start, isCharging } = useChargingSession()
<\/script>

<template>
  <DgButton
    :disabled="isCharging"
    @click="start({ stationId: props.stationId, connectorType: 'CCS', estimatedKwh: 40 })"
  >
    {{ isCharging ? '⚡ lädt …' : '→ laden' }}
  </DgButton>
</template>`
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

    <!-- ===== Backend: Schichten ===== -->
    <section v-reveal class="stack">
      <p class="sub">// {{ t('sandbox.code.backendTitle') }}</p>

      <div class="layer">
        <div class="layer-head">
          <span class="chip http">http</span>
          <p>{{ t('sandbox.code.layerController') }}</p>
        </div>
        <CodePanel title="Http/Controllers/SessionController.php" lang="php" :code="controllerCode" />
      </div>

      <p class="arrow" aria-hidden="true">↓ {{ t('sandbox.code.delegates') }}</p>

      <div class="layer">
        <div class="layer-head">
          <span class="chip app">application</span>
          <p>{{ t('sandbox.code.layerAction') }}</p>
        </div>
        <CodePanel title="Charging/Actions/StartChargingSession.php" lang="php" :code="actionCode" />
      </div>

      <p class="arrow" aria-hidden="true">↓ {{ t('sandbox.code.uses') }}</p>

      <div class="layer">
        <div class="layer-head">
          <span class="chip domain">domain · service</span>
          <p>{{ t('sandbox.code.layerService') }}</p>
        </div>
        <CodePanel title="Domain/Tariff/TariffCalculator.php" lang="php" :code="serviceCode" />
        <p class="reuse">↺ {{ t('sandbox.code.serviceReuse') }}</p>
      </div>

      <p class="arrow" aria-hidden="true">↓ {{ t('sandbox.code.reusedBy') }}</p>

      <div class="layer">
        <div class="layer-head">
          <span class="chip queue">queue · worker</span>
          <p>{{ t('sandbox.code.layerWorker') }}</p>
        </div>
        <CodePanel title="Billing/Jobs/FinalizeSessionInvoice.php" lang="php" :code="workerCode" />
      </div>
    </section>

    <!-- ===== Frontend: Util → Composable → Komponente ===== -->
    <section v-reveal class="stack">
      <p class="sub">// {{ t('sandbox.code.frontendTitle') }}</p>

      <div class="layer">
        <div class="layer-head">
          <span class="chip domain">util</span>
          <p>{{ t('sandbox.code.layerUtil') }}</p>
        </div>
        <CodePanel title="utils/http.ts" lang="ts" :code="utilCode" />
        <p class="reuse">↺ {{ t('sandbox.code.utilReuse') }}</p>
      </div>

      <p class="arrow" aria-hidden="true">↓ {{ t('sandbox.code.uses') }}</p>

      <div class="layer">
        <div class="layer-head">
          <span class="chip app">composable · logic</span>
          <p>{{ t('sandbox.code.layerComposable') }}</p>
        </div>
        <CodePanel title="composables/useChargingSession.ts" lang="ts" :code="composableCode" />
      </div>

      <p class="arrow" aria-hidden="true">↓ {{ t('sandbox.code.consumedBy') }}</p>

      <div class="layer">
        <div class="layer-head">
          <span class="chip http">component · ui</span>
          <p>{{ t('sandbox.code.layerComponent') }}</p>
        </div>
        <CodePanel title="components/ChargeButton.vue" lang="vue" :code="componentCode" />
        <p class="reuse">↺ {{ t('sandbox.code.componentReuse') }}</p>
      </div>
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
  margin-bottom: 18px;
}

.stack {
  margin-bottom: 56px;
  padding-left: 18px;
  border-left: 2px solid var(--line);
}

.layer-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}
.layer-head p {
  color: var(--muted);
  font-size: 14px;
}

.chip {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.08em;
  border-radius: 999px;
  padding: 3px 11px;
  white-space: nowrap;
}
.chip.http {
  color: var(--text);
  border: 1px solid var(--line);
}
.chip.app {
  color: var(--amber);
  border: 1px solid color-mix(in srgb, var(--amber) 45%, var(--line));
}
.chip.domain {
  color: var(--mint);
  border: 1px solid color-mix(in srgb, var(--mint) 45%, var(--line));
}
.chip.queue {
  color: var(--faint);
  border: 1px dashed var(--line);
}

.arrow {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--faint);
  margin: 14px 0 14px 6px;
}

.reuse {
  margin-top: 10px;
  font-family: var(--font-mono);
  font-size: 12.5px;
  color: var(--mint);
  line-height: 1.7;
}

.note {
  font-size: 13.5px;
  color: var(--faint);
}
</style>
