import { findStation } from '../../../../shared/utils/voltgrid'

export default defineEventHandler((event) => {
  const id = Number(getRouterParam(event, 'id'))
  const found = findStation(id)

  if (!found) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Station Not Found',
      data: { id },
    })
  }

  return { data: found }
})
