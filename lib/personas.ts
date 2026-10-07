// Personas do O Futuro é Claro: clientes e colegas fictícios do time de tecnologia da Claro.
// Dados puros, usados no navegador e no servidor (/api/judge). Adicionar persona = adicionar objeto.
// Situações inspiradas no dia a dia de uma operadora; nenhum número ou fato sobre a Claro é afirmado.
// TODO(Claro): validar cenários e tom antes da feira.

export type CareerId = "rede" | "ia" | "cyber" | "produto" | "marca";
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
  // ---------------- REDE & 5G ----------------
  {
    id: "R1",
    career: "rede",
    name: "Duda",
    archetype: "A Streamer do Ping Alto",
    emoji: "🎮",
    color: "#9d4edd",
    difficulty: "FÁCIL",
    dc: 9,
    tagline: "“Lag não, por favor. Ao vivo não.”",
    question: "Minha internet é de 500 mega e mesmo assim meu jogo online trava. Se a velocidade é alta, por que o ping está ruim?",
    speech: "Fala rápido, com gírias de gamer, empolgada e um pouco irritada.",
    hook: "Confunde velocidade com latência e quer uma explicação que dê para repetir para o chat.",
    reply: "Mas eu pago por 500 mega! Se não é velocidade, então o que é? Explica de um jeito que eu consiga falar pro chat.",
    context: "Live no ar, duas mil pessoas assistindo, e o personagem dela teleportando pela tela.",
    stakes: "Se ela culpar a internet na live sem entender o problema, a reclamação viraliza.",
    react: {
      saved: "Ah, então é latência! Vou ligar no cabo e explicar pro chat. Valeu!",
      resist: "Entendi metade. A outra metade eu pesquiso depois da live.",
      damned: "Não entendi nada. Vou reclamar no chat mesmo.",
    },
    keywords: ["latência", "ping", "velocidade", "banda", "wi-fi", "cabo", "roteador", "servidor", "distância", "interferência", "rede"],
  },
  {
    id: "R2",
    career: "rede",
    name: "Seu Paulo",
    archetype: "O Organizador do Show",
    emoji: "🎤",
    color: "#f4a261",
    difficulty: "MÉDIO",
    dc: 12,
    tagline: "“Vai ter gente até no teto.”",
    question: "Vou fazer um show para 50 mil pessoas e todo mundo vai querer postar vídeo ao mesmo tempo. Como garantir que a rede aguente?",
    speech: "Animado, fala grande, pensa em público e espetáculo.",
    hook: "Acha que basta “aumentar o sinal” e não entende por que exige planejamento.",
    reply: "Tá, mas não dá só para aumentar o sinal? Por que é tão complicado?",
    context: "Estádio vazio, três semanas antes do show. Ele aponta para a arquibancada como quem já ouve a plateia.",
    stakes: "Se a rede cair no refrão, o show vira assunto pelo motivo errado.",
    react: {
      saved: "Agora entendi o tamanho da operação. Pode montar o plano.",
      resist: "Faz sentido, mas ainda tenho medo do refrão.",
      damned: "Parece que vai cair tudo. Vou pedir para ninguém postar.",
    },
    keywords: ["capacidade", "antena", "cobertura", "5g", "densidade", "planejamento", "tráfego", "pico", "monitor", "célula", "reforço"],
  },
  {
    id: "R3",
    career: "rede",
    name: "Eng. Raquel",
    archetype: "A Engenheira Cética",
    emoji: "📡",
    color: "#2a9d8f",
    difficulty: "DIFÍCIL",
    dc: 15,
    tagline: "“Menos slide, mais engenharia.”",
    question: "Todo mundo diz que o 5G vai mudar tudo. Me convença: para que ele serve de verdade, além de baixar vídeo mais rápido?",
    speech: "Técnica, seca, desconfiada de palavras da moda.",
    hook: "Quer casos concretos: latência baixa, muitos dispositivos conectados, aplicações em tempo real.",
    reply: "Isso é slide de palestra. Me dá um caso real em que a latência baixa muda o resultado.",
    context: "Sala técnica, telas com mapas de cobertura. Ela já ouviu muito marketing sobre 5G e pouca engenharia.",
    stakes: "Se o time não souber explicar o valor do 5G, ele vira só um número na propaganda.",
    react: {
      saved: "Bom. Isso é engenharia, não propaganda.",
      resist: "Tem fundamento, mas ainda falta o caso concreto.",
      damned: "Continua parecendo só vídeo mais rápido.",
    },
    keywords: ["latência", "iot", "dispositivos", "indústria", "fatiamento", "slicing", "tempo real", "sensores", "veículo", "automação", "saúde"],
  },

  // ---------------- DADOS & IA ----------------
  {
    id: "I1",
    career: "ia",
    name: "Dona Cida",
    archetype: "A Cliente que Odeia Robô",
    emoji: "☎️",
    color: "#e76f51",
    difficulty: "FÁCIL",
    dc: 9,
    tagline: "“Eu quero falar com gente.”",
    question: "Toda vez que entro em contato, falo com um robô que não me entende. Por que não colocam logo uma pessoa?",
    speech: "Simpática, mas sem paciência. Fala como uma avó que já tentou de tudo.",
    hook: "Acha que a IA só atrapalha e tem medo de ficar presa no robô.",
    reply: "Mas e quando o robô não entende? Eu fico presa nele para sempre?",
    context: "Ela mostra o celular: o robô pediu para ela digitar 1 pela quinta vez.",
    stakes: "Se a IA irrita o cliente, a tecnologia vira o problema em vez da solução.",
    react: {
      saved: "Se o robô me passar para uma pessoa quando eu precisar, aí eu aceito.",
      resist: "Vou dar mais uma chance para o robô. Só uma.",
      damned: "Continuo querendo falar com gente.",
    },
    keywords: ["humano", "transferir", "simples", "rápido", "24h", "entender", "linguagem", "contexto", "aprender", "fila", "atendimento"],
  },
  {
    id: "I2",
    career: "ia",
    name: "Bruno",
    archetype: "O Gerente do Botão Mágico",
    emoji: "🪄",
    color: "#5e60ce",
    difficulty: "MÉDIO",
    dc: 12,
    tagline: "“É só ligar a IA.”",
    question: "Quero uma IA que descubra quais clientes vão cancelar o plano no mês que vem. É só ligar a IA, certo?",
    speech: "Entusiasmado com palavras da moda, otimista demais.",
    hook: "Acha que IA funciona sem dados e sem um plano do que fazer com a previsão.",
    reply: "Tá, e depois que a IA prever? O que muda na prática para o cliente?",
    context: "Ele chega com um post sobre IA impresso, todo destacado com marca-texto.",
    stakes: "Prever cancelamento sem dado bom gera ação errada para o cliente errado.",
    react: {
      saved: "Então a IA é o começo, não o fim. Faz sentido.",
      resist: "Entendi a parte dos dados. A parte da ação, ainda não.",
      damned: "Eu achava que era só ligar a IA.",
    },
    keywords: ["dados", "histórico", "treinar", "modelo", "variáveis", "uso", "previsão", "churn", "ação", "retenção", "privacidade"],
  },
  {
    id: "I3",
    career: "ia",
    name: "Dra. Lúcia",
    archetype: "A Diretora de Ética",
    emoji: "⚖️",
    color: "#264653",
    difficulty: "DIFÍCIL",
    dc: 15,
    tagline: "“Algoritmo também precisa de juízo.”",
    question: "Nossa IA vai recomendar planos para os clientes. Como garantir que ela não seja injusta nem empurre o que não serve?",
    speech: "Calma, firme, faz perguntas difíceis com educação.",
    hook: "Cobra viés, transparência, supervisão humana e auditoria, não só boas intenções.",
    reply: "Princípios bonitos. Mas como você vai medir se a IA está sendo injusta, na prática?",
    context: "Comitê de ética, sexta à tarde. Ela tem uma pasta com casos de algoritmos que deram errado.",
    stakes: "Uma recomendação injusta quebra a confiança de milhões de clientes.",
    react: {
      saved: "Isso é governança de verdade. Aprovado, com acompanhamento.",
      resist: "Bom caminho. Quero ver o plano de auditoria.",
      damned: "Não aprovo. Ainda é uma caixa-preta.",
    },
    keywords: ["viés", "transparência", "explicar", "auditoria", "lgpd", "consentimento", "supervisão", "humano", "teste", "justo", "dados"],
  },

  // ---------------- CIBERSEGURANÇA ----------------
  {
    id: "S1",
    career: "cyber",
    name: "Tio Jorge",
    archetype: "O Tio do Link Suspeito",
    emoji: "📲",
    color: "#e9c46a",
    difficulty: "FÁCIL",
    dc: 9,
    tagline: "“Ganhei um celular!”",
    question: "Recebi uma mensagem dizendo que ganhei um celular. É só clicar no link e colocar meus dados. Posso clicar?",
    speech: "Animado, ingênuo, fala alto e confia em tudo.",
    hook: "Acha que a mensagem é verdadeira porque parece oficial.",
    reply: "Mas tem logo, tem tudo! Como eu vou saber que é falso?",
    context: "Almoço de domingo. Ele mostra o celular para a família inteira, todo orgulhoso.",
    stakes: "Um clique errado e os dados dele vão parar na mão de golpista.",
    react: {
      saved: "Ainda bem que perguntei! Vou apagar e avisar a família.",
      resist: "Tá, não vou clicar. Mas que era um celular bonito, era.",
      damned: "Vou clicar só para ver o que acontece.",
    },
    keywords: ["golpe", "phishing", "link", "oficial", "dados", "senha", "desconfiar", "canal", "site", "app", "denunciar"],
  },
  {
    id: "S2",
    career: "cyber",
    name: "Renata",
    archetype: "A Analista do Alerta das 3h",
    emoji: "🚨",
    color: "#c1121f",
    difficulty: "MÉDIO",
    dc: 12,
    tagline: "“Pode ser nada. Pode ser tudo.”",
    question: "O sistema alertou acessos estranhos às 3h da manhã num servidor. Pode ser nada. Devo acordar o time ou esperar?",
    speech: "Cansada, objetiva, pesa custo e risco.",
    hook: "Teme acordar todo mundo por alarme falso; quer um critério claro de ação.",
    reply: "E se for alarme falso? Acordar todo mundo à toa também tem custo.",
    context: "Três da manhã, café frio, um gráfico de acessos que deveria estar parado e não está.",
    stakes: "Se for ataque e ninguém agir, o problema de amanhã vai ser muito maior.",
    react: {
      saved: "Ok. Isolo, registro e escalo. Obrigada.",
      resist: "Faz sentido, mas acho que vou esperar mais um pouco.",
      damned: "Vou esperar amanhecer.",
    },
    keywords: ["incidente", "log", "conter", "isolar", "investigar", "escalar", "resposta", "acesso", "senha", "monitor", "plano"],
  },
  {
    id: "S3",
    career: "cyber",
    name: "Henrique",
    archetype: "O Diretor do “Com a Gente Não Acontece”",
    emoji: "🏰",
    color: "#6d8b74",
    difficulty: "DIFÍCIL",
    dc: 15,
    tagline: "“Temos firewall.”",
    question: "Temos firewall e antivírus. Por que gastar mais com segurança se nunca fomos atacados?",
    speech: "Confiante, executivo, pensa em custo e prazo.",
    hook: "Acha que ausência de ataque prova que está tudo seguro.",
    reply: "Mas se nunca aconteceu, como você prova que o risco é real?",
    context: "Sala da diretoria, vista para a cidade. Ele te dá cinco minutos e um sorriso confiante.",
    stakes: "Segurança só aparece no orçamento quando já é tarde.",
    react: {
      saved: "Entendido. Segurança é investimento, não despesa. Aprovado.",
      resist: "Me mande os números. Talvez no próximo orçamento.",
      damned: "Com a gente não acontece.",
    },
    keywords: ["pessoas", "treinamento", "backup", "risco", "zero trust", "camadas", "detecção", "resposta", "mfa", "custo", "vazamento"],
  },

  // ---------------- PRODUTO DIGITAL ----------------
  {
    id: "P1",
    career: "produto",
    name: "Seu Osvaldo",
    archetype: "O Cliente do App Perdido",
    emoji: "🐢",
    color: "#8e7dbe",
    difficulty: "FÁCIL",
    dc: 9,
    tagline: "“Cadê a minha conta?”",
    question: "Abri o app para ver minha conta e tem tanto botão que eu desisti. Por que não deixam tudo simples?",
    speech: "Calmo, teimoso, fala devagar.",
    hook: "Quer simplicidade, mas cada cliente quer uma coisa diferente.",
    reply: "Mas cada um quer uma coisa diferente. Como você decide o que fica na frente?",
    context: "Ele segura o celular longe do rosto, procurando a fatura com o dedo.",
    stakes: "Se o cliente não acha a fatura no app, ele liga para a central, e todo mundo perde tempo.",
    react: {
      saved: "Se a fatura ficar na primeira tela, eu fico feliz.",
      resist: "Melhorou na teoria. Quero ver na prática.",
      damned: "Vou continuar ligando.",
    },
    keywords: ["simples", "usuário", "tarefa", "principal", "teste", "navegação", "acessibilidade", "fonte", "jornada", "dados de uso", "feedback"],
  },
  {
    id: "P2",
    career: "produto",
    name: "Bia",
    archetype: "A Product Manager Impaciente",
    emoji: "📋",
    color: "#e63946",
    difficulty: "MÉDIO",
    dc: 12,
    tagline: "“Para ontem, com qualidade.”",
    question: "Para contratar internet pelo app, quero pedir CPF, endereço completo, renda e profissão logo no primeiro passo. Assim já qualificamos. Por que não?",
    speech: "Objetiva, acelerada, fala em prazos e métricas.",
    hook: "Defende pedir muitos dados de uma vez e pergunta o que se perde com um formulário curto.",
    reply: "Entendi o risco, mas preciso qualificar. Que alternativa você propõe sem perder informação?",
    context: "Mensagem no chat às 18h: “preciso disso no ar amanhã, me fala se dá”.",
    stakes: "Formulário longo derruba as contratações e ainda cria risco com a LGPD.",
    react: {
      saved: "Fechado: começo curto e o resto ao longo da jornada.",
      resist: "Entendi. Vou levar para o jurídico antes de decidir.",
      damned: "Prazo é prazo. Vai com todos os campos.",
    },
    keywords: ["lgpd", "minimização", "consentimento", "conversão", "abandono", "campos", "dados", "finalidade", "progressivo", "risco", "etapas"],
  },
  {
    id: "P3",
    career: "produto",
    name: "Tiago",
    archetype: "O Arquiteto Perfeccionista",
    emoji: "🏗️",
    color: "#457b9d",
    difficulty: "DIFÍCIL",
    dc: 15,
    tagline: "“Funciona na minha máquina.”",
    question: "O app vai lançar uma novidade e esperamos um pico enorme de acessos no primeiro dia. O que você faria antes de ir ao ar?",
    speech: "Técnico, detalhista, desconfia de qualquer resposta sem número.",
    hook: "Cobra plano concreto: teste de carga, cache, escala, monitoramento e plano B.",
    reply: "Plano bonito. Mas e se o pico for o dobro do previsto? Qual é o plano B?",
    context: "Ele desenha a arquitetura no quadro branco e circula o servidor com caneta vermelha.",
    stakes: "Se o app cair no lançamento, a novidade vira notícia pelo motivo errado.",
    react: {
      saved: "Plano sólido. Roda o teste de carga hoje e a gente vai ao ar.",
      resist: "Tem coisa boa aí, mas eu ainda não dormiria tranquilo.",
      damned: "Isso não aguenta o pico. Volta para a prancheta.",
    },
    keywords: ["teste de carga", "cache", "cdn", "escala", "monitor", "fila", "banco", "latência", "degrad", "alerta", "rollback"],
  },

  // ---------------- MARKETING & CRIAÇÃO ----------------
  {
    id: "K1",
    career: "marca",
    name: "Dona Marta",
    archetype: "A Cliente do Logo Gigante",
    emoji: "🔍",
    color: "#f72585",
    difficulty: "FÁCIL",
    dc: 9,
    tagline: "“Maior! Mais! Todas as ofertas!”",
    question: "Quero o logo bem grande e todas as ofertas escritas no anúncio. Por que não pode?",
    speech: "Enfática, repete pedidos, fala como quem já decidiu o layout.",
    hook: "Acha que mais informação vende mais.",
    reply: "Mas o cliente precisa saber de tudo! Se eu tiro informação, como ele fica sabendo das ofertas?",
    context: "Ela trouxe o anúncio impresso, com o logo ocupando metade da folha e doze ofertas embaixo.",
    stakes: "Anúncio com tudo vira anúncio sem nada: ninguém lê e ninguém clica.",
    react: {
      saved: "Hum… menos é mais, então. Pode fazer do seu jeito.",
      resist: "Faz sentido, mas pelo menos aumenta um pouquinho o logo.",
      damned: "Não! Maior! Todas as ofertas!",
    },
    keywords: ["foco", "uma mensagem", "hierarquia", "legib", "benefício", "atenção", "cta", "simples", "segundos", "contraste", "teste"],
  },
  {
    id: "K2",
    career: "marca",
    name: "Léo",
    archetype: "O Diretor de Estilo",
    emoji: "🕶️",
    color: "#7209b7",
    difficulty: "MÉDIO",
    dc: 12,
    tagline: "“Está lindo. O problema é o público.”",
    question: "Meu anúncio ficou lindo, mas ninguém clica. Deve ser culpa do algoritmo, né?",
    speech: "Artístico, vaidoso, usa palavras como “conceito” e “estética”.",
    hook: "Culpa o algoritmo e defende que o criativo está perfeito.",
    reply: "Pode ser. Mas o conceito está perfeito. O que exatamente você mudaria sem estragar a ideia?",
    context: "Ele mostra o anúncio em tela cheia, ajusta os óculos e espera os elogios.",
    stakes: "Sem diagnóstico, a próxima peça vai ter o mesmo problema, só que mais bonita.",
    react: {
      saved: "Tá. Vamos testar outra abertura. Mas a paleta de cores fica.",
      resist: "Pode ter razão. Mas o algoritmo também não ajuda, né?",
      damned: "O conceito está perfeito. O público é que não entendeu.",
    },
    keywords: ["gancho", "benefício", "cta", "público", "teste", "variação", "formato", "mensagem", "ctr", "primeiros segundos", "dados"],
  },
  {
    id: "K3",
    career: "marca",
    name: "Valentina",
    archetype: "A Publicitária Premiada",
    emoji: "🏆",
    color: "#ff7b00",
    difficulty: "DIFÍCIL",
    dc: 15,
    tagline: "“Já ganhei prêmio por menos.”",
    question: "Como você faz um anúncio de internet, algo invisível, ser memorável em 3 segundos sem cair no clichê da velocidade?",
    speech: "Elegante, afiada, desdenha de clichê e adora um bom insight.",
    hook: "Rejeita o óbvio e exige um insight humano concreto, não um slogan.",
    reply: "Correto, mas isso qualquer agência diria. Qual é o seu insight, a cena que ninguém usou?",
    context: "Café, notebook cheio de adesivos de festival e o olhar de quem já ouviu todas as ideias.",
    stakes: "A marca quer uma campanha que as pessoas lembrem, não mais um anúncio de velocidade.",
    react: {
      saved: "Isso eu nunca vi. Pode desenvolver.",
      resist: "Tem algo aí. Ainda está cru, mas tem algo.",
      damned: "Já vi isso em três campanhas este ano.",
    },
    keywords: ["insight", "emoção", "situação", "videochamada", "história", "demonstr", "humano", "memor", "cena", "problema", "marca"],
  },
];

export function getPersona(id: string) {
  return PERSONAS.find((p) => p.id === id) ?? null;
}

export function personasOf(career: CareerId) {
  return PERSONAS.filter((p) => p.career === career);
}

// Base de conhecimento por área (vai no prompt do Árbitro). Conceitos gerais, sem dados da Claro.
export const CAREER_BASE: Record<CareerId, string> = {
  rede: `ÁREA: Redes de telecomunicações e 5G.
• Velocidade (banda) é diferente de latência (ping): jogo e chamada dependem mais de latência e estabilidade; Wi-Fi com interferência, distância do roteador e rota até o servidor afetam.
• Grandes eventos exigem planejamento de capacidade: reforço de antenas/células, estações temporárias, monitoramento do tráfego em tempo real.
• 5G: além de velocidade, latência baixa, muitos dispositivos por área (IoT) e fatiamento de rede (slicing) para aplicações críticas (indústria, saúde, veículos).`,
  ia: `ÁREA: Dados e Inteligência Artificial.
• Atendimento com IA: resolver o simples rápido, entender linguagem natural e contexto, e transferir para humano quando necessário.
• Modelos preditivos (ex.: cancelamento/churn) dependem de dados históricos de qualidade, validação e de uma ação clara sobre a previsão; respeitar privacidade/LGPD.
• IA responsável: viés, transparência/explicabilidade, supervisão humana, auditoria e testes contínuos.`,
  cyber: `ÁREA: Cibersegurança.
• Phishing: desconfiar de prêmios e urgência, checar canais oficiais, não informar dados/senhas por links recebidos, denunciar.
• Resposta a incidentes: conter/isolar, preservar logs, investigar, escalar conforme o plano de resposta, comunicar.
• Defesa em camadas: pessoas e treinamento, MFA, backups, detecção e resposta, zero trust; ausência de ataque conhecido não significa segurança.`,
  produto: `ÁREA: Produto digital (apps e web).
• UX: priorizar as tarefas principais do usuário, hierarquia clara, acessibilidade, testes com usuários e dados de uso.
• LGPD e conversão: minimização de dados, finalidade, consentimento; formulários curtos e coleta progressiva.
• Lançamentos: teste de carga, cache/CDN, escalabilidade, monitoramento, alertas, degradação controlada e rollback.`,
  marca: `ÁREA: Marketing e criação.
• Uma mensagem por peça, hierarquia visual, legibilidade, contraste e chamada para ação clara.
• Gancho nos primeiros segundos; começar pelo problema ou benefício do público, não pelo logo; testar variações.
• Insight humano e situação real (ex.: videochamada que trava na hora importante) vencem slogans genéricos de velocidade.`,
};
