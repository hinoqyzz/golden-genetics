export const navItems = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre nós" },
  { href: "/servicos", label: "Nossos serviços" },
  { href: "/simulador", label: "Simulação genética" },
  { href: "/consultas", label: "Consultas" },
] as const;

export const consultServices = [
  {
    id: "orientacao",
    title: "Orientação em genética humana",
    duration: "40 min",
    chartLabel: "Orientação",
    description:
      "Uma conversa sobre DNA, genes e cromossomos. Não há coleta de material biológico nem leitura de exame.",
  },
  {
    id: "hereditariedade",
    title: "Hereditariedade e características familiares",
    duration: "35 min",
    chartLabel: "Hereditariedade",
    description:
      "Como a informação genética passa entre gerações e por que irmãos podem herdar combinações diferentes.",
  },
  {
    id: "edicao",
    title: "Introdução à edição genética",
    duration: "45 min",
    chartLabel: "Edição",
    description:
      "O funcionamento geral do CRISPR-Cas9, com aplicações, limitações, riscos e o que a lei não permite.",
  },
  {
    id: "reproducao",
    title: "Consulta sobre genética e reprodução",
    duration: "40 min",
    chartLabel: "Reprodução",
    description:
      "Testes, seleção embrionária e o debate sobre bebês sob medida, em linguagem de divulgação científica.",
  },
] as const;

export type ConsultService = (typeof consultServices)[number];

export function getService(id: string) {
  return consultServices.find((service) => service.id === id);
}

export const scienceTopics = [
  {
    href: "/servicos#genetica-humana",
    title: "Genética humana",
    description:
      "DNA, genes e cromossomos explicados sem transformar uma característica complexa em um único interruptor.",
    icon: "dna" as const,
  },
  {
    href: "/servicos#hereditariedade",
    title: "Hereditariedade",
    description:
      "Como a informação passa de uma geração à outra, e por que um quadro de Punnett calcula probabilidades.",
    icon: "share" as const,
  },
  {
    href: "/servicos#edicao",
    title: "Edição genética",
    description:
      "O que o CRISPR-Cas9 faz em linhas gerais, onde a pesquisa chegou e quais limites a ética e a lei impõem.",
    icon: "flask" as const,
  },
  {
    href: "/servicos#aconselhamento",
    title: "Aconselhamento genético",
    description:
      "Uma conversa para entender chances e incertezas. Na feira, ela é demonstrativa e não é uma consulta médica.",
    icon: "messages" as const,
  },
];

export const visitSteps = [
  {
    number: "01",
    title: "Conheça nosso laboratório.",
    text: "Veja o que a Golden Genetics é e o que ela não é: um laboratório fictício para aprender genética na feira.",
    href: "/sobre",
  },
  {
    number: "02",
    title: "Agende uma consulta demonstrativa.",
    text: "Escolha um tema, um horário e deixe um nome ou apelido. O registro fica somente neste navegador.",
    href: "/consultas",
  },
  {
    number: "03",
    title: "Explore uma simulação genética educativa.",
    text: "Monte cruzamentos de um gene, leia o quadro de Punnett e compare genótipo com fenótipo.",
    href: "/simulador",
  },
];

export const team = [
  "Adryan Miguel",
  "Ana Júlia Rosa",
  "Gabriel Faria",
  "Isaque Elias",
  "João Pedro Bonomo",
  "Júlia Souza",
  "Maria Eduarda Lopes",
  "Maria Eduarda Melo",
  "Nemir Junior",
];

export const objectives = [
  {
    title: "Demonstrar conceitos de genética.",
    text: "DNA, genes, cromossomos e hereditariedade em linguagem que uma visita de feira consegue acompanhar.",
  },
  {
    title: "Discutir o avanço das biotecnologias.",
    text: "Mostrar o que ferramentas como o CRISPR-Cas9 tornaram possível na pesquisa, sem transformar isso em promessa clínica.",
  },
  {
    title: "Promover o pensamento científico.",
    text: "Separar modelo, evidência e extrapolação. Um cálculo correto para ervilhas não vira previsão para uma pessoa.",
  },
  {
    title: "Debater os limites éticos dos bebês sob medida.",
    text: "Distinguir herança natural, seleção embrionária e edição genética, e dizer com clareza o que não está estabelecido.",
  },
];

export const serviceSections = [
  {
    id: "genetica-humana",
    kicker: "Análise genética educativa",
    title: "Fundamentos do DNA, dos genes e dos cromossomos",
    paragraphs: [
      "O DNA é a molécula que guarda informação hereditária. Sua forma de dupla hélice lembra uma escada torcida. Os degraus são pares de bases: adenina com timina, citosina com guanina. A ordem dessas letras é uma forma de escrever instruções químicas, não um texto que descreva sozinho quem uma pessoa será.",
      "Um gene é um trecho de DNA com informação para um produto, muitas vezes uma proteína, ou para regular quando outros trechos funcionam. Dizer que existe “o gene de” uma característica complexa costuma ser um atalho falso. Vários genes, e também o ambiente, participam de traços como altura, aprendizado e aparência.",
      "O DNA fica empacotado em cromossomos. A espécie humana tem, em geral, 46 cromossomos, organizados em 23 pares. Um conjunto vem do óvulo e o outro, do espermatozoide. O genoma é esse conjunto de material genético. Há cerca de 20 mil genes que codificam proteínas, além de uma grande parte de DNA com função reguladora.",
      "A “análise genética” desta feira é uma explicação. A Golden Genetics não coleta saliva, sangue, arquivo de DNA nem resultado de exame.",
    ],
  },
  {
    id: "hereditariedade",
    kicker: "Hereditariedade",
    title: "Como a informação passa entre gerações",
    paragraphs: [
      "Na formação dos gametas, os pares de cromossomos se separam. Cada óvulo e cada espermatozoide leva um conjunto. Quando se encontram, o novo genoma é uma combinação, não uma cópia de um dos progenitores. Por isso irmãos podem ser parecidos em alguns traços e diferentes em outros.",
      "O modelo de um gene com dois alelos é uma porta de entrada. Genótipo é o par de alelos presente. Fenótipo é a característica observável. O fenótipo também depende do ambiente: nutrição, luz, cuidado e acaso entram em muitas contas.",
      "Dominante não significa mais comum, melhor ou mais forte. No modelo de dominância completa, significa que uma cópia do alelo já produz o fenótipo associado. O alelo recessivo continua no genótipo e pode aparecer na geração seguinte.",
      "O quadro de Punnett organiza as combinações possíveis e mostra probabilidades. Ele não promete que, a cada quatro filhos de um casal Aa, um terá o genótipo aa. Cada fecundação é um evento. Muitas características humanas nem cabem nesse quadro, porque dependem de vários genes.",
    ],
  },
  {
    id: "edicao",
    kicker: "Edição genética",
    title: "CRISPR-Cas9: a ideia geral, os usos e os limites",
    paragraphs: [
      "O CRISPR-Cas9 é uma ferramenta de laboratório inspirada em um sistema de defesa encontrado em bactérias. Em linhas gerais, uma molécula-guia de RNA reconhece uma sequência de DNA e a proteína Cas9 corta esse ponto. A célula tenta reparar o corte. Nesse reparo, um gene pode deixar de funcionar ou, em alguns experimentos, uma nova sequência pode ser incorporada.",
      "A ferramenta é usada em pesquisa, em melhoramento de plantas e, em alguns países, em terapias que editam células somáticas — células do corpo que não são óvulos nem espermatozoides. Um exemplo conhecido é o tratamento de certas formas de anemia falciforme, em que células do sangue da própria pessoa são editadas. Isso não desenha um bebê e não é um serviço deste laboratório fictício.",
      "Há limites técnicos importantes. O corte pode ocorrer fora do alvo desejado. Nem todas as células de um tecido são editadas do mesmo jeito. Levar a ferramenta até a célula certa ainda é difícil, e os efeitos de longo prazo precisam de acompanhamento. Um resultado de laboratório não é, por si só, um tratamento seguro.",
      "A edição da linhagem germinativa — óvulos, espermatozoides ou embriões — seria herdada pelas gerações seguintes, que não podem consentir. Em 2018, o anúncio de bebês com genoma editado foi condenado pela comunidade científica. Não é uma prática clínica aceita. No Brasil, a Lei nº 11.105/2005 proíbe engenharia genética em célula germinal humana, zigoto humano e embrião humano, e também proíbe a clonagem humana.",
    ],
  },
  {
    id: "reprodutiva",
    kicker: "Genética reprodutiva",
    title: "Testes, seleção embrionária e o que não dá para escolher",
    paragraphs: [
      "Um teste genético pode procurar variantes associadas a uma condição específica. Ele não lê o futuro inteiro de uma pessoa, nem mede inteligência, talento ou caráter. O resultado precisa ser interpretado junto com a história familiar e com os limites do próprio teste.",
      "No contexto da fertilização in vitro, o teste genético pré-implantacional pode analisar embriões quanto ao número de cromossomos ou a variantes ligadas a doenças monogênicas graves já conhecidas na família. Isso é seleção entre embriões já formados. É diferente de editar o DNA e diferente de encomendar uma aparência.",
      "Escolher com precisão características complexas, como inteligência, altura ou rosto, não é uma capacidade clínica estabelecida. Essas características dependem de muitos genes, de ambiente e de acaso. Escores usados em pesquisa descrevem tendências estatísticas em populações. Eles não são um catálogo para projetar uma criança.",
    ],
  },
  {
    id: "aconselhamento",
    kicker: "Aconselhamento genético",
    title: "Entender probabilidades sem transformar a conversa em prescrição",
    paragraphs: [
      "O aconselhamento genético ajuda uma pessoa ou uma família a compreender o que um teste pode e o que não pode dizer. O profissional explica chances, incertezas e opções. Não escolhe um filho no lugar da família e não monta um bebê sob medida.",
      "Na Golden Genetics, a “consulta” é uma demonstração de feira. Ela não avalia saúde, não pede histórico médico e não substitui um serviço de aconselhamento de verdade. Se a sua família tiver uma pergunta clínica, o caminho é um serviço de saúde, fora deste site.",
    ],
  },
  {
    id: "bioetica",
    kicker: "Bioética",
    title: "Limites científicos, lei, acesso e responsabilidade",
    paragraphs: [
      "O primeiro limite é científico. Quando muitos genes e o ambiente participam de um traço, não existe um botão confiável para ligá-lo ou desligá-lo em um embrião. Tratar uma estimativa fraca como se fosse um projeto de pessoa é um erro de ciência, não só de ética.",
      "O segundo limite é legal. A Lei de Biossegurança, nº 11.105/2005, proíbe no Brasil a engenharia genética em célula germinal humana, zigoto e embrião humano, além da clonagem humana. Comitês internacionais, entre eles um comitê da Organização Mundial da Saúde, também recomendam não usar edição de embriões para nascimento enquanto não houver segurança, governança e consenso.",
      "O terceiro limite é de acesso. Fertilização in vitro e testes genéticos custam caro e não estão disponíveis do mesmo modo para todas as famílias. Uma tecnologia restrita a quem pode pagar pode aprofundar desigualdades. Preferências por aparência ou desempenho também podem reforçar preconceito contra corpos e mentes que fogem de um padrão.",
      "A responsabilidade de quem divulga ciência é dizer o que se sabe, o que ainda é incerto e o que não é permitido. A Golden Genetics foi feita para essa conversa. Ela não oferece seleção de embriões, edição genética nem qualquer atendimento médico.",
    ],
  },
];
