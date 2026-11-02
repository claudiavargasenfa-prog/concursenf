import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, BookOpen, BookOpenCheck, CalendarDays, Check, CheckCircle2, ChevronRight, ListChecks,
  Clock3, FileText, GraduationCap, HeartPulse, LibraryBig, Search,
  ShieldCheck, Sparkles, Stethoscope, Target, X,
} from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { CtaButton } from "@/components/lp/CtaButton";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import {
  AUDIENCE, AUTHOR, BENEFITS, BRAND, GUIDES, PACKS, SITE_FAQ, TAGLINE,
} from "@/lib/site-content";
import {
  CONTENT_GROUPS, FAQ, PLATFORM_BONUSES, PLATFORM_FEATURES, PLATFORM_OFFER,
} from "@/lib/lp-content";
import mockup from "@/assets/mockup-materiais.jpg";
import autoraFoto from "@/assets/claudia-vargas.png.asset.json";

const title = "ConcursEnf | Preparação inteligente para concursos de enfermagem";
const description =
  "Organize seus estudos para concursos de enfermagem com conteúdos esquematizados, trilhas por disciplina, guias de revisão e materiais para técnicos e enfermeiros.";

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

const audienceIcons = [Clock3, BookOpenCheck, ShieldCheck];
const pathIcons = [Stethoscope, HeartPulse, GraduationCap, LibraryBig];

function HomePage() {
  const [search, setSearch] = useState("");
  const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");
  const filteredGroups = useMemo(
    () => CONTENT_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        !normalizedSearch ||
        item.name.toLocaleLowerCase("pt-BR").includes(normalizedSearch) ||
        item.topics.some((topic) => topic.toLocaleLowerCase("pt-BR").includes(normalizedSearch)),
      ),
    })).filter((group) => group.items.length > 0),
    [normalizedSearch],
  );

  return (
    <>
      <Header />
      <main className="overflow-hidden bg-background font-sans">
        <section className="relative isolate bg-surface-soft px-4 pb-16 pt-14 text-surface-soft-foreground sm:pb-24 sm:pt-20">
          <div className="pointer-events-none absolute -right-28 -top-32 -z-10 size-[26rem] rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 -z-10 size-80 rounded-full bg-accent/50 blur-3xl" />
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
            <div className="animate-[rise-in_.7s_ease-out_both]">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/70 px-4 py-2 text-xs font-bold uppercase tracking-[.16em] text-primary shadow-sm">
                <Sparkles className="size-4" /> {BRAND} apresenta
              </div>
              <p className="mt-7 text-sm font-bold uppercase tracking-[.22em] text-primary">ConcursEnf · conhecimento que direciona</p>
              <h1 className="mt-4 max-w-2xl text-4xl font-black leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl">
                Sua próxima conquista começa com um <span className="text-primary">plano de estudos inteligente.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-soft-muted sm:text-lg">
                Prepare-se para concursos de enfermagem com conteúdos organizados, revisão objetiva e uma biblioteca pensada para a rotina de quem cuida.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#biblioteca" className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-primary px-7 py-4 text-sm font-extrabold text-primary-foreground shadow-[0_14px_35px_-16px_var(--primary)] transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                  Explorar conteúdos <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </a>
                <Link to="/concurso" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-primary/40 bg-card/70 px-7 py-4 text-sm font-bold text-primary transition duration-300 hover:-translate-y-1 hover:bg-card">
                  Conhecer o Combo Aprovação <ChevronRight className="size-4" />
                </Link>
              </div>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
                <Link to="/materiais" className="inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:gap-3"><BookOpen className="size-4" /> Central de editais e materiais <ArrowRight className="size-4" /></Link>
                <Link to="/plano-de-estudos" className="inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:gap-3">
                  <CalendarDays className="size-4" /> Monte seu plano semanal <ArrowRight className="size-4" />
                </Link>
                <Link to="/questoes" className="inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:gap-3">
                  <ListChecks className="size-4" /> Treine com questões comentadas <ArrowRight className="size-4" />
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-soft-muted">
                <span className="inline-flex items-center gap-2"><CheckCircle2 className="size-4 text-primary" /> Para técnicos e enfermeiros</span>
                <span className="inline-flex items-center gap-2"><CheckCircle2 className="size-4 text-primary" /> Conteúdo por disciplina</span>
                <span className="inline-flex items-center gap-2"><CheckCircle2 className="size-4 text-primary" /> Estudo no seu ritmo</span>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-xl animate-[rise-in_.9s_.12s_ease-out_both]">
              <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-accent/30 to-transparent blur-2xl" />
              <div className="relative rounded-[2rem] border border-border/70 bg-card/80 p-3 shadow-[0_30px_90px_-35px_rgba(10,50,65,.45)] backdrop-blur">
                <img src={mockup} alt="Prévia dos materiais esquematizados de enfermagem" width={1024} height={1024} className="aspect-[1.12/1] w-full rounded-[1.45rem] object-cover" />
                <div className="absolute -bottom-5 -left-5 hidden max-w-[15rem] rounded-2xl border border-border bg-card p-4 shadow-xl sm:block">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><BookOpenCheck className="size-5" /></span>
                    <div><p className="text-xs font-bold text-foreground">Estudo organizado</p><p className="mt-1 text-[11px] text-muted-foreground">Do conteúdo à revisão</p></div>
                  </div>
                </div>
                <div className="absolute -right-4 top-8 hidden rounded-2xl border border-border bg-card px-4 py-3 shadow-xl sm:block">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground"><Target className="size-4 text-primary" /> Foco na sua prova</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-card px-4 py-7">
          <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-3">
            {["Entenda o conteúdo", "Organize sua preparação", "Revise com estratégia"].map((item, index) => (
              <div key={item} className="flex items-center justify-center gap-3 text-center sm:justify-start">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"><span className="text-sm font-black">0{index + 1}</span></span>
                <span className="text-sm font-bold text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-extrabold uppercase tracking-[.2em] text-primary">Uma preparação possível</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Feita para a realidade de quem vive a enfermagem</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">A preparação precisa caber na rotina, respeitar seu tempo e ajudar você a enxergar o que estudar a seguir.</p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {AUDIENCE.map((item, i) => {
                const Icon = audienceIcons[i] ?? BookOpen;
                return <article key={item.title} className="group rounded-3xl border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl">
                  <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground"><Icon className="size-6" /></span>
                  <h3 className="mt-5 text-lg font-extrabold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.desc}</p>
                </article>;
              })}
            </div>
          </div>
        </section>

        <section className="bg-accent/30 px-4 py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[.2em] text-primary">Seu método de preparação</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Menos dispersão. Mais direção para estudar.</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{TAGLINE}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {BENEFITS.map((benefit, i) => <div key={benefit} className="flex gap-3 rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
                <Check className="mt-0.5 size-5 shrink-0 text-primary" />
                <p className="text-sm font-medium leading-6">{benefit}</p>
              </div>)}
            </div>
          </div>
        </section>

        <section id="trilhas" className="scroll-mt-24 px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div className="max-w-2xl"><p className="text-xs font-extrabold uppercase tracking-[.2em] text-primary">Escolha seu caminho</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Trilhas e materiais para cada objetivo</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">Os pacotes e guias já existentes foram mantidos e agora aparecem em uma estrutura mais clara para facilitar sua escolha.</p></div>
              <Link to="/concurso" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">Ver Combo Aprovação <ArrowRight className="size-4" /></Link>
            </div>
            <div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {PACKS.map((pack, i) => {
                const Icon = pathIcons[i % pathIcons.length];
                return <article key={pack.slug} className="group flex flex-col rounded-3xl border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl">
                  <div className="flex items-start justify-between gap-3"><span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary"><Icon className="size-6" /></span><span className="rounded-full bg-secondary px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-secondary-foreground">{pack.audience}</span></div>
                  <h3 className="mt-5 text-lg font-extrabold leading-snug">{pack.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{pack.summary}</p>
                  <ul className="mt-4 space-y-2">{pack.bullets.map((bullet) => <li key={bullet} className="flex gap-2 text-xs leading-5 text-muted-foreground"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />{bullet}</li>)}</ul>
                  <div className="mt-auto pt-6"><CtaButton className="px-5 py-3 text-xs sm:text-xs">Tenho interesse</CtaButton></div>
                </article>;
              })}
            </div>
          </div>
        </section>

        <section id="biblioteca" className="scroll-mt-24 bg-surface-soft px-4 py-16 text-surface-soft-foreground sm:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="mx-auto max-w-2xl text-center"><p className="text-xs font-extrabold uppercase tracking-[.2em] text-primary">Biblioteca de estudos</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Encontre o assunto que precisa revisar</h2><p className="mt-4 text-sm leading-7 text-soft-muted">Pesquise por disciplina ou tópico. A organização original do conteúdo foi preservada e ganhou uma busca rápida.</p></div>
            <div className="mx-auto mt-8 flex max-w-2xl items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-lg">
              <Search className="size-5 shrink-0 text-primary" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Ex.: cálculo de medicamentos, SUS, anatomia..." aria-label="Pesquisar disciplinas e assuntos" className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
              {search && <button type="button" onClick={() => setSearch("")} aria-label="Limpar pesquisa" className="rounded-full p-1 text-muted-foreground hover:bg-muted"><X className="size-4" /></button>}
            </div>
            <div className="mt-8 space-y-5">
              {filteredGroups.map((group) => <section key={group.title} className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7">
                <h3 className="mb-3 flex items-center gap-3 text-base font-extrabold text-foreground"><span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary"><LibraryBig className="size-5" /></span>{group.title}</h3>
                <Accordion type="multiple">
                  {group.items.map((item) => <AccordionItem key={item.name} value={item.name}>
                    <AccordionTrigger className="text-left text-sm font-bold">{item.name}<span className="ml-2 text-xs font-medium text-muted-foreground">{item.topics.length} tópicos</span></AccordionTrigger>
                    <AccordionContent><ul className="grid gap-2 pl-1 sm:grid-cols-2">{item.topics.map((topic) => <li key={topic} className="flex items-start gap-2 text-sm leading-6 text-muted-foreground"><ChevronRight className="mt-1 size-3.5 shrink-0 text-primary" />{topic}</li>)}</ul></AccordionContent>
                  </AccordionItem>)}
                </Accordion>
              </section>)}
              {filteredGroups.length === 0 && <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center"><Search className="mx-auto size-8 text-muted-foreground" /><p className="mt-3 font-bold text-foreground">Nenhum assunto encontrado</p><p className="mt-1 text-sm text-muted-foreground">Tente outro termo ou limpe a pesquisa.</p><button onClick={() => setSearch("")} className="mt-4 text-sm font-bold text-primary hover:underline">Limpar busca</button></div>}
            </div>
          </div>
        </section>

        <section id="guias" className="scroll-mt-24 px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center"><p className="text-xs font-extrabold uppercase tracking-[.2em] text-primary">Revisão de bolso</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Guias para consultar quando precisar</h2></div>
            <div className="mt-9 grid gap-4 sm:grid-cols-2">
              {GUIDES.map((guide) => <article key={guide.title} className="flex gap-4 rounded-3xl border border-border bg-card p-6 transition hover:border-primary/50 hover:shadow-lg"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary"><FileText className="size-5" /></span><div><h3 className="font-extrabold">{guide.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{guide.desc}</p></div></article>)}
            </div>
          </div>
        </section>

        <section className="bg-accent/30 px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center"><p className="text-xs font-extrabold uppercase tracking-[.2em] text-primary">Materiais complementares</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Recursos que ampliam sua preparação</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">Os bônus cadastrados no projeto continuam aqui, apresentados de forma organizada.</p></div>
            <div className="mt-9 grid gap-4 sm:grid-cols-2">
              {BONUSES.map((bonus) => <article key={bonus.title} className="rounded-3xl border border-border bg-card p-6"><span className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary"><Sparkles className="size-5" /></span><h3 className="mt-4 font-extrabold">{bonus.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{bonus.desc}</p></article>)}
            </div>
          </div>
        </section>

        <section id="acesso-anual" className="bg-surface-soft px-4 py-16 text-surface-soft-foreground sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-extrabold uppercase tracking-[.2em] text-primary">ConcursEnf completo</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Tudo para transformar estudo em aprendizagem de verdade.</h2>
              <p className="mt-4 text-sm leading-7 text-soft-muted sm:text-base">Uma preparação integrada: cada assunto estudado se conecta à prática, à correção, à revisão e ao acompanhamento da sua evolução.</p>
            </div>
            <div className="mt-10 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
              <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm sm:p-8">
                <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary"><BookOpenCheck className="size-5" /></span><div><p className="text-xs font-bold uppercase tracking-wider text-primary">O que está incluído</p><h3 className="text-xl font-black text-foreground">Seis recursos integrados</h3></div></div>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  {PLATFORM_FEATURES.map((feature, index) => <article key={feature.title} className="flex gap-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-black text-primary">{index + 1}</span>
                    <div><h4 className="text-sm font-extrabold text-foreground">{feature.title}</h4><p className="mt-1.5 text-xs leading-6 text-muted-foreground">{feature.desc}</p></div>
                  </article>)}
                </div>
                <div className="mt-7 rounded-2xl bg-accent/40 p-4">
                  <p className="text-sm font-extrabold text-foreground">Um único ciclo de aprendizagem</p>
                  <p className="mt-2 text-xs font-semibold leading-6 text-muted-foreground">Estudar → Praticar → Corrigir → Revisar → Reavaliar → Acompanhar a evolução.</p>
                </div>
              </div>
              <div className="rounded-[2rem] border border-border bg-card p-6 shadow-xl sm:p-8">
                <div className="text-center"><span className="inline-flex rounded-full bg-accent px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-accent-foreground">Acesso anual completo</span><p className="mt-5 text-sm font-semibold text-muted-foreground">Preparação integrada para seu próximo concurso</p><p className="mt-3 text-4xl font-black tracking-tight text-foreground sm:text-5xl">{PLATFORM_OFFER.installments}</p><p className="mt-2 text-sm text-muted-foreground">ou <strong className="text-foreground">{PLATFORM_OFFER.cash}</strong></p></div>
                <div className="my-7 border-t border-border" />
                <div className="flex items-center gap-2"><Sparkles className="size-5 text-primary" /><h3 className="text-lg font-black text-foreground">E você ainda recebe 5 bônus</h3></div>
                <div className="mt-5 space-y-4">
                  {PLATFORM_BONUSES.map((bonus) => <div key={bonus.title} className="flex gap-3"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" /><div><h4 className="text-sm font-extrabold text-foreground">{bonus.title}</h4><p className="mt-1 text-xs leading-5 text-muted-foreground">{bonus.desc}</p></div></div>)}
                </div>
                <button type="button" disabled className="mt-7 inline-flex min-h-14 w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-highlight px-5 py-4 text-sm font-extrabold text-primary-foreground opacity-80">Quero meu acesso anual <ArrowRight className="size-4" /></button>
                <p className="mt-3 text-center text-[11px] leading-5 text-muted-foreground">Condições e acesso à compra serão liberados após a conclusão e validação de todas as funcionalidades da plataforma.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:py-20">
          <div className="mx-auto grid max-w-5xl items-center gap-9 md:grid-cols-[.8fr_1.2fr]">
            <div className="relative mx-auto w-full max-w-sm"><div className="absolute -inset-3 rounded-[2rem] bg-primary/10 blur-xl" /><img src={autoraFoto.url} alt={AUTHOR.name} loading="lazy" width={1024} height={1024} className="relative aspect-[4/5] w-full rounded-[2rem] object-cover shadow-xl" /></div>
            <div><p className="text-xs font-extrabold uppercase tracking-[.2em] text-primary">Nossa idealizadora</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Conhecimento construído com experiência na enfermagem</h2><h3 className="mt-4 text-lg font-extrabold text-primary">{AUTHOR.name} — {AUTHOR.role}</h3><div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">{AUTHOR.bio.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><p className="mt-5 text-sm font-semibold text-foreground">{AUTHOR.contactEmail}</p></div>
          </div>
        </section>

        <section className="bg-surface-soft px-4 py-16 text-surface-soft-foreground sm:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="mx-auto max-w-2xl text-center"><p className="text-xs font-extrabold uppercase tracking-[.2em] text-primary">Dúvidas frequentes</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Antes de começar, veja as respostas</h2></div>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {[{ title: "Sobre os materiais", items: SITE_FAQ }, { title: "Sobre o Combo Aprovação", items: FAQ }].map((group) => <div key={group.title} className="rounded-3xl border border-border bg-card p-5 sm:p-6"><h3 className="mb-3 font-extrabold text-foreground">{group.title}</h3><Accordion type="single" collapsible>{group.items.map((item) => <AccordionItem key={item.q} value={item.q}><AccordionTrigger className="text-left text-sm font-semibold">{item.q}</AccordionTrigger><AccordionContent className="text-sm leading-6 text-muted-foreground">{item.a}</AccordionContent></AccordionItem>)}</Accordion></div>)}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-highlight p-8 text-primary-foreground shadow-2xl sm:p-12">
            <div className="grid gap-7 md:grid-cols-[1fr_auto] md:items-center"><div><p className="text-xs font-extrabold uppercase tracking-[.2em] opacity-80">Seu próximo passo</p><h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">Comece organizando seus estudos hoje.</h2><p className="mt-3 max-w-xl text-sm leading-7 opacity-90">Explore as disciplinas, conheça os materiais e escolha o caminho que faz sentido para sua preparação.</p></div><a href="#biblioteca" className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-card px-7 py-4 text-sm font-extrabold text-primary transition hover:-translate-y-1 hover:shadow-xl">Acessar biblioteca <ArrowRight className="size-4" /></a></div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
