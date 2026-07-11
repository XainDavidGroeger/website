/**
 * Demo-Daten für die Sandbox-API (/api/v1/*) von „VoltGrid“ —
 * einer FIKTIVEN E-Ladesäulen-Plattform, erfunden als durchgestochenes
 * Fallbeispiel (API + UI-Kit + Architektur). In-Memory, nichts wird gespeichert.
 */
export interface Connector {
  type: 'CCS' | 'CHAdeMO' | 'Typ2'
  powerKw: number
}

export interface Station {
  id: number
  name: string
  city: string
  status: 'available' | 'charging' | 'maintenance'
  connectors: Connector[]
  pricePerKwhCents: number
  uptimePercent: number
}

export const stations: Station[] = [
  { id: 1, name: 'Hafenstraße 12', city: 'Hamburg', status: 'available', connectors: [{ type: 'CCS', powerKw: 150 }, { type: 'Typ2', powerKw: 22 }], pricePerKwhCents: 49, uptimePercent: 99.2 },
  { id: 2, name: 'Parkhaus Mitte, Deck 2', city: 'Berlin', status: 'charging', connectors: [{ type: 'CCS', powerKw: 300 }], pricePerKwhCents: 59, uptimePercent: 98.7 },
  { id: 3, name: 'Rewe Südring', city: 'Köln', status: 'available', connectors: [{ type: 'Typ2', powerKw: 11 }, { type: 'Typ2', powerKw: 22 }], pricePerKwhCents: 39, uptimePercent: 99.8 },
  { id: 4, name: 'Autohof A7 Nord', city: 'Hannover', status: 'maintenance', connectors: [{ type: 'CCS', powerKw: 350 }, { type: 'CHAdeMO', powerKw: 50 }], pricePerKwhCents: 64, uptimePercent: 92.1 },
  { id: 5, name: 'Technologiepark T3', city: 'München', status: 'available', connectors: [{ type: 'CCS', powerKw: 150 }], pricePerKwhCents: 52, uptimePercent: 99.5 },
  { id: 6, name: 'Stadtwerke Campus', city: 'Hamburg', status: 'charging', connectors: [{ type: 'Typ2', powerKw: 22 }], pricePerKwhCents: 42, uptimePercent: 99.9 },
]
