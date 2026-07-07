import { createFileRoute, Link, type ErrorComponentProps } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import { fetchAllCategories } from '@/services/news'
import { CATEGORY_ORDER, CATEGORY_META } from '@/lib/category'
import { NewsCard } from '@/components/NewsCard'
import { WaveformDivider } from '@/components/WaveformDivider'
import { EmptyState } from '@/components/EmptyState'
import { ArticleGridSkeleton } from '@/components/ArticleSkeleton'
import { Button } from '@/components/ui/button'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { cn } from '@/lib/utils'
import type { NewsItem } from '@/data/types'

export const Route = createFileRoute('/')({
  loader: () => fetchAllCategories(),
  component: HomePage,
  pendingComponent: HomePending,
  errorComponent: HomeError,
})

function byDateDesc(a: NewsItem, b: NewsItem): number {
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
}

function HomePage() {
  useDocumentTitle(
    'soundtracker',
    'A real-news curation of soundtracks for film, TV and games.',
  )

  const prefersReducedMotion = useReducedMotion()
  const feeds = Route.useLoaderData()
  const all = [...feeds.cinema, ...feeds.series, ...feeds.games].sort(byDateDesc)
  const hero = all[0]
  const latest = all.filter((item) => item.id !== hero?.id).slice(0, 6)

  if (all.length === 0) {
    return (
      <div className="container-editorial py-10 md:py-14">
        <EmptyState
          title="No news found right now"
          description="The news source may not have recent coverage for these topics. Try again in a moment."
        />
      </div>
    )
  }

  return (
    <div className="container-editorial space-y-16 py-10 md:py-14">
      {hero ? (
        <section aria-label="Featured">
          <NewsCard item={hero} variant="hero" priority />
        </section>
      ) : null}

      <WaveformDivider seed="home-divider-latest" />

      <section aria-labelledby="latest-heading">
        <h2 id="latest-heading" className="mb-6 font-display text-2xl font-bold text-text">
          Latest
        </h2>
        <motion.div
          className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3"
          initial={prefersReducedMotion ? false : 'hidden'}
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
        >
          {latest.map((item) => (
            <motion.div
              key={item.id}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
              }}
            >
              <NewsCard item={item} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {CATEGORY_ORDER.map((category) => {
        const meta = CATEGORY_META[category]
        const items = feeds[category].slice(0, 3)
        if (items.length === 0) return null

        return (
          <section key={category} aria-labelledby={`section-${category}`}>
            <WaveformDivider seed={`home-divider-${category}`} className="mb-10" />
            <div className="mb-6 flex items-baseline justify-between">
              <h2 id={`section-${category}`} className={cn('font-display text-2xl font-bold', meta.text)}>
                {meta.label}
              </h2>
              <Link
                to="/category/$category"
                params={{ category }}
                className="font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-text"
              >
                View section →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {items.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

function HomePending() {
  return (
    <div className="container-editorial space-y-16 py-10 md:py-14">
      <ArticleGridSkeleton count={3} />
    </div>
  )
}

function HomeError({ reset }: ErrorComponentProps) {
  return (
    <div className="container-editorial py-10 md:py-14">
      <EmptyState
        title="Couldn't load the news"
        description="The news source may be temporarily unavailable or rate-limiting requests. Wait a few seconds and try again."
        action={
          <Button variant="outline" onClick={reset}>
            Try again
          </Button>
        }
      />
    </div>
  )
}
