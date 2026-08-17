import { PlayCircle } from "lucide-react";
import { CtaButton } from "./CtaButton";
import { VSL_EMBED_URL } from "@/lib/lp-content";

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

        <div className="w-full overflow-hidden rounded-xl border border-border bg-card">
          <div className="relative mx-auto aspect-[9/16] w-full max-w-md">
            {VSL_EMBED_URL ? (
              <iframe
                src={VSL_EMBED_URL}
                title="Vídeo de apresentação do Combo EnferAprova"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-secondary text-center">
                <PlayCircle className="size-16 text-primary" aria-hidden="true" />
                <p className="px-6 text-sm text-muted-foreground">
                  Espaço reservado para a sua VSL (vídeo vertical 9:16).
                  <br />
                  Informe o link do player para ativar.
                </p>
              </div>
            )}
          </div>
        </div>

        <CtaButton respectDelay>🔓 Eu quero adquirir!</CtaButton>
        <p className="text-center text-xs text-muted-foreground">
          Compra 100% segura · Garantia incondicional de 7 dias
        </p>
      </div>
    </section>
  );
}
