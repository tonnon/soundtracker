import { createFileRoute, Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import { getHeroArticle, getLatest, getByCategory, getCueNumber } from '@/services/articles'
import { CATEGORY_ORDER, CATEGORY_META } from '@/lib/category'
import { ArticleCard } from '@/components/ArticleCard'
import { WaveformDivider } from '@/components/WaveformDivider'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  useDocumentTitle(
    'soundtracker',
    'Notícias, entrevistas e análises sobre trilhas sonoras de cinema, séries e jogos.',
  )

  const prefersReducedMotion = useReducedMotion()
  const hero = getHeroArticle()
  const latest = getLatest({ limit: 6, excludeSlug: hero?.slug })

  return (
    <div className="container-editorial space-y-16 py-10 md:py-14">
      {hero ? (
        <section aria-label="Destaque">
          <ArticleCard article={hero} cueNumber={getCueNumber(hero.slug)} variant="hero" priority />
        </section>
      ) : null}

      <WaveformDivider seed="home-divider-latest" />

      <section aria-labelledby="latest-heading">
        <h2 id="latest-heading" className="mb-6 font-display text-2xl font-bold text-text">
          Últimas
        </h2>
        <motion.div
          className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3"
          initial={prefersReducedMotion ? false : 'hidden'}
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
        >
          {latest.map((article) => (
            <motion.div
              key={article.slug}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
              }}
            >
              <ArticleCard article={article} cueNumber={getCueNumber(article.slug)} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {CATEGORY_ORDER.map((category) => {
        const meta = CATEGORY_META[category]
        const items = getByCategory(category, { limit: 3 })
        if (items.length === 0) return null

        return (
          <section key={category} aria-labelledby={`section-${category}`}>
            <WaveformDivider seed={`home-divider-${category}`} className="mb-10" />
            <div className="mb-6 flex items-baseline justify-between">
              <h2 id={`section-${category}`} className={cn('font-display text-2xl font-bold', meta.text)}>
                {meta.label}
              </h2>
              <Link
                to="/editoria/$category"
                params={{ category }}
                className="font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-text"
              >
                Ver editoria →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {items.map((article) => (
                <ArticleCard key={article.slug} article={article} cueNumber={getCueNumber(article.slug)} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
