import { stations } from '../../utils/sandboxData'

interface SessionBody {
  stationId?: number
  connectorType?: string
  estimatedKwh?: number
}

export default defineEventHandler(async (event) => {
  const body = await readBody<SessionBody>(event).catch(() => ({} as SessionBody))
  const errors: Record<string, string> = {}

  const station = stations.find(s => s.id === Number(body.stationId))
  if (!station) {
    errors.stationId = 'unknown stationId'
  }
  else {
    if (station.status === 'maintenance') errors.stationId = 'station is under maintenance'
    if (station.status === 'charging') errors.stationId = 'station is occupied'
    if (!station.connectors.some(c => c.type === body.connectorType)) {
      errors.connectorType = `station has no ${body.connectorType ?? '(missing)'} connector`
    }
  }
  const kwh = Number(body.estimatedKwh) || 0
  if (kwh < 1 || kwh > 150) errors.estimatedKwh = 'estimatedKwh must be between 1 and 150'

  if (Object.keys(errors).length) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Validation Failed',
      data: { errors },
    })
  }

  setResponseStatus(event, 201)
  return {
    data: {
      sessionId: `chg_${Math.random().toString(36).slice(2, 10)}`,
      stationId: station!.id,
      station: `${station!.name} · ${station!.city}`,
      connectorType: body.connectorType,
      estimatedKwh: kwh,
      estimatedCostCents: Math.round(kwh * station!.pricePerKwhCents),
      status: 'charging',
      // Demo-API: es wird nichts gespeichert, keine Säule startet wirklich
      note: 'sandbox session — nothing is persisted',
    },
  }
})
