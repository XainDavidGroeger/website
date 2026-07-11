import { stations } from '../../../utils/sandboxData'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  let result = stations

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
    meta: { count: result.length, total: stations.length },
  }
})
