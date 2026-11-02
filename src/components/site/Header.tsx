import { Link } from "@tanstack/react-router";
import { ArrowUpRight, BookOpen, CalendarDays, GraduationCap, LibraryBig, ListChecks, FolderOpen } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-card/85 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="group flex items-center gap-3" aria-label="ConcursEnf — início">
          <span className="grid size-10 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-md transition-transform group-hover:-rotate-6">
            <GraduationCap className="size-6" />
          </span>
          <span className="leading-tight">
            <span className="block text-base font-black tracking-tight text-foreground sm:text-lg">Concurs<span className="text-primary">Enf</span></span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[.15em] text-muted-foreground sm:block">Preparação em enfermagem</span>
          </span>
        </Link>
        <nav aria-label="Navegação principal" className="flex items-center gap-2 text-sm font-semibold sm:gap-5">
          <a href="/#trilhas" className="hidden items-center gap-1.5 text-muted-foreground transition hover:text-primary md:inline-flex"><BookOpen className="size-4" /> Trilhas</a>
          <a href="/#biblioteca" className="hidden items-center gap-1.5 text-muted-foreground transition hover:text-primary sm:inline-flex"><LibraryBig className="size-4" /> Biblioteca</a>
          <a href="/#guias" className="hidden text-muted-foreground transition hover:text-primary lg:inline">Guias</a>
          <Link to="/materiais" className="hidden items-center gap-1.5 text-muted-foreground transition hover:text-primary lg:inline-flex"><FolderOpen className="size-4" /> Materiais</Link>
          <Link to="/questoes" className="hidden items-center gap-1.5 text-muted-foreground transition hover:text-primary lg:inline-flex"><ListChecks className="size-4" /> Questões</Link>
          <Link to="/plano-de-estudos" className="hidden items-center gap-1.5 text-muted-foreground transition hover:text-primary lg:inline-flex"><CalendarDays className="size-4" /> Meu plano</Link>
          <Link to="/concurso" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-xs font-extrabold text-primary-foreground shadow-md transition hover:-translate-y-0.5 hover:shadow-lg sm:px-5 sm:text-sm">Combo Aprovação <ArrowUpRight className="size-4" /></Link>
        </nav>
      </div>
    </header>
  );
}
