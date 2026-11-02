/** Nome da marca / projeto exibido no site. */
export const BRAND = "Academia da Enfermagem";

/** Nome do produto. */
export const PRODUCT = "Combo Aprovação";

/** Seus dados (autora do material). */
export const AUTHOR = {
  name: "Cláudia Vargas",
  role: "Idealizadora — Enfermeira",
  bio: [
    "Sou enfermeira e idealizadora deste projeto. Há anos ajudo estudantes e profissionais de enfermagem a estudarem de forma mais leve e objetiva.",
    "Reuni nesses materiais tudo o que mais cai nas provas, em resumos ilustrados e diretos ao ponto, para você fixar o conteúdo sem se perder em milhares de páginas.",
    "Aprovação não é sorte: é estratégia, constância e material certo nas mãos.",
  ],
};


/** No sales destination is active until the owner supplies a verified checkout. */
export const CHECKOUT_URL: string | null = null;

export const PAINS = [
  "Precisa conciliar os estudos com plantões, aulas e compromissos pessoais.",
  "Busca uma revisão organizada de enfermagem, SUS e português.",
  "Quer construir uma base sólida para provas de nível técnico e superior.",
];

export const CONTENT_GROUPS: { title: string; items: { name: string; topics: string[] }[] }[] = [
  {
    title: "Conhecimentos de enfermagem para a prova",
    items: [
      { name: "Registros de Enfermagem", topics: ["Termos", "Anotação e evolução de enfermagem", "Abreviações para registro"] },
      { name: "Anatomia", topics: ["Direções anatômicas, planos e eixos", "Regiões anatômicas frontal e posterior", "Regiões do abdômen"] },
      { name: "Anamnese", topics: ["Avaliação geral do paciente", "Etapas da anamnese"] },
      { name: "Sinais Vitais", topics: ["Frequência cardíaca", "Temperatura", "Pressão arterial", "Frequência respiratória", "Alterações no padrão respiratório", "Avaliação da dor"] },
      { name: "Exame Físico", topics: ["Técnicas propedêuticas", "Cardíaco, respiratório, abdominal e neurológico", "Avaliação pupilar", "Kernig e Brudzinski"] },
      { name: "Eletrocardiograma", topics: ["Tópicos mais cobrados em concursos"] },
      { name: "Diabetes e Glicemia Capilar", topics: ["Classificação do diabetes", "Glicemia capilar"] },
      { name: "Exames Laboratoriais", topics: ["Valores normais mais cobrados em concursos"] },
      { name: "Suporte Básico de Vida", topics: ["Protocolo de Manchester", "XABCDE do trauma", "Escala de Coma de Glasgow", "Ritmos chocáveis e não chocáveis"] },
      { name: "Suporte Avançado de Vida", topics: ["Condutas do SAV", "5H e 5T"] },
      { name: "Queimaduras", topics: ["Classificação das queimaduras", "Regra dos 9"] },
      { name: "Sondas, Drenos e Cateteres", topics: ["Sondagem nasogástrica e nasoenteral", "Nutrição parenteral", "Cateterismo vesical", "Drenos"] },
      { name: "Oxigenoterapia", topics: ["Dispositivos de oxigenoterapia", "Aspiração orotraqueal", "Oximetria de pulso"] },
      { name: "Feridas e Curativos", topics: ["Classificação das feridas", "Tipos de cicatrização, exsudato e tecidos", "Lesão por pressão (estágios)", "Escala de Braden", "Pé diabético", "Coberturas para feridas"] },
      { name: "Administração de Medicamentos", topics: ["Certos da administração", "Vias de administração", "Locais de punção e procedimento", "Avaliação da flebite", "Equivalências"] },
      { name: "Cálculo e Diluição de Medicamentos", topics: ["Cálculo de gotejamento", "Cálculo de insulina", "Diluição e infusão IV intermitente", "Tipos de insulina"] },
      { name: "Saúde da Mulher", topics: ["Trimestres gestacionais", "Exames no pré-natal", "Cálculo da IG e da DPP", "Ausculta de BCF e altura uterina", "Exame citopatológico"] },
      { name: "Saúde da Criança", topics: ["Classificação neonatal", "APGAR", "Reflexos do recém-nascido", "Sinais vitais em pediatria"] },
      { name: "Imunização", topics: ["Esquema vacinal completo do calendário nacional"] },
    ],
  },
  {
    title: "Língua portuguesa: compreensão e prática",
    items: [
      { name: "Mapas mentais de morfologia", topics: ["Conceitos fonéticos", "Divisão silábica", "Acentuação gráfica", "Ortografia", "Hífen", "Classes gramaticais", "Substantivo e adjetivo"] },
      { name: "Sintaxe e interpretação", topics: ["Concordância verbal e nominal", "Regência", "Crase", "Interpretação de texto"] },
    ],
  },
  {
    title: "SUS e organização da saúde pública",
    items: [
      { name: "SUS", topics: ["Princípios e diretrizes", "Lei 8.080 e Lei 8.142", "Financiamento e pactos"] },
      { name: "Atenção Básica", topics: ["PNAB", "Estratégia Saúde da Família", "Programas do Ministério da Saúde"] },
      { name: "Epidemiologia e Vigilância", topics: ["Indicadores de saúde", "Notificação compulsória", "Vigilância em saúde"] },
    ],
  },
];

export const FAQ = [
  { q: "Para quem é o projeto?", a: "Para estudantes, técnicos de enfermagem e enfermeiros que buscam organizar os estudos para concursos." },
  { q: "Quais áreas fazem parte da proposta?", a: "Enfermagem, SUS, políticas de saúde e língua portuguesa. Consulte os temas nesta página." },
  { q: "Já posso comprar o acesso?", a: "Ainda não. O aplicativo está em preparação e as condições de acesso serão apresentadas quando estiver pronto." },
];
