import { Link } from "@tanstack/react-router";
import { BRAND } from "@/lib/site-content";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="text-base font-extrabold tracking-tight text-primary sm:text-lg">
          {BRAND}
        </Link>
        <nav className="flex items-center gap-4 text-sm font-semibold">
          <a href="#pacotes" className="hidden hover:text-primary sm:inline">
            Pacotes
          </a>
          <a href="#guias" className="hidden hover:text-primary sm:inline">
            Guias
          </a>
          <Link
            to="/concurso"
            className="rounded-full bg-primary px-4 py-2 text-primary-foreground transition hover:brightness-110"
          >
            Combo Aprovação
          </Link>
        </nav>
      </div>
    </header>
  );
}
