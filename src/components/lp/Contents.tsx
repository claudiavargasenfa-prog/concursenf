import { Gift, LibraryBig } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CtaButton } from "./CtaButton";
import { BONUSES, CONTENT_GROUPS } from "@/lib/lp-content";
import { useSiteContent } from "@/hooks/useSiteContent";

export function Contents() {
  const content = useSiteContent("lp.contents", { eyebrow: "Biblioteca do Combo", title: "Explore as disciplinas e os assuntos", description: "Abra cada disciplina para consultar os tópicos que já estão organizados no catálogo.", bonusTitle: "Recursos adicionais descritos no catálogo" });
  return (
    <section id="conteudo-combo" className="scroll-mt-24 bg-surface-soft px-4 py-16 text-surface-soft-foreground sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center"><p className="text-xs font-extrabold uppercase tracking-[.2em] text-primary">{content.eyebrow}</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{content.title}</h2><p className="mt-4 text-sm leading-7 text-soft-muted">{content.description}</p></div>
        {CONTENT_GROUPS.map((group) => <div key={group.title} className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7">
          <h3 className="flex items-center gap-3 text-base font-extrabold text-foreground"><span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><LibraryBig className="size-5" /></span>{group.title}</h3>
          <Accordion type="multiple" className="mt-3">
            {group.items.map((item) => <AccordionItem key={item.name} value={item.name}><AccordionTrigger className="text-left text-sm font-bold sm:text-base">{item.name}<span className="ml-2 text-xs font-medium text-muted-foreground">{item.topics.length} tópicos</span></AccordionTrigger><AccordionContent><ul className="grid gap-2 pl-1 sm:grid-cols-2">{item.topics.map((topic) => <li key={topic} className="list-inside list-disc text-sm leading-6 text-muted-foreground">{topic}</li>)}</ul></AccordionContent></AccordionItem>)}
          </Accordion>
        </div>)}
        <div className="mt-12 rounded-3xl border border-border bg-card p-6 sm:p-8"><div className="text-center"><p className="text-xs font-extrabold uppercase tracking-[.2em] text-primary">Materiais complementares</p><h3 className="mt-2 text-2xl font-black text-foreground">{content.bonusTitle}</h3></div><ul className="mt-7 grid gap-4 sm:grid-cols-2">{BONUSES.map((bonus) => <li key={bonus.title} className="rounded-2xl border border-border bg-background p-5"><Gift className="size-7 text-primary" /><h4 className="mt-3 text-sm font-extrabold text-foreground">{bonus.title}</h4><p className="mt-2 text-sm leading-6 text-muted-foreground">{bonus.desc}</p></li>)}</ul><p className="mt-5 text-center text-xs leading-5 text-muted-foreground">A disponibilidade e as condições de cada recurso complementar devem ser confirmadas antes da contratação.</p></div>
        <div className="mt-8 flex justify-center"><CtaButton>Tenho interesse no Combo Aprovação</CtaButton></div>
      </div>
    </section>
  );
}
