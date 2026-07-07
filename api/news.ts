import type { IncomingMessage, ServerResponse } from 'node:http'
import { proxyGnewsSearch } from './_lib/gnews.js'

interface VercelLikeRequest extends IncomingMessage {
  query: Record<string, string | string[] | undefined>
}

/** Runs server-side on Vercel — keeps the GNews API key out of the client
 * bundle and avoids depending on GNews sending CORS headers to the browser,
 * which it doesn't do reliably. */
export default async function handler(req: VercelLikeRequest, res: ServerResponse) {
  const apiKey = process.env.GNEWS_API_KEY
  if (!apiKey) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Missing GNEWS_API_KEY on the server' }))
    return
  }

  const q = req.query.q
  const max = req.query.max
  if (!q || Array.isArray(q)) {
    res.statusCode = 400
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Missing or invalid "q" query parameter' }))
    return
  }

  try {
    const { status, body } = await proxyGnewsSearch(q, Array.isArray(max) ? (max[0] ?? '10') : (max ?? '10'), apiKey)
    res.statusCode = status
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=60')
    res.end(body)
  } catch {
    res.statusCode = 502
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Failed to reach GNews' }))
  }
}
