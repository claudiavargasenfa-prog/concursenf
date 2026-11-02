import { CtaButton } from "./CtaButton";
import { PRODUCT } from "@/lib/lp-content";
import mockup from "@/assets/mockup-materiais.jpg";

export function Hero() {
  return (
    <section className="bg-background px-4 py-8 sm:py-12">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
        <h1 className="text-center text-xl font-semibold leading-relaxed sm:text-2xl">
          <span aria-hidden="true">🩺 </span>
          <strong className="font-extrabold text-highlight">
            Você só precisa de 30 minutos por dia para garantir sua vaga
          </strong>{" "}
          em qualquer concurso do Brasil como Enfermeira ou Técnica de Enfermagem
        </h1>

        <img
          src={mockup}
          alt={`Materiais de estudo do ${PRODUCT} em PDF`}
          width={1024}
          height={1024}
          className="w-full max-w-md rounded-2xl border border-border"
        />

        <CtaButton respectDelay>🔓 Eu quero adquirir!</CtaButton>
        <p className="text-center text-xs text-muted-foreground">
          Compra 100% segura · Garantia incondicional de 7 dias
        </p>
      </div>
    </section>
  );
}
