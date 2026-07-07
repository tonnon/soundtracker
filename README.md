# soundtracker

A real-news curation of soundtracks for film, TV and games — headlines, images, summaries and links aggregated live from the [GNews](https://gnews.io/) API. soundtracker doesn't write or republish the stories it shows in full; each story page shows a short real summary and links back to the original source to read the complete coverage.

## Stack

- React 19 + TypeScript (strict) + Vite
- Tailwind CSS v4 (tokens via `@theme`)
- TanStack Router (file-based routing, code-split per route)
- Motion for the home page's stagger animation
- shadcn/ui-style primitives on top of Radix

## Sections

- **Cinema** — feature film scores and composer profiles
- **Series** — TV scoring and episodic leitmotifs
- **Games** — adaptive scoring and interactive audio

## Getting started

Requires a free [GNews API key](https://gnews.io) (100 requests/day on the free tier).

```bash
npm install
cp .env.example .env   # then add your GNEWS API key to .env
npm run dev
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Type-check without emitting |
| `npm run format` | Format the codebase with Prettier |

## Notes

- News is fetched client-side from GNews's `/search` endpoint. The free tier caps at 100 requests/day and throttles bursts of concurrent calls, so the three sections are fetched one after another (with a short gap) instead of in parallel, and results are cached in `sessionStorage` for 30 minutes to keep repeat page loads fast and requests low.
- A news item's detail page URL is self-contained (the item's data, including its summary, is base64url-encoded in the route param) — there's no backend, so nothing needs to be looked up by ID.
- The story page shows GNews's `description` field as a short summary, plus a reading-progress indicator — never the full third-party article body.
