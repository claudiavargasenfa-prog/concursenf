/** Payment remains disabled until the owner supplies her own verified checkout. */
export const CHECKOUT_URL: string | null = null;

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
  contactEmail: "contato@academiadaenfermagem.com.br",
};


/** Segundos até o CTA principal aparecer. 0 = aparece imediatamente. */
export const CTA_DELAY_SECONDS = 0;

export const OFFER = {
  installments: "12x de",
  installmentValue: "R$30,72",
  cash: "R$297",
  discount: "73% de desconto do preço original. Você está economizando R$270,00!",
};

export const PAINS = [
  "Está cansada de estudar por horas e sentir que não consegue absorver nada do conteúdo estudado.",
  "Está procurando um método de estudos que se encaixe na sua rotina e que te permita aprender mais, estudando menos horas por dia.",
  "Quer um conteúdo de fácil entendimento, para não precisar reler a mesma página diversas vezes.",
];

export const TESTIMONIALS = [
  { name: "Ana Paula", role: "Aprovada — Técnica de Enfermagem, Prefeitura", text: "Estudei só 30 minutos por dia com os resumos e passei em 3º lugar. Os mapas mentais salvaram a minha revisão!" },
  { name: "Juliana M.", role: "Aprovada — Enfermeira, EBSERH", text: "Eu lia e não fixava nada. Com o material esquematizado, finalmente entendi farmacologia e cálculo de medicação." },
  { name: "Camila R.", role: "Aprovada — Enfermeira, Secretaria de Saúde", text: "O banco de questões comentadas foi o diferencial. Cheguei na prova reconhecendo o estilo da banca." },
  { name: "Bruna S.", role: "Aprovada — Técnica de Enfermagem, Hospital Estadual", text: "Trabalho em escala 12x36 e ainda assim consegui estudar. O plano de estudos por edital organizou tudo pra mim." },
  { name: "Larissa F.", role: "Aprovada — Enfermeira, Concurso Municipal", text: "As políticas de saúde esquematizadas valem por um curso inteiro. Recomendo de olhos fechados." },
  { name: "Patrícia L.", role: "Aprovada — Técnica de Enfermagem, UPA", text: "Comprei sem muita expectativa e em 4 meses estava aprovada. O suporte no WhatsApp fez toda a diferença." },
];

export const CONTENT_GROUPS: { title: string; items: { name: string; topics: string[] }[] }[] = [
  {
    title: "Específicas de Enfermagem",
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
    title: "Português para concursos",
    items: [
      { name: "Mapas mentais de morfologia", topics: ["Conceitos fonéticos", "Divisão silábica", "Acentuação gráfica", "Ortografia", "Hífen", "Classes gramaticais", "Substantivo e adjetivo"] },
      { name: "Sintaxe e interpretação", topics: ["Concordância verbal e nominal", "Regência", "Crase", "Interpretação de texto"] },
    ],
  },
  {
    title: "Políticas de Saúde esquematizadas",
    items: [
      { name: "SUS", topics: ["Princípios e diretrizes", "Lei 8.080 e Lei 8.142", "Financiamento e pactos"] },
      { name: "Atenção Básica", topics: ["PNAB", "Estratégia Saúde da Família", "Programas do Ministério da Saúde"] },
      { name: "Epidemiologia e Vigilância", topics: ["Indicadores de saúde", "Notificação compulsória", "Vigilância em saúde"] },
    ],
  },
];

/** Recursos planejados para o acesso anual completo do ConcursEnf. */
export const PLATFORM_FEATURES = [
  { title: "Banco de questões comentadas por banca", desc: "Questões organizadas por disciplina, assunto, cargo e perfil de cobrança, com comentários para compreender o raciocínio." },
  { title: "Estudo reverso com inteligência artificial", desc: "A partir das dificuldades identificadas, direciona a retomada do conteúdo e propõe materiais de apoio para estudar o que ainda precisa ser fortalecido." },
  { title: "Flashcards com repetição espaçada", desc: "Cartões de pergunta e resposta com revisões programadas para apoiar a recuperação ativa e a consolidação do conhecimento." },
  { title: "Simulados personalizados", desc: "Treinos organizados por banca, disciplina, assunto e objetivo de preparação." },
  { title: "Radar de desempenho", desc: "Indicadores de acertos, erros, evolução e assuntos que merecem mais atenção." },
  { title: "Plano de estudos conectado ao edital", desc: "Cronograma adaptado à prova e à disponibilidade do candidato, com acesso às questões, flashcards e revisões de cada tópico." },
];

export const PLATFORM_BONUSES = [
  { title: "Bônus 1 — Guia estratégico de leitura do edital", desc: "Material de apoio para localizar disciplinas, pesos, etapas, requisitos e prazos, transformando o edital em uma rota de preparação." },
  { title: "Bônus 2 — Caderno de revisão essencial de Enfermagem", desc: "Seleção organizada de pontos fundamentais para revisões rápidas de conteúdos específicos da profissão." },
  { title: "Bônus 3 — Guia de legislação e políticas públicas de saúde", desc: "Roteiro de consulta às principais normas e políticas cobradas em concursos, com indicação das fontes oficiais." },
  { title: "Bônus 4 — Checklist de preparação para a prova", desc: "Lista prática para acompanhar conteúdos estudados, revisões realizadas, simulados e providências antes do dia da avaliação." },
  { title: "Bônus 5 — Rota de revisão para a reta final", desc: "Modelo de organização dos últimos dias de preparação, priorizando retomada de pontos críticos e treino de questões." },
];

/** Oferta planejada; checkout permanece desativado até a conclusão da plataforma. */
export const PLATFORM_OFFER = {
  audience: "Técnico e Auxiliar de Enfermagem",
  installments: "12x de R$ 33,99",
  cash: "R$ 317,99 à vista",
  term: "Pacote anual completo — Técnico e Auxiliar de Enfermagem",
};

/** Bônus do Combo Aprovação em materiais, mantidos separados da oferta da plataforma. */
export const BONUSES = [
  { title: "Banco de questões por assunto", desc: "Questões organizadas para apoiar a prática e a revisão dos temas estudados." },
  { title: "Guias de revisão complementar", desc: "Materiais de consulta para retomar conceitos importantes durante a preparação." },
  { title: "Roteiro de leitura de editais", desc: "Orientações para identificar disciplinas e organizar prioridades de estudo." },
  { title: "Checklist de preparação", desc: "Uma lista de acompanhamento para organizar a rotina até a prova." },
];

export const FAQ = [
  { q: "Como receberei acesso aos resumos?", a: "O acesso à plataforma é enviado por e-mail automaticamente após a confirmação do pagamento. No PIX, cartão de crédito e PayPal a liberação é imediata; no boleto pode levar de 24 a 72 horas úteis." },
  { q: "Como posso baixar e imprimir os resumos?", a: "Os resumos são e-books em PDF. Você acessa a área de membros, faz o download e pode imprimir quando quiser." },
  { q: "Serve para quem ainda está na faculdade?", a: "Sim. Todos os pacotes abordam temáticas gerais da enfermagem e servem como material de estudo e revisão para a graduação e o curso técnico." },
  { q: "Serve para técnicos de enfermagem?", a: "Sim! Os resumos e mapas mentais abordam temáticas compatíveis com os dois níveis, cobradas tanto em provas para enfermeiro quanto para técnico." },
  { q: "Quais as formas de pagamento?", a: "PIX, boleto ou cartão de crédito, com parcelamento em até 12 vezes (sujeito a juros do cartão — você simula as parcelas no checkout)." },
  { q: "O material é atualizado?", a: "Sim. Em caso de novas atualizações na literatura ou legislação, os resumos são revisados e você recebe instruções por e-mail para baixar a nova versão." },
  { q: "Posso compartilhar o acesso à área de membros?", a: "Não. O acesso é pessoal e intransferível. Acessos suspeitos, simultâneos ou fora do padrão são monitorados e podem gerar bloqueio irreversível." },
  { q: "Posso solicitar o cancelamento da compra?", a: "Sim, dentro de 7 dias corridos após a compra, conforme o Código de Defesa do Consumidor. A devolução é integral desde que a solicitação ocorra antes de qualquer download. Pedidos devem ser feitos por e-mail ou WhatsApp." },
];
