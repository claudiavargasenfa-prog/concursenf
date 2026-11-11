import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft, ArrowRight, Search, Stethoscope, GraduationCap, Scale, BriefcaseBusiness,
  Monitor, Shield, Activity, Pill, Smile, Accessibility, Brain, Users, DraftingCompass,
  Calculator, Apple, Microscope, BookOpen, MapPin, Building2, FileText, Filter, ChevronRight,
  Download, ExternalLink, LoaderCircle, RefreshCw,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CmsSections } from "@/components/site/CmsSections";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

type Area = { id: string; name: string; slug: string; description: string | null; icon: string; categories: Category[] };
type Category = { id: string; area_id: string; name: string; slug: string };
type Board = { id: string; name: string; acronym: string | null; scope: string };
type Contest = {
  id: string; title: string; year: number | null; area_id: string; category_id: string | null;
  board_id: string | null; organization_id: string | null; state: string | null;
  municipality: string | null; official_url: string | null; description: string | null;
};
type Organization = { id: string; name: string; acronym: string | null; state: string | null; municipality: string | null };
type MaterialDocument = {
  id: string; contest_id: string; title: string; description: string | null; document_type: string;
  storage_path: string | null; source_url: string | null; file_name: string | null;
  rights_status: string; published: boolean;
};
type LoadState = "loading" | "ready" | "error";

const AREA_ICONS: Record<string, typeof Stethoscope> = {
  enfermagem: Stethoscope, medicina: Activity, odontologia: Smile, farmacia: Pill,
  fisioterapia: Accessibility, psicologia: Brain, "servico-social": Users, educacao: GraduationCap,
  "direito-juridica": Scale, administracao: BriefcaseBusiness, "tecnologia-informacao": Monitor,
  "engenharia-arquitetura": DraftingCompass, "seguranca-publica": Shield,
  "fiscal-controle": Calculator, nutricao: Apple, biomedicina: Microscope,
};
const DOCUMENT_LABELS: Record<string, string> = {
  edital: "Edital", retificacao: "Retificação", apostila: "Apostila autorizada",
  prova: "Prova anterior", gabarito: "Gabarito", legislacao: "Legislação",
  comunicado: "Comunicado", outro: "Outro documento",
};

export const Route = createFileRoute("/materiais")({
  head: () => ({
    meta: [
      { title: "Central de Editais e Materiais | ConcursEnf" },
      { name: "description", content: "Encontre concursos, editais, provas e materiais por área profissional, cargo e banca organizadora." },
    ],
  }),
  component: MaterialsPage,
});

function MaterialsPage() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [documents, setDocuments] = useState<MaterialDocument[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [areaSlug, setAreaSlug] = useState("enfermagem");
  const [categoryId, setCategoryId] = useState("all");
  const [boardId, setBoardId] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [boardSearch, setBoardSearch] = useState("");
  const [areaSearch, setAreaSearch] = useState("");
  const [documentBusy, setDocumentBusy] = useState<string | null>(null);

  async function loadCatalog() {
    setLoadState("loading");
    try {
      const db = supabase as any;
      const [areaResult, categoryResult, boardResult, contestResult, orgResult, documentResult] = await Promise.all([
        db.from("material_areas").select("id,name,slug,description,icon").eq("active", true).order("sort_order"),
        db.from("material_categories").select("id,area_id,name,slug").eq("active", true).order("sort_order"),
        db.from("organizing_boards").select("id,name,acronym,scope").eq("active", true).order("name"),
        db.from("material_contests").select("id,title,year,area_id,category_id,board_id,organization_id,state,municipality,official_url,description").eq("published", true).order("year", { ascending: false }),
        db.from("material_organizations").select("id,name,acronym,state,municipality").order("name"),
        db.from("material_documents").select("id,contest_id,title,description,document_type,storage_path,source_url,file_name,rights_status,published").eq("published", true).order("created_at", { ascending: false }),
      ]);
      const error = areaResult.error || categoryResult.error || boardResult.error || contestResult.error || orgResult.error || documentResult.error;
      if (error) throw error;
      const categories = (categoryResult.data ?? []) as Category[];
      setAreas(((areaResult.data ?? []) as Omit<Area, "categories">[]).map((area) => ({
        ...area, categories: categories.filter((category) => category.area_id === area.id),
      })));
      setBoards((boardResult.data ?? []) as Board[]);
      setContests((contestResult.data ?? []) as Contest[]);
      setOrganizations((orgResult.data ?? []) as Organization[]);
      setDocuments((documentResult.data ?? []) as MaterialDocument[]);
      setLoadState("ready");
    } catch (error) {
      console.error("[Central de Materiais] Falha ao carregar catálogo:", error);
      setLoadState("error");
    }
  }

  useEffect(() => { void loadCatalog(); }, []);

  const selectedArea = areas.find((area) => area.slug === areaSlug) ?? areas[0];
  const visibleAreas = useMemo(() => areas.filter((area) =>
    !areaSearch || area.name.toLocaleLowerCase("pt-BR").includes(areaSearch.toLocaleLowerCase("pt-BR")),
  ), [areas, areaSearch]);
  const visibleBoards = useMemo(() => boards.filter((board) =>
    !boardSearch || board.name.toLocaleLowerCase("pt-BR").includes(boardSearch.toLocaleLowerCase("pt-BR")),
  ), [boards, boardSearch]);
  const years = [...new Set(contests.map((contest) => contest.year).filter((year): year is number => year !== null))].sort((a, b) => b - a);
  const states = [...new Set(contests.map((contest) => contest.state).filter((state): state is string => Boolean(state)))].sort();
  const filteredContests = contests.filter((contest) =>
    contest.area_id === selectedArea?.id &&
    (categoryId === "all" || contest.category_id === categoryId) &&
    (boardId === "all" || contest.board_id === boardId) &&
    (stateFilter === "all" || contest.state === stateFilter) &&
    (yearFilter === "all" || String(contest.year) === yearFilter),
  );

  function chooseArea(slug: string) {
    setAreaSlug(slug);
    setCategoryId("all");
  }

  async function openDocument(document: MaterialDocument) {
    if (document.source_url && !document.storage_path) {
      window.open(document.source_url, "_blank", "noopener,noreferrer");
      return;
    }
    if (!document.storage_path) return;
    setDocumentBusy(document.id);
    try {
      const db = supabase as any;
      const { data, error } = await db.storage.from("concursenf-materiais").createSignedUrl(document.storage_path, 120);
      if (error) throw error;
      if (data?.signedUrl) window.open(data.signedUrl, "_blank", "noopener,noreferrer");
      else throw new Error("Não foi possível gerar o acesso temporário ao documento.");
    } catch (error) {
      console.error("[Central de Materiais] Falha ao abrir documento:", error);
      window.alert("Não foi possível abrir este documento. Tente novamente em instantes.");
    } finally {
      setDocumentBusy(null);
    }
  }

  const Icon = selectedArea ? (AREA_ICONS[selectedArea.slug] ?? BookOpen) : BookOpen;

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
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">Uma biblioteca organizada por área profissional, cargo, banca examinadora e concurso. Encontre documentos publicados para sua preparação.</p>
              <div className="mt-7 flex flex-wrap gap-3 text-xs font-semibold text-white/75">
                <span className="rounded-full border border-white/20 px-3 py-2">16 áreas profissionais</span>
                <span className="rounded-full border border-white/20 px-3 py-2">Bancas organizadoras</span>
                <span className="rounded-full border border-white/20 px-3 py-2">Editais, provas e gabaritos</span>
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
                  const AreaIcon = AREA_ICONS[area.slug] ?? BookOpen;
                  const active = area.slug === selectedArea?.slug;
                  return <button key={area.id} type="button" onClick={() => chooseArea(area.slug)} className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${active ? "border-[#174D3B] bg-[#EAF2EC] text-[#174D3B]" : "border-transparent bg-muted/50 text-foreground hover:border-border hover:bg-muted"}`}>
                    <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${active ? "bg-[#174D3B] text-white" : "bg-card text-primary"}`}><AreaIcon className="size-5" /></span>
                    <span className="min-w-0 flex-1"><span className="block text-sm font-bold">{area.name}</span><span className="mt-0.5 block text-xs opacity-70">{area.categories.length} cargos cadastrados</span></span>
                    <ChevronRight className="size-4 shrink-0" />
                  </button>;
                })}
                {loadState === "ready" && visibleAreas.length === 0 && <p className="py-3 text-sm text-muted-foreground">Nenhuma área encontrada.</p>}
              </div>
            </div>
            <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-lg font-extrabold text-foreground">Bancas organizadoras</h2>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">Bancas cadastradas na biblioteca e disponíveis para associação a concursos.</p>
              <div className="relative mt-4">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={boardSearch} onChange={(event) => setBoardSearch(event.target.value)} placeholder="Buscar banca..." className="pl-9" />
              </div>
              <div className="mt-4 max-h-80 space-y-2 overflow-y-auto">
                {visibleBoards.map((board) => <div key={board.id} className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2.5"><span className="text-sm font-semibold text-foreground">{board.name}</span><span className="shrink-0 rounded-full bg-[#EAF2EC] px-2.5 py-1 text-[10px] font-bold text-[#174D3B]">{board.scope === "national" ? "Nacional" : board.scope === "institutional" ? "Institucional" : "Regional"}</span></div>)}
                {loadState === "ready" && visibleBoards.length === 0 && <p className="py-3 text-sm text-muted-foreground">Nenhuma banca encontrada.</p>}
              </div>
            </div>
          </aside>

          <section className="space-y-6">
            <div className="rounded-3xl border border-[#174D3B]/15 bg-gradient-to-br from-[#EAF2EC] via-white to-[#F7F3E8] p-6 shadow-sm sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-14 place-items-center rounded-2xl bg-[#174D3B] text-white shadow-lg"><Icon className="size-7" /></span>
                  <div><p className="text-xs font-bold uppercase tracking-[.15em] text-[#547461]">Área selecionada</p><h2 className="mt-1 text-2xl font-black text-[#174D3B]">{selectedArea?.name ?? "Carregando áreas"}</h2></div>
                </div>
                {selectedArea && <span className="rounded-full bg-white/80 px-3 py-1.5 text-xs font-bold text-[#547461]">{selectedArea.categories.length} cargos</span>}
              </div>
              <p className="mt-4 text-sm leading-6 text-[#486451]">{selectedArea?.description ?? "As áreas profissionais serão carregadas da biblioteca."}</p>
              <div className="mt-6">
                <label htmlFor="cargo" className="text-xs font-bold uppercase tracking-wider text-[#547461]">2. Escolha o cargo ou categoria</label>
                <select id="cargo" value={categoryId} onChange={(event) => setCategoryId(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-[#174D3B]/20 bg-white px-4 text-sm font-semibold text-[#174D3B] outline-none focus:ring-2 focus:ring-[#174D3B]/30">
                  <option value="all">Todos os cargos</option>
                  {selectedArea?.categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </div>
              <div className="mt-6 rounded-2xl border border-[#174D3B]/10 bg-white/80 p-4">
                <div className="flex items-center gap-2 text-sm font-extrabold text-[#174D3B]"><Filter className="size-4" /> Filtros de pesquisa</div>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <label className="text-xs font-semibold text-[#547461]">Banca<select value={boardId} onChange={(event) => setBoardId(event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-[#174D3B]/15 bg-white px-3 text-sm text-foreground"><option value="all">Todas</option>{boards.map((board) => <option key={board.id} value={board.id}>{board.name}</option>)}</select></label>
                  <label className="text-xs font-semibold text-[#547461]">Estado<select value={stateFilter} onChange={(event) => setStateFilter(event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-[#174D3B]/15 bg-white px-3 text-sm text-foreground"><option value="all">Todos</option>{states.map((state) => <option key={state}>{state}</option>)}</select></label>
                  <label className="text-xs font-semibold text-[#547461]">Ano<select value={yearFilter} onChange={(event) => setYearFilter(event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-[#174D3B]/15 bg-white px-3 text-sm text-foreground"><option value="all">Todos</option>{years.map((year) => <option key={year}>{year}</option>)}</select></label>
                </div>
              </div>
            </div>

            {loadState === "loading" && <div className="flex items-center justify-center gap-3 rounded-3xl border border-border bg-card p-10 text-sm text-muted-foreground"><LoaderCircle className="size-5 animate-spin" /> Carregando concursos e documentos...</div>}
            {loadState === "error" && <div className="rounded-3xl border border-dashed border-amber-500/40 bg-card p-8 text-center"><FileText className="mx-auto size-8 text-amber-600" /><h3 className="mt-4 text-lg font-extrabold text-foreground">Não foi possível carregar a biblioteca</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Verifique sua conexão e tente novamente. Nenhum documento foi removido.</p><button type="button" onClick={() => void loadCatalog()} className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#174D3B] px-5 py-3 text-sm font-bold text-white"><RefreshCw className="size-4" /> Tentar novamente</button></div>}
            {loadState === "ready" && filteredContests.length === 0 && <div className="rounded-3xl border border-dashed border-[#174D3B]/30 bg-card p-8 text-center sm:p-12">
              <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#EAF2EC] text-[#174D3B]"><FileText className="size-8" /></span>
              <h3 className="mt-5 text-xl font-extrabold text-foreground">{contests.length === 0 ? "Biblioteca pronta para receber concursos" : "Nenhum concurso corresponde aos filtros"}</h3>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">{contests.length === 0 ? "As áreas, cargos e bancas já estão cadastrados. Os concursos e documentos aparecerão aqui assim que forem inseridos e publicados no painel administrativo." : "Altere a área, o cargo, a banca, o estado ou o ano para ampliar sua pesquisa."}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs font-semibold text-[#174D3B]">{["Editais", "Retificações", "Apostilas autorizadas", "Provas anteriores", "Gabaritos", "Legislação"].map((label) => <span key={label} className="rounded-full bg-[#EAF2EC] px-3 py-2">{label}</span>)}</div>
            </div>}
            {loadState === "ready" && filteredContests.map((contest) => {
              const board = boards.find((item) => item.id === contest.board_id);
              const organization = organizations.find((item) => item.id === contest.organization_id);
              const categoryName = selectedArea?.categories.find((item) => item.id === contest.category_id)?.name;
              const contestDocuments = documents.filter((document) => document.contest_id === contest.id);
              return <article key={contest.id} className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-3"><div><span className="text-xs font-bold uppercase tracking-wider text-[#547461]">{contest.year ?? "Ano não informado"}{contest.state ? ` · ${contest.state}` : ""}</span><h3 className="mt-2 text-xl font-extrabold text-foreground">{contest.title}</h3></div><span className="rounded-full bg-[#EAF2EC] px-3 py-1.5 text-xs font-bold text-[#174D3B]">{categoryName ?? selectedArea?.name}</span></div>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1"><Building2 className="size-3.5" />{organization?.name ?? "Órgão não informado"}</span>{board && <span className="inline-flex items-center gap-1"><BookOpen className="size-3.5" />{board.name}</span>}{contest.municipality && <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" />{contest.municipality}</span>}</div>
                {contest.description && <p className="mt-4 text-sm leading-6 text-muted-foreground">{contest.description}</p>}
                <div className="mt-5 space-y-2">{contestDocuments.map((document) => <div key={document.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/30 px-3 py-3"><div className="flex min-w-0 items-center gap-3"><FileText className="size-5 shrink-0 text-[#174D3B]" /><div className="min-w-0"><p className="truncate text-sm font-bold text-foreground">{document.title}</p><p className="text-xs text-muted-foreground">{DOCUMENT_LABELS[document.document_type] ?? "Documento"} · {document.rights_status === "official_public" ? "Documento oficial público" : document.rights_status === "public_domain" ? "Domínio público" : "Uso autorizado/licenciado"}</p></div></div><button type="button" disabled={documentBusy === document.id} onClick={() => void openDocument(document)} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#174D3B] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#103c2d] disabled:opacity-60">{documentBusy === document.id ? <LoaderCircle className="size-4 animate-spin" /> : document.storage_path ? <Download className="size-4" /> : <ExternalLink className="size-4" />}{documentBusy === document.id ? "Abrindo..." : document.storage_path ? "Abrir PDF" : "Acessar fonte"}</button></div>)}</div>
                {contestDocuments.length === 0 && <p className="mt-4 text-xs text-muted-foreground">Nenhum documento publicado para este concurso.</p>}
                {contest.official_url && <a href={contest.official_url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#174D3B] hover:underline">Página oficial do concurso <ExternalLink className="size-3.5" /></a>}
              </article>;
            })}
            <div className="grid gap-3 sm:grid-cols-3">
              {[{ icon: Building2, title: "Órgão", text: "Federal, estadual ou municipal" }, { icon: MapPin, title: "Localidade", text: "Estado e município" }, { icon: ArrowRight, title: "Concurso", text: "Cargo, ano e banca" }].map((item) => <div key={item.title} className="rounded-2xl border border-border bg-card p-4"><item.icon className="size-5 text-[#174D3B]" /><p className="mt-3 text-sm font-bold text-foreground">{item.title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{item.text}</p></div>)}
            </div>
          </section>
        </section>
      </main>
      <CmsSections page="academicos" />
      <Footer />
    </>
  );
}
