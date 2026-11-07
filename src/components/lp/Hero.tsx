import { Lock, ShieldCheck } from "lucide-react";
import foto from "@/assets/enfermeira-hospital.jpg";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-surface-soft px-4 py-14 text-surface-soft-foreground sm:py-20">
      <div className="pointer-events-none absolute -right-24 -top-24 -z-10 size-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/70 px-4 py-2 text-xs font-extrabold uppercase tracking-[.14em] text-primary"><ShieldCheck className="size-4 shrink-0" /> Desenvolvido por quem vive a enfermagem e domina as bancas há décadas.</span>
          <h1 className="mt-6 text-3xl font-black leading-[1.12] tracking-tight sm:text-5xl">Domine a Legislação do SUS e da EBSERH e <span className="text-primary">Blinde sua Mente contra as Pegadinhas da FGV</span> — Mesmo que você só tenha 30 minutos livres entre os plantões.</h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-soft-muted">Um método neuroadaptativo com mapas mentais esquematizados dos pontos que realmente caem, criado por especialistas para quem não tem tempo a perder com PDFs gigantes.</p>
          <div className="mt-8">
            <a href="#conteudo-combo" className="inline-flex min-h-14 animate-pulse items-center justify-center rounded-full bg-success px-8 py-4 text-base font-black uppercase tracking-wide text-success-foreground shadow-lg transition hover:-translate-y-1">Quero ser aprovado na EBSERH</a>
            <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-soft-muted"><Lock className="size-4" /> Acesso imediato após o pagamento seguro.</p>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute -inset-4 rounded-[2rem] bg-primary/10 blur-2xl" />
          <img src={foto} alt="Enfermeira em um hospital" width={1024} height={1152} className="relative aspect-[8/9] w-full rounded-[2rem] border border-border object-cover shadow-2xl" />
        </div>
      </div>
    </section>
  );
}
