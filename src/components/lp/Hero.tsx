import { CtaButton } from "./CtaButton";
import { PRODUCT } from "@/lib/lp-content";
import mockup from "@/assets/mockup-materiais.jpg";

export function Hero() {
  return (
    <section className="bg-background px-4 py-8 sm:py-12">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
        <h1 className="text-center text-xl font-semibold leading-relaxed sm:text-2xl">
          {PRODUCT}: <strong className="font-extrabold text-highlight">conhecimento para o próximo passo da sua carreira</strong>
        </h1>

        <img
          src={mockup}
          alt={`Materiais de estudo do ${PRODUCT} em PDF`}
          width={1024}
          height={1024}
          className="w-full max-w-md rounded-2xl border border-border"
        />

        <CtaButton>🔓 Eu quero adquirir!</CtaButton>
        <p className="text-center text-xs text-muted-foreground">
          Uma proposta da Academia da Enfermagem para técnicos e enfermeiros.
        </p>
      </div>
    </section>
  );
}
