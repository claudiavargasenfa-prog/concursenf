import { ShieldCheck } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CtaButton } from "./CtaButton";
import { AUTHOR, BRAND, FAQ, OFFER } from "@/lib/lp-content";
import autoraFoto from "@/assets/autora.jpg";

export function Offer() {
  return (
    <>
      <section className="bg-surface-soft px-4 py-14 text-surface-soft-foreground">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-xl font-extrabold uppercase sm:text-2xl">
            Estude as matérias mais cobradas através do Combo Aprovação
            <span aria-hidden="true"> ⬇️</span>
          </h2>
          <p className="mt-4 text-base font-semibold">
            Você irá levar +60 materiais de estudo + banco de questões + todos os bônus inclusos
          </p>

          <div className="mt-8 rounded-2xl bg-soft-card p-8 text-surface-soft-foreground shadow-xl">
            <p className="text-sm font-bold uppercase text-soft-muted">Por apenas</p>
            <p className="mt-1 text-lg font-bold">{OFFER.installments}</p>
            <p className="text-5xl font-black text-primary sm:text-6xl">
              {OFFER.installmentValue}
            </p>
            <p className="mt-2 text-base">
              ou <strong>{OFFER.cash}</strong> à vista!
            </p>
            <p className="mt-4 text-sm font-bold text-destructive">
              <span aria-hidden="true">⚠️ </span>
              {OFFER.discount}
            </p>
            <div className="mt-6 flex justify-center">
              <CtaButton>🔓 Adquirir o combo!</CtaButton>
            </div>
            <p className="mt-4 text-sm text-soft-muted">
              Menos que o preço de uma pizza por mês <span aria-hidden="true">🍕</span> para
              investir na sua aprovação.
            </p>
          </div>

          <div className="mt-10 rounded-2xl border-2 border-primary bg-soft-card p-8 text-surface-soft-foreground">
            <ShieldCheck className="mx-auto size-12 text-primary" aria-hidden="true" />
            <h3 className="mt-3 text-xl font-extrabold">Garantia de 7 dias!</h3>
            <p className="mt-2 text-sm text-soft-muted">
              Você tem uma garantia incondicional de 7 dias para testar o produto. Se não ficar
              satisfeita nesse prazo, basta solicitar o reembolso do seu valor, sem burocracia.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-background px-4 py-14">
        <div className="mx-auto grid max-w-4xl items-center gap-8 md:grid-cols-2">
          <img
            src={autoraFoto}
            alt={`${AUTHOR.name}, ${AUTHOR.role}`}
            loading="lazy"
            width={1024}
            height={1024}
            className="mx-auto w-full max-w-sm rounded-2xl"
          />
          <div>
            <h2 className="text-xl font-extrabold uppercase">
              <span aria-hidden="true">🙋‍♀️ </span>Quem vai te ensinar
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
          Este produto não garante aprovação; os resultados variam conforme a dedicação de cada
          aluna. Dúvidas: {AUTHOR.contactEmail}
        </p>
        <p className="mt-2">© {new Date().getFullYear()} Todos os direitos reservados.</p>
      </footer>
    </>
  );
}
