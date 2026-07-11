import { sandboxEvents } from '../../../utils/sandboxData'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  let result = sandboxEvents

  if (typeof query.city === 'string' && query.city) {
    const city = query.city.toLowerCase()
    result = result.filter(e => e.city.toLowerCase() === city)
  }
  if (typeof query.category === 'string' && query.category) {
    result = result.filter(e => e.category === query.category)
  }

  const limit = Math.min(Number(query.limit) || 50, 50)
  result = result.slice(0, limit)

  return {
    data: result.map(e => ({
      ...e,
      seatsAvailable: e.seatsTotal - e.seatsBooked,
    })),
    meta: { count: result.length, total: sandboxEvents.length },
  }
})
