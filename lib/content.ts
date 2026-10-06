// Conteúdo do jogo — só dados. Adicionar desafio = adicionar objeto aqui.
// Voz do Pingo: contida e direta, humor seco e curto. Sem diminutivos, sem "hehe". Nunca explicar a piada.
// TODO(marketing): validar os cenários com a equipe ADDSALES e trocar `caseNote` por cases reais Claro.

export type ChoiceQ = {
  kind: "choice";
  stem: string;
  options: string[];
  answer: number;
  note: string;
};
export type BlocksQ = {
  kind: "blocks";
  stem: string;
  answer: string[];
  bank: string[];
  note: string;
};
export type SortQ = {
  kind: "sort";
  stem: string;
  buckets: [string, string];
  items: { text: string; bucket: 0 | 1 }[];
  note: string;
};
export type MatchQ = {
  kind: "match";
  stem: string;
  pairs: { left: string; right: string }[];
  note: string;
};
export type SpotQ = {
  kind: "spot";
  who: string; // quem "disse" / o que está sendo mostrado
  scenario: string;
  stem: string;
  options: string[];
  answer: number;
  note: string;
};
export type Question = ChoiceQ | BlocksQ | SortQ | MatchQ | SpotQ;

export type CareerId = "dados" | "midia" | "dev" | "criacao";

export type Career = {
  id: CareerId;
  name: string;
  emoji: string;
  pitch: string; // frase curta no card
  color: "green" | "sky" | "grape" | "sun";
  intro: string; // fala do Pingo ao começar
  questions: Question[];
  caseNote: string; // "sabia que" na tela final (ponte pro comercial)
};

export const CAREERS: Career[] = [
  {
    id: "dados",
    name: "Dados & BI",
    emoji: "📊",
    pitch: "Transforma número em decisão",
    color: "sky",
    intro:
      "Hoje você é analista de dados. A campanha da Claro Internet está no ar e todo mundo quer saber se deu certo. A resposta está nos números.",
    questions: [
      {
        kind: "choice",
        stem: "A campanha teve 1.000 cliques e 20 leads. Qual a taxa de conversão?",
        options: ["0,2%", "2%", "20%", "50%"],
        answer: 1,
        note: "20 de 1.000 dá 2%. Conta simples, mas derruba muita apresentação.",
      },
      {
        kind: "sort",
        stem: "Cada métrica é de atenção ou de resultado?",
        buckets: ["Atenção", "Resultado"],
        items: [
          { text: "Impressões", bucket: 0 },
          { text: "Alcance", bucket: 0 },
          { text: "Leads", bucket: 1 },
          { text: "Instalações agendadas", bucket: 1 },
        ],
        note: "Ser visto é uma coisa, virar cliente é outra. Cuidado com métrica de vaidade.",
      },
      {
        kind: "match",
        stem: "Ligue a sigla ao significado",
        pairs: [
          { left: "CTR", right: "Taxa de cliques" },
          { left: "CPC", right: "Custo por clique" },
          { left: "CPA", right: "Custo por aquisição" },
          { left: "ROAS", right: "Retorno sobre investimento em anúncio" },
        ],
        note: "Sigla é o idioma do mercado. Agora você já fala os dois idiomas.",
      },
      {
        kind: "spot",
        who: "Colega do time disse:",
        scenario: "“O anúncio B teve 5 cliques e 100% de CTR. É o melhor, vamos colocar toda a verba nele!”",
        stem: "Qual o problema?",
        options: [
          "Amostra pequena demais pra concluir qualquer coisa",
          "CTR de 100% é impossível de existir",
          "Anúncio B deveria ser chamado de A",
          "Verba só pode ser dividida em partes iguais",
        ],
        answer: 0,
        note: "Cinco cliques não provam nada. Esperar dado suficiente é a parte chata e certa.",
      },
      {
        kind: "choice",
        stem: "Os leads caíram só no domingo. Primeiro passo?",
        options: [
          "Comparar com os domingos das semanas anteriores",
          "Pausar a campanha inteira na hora",
          "Trocar toda a criatividade",
          "Culpar o algoritmo e ir pro almoço",
        ],
        answer: 0,
        note: "Antes de apagar incêndio, confira se é incêndio ou só domingo.",
      },
    ],
    caseNote:
      "Dado bom evita decisão no achismo: em campanhas de performance, olhar o custo por resultado de cada público costuma render mais do que olhar só o total.",
  },
  {
    id: "midia",
    name: "Mídia & Performance",
    emoji: "🎯",
    pitch: "Coloca o anúncio na frente de quem importa",
    color: "green",
    intro:
      "Hoje você é gestor de mídia. A Claro quer novos clientes de internet e o orçamento é limitado. Cada real conta.",
    questions: [
      {
        kind: "choice",
        stem: "Quem pesquisa “internet fibra perto de mim” tá com qual intenção?",
        options: [
          "Alta: já quer contratar",
          "Baixa: só passeando",
          "Nenhuma: foi sem querer",
          "Quer saber a receita de bolo",
        ],
        answer: 0,
        note: "Busca é intenção declarada. Quem digita isso já está perto de contratar.",
      },
      {
        kind: "blocks",
        stem: "Monte o caminho do lead, na ordem",
        answer: ["Anúncio", "Clique", "Landing page", "Formulário", "Lead"],
        bank: ["Formulário", "Anúncio", "Lead", "Landing page", "Clique", "Sorvete"],
        note: "Cada etapa perde um pouco de gente. O trabalho é perder menos.",
      },
      {
        kind: "sort",
        stem: "Boa prática ou furada?",
        buckets: ["Faz sentido", "Furada"],
        items: [
          { text: "Testar 2 versões do anúncio (A/B)", bucket: 0 },
          { text: "Mudar tudo ao mesmo tempo", bucket: 1 },
          { text: "Acompanhar o custo por lead", bucket: 0 },
          { text: "Decidir pelo achismo do chefe", bucket: 1 },
        ],
        note: "Mudar uma coisa por vez é o que diz por que algo funcionou.",
      },
      {
        kind: "choice",
        stem: "Campanha A traz lead por R$ 20. A B, com a mesma qualidade, por R$ 60. Onde pôr mais verba?",
        options: ["Na A", "Na B", "Dividir igualzinho", "Em nenhuma das duas"],
        answer: 0,
        note: "Mesma qualidade, custo menor. A conta é simples.",
      },
      {
        kind: "match",
        stem: "Qual mensagem da Claro Internet fala com cada público?",
        pairs: [
          { left: "Gamer", right: "Ping baixo, sem lag" },
          { left: "Home office", right: "Videochamada que não trava" },
          { left: "Família", right: "Várias telas ao mesmo tempo" },
          { left: "Estudante", right: "Baixar material sem esperar" },
        ],
        note: "Mesma internet, quatro conversas. Falar a língua do público é metade da mídia.",
      },
    ],
    caseNote:
      "Mídia boa não é gastar mais, é gastar melhor: segmentar por intenção e por público costuma reduzir o custo por lead sem perder qualidade.",
  },
  {
    id: "dev",
    name: "Dev & Produto",
    emoji: "💻",
    pitch: "Faz a coisa funcionar de verdade",
    color: "grape",
    intro:
      "Hoje você é dev. A landing page da Claro precisa ser rápida, segura e aguentar muita gente acessando ao mesmo tempo.",
    questions: [
      {
        kind: "choice",
        stem: "A landing page leva 8s pra abrir no 4G. O que mais ajuda?",
        options: [
          "Comprimir e reduzir o peso das imagens",
          "Aumentar o tamanho do texto",
          "Trocar a cor do botão",
          "Adicionar mais animações",
        ],
        answer: 0,
        note: "Peso da página é inimigo número 1 da velocidade. Imagem gigante é o clássico.",
      },
      {
        kind: "blocks",
        stem: "Monte o caminho de uma página abrindo",
        answer: ["Usuário clica", "Navegador pede", "Servidor responde", "Página aparece"],
        bank: ["Servidor responde", "Página aparece", "Usuário clica", "Navegador pede", "Café esfria"],
        note: "Cada etapa leva um tempo. Latência é a soma de todas elas.",
      },
      {
        kind: "sort",
        stem: "Front-end ou back-end?",
        buckets: ["Front-end", "Back-end"],
        items: [
          { text: "Layout responsivo", bucket: 0 },
          { text: "Animação do botão", bucket: 0 },
          { text: "Banco de dados", bucket: 1 },
          { text: "API que salva o cadastro", bucket: 1 },
        ],
        note: "Front é o que o usuário vê. Back é o que faz acontecer sem ninguém ver.",
      },
      {
        kind: "spot",
        who: "Formulário de lead:",
        scenario: "Para baixar um e-book grátis, o formulário pede nome, CPF, endereço completo e renda.",
        stem: "Qual o problema?",
        options: [
          "Pede dado demais para o que oferece (LGPD)",
          "Faltou pedir o signo",
          "Formulário não pode ter nome",
          "E-book não pode ser grátis",
        ],
        answer: 0,
        note: "Só pede o que precisa. Dado a mais é risco a mais, e o usuário percebe.",
      },
      {
        kind: "match",
        stem: "Termo e significado",
        pairs: [
          { left: "API", right: "Ponte entre sistemas" },
          { left: "Latência", right: "Tempo de resposta" },
          { left: "Cache", right: "Cópia guardada pra ser rápido" },
          { left: "Deploy", right: "Colocar no ar" },
        ],
        note: "Com quatro termos você já acompanha uma daily.",
      },
    ],
    caseNote:
      "Velocidade vende: página que carrega rápido perde menos gente no caminho. Por isso conexão boa e código leve andam juntos.",
  },
  {
    id: "criacao",
    name: "Criação & Conteúdo",
    emoji: "🎨",
    pitch: "Faz a ideia parar o scroll",
    color: "sun",
    intro:
      "Hoje você é criativo. A Claro Internet precisa de um anúncio que ninguém ignore. Você tem 3 segundos de atenção.",
    questions: [
      {
        kind: "choice",
        stem: "Qual o melhor título pra estudante?",
        options: [
          "Entrega antes do prazo: internet que não trava",
          "A melhor internet que existe no mundo todo",
          "Clique agora e veja a nossa oferta",
          "Conheça a nossa empresa de internet",
        ],
        answer: 0,
        note: "Título bom fala do problema da pessoa, não da empresa. Quem nunca ficou na reta final de um trabalho?",
      },
      {
        kind: "sort",
        stem: "Funciona em vídeo curto ou só enrola?",
        buckets: ["Funciona", "Só enrola"],
        items: [
          { text: "Começar pelo problema", bucket: 0 },
          { text: "Rosto humano falando direto", bucket: 0 },
          { text: "Logotipo por 5 segundos", bucket: 1 },
          { text: "Abrir com “Olá, somos uma empresa…”", bucket: 1 },
        ],
        note: "O scroll é implacável. Quem não prende nos primeiros segundos é ignorado.",
      },
      {
        kind: "blocks",
        stem: "Monte a chamada pra ação",
        answer: ["Veja", "se", "a", "fibra", "chega", "na", "sua", "casa"],
        bank: ["Veja", "se", "a", "fibra", "chega", "na", "sua", "casa", "talvez", "nunca"],
        note: "Verbo no começo, benefício claro, sem enrolação. Uma boa chamada cabe numa respiração.",
      },
      {
        kind: "spot",
        who: "Peça do anúncio:",
        scenario: "Texto cinza claro, tamanho minúsculo, sobre um fundo branco, com a oferta escrita ali no cantinho.",
        stem: "Qual o erro?",
        options: [
          "Ninguém consegue ler a oferta",
          "O fundo não pode ser branco",
          "Cinza é uma cor proibida",
          "Faltou um emoji de foguete",
        ],
        answer: 0,
        note: "Se precisa de lupa para ler, não é anúncio, é charada.",
      },
      {
        kind: "match",
        stem: "Formato e onde ele brilha",
        pairs: [
          { left: "Stories", right: "Vertical 9:16" },
          { left: "Feed quadrado", right: "Formato 1:1" },
          { left: "YouTube", right: "Horizontal 16:9" },
          { left: "Banner lateral", right: "300×250" },
        ],
        note: "Mesma ideia, tamanhos diferentes. Adaptar é parte do ofício.",
      },
    ],
    caseNote:
      "Criativo bom e dado bom andam juntos: testar variações de mensagem mostra qual ideia realmente fala com o público.",
  },
];

export function getCareer(id: CareerId) {
  return CAREERS.find((c) => c.id === id)!;
}

// ---------------- Pontuação ----------------
export const MAX_BARS = 4; // barras de sinal (a "vida" do jogo)
export const POINTS_RIGHT = 100;
export const SPEED_WINDOW_MS = 9000; // quanto mais rápido, mais bônus
export const SPEED_MAX = 50;
export const POINTS_PER_BAR = 25;

export function speedBonus(ms: number) {
  if (ms >= SPEED_WINDOW_MS) return 0;
  return Math.round(SPEED_MAX * (1 - ms / SPEED_WINDOW_MS));
}

// ---------------- Patentes (Professor) ----------------
export const RANKS = [
  { min: 0, name: "Estagiário", emoji: "🐣", say: "Todo mundo começa em algum lugar. O café ainda é por sua conta." },
  { min: 300, name: "Júnior", emoji: "🌱", say: "Já dá para confiar numa tarefa pequena, com revisão." },
  { min: 500, name: "Pleno", emoji: "🚀", say: "Bom resultado. Já pode errar sozinho sem avisar ninguém. É um elogio." },
  { min: 650, name: "Sênior", emoji: "🧠", say: "Resultado de quem já viu muita coisa. Pode sentar na cabeceira da mesa." },
  { min: 780, name: "Lenda", emoji: "👑", say: "Eu ia dar um conselho, mas acho que quem aprende aqui sou eu." },
];

export function rankFor(score: number) {
  let idx = 0;
  for (let i = 0; i < RANKS.length; i++) if (score >= RANKS[i].min) idx = i;
  return RANKS[idx];
}

// Feedback do Professor por desempenho (roteirizado, sem IA ao vivo)
export function professorLine(correct: number, total: number, bars: number) {
  if (correct === total && bars === MAX_BARS) return "Gabaritou com sinal cheio. Procurei algo para reclamar e não achei.";
  if (correct === total) return "Acertou tudo. Perdeu algumas barras de sinal no caminho, mas o resultado fala por si.";
  if (correct >= total - 1) return "Quase perfeito. Um escorregão só, desses que ensinam mais que o acerto.";
  if (correct >= Math.ceil(total / 2)) return "Foi bem. Há pontos a melhorar, mas o caminho é esse. Tente de novo.";
  return "Não foi dessa vez. Vale tentar outra carreira, talvez seja a sua.";
}

// Falas do Pingo durante o jogo (contidas, humor seco)
export const OK_LINES = ["Certo.", "É isso.", "Boa.", "Resposta correta.", "Sinal forte.", "Direto ao ponto.", "Isso aí."];
export const NO_LINES = ["Quase.", "Não foi dessa vez.", "Sinal oscilando.", "Resposta incorreta.", "Passou perto.", "Faz parte."];
export const BAR_LINES: Record<number, string> = {
  3: "Uma barra a menos. Ainda dá para completar a chamada.",
  2: "Sinal na metade. Foco.",
  1: "Uma barra só. Equilíbrio de quem fica no fundo da casa.",
  0: "Sem sinal. Mas o jogo continua, e os pontos também.",
};
export const COMBO_LINES: Record<number, string> = { 3: "Três seguidas: conexão estável.", 5: "Cinco seguidas: 5G puro." };
