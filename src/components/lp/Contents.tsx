import { Gift } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CtaButton } from "./CtaButton";
import { BONUSES, CONTENT_GROUPS } from "@/lib/lp-content";

export function Contents() {
  return (
    <section className="bg-background px-4 py-14">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-2xl font-extrabold uppercase sm:text-3xl">
          Tudo que você vai receber:
        </h2>
        <p className="mt-4 text-center text-base text-muted-foreground">
          Principais temáticas da Enfermagem, somando mais de{" "}
          <strong className="text-highlight">60 e-books</strong> de conteúdo esquematizado e
          questões comentadas, tudo disponível em uma área de membros exclusiva.
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

        <p className="mt-10 text-center text-xl font-extrabold uppercase">
          E muitos outros! <span aria-hidden="true">👇</span>
        </p>
        <div className="mt-6 flex justify-center">
          <CtaButton>🔓 Liberar materiais</CtaButton>
        </div>

        <h2 className="mt-16 text-center text-2xl font-extrabold sm:text-3xl">
          Veja a lista de <span className="text-highlight">bônus</span> inclusos
          <span aria-hidden="true"> ⬇️</span>
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {BONUSES.map((bonus) => (
            <li key={bonus.title} className="rounded-xl border border-border bg-card p-6">
              <Gift className="size-8 text-primary" aria-hidden="true" />
              <h3 className="mt-3 text-base font-bold uppercase leading-snug">{bonus.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{bonus.desc}</p>
              <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-extrabold uppercase text-primary-foreground">
                Bônus incluso · Grátis
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex justify-center">
          <CtaButton>🔓 Liberar os bônus</CtaButton>
        </div>
      </div>
    </section>
  );
}
