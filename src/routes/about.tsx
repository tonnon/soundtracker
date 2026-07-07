import { createFileRoute } from '@tanstack/react-router'
import { CATEGORY_ORDER, CATEGORY_META } from '@/lib/category'
import { WaveformDivider } from '@/components/WaveformDivider'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  useDocumentTitle('About', 'Learn about soundtracker and the three sections we cover.')

  return (
    <div className="container-editorial max-w-3xl space-y-12 py-10 md:py-14">
      <header className="space-y-4">
        <h1 className="font-display text-3xl font-bold text-text sm:text-4xl">About soundtracker</h1>
        <p className="text-lg text-muted">
          soundtracker is a curation of real news about music made for screens — score releases, composer
          interviews, recording-session behind-the-scenes, awards, and the game-music scene. We're not the
          original newsroom behind any of these stories: we aggregate coverage published by news outlets and
          always link back to the original source.
        </p>
      </header>

      <WaveformDivider seed="about-divider" />

      <section aria-labelledby="sections-heading" className="space-y-6">
        <h2 id="sections-heading" className="font-display text-2xl font-bold text-text">
          The three sections
        </h2>
        <dl className="space-y-6">
          {CATEGORY_ORDER.map((category) => {
            const meta = CATEGORY_META[category]
            return (
              <div key={category} className={cn('border-l-2 pl-5', meta.border)}>
                <dt className={cn('font-display text-xl font-semibold', meta.text)}>{meta.label}</dt>
                <dd className="mt-1 text-muted">{meta.description}</dd>
              </div>
            )
          })}
        </dl>
      </section>

      <WaveformDivider seed="about-divider-2" />

      <section aria-labelledby="sources-heading" className="space-y-4">
        <h2 id="sources-heading" className="font-display text-2xl font-bold text-text">
          Where the news comes from
        </h2>
        <p className="text-muted">
          The feed is built from the GDELT Project, a real-time global news index. Each card shows the headline,
          image, and date as published by the original source, with a direct link to the full story — soundtracker
          doesn't rewrite or republish third-party content.
        </p>
      </section>
    </div>
  )
}
