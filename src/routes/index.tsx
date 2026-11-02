import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Clock3, BookOpenCheck, ShieldQuestion, Sparkles } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CtaButton } from "@/components/lp/CtaButton";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import {
  AUDIENCE,
  AUTHOR,
  BENEFITS,
  BRAND,
  GUIDES,
  PACKS,
  SITE_FAQ,
  TAGLINE,
} from "@/lib/site-content";
import mockup from "@/assets/mockup-materiais.jpg";
import autoraFoto from "@/assets/claudia-vargas.png.asset.json";

const title = "Academia da Enfermagem — Resumos esquematizados de enfermagem";
const description =
  "Resumos visuais de enfermagem, SUS, políticas de saúde e português para técnicos e enfermeiros. Estude menos tempo e aprenda de verdade.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const icons = [Clock3, BookOpenCheck, ShieldQuestion];

function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background font-sans">
        {/* Hero */}
        <section className="bg-surface-soft px-4 py-14 text-surface-soft-foreground">
          <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                <Sparkles className="size-4" aria-hidden="true" /> {BRAND}
              </p>
              <h1 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
                Enfermagem que cabe na sua rotina:{" "}
                <span className="text-primary">resumos que você entende de primeira</span>
              </h1>
              <p className="mt-4 text-base text-soft-muted">{TAGLINE}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#pacotes"
                  className="rounded-full bg-primary px-7 py-4 text-sm font-extrabold uppercase text-primary-foreground shadow-lg transition hover:brightness-110"
                >
                  Ver os pacotes
                </a>
                <Link
                  to="/concurso"
                  className="rounded-full border-2 border-primary px-7 py-4 text-sm font-extrabold uppercase text-primary transition hover:bg-primary/10"
                >
                  Quero passar em concurso
                </Link>
              </div>
            </div>
            <img
              src={mockup}
              alt="Materiais de estudo de enfermagem em PDF"
              width={1024}
              height={1024}
              className="mx-auto w-full max-w-md rounded-3xl border border-border shadow-xl"
            />
          </div>
        </section>

        {/* Para você */}
        <section className="px-4 py-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-2xl font-extrabold sm:text-3xl">
              Feito para quem vive a enfermagem de verdade
            </h2>
            <ul className="mt-10 grid gap-5 md:grid-cols-3">
              {AUDIENCE.map((item, i) => {
                const Icon = icons[i] ?? Clock3;
                return (
                  <li key={item.title} className="rounded-2xl border border-border bg-card p-6">
                    <Icon className="size-9 text-primary" aria-hidden="true" />
                    <h3 className="mt-4 text-base font-bold leading-snug">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Benefícios */}
        <section className="bg-accent/40 px-4 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-extrabold sm:text-3xl">
              Menos páginas, mais aprendizado
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Nada de resumo que parece monografia. Cada material foi montado para você revisar rápido
              e lembrar na hora que importa.
            </p>
            <ul className="mt-8 space-y-3 text-left">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-3 rounded-xl bg-card p-4 text-sm">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Pacotes */}
        <section id="pacotes" className="scroll-mt-20 px-4 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-2xl font-extrabold sm:text-3xl">
              Escolha o caminho do seu estudo
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-base text-muted-foreground">
              Cada pacote reúne os temas de uma grande área. São os mesmos temas que estarão
              disponíveis no aplicativo.
            </p>
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {PACKS.map((pack) => (
                <li
                  key={pack.slug}
                  className="flex flex-col rounded-2xl border border-border bg-card p-6 transition hover:border-primary"
                >
                  <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase text-primary">
                    {pack.audience}
                  </span>
                  <h3 className="mt-3 text-lg font-bold leading-snug">{pack.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{pack.summary}</p>
                  <ul className="mt-4 space-y-2 text-sm">
                    {pack.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <CtaButton className="mt-6 px-5 py-3 text-sm sm:text-sm">Quero este pacote</CtaButton>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Guias individuais */}
        <section id="guias" className="scroll-mt-20 bg-surface-soft px-4 py-16 text-surface-soft-foreground">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-2xl font-extrabold sm:text-3xl">
              Procurando algo mais específico?
            </h2>
            <p className="mt-3 text-center text-base text-soft-muted">
              Guias avulsos para resolver uma dúvida pontual, sem comprar um pacote inteiro.
            </p>
            <ul className="mt-10 grid gap-5 sm:grid-cols-2">
              {GUIDES.map((g) => (
                <li key={g.title} className="rounded-2xl bg-soft-card p-6 shadow-sm">
                  <h3 className="text-base font-bold">{g.title}</h3>
                  <p className="mt-2 text-sm text-soft-muted">{g.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Autora */}
        <section className="px-4 py-16">
          <div className="mx-auto grid max-w-4xl items-center gap-8 md:grid-cols-2">
            <img
              src={autoraFoto.url}
              alt={`${AUTHOR.name}, ${AUTHOR.role}`}
              loading="lazy"
              width={1024}
              height={1024}
              className="mx-auto w-full max-w-sm rounded-3xl"
            />
            <div>
              <h2 className="text-2xl font-extrabold">Quem está por trás</h2>
              <h3 className="mt-2 text-lg font-bold text-primary">
                {AUTHOR.name} — {AUTHOR.role}
              </h3>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                {AUTHOR.bio.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 pb-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-extrabold">Perguntas frequentes</h2>
            <Accordion type="single" collapsible className="mt-6">
              {SITE_FAQ.map((item) => (
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
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
