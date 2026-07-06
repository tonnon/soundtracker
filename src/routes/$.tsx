import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export const Route = createFileRoute('/$')({
  component: NotFoundPage,
})

function NotFoundPage() {
  useDocumentTitle('Faixa não encontrada')

  return (
    <div className="container-editorial flex flex-col items-center gap-6 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">Erro 404</p>
      <h1 className="font-display text-3xl font-bold text-text sm:text-4xl">Faixa não encontrada</h1>
      <p className="max-w-sm text-muted">
        Essa página não existe ou foi movida. Que tal voltar para a home e descobrir a próxima trilha?
      </p>
      <Button asChild>
        <Link to="/">Voltar para a home</Link>
      </Button>
    </div>
  )
}
