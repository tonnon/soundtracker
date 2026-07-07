import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { fileURLToPath, URL } from 'node:url'
import { proxyGnewsSearch } from './api/_lib/gnews.js'

// Mirrors api/news.ts so `npm run dev` has a working /api/news endpoint too,
// without needing `vercel dev`. Production uses the real serverless function.
function gnewsDevProxy(apiKey: string | undefined): Plugin {
  return {
    name: 'gnews-dev-proxy',
    configureServer(server) {
      server.middlewares.use('/api/news', async (req, res) => {
        const url = new URL(req.url ?? '', 'http://localhost')
        const q = url.searchParams.get('q')
        const max = url.searchParams.get('max') ?? '10'
        res.setHeader('Content-Type', 'application/json')

        if (!apiKey) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'Missing GNEWS_API_KEY in .env' }))
          return
        }
        if (!q) {
          res.statusCode = 400
          res.end(JSON.stringify({ error: 'Missing "q" query parameter' }))
          return
        }

        try {
          const { status, body } = await proxyGnewsSearch(q, max, apiKey)
          res.statusCode = status
          res.end(body)
        } catch {
          res.statusCode = 502
          res.end(JSON.stringify({ error: 'Failed to reach GNews' }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      tanstackRouter({
        target: 'react',
        routesDirectory: './src/routes',
        generatedRouteTree: './src/routeTree.gen.ts',
        autoCodeSplitting: true,
      }),
      react(),
      tailwindcss(),
      gnewsDevProxy(env.GNEWS_API_KEY),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
