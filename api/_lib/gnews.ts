const GNEWS_ENDPOINT = 'https://gnews.io/api/v4/search'

export interface GnewsProxyResult {
  status: number
  body: string
}

/** Shared by the Vercel serverless function (api/news.ts) and the Vite dev
 * middleware (vite.config.ts) so both proxy GNews identically. */
export async function proxyGnewsSearch(query: string, max: string, apiKey: string): Promise<GnewsProxyResult> {
  const url = `${GNEWS_ENDPOINT}?q=${encodeURIComponent(query)}&lang=en&max=${max}&sortby=publishedAt&apikey=${apiKey}`
  const upstream = await fetch(url)
  const body = await upstream.text()
  return { status: upstream.status, body }
}
