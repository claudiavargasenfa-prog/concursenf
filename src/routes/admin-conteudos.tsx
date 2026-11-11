import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, CheckCircle2, CircleAlert, FilePlus2, Layers3, ListChecks, Save } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";

type Tab = "conteudo" | "questao" | "flashcard";
type Counts = { content: number; questions: number; flashcards: number };

export const Route = createFileRoute("/admin-conteudos")({
  head: () => ({ meta: [{ title: "Administração de conteúdos | ConcursEnf" }] }),
  component: AdminExamContentPage,
});

const inputClass = "mt-1.5 min-h-11 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15";
const labelClass = "block text-sm font-semibold text-foreground";

function AdminExamContentPage() {
  const [tab, setTab] = useState<Tab>("conteudo");
  const [counts, setCounts] = useState<Counts>({ content: 0, questions: 0, flashcards: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("todos");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");
  const [contentType, setContentType] = useState("texto");
  const [resourceUrl, setResourceUrl] = useState("");
  const [source, setSource] = useState("");
  const [statement, setStatement] = useState("");
  const [optionsText, setOptionsText] = useState("A|\nB|\nC|\nD|");
  const [correct, setCorrect] = useState("A");
  const [explanation, setExplanation] = useState("");
  const [difficulty, setDifficulty] = useState("Intermediária");
  const [board, setBoard] = useState("HU Brasil / EBSERH");
  const [year, setYear] = useState("");
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [published, setPublished] = useState(false);

  async function loadCounts() {
    setLoading(true);
    setError("");
    try {
      const db = supabase as any;
      const [c, q, f] = await Promise.all([
        db.from("exam_content_items").select("id", { count: "exact", head: true }),
        db.from("exam_questions").select("id", { count: "exact", head: true }),
        db.from("exam_flashcards").select("id", { count: "exact", head: true }),
      ]);
      const issue = c.error || q.error || f.error;
      if (issue) throw issue;
      setCounts({ content: c.count ?? 0, questions: q.count ?? 0, flashcards: f.count ?? 0 });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível acessar o banco de conteúdos. Verifique se a migração foi aplicada e se sua conta tem permissão de administração.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadCounts(); }, []);

  function resetForm() {
    setTitle(""); setSummary(""); setBody(""); setResourceUrl(""); setSource("");
    setStatement(""); setOptionsText("A|\nB|\nC|\nD|"); setCorrect("A");
    setExplanation(""); setFront(""); setBack(""); setYear(""); setPublished(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true); setError(""); setMessage("");
    try {
      const db = supabase as any;
      const common = { exam_slug: "ebserh-hubrasil", audience, subject: subject.trim(), topic: topic.trim(), published: published };
      let result;
      if (tab === "conteudo") {
        if (["pdf", "audio", "video", "link"].includes(contentType) && !resourceUrl.trim()) throw new Error("Informe o endereço do arquivo ou recurso.");
        result = await db.from("exam_content_items").insert({
          ...common, title: title.trim(), summary: summary.trim() || null, body: body.trim() || null,
          content_type: contentType, resource_url: resourceUrl.trim() || null,
          source_reference: source.trim() || null,
        });
      } else if (tab === "questao") {
        const options = optionsText.split("\n").map((line) => {
          const [id, ...parts] = line.split("|");
          return { id: id.trim().toUpperCase(), text: parts.join("|").trim() };
        }).filter((option) => option.id && option.text);
        if (options.length < 2) throw new Error("Cadastre pelo menos duas alternativas no formato A|Texto da alternativa.");
        if (!options.some((option) => option.id === correct)) throw new Error("A alternativa correta precisa existir na lista.");
        result = await db.from("exam_questions").insert({
          ...common, statement: statement.trim(), options, correct_option: correct,
          explanation: explanation.trim(), difficulty, source_board: board.trim() || null,
          source_year: year ? Number(year) : null, reference: source.trim() || null,
        });
      } else {
        result = await db.from("exam_flashcards").insert({
          ...common, front: front.trim(), back: back.trim(),
        });
      }
      if (result.error) throw result.error;
      setMessage(published ? "Conteúdo cadastrado e publicado." : "Conteúdo salvo como rascunho. Publique quando estiver revisado.");
      resetForm();
      await loadCounts();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível salvar. Confira os dados e as permissões da conta.");
    } finally {
      setSaving(false);
    }
  }

  const tabs: { id: Tab; label: string; icon: typeof BookOpen }[] = [
    { id: "conteudo", label: "Aulas e materiais", icon: BookOpen },
    { id: "questao", label: "Questões", icon: ListChecks },
    { id: "flashcard", label: "Flashcards", icon: Layers3 },
  ];

  return <>
    <Header />
    <main className="min-h-screen bg-background px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"><ArrowLeft className="size-4" /> Voltar à plataforma</Link>
        <div className="mt-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-primary"><FilePlus2 className="size-4" /> Área administrativa</span><h1 className="mt-4 text-3xl font-black sm:text-4xl">Conteúdos EBSERH | HU Brasil</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Cadastre aulas, mapas mentais, arquivos, questões comentadas e flashcards. Organize por cargo, disciplina e assunto.</p></div>
          <button type="button" onClick={() => void loadCounts()} className="min-h-10 rounded-xl border border-border px-4 text-sm font-bold hover:bg-muted">Atualizar dados</button>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          {[{ label: "Materiais e aulas", value: counts.content }, { label: "Questões cadastradas", value: counts.questions }, { label: "Flashcards cadastrados", value: counts.flashcards }].map((item) => <div key={item.label} className="rounded-2xl border border-border bg-card p-5"><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{item.label}</p><p className="mt-2 text-3xl font-black text-foreground">{loading ? "—" : item.value}</p></div>)}
        </div>

        {error && <div role="alert" className="mt-5 flex gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"><CircleAlert className="size-5 shrink-0" /><span>{error}</span></div>}
        {message && <div role="status" className="mt-5 flex gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4 text-sm text-foreground"><CheckCircle2 className="size-5 shrink-0 text-primary" /><span>{message}</span></div>}

        <div className="mt-8 rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-7">
          <div className="flex flex-wrap gap-2 border-b border-border pb-4">
            {tabs.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => { setTab(id); setMessage(""); setError(""); }} className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-bold transition ${tab === id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}><Icon className="size-4" />{label}</button>)}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <label className={labelClass}>Cargo / público
                <select className={inputClass} value={audience} onChange={(e) => setAudience(e.target.value)}><option value="todos">Todos os cargos</option><option value="enfermeiro">Enfermeiro</option><option value="tecnico">Técnico de Enfermagem</option><option value="auxiliar">Auxiliar de Enfermagem</option></select>
              </label>
              <label className={labelClass}>Disciplina<input className={inputClass} value={subject} onChange={(e) => setSubject(e.target.value)} required placeholder="Ex.: Enfermagem Médico-Cirúrgica" /></label>
              <label className={labelClass}>Assunto / tópico<input className={inputClass} value={topic} onChange={(e) => setTopic(e.target.value)} required placeholder="Ex.: Segurança do paciente" /></label>
            </div>

            {tab === "conteudo" && <>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelClass}>Tipo de material<select className={inputClass} value={contentType} onChange={(e) => setContentType(e.target.value)}><option value="texto">Aula em texto</option><option value="mapa_mental">Mapa mental</option><option value="pdf">PDF</option><option value="audio">Áudio</option><option value="video">Vídeo</option><option value="link">Link externo</option></select></label>
                <label className={labelClass}>Título<input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Título do conteúdo" /></label>
              </div>
              <label className={labelClass}>Resumo<textarea className={inputClass} rows={2} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Descrição curta para o aluno" /></label>
              <label className={labelClass}>Conteúdo / texto da aula<textarea className={inputClass} rows={9} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Cole ou escreva o conteúdo. Para PDF, áudio, vídeo ou link, informe também o endereço do recurso." /></label>
              {contentType !== "texto" && contentType !== "mapa_mental" && <label className={labelClass}>Endereço do arquivo ou recurso<input className={inputClass} type="url" value={resourceUrl} onChange={(e) => setResourceUrl(e.target.value)} required placeholder="https://..." /></label>}
            </>}

            {tab === "questao" && <>
              <label className={labelClass}>Enunciado<textarea className={inputClass} rows={4} required value={statement} onChange={(e) => setStatement(e.target.value)} placeholder="Digite o enunciado da questão" /></label>
              <div className="grid gap-4 sm:grid-cols-3">
                <label className={labelClass}>Dificuldade<select className={inputClass} value={difficulty} onChange={(e) => setDifficulty(e.target.value)}><option>Básica</option><option>Intermediária</option><option>Avançada</option></select></label>
                <label className={labelClass}>Banca / origem<input className={inputClass} value={board} onChange={(e) => setBoard(e.target.value)} /></label>
                <label className={labelClass}>Ano<input className={inputClass} type="number" min="1990" max="2100" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Ex.: 2025" /></label>
              </div>
              <label className={labelClass}>Alternativas (uma por linha, formato A|texto)<textarea className={inputClass} rows={5} required value={optionsText} onChange={(e) => setOptionsText(e.target.value)} /></label>
              <label className={labelClass}>Alternativa correta<select className={inputClass} value={correct} onChange={(e) => setCorrect(e.target.value)}>{["A","B","C","D","E"].map((v) => <option key={v}>{v}</option>)}</select></label>
              <label className={labelClass}>Comentário / justificativa<textarea className={inputClass} rows={5} required value={explanation} onChange={(e) => setExplanation(e.target.value)} placeholder="Explique o raciocínio e, se possível, por que as demais alternativas estão incorretas." /></label>
            </>}

            {tab === "flashcard" && <>
              <label className={labelClass}>Frente — pergunta ou conceito<textarea className={inputClass} rows={3} required value={front} onChange={(e) => setFront(e.target.value)} /></label>
              <label className={labelClass}>Verso — resposta ou explicação<textarea className={inputClass} rows={4} required value={back} onChange={(e) => setBack(e.target.value)} /></label>
            </>}

            <label className={labelClass}>Referência / fonte (opcional)<input className={inputClass} value={source} onChange={(e) => setSource(e.target.value)} placeholder="Norma, protocolo, bibliografia ou origem da questão" /></label>
            <label className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4 text-sm"><input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="mt-0.5 size-4 accent-[var(--color-primary)]" /><span><strong>Publicar imediatamente</strong><span className="mt-1 block text-xs text-muted-foreground">Se desmarcado, o item fica salvo como rascunho e não aparece para os alunos.</span></span></label>
            <div className="flex flex-wrap justify-end gap-3"><button type="button" onClick={resetForm} className="min-h-11 rounded-xl border border-border px-5 text-sm font-bold hover:bg-muted">Limpar</button><button type="submit" disabled={saving} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-extrabold text-primary-foreground disabled:opacity-60"><Save className="size-4" />{saving ? "Salvando..." : "Salvar conteúdo"}</button></div>
          </form>
        </div>
        <p className="mt-5 text-xs leading-5 text-muted-foreground">A área administrativa exige permissão de catálogo no Supabase. A publicação depende da migração do banco e da atribuição do perfil administrativo à conta responsável.</p>
      </div>
    </main>
    <Footer />
  </>;
}
