import { sandboxEvents } from '../../utils/sandboxData'

interface BookingBody {
  eventId?: number
  name?: string
  email?: string
  seats?: number
}

export default defineEventHandler(async (event) => {
  const body = await readBody<BookingBody>(event).catch(() => ({} as BookingBody))
  const errors: Record<string, string> = {}

  const target = sandboxEvents.find(e => e.id === Number(body.eventId))
  if (!target) errors.eventId = 'unknown eventId'
  if (!body.name || body.name.trim().length < 2) errors.name = 'name is required (min. 2 characters)'
  if (!body.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.email)) errors.email = 'valid email is required'
  const seats = Number(body.seats) || 0
  if (seats < 1 || seats > 10) errors.seats = 'seats must be between 1 and 10'
  if (target && seats > target.seatsTotal - target.seatsBooked) errors.seats = 'not enough seats available'

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
      bookingId: `bk_${Math.random().toString(36).slice(2, 10)}`,
      eventId: target!.id,
      event: target!.title,
      seats,
      status: 'confirmed',
      // Demo-API: es wird nichts gespeichert und keine E-Mail versendet
      note: 'sandbox booking — nothing is persisted',
    },
  }
})
