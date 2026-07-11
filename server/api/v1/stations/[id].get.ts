import { stations } from '../../../utils/sandboxData'

export default defineEventHandler((event) => {
  const id = Number(getRouterParam(event, 'id'))
  const found = stations.find(s => s.id === id)

  if (!found) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Station Not Found',
      data: { id },
    })
  }

  return { data: found }
})
