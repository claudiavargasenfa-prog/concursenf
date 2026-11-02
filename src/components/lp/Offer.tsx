import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CtaButton } from "./CtaButton";
import { AUTHOR, BRAND, FAQ } from "@/lib/lp-content";
import autoraFoto from "@/assets/claudia-vargas.png.asset.json";

export function Offer() {
  return (
    <>
      <section className="bg-background px-4 py-14">
        <div className="mx-auto grid max-w-4xl items-center gap-8 md:grid-cols-2">
          <img
            src={autoraFoto.url}
            alt={`${AUTHOR.name}, ${AUTHOR.role}`}
            loading="lazy"
            width={1024}
            height={1024}
            className="mx-auto w-full max-w-sm rounded-2xl"
          />
          <div>
            <h2 className="text-xl font-extrabold uppercase">
              <span aria-hidden="true">🙋‍♀️ </span>Idealização e cuidado com o conteúdo
            </h2>
            <h3 className="mt-2 text-lg font-bold text-primary">
              {AUTHOR.name} — {AUTHOR.role}
            </h3>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              {AUTHOR.bio.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="mt-6">
              <CtaButton>Quero ser aprovada!</CtaButton>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background px-4 pb-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-extrabold">
            <span aria-hidden="true">🧐 </span>Perguntas frequentes
          </h2>
          <Accordion type="single" collapsible className="mt-6">
            {FAQ.map((item) => (
              <AccordionItem key={item.q} value={item.q}>
                <AccordionTrigger className="text-left text-sm font-semibold sm:text-base">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-10 flex justify-center">
            <CtaButton>Quero ser aprovada!</CtaButton>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-card px-4 py-10 text-center text-xs text-muted-foreground">
        <p>{BRAND} · Materiais de estudo em PDF para concursos de enfermagem.</p>
        <p className="mt-2">
          Projeto de Cláudia Vargas — Idealizadora e Enfermeira.
        </p>
        <p className="mt-2">© {new Date().getFullYear()} Todos os direitos reservados.</p>
      </footer>
    </>
  );
}
