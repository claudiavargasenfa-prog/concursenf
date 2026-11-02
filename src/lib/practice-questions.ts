export type QuestionDifficulty = "Básica" | "Intermediária" | "Avançada";

export type PracticeQuestion = {
  id: string;
  discipline: string;
  topic: string;
  difficulty: QuestionDifficulty;
  statement: string;
  options: { id: string; text: string }[];
  answer: string;
  explanation: string;
  reference: string;
};

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: "sus-001",
    discipline: "SUS e Saúde Pública",
    topic: "Princípios doutrinários",
    difficulty: "Básica",
    statement: "No SUS, qual princípio assegura que todas as pessoas tenham direito de acesso às ações e aos serviços de saúde, sem discriminação?",
    options: [
      { id: "A", text: "Universalidade" },
      { id: "B", text: "Regionalização" },
      { id: "C", text: "Hierarquização" },
      { id: "D", text: "Descentralização" },
    ],
    answer: "A",
    explanation: "A universalidade reconhece a saúde como direito de todos e dever do Estado, garantindo acesso às ações e aos serviços de saúde. Regionalização, hierarquização e descentralização são diretrizes organizativas do sistema.",
    reference: "Constituição Federal de 1988, art. 196; Lei nº 8.080/1990, art. 7º.",
  },
  {
    id: "sus-002",
    discipline: "SUS e Saúde Pública",
    topic: "Participação social",
    difficulty: "Intermediária",
    statement: "De acordo com a Lei nº 8.142/1990, quais instâncias colegiadas participam da gestão do SUS em cada esfera de governo?",
    options: [
      { id: "A", text: "Conselho de Saúde e Conferência de Saúde" },
      { id: "B", text: "Comissão de Ética e Conselho Tutelar" },
      { id: "C", text: "Comissão Intergestores e Ministério Público" },
      { id: "D", text: "Conferência de Assistência Social e Câmara Municipal" },
    ],
    answer: "A",
    explanation: "A Lei nº 8.142/1990 prevê, em cada esfera de governo, a Conferência de Saúde e o Conselho de Saúde como instâncias colegiadas. Elas possuem funções e periodicidades distintas.",
    reference: "Lei nº 8.142/1990, art. 1º.",
  },
  {
    id: "sus-003",
    discipline: "SUS e Saúde Pública",
    topic: "Organização do sistema",
    difficulty: "Intermediária",
    statement: "Segundo a Lei nº 8.080/1990, a organização dos serviços públicos de saúde deve obedecer, entre outras diretrizes, à:",
    options: [
      { id: "A", text: "Centralização político-administrativa na União" },
      { id: "B", text: "Descentralização, com direção única em cada esfera de governo" },
      { id: "C", text: "Separação obrigatória entre prevenção e assistência" },
      { id: "D", text: "Restrição do acesso aos serviços de maior complexidade" },
    ],
    answer: "B",
    explanation: "A descentralização, com direção única em cada esfera de governo, integra a organização político-administrativa do SUS. A lei também prevê integralidade da assistência e participação da comunidade.",
    reference: "Lei nº 8.080/1990, art. 7º, IX.",
  },
  {
    id: "fund-001",
    discipline: "Fundamentos de Enfermagem",
    topic: "Processo de Enfermagem",
    difficulty: "Básica",
    statement: "Na organização do Processo de Enfermagem, qual etapa reúne a obtenção de dados subjetivos e objetivos sobre a pessoa, família ou coletividade?",
    options: [
      { id: "A", text: "Diagnóstico de enfermagem" },
      { id: "B", text: "Planejamento de enfermagem" },
      { id: "C", text: "Avaliação de enfermagem" },
      { id: "D", text: "Avaliação de enfermagem" },
    ],
    answer: "D",
    explanation: "A avaliação de enfermagem compreende a coleta inicial e contínua de dados subjetivos e objetivos sobre a pessoa, família ou coletividade, subsidiando as demais etapas do Processo de Enfermagem.",
    reference: "Resolução Cofen nº 736/2024, que dispõe sobre a implementação do Processo de Enfermagem.",
  },
  {
    id: "seg-001",
    discipline: "Segurança do Paciente",
    topic: "Identificação do paciente",
    difficulty: "Básica",
    statement: "Na identificação segura do paciente, qual conduta é mais adequada antes da realização de um procedimento assistencial?",
    options: [
      { id: "A", text: "Confirmar a identidade utilizando pelo menos dois identificadores" },
      { id: "B", text: "Utilizar exclusivamente o número do leito" },
      { id: "C", text: "Perguntar apenas o primeiro nome, mesmo quando houver homônimos" },
      { id: "D", text: "Confirmar a identidade somente após o procedimento" },
    ],
    answer: "A",
    explanation: "A identificação deve utilizar pelo menos dois identificadores, conforme o protocolo de identificação do paciente. Número de leito ou quarto não é identificador seguro.",
    reference: "Ministério da Saúde; Anvisa; Fiocruz. Protocolo de Identificação do Paciente, Programa Nacional de Segurança do Paciente.",
  },
  {
    id: "sus-004",
    discipline: "SUS e Saúde Pública",
    topic: "Integralidade",
    difficulty: "Básica",
    statement: "No SUS, a integralidade da assistência é compreendida como:",
    options: [
      { id: "A", text: "Oferta exclusiva de procedimentos de alta complexidade" },
      { id: "B", text: "Articulação contínua de ações preventivas e curativas, individuais e coletivas, conforme as necessidades" },
      { id: "C", text: "Atendimento restrito às pessoas previamente cadastradas em hospitais" },
      { id: "D", text: "Substituição da atenção básica pela atenção especializada" },
    ],
    answer: "B",
    explanation: "A integralidade articula ações e serviços preventivos e curativos, individuais e coletivos, em todos os níveis de complexidade, conforme a necessidade de saúde.",
    reference: "Lei nº 8.080/1990, art. 7º, II.",
  },
  {
    id: "fund-002",
    discipline: "Fundamentos de Enfermagem",
    topic: "Registros de Enfermagem",
    difficulty: "Intermediária",
    statement: "Qual característica deve estar presente nos registros realizados pela equipe de enfermagem no prontuário?",
    options: [
      { id: "A", text: "Registro posterior baseado exclusivamente na memória ao final do plantão" },
      { id: "B", text: "Informações claras, objetivas, legíveis, completas e relacionadas aos cuidados prestados" },
      { id: "C", text: "Uso de opiniões pessoais sem identificação do profissional" },
      { id: "D", text: "Omissão de intercorrências quando resolvidas pela equipe" },
    ],
    answer: "B",
    explanation: "O registro deve documentar de forma clara, objetiva, legível e completa os dados relevantes, os cuidados realizados e as respostas observadas, com identificação profissional e observância das normas aplicáveis.",
    reference: "Resolução Cofen nº 736/2024; Código de Ética dos Profissionais de Enfermagem, Resolução Cofen nº 564/2017.",
  },
  {
    id: "seg-002",
    discipline: "Segurança do Paciente",
    topic: "Higienização das mãos",
    difficulty: "Básica",
    statement: "A higienização das mãos nos serviços de saúde tem como finalidade central:",
    options: [
      { id: "A", text: "Substituir todas as demais medidas de prevenção de infecções" },
      { id: "B", text: "Reduzir a transmissão de microrganismos e o risco de infecções relacionadas à assistência" },
      { id: "C", text: "Ser realizada apenas após contato com sangue visível" },
      { id: "D", text: "Dispensar o uso de luvas em qualquer procedimento" },
    ],
    answer: "B",
    explanation: "A higienização das mãos é uma das principais medidas para reduzir a transmissão de microrganismos e prevenir infecções relacionadas à assistência. Ela não substitui outras precauções e não elimina a necessidade de luvas quando indicadas.",
    reference: "Anvisa. Segurança do Paciente em Serviços de Saúde: Higienização das Mãos.",
  },
];

export const QUESTION_DISCIPLINES = [
  "Todas as disciplinas",
  ...Array.from(new Set(PRACTICE_QUESTIONS.map((question) => question.discipline))),
];
