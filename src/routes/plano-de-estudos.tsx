import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpenCheck, CalendarDays, CheckCircle2, Circle, Clock3, RotateCcw, Sparkles, Target } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CONTENT_GROUPS } from "@/lib/lp-content";

const STORAGE_KEY = "concurs enf-study-plan-v1".replace(" ", "");
const DAYS = [
  { id: "Segunda", short: "SEG" },
  { id: "Terça", short: "TER" },
  { id: "Quarta", short: "QUA" },
  { id: "Quinta", short: "QUI" },
  { id: "Sexta", short: "SEX" },
  { id: "Sábado", short: "SÁB" },
  { id: "Domingo", short: "DOM" },
] as const;

type StudyTask = { id: string; day: string; subject: string; topic: string };

export const Route = createFileRoute("/plano-de-estudos")({
  head: () => ({
    meta: [
      { title: "Plano de estudos | ConcursEnf" },
      { name: "description", content: "Organize sua semana de preparação para concursos de enfermagem com um plano de estudos personalizado." },
    ],
  }),
  component: StudyPlanPage,
});

function StudyPlanPage() {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>(["Segunda", "Terça", "Quarta", "Quinta", "Sexta"]);
  const [minutesPerDay, setMinutesPerDay] = useState(60);
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const subjects = useMemo(
    () => CONTENT_GROUPS.flatMap((group) => group.items.map((item) => ({
      id: item.name,
      group: group.title,
      topics: item.topics,
    }))),
    [],
  );

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as {
          selectedSubjects?: string[];
          selectedDays?: string[];
          minutesPerDay?: number;
          tasks?: StudyTask[];
          completed?: string[];
        };
        setSelectedSubjects(parsed.selectedSubjects ?? []);
        setSelectedDays(parsed.selectedDays ?? ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"]);
        setMinutesPerDay(parsed.minutesPerDay ?? 60);
        setTasks(parsed.tasks ?? []);
        setCompleted(parsed.completed ?? []);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      selectedSubjects, selectedDays, minutesPerDay, tasks, completed,
    }));
  }, [hydrated, selectedSubjects, selectedDays, minutesPerDay, tasks, completed]);

  const totalTopics = selectedSubjects.reduce((total, subjectName) => {
    const subject = subjects.find((item) => item.id === subjectName);
    return total + (subject?.topics.length ?? 0);
  }, 0);
  const progress = tasks.length ? Math.round((completed.length / tasks.length) * 100) : 0;

  function toggleSubject(subjectName: string) {
    setSelectedSubjects((current) => current.includes(subjectName)
      ? current.filter((item) => item !== subjectName)
      : [...current, subjectName]);
  }

  function toggleDay(day: string) {
    setSelectedDays((current) => current.includes(day)
      ? current.filter((item) => item !== day)
      : [...current, day]);
  }

  function createPlan() {
    const selected = subjects.filter((subject) => selectedSubjects.includes(subject.id));
    const studyTopics = selected.flatMap((subject) => subject.topics.map((topic) => ({
      subject: subject.id,
      topic,
    })));
    const dailyCapacity = Math.max(1, Math.floor(minutesPerDay / 25));
    const nextTasks: StudyTask[] = studyTopics.map((item, index) => {
      const dayIndex = Math.floor(index / dailyCapacity) % selectedDays.length;
      const day = selectedDays[dayIndex];
      const block = Math.floor(index / (dailyCapacity * selectedDays.length)) + 1;
      return {
        id: `${day}-${item.subject}-${item.topic}-${index}`,
        day: block > 1 ? `${day} · Ciclo ${block}` : day,
        subject: item.subject,
        topic: item.topic,
      };
    });
    setTasks(nextTasks);
    setCompleted([]);
  }

  function toggleTask(taskId: string) {
    setCompleted((current) => current.includes(taskId)
      ? current.filter((id) => id !== taskId)
      : [...current, taskId]);
  }

  function clearPlan() {
    setTasks([]);
    setCompleted([]);
  }

  const groupedTasks = useMemo(() => {
    const groups = new Map<string, StudyTask[]>();
    for (const task of tasks) {
      groups.set(task.day, [...(groups.get(task.day) ?? []), task]);
    }
    return [...groups.entries()];
  }, [tasks]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background px-4 py-10 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"><ArrowLeft className="size-4" /> Voltar ao início</Link>
          <div className="mt-7 grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
            <section>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[.15em] text-primary"><CalendarDays className="size-4" /> Ferramenta de organização</span>
              <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-5xl">Monte seu <span className="text-primary">plano de estudos.</span></h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">Escolha as disciplinas, defina os dias disponíveis e organize os tópicos em blocos de estudo. Seu planejamento fica salvo neste navegador.</p>

              <div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-sm">
                <h2 className="flex items-center gap-2 text-lg font-extrabold"><Target className="size-5 text-primary" /> 1. Selecione as disciplinas</h2>
                <p className="mt-1 text-xs text-muted-foreground">Marque as áreas que fazem parte do seu edital.</p>
                <div className="mt-4 space-y-4">
                  {CONTENT_GROUPS.map((group) => <fieldset key={group.title}>
                    <legend className="mb-2 text-xs font-extrabold uppercase tracking-wider text-primary">{group.title}</legend>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {group.items.map((subject) => <label key={subject.name} className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3 text-sm transition hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                        <input type="checkbox" checked={selectedSubjects.includes(subject.name)} onChange={() => toggleSubject(subject.name)} className="mt-0.5 size-4 accent-[var(--color-primary)]" />
                        <span className="min-w-0"><span className="block font-semibold text-foreground">{subject.name}</span><span className="mt-0.5 block text-xs text-muted-foreground">{subject.topics.length} tópicos</span></span>
                      </label>)}
                    </div>
                  </fieldset>)}
                </div>
                <p className="mt-4 text-xs font-semibold text-muted-foreground">{selectedSubjects.length} disciplinas selecionadas · {totalTopics} tópicos</p>
              </div>

              <div className="mt-5 rounded-3xl border border-border bg-card p-6 shadow-sm">
                <h2 className="flex items-center gap-2 text-lg font-extrabold"><Clock3 className="size-5 text-primary" /> 2. Defina sua disponibilidade</h2>
                <p className="mt-1 text-xs text-muted-foreground">Escolha os dias e o tempo médio que consegue dedicar por dia.</p>
                <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-7">
                  {DAYS.map((day) => <button key={day.id} type="button" aria-pressed={selectedDays.includes(day.id)} onClick={() => toggleDay(day.id)} className={`rounded-xl border px-2 py-3 text-xs font-extrabold transition ${selectedDays.includes(day.id) ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:border-primary/50"}`}>{day.short}</button>)}
                </div>
                <div className="mt-6 flex items-center justify-between gap-4"><label htmlFor="minutes-per-day" className="text-sm font-semibold">Tempo disponível por dia</label><span className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-extrabold text-primary">{minutesPerDay} min</span></div>
                <input id="minutes-per-day" type="range" min="25" max="240" step="5" value={minutesPerDay} onChange={(event) => setMinutesPerDay(Number(event.target.value))} className="mt-3 w-full accent-[var(--color-primary)]" />
                <div className="mt-1 flex justify-between text-[11px] text-muted-foreground"><span>25 minutos</span><span>4 horas</span></div>
                <button type="button" onClick={createPlan} disabled={!selectedSubjects.length || !selectedDays.length} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-40"><Sparkles className="size-4" /> Gerar meu plano semanal</button>
                {(!selectedSubjects.length || !selectedDays.length) && <p className="mt-2 text-center text-xs text-muted-foreground">Selecione ao menos uma disciplina e um dia da semana.</p>}
              </div>
            </section>

            <section className="lg:pt-12">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[.18em] text-primary">Seu acompanhamento</p><h2 className="mt-2 text-2xl font-black">Plano de estudos</h2><p className="mt-1 text-xs text-muted-foreground">Marque cada tópico conforme concluir sua revisão.</p></div><span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary"><BookOpenCheck className="size-6" /></span></div>
                {tasks.length > 0 ? <>
                  <div className="mt-7 rounded-2xl bg-primary/5 p-4"><div className="flex items-center justify-between gap-3"><span className="text-sm font-bold">Progresso geral</span><span className="text-lg font-black text-primary">{progress}%</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} /></div><p className="mt-2 text-xs text-muted-foreground">{completed.length} de {tasks.length} tópicos concluídos</p></div>
                  <div className="mt-6 space-y-5">
                    {groupedTasks.map(([day, dayTasks]) => <div key={day}><h3 className="mb-2 border-b border-border pb-2 text-xs font-extrabold uppercase tracking-wider text-primary">{day}</h3><ul className="space-y-2">{dayTasks.map((task) => { const isDone = completed.includes(task.id); return <li key={task.id}><button type="button" onClick={() => toggleTask(task.id)} className="flex w-full items-start gap-3 rounded-xl p-3 text-left transition hover:bg-muted/60"><span className="mt-0.5 shrink-0 text-primary">{isDone ? <CheckCircle2 className="size-5" /> : <Circle className="size-5" />}</span><span className="min-w-0"><span className={`block text-sm font-bold ${isDone ? "text-muted-foreground line-through" : "text-foreground"}`}>{task.topic}</span><span className="mt-1 block text-xs text-muted-foreground">{task.subject} · bloco sugerido de 25 min</span></span></button></li>; })}</ul></div>)}
                  </div>
                  <button type="button" onClick={clearPlan} className="mt-7 inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-destructive"><RotateCcw className="size-3.5" /> Limpar plano atual</button>
                </> : <div className="mt-8 rounded-2xl border border-dashed border-border px-6 py-12 text-center"><CalendarDays className="mx-auto size-10 text-muted-foreground" /><h3 className="mt-4 font-extrabold">Seu plano aparecerá aqui</h3><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">Selecione suas disciplinas e os dias disponíveis. Depois, gere o planejamento para visualizar os tópicos distribuídos na semana.</p></div>}
                <p className="mt-6 border-t border-border pt-4 text-[11px] leading-5 text-muted-foreground">O plano é uma sugestão de organização, não substitui a leitura do edital. Os dados ficam salvos apenas no armazenamento local deste navegador e dispositivo.</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
