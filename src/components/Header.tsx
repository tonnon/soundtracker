import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Menu, Search } from 'lucide-react'
import { CATEGORY_META, CATEGORY_ORDER } from '@/lib/category'
import { Sheet, SheetTrigger, SheetContent, SheetClose } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

function Wordmark() {
  return (
    <Link to="/" className="flex items-center font-display text-xl font-bold tracking-tight text-text">
      soundtracker
      <span className="ml-0.5 text-amber animate-cursor-blink" aria-hidden="true">
        ▮
      </span>
    </Link>
  )
}

function CategoryNavLinks({ onNavigate, className }: { onNavigate?: () => void; className?: string }) {
  return (
    <>
      {CATEGORY_ORDER.map((category) => {
        const meta = CATEGORY_META[category]
        return (
          <Link
            key={category}
            to="/editoria/$category"
            params={{ category }}
            onClick={onNavigate}
            className={cn(
              'font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-text',
              className,
            )}
            activeProps={{
              className: cn(meta.text, 'underline underline-offset-8 decoration-2'),
              'aria-current': 'page',
            }}
          >
            {meta.label}
          </Link>
        )
      })}
    </>
  )
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-line bg-surface/95 backdrop-blur-sm">
      <div className="container-editorial flex h-full items-center justify-between">
        <Wordmark />

        <nav aria-label="Editorias" className="hidden items-center gap-8 md:flex">
          <CategoryNavLinks />
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/busca"
            className="hidden items-center gap-2 rounded-sm p-2 text-muted transition-colors hover:text-text md:flex"
            aria-label="Buscar"
          >
            <Search className="size-5" aria-hidden="true" />
          </Link>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="flex items-center justify-center rounded-sm p-2 text-text md:hidden"
                aria-label="Abrir menu"
              >
                <Menu className="size-6" aria-hidden="true" />
              </button>
            </SheetTrigger>
            <SheetContent title="Menu de navegação">
              <nav aria-label="Editorias" className="mt-10 flex flex-col gap-6">
                <CategoryNavLinks onNavigate={() => setMobileOpen(false)} className="text-base" />
                <SheetClose asChild>
                  <Link
                    to="/busca"
                    className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted hover:text-text"
                  >
                    <Search className="size-4" aria-hidden="true" />
                    Buscar
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link to="/sobre" className="font-mono text-xs uppercase tracking-widest text-muted hover:text-text">
                    Sobre
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
