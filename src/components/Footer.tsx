import { Link } from '@tanstack/react-router'
import { CATEGORY_META, CATEGORY_ORDER } from '@/lib/category'
import { Logo } from '@/components/Logo'

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="container-editorial flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="flex items-center gap-2 font-display text-lg font-bold text-text">
            <Logo className="size-5 text-text" />
            SOUNDTRACKER
          </p>
          <p className="max-w-sm text-sm text-muted">
            A real-news curation of music made for screens — film, TV and games, scene by scene.
          </p>
        </div>

        <nav aria-label="Sections" className="flex flex-wrap gap-x-6 gap-y-3">
          {CATEGORY_ORDER.map((category) => (
            <Link
              key={category}
              to="/category/$category"
              params={{ category }}
              className="font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-text"
            >
              {CATEGORY_META[category].label}
            </Link>
          ))}
          <Link
            to="/about"
            className="font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-text"
          >
            About
          </Link>
        </nav>
      </div>
    </footer>
  )
}
