import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BookOpen, Brain, CalendarCheck, CheckCircle2, Clock3, HeartHandshake, Lightbulb, ListChecks, RotateCcw, Target } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/aprenda-a-estudar")({
  head: () => ({ meta: [{ title: "Aprenda a estudar | ConcursEnf" }, { name: "description", content: "Método prático de organização, aprendizagem, memorização e preparação para concursos de enfermagem." }] }),
  component: LearnToStudyPage,
});

const modules = [
  { id: "metodo", number: "01", title: "Fundamentos da aprendizagem", icon: Brain, intro: "Entenda como transformar leitura em conhecimento recuperável e aplicável na prova.", lessons: [
    ["Estudo ativo e estudo passivo", "A leitura isolada produz familiaridade, mas não garante recuperação da informação. Intercale leitura orientada, explicação com as próprias palavras, perguntas e resolução de questões."],
    ["Ciclo de aprendizagem", "Use cinco movimentos: planejar o objetivo, compreender o conteúdo, organizar as ideias, recuperar a informação sem consulta e consolidar por revisões."],
    ["Como estudar um assunto", "Antes de começar, delimite o tópico e o resultado esperado. Durante o estudo, registre conceitos-chave e dúvidas. Ao terminar, feche o material e explique o tema como se estivesse ensinando."],
  ]},
  { id: "planejamento", number: "02", title: "Planejamento e organização", icon: CalendarCheck, intro: "Construa uma rotina realista, adaptável à disponibilidade e ao edital.", lessons: [
    ["Diagnóstico inicial", "Liste disciplinas, tópicos do edital, nível de domínio e tempo semanal disponível. Classifique cada assunto como não estudado, em aprendizagem ou em revisão."],
    ["Cronograma inteligente", "Distribua os assuntos em blocos curtos e equilibrados. Reserve horários para teoria, questões e revisões. Priorize conteúdos de maior incidência e suas lacunas, sem abandonar os demais pontos do edital."],
    ["Planejamento semanal", "Defina metas observáveis para cada bloco: estudar um tópico, responder determinado conjunto de questões e revisar erros. Reorganize a semana quando houver imprevistos."],
  ]},
  { id: "memorizacao", number: "03", title: "Memorização e recuperação ativa", icon: Lightbulb, intro: "Aprenda técnicas para recuperar informações com mais segurança.", lessons: [
    ["Evocação ativa", "Após estudar, tente responder perguntas sem consultar o material. A dificuldade de recuperar a informação revela o que precisa ser reforçado."],
    ["Associação e elaboração", "Relacione conceitos novos a conhecimentos prévios, exemplos clínicos e situações do cotidiano profissional. Explique por que uma informação faz sentido."],
    ["Mapas mentais e resumos", "Use mapas para mostrar relações hierárquicas e resumos para sintetizar ideias essenciais. Produza esses recursos depois de compreender o conteúdo; evite apenas copiar trechos."],
  ]},
  { id: "revisao", number: "04", title: "Revisão espaçada e consolidação", icon: RotateCcw, intro: "Retome o conteúdo em intervalos planejados e com esforço de lembrança.", lessons: [
    ["Revisão programada", "Agende revisões após o primeiro contato e retome o tema em intervalos progressivos, ajustando a frequência conforme seu desempenho."],
    ["Revisão por questões", "Resolva questões sem consultar a teoria. Analise tanto os acertos quanto os erros e retorne ao ponto específico que gerou dúvida."],
    ["Flashcards eficazes", "Crie cartões com uma pergunta objetiva por vez. A resposta deve ser curta, precisa e suficiente para recuperar o conceito. Evite cartões com parágrafos extensos."],
  ]},
  { id: "questoes", number: "05", title: "Resolução estratégica de questões", icon: ListChecks, intro: "Use questões como instrumento de aprendizagem e diagnóstico.", lessons: [
    ["Leitura do comando", "Identifique o verbo do enunciado, o recorte do problema e expressões restritivas como correta, incorreta, exceto, prioritariamente e inicialmente."],
    ["Análise das alternativas", "Compare cada alternativa com o conceito cobrado. Identifique generalizações, trocas de termos, informações incompatíveis e afirmações parcialmente corretas."],
    ["Correção comentada", "Não se limite ao gabarito. Registre o motivo da resposta correta e o erro conceitual ou interpretativo presente em cada distrator relevante."],
  ]},
  { id: "erros", number: "06", title: "Caderno de erros e análise de desempenho", icon: Target, intro: "Transforme erros recorrentes em prioridades de estudo.", lessons: [
    ["Classificação dos erros", "Registre se o erro ocorreu por desconhecimento, confusão entre conceitos, interpretação, desatenção ou gestão do tempo."],
    ["Plano de correção", "Associe cada erro a uma ação: retomar teoria, elaborar pergunta, revisar flashcard, resolver questões semelhantes ou treinar leitura do enunciado."],
    ["Indicadores úteis", "Acompanhe taxa de acertos por disciplina, assunto e banca, volume de questões, erros repetidos e evolução ao longo do tempo. Um indicador isolado não representa domínio completo."],
  ]},
  { id: "bancas", number: "07", title: "Estratégias de prova e perfil das bancas", icon: BookOpen, intro: "Adapte a preparação ao formato de cobrança sem depender de fórmulas prontas.", lessons: [
    ["Leitura do edital", "Identifique conteúdos, pesos, etapas, critérios de aprovação e bibliografia indicada. Converta o edital em uma lista verificável de tópicos."],
    ["Estudo por banca", "Resolva provas anteriores da mesma organizadora e observe extensão dos enunciados, comandos, nível de contextualização e construção das alternativas."],
    ["Treino de prova", "Pratique com tempo controlado, simule a ordem de resolução e defina quando avançar de uma questão difícil. Depois, faça análise qualitativa dos resultados."],
  ]},
  { id: "emocional", number: "08", title: "Inteligência emocional e constância", icon: HeartHandshake, intro: "Desenvolva uma rotina sustentável para manter a preparação ao longo do tempo.", lessons: [
    ["Metas possíveis", "Trabalhe com metas específicas e compatíveis com sua rotina. A consistência de sessões possíveis tende a ser mais sustentável do que planos excessivos."],
    ["Ansiedade diante da prova", "Use simulados para familiarização, respiração lenta para reduzir a ativação momentânea e planejamento para diminuir incertezas. Se o sofrimento for persistente ou intenso, procure apoio profissional."],
    ["Ajuste sem desistência", "Uma semana abaixo do planejado é informação para reorganizar a estratégia, não motivo para abandonar o projeto. Retome pelo próximo bloco prioritário."],
  ]},
];

function LearnToStudyPage() {
  const [active, setActive] = useState("metodo");
  const [completed, setCompleted] = useState<string[]>([]);
  const current = modules.find((item) => item.id === active) ?? modules[0]!;
  const toggleDone = (key: string) => setCompleted((items) => items.includes(key) ? items.filter((item) => item !== key) : [...items, key]);
  const totalLessons = modules.reduce((sum, item) => sum + item.lessons.length, 0);
  return <>
    <Header />
    <main className="min-h-screen bg-background px-4 py-9 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"><ArrowLeft className="size-4" /> Voltar ao início</Link>
        <section className="mt-7 overflow-hidden rounded-[2rem] bg-muted p-6 sm:p-10">
          <p className="text-xs font-extrabold uppercase tracking-[.2em] text-primary">Método ConcursEnf</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">APRENDA A ESTUDAR</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">Uma trilha prática para organizar sua preparação, compreender conteúdos, memorizar, revisar e resolver questões de concursos de Enfermagem com estratégia.</p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs font-bold">
            <span className="rounded-full border border-border bg-card px-4 py-2">8 módulos</span>
            <span className="rounded-full border border-border bg-card px-4 py-2">{totalLessons} aulas essenciais</span>
            <span className="rounded-full border border-border bg-card px-4 py-2">{completed.length} de {totalLessons} concluídas</span>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-border"><div className="h-full rounded-full bg-primary transition-all" style={{ width: totalLessons ? completed.length / totalLessons * 100 + "%" : "0%" }} /></div>
        </section>
        <div className="mt-8 grid gap-6 lg:grid-cols-[19rem_1fr]">
          <aside className="h-fit rounded-2xl border border-border bg-card p-3" aria-label="Módulos de aprendizagem">
            <p className="px-3 py-2 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Trilha de aprendizagem</p>
            {modules.map((item) => { const Icon = item.icon; const count = item.lessons.filter((lesson) => completed.includes(item.id + ":" + lesson[0])).length; return <button key={item.id} type="button" onClick={() => setActive(item.id)} aria-current={active === item.id ? "step" : undefined} className={`flex min-h-14 w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${active === item.id ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}><Icon className="size-5 shrink-0" /><span className="min-w-0 flex-1"><span className="block text-[10px] font-bold opacity-75">MÓDULO {item.number}</span><span className="block text-sm font-bold">{item.title}</span></span><span className="text-xs font-bold">{count}/{item.lessons.length}</span></button>; })}
          </aside>
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-8">
            <div className="flex items-start gap-3"><span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary"><current.icon className="size-6" /></span><div><p className="text-xs font-extrabold uppercase tracking-wider text-primary">Módulo {current.number}</p><h2 className="mt-1 text-2xl font-black">{current.title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{current.intro}</p></div></div>
            <div className="mt-7 space-y-3">
              {current.lessons.map(([title, body], index) => { const key = current.id + ":" + title; const done = completed.includes(key); return <article key={key} className="rounded-xl border border-border p-4 sm:p-5"><div className="flex items-start gap-3"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-xs font-black">{index + 1}</span><div className="min-w-0 flex-1"><h3 className="font-extrabold">{title}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{body}</p><button type="button" onClick={() => toggleDone(key)} className="mt-4 inline-flex min-h-9 items-center gap-2 rounded-lg border border-border px-3 text-xs font-bold hover:bg-muted" aria-pressed={done}><CheckCircle2 className={`size-4 ${done ? "text-primary" : "text-muted-foreground"}`} />{done ? "Aula concluída" : "Marcar aula como concluída"}</button></div></div></article>; })}
            </div>
            <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
              <p className="text-xs text-muted-foreground"><Clock3 className="mr-1 inline size-4" /> Avance no seu ritmo e retome quando precisar.</p>
              <button type="button" onClick={() => { const index = modules.findIndex((item) => item.id === active); setActive(modules[(index + 1) % modules.length]!.id); }} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground">Próximo módulo <ArrowRight className="size-4" /></button>
            </div>
          </section>
        </div>
        <section className="mt-8 rounded-2xl border border-border bg-card p-5 sm:p-7"><h2 className="text-lg font-black">Como aplicar o método em cada assunto</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{[["Planejar","Defina o tópico e a meta."],["Compreender","Estude e explique com suas palavras."],["Organizar","Registre relações e pontos-chave."],["Recuperar","Responda sem consultar."],["Consolidar","Revise e pratique questões."]].map(([title, body], index) => <div key={title} className="rounded-xl bg-muted/60 p-4"><span className="text-xs font-black text-primary">0{index + 1}</span><h3 className="mt-2 font-extrabold">{title}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{body}</p></div>)}</div></section>
      </div>
    </main>
    <Footer />
  </>;
}
