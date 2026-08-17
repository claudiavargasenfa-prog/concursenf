import { Quote, Star, Clock, BookOpenCheck, HeartPulse } from "lucide-react";
import { CtaButton } from "./CtaButton";
import { PAINS, TESTIMONIALS } from "@/lib/lp-content";
import mockup from "@/assets/mockup-materiais.jpg";

const PAIN_ICONS = [Clock, HeartPulse, BookOpenCheck];

export function Proof() {
  return (
    <section className="bg-surface-soft px-4 py-14 text-surface-soft-foreground">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-extrabold uppercase sm:text-3xl">
          <span aria-hidden="true">🤩 </span>Centenas de aprovações!
        </h2>
        <p className="mt-3 text-center text-base font-medium sm:text-lg">
          O método que aprovou centenas de Técnicas e Enfermeiras em todo o Brasil
          <span aria-hidden="true"> ⬇️</span>
        </p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <li
              key={t.name}
              className="rounded-xl bg-soft-card p-5 text-surface-soft-foreground shadow-sm"
            >
              <div className="flex items-center gap-1 text-highlight" aria-label="5 estrelas">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" aria-hidden="true" />
                ))}
              </div>
              <Quote className="mt-3 size-5 text-primary" aria-hidden="true" />
              <p className="mt-2 text-sm leading-relaxed text-soft-muted">{t.text}</p>
              <p className="mt-4 text-sm font-bold">{t.name}</p>
              <p className="text-xs text-soft-muted">{t.role}</p>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex justify-center">
          <CtaButton>Eu quero ser aprovada!</CtaButton>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-4xl">
        <h2 className="text-center text-xl font-extrabold sm:text-2xl">
          O Combo EnferAprova foi feito para você, Técnica ou Enfermeira, que:
        </h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {PAINS.map((pain, i) => {
            const Icon = PAIN_ICONS[i] ?? Clock;
            return (
              <li
                key={pain}
                className="rounded-xl bg-soft-card p-6 text-center text-surface-soft-foreground shadow-sm"
              >
                <Icon className="mx-auto size-10 text-primary" aria-hidden="true" />
                <p className="mt-4 text-sm font-semibold leading-relaxed">{pain}</p>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mx-auto mt-16 max-w-3xl text-center">
        <h2 className="text-xl font-extrabold sm:text-2xl">
          Algumas amostras dos materiais de estudo
          <span aria-hidden="true">👇</span>
        </h2>
        <img
          src={mockup}
          alt="Amostras dos e-books e mapas mentais de enfermagem em tablet e impressos"
          loading="lazy"
          width={1200}
          height={900}
          className="mt-6 w-full rounded-xl shadow-lg"
        />
      </div>
    </section>
  );
}
