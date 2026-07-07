# soundtracker

A real-news curation of soundtracks for film, TV and games — headlines, images and links aggregated live from the [GDELT Project](https://www.gdeltproject.org/), a free, keyless global news index. soundtracker doesn't write or republish the stories it shows; every card links back to the original source.

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

```bash
npm install
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

- News is fetched client-side from GDELT's DOC API (`api.gdeltproject.org`), which is free and requires no API key, but rate-limits requests per IP. Results are cached in `sessionStorage` for a few minutes to keep repeat page loads fast and requests low.
- A news item's detail page URL is self-contained (the item's data is base64url-encoded in the route param) — there's no backend, so nothing needs to be looked up by ID.
