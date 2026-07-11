import { sandboxEvents } from '../../../utils/sandboxData'

export default defineEventHandler((event) => {
  const id = Number(getRouterParam(event, 'id'))
  const found = sandboxEvents.find(e => e.id === id)

  if (!found) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Event Not Found',
      data: { id },
    })
  }

  return {
    data: {
      ...found,
      seatsAvailable: found.seatsTotal - found.seatsBooked,
    },
  }
})
