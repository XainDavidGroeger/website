/**
 * Demo-Daten für die Sandbox-API (/api/v1/*) — eine fiktive Event-Booking-API
 * im Stil der Plattformen, die ich baue. In-Memory, bei jedem Deploy frisch.
 */
export interface SandboxEvent {
  id: number
  title: string
  category: 'singing' | 'wine' | 'dating' | 'team'
  city: string
  date: string
  priceCents: number
  seatsTotal: number
  seatsBooked: number
}

export const sandboxEvents: SandboxEvent[] = [
  { id: 1, title: 'SingAlong: Rock Edition', category: 'singing', city: 'Berlin', date: '2026-09-12', priceCents: 2400, seatsTotal: 300, seatsBooked: 212 },
  { id: 2, title: 'Weinhopping Altstadt-Tour', category: 'wine', city: 'Düsseldorf', date: '2026-09-19', priceCents: 4900, seatsTotal: 45, seatsBooked: 38 },
  { id: 3, title: 'Matching Night', category: 'dating', city: 'Hamburg', date: '2026-09-26', priceCents: 2900, seatsTotal: 250, seatsBooked: 197 },
  { id: 4, title: 'Team-Quiz: Office Edition', category: 'team', city: 'München', date: '2026-10-02', priceCents: 3500, seatsTotal: 80, seatsBooked: 24 },
  { id: 5, title: 'SingAlong: Weihnachts-Special', category: 'singing', city: 'Wien', date: '2026-12-05', priceCents: 2600, seatsTotal: 400, seatsBooked: 61 },
  { id: 6, title: 'SpeedDating XXL', category: 'dating', city: 'Köln', date: '2026-10-10', priceCents: 2200, seatsTotal: 60, seatsBooked: 55 },
]
