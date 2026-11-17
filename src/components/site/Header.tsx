import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { dynamicSupabase } from "@/lib/supabase/dynamic-client";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Activity,
  GraduationCap,
  LibraryBig,
  ListChecks,
  FolderOpen,
  BookMarked,
  Brain,
  Menu,
  Target,
  ShieldCheck,
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
  { label: "Aprenda a estudar", to: "/aprenda-a-estudar", icon: Brain },
  { label: "Minha aprendizagem", to: "/aprendizagem", icon: Activity },
] as const;

// Admin link visibility uses the server-side is_catalog_admin() check (JWT app_metadata).
function useIsCatalogAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    let active = true;
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { if (active) setIsAdmin(false); return; }
      const { data, error } = await dynamicSupabase.rpc("is_catalog_admin");
      if (active) setIsAdmin(!error && data === true);
    };
    void check();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") void check();
    });
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, []);
  return isAdmin;
}

export function Header() {
  const isAdmin = useIsCatalogAdmin();
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-card/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="group flex min-w-0 shrink-0 items-center gap-3" aria-label="ConcursEnf — área acadêmica">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-md transition-transform group-hover:-rotate-6">
            <GraduationCap className="size-6" />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block text-base font-black tracking-tight text-foreground sm:text-lg">
              Concurs<span className="text-primary">Enf</span>
            </span>
            <span className="hidden whitespace-nowrap text-[10px] font-semibold uppercase tracking-[.15em] text-muted-foreground sm:block">
              Preparação em enfermagem
            </span>
          </span>
        </Link>

        <nav aria-label="Navegação principal" className="hidden min-w-0 items-center gap-3 text-[13px] font-semibold xl:flex [&_a]:whitespace-nowrap [&_a>svg]:hidden">
          <Link to="/" className="inline-flex items-center gap-1.5 whitespace-nowrap text-muted-foreground transition hover:text-primary">
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
          <Link to="/aprenda-a-estudar" className="inline-flex items-center gap-1.5 whitespace-nowrap text-muted-foreground transition hover:text-primary"><Brain className="size-4" /> Aprenda a estudar</Link>
          <Link to="/aprendizagem" className="inline-flex items-center gap-1.5 whitespace-nowrap text-muted-foreground transition hover:text-primary"><Activity className="size-4" /> Minha aprendizagem</Link>
          {isAdmin && <Link to="/admin-conteudos" className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground transition hover:text-primary"><ShieldCheck className="size-3.5" />Admin</Link>}
          <Link to="/entrar" className="inline-flex items-center whitespace-nowrap rounded-full border border-border px-3 py-2 text-xs font-extrabold text-foreground transition hover:bg-accent">Entrar</Link>
          <Link to="/cadastro" className="inline-flex items-center whitespace-nowrap rounded-full border border-primary/40 px-3 py-2 text-xs font-extrabold text-primary transition hover:bg-primary/5">Criar conta</Link>
          <Link to="/concurso" className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-primary px-3.5 py-2.5 text-xs font-extrabold text-primary-foreground shadow-md transition hover:-translate-y-0.5 hover:shadow-lg">
            Combo Aprovação <ArrowUpRight className="size-4" />
          </Link>
        </nav>

        <div className="flex items-center gap-2 xl:hidden">
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
                {isAdmin && <SheetClose asChild><Link to="/admin-conteudos" className="flex min-h-12 items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-muted-foreground transition hover:bg-accent hover:text-primary"><ShieldCheck className="size-5 text-primary" />Admin</Link></SheetClose>}
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
