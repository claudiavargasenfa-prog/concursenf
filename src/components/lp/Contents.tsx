import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CtaButton } from "./CtaButton";
import { CONTENT_GROUPS } from "@/lib/lp-content";

export function Contents() {
  return (
    <section className="bg-background px-4 py-14">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-2xl font-extrabold uppercase sm:text-3xl">
          Uma base de estudos para avançar com confiança
        </h2>
        <p className="mt-4 text-center text-base text-muted-foreground">
          Conheça os assuntos previstos para o aplicativo da Academia da Enfermagem:
          conhecimentos profissionais, saúde pública e língua portuguesa.
        </p>

        {CONTENT_GROUPS.map((group) => (
          <div key={group.title} className="mt-10">
            <h3 className="text-lg font-bold uppercase text-primary">
              {group.title} <span aria-hidden="true">⬇️</span>
            </h3>
            <Accordion type="single" collapsible className="mt-3">
              {group.items.map((item) => (
                <AccordionItem key={item.name} value={item.name}>
                  <AccordionTrigger className="text-left text-sm font-semibold sm:text-base">
                    {item.name}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                      {item.topics.map((topic) => (
                        <li key={topic}>{topic}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}

        <div className="mt-10 flex justify-center">
          <CtaButton>Conhecer o acesso</CtaButton>
        </div>
      </div>
    </section>
  );
}
