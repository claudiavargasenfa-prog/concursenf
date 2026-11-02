import { ArrowRight, BookOpenCheck, CheckCircle2, GraduationCap } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { PRODUCT } from "@/lib/lp-content";
import mockup from "@/assets/mockup-materiais.jpg";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-surface-soft px-4 py-14 text-surface-soft-foreground sm:py-20">
      <div className="pointer-events-none absolute -right-24 -top-24 -z-10 size-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_.9fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/70 px-4 py-2 text-xs font-extrabold uppercase tracking-[.16em] text-primary"><GraduationCap className="size-4" /> Preparação para concursos</span>
          <p className="mt-6 text-xs font-extrabold uppercase tracking-[.2em] text-primary">Combo Aprovação</p>
          <h1 className="mt-3 text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl">Transforme seu conteúdo de estudo em <span className="text-primary">uma preparação com direção.</span></h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-soft-muted">Conheça o {PRODUCT}: uma seleção de temas de enfermagem, políticas de saúde e português organizados para apoiar sua rotina de preparação.</p>
          <ul className="mt-6 space-y-3 text-sm font-semibold">
            {["Conteúdos organizados por disciplina", "Temas de enfermagem, SUS e português", "Materiais para revisar no seu ritmo"].map((item) => <li key={item} className="flex items-center gap-3"><CheckCircle2 className="size-5 shrink-0 text-primary" />{item}</li>)}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#conteudo-combo" className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-primary px-7 py-4 text-sm font-extrabold text-primary-foreground shadow-lg transition hover:-translate-y-1">Explorar disciplinas <ArrowRight className="size-4" /></a>
            <Link to="/" className="inline-flex min-h-14 items-center justify-center rounded-full border border-primary/40 bg-card/60 px-7 py-4 text-sm font-bold text-primary transition hover:bg-card">Voltar ao início</Link>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-4 rounded-[2rem] bg-primary/10 blur-2xl" />
          <img src={mockup} alt={`Materiais de estudo do ${PRODUCT} em PDF`} width={1024} height={1024} className="relative aspect-[1.12/1] w-full rounded-[2rem] border border-border object-cover shadow-2xl" />
          <div className="absolute -bottom-4 left-4 flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-xl sm:left-8"><span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><BookOpenCheck className="size-5" /></span><div><p className="text-xs font-extrabold text-foreground">Estudo organizado</p><p className="mt-1 text-[11px] text-muted-foreground">Disciplina por disciplina</p></div></div>
        </div>
      </div>
    </section>
  );
}
