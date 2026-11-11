import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  GraduationCap,
  LibraryBig,
  ListChecks,
  FolderOpen,
  BookMarked,
  Menu,
  Target,
} from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const mobileLinks = [
  { label: "Acadêmicos", to: "/", icon: BookOpen },
  { label: "Concursos", to: "/concurso", icon: Target },
  { label: "Biblioteca", to: "/", hash: "biblioteca", icon: LibraryBig },
  { label: "Materiais", to: "/materiais", icon: FolderOpen },
  { label: "Biblioteca EBSERH", to: "/biblioteca-concursos", icon: BookMarked },
  { label: "Questões", to: "/questoes", icon: ListChecks },
  { label: "Meu plano", to: "/plano-de-estudos", icon: CalendarDays },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-card/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="group flex min-w-0 items-center gap-3" aria-label="ConcursEnf — área acadêmica">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-md transition-transform group-hover:-rotate-6">
            <GraduationCap className="size-6" />
          </span>
          <span className="leading-tight">
            <span className="block text-base font-black tracking-tight text-foreground sm:text-lg">
              Concurs<span className="text-primary">Enf</span>
            </span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[.15em] text-muted-foreground sm:block">
              Preparação em enfermagem
            </span>
          </span>
        </Link>

        <nav aria-label="Navegação principal" className="hidden items-center gap-3 text-sm font-semibold lg:flex xl:gap-5">
          <Link to="/" className="inline-flex items-center gap-1.5 text-muted-foreground transition hover:text-primary">
            <BookOpen className="size-4" /> Acadêmicos
          </Link>
          <Link to="/concurso" className="inline-flex items-center gap-1.5 text-muted-foreground transition hover:text-primary">
            <Target className="size-4" /> Concursos
          </Link>
          <Link to="/" hash="biblioteca" className="inline-flex items-center gap-1.5 text-muted-foreground transition hover:text-primary">
            <LibraryBig className="size-4" /> Biblioteca
          </Link>
          <Link to="/materiais" className="inline-flex items-center gap-1.5 text-muted-foreground transition hover:text-primary">
            <FolderOpen className="size-4" /> Materiais
          </Link>
          <Link to="/questoes" className="inline-flex items-center gap-1.5 text-muted-foreground transition hover:text-primary">
            <ListChecks className="size-4" /> Questões
          </Link>
          <Link to="/plano-de-estudos" className="inline-flex items-center gap-1.5 text-muted-foreground transition hover:text-primary">
            <CalendarDays className="size-4" /> Meu plano
          </Link>
          <Link to="/entrar" className="inline-flex items-center rounded-full border border-border px-4 py-2.5 text-xs font-extrabold text-foreground transition hover:bg-accent sm:text-sm">Entrar</Link>
          <Link to="/cadastro" className="inline-flex items-center rounded-full border border-primary/40 px-4 py-2.5 text-xs font-extrabold text-primary transition hover:bg-primary/5 sm:text-sm">Criar conta</Link>
          <Link to="/concurso" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-xs font-extrabold text-primary-foreground shadow-md transition hover:-translate-y-0.5 hover:shadow-lg sm:text-sm">
            Combo Aprovação <ArrowUpRight className="size-4" />
          </Link>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <Link
            to="/concurso"
            className="inline-flex items-center rounded-full bg-primary px-3 py-2 text-xs font-extrabold text-primary-foreground shadow-sm"
          >
            Concursos
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Abrir menu de navegação"
                className="grid size-10 place-items-center rounded-xl border border-border bg-background text-foreground transition hover:bg-accent"
              >
                <Menu className="size-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(86vw,22rem)]">
              <SheetHeader className="mb-6 pr-8 text-left">
                <SheetTitle className="text-left">Navegação</SheetTitle>
                <p className="text-sm text-muted-foreground">Escolha a área que deseja acessar.</p>
              </SheetHeader>
              <nav aria-label="Navegação móvel" className="flex flex-col gap-2">
                {mobileLinks.map(({ label, to, icon: Icon, ...rest }) => (
                  <SheetClose asChild key={label}>
                    <Link
                      to={to}
                      {...("hash" in rest && rest.hash ? { hash: rest.hash } : {})}
                      className="flex min-h-12 items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-foreground transition hover:bg-accent hover:text-primary"
                    >
                      <Icon className="size-5 text-primary" />
                      {label}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Link to="/entrar" className="mt-3 inline-flex min-h-12 items-center justify-center rounded-xl border border-border px-4 py-3 text-sm font-extrabold text-foreground">Entrar na minha conta</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link to="/cadastro" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-primary/40 px-4 py-3 text-sm font-extrabold text-primary">Criar conta de aluno</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    to="/concurso"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground"
                  >
                    Combo Aprovação <ArrowUpRight className="size-4" />
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
