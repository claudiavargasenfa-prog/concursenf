import { BRAND, AUTHOR } from "./lp-content";

export { BRAND, AUTHOR };

export const WHATSAPP_URL = "https://wa.me/5500000000000";

export const TAGLINE =
  "Estudo de enfermagem descomplicado: conteúdo esquematizado, direto ao ponto e pronto para usar no plantão, na prova e no concurso.";

export const AUDIENCE = [
  {
    title: "Rotina apertada, pouco tempo para estudar",
    desc: "Você emenda plantão, faculdade e casa — e precisa de um material que renda em 20 ou 30 minutos por dia.",
  },
  {
    title: "Lê muito e fixa pouco",
    desc: "Apostilas quilométricas cansam. Aqui o conteúdo vem em esquemas, tabelas e mapas que o cérebro grava rápido.",
  },
  {
    title: "Insegurança na hora H",
    desc: "Cálculo de dose, protocolo de parada, legislação do SUS: tudo organizado para consulta rápida quando a dúvida aparece.",
  },
];

export const BENEFITS = [
  "Revisão completa das grandes áreas da enfermagem sem se perder em centenas de páginas",
  "Rotina de estudo mais leve, com tempo sobrando para a vida fora dos livros",
  "Sensação real de aprendizado: você lê, entende e consegue aplicar no mesmo dia",
];

export type Pack = {
  slug: string;
  title: string;
  summary: string;
  bullets: string[];
  audience: "Concurso" | "Prática" | "Graduação";
};

/** Temas dos pacotes — os mesmos que virarão módulos do aplicativo. */
export const PACKS: Pack[] = [
  {
    slug: "especificas-sus",
    title: "Pacote Completo: Específicas + SUS",
    summary: "A base para qualquer concurso de enfermagem, do técnico ao enfermeiro.",
    bullets: ["Todas as específicas da enfermagem", "SUS e legislação incluídos", "Serve para qualquer banca"],
    audience: "Concurso",
  },
  {
    slug: "atencao-basica",
    title: "Atenção Básica na Prática",
    summary: "Tudo que a UBS e a Estratégia Saúde da Família cobram de você.",
    bullets: ["PNAB e ESF esquematizadas", "Programas do Ministério da Saúde", "Atualizações por 1 ano"],
    audience: "Prática",
  },
  {
    slug: "fundamentos",
    title: "Fundamentos da Enfermagem",
    summary: "A porta de entrada da profissão, explicada de forma visual.",
    bullets: ["Sinais vitais e exame físico", "Higiene, conforto e segurança", "Registros de enfermagem"],
    audience: "Graduação",
  },
  {
    slug: "politicas-de-saude",
    title: "Políticas de Saúde Esquematizadas",
    summary: "Leis, portarias e políticas transformadas em mapas mentais.",
    bullets: ["Lei 8.080 e Lei 8.142", "Políticas nacionais em quadros", "Ideal para revisão de véspera"],
    audience: "Concurso",
  },
  {
    slug: "terapia-intensiva",
    title: "Terapia Intensiva do Zero",
    summary: "Para quem quer segurança dentro da UTI.",
    bullets: ["Ventilação mecânica sem mistério", "Drogas vasoativas e sedação", "Monitorização hemodinâmica"],
    audience: "Prática",
  },
  {
    slug: "saude-da-mulher",
    title: "Saúde da Mulher",
    summary: "Pré-natal, parto, puerpério e prevenção em um só lugar.",
    bullets: ["Rotina completa de pré-natal", "Cálculo de IG e DPP", "Rastreio de câncer de colo e mama"],
    audience: "Prática",
  },
  {
    slug: "sus-facilitado",
    title: "SUS Facilitado",
    summary: "A legislação do SUS destrinchada em mapas mentais.",
    bullets: ["Princípios e diretrizes", "Financiamento e controle social", "Questões comentadas por tema"],
    audience: "Concurso",
  },
  {
    slug: "legislacao-ebserh",
    title: "Legislação EBSERH",
    summary: "Conteúdo direcionado para o concurso dos hospitais universitários.",
    bullets: ["Estatuto e regimento", "Ética e código de conduta", "Foco no estilo da banca"],
    audience: "Concurso",
  },
  {
    slug: "centro-cirurgico",
    title: "Centro Cirúrgico e CME",
    summary: "Do preparo da sala à esterilização do material.",
    bullets: ["Períodos operatórios", "Instrumentação básica", "Processamento de produtos para saúde"],
    audience: "Prática",
  },
  {
    slug: "imunizacao",
    title: "Imunização e Sistema Imunológico",
    summary: "Calendário vacinal e imunologia sem decoreba.",
    bullets: ["Calendário nacional atualizado", "Conservação e rede de frio", "Eventos adversos pós-vacinais"],
    audience: "Prática",
  },
  {
    slug: "portugues",
    title: "Português para Provas de Saúde",
    summary: "A matéria que mais elimina candidato, resolvida em dois volumes.",
    bullets: ["Morfologia em mapas mentais", "Sintaxe e interpretação", "Questões comentadas"],
    audience: "Concurso",
  },
  {
    slug: "personalizado",
    title: "Monte o seu pacote",
    summary: "Escolha só os temas que você precisa e pague menos por material.",
    bullets: ["Catálogo completo por tema", "Desconto progressivo", "Atendimento pelo WhatsApp"],
    audience: "Concurso",
  },
];

export type Guide = { title: string; desc: string };

export const GUIDES: Guide[] = [
  { title: "Guia de Bolso da Enfermagem", desc: "Consulta rápida para levar no jaleco: valores, escalas e condutas." },
  { title: "Diluição de Injetáveis", desc: "Tabela prática das medicações mais usadas, com reconstituição e tempo de infusão." },
  { title: "Exames Laboratoriais e de Imagem", desc: "Valores de referência e o que cada alteração significa na prática." },
  { title: "Urgência e Emergência", desc: "Protocolos, algoritmos e escalas para agir com segurança em minutos." },
];

export const SITE_FAQ = [
  {
    q: "Os materiais servem para técnico e para enfermeiro?",
    a: "Sim. O conteúdo cobre as duas realidades: os temas são os mesmos cobrados em provas de nível técnico e superior, com profundidade suficiente para os dois.",
  },
  {
    q: "Como recebo o material depois da compra?",
    a: "O acesso chega por e-mail assim que o pagamento é confirmado. Em PIX e cartão a liberação é imediata.",
  },
  {
    q: "Posso imprimir os resumos?",
    a: "Pode. Todos os materiais são PDFs prontos para leitura na tela ou impressão.",
  },
  {
    q: "Vai ter aplicativo?",
    a: "Sim. Estamos construindo um app com os mesmos temas dos materiais, incluindo banco de questões e acompanhamento de estudo.",
  },
];
