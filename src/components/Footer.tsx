import { Link } from '@tanstack/react-router'
import { CATEGORY_META, CATEGORY_ORDER } from '@/lib/category'

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="container-editorial flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="font-display text-lg font-bold text-text">soundtracker</p>
          <p className="max-w-sm text-sm text-muted">
            Jornalismo dedicado à música feita para telas — cinema, séries e jogos, cena a cena.
          </p>
        </div>

        <nav aria-label="Editorias" className="flex flex-wrap gap-x-6 gap-y-3">
          {CATEGORY_ORDER.map((category) => (
            <Link
              key={category}
              to="/editoria/$category"
              params={{ category }}
              className="font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-text"
            >
              {CATEGORY_META[category].label}
            </Link>
          ))}
          <Link
            to="/sobre"
            className="font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-text"
          >
            Sobre
          </Link>
        </nav>
      </div>
    </footer>
  )
}
