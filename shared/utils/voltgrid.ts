/**
 * VoltGrid-Sandbox: Daten + API-Logik als EINE Quelle.
 * Wird von den Nitro-Routen (server/api/v1/*) UND vom In-Browser-Mock
 * (app/plugins/api-mock.client.ts) genutzt — so verhält sich die Demo
 * auf statischem Hosting (DomainFactory) identisch zum Server-Deploy.
 */
export interface VoltConnector {
  type: 'CCS' | 'CHAdeMO' | 'Typ2'
  powerKw: number
}

export interface VoltStation {
  id: number
  name: string
  city: string
  status: 'available' | 'charging' | 'maintenance'
  connectors: VoltConnector[]
  pricePerKwhCents: number
  uptimePercent: number
  lng: number
  lat: number
}

export const voltStations: VoltStation[] = [
  { id: 1, name: 'Hafenstraße 12', city: 'Hamburg', status: 'available', connectors: [{ type: 'CCS', powerKw: 150 }, { type: 'Typ2', powerKw: 22 }], pricePerKwhCents: 49, uptimePercent: 99.2, lng: 9.9605, lat: 53.5461 },
  { id: 2, name: 'Parkhaus Mitte, Deck 2', city: 'Berlin', status: 'charging', connectors: [{ type: 'CCS', powerKw: 300 }], pricePerKwhCents: 59, uptimePercent: 98.7, lng: 13.4021, lat: 52.5232 },
  { id: 3, name: 'Rewe Südring', city: 'Köln', status: 'available', connectors: [{ type: 'Typ2', powerKw: 11 }, { type: 'Typ2', powerKw: 22 }], pricePerKwhCents: 39, uptimePercent: 99.8, lng: 6.9425, lat: 50.9188 },
  { id: 4, name: 'Autohof A7 Nord', city: 'Hannover', status: 'maintenance', connectors: [{ type: 'CCS', powerKw: 350 }, { type: 'CHAdeMO', powerKw: 50 }], pricePerKwhCents: 64, uptimePercent: 92.1, lng: 9.7218, lat: 52.4432 },
  { id: 5, name: 'Technologiepark T3', city: 'München', status: 'available', connectors: [{ type: 'CCS', powerKw: 150 }], pricePerKwhCents: 52, uptimePercent: 99.5, lng: 11.6015, lat: 48.1122 },
  { id: 6, name: 'Stadtwerke Campus', city: 'Hamburg', status: 'charging', connectors: [{ type: 'Typ2', powerKw: 22 }], pricePerKwhCents: 42, uptimePercent: 99.9, lng: 10.0219, lat: 53.5713 },
]

export interface StationQuery {
  city?: string
  status?: string
  connector?: string
  minPowerKw?: string | number
  limit?: string | number
}

export function filterStations(query: StationQuery) {
  let result = voltStations

  if (typeof query.city === 'string' && query.city) {
    const city = query.city.toLowerCase()
    result = result.filter(s => s.city.toLowerCase() === city)
  }
  if (typeof query.status === 'string' && query.status) {
    result = result.filter(s => s.status === query.status)
  }
  if (typeof query.connector === 'string' && query.connector) {
    result = result.filter(s => s.connectors.some(c => c.type === query.connector))
  }
  if (query.minPowerKw) {
    const min = Number(query.minPowerKw)
    result = result.filter(s => s.connectors.some(c => c.powerKw >= min))
  }

  const limit = Math.min(Number(query.limit) || 50, 50)
  result = result.slice(0, limit)

  return {
    data: result,
    meta: { count: result.length, total: voltStations.length },
  }
}

export function findStation(id: number): VoltStation | undefined {
  return voltStations.find(s => s.id === id)
}

export interface SessionBody {
  stationId?: number
  connectorType?: string
  estimatedKwh?: number
}

export function validateSession(body: SessionBody): Record<string, string> {
  const errors: Record<string, string> = {}
  const station = findStation(Number(body.stationId))

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

  return errors
}

export function buildSessionReceipt(body: SessionBody) {
  const station = findStation(Number(body.stationId))!
  const kwh = Number(body.estimatedKwh)

  return {
    sessionId: `chg_${Math.random().toString(36).slice(2, 10)}`,
    stationId: station.id,
    station: `${station.name} · ${station.city}`,
    connectorType: body.connectorType,
    estimatedKwh: kwh,
    estimatedCostCents: Math.round(kwh * station.pricePerKwhCents),
    status: 'charging',
    note: 'sandbox session — nothing is persisted',
  }
}
