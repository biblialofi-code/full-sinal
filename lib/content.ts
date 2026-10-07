// Conteúdo do jogo — só dados. Voz do Pingo: contida e direta, humor seco e curto.
// Sem diminutivos, sem "hehe". Nunca explicar a piada.
// TODO(Claro): validar textos de "Sabia que?" e "Na Claro" antes da feira (sem números ou fatos não confirmados).
import type { CareerId } from "./personas";
export type { CareerId } from "./personas";

export type Career = {
  id: CareerId;
  name: string;
  emoji: string;
  pitch: string;
  color: "green" | "sky" | "grape" | "sun" | "rose";
  intro: string; // fala do Pingo ao escolher a área
  profile: string; // "seu perfil tech" na tela final
  fiap: string[]; // cursos da FIAP ligados à área
  caseNote: string; // "Sabia que?" na tela final
};

export const CAREERS: Career[] = [
  {
    id: "rede",
    name: "Rede & 5G",
    emoji: "📡",
    pitch: "Mantém todo mundo conectado",
    color: "sky",
    intro: "Na rede, cada milissegundo conta e cada antena tem uma história. Escolha o caso.",
    profile: "Você pensa em escala: quando milhares de pessoas se conectam ao mesmo tempo, é você quem enxerga o caminho do sinal.",
    fiap: ["Engenharia de Computação", "Engenharia Mecatrônica", "Ciência da Computação"],
    caseNote: "Por trás de cada vídeo que carrega existe uma rede de antenas, cabos de fibra e centros de dados trabalhando em tempo real.",
  },
  {
    id: "ia",
    name: "Dados & IA",
    emoji: "🤖",
    pitch: "Ensina a máquina a ajudar gente",
    color: "grape",
    intro: "Em IA, a tecnologia só vale se a pessoa do outro lado sair melhor. Escolha quem você vai convencer.",
    profile: "Você transforma dado em decisão e lembra que, do outro lado do algoritmo, sempre tem uma pessoa.",
    fiap: ["Inteligência Artificial", "Agentes Inteligentes", "Gestão de IA", "Banco de Dados"],
    caseNote: "Em uma operadora, dados e IA ajudam a prever problemas na rede e a atender melhor, desde que alguém pergunte se o resultado é justo.",
  },
  {
    id: "cyber",
    name: "Cibersegurança",
    emoji: "🛡️",
    pitch: "Protege o que ninguém vê",
    color: "rose",
    intro: "Em segurança, o melhor dia é aquele em que nada acontece. Escolha o caso.",
    profile: "Você desconfia do óbvio e protege o que ninguém vê. Quando tudo funciona, ninguém sabe que foi você.",
    fiap: ["Segurança Cibernética", "Sistemas de Informação"],
    caseNote: "Segurança não é só tecnologia: boa parte dos ataques começa com uma mensagem convincente e um clique apressado.",
  },
  {
    id: "produto",
    name: "Produto Digital",
    emoji: "📱",
    pitch: "Faz o app que cabe no bolso",
    color: "green",
    intro: "Em produto, cada botão é uma decisão. Escolha quem você vai convencer.",
    profile: "Você constrói o que as pessoas usam todo dia e sabe que simples é a coisa mais difícil de fazer.",
    fiap: ["Engenharia de Software", "Análise e Desenvolvimento de Sistemas", "Sistemas para Internet", "Jogos Digitais"],
    caseNote: "Um app de operadora resolve em segundos o que antes exigia uma ligação: fatura, suporte, contratação. Quando funciona bem, ninguém percebe.",
  },
  {
    id: "marca",
    name: "Marketing & Criação",
    emoji: "🎨",
    pitch: "Faz a ideia parar o scroll",
    color: "sun",
    intro: "Em criação, a ideia só existe se alguém a aprovar. Escolha quem você vai convencer.",
    profile: "Você traduz tecnologia em algo que as pessoas sentem. Internet é invisível; a sua ideia não.",
    fiap: ["Marketing", "Design Gráfico", "Administração"],
    caseNote: "Vender conexão é vender o que ela permite: a chamada com a família, a aula ao vivo, a partida sem lag.",
  },
];

export function getCareer(id: CareerId) {
  return CAREERS.find((c) => c.id === id)!;
}

// ---------------- Pontuação ----------------
// Cada argumento vale 0 a 10. Convencer exige nota1 + nota2 >= DC da persona.
export const POINTS_PER_NOTE = 50; // 20 notas => 1000 "Mbps de talento"

export type Verdict = "saved" | "resist" | "damned";

export function verdictFor(total: number, dc: number): Verdict {
  if (total >= dc) return "saved";
  if (total >= dc - 3) return "resist";
  return "damned";
}

export const VERDICT_LABEL: Record<Verdict, string> = {
  saved: "Convencido",
  resist: "Em dúvida",
  damned: "Não convenceu",
};

// Barras de sinal finais refletem o veredito
export const VERDICT_BARS: Record<Verdict, number> = { saved: 4, resist: 2, damned: 1 };
export const MAX_BARS = 4;

// Caso mais difícil vale mais no ranking (senão todo mundo escolhe o fácil)
export const DIFF_MULT: Record<string, number> = { "FÁCIL": 1, "MÉDIO": 1.25, "DIFÍCIL": 1.5 };

export function scoreFor(s1: number, s2: number, difficulty: string) {
  return Math.round((s1 + s2) * POINTS_PER_NOTE * (DIFF_MULT[difficulty] ?? 1));
}

// ---------------- Nível de conexão ----------------
// O resultado final é medido em qualidade de conexão. "Claro" é o topo e só sai
// em caso médio/difícil, quase perfeito e rápido.
export const RANKS = [
  { min: 0, name: "Sem conexão", emoji: "🚫", say: "Sem sinal por enquanto. Acontece até com quem é bom; tente outro caso." },
  { min: 150, name: "Discada", emoji: "📠", say: "Conectou, mas com aquele barulhinho. Dá para melhorar." },
  { min: 350, name: "2G", emoji: "📶", say: "Já dá para mandar mensagem. Vídeo, ainda não." },
  { min: 550, name: "3G", emoji: "📶", say: "Sinal estável. Funciona, mas sem pressa." },
  { min: 750, name: "4G", emoji: "📶", say: "Rápido e confiável. É assim que se trabalha." },
  { min: 950, name: "5G", emoji: "⚡", say: "Latência baixa, resposta afiada. Pouca gente chega aqui." },
  { min: 1300, name: "Claro", emoji: "🔴", say: "Nível Claro. Procurei o que melhorar e não achei." },
];

// Nota de um argumento (0 a 10) em qualidade de sinal
export function noteTier(n: number) {
  if (n <= 1) return "Sem conexão";
  if (n <= 3) return "Discada";
  if (n === 4) return "2G";
  if (n <= 6) return "3G";
  if (n === 7) return "4G";
  if (n <= 9) return "5G";
  return "Claro";
}

export function rankFor(score: number) {
  let idx = 0;
  for (let i = 0; i < RANKS.length; i++) if (score >= RANKS[i].min) idx = i;
  return RANKS[idx];
}

// Fala final do Pingo por veredito
export function pingoVerdictLine(v: Verdict) {
  if (v === "saved") return "Você convenceu. Argumento claro, com base e na hora certa.";
  if (v === "resist") return "Quase. Abalou a persona, mas ainda não a convenceu. Um detalhe a mais teria virado o jogo.";
  return "Não foi dessa vez. Vale tentar outro caso, ou o mesmo com outro ângulo.";
}

// Falas durante o jogo
export const JUDGING_LINES = [
  "Medindo o sinal do seu argumento…",
  "Checando a base técnica…",
  "Conferindo a clareza…",
  "Argumento bom demora um pouco.",
  "Pesando cada ponto…",
];
export const REACT_OK = ["Boa.", "Isso aí.", "Direto ao ponto.", "Sinal forte."];
export const REACT_MID = ["Dá para melhorar.", "Chegou perto.", "Sinal oscilando."];
export const REACT_LOW = ["Não foi dessa vez.", "Sinal fraco.", "Faz parte."];

// ---------------- Narrativa ----------------
// Prólogo: um dia no time de tecnologia da Claro. Cada fala é uma tela (toque para avançar).
export const PROLOGUE = [
  { clock: "09:00", mood: "happy" as const, text: "Bom dia! Bem-vindo ao time de tecnologia da Claro. Eu sou o Pingo e cuido do sinal por aqui." },
  { clock: "09:02", mood: "wow" as const, text: "Por trás de cada vídeo, chamada e partida online tem rede, dados, segurança e muito código. Hoje você faz parte disso." },
  { clock: "09:05", mood: "idle" as const, text: "Seu trabalho: convencer quem precisa ser convencido. Cliente, colega, diretoria. Com argumento, não com volume de voz." },
  { clock: "09:06", mood: "happy" as const, text: "Eu avalio cada argumento de 0 a 10. Duas chances por caso. Escolha sua área." },
];

// Relógio da história em cada etapa
export const CLOCK = { career: "09:10", cases: "09:15", briefing: "10:30", duel: "10:32", verdict: "11:00", end: "18:00" };

// Critérios visíveis antes de escrever (iguais aos do Árbitro)
export const CRITERIA = [
  { label: "Pertinência", max: 3, hint: "respondeu ao que foi perguntado" },
  { label: "Base técnica", max: 4, hint: "conceito, prática ou evidência da área" },
  { label: "Clareza", max: 3, hint: "dá para entender e convence" },
];

// Começos de frase para destravar a escrita no celular
export const STARTERS_1 = ["O número mostra que", "Eu começaria por", "Na prática, eu faria", "O risco de fazer isso é", "Um teste simples seria"];
export const STARTERS_2 = ["Entendo a objeção, mas", "Um exemplo concreto:", "Para provar, eu mediria", "Se der errado, o plano B é"];

export const EPILOGUE: Record<Verdict, string> = {
  saved: "Fim do expediente. Caso resolvido, cliente satisfeito. No time de tecnologia da Claro, isso é um dia comum.",
  resist: "Fim do expediente. O caso ficou em aberto, mas a conversa avançou. Amanhã tem mais.",
  damned: "Fim do expediente. Nem todo dia fecha bem. O que importa é voltar amanhã com um argumento melhor.",
};

// ---------------- Velocidade ----------------
// A Claro é rápida: cada argumento enviado rápido ganha bônus no ranking.
// Só vale com nota >= 5, para não premiar resposta vazia. Não muda o veredito.
export const SPEED = { full: 40_000, zero: 150_000, max: 100, minNote: 5 };

export function speedBonus(ms: number, note: number) {
  if (note < SPEED.minNote) return 0;
  if (ms <= SPEED.full) return SPEED.max;
  if (ms >= SPEED.zero) return 0;
  return Math.round(SPEED.max * (1 - (ms - SPEED.full) / (SPEED.zero - SPEED.full)));
}

// Formato de cronômetro: 0:23.417
export function fmtTime(ms: number) {
  const t = Math.max(0, Math.floor(ms));
  const m = Math.floor(t / 60000);
  const s = Math.floor((t % 60000) / 1000);
  const mm = t % 1000;
  return `${m}:${String(s).padStart(2, "0")}.${String(mm).padStart(3, "0")}`;
}
