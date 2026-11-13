import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Search, ExternalLink, ChevronDown, ChevronUp, LoaderCircle } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CmsSections } from "@/components/site/CmsSections";
import { supabase } from "@/integrations/supabase/client";
import { getMaterialFileUrl } from "@/lib/materials.functions";

type ContentItem = { id: string; audience: string; subject: string; topic: string; content_type: string; title: string; summary: string | null; body: string | null; resource_url: string | null; storage_path: string | null; source_reference: string | null };
type Flashcard = { id: string; audience: string; subject: string; topic: string; front: string; back: string; source_reference: string | null };

export const Route = createFileRoute("/biblioteca-concursos")({
  head: () => ({ meta: [{ title: "Biblioteca EBSERH e HU Brasil | ConcursEnf" }, { name: "description", content: "Aulas, mapas mentais, materiais e flashcards para concursos de enfermagem da EBSERH e HU Brasil." }] }),
  component: ExamLibraryPage,
});

const audienceNames: Record<string, string> = { todos: "Todos os cargos", enfermeiro: "Enfermeiro", tecnico: "Técnico de Enfermagem", auxiliar: "Auxiliar de Enfermagem" };
const typeNames: Record<string, string> = { texto: "Aula", mapa_mental: "Mapa mental", pdf: "PDF", audio: "Áudio", video: "Vídeo", link: "Material externo" };

function ExamLibraryPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [subject, setSubject] = useState("Todas as disciplinas");
  const [audience, setAudience] = useState("todos");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openCard, setOpenCard] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const db = supabase as any;
        const [contentResult, cardResult] = await Promise.all([
          db.from("exam_content_items").select("id,audience,subject,topic,content_type,title,summary,body,resource_url,storage_path,source_reference").eq("exam_slug", "ebserh-hubrasil").eq("published", true).order("subject").order("sort_order"),
          db.from("exam_flashcards").select("id,audience,subject,topic,front,back,source_reference").eq("exam_slug", "ebserh-hubrasil").eq("published", true).order("subject"),
        ]);
        if (contentResult.error || cardResult.error) throw contentResult.error || cardResult.error;
        const rawItems = (contentResult.data ?? []) as ContentItem[];
        const signedItems = await Promise.all(rawItems.map(async (item) => {
          if (!item.storage_path) return item;
          try {
            const { url } = await getMaterialFileUrl({ data: { kind: "content", id: item.id } });
            return { ...item, resource_url: url };
          } catch { return item; }
        }));
        setItems(signedItems);
        setCards((cardResult.data ?? []) as Flashcard[]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Não foi possível carregar os conteúdos.");
      } finally { setLoading(false); }
    }
    void load();
  }, []);

  const subjects = useMemo(() => ["Todas as disciplinas", ...new Set([...items.map((i) => i.subject), ...cards.map((c) => c.subject)])].sort((a,b) => a === "Todas as disciplinas" ? -1 : a.localeCompare(b, "pt-BR")), [items, cards]);
  const matches = (item: { subject: string; topic: string; audience: string; title?: string; summary?: string | null }) =>
    (subject === "Todas as disciplinas" || item.subject === subject) &&
    (audience === "todos" || item.audience === "todos" || item.audience === audience) &&
    (!search || [item.subject, item.topic, item.title ?? "", item.summary ?? ""].some((v) => v.toLocaleLowerCase("pt-BR").includes(search.toLocaleLowerCase("pt-BR"))));
  const visibleItems = items.filter(matches);
  const visibleCards = cards.filter(matches);

  return <>
    <Header />
    <main className="min-h-screen bg-background px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"><ArrowLeft className="size-4" /> Voltar ao início</Link>
        <div className="mt-7 rounded-3xl bg-[#174D3B] p-7 text-white sm:p-10">
          <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#E5D3A4]">Trilha de preparação</p>
          <h1 className="mt-3 text-3xl font-black sm:text-5xl">Biblioteca EBSERH | HU Brasil</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75">Acesse conteúdos organizados por disciplina, assunto e cargo. Novas aulas, mapas mentais, arquivos e revisões serão disponibilizados nesta área.</p>
          <div className="mt-5 flex flex-wrap gap-2"><span className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-bold">Enfermeiro</span><span className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-bold">Técnico</span><span className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-bold">Auxiliar</span></div>
        </div>

        <div className="mt-7 grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[1fr_1fr_1.5fr]">
          <label className="text-xs font-bold text-muted-foreground">Cargo<select className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground" value={audience} onChange={(e) => setAudience(e.target.value)}>{Object.entries(audienceNames).map(([v,n]) => <option key={v} value={v}>{n}</option>)}</select></label>
          <label className="text-xs font-bold text-muted-foreground">Disciplina<select className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground" value={subject} onChange={(e) => setSubject(e.target.value)}>{subjects.map((s) => <option key={s}>{s}</option>)}</select></label>
          <label className="text-xs font-bold text-muted-foreground">Pesquisar conteúdo<span className="relative mt-1.5 block"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input className="h-11 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm text-foreground" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Digite um assunto, tópico ou título..." /></span></label>
        </div>

        {loading && <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground"><LoaderCircle className="size-5 animate-spin" /> Carregando biblioteca...</div>}
        {error && <div role="alert" className="mt-5 rounded-xl border border-border bg-muted p-4 text-sm text-muted-foreground">A biblioteca ainda não está conectada ao banco de conteúdos. {error}</div>}
        {!loading && !error && <>
          <div className="mt-8 flex items-center justify-between gap-3"><h2 className="text-xl font-black">Aulas e materiais</h2><span className="text-xs font-semibold text-muted-foreground">{visibleItems.length} itens</span></div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {visibleItems.map((item) => <article key={item.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between gap-2"><span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-extrabold text-primary">{typeNames[item.content_type] ?? "Material"}</span><span className="text-[11px] font-semibold text-muted-foreground">{audienceNames[item.audience]}</span></div>
              <p className="mt-4 text-xs font-bold uppercase tracking-wide text-primary">{item.subject} · {item.topic}</p>
              <h3 className="mt-2 text-lg font-extrabold">{item.title}</h3>
              {item.summary && <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.summary}</p>}
              {item.body && <details className="mt-4 rounded-xl bg-muted/50 p-3"><summary className="cursor-pointer text-sm font-bold">Abrir conteúdo da aula</summary><div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-foreground">{item.body}</div></details>}
              {item.resource_url && <a href={item.resource_url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"><ExternalLink className="size-4" /> Abrir material</a>}
              {item.source_reference && <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">Fonte: {item.source_reference}</p>}
            </article>)}
            {visibleItems.length === 0 && <p className="rounded-2xl border border-dashed border-border p-8 text-sm text-muted-foreground md:col-span-2">Nenhum material publicado para este filtro.</p>}
          </div>

          <div className="mt-10 flex items-center justify-between gap-3"><h2 className="text-xl font-black">Flashcards para revisão</h2><span className="text-xs font-semibold text-muted-foreground">{visibleCards.length} cartões</span></div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {visibleCards.map((card) => <button key={card.id} type="button" onClick={() => setOpenCard(openCard === card.id ? null : card.id)} className="rounded-2xl border border-border bg-card p-5 text-left transition hover:border-primary/50">
              <span className="flex items-center justify-between gap-3 text-xs font-bold text-primary"><span>{card.subject} · {card.topic}</span>{openCard === card.id ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}</span>
              <p className="mt-4 font-extrabold">{card.front}</p>
              {openCard === card.id && <p className="mt-4 rounded-xl bg-primary/5 p-4 text-sm leading-6 text-foreground">{card.back}{card.source_reference ? <span className="mt-3 block text-xs text-muted-foreground">Fonte: {card.source_reference}</span> : null}</p>}
              <span className="mt-3 block text-xs text-muted-foreground">{openCard === card.id ? "Toque para ocultar a resposta" : "Toque para revelar a resposta"}</span>
            </button>)}
            {visibleCards.length === 0 && <p className="rounded-2xl border border-dashed border-border p-8 text-sm text-muted-foreground md:col-span-2">Nenhum flashcard publicado para este filtro.</p>}
          </div>
          <div className="mt-10 flex flex-wrap gap-3"><Link to="/questoes" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground">Treinar questões</Link><Link to="/plano-de-estudos" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-5 text-sm font-bold">Meu plano de estudos</Link></div>
        </>}
      </div>
      <CmsSections page="academicos" />
    </main>
    <Footer />
  </>;
}
