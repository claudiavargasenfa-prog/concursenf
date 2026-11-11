import { BookOpenCheck, Clock, HeartPulse, Search, Target } from "lucide-react";
import { PAINS } from "@/lib/lp-content";
import mockup from "@/assets/mockup-materiais.jpg";
import { useSiteContent } from "@/hooks/useSiteContent";

const PAIN_ICONS = [Clock, HeartPulse, BookOpenCheck];

export function Proof() {
  const content = useSiteContent("lp.proof", { eyebrow: "Uma rotina mais organizada", title: "Estudar para concurso exige método, constância e bons materiais.", description: "O Combo Aprovação foi estruturado para reunir assuntos importantes em uma sequência de consulta e revisão.", pains: PAINS, featureTitle: "Conteúdo visual para facilitar a revisão.", featureDescription: "Consulte a organização dos temas e identifique os assuntos que fazem sentido para o edital que você está estudando.", mockup: "" });
  const pains = Array.isArray(content.pains) ? content.pains as string[] : PAINS;
  return (
    <section className="bg-background px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center"><p className="text-xs font-extrabold uppercase tracking-[.2em] text-primary">{content.eyebrow}</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{content.title}</h2><p className="mt-4 text-sm leading-7 text-muted-foreground">{content.description}</p></div>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {pains.map((pain, i) => { const Icon = PAIN_ICONS[i] ?? Target; return <li key={pain} className="rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary"><Icon className="size-6" /></span><p className="mt-4 text-sm font-semibold leading-7 text-foreground">{pain}</p></li>; })}
        </ul>
        <div className="mt-12 grid items-center gap-8 rounded-[2rem] bg-surface-soft p-6 text-surface-soft-foreground sm:p-9 md:grid-cols-2">
          <div><p className="text-xs font-extrabold uppercase tracking-[.2em] text-primary">Conheça a proposta</p><h3 className="mt-3 text-2xl font-black">{content.featureTitle}</h3><p className="mt-3 text-sm leading-7 text-soft-muted">{content.featureDescription}</p><a href="#conteudo-combo" className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-primary hover:underline"><Search className="size-4" /> Ver disciplinas e tópicos</a></div>
          <img src={content.mockup || mockup} alt="Amostra visual dos materiais de estudo de enfermagem" loading="lazy" width={1200} height={900} className="w-full rounded-2xl border border-border shadow-xl" />
        </div>
      </div>
    </section>
  );
}
