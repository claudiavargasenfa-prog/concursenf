import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft, ArrowRight, Award, BookOpenCheck, CheckCircle2, CircleHelp,
  Clock3, Filter, History, RotateCcw, Sparkles, Target, Trophy, XCircle,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";
import { PRACTICE_QUESTIONS, type PracticeQuestion } from "@/lib/practice-questions";

const HISTORY_KEY = "concursenf-question-history-v1";

type Attempt = {
  id: string;
  date: string;
  discipline: string;
  total: number;
  correct: number;
  percentage: number;
  answers: { questionId: string; selected: string; correct: boolean }[];
};

export const Route = createFileRoute("/questoes")({
  head: () => ({
    meta: [
      { title: "Questões comentadas | ConcursEnf" },
      { name: "description", content: "Pratique questões de enfermagem e saúde pública, confira comentários e acompanhe seu desempenho." },
    ],
  }),
  component: QuestionsPage,
});

function QuestionsPage() {
  const [discipline, setDiscipline] = useState("Todas as disciplinas");
  const [difficulty, setDifficulty] = useState("Todas");
  const [session, setSession] = useState<PracticeQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ questionId: string; selected: string; correct: boolean }[]>([]);
  const [history, setHistory] = useState<Attempt[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [finished, setFinished] = useState(false);
  const [questionBank, setQuestionBank] = useState<PracticeQuestion[]>(PRACTICE_QUESTIONS);
  const [bankNotice, setBankNotice] = useState("");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(HISTORY_KEY);
      if (stored) setHistory(JSON.parse(stored) as Attempt[]);
    } catch {
      window.localStorage.removeItem(HISTORY_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history, hydrated]);

  const available = useMemo(() => PRACTICE_QUESTIONS.filter((question) =>
    (discipline === "Todas as disciplinas" || question.discipline === discipline) &&
    (difficulty === "Todas" || question.difficulty === difficulty),
  ), [questionBank, discipline, difficulty]);

  const question = session[current];
  const answered = selected !== null;
  const correctCount = answers.filter((answer) => answer.correct).length;
  const percentage = answers.length ? Math.round((correctCount / answers.length) * 100) : 0;
  const bestScore = history.length ? Math.max(...history.map((attempt) => attempt.percentage)) : 0;
  const averageScore = history.length ? Math.round(history.reduce((sum, attempt) => sum + attempt.percentage, 0) / history.length) : 0;

  function startSession() {
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    setSession(shuffled);
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setFinished(false);
    setShowHistory(false);
  }

  function submitAnswer() {
    if (!question || !selected || answered) return;
    const isCorrect = selected === question.answer;
    setAnswers((previous) => [...previous, { questionId: question.id, selected, correct: isCorrect }]);
  }

  function nextQuestion() {
    if (!question || !selected) return;
    if (current + 1 < session.length) {
      setCurrent((value) => value + 1);
      setSelected(null);
      return;
    }
    const finalAnswers = answers;
    const correct = finalAnswers.filter((answer) => answer.correct).length;
    const result: Attempt = {
      id: `attempt-${Date.now()}`,
      date: new Date().toISOString(),
      discipline,
      total: finalAnswers.length,
      correct,
      percentage: Math.round((correct / finalAnswers.length) * 100),
      answers: finalAnswers,
    };
    setHistory((previous) => [result, ...previous].slice(0, 50));
    setFinished(true);
  }

  function resetSession() {
    setSession([]);
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setFinished(false);
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background px-4 py-10 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"><ArrowLeft className="size-4" /> Voltar ao início</Link>
          <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_300px]">
            <section>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[.15em] text-primary"><BookOpenCheck className="size-4" /> Treino por questões</span>
              <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-5xl">Pratique. Corrija. <span className="text-primary">Evolua.</span></h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">Resolva questões por disciplina, assunto e dificuldade. As questões publicadas para EBSERH e HU Brasil entram automaticamente neste banco, com gabarito comentado e referência.</p>\n              {bankNotice && <p className="mt-3 rounded-xl border border-border bg-muted p-3 text-xs text-muted-foreground">{bankNotice}</p>}

              {!session.length && !finished && <div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
                <h2 className="flex items-center gap-2 text-xl font-extrabold"><Target className="size-5 text-primary" /> Configure seu treino</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-semibold">Disciplina
                    <select value={discipline} onChange={(event) => setDiscipline(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-3 text-sm font-normal outline-none focus:border-primary">
                      {disciplines.map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </label>
                  <label className="text-sm font-semibold">Nível de dificuldade
                    <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-3 text-sm font-normal outline-none focus:border-primary">
                      {["Todas", "Básica", "Intermediária", "Avançada"].map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </label>
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-primary/5 p-4"><span className="text-sm text-muted-foreground"><strong className="text-foreground">{available.length}</strong> questões disponíveis neste filtro</span><span className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground"><Filter className="size-4 text-primary" /> Filtro por conteúdo</span></div>
                <button type="button" disabled={!available.length} onClick={startSession} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-40"><Sparkles className="size-4" /> Iniciar treino</button>
                <p className="mt-3 text-center text-xs text-muted-foreground">Cada treino utiliza as questões disponíveis na seleção atual.</p>
              </div>}

              {question && !finished && <div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3"><span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">{question.discipline}</span><span className="text-xs font-semibold text-muted-foreground">Questão {current + 1} de {session.length}</span></div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((current + 1) / session.length) * 100}%` }} /></div>
                <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground"><span>{question.topic}</span><span>·</span><span>{question.difficulty}</span></div>
                <h2 className="mt-4 text-lg font-extrabold leading-8 sm:text-xl">{question.statement}</h2>
                <div className="mt-6 space-y-3">
                  {question.options.map((option) => {
                    const isSelected = selected === option.id;
                    const isAnswer = option.id === question.answer;
                    const showResult = answered;
                    const style = showResult && isAnswer
                      ? "border-emerald-500 bg-emerald-500/10 text-foreground"
                      : showResult && isSelected && !isAnswer
                        ? "border-destructive bg-destructive/5 text-foreground"
                        : isSelected
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border bg-background text-foreground hover:border-primary/50";
                    return <button key={option.id} type="button" disabled={answered} onClick={() => setSelected(option.id)} className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition ${style} disabled:cursor-default`}>
                      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-xs font-black">{option.id}</span>
                      <span className="flex-1 pt-1 text-sm font-medium leading-6">{option.text}</span>
                      {showResult && isAnswer && <CheckCircle2 className="mt-1 size-5 shrink-0 text-emerald-600" />}
                      {showResult && isSelected && !isAnswer && <XCircle className="mt-1 size-5 shrink-0 text-destructive" />}
                      {!showResult && <span className={`mt-1 size-4 shrink-0 rounded-full border ${isSelected ? "border-primary bg-primary shadow-[inset_0_0_0_3px_var(--background)]" : "border-muted-foreground/40"}`} />}
                    </button>;
                  })}
                </div>
                {!answered ? <button type="button" disabled={!selected} onClick={submitAnswer} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40">Confirmar resposta <ArrowRight className="size-4" /></button> : <div className="mt-6 rounded-2xl border border-border bg-surface-soft p-5 text-surface-soft-foreground">
                  <div className="flex items-center gap-2">{selected === question.answer ? <CheckCircle2 className="size-5 text-emerald-600" /> : <XCircle className="size-5 text-destructive" />}<h3 className="font-extrabold">{selected === question.answer ? "Resposta correta!" : `Resposta incorreta. Gabarito: ${question.answer}`}</h3></div>
                  <p className="mt-3 text-sm leading-7 text-soft-muted">{question.explanation}</p>
                  <p className="mt-3 border-t border-border pt-3 text-xs leading-5 text-soft-muted"><strong>Referência para revisão:</strong> {question.reference}</p>
                  <button type="button" onClick={nextQuestion} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-extrabold text-primary-foreground">{current + 1 === session.length ? "Ver meu resultado" : "Próxima questão"} <ArrowRight className="size-4" /></button>
                </div>}
              </div>}

              {finished && <div className="mt-8 rounded-3xl border border-border bg-card p-6 text-center shadow-sm sm:p-9">
                <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary"><Trophy className="size-8" /></span>
                <p className="mt-5 text-xs font-extrabold uppercase tracking-[.18em] text-primary">Treino concluído</p>
                <h2 className="mt-2 text-3xl font-black">Você acertou {correctCount} de {answers.length}</h2>
                <p className="mt-2 text-sm text-muted-foreground">Seu aproveitamento neste treino foi de:</p>
                <p className="mt-2 text-5xl font-black text-primary">{percentage}%</p>
                <div className="mx-auto mt-6 grid max-w-sm grid-cols-2 gap-3"><div className="rounded-2xl bg-emerald-500/10 p-4"><p className="text-2xl font-black text-emerald-700">{correctCount}</p><p className="text-xs font-semibold text-muted-foreground">Acertos</p></div><div className="rounded-2xl bg-destructive/5 p-4"><p className="text-2xl font-black text-destructive">{answers.length - correctCount}</p><p className="text-xs font-semibold text-muted-foreground">Erros</p></div></div>
                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><button type="button" onClick={startSession} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground"><RotateCcw className="size-4" /> Refazer treino</button><button type="button" onClick={resetSession} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-bold">Novo filtro</button></div>
              </div>}
            </section>

            <aside className="space-y-4">
              <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                <h2 className="flex items-center gap-2 font-extrabold"><Award className="size-5 text-primary" /> Seu desempenho</h2>
                <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-primary/5 p-3"><p className="text-2xl font-black text-primary">{history.length}</p><p className="text-[11px] font-semibold text-muted-foreground">Treinos concluídos</p></div><div className="rounded-2xl bg-primary/5 p-3"><p className="text-2xl font-black text-primary">{averageScore}%</p><p className="text-[11px] font-semibold text-muted-foreground">Média geral</p></div></div>
                <div className="mt-3 rounded-2xl bg-primary/5 p-3"><p className="text-2xl font-black text-primary">{bestScore}%</p><p className="text-[11px] font-semibold text-muted-foreground">Melhor aproveitamento</p></div>
                <button type="button" onClick={() => setShowHistory((value) => !value)} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-xs font-bold hover:border-primary/50"><History className="size-4" /> {showHistory ? "Ocultar histórico" : "Ver histórico"}</button>
              </div>
              {showHistory && <div className="rounded-3xl border border-border bg-card p-5 shadow-sm"><h3 className="font-extrabold">Últimos treinos</h3>{history.length ? <ul className="mt-4 space-y-3">{history.map((attempt) => <li key={attempt.id} className="border-b border-border pb-3 last:border-0"><div className="flex items-center justify-between gap-2"><span className="text-xs font-bold">{attempt.discipline}</span><span className="text-sm font-black text-primary">{attempt.percentage}%</span></div><p className="mt-1 text-[11px] text-muted-foreground">{new Date(attempt.date).toLocaleString("pt-BR")} · {attempt.correct}/{attempt.total} acertos</p></li>)}</ul> : <p className="mt-3 text-sm text-muted-foreground">Seus resultados aparecerão aqui após o primeiro treino concluído.</p>}</div>}
              <div className="rounded-3xl bg-surface-soft p-5 text-surface-soft-foreground"><span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><CircleHelp className="size-5" /></span><h3 className="mt-4 font-extrabold">Aprenda com os comentários</h3><p className="mt-2 text-xs leading-6 text-soft-muted">Depois de responder, confira a justificativa e a referência indicada para aprofundar a revisão.</p></div>
              <div className="rounded-3xl border border-border bg-card p-5"><div className="flex items-center gap-2 text-sm font-extrabold"><Clock3 className="size-4 text-primary" /> Seu histórico é local</div><p className="mt-2 text-xs leading-6 text-muted-foreground">Os resultados ficam salvos neste navegador e dispositivo. Ainda não são sincronizados entre aparelhos ou contas.</p></div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
