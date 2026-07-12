/**
 * Auto-Fallback für statisches Hosting (z. B. DomainFactory-Webspace):
 * Requests an /api/v1/* versuchen zuerst das echte Backend (dev-Server,
 * Node-/Serverless-Deploy). Antwortet dort kein JSON (Apache-404 auf
 * statischem Hosting), übernimmt ein In-Browser-Mock mit exakt derselben
 * Logik aus shared/utils/voltgrid — Swagger, Karte & Co. bleiben voll bedienbar.
 */
import {
  buildSessionReceipt,
  filterStations,
  findStation,
  validateSession,
} from '../../shared/utils/voltgrid'

const MOCK_DELAY_MS = 180

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

async function mockHandle(url: URL, init?: RequestInit): Promise<Response> {
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY_MS))

  const path = url.pathname

  if (path === '/api/v1/stations') {
    return jsonResponse(200, filterStations(Object.fromEntries(url.searchParams)))
  }

  const stationMatch = path.match(/^\/api\/v1\/stations\/(\d+)$/)
  if (stationMatch) {
    const id = Number(stationMatch[1])
    const found = findStation(id)
    if (!found) {
      return jsonResponse(404, { statusCode: 404, statusMessage: 'Station Not Found', data: { id } })
    }
    return jsonResponse(200, { data: found })
  }

  if (path === '/api/v1/sessions' && (init?.method ?? 'GET').toUpperCase() === 'POST') {
    let body: Record<string, unknown> = {}
    try {
      body = typeof init?.body === 'string' ? JSON.parse(init.body) : {}
    }
    catch {
      /* leerer Body → Validierung schlägt fehl */
    }
    const errors = validateSession(body)
    if (Object.keys(errors).length) {
      return jsonResponse(422, { statusCode: 422, statusMessage: 'Validation Failed', data: { errors } })
    }
    return jsonResponse(201, { data: buildSessionReceipt(body) })
  }

  return jsonResponse(404, { statusCode: 404, statusMessage: 'Not Found', data: { path } })
}

export default defineNuxtPlugin(() => {
  const realFetch = window.fetch.bind(window)
  let backendMissing = false

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const rawUrl = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
    const url = new URL(rawUrl, window.location.origin)

    if (!url.pathname.startsWith('/api/v1/') || url.origin !== window.location.origin) {
      return realFetch(input, init)
    }

    if (!backendMissing) {
      try {
        const response = await realFetch(input, init)
        const contentType = response.headers.get('content-type') ?? ''
        // echtes Backend antwortet immer mit JSON (auch 404/422) —
        // HTML-404 = statisches Hosting ohne Server → Mock übernimmt dauerhaft
        if (contentType.includes('json')) return response
        backendMissing = true
      }
      catch {
        backendMissing = true
      }
    }

    return mockHandle(url, init)
  }
})
