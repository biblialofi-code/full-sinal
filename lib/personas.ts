// Personas do Tribunal ADDSALES: clientes e colegas fictícios com um problema real de cada carreira.
// Dados puros, usados no navegador e no servidor (/api/judge). Adicionar persona = adicionar objeto.
// TODO(marketing): validar cenários e tom com o time ADDSALES.

export type CareerId = "dados" | "midia" | "dev" | "criacao";
export type Difficulty = "FÁCIL" | "MÉDIO" | "DIFÍCIL";

export type Persona = {
  id: string;
  career: CareerId;
  name: string;
  archetype: string;
  emoji: string;
  color: string; // cor do avatar
  difficulty: Difficulty;
  dc: number; // soma mínima (nota1 + nota2) para convencer
  tagline: string;
  question: string; // o problema que a persona apresenta
  speech: string; // estilo de fala (usado no contra-argumento)
  hook: string; // ângulo da objeção no contra-argumento
  reply: string; // réplica de reserva (quando a IA está indisponível)
  context: string; // a cena: onde e como a conversa acontece
  stakes: string; // o que está em jogo
  react: { saved: string; resist: string; damned: string }; // reação final, na voz da persona
  keywords: string[]; // usado só na avaliação de reserva (sem IA)
};

export const PERSONAS: Persona[] = [
  // ---------------- DADOS & BI ----------------
  {
    id: "D1",
    career: "dados",
    name: "Seu Gilberto",
    archetype: "O Dono da Padaria",
    emoji: "🥖",
    color: "#f4a261",
    difficulty: "FÁCIL",
    dc: 9,
    tagline: "“Número eu só entendo quando é de troco.”",
    question:
      "Rodei um anúncio da Claro Fibra aqui no bairro: 800 cliques e só 8 cadastros. Tá tudo perdido? Me explica o que esse número está dizendo.",
    speech: "Fala simples, de comerciante do bairro, com comparações de padaria. Desconfia de planilha.",
    hook: "Quer saber se 8 em 800 é bom ou ruim e o que fazer na segunda-feira, sem jargão.",
    reply: "Hum. Isso eu entendo até aí. Mas na prática: o que eu faço na segunda-feira com esse número?",
    context: "Balcão da padaria, 7h da manhã. Ele te recebe com um café e um relatório impresso, todo amassado.",
    stakes: "Se ele achar que jogou dinheiro fora, cancela a campanha da Claro no bairro.",
    react: { saved: "Tá. Agora eu entendi o que esse número quer dizer. Pode continuar a campanha.", resist: "Faz sentido, mas ainda tô com o pé atrás. Me manda isso por escrito.", damned: "Olha, continuo achando que joguei dinheiro fora." },
    keywords: ["conversão", "1%", "taxa", "funil", "comparar", "benchmark", "landing", "origem", "público", "segment", "teste"],
  },
  {
    id: "D2",
    career: "dados",
    name: "Dra. Helena",
    archetype: "A Diretora Cética",
    emoji: "🧐",
    color: "#7a9cc6",
    difficulty: "MÉDIO",
    dc: 12,
    tagline: "“Me mostre o dado. E depois me mostre o dado do dado.”",
    question:
      "Meu time diz que o canal A trouxe mais leads, mas o canal B trouxe mais clientes que de fato fecharam contrato. Qual eu escalo e por quê?",
    speech: "Direta, seca, executiva. Frases curtas. Ironia fina.",
    hook: "Questiona se você olhou custo por aquisição e qualidade do lead, não só volume.",
    reply: "Direto: se eu só puder fazer uma mudança este mês, qual é, e como saberei que funcionou?",
    context: "Sala de reunião, 15 minutos na agenda dela. Ela já está olhando o relógio.",
    stakes: "A decisão dela define onde vai o orçamento do trimestre.",
    react: { saved: "Convincente. Escale o canal que você defendeu e me traga o resultado em 30 dias.", resist: "Argumento razoável. Quero ver os números antes de assinar.", damned: "Não me convenceu. Vamos manter como está." },
    keywords: ["cpa", "custo por aquisição", "qualidade", "receita", "roas", "ltv", "funil", "atribuição", "contrato", "fechamento", "volume"],
  },
  {
    id: "D3",
    career: "dados",
    name: "Marcos",
    archetype: "O Analista do Gráfico",
    emoji: "📉",
    color: "#8e7dbe",
    difficulty: "DIFÍCIL",
    dc: 15,
    tagline: "“O gráfico não mente. Quem mente é a legenda.”",
    question:
      "Os leads caíram 30% depois que lançamos a nova landing page. Logo, a landing é a culpada. Concorda?",
    speech: "Confiante demais, tom de quem já decidiu. Usa o gráfico como argumento final.",
    hook: "Cobra que você separe correlação de causa: sazonalidade, mudança de campanha, amostra, teste A/B.",
    reply: "Interessante. Mas o gráfico caiu junto com a landing. Como você descarta que foi coincidência?",
    context: "Ele compartilha a tela com um gráfico vermelho enorme e já marcou reunião para desligar a landing nova.",
    stakes: "Se ele estiver errado, o time joga fora uma página que talvez funcione.",
    react: { saved: "Tá bom. Antes de desligar a landing, vamos testar direito.", resist: "Pode ser coincidência, sim. Mas o gráfico continua me incomodando.", damned: "Continuo com o gráfico. A landing sai amanhã." },
    keywords: ["correlação", "causa", "sazonal", "teste a/b", "a/b", "amostra", "segment", "origem", "período", "campanha", "variável"],
  },

  // ---------------- MÍDIA & PERFORMANCE ----------------
  {
    id: "M1",
    career: "midia",
    name: "Tia Nilda",
    archetype: "A que Quer Aparecer em Tudo",
    emoji: "📣",
    color: "#e76f51",
    difficulty: "FÁCIL",
    dc: 9,
    tagline: "“Se não está em todo lugar, não existe.”",
    question:
      "Quero anúncio da Claro Internet na TV, no rádio, no Instagram e em outdoor, tudo com R$ 5 mil por mês. Dá?",
    speech: "Animada, exagerada, fala em superlativos e com ponto de exclamação.",
    hook: "Insiste que aparecer em mais lugares é sempre melhor, sem pensar em foco e orçamento.",
    reply: "Mas se eu deixar de aparecer em algum canal, não perco clientes? Me convença do contrário!",
    context: "Ela chegou com uma pasta de recortes de anúncios de TV, rádio e outdoor. Todos coloridos.",
    stakes: "Com R$ 5 mil espalhados em tudo, a campanha não aparece direito em lugar nenhum.",
    react: { saved: "Tá bom, tá bom! Um canal bem feito. Mas depois a gente conversa sobre o outdoor!", resist: "Entendi… mas eu ainda queria muito o outdoor!", damned: "Não, não! Eu quero aparecer em tudo!" },
    keywords: ["foco", "público", "canal", "objetivo", "orçamento", "teste", "meta", "prioridade", "segment", "mensurar", "resultado"],
  },
  {
    id: "M2",
    career: "midia",
    name: "Rafael",
    archetype: "O Gestor de Marca Apressado",
    emoji: "⏱️",
    color: "#2a9d8f",
    difficulty: "MÉDIO",
    dc: 12,
    tagline: "“Para ontem. E ainda está atrasado.”",
    question:
      "A campanha A traz lead por R$ 20 e a B por R$ 60. Vou cortar a A porque a B tem muito mais alcance. Estou certo?",
    speech: "Apressado, interrompe, fala como quem está entre duas reuniões.",
    hook: "Defende que alcance importa mais que custo, e pede um motivo concreto para mudar de ideia.",
    reply: "Alcance dá visibilidade e a diretoria gosta. Dê um motivo concreto para eu manter a A.",
    context: "Ele te chama no corredor, entre duas reuniões, com o celular na mão.",
    stakes: "Se ele cortar a campanha A, o custo por cliente da Claro triplica.",
    react: { saved: "Ok, mantém a A. Me manda o resumo em três linhas.", resist: "Faz sentido, mas preciso pensar. Depois a gente fala.", damned: "Não tenho tempo para isso. Corta a A." },
    keywords: ["custo", "cpa", "qualidade", "objetivo", "alcance", "lead", "verba", "escalar", "teste", "retorno", "meta"],
  },
  {
    id: "M3",
    career: "midia",
    name: "Camila",
    archetype: "A CFO Matemática",
    emoji: "🧮",
    color: "#c1121f",
    difficulty: "DIFÍCIL",
    dc: 15,
    tagline: "“Clique não paga conta.”",
    question:
      "Você quer mais verba. Como me prova que o anúncio gera venda de verdade, e não só clique?",
    speech: "Fria, precisa, números na ponta da língua. Não aceita adjetivo, só evidência.",
    hook: "Pede prova de impacto real: atribuição, grupo de controle, conversão até a venda.",
    reply: "Bonito. Agora me dê o número: como você prova que a venda aconteceu por causa do anúncio?",
    context: "Sala da diretoria financeira. Uma planilha aberta, nenhum sorriso.",
    stakes: "Sem prova de impacto, a verba de mídia do próximo trimestre é cortada pela metade.",
    react: { saved: "Isso é evidência. Aprovo a verba, com o teste que você propôs.", resist: "Bom começo. Ainda não é prova. Volte com o teste rodando.", damned: "Clique continua não pagando conta. Verba negada." },
    keywords: ["atribuição", "incremental", "controle", "conversão", "venda", "pixel", "janela", "roas", "teste", "receita", "medir"],
  },

  // ---------------- DEV & PRODUTO ----------------
  {
    id: "V1",
    career: "dev",
    name: "Seu Osvaldo",
    archetype: "O Dono do Site Antigo",
    emoji: "🐢",
    color: "#6d8b74",
    difficulty: "FÁCIL",
    dc: 9,
    tagline: "“Sempre funcionou assim.”",
    question:
      "Meu site demora uns 8 segundos para abrir no celular e meu sobrinho diz que é “coisa de dev”. Isso importa mesmo?",
    speech: "Calmo, teimoso, resistente a mudança. Repete “mas sempre foi assim”.",
    hook: "Duvida que 8 segundos façam diferença e pergunta o que se ganha em consertar.",
    reply: "Hum. Mas o site sempre abriu, uma hora ele abre. Quantos clientes eu perco de verdade por isso?",
    context: "Ele abre o site no celular para te mostrar. Vocês esperam. E esperam.",
    stakes: "Cada segundo de espera é um cliente que desiste antes de ver a oferta da Claro.",
    react: { saved: "Tá certo. Pode mexer no site. Mas sem mudar a foto da fachada.", resist: "Faz sentido… mas sempre funcionou assim, né?", damned: "Sempre funcionou assim. Vai continuar assim." },
    keywords: ["velocidade", "abandono", "conversão", "imagem", "peso", "cache", "cdn", "usuário", "mobile", "google", "compress"],
  },
  {
    id: "V2",
    career: "dev",
    name: "Bia",
    archetype: "A Product Manager Impaciente",
    emoji: "📋",
    color: "#e9c46a",
    difficulty: "MÉDIO",
    dc: 12,
    tagline: "“Entrega pra ontem, com qualidade.”",
    question:
      "Preciso do formulário de cadastro no ar amanhã. Pode pedir CPF, endereço e renda, assim já qualificamos o lead. Por que não?",
    speech: "Objetiva, acelerada, fala em prazos e métricas. Cobra decisão.",
    hook: "Defende pedir mais dados para qualificar, e pergunta o que se perde com formulário curto.",
    reply: "Entendi o risco, mas prazo é prazo. Que alternativa você entrega amanhã sem perder a qualificação?",
    context: "Mensagem no chat às 18h: “preciso disso no ar amanhã, me fala se dá”.",
    stakes: "Formulário errado derruba os cadastros e ainda cria risco com a LGPD.",
    react: { saved: "Fechado: formulário curto amanhã e qualificação depois. Bora.", resist: "Entendi o risco. Vou levar para o jurídico antes de decidir.", damned: "Prazo é prazo. Vai com todos os campos." },
    keywords: ["lgpd", "minimização", "consentimento", "conversão", "abandono", "campos", "dados", "finalidade", "progressivo", "risco", "privacidade"],
  },
  {
    id: "V3",
    career: "dev",
    name: "Tiago",
    archetype: "O Arquiteto Perfeccionista",
    emoji: "🏗️",
    color: "#5e60ce",
    difficulty: "DIFÍCIL",
    dc: 15,
    tagline: "“Funciona na minha máquina.”",
    question:
      "A campanha vai gerar um pico de 10 mil acessos em uma hora. O servidor atual aguenta? O que você faria antes de ir ao ar?",
    speech: "Técnico, detalhista, desconfia de qualquer resposta sem número.",
    hook: "Cobra plano concreto: teste de carga, cache, CDN, escala, monitoramento e plano B.",
    reply: "Plano bonito. Mas e se o pico for o dobro do previsto? Qual é o plano B?",
    context: "Ele desenha a arquitetura no quadro branco e circula o servidor com caneta vermelha.",
    stakes: "Se o site cair no pico, a campanha da Claro vira notícia pelo motivo errado.",
    react: { saved: "Plano sólido. Roda o teste de carga hoje e a gente vai ao ar.", resist: "Tem coisa boa aí, mas eu ainda não dormiria tranquilo.", damned: "Isso não aguenta o pico. Volta para a prancheta." },
    keywords: ["teste de carga", "cache", "cdn", "escala", "monitor", "fila", "banco", "latência", "degrad", "alerta", "estático"],
  },

  // ---------------- CRIAÇÃO & CONTEÚDO ----------------
  {
    id: "C1",
    career: "criacao",
    name: "Dona Marta",
    archetype: "A Cliente do Logo Gigante",
    emoji: "🔍",
    color: "#e63946",
    difficulty: "FÁCIL",
    dc: 9,
    tagline: "“Maior! Mais! Todas as ofertas!”",
    question:
      "Quero o logo da Claro bem grande e todas as ofertas escritas no anúncio. Por que não pode?",
    speech: "Enfática, repete pedidos, fala como quem já decidiu o layout.",
    hook: "Acha que mais informação vende mais e pergunta o que se perde com menos texto.",
    reply: "Mas o cliente precisa saber de tudo! Se eu tiro informação, como ele fica sabendo das ofertas?",
    context: "Ela trouxe o anúncio impresso, com o logo ocupando metade da folha e doze ofertas embaixo.",
    stakes: "Anúncio com tudo vira anúncio sem nada: ninguém lê e ninguém clica.",
    react: { saved: "Hum… menos é mais, então. Pode fazer do seu jeito.", resist: "Faz sentido, mas pelo menos aumenta um pouquinho o logo.", damned: "Não! Maior! Todas as ofertas!" },
    keywords: ["foco", "uma mensagem", "hierarquia", "legib", "benefício", "atenção", "cta", "simples", "segundos", "contraste", "teste"],
  },
  {
    id: "C2",
    career: "criacao",
    name: "Léo",
    archetype: "O Diretor de Estilo",
    emoji: "🕶️",
    color: "#9d4edd",
    difficulty: "MÉDIO",
    dc: 12,
    tagline: "“Está lindo. O problema é o público.”",
    question:
      "Meu anúncio ficou lindo, mas ninguém clica. Deve ser culpa do algoritmo, né?",
    speech: "Artístico, vaidoso, usa palavras como “conceito” e “estética”.",
    hook: "Culpa o algoritmo e defende que o criativo está perfeito. Pede evidência do contrário.",
    reply: "Pode ser. Mas o conceito está perfeito. O que exatamente você mudaria sem estragar a ideia?",
    context: "Ele mostra o anúncio em tela cheia, ajusta os óculos e espera os elogios.",
    stakes: "Sem diagnóstico, a próxima peça vai ter o mesmo problema, só que mais bonita.",
    react: { saved: "Tá. Vamos testar outra abertura. Mas a paleta de cores fica.", resist: "Pode ter razão. Mas o algoritmo também não ajuda, né?", damned: "O conceito está perfeito. O público é que não entendeu." },
    keywords: ["gancho", "benefício", "cta", "público", "teste", "variação", "formato", "mensagem", "ctr", "primeiros segundos", "dados"],
  },
  {
    id: "C3",
    career: "criacao",
    name: "Valentina",
    archetype: "A Publicitária Premiada",
    emoji: "🏆",
    color: "#f72585",
    difficulty: "DIFÍCIL",
    dc: 15,
    tagline: "“Já ganhei Leão por menos.”",
    question:
      "Como você faz um anúncio de internet, algo invisível, ser memorável em 3 segundos sem cair no clichê da velocidade?",
    speech: "Elegante, afiada, desdenha de clichê e adora um bom insight.",
    hook: "Rejeita o óbvio e exige um insight humano concreto, não um slogan.",
    reply: "Correto, mas isso qualquer agência diria. Qual é o seu insight, a cena que ninguém usou?",
    context: "Café, notebook cheio de adesivos de festival e o olhar de quem já ouviu todas as ideias.",
    stakes: "A Claro quer uma campanha que as pessoas lembrem, não mais um anúncio de velocidade.",
    react: { saved: "Isso eu nunca vi. Pode desenvolver.", resist: "Tem algo aí. Ainda está cru, mas tem algo.", damned: "Já vi isso em três campanhas este ano." },
    keywords: ["insight", "emoção", "situação", "videochamada", "história", "demonstr", "humano", "memor", "cena", "problema", "marca"],
  },
];

export function getPersona(id: string) {
  return PERSONAS.find((p) => p.id === id) ?? null;
}

export function personasOf(career: CareerId) {
  return PERSONAS.filter((p) => p.career === career);
}

// Base de conhecimento por carreira (vai no prompt do Árbitro)
export const CAREER_BASE: Record<CareerId, string> = {
  dados: `ÁREA: Dados & BI aplicados a campanhas digitais.
• Taxa de conversão = conversões ÷ cliques. Comparar com histórico/benchmark do canal, não com "achismo".
• Métricas de atenção (impressões, alcance) x resultado (leads, vendas). Evitar métricas de vaidade.
• CPA, CPC, CTR, ROAS, LTV. Qualidade do lead importa tanto quanto volume.
• Correlação não é causa: considerar sazonalidade, mudanças simultâneas, tamanho de amostra, segmentação e teste A/B.`,
  midia: `ÁREA: Mídia & Performance (compra de mídia digital).
• Escolher canal pelo objetivo e pela intenção do público (busca = intenção alta; social = descoberta).
• Otimizar por custo por resultado (CPA) respeitando qualidade; alcance não substitui conversão.
• Orçamento limitado pede foco, teste e escala gradual do que funciona.
• Provar impacto: atribuição, grupos de controle/incrementalidade, conversões até a venda.`,
  dev: `ÁREA: Desenvolvimento e Produto web.
• Velocidade: peso de imagens, cache, CDN, código enxuto; páginas lentas perdem usuários e conversão.
• LGPD: minimização de dados, finalidade, consentimento; formulário curto converte mais.
• Escala: teste de carga, cache, CDN, escalabilidade horizontal, monitoramento e plano de contingência.
• Front-end x back-end, APIs, latência.`,
  criacao: `ÁREA: Criação e Conteúdo para anúncios.
• Uma mensagem por peça, hierarquia visual, legibilidade, contraste, CTA claro.
• Gancho nos primeiros 3 segundos; começar pelo problema/benefício do público, não pelo logo.
• Testar variações; criativo bonito que não converte precisa de diagnóstico (público, gancho, CTA, formato).
• Insight humano e situação real (ex.: videochamada que trava) vencem slogan genérico de "velocidade".`,
};
