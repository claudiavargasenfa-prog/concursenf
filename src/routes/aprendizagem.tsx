import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, CheckCircle2, Clock3, Eye, EyeOff, Layers3, RefreshCw, Target } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";
import { getLearningContents } from "@/lib/learning/catalog.service";
import { recordFlashcardReview, recordStudySession } from "@/lib/learning/activity.service";
import { getMyDueReviews } from "@/lib/learning/review.service";
import type { LearningContent } from "@/lib/learning/types";

type Flashcard = {
  id: string; front: string; back: string; subject: string; topic: string;
  subject_id: string | null; topic_id: string | null;
};
type Session = {
  id: string; activity_type: string; subject_id: string | null; topic_id: string | null;
  source_id: string | null; duration_seconds: number; completed: boolean;
  started_at: string; metadata: Record<string, unknown> | null;
};
type Review = { id: string; flashcard_id: string; rating: number; reviewed_at: string; next_review_at: string | null };

export const Route = createFileRoute("/aprendizagem")({
  head: () => ({ meta: [{ title: "Minha aprendizagem | ConcursEnf" }, { name: "description", content: "Acompanhe conteúdos, questões, flashcards e revisões em um único painel." }] }),
  component: LearningPage,
});

function LearningPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [contents, setContents] = useState<LearningContent[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [dueCount, setDueCount] = useState(0);
  const [selectedContent, setSelectedContent] = useState<LearningContent | null>(null);
  const [selectedCard, setSelectedCard] = useState<Flashcard | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const { data: auth, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!auth.user) { setUserId(null); setError("Entre na sua conta para acessar seu painel de aprendizagem."); return; }
      setUserId(auth.user.id);
      const db = supabase as any;
      const [contentRows, cardResult, sessionResult, reviewResult, due] = await Promise.all([
        getLearningContents(),
        db.from("exam_flashcards").select("id,front,back,subject,topic,subject_id,topic_id").eq("exam_slug", "ebserh-hubrasil").eq("published", true).order("created_at"),
        db.from("study_sessions").select("id,activity_type,subject_id,topic_id,source_id,duration_seconds,completed,started_at,metadata").eq("user_id", auth.user.id).order("started_at", { ascending: false }).limit(200),
        db.from("flashcard_reviews").select("id,flashcard_id,rating,reviewed_at,next_review_at").eq("user_id", auth.user.id).order("reviewed_at", { ascending: false }).limit(200),
        getMyDueReviews(),
      ]);
      if (cardResult.error) throw cardResult.error;
      if (sessionResult.error) throw sessionResult.error;
      if (reviewResult.error) throw reviewResult.error;
      setContents(contentRows);
      setFlashcards((cardResult.data ?? []) as Flashcard[]);
      setSessions((sessionResult.data ?? []) as Session[]);
      setReviews((reviewResult.data ?? []) as Review[]);
      setDueCount(due.length);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível carregar os dados de aprendizagem.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const contentSessions = useMemo(() => sessions.filter((s) => s.activity_type === "content"), [sessions]);
  const questionSessions = useMemo(() => sessions.filter((s) => s.activity_type === "question"), [sessions]);
  const questionAttempts = useMemo(() => questionSessions.length, [questionSessions]);
  const correctCount = useMemo(() => questionSessions.filter((s) => s.metadata?.isCorrect === true).length, [questionSessions]);
  const accuracy = questionAttempts ? Math.round(correctCount / questionAttempts * 100) : null;
  const studiedContents = new Set(contentSessions.map((s) => s.source_id).filter(Boolean)).size;
  const completedContents = new Set(contentSessions.filter((s) => s.completed).map((s) => s.source_id).filter(Boolean)).size;

  async function startContent(item: LearningContent) {
    setBusy(true); setError(""); setNotice("");
    try {
      await recordStudySession({ activityType: "content", subjectId: item.subject_id, topicId: item.topic_id, sourceId: item.id, completed: false, metadata: { event: "accessed", title: item.title } });
      setSelectedContent(item);
      setNotice("Acesso ao conteúdo registrado no seu histórico.");
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível registrar o acesso."); }
    finally { setBusy(false); }
  }

  async function completeContent(item: LearningContent) {
    setBusy(true); setError(""); setNotice("");
    try {
      await recordStudySession({ activityType: "content", subjectId: item.subject_id, topicId: item.topic_id, sourceId: item.id, completed: true, metadata: { event: "completed", title: item.title } });
      setNotice("Conclusão registrada. Isso indica que você marcou o estudo como concluído, não domínio comprovado do assunto.");
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível registrar a conclusão."); }
    finally { setBusy(false); }
  }

  async function submitRating(rating: number) {
    if (!selectedCard) return;
    setBusy(true); setError(""); setNotice("");
    try {
      await recordFlashcardReview({ flashcardId: selectedCard.id, rating });
      setNotice("Avaliação de lembrança registrada.");
      setSelectedCard(null); setRevealed(false);
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível salvar a avaliação."); }
    finally { setBusy(false); }
  }

  const ratingLabels = [{ value: 1, label: "Não lembrei" }, { value: 2, label: "Com dificuldade" }, { value: 3, label: "Lembrei" }, { value: 4, label: "Facilmente" }];

  return <>
    <Header />
    <main className="min-h-screen bg-background px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"><ArrowLeft className="size-4" /> Voltar à plataforma</Link>
        <div className="mt-7 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-xs font-extrabold uppercase tracking-[.18em] text-primary">Área do aluno</p><h1 className="mt-2 text-3xl font-black sm:text-4xl">Minha aprendizagem</h1><p className="mt-2 text-sm text-muted-foreground">Conteúdos, prática e revisões reunidos no mesmo histórico.</p></div>
          <button type="button" onClick={() => void load()} disabled={loading} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border px-4 text-sm font-bold hover:bg-muted disabled:opacity-50"><RefreshCw className="size-4" /> Atualizar painel</button>
        </div>
        {error && <div role="alert" className="mt-5 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{error} {!userId && <Link to="/entrar" className="ml-1 font-bold underline">Entrar</Link>}</div>}
        {notice && <div role="status" className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">{notice}</div>}
        {userId && <>
          <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[{ label: "Conteúdos acessados", value: studiedContents, icon: BookOpen }, { label: "Conteúdos marcados concluídos", value: completedContents, icon: CheckCircle2 }, { label: "Questões respondidas", value: questionAttempts, icon: Target }, { label: "Aproveitamento nas questões", value: accuracy === null ? "—" : accuracy + "%" , icon: Target }, { label: "Revisões pendentes", value: dueCount, icon: Clock3 }].map((metric) => <article key={metric.label} className="rounded-2xl border border-border bg-card p-4"><metric.icon className="size-5 text-primary" /><p className="mt-3 text-2xl font-black">{loading ? "—" : metric.value}</p><p className="mt-1 text-xs font-semibold text-muted-foreground">{metric.label}</p></article>)}
          </section>
          <section className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
              <div className="flex items-center gap-2"><BookOpen className="size-5 text-primary" /><h2 className="text-xl font-black">Estudar conteúdos</h2></div>
              <p className="mt-1 text-xs text-muted-foreground">O registro de acesso e a marcação de conclusão são eventos distintos.</p>
              <div className="mt-4 max-h-[34rem] space-y-3 overflow-y-auto">
                {contents.map((item) => <article key={item.id} className="rounded-xl border border-border p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-primary">{item.subject} · {item.topic}</p><h3 className="mt-1 font-extrabold">{item.title}</h3>{item.summary && <p className="mt-1 text-sm text-muted-foreground">{item.summary}</p>}
                  <div className="mt-3 flex flex-wrap gap-2"><button type="button" disabled={busy} onClick={() => void startContent(item)} className="rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground disabled:opacity-50">Iniciar estudo</button><button type="button" disabled={busy} onClick={() => void completeContent(item)} className="rounded-lg border border-border px-3 py-2 text-xs font-bold disabled:opacity-50">Marcar como concluído</button>{item.resource_url && <a href={item.resource_url} target="_blank" rel="noreferrer" className="rounded-lg border border-border px-3 py-2 text-xs font-bold">Abrir material</a>}</div>
                </article>)}
                {!contents.length && !loading && <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">Nenhum conteúdo publicado disponível neste catálogo.</p>}
              </div>
            </div>
            <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
              <div className="flex items-center gap-2"><Layers3 className="size-5 text-primary" /><h2 className="text-xl font-black">Revisar flashcards</h2></div>
              <p className="mt-1 text-xs text-muted-foreground">Revele a resposta antes de avaliar sua lembrança. Nenhum intervalo automático é presumido.</p>
              {!selectedCard ? <div className="mt-4 max-h-[34rem] space-y-3 overflow-y-auto">{flashcards.map((card) => <button key={card.id} type="button" onClick={() => { setSelectedCard(card); setRevealed(false); }} className="w-full rounded-xl border border-border p-4 text-left transition hover:border-primary/50"><p className="text-[11px] font-bold uppercase text-primary">{card.subject} · {card.topic}</p><p className="mt-1 text-sm font-bold">{card.front}</p></button>)}{!flashcards.length && <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">Nenhum flashcard publicado disponível.</p>}</div> : <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-5"><p className="text-xs font-bold uppercase text-primary">{selectedCard.subject} · {selectedCard.topic}</p><h3 className="mt-3 text-lg font-extrabold">{selectedCard.front}</h3>{revealed && <p className="mt-4 rounded-xl bg-card p-4 text-sm leading-6">{selectedCard.back}</p>}<button type="button" onClick={() => setRevealed((value) => !value)} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold">{revealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}{revealed ? "Ocultar resposta" : "Revelar resposta"}</button>{revealed && <div className="mt-5 grid grid-cols-2 gap-2">{ratingLabels.map((item) => <button key={item.value} type="button" disabled={busy} onClick={() => void submitRating(item.value)} className="rounded-lg bg-primary px-3 py-2.5 text-xs font-bold text-primary-foreground disabled:opacity-50">{item.label}</button>)}</div>}<button type="button" onClick={() => { setSelectedCard(null); setRevealed(false); }} className="mt-3 text-xs font-bold text-muted-foreground underline">Voltar aos cartões</button></div>}
            </div>
          </section>
          <section className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-5 sm:p-6"><h2 className="text-xl font-black">Histórico de atividades</h2><div className="mt-4 max-h-80 space-y-2 overflow-y-auto">{sessions.map((s) => <div key={s.id} className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 p-3"><div><p className="text-sm font-bold">{s.activity_type === "content" ? "Conteúdo" : s.activity_type === "question" ? "Questão" : s.activity_type}</p><p className="text-xs text-muted-foreground">{new Date(s.started_at).toLocaleString("pt-BR")}</p></div><span className="text-xs font-semibold">{s.completed ? "Concluído" : "Acessado"}</span></div>)}{!sessions.length && <p className="text-sm text-muted-foreground">Ainda não há atividades registradas.</p>}</div></div>
            <div className="rounded-3xl border border-border bg-card p-5 sm:p-6"><h2 className="text-xl font-black">Histórico de flashcards</h2><div className="mt-4 max-h-80 space-y-2 overflow-y-auto">{reviews.map((r) => <div key={r.id} className="rounded-xl bg-muted/50 p-3"><p className="text-sm font-bold">Avaliação: {ratingLabels.find((x) => x.value === r.rating)?.label ?? r.rating}</p><p className="text-xs text-muted-foreground">{new Date(r.reviewed_at).toLocaleString("pt-BR")}</p></div>)}{!reviews.length && <p className="text-sm text-muted-foreground">Ainda não há revisões registradas.</p>}</div></div>
          </section>
        </>}
      </div>
    </main>
    <Footer />
  </>;
}
