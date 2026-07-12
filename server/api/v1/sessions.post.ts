import type { SessionBody } from '../../../shared/utils/voltgrid'
import { buildSessionReceipt, validateSession } from '../../../shared/utils/voltgrid'

export default defineEventHandler(async (event) => {
  const body = await readBody<SessionBody>(event).catch(() => ({} as SessionBody))
  const errors = validateSession(body)

  if (Object.keys(errors).length) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Validation Failed',
      data: { errors },
    })
  }

  setResponseStatus(event, 201)
  return { data: buildSessionReceipt(body) }
})
