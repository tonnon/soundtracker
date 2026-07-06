import { createFileRoute } from '@tanstack/react-router'
import { CATEGORY_ORDER, CATEGORY_META } from '@/lib/category'
import { AuthorByline } from '@/components/AuthorByline'
import { WaveformDivider } from '@/components/WaveformDivider'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { AUTHORS } from '@/data/authors'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/sobre')({
  component: AboutPage,
})

function AboutPage() {
  useDocumentTitle('Sobre', 'Conheça o soundtracker e as três editorias que cobrimos.')

  return (
    <div className="container-editorial max-w-3xl space-y-12 py-10 md:py-14">
      <header className="space-y-4">
        <h1 className="font-display text-3xl font-bold text-text sm:text-4xl">Sobre o soundtracker</h1>
        <p className="text-lg text-muted">
          O soundtracker cobre o universo da música feita para telas — lançamentos de trilhas, entrevistas com
          compositores, análises de score, bastidores de gravação, premiações e a cena de música de jogos. Escrevemos
          para quem já assistiu ao filme e quer entender por que aquela cena doeu tanto, ou por que aquele tema
          voltou três episódios depois.
        </p>
      </header>

      <WaveformDivider seed="sobre-divider" />

      <section aria-labelledby="editorias-heading" className="space-y-6">
        <h2 id="editorias-heading" className="font-display text-2xl font-bold text-text">
          As três editorias
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

      <WaveformDivider seed="sobre-divider-2" />

      <section aria-labelledby="equipe-heading" className="space-y-4">
        <h2 id="equipe-heading" className="font-display text-2xl font-bold text-text">
          Editorial
        </h2>
        <p className="text-muted">
          A curadoria e a edição final de cada matéria passam por {AUTHORS.luiza.name}, {AUTHORS.luiza.role.toLowerCase()}
          {' '}do soundtracker.
        </p>
        <AuthorByline author={AUTHORS.luiza} />
      </section>
    </div>
  )
}
