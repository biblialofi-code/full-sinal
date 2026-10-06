// Conteúdo do jogo — só dados. Voz do Pingo: contida e direta, humor seco e curto.
// Sem diminutivos, sem "hehe". Nunca explicar a piada.
// TODO(marketing): validar os "Sabia que?" com a equipe ADDSALES e trocar por cases reais Claro.
import type { CareerId } from "./personas";
export type { CareerId } from "./personas";

export type Career = {
  id: CareerId;
  name: string;
  emoji: string;
  pitch: string;
  color: "green" | "sky" | "grape" | "sun";
  intro: string; // fala do Pingo ao escolher a carreira
  caseNote: string; // "Sabia que?" na tela final (ponte pro comercial)
};

export const CAREERS: Career[] = [
  {
    id: "dados",
    name: "Dados & BI",
    emoji: "📊",
    pitch: "Transforma número em decisão",
    color: "sky",
    intro: "Em dados, o desafio é convencer alguém com o que o número realmente diz. Escolha o caso.",
    caseNote:
      "Dado bom evita decisão no achismo: em campanhas de performance, olhar o custo por resultado de cada público costuma render mais do que olhar só o total.",
  },
  {
    id: "midia",
    name: "Mídia & Performance",
    emoji: "🎯",
    pitch: "Coloca o anúncio na frente de quem importa",
    color: "green",
    intro: "Em mídia, cada real precisa se justificar. Escolha quem você vai convencer.",
    caseNote:
      "Mídia boa não é gastar mais, é gastar melhor: segmentar por intenção e por público costuma reduzir o custo por lead sem perder qualidade.",
  },
  {
    id: "dev",
    name: "Dev & Produto",
    emoji: "💻",
    pitch: "Faz a coisa funcionar de verdade",
    color: "grape",
    intro: "Em tecnologia, quase toda decisão vira uma conversa com quem não escreve código. Escolha o caso.",
    caseNote:
      "Velocidade vende: página que carrega rápido perde menos gente no caminho. Por isso conexão boa e código leve andam juntos.",
  },
  {
    id: "criacao",
    name: "Criação & Conteúdo",
    emoji: "🎨",
    pitch: "Faz a ideia parar o scroll",
    color: "sun",
    intro: "Em criação, a ideia só existe se alguém a aprovar. Escolha quem você vai convencer.",
    caseNote:
      "Criativo bom e dado bom andam juntos: testar variações de mensagem mostra qual ideia realmente fala com o público.",
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

// ---------------- Patentes ----------------
export const RANKS = [
  { min: 0, name: "Estagiário", emoji: "🐣", say: "Todo mundo começa em algum lugar. O café ainda é por sua conta." },
  { min: 300, name: "Júnior", emoji: "🌱", say: "Já dá para confiar numa tarefa pequena, com revisão." },
  { min: 500, name: "Pleno", emoji: "🚀", say: "Bom resultado. Já pode errar sozinho sem avisar ninguém. É um elogio." },
  { min: 800, name: "Sênior", emoji: "🧠", say: "Resultado de quem já viu muita coisa. Pode sentar na cabeceira da mesa." },
  { min: 1100, name: "Lenda", emoji: "👑", say: "Eu ia dar um conselho, mas acho que quem aprende aqui sou eu." },
];

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
// Prólogo: o primeiro dia na ADDSALES. Cada fala é uma tela (toque para avançar).
export const PROLOGUE = [
  { clock: "09:00", mood: "happy" as const, text: "Segunda-feira, 9h. Bem-vindo à ADDSALES. Eu sou o Pingo e cuido do sinal por aqui." },
  { clock: "09:02", mood: "wow" as const, text: "A Claro Internet vai lançar uma campanha nova, e o time está no limite. Precisamos de reforço." },
  { clock: "09:05", mood: "idle" as const, text: "Seu trabalho hoje: convencer quem precisa ser convencido. Cliente, diretora, colega. Com argumento, não com volume de voz." },
  { clock: "09:06", mood: "happy" as const, text: "Eu avalio cada argumento de 0 a 10. Duas chances por caso. Escolha sua mesa." },
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
  saved: "Fim do expediente. Caso resolvido, cliente satisfeito. Na ADDSALES, isso é um dia comum.",
  resist: "Fim do expediente. O caso ficou em aberto, mas a conversa avançou. Amanhã tem mais.",
  damned: "Fim do expediente. Nem todo dia fecha bem. O que importa é voltar amanhã com um argumento melhor.",
};
