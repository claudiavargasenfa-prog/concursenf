import { Clock, BookOpenCheck, HeartPulse } from "lucide-react";
import { CtaButton } from "./CtaButton";
import { PAINS } from "@/lib/lp-content";
import mockup from "@/assets/mockup-materiais.jpg";

const PAIN_ICONS = [Clock, HeartPulse, BookOpenCheck];

export function Proof() {
  return (
    <section className="bg-surface-soft px-4 py-14 text-surface-soft-foreground">
      <div className="mx-auto mt-16 max-w-4xl">
        <h2 className="text-center text-xl font-extrabold sm:text-2xl">
          Seu objetivo, sua rotina, seu caminho de estudo
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
          Enfermagem, SUS e português na sua jornada
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
