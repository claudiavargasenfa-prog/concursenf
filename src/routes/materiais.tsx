import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft, ArrowRight, Search, Stethoscope, GraduationCap, Scale, BriefcaseBusiness,
  Monitor, Shield, Activity, Pill, Smile, Accessibility, Brain, Users, DraftingCompass,
  Calculator, Apple, Microscope, BookOpen, MapPin, Building2, FileText, Filter, ChevronRight,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Input } from "@/components/ui/input";

type Area = { name: string; slug: string; description: string; icon: typeof Stethoscope; categories: string[] };
type Board = { name: string; acronym: string; scope: "Nacional" | "Regional/Estadual" | "Universitária/Institucional" };

const AREAS: Area[] = [
  { name: "Enfermagem", slug: "enfermagem", description: "Enfermeiro, técnico e auxiliar de enfermagem.", icon: Stethoscope, categories: ["Enfermeiro", "Técnico de Enfermagem", "Auxiliar de Enfermagem"] },
  { name: "Medicina", slug: "medicina", description: "Médico e áreas de especialização.", icon: Activity, categories: ["Médico", "Médico especialista", "Médico da família"] },
  { name: "Odontologia", slug: "odontologia", description: "Cirurgião-dentista e especialidades.", icon: Smile, categories: ["Cirurgião-dentista", "Especialista"] },
  { name: "Farmácia", slug: "farmacia", description: "Farmacêutico e técnico em farmácia.", icon: Pill, categories: ["Farmacêutico", "Técnico em Farmácia"] },
  { name: "Fisioterapia", slug: "fisioterapia", description: "Fisioterapeuta e áreas de atuação.", icon: Accessibility, categories: ["Fisioterapeuta"] },
  { name: "Psicologia", slug: "psicologia", description: "Psicólogo e áreas de atuação.", icon: Brain, categories: ["Psicólogo"] },
  { name: "Serviço Social", slug: "servico-social", description: "Assistente social.", icon: Users, categories: ["Assistente Social"] },
  { name: "Educação", slug: "educacao", description: "Professores e profissionais da educação.", icon: GraduationCap, categories: ["Professor", "Pedagogo", "Orientador Educacional", "Supervisor Escolar"] },
  { name: "Direito e Jurídica", slug: "direito-juridica", description: "Carreiras jurídicas e apoio judiciário.", icon: Scale, categories: ["Analista Judiciário", "Técnico Judiciário", "Procurador", "Defensor"] },
  { name: "Administração", slug: "administracao", description: "Gestão e apoio administrativo.", icon: BriefcaseBusiness, categories: ["Administrador", "Assistente Administrativo", "Agente Administrativo"] },
  { name: "Tecnologia da Informação", slug: "tecnologia-informacao", description: "Tecnologia, sistemas e suporte.", icon: Monitor, categories: ["Analista de TI", "Desenvolvedor", "Técnico de Informática"] },
  { name: "Engenharia e Arquitetura", slug: "engenharia-arquitetura", description: "Engenharias e arquitetura.", icon: DraftingCompass, categories: ["Engenheiro", "Arquiteto", "Técnico"] },
  { name: "Segurança Pública", slug: "seguranca-publica", description: "Polícias, bombeiros e guardas municipais.", icon: Shield, categories: ["Policial", "Bombeiro", "Guarda Municipal"] },
  { name: "Área Fiscal e Controle", slug: "fiscal-controle", description: "Auditoria, fiscalização e controle.", icon: Calculator, categories: ["Auditor", "Fiscal", "Controlador"] },
  { name: "Nutrição", slug: "nutricao", description: "Nutricionista.", icon: Apple, categories: ["Nutricionista"] },
  { name: "Biomedicina", slug: "biomedicina", description: "Biomédico.", icon: Microscope, categories: ["Biomédico"] },
];

const BOARDS: Board[] = [
  ...["FGV", "Cebraspe", "Instituto AOCP", "IBFC", "Quadrix", "Vunesp", "IDECAN", "Cesgranrio", "FCC", "IBAM", "Consulplan", "Consulpam", "IBGP", "IBDO", "IDIB", "Instituto Avalia"].map((name) => ({ name, acronym: name, scope: "Nacional" as const })),
  ...["Fundep", "Fundatec", "Fundação La Salle", "Faurgs", "UniFil", "Fadesp", "Avança SP", "Selecon", "Legalle", "Objetiva", "Consesp", "Instituto Mais", "Nosso Rumo"].map((name) => ({ name, acronym: name, scope: "Regional/Estadual" as const })),
  ...["Copese/UFPI", "Comperve/UFRN", "Instituto Verbena/UFG"].map((name) => ({ name, acronym: name, scope: "Universitária/Institucional" as const })),
];

export const Route = createFileRoute("/materiais")({
  head: () => ({
    meta: [
      { title: "Central de Editais e Materiais | ConcursEnf" },
      { name: "description", content: "Encontre áreas profissionais, cargos, bancas organizadoras e materiais para concursos públicos." },
    ],
  }),
  component: MaterialsPage,
});

function MaterialsPage() {
  const [areaSlug, setAreaSlug] = useState("enfermagem");
  const [category, setCategory] = useState("Todos os cargos");
  const [boardSearch, setBoardSearch] = useState("");
  const [areaSearch, setAreaSearch] = useState("");
  const selectedArea = AREAS.find((area) => area.slug === areaSlug) ?? AREAS[0];
  const visibleAreas = useMemo(() => AREAS.filter((area) =>
    !areaSearch || area.name.toLocaleLowerCase("pt-BR").includes(areaSearch.toLocaleLowerCase("pt-BR")),
  ), [areaSearch]);
  const visibleBoards = useMemo(() => BOARDS.filter((board) =>
    !boardSearch || board.name.toLocaleLowerCase("pt-BR").includes(boardSearch.toLocaleLowerCase("pt-BR")),
  ), [boardSearch]);
  const Icon = selectedArea.icon;

  function chooseArea(slug: string) {
    setAreaSlug(slug);
    setCategory("Todos os cargos");
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pb-16">
        <section className="relative overflow-hidden bg-[#174D3B] px-4 py-14 text-white sm:py-20">
          <div className="pointer-events-none absolute -right-20 -top-24 size-80 rounded-full bg-[#B5D5C1]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-20 size-80 rounded-full bg-[#D7B56D]/15 blur-3xl" />
          <div className="relative mx-auto max-w-6xl">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-white/75 transition hover:text-white"><ArrowLeft className="size-4" /> Voltar ao início</Link>
            <div className="mt-8 max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[.18em] text-[#E4D3A7]"><BookOpen className="size-4" /> Biblioteca de concursos</span>
              <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-6xl">Central de <span className="text-[#D9C18B]">Editais e Materiais</span></h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">Uma biblioteca organizada por área profissional, cargo, banca examinadora e concurso. Encontre os documentos certos para sua preparação.</p>
              <div className="mt-7 flex flex-wrap gap-3 text-xs font-semibold text-white/75">
                <span className="rounded-full border border-white/20 px-3 py-2">Áreas profissionais</span>
                <span className="rounded-full border border-white/20 px-3 py-2">Bancas nacionais e regionais</span>
                <span className="rounded-full border border-white/20 px-3 py-2">Editais e provas</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[.85fr_1.15fr]">
          <aside className="space-y-5">
            <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-lg font-extrabold text-foreground">1. Escolha sua área</h2>
              <div className="relative mt-4">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={areaSearch} onChange={(event) => setAreaSearch(event.target.value)} placeholder="Buscar área profissional..." className="pl-9" />
              </div>
              <div className="mt-4 max-h-[27rem] space-y-2 overflow-y-auto pr-1">
                {visibleAreas.map((area) => {
                  const AreaIcon = area.icon;
                  const active = area.slug === areaSlug;
                  return <button key={area.slug} type="button" onClick={() => chooseArea(area.slug)} className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${active ? "border-[#174D3B] bg-[#EAF2EC] text-[#174D3B]" : "border-transparent bg-muted/50 text-foreground hover:border-border hover:bg-muted"}`}>
                    <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${active ? "bg-[#174D3B] text-white" : "bg-card text-primary"}`}><AreaIcon className="size-5" /></span>
                    <span className="min-w-0 flex-1"><span className="block text-sm font-bold">{area.name}</span><span className="mt-0.5 block text-xs opacity-70">{area.categories.length} categorias cadastradas</span></span>
                    <ChevronRight className="size-4 shrink-0" />
                  </button>;
                })}
              </div>
            </div>
            <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-lg font-extrabold text-foreground">Bancas organizadoras</h2>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">Catálogo inicial de organizadoras para consulta e associação a concursos.</p>
              <div className="relative mt-4">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={boardSearch} onChange={(event) => setBoardSearch(event.target.value)} placeholder="Buscar banca..." className="pl-9" />
              </div>
              <div className="mt-4 space-y-2">
                {visibleBoards.map((board) => <div key={board.name} className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2.5"><span className="text-sm font-semibold text-foreground">{board.name}</span><span className="shrink-0 rounded-full bg-[#EAF2EC] px-2.5 py-1 text-[10px] font-bold text-[#174D3B]">{board.scope === "Nacional" ? "Nacional" : board.scope === "Regional/Estadual" ? "Regional" : "Institucional"}</span></div>)}
                {!visibleBoards.length && <p className="py-3 text-sm text-muted-foreground">Nenhuma banca encontrada.</p>}
              </div>
            </div>
          </aside>

          <section className="space-y-6">
            <div className="rounded-3xl border border-[#174D3B]/15 bg-gradient-to-br from-[#EAF2EC] via-white to-[#F7F3E8] p-6 shadow-sm sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-14 place-items-center rounded-2xl bg-[#174D3B] text-white shadow-lg"><Icon className="size-7" /></span>
                  <div><p className="text-xs font-bold uppercase tracking-[.15em] text-[#547461]">Área selecionada</p><h2 className="mt-1 text-2xl font-black text-[#174D3B]">{selectedArea.name}</h2></div>
                </div>
                <span className="rounded-full bg-white/80 px-3 py-1.5 text-xs font-bold text-[#547461]">{selectedArea.categories.length} categorias</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-[#486451]">{selectedArea.description}</p>
              <div className="mt-6">
                <label htmlFor="cargo" className="text-xs font-bold uppercase tracking-wider text-[#547461]">2. Escolha o cargo ou categoria</label>
                <select id="cargo" value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-[#174D3B]/20 bg-white px-4 text-sm font-semibold text-[#174D3B] outline-none focus:ring-2 focus:ring-[#174D3B]/30">
                  <option>Todos os cargos</option>
                  {selectedArea.categories.map((item) => <option key={item}>{item}</option>)}
                </select>
              </div>
              <div className="mt-6 rounded-2xl border border-[#174D3B]/10 bg-white/80 p-4">
                <div className="flex items-center gap-2 text-sm font-extrabold text-[#174D3B]"><Filter className="size-4" /> Filtros de pesquisa</div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="text-xs font-semibold text-[#547461]">Estado<select className="mt-1.5 h-10 w-full rounded-lg border border-[#174D3B]/15 bg-white px-3 text-sm text-foreground"><option>Todos os estados</option>{["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map((state) => <option key={state}>{state}</option>)}</select></label>
                  <label className="text-xs font-semibold text-[#547461]">Ano<select className="mt-1.5 h-10 w-full rounded-lg border border-[#174D3B]/15 bg-white px-3 text-sm text-foreground"><option>Todos os anos</option>{[2026,2025,2024,2023,2022].map((year) => <option key={year}>{year}</option>)}</select></label>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-dashed border-[#174D3B]/30 bg-card p-8 text-center sm:p-12">
              <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#EAF2EC] text-[#174D3B]"><FileText className="size-8" /></span>
              <h3 className="mt-5 text-xl font-extrabold text-foreground">Sua biblioteca de concursos começa aqui</h3>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">A estrutura de áreas, cargos e bancas já está organizada. Os concursos e PDFs serão exibidos aqui à medida que forem cadastrados no painel administrativo.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs font-semibold text-[#174D3B]">
                {["Editais", "Retificações", "Apostilas autorizadas", "Provas anteriores", "Gabaritos", "Legislação"].map((label) => <span key={label} className="rounded-full bg-[#EAF2EC] px-3 py-2">{label}</span>)}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[{ icon: Building2, title: "Órgão", text: "Federal, estadual ou municipal" }, { icon: MapPin, title: "Localidade", text: "Estado e município" }, { icon: ArrowRight, title: "Concurso", text: "Cargo, ano e banca" }].map((item) => <div key={item.title} className="rounded-2xl border border-border bg-card p-4"><item.icon className="size-5 text-[#174D3B]" /><p className="mt-3 text-sm font-bold text-foreground">{item.title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{item.text}</p></div>)}
            </div>
          </section>
        </section>
      </main>
      <Footer />
    </>
  );
}
