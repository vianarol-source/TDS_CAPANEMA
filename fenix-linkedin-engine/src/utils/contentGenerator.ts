import { ContentFormData, ContentType, MarketSegment, VoiceTone } from '../types'

interface GeneratedContent {
  content: string
  hashtags: string[]
}

// --- Segment-specific context blocks ---

const segmentContext: Record<MarketSegment, {
  painPoint: string
  energyRisk: string
  businessImpact: string
  audience: string
  keywords: string[]
}> = {
  avicultura: {
    painPoint: 'Aviários climatizados e automatizados dependem de energia contínua para proteger lotes inteiros',
    energyRisk: 'Uma falha elétrica de poucos minutos pode gerar mortalidade em massa e prejuízos de centenas de milhares de reais',
    businessImpact: 'produtividade, bem-estar animal e conformidade com contratos de integração',
    audience: 'produtores rurais, integradores avícolas e cooperativas agropecuárias',
    keywords: ['Avicultura', 'Agronegócio', 'Integração', 'ProduçãoAnimal', 'Aviário'],
  },
  agronegocio: {
    painPoint: 'Operações agrícolas modernas integram automação, irrigação e armazenagem que exigem energia ininterrupta',
    energyRisk: 'A ausência de backup energético pode paralisar colheitas, comprometer a qualidade do produto e quebrar prazos de entrega',
    businessImpact: 'produtividade, segurança alimentar e competitividade no mercado',
    audience: 'produtores rurais, gestores agrícolas e cooperativas',
    keywords: ['Agronegócio', 'AgroBrasil', 'ProduçãoRural', 'AgriculturaModerna'],
  },
  frigorifico: {
    painPoint: 'Frigoríficos operam com câmaras de resfriamento, linhas de abate e sistemas de controle que não podem parar',
    energyRisk: 'A perda de energia por horas pode comprometer toneladas de produto, gerar autuações sanitárias e quebrar contratos de exportação',
    businessImpact: 'segurança alimentar, cumprimento de normas sanitárias e receita de exportação',
    audience: 'gestores de frigoríficos, diretores industriais e compradores de insumos',
    keywords: ['Frigorifico', 'IndustriaAlimenticia', 'SegurancaAlimentar', 'Exportacao'],
  },
  cooperativa: {
    painPoint: 'Cooperativas agropecuárias gerenciam armazéns, beneficiadoras e centrais de distribuição que exigem operação contínua',
    energyRisk: 'Uma falha energética pode paralisar grãos em silo, comprometer a qualidade do produto e atrasar liquidações financeiras',
    businessImpact: 'renda dos cooperados, operação logística e posicionamento no mercado',
    audience: 'diretores e gestores de cooperativas agropecuárias e de crédito',
    keywords: ['Cooperativismo', 'Cooperativa', 'Agronegocio', 'LogisticaRural'],
  },
  construcao: {
    painPoint: 'Canteiros de obras, concreto bombeado e equipamentos de terraplanagem exigem energia constante para cumprir cronogramas',
    energyRisk: 'Uma paralisação por falta de energia pode gerar multas contratuais, atrasos no cronograma e retrabalho no concreto já lançado',
    businessImpact: 'prazo de entrega, custos de obra e reputação perante o cliente',
    audience: 'engenheiros de obras, gestores de projetos e diretores de construtoras',
    keywords: ['Construcao', 'CivilConstruction', 'CanteiroDaObra', 'Engenharia'],
  },
  condominio: {
    painPoint: 'Condomínios residenciais e comerciais dependem de energia para elevadores, segurança, bombas e iluminação de áreas comuns',
    energyRisk: 'A falta de energia causa insatisfação dos condôminos, riscos de segurança e responsabilidade civil para a administração',
    businessImpact: 'qualidade de vida, segurança patrimonial e valorização do imóvel',
    audience: 'administradores de condomínio, síndicos e empresas de facilities',
    keywords: ['Condominio', 'GestaoCondominial', 'Sindico', 'Facilities'],
  },
  saude: {
    painPoint: 'Hospitais e clínicas operam UTIs, centros cirúrgicos e equipamentos de diagnóstico que não admitem interrupção',
    energyRisk: 'Uma falha no fornecimento de energia em ambiente hospitalar pode colocar vidas em risco e gerar graves consequências jurídicas',
    businessImpact: 'segurança dos pacientes, conformidade com normas de saúde e continuidade operacional',
    audience: 'gestores hospitalares, diretores técnicos e administradores de clínicas',
    keywords: ['Saude', 'Hospital', 'GestaoHospitalar', 'InfraestruturaHospitalar'],
  },
  'data-center': {
    painPoint: 'Data centers sustentam aplicações críticas, armazenamento de dados e conectividade que não podem ser interrompidos',
    energyRisk: 'Uma queda de energia de milissegundos pode gerar perda de dados, downtime de serviços e quebra de SLA com clientes',
    businessImpact: 'disponibilidade de serviços, reputação da empresa e receita recorrente',
    audience: 'diretores de TI, gestores de infraestrutura e responsáveis por data centers',
    keywords: ['DataCenter', 'TI', 'Infraestrutura', 'CloudComputing', 'Uptime'],
  },
  industria: {
    painPoint: 'Linhas de produção industrial operam com equipamentos de alta potência que exigem fornecimento estável e contínuo de energia',
    energyRisk: 'A interrupção do processo produtivo gera paradas de linha, perda de matéria-prima, retrabalho e quebra de programação',
    businessImpact: 'produtividade industrial, qualidade do produto e competitividade no mercado',
    audience: 'diretores industriais, gestores de planta e compradores de suprimentos industriais',
    keywords: ['Industria', 'Manufactura', 'IndustriasBrasileiras', 'Automacao'],
  },
  saneamento: {
    painPoint: 'Estações de tratamento de água e esgoto operam bombas, aeradores e sistemas de controle que não podem parar',
    energyRisk: 'Uma paralisação no fornecimento de energia pode comprometer o abastecimento de água e gerar riscos sanitários à população',
    businessImpact: 'saúde pública, conformidade regulatória e continuidade dos serviços essenciais',
    audience: 'diretores técnicos de empresas de saneamento e gestores de concessionárias',
    keywords: ['Saneamento', 'AguaETratamento', 'InfraestruturaBasica', 'Concessoes'],
  },
  locadora: {
    painPoint: 'Locadoras de equipamentos precisam garantir que seus geradores estejam sempre disponíveis, calibrados e com suporte técnico ágil',
    energyRisk: 'Um equipamento parado ou com falha técnica gera perda de contrato, reputação comprometida e custos de substituição emergencial',
    businessImpact: 'disponibilidade de frota, satisfação do cliente e margem operacional',
    audience: 'gestores de locadoras, diretores comerciais e responsáveis pela manutenção de frota',
    keywords: ['Locacao', 'EquipamentosIndustriais', 'GestaoDeEquipamentos', 'Geradores'],
  },
  suprimentos: {
    painPoint: 'Gestores de suprimentos buscam fornecedores confiáveis, com suporte técnico sólido e capacidade de atender demandas de curto prazo',
    energyRisk: 'A escolha errada de fornecedor de geradores pode gerar atrasos em obras, falhas em entregas e custos de manutenção elevados',
    businessImpact: 'gestão de custos, confiabilidade da cadeia de suprimentos e conformidade com projetos',
    audience: 'compradores, gestores de suprimentos e diretores de operações',
    keywords: ['Suprimentos', 'Compras', 'GestaoDeCompras', 'SupplyChain'],
  },
  parceiros: {
    painPoint: 'Representantes comerciais e parceiros de negócios precisam de fornecedores com produtos diferenciados e suporte para fechar negócios maiores',
    energyRisk: 'A falta de um parceiro confiável no segmento de geradores limita as oportunidades de negócio e a receita do representante',
    businessImpact: 'expansão comercial, receita de comissionamento e posicionamento estratégico no mercado',
    audience: 'representantes comerciais, engenheiros consultores e parceiros de negócio',
    keywords: ['Parcerias', 'NegociosB2B', 'DesenvolvimentoComercial', 'Vendas'],
  },
  geral: {
    painPoint: 'Empresas de todos os setores enfrentam a vulnerabilidade do fornecimento de energia elétrica no Brasil',
    energyRisk: 'A interrupção do fornecimento de energia pode paralisar operações, gerar prejuízos e comprometer a continuidade dos negócios',
    businessImpact: 'operação contínua, competitividade e crescimento sustentável',
    audience: 'gestores, diretores e decisores de múltiplos segmentos de mercado',
    keywords: ['Geradores', 'EnergiaDeBackup', 'Negocios', 'Infraestrutura'],
  },
}

// --- Tone modifiers ---

const toneOpeners: Record<VoiceTone, string[]> = {
  profissional: [
    'No mercado atual,',
    'A gestão eficiente de',
    'Para empresas que buscam excelência operacional,',
    'Dados do setor mostram que',
  ],
  consultivo: [
    'Quando conversamos com gestores do setor,',
    'Uma pergunta que fazemos sempre aos nossos parceiros:',
    'Em nossa atuação consultiva,',
    'A experiência com dezenas de operações nos mostrou que',
  ],
  tecnico: [
    'Tecnicamente falando,',
    'Do ponto de vista da engenharia elétrica,',
    'A norma ABNT NBR 5410 estabelece que',
    'Grupos geradores diesel com potências entre 30 e 2.000 kVA',
  ],
  comercial: [
    'Existe uma oportunidade clara aqui.',
    'O mercado está crescendo — e quem se posicionar agora sai na frente.',
    'Números que todo gestor precisa ver:',
    'Essa é uma janela de oportunidade que não pode ser ignorada.',
  ],
  inspirador: [
    'Grandes operações são construídas sobre uma base sólida.',
    'Por trás de cada negócio que não para, existe uma decisão inteligente.',
    'Empresas que crescem não dependem da sorte. Dependem de planejamento.',
    'O futuro pertence a quem planeja o imprevisto.',
  ],
  direto: [
    'Energia parada custa caro.',
    'Sem backup, o risco é alto.',
    'Esse é o problema real:',
    'Vou direto ao ponto:',
  ],
  estrategico: [
    'Olhando para os próximos 5 anos do setor,',
    'Do ponto de vista estratégico,',
    'A tomada de decisão correta aqui define',
    'Posicionamento no mercado começa com infraestrutura.',
  ],
  emocional: [
    'Já imaginou perder uma colheita inteira por falta de energia?',
    'Existe uma sensação que nenhum gestor quer sentir:',
    'O custo emocional de uma falha operacional vai muito além do financeiro.',
    'Há momentos em que a decisão certa faz toda a diferença.',
  ],
}

// --- CTA variants ---

const ctaVariants: Record<string, string[]> = {
  parceiros: [
    'Se sua empresa atende esse mercado, podemos construir uma parceria comercial inteligente. Vamos conversar?',
    'Procuramos parceiros que queiram expandir sua atuação com um portfólio sólido. Entre em contato.',
    'Há espaço para crescer juntos. Chama no privado ou comenta aqui.',
  ],
  comercial: [
    'Entre em contato e descubra a solução certa para sua operação.',
    'Solicite uma análise técnica sem compromisso.',
    'Fale com nossa equipe e receba um estudo de caso personalizado.',
  ],
  educativo: [
    'Tem alguma dúvida sobre dimensionamento de geradores? Comenta abaixo.',
    'Salva esse post para consultar depois — e compartilha com quem precisa saber.',
    'Qual é o maior desafio energético da sua operação? Me conta nos comentários.',
  ],
  geral: [
    'Vamos conversar sobre sua operação?',
    'Compartilhe com alguém que precisa ver isso.',
    'O próximo passo é simples: entre em contato.',
  ],
}

// --- Hashtag pools ---

const baseHashtags = ['Geradores', 'GruposGeradores', 'EnergiaDeBackup', 'FGSolucoesComerciais', 'FenixGlobal']

const segmentHashtags: Record<MarketSegment, string[]> = {
  avicultura: ['Avicultura', 'Agronegocio', 'Integracao', 'ProducaoAnimal'],
  agronegocio: ['Agronegocio', 'AgroBrasil', 'ProducaoRural', 'AgriculturaModerna'],
  frigorifico: ['Frigorifico', 'IndustriaAlimenticia', 'SegurancaAlimentar', 'Exportacao'],
  cooperativa: ['Cooperativismo', 'Cooperativa', 'Agronegocio', 'LogisticaRural'],
  construcao: ['Construcao', 'Engenharia', 'ObrasCivil', 'Construtoras'],
  condominio: ['Condominio', 'GestaoCondominial', 'Sindico', 'Facilities'],
  saude: ['Saude', 'Hospital', 'GestaoHospitalar', 'SaudeBrasil'],
  'data-center': ['DataCenter', 'TI', 'Infraestrutura', 'CloudComputing'],
  industria: ['Industria', 'Manufactura', 'IndustriaBrasileira', 'Automacao'],
  saneamento: ['Saneamento', 'AguaETratamento', 'InfraestruturaBasica'],
  locadora: ['Locacao', 'EquipamentosIndustriais', 'GestaoDeEquipamentos'],
  suprimentos: ['Suprimentos', 'Compras', 'SupplyChain', 'GestaoDeCompras'],
  parceiros: ['Parcerias', 'NegociosB2B', 'DesenvolvimentoComercial', 'Vendas'],
  geral: ['Negocios', 'Infraestrutura', 'Energia', 'B2B'],
}

// --- Content type builders ---

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function buildAuthorityPost(data: ContentFormData, ctx: ReturnType<typeof getContext>): string {
  const opener = pickRandom(toneOpeners[data.voiceTone])
  return `${opener} ${ctx.painPoint.toLowerCase()}.

${ctx.energyRisk}.

Esse cenário não é exceção — é realidade em boa parte das operações no Brasil. E a maioria das empresas só descobre o problema quando ele já aconteceu.

${data.theme ? `Falando especificamente sobre "${data.theme}": ` : ''}A energia de backup deixou de ser item opcional. Passou a ser requisito técnico e estratégico.

Na FG Soluções Comerciais | Fenix Global, atuamos há anos conectando empresas às soluções certas em grupos geradores de energia, com suporte técnico e comercial especializado através da Geradores Capanema — fabricante brasileira com portfólio completo para ${ctx.audience}.

O mercado não espera. A questão é simples: sua operação está preparada para a próxima falha?

${data.callToAction || pickRandom(ctaVariants.geral)}`
}

function buildCommercialPost(data: ContentFormData, ctx: ReturnType<typeof getContext>): string {
  const opener = pickRandom(toneOpeners[data.voiceTone])
  return `${opener}

${ctx.painPoint}.

Esse é o cenário que a FG Soluções Comerciais | Fenix Global resolve.

Trabalhamos com gestores e empresas de ${data.segment !== 'geral' ? ctx.audience : 'múltiplos setores'} para dimensionar, fornecer e dar suporte técnico em grupos geradores diesel — com o respaldo da Geradores Capanema, fabricante brasileira reconhecida no mercado.

O que oferecemos:
• Consultoria técnica para dimensionamento correto
• Portfólio completo de grupos geradores diesel
• Suporte técnico e pós-venda especializado
• Condições comerciais para projetos e revendas

${ctx.businessImpact ? `Quando a decisão é certa, o impacto vai direto em: ${ctx.businessImpact}.` : ''}

${data.callToAction || pickRandom(ctaVariants.comercial)}`
}

function buildEducativePost(data: ContentFormData, ctx: ReturnType<typeof getContext>): string {
  return `Você sabe qual o tamanho de gerador ideal para a sua operação?

Essa é uma das dúvidas mais comuns que recebemos. E a resposta errada pode custar muito caro.

3 fatores que definem o dimensionamento correto de um grupo gerador:

1. CARGA INSTALADA vs. CARGA REAL
Nem toda a carga elétrica opera simultaneamente. O cálculo correto considera o fator de demanda, não só a soma das potências.

2. TIPO DE CARGA
Cargas resistivas (iluminação, resistências) são simples. Cargas indutivas (motores, compressores) exigem até 3x a potência nominal na partida — isso muda tudo no dimensionamento.

3. FATOR DE POTÊNCIA
O gerador dimensionado em kVA precisa ser convertido para kW considerando o fator de potência da sua instalação (geralmente entre 0,8 e 0,9).

${ctx.painPoint}. Por isso, ${ctx.audience} precisam de um dimensionamento técnico sério — não de uma escolha por preço.

Na FG Soluções Comerciais | Fenix Global, fazemos esse estudo antes de qualquer proposta. É a nossa forma de garantir que a solução entregue vai funcionar quando mais importar.

${data.callToAction || pickRandom(ctaVariants.educativo)}`
}

function buildStorytellingPost(data: ContentFormData, ctx: ReturnType<typeof getContext>): string {
  const opener = pickRandom(toneOpeners.emocional)
  return `${opener}

Um gestor me ligou às 23h numa sexta-feira.

A operação havia parado. ${ctx.energyRisk.split('.')[0]}.

Ele havia adiado a compra do gerador por meses — sempre havia "algo mais urgente" no orçamento. Naquela noite, o custo da procrastinação virou realidade.

Não conto essa história para gerar medo. Conto porque ela é comum. E porque existe uma versão diferente para quem decide agora.

${ctx.painPoint}. Esse não é um cenário hipotético — é a rotina de dezenas de operações no Brasil que ainda não tomaram a decisão certa.

${data.theme ? `Quando o tema é "${data.theme}", a pergunta não é SE vai faltar energia — é QUANDO. E o que sua operação fará nesse momento.` : ''}

Na FG Soluções Comerciais | Fenix Global, ajudamos empresas a tomarem essa decisão antes da crise. Com consultoria, portfólio completo da Geradores Capanema e suporte técnico real.

Energia parada custa caro. Decisão certa gera resultado.

${data.callToAction || pickRandom(ctaVariants.geral)}`
}

function buildOpportunityPost(data: ContentFormData, ctx: ReturnType<typeof getContext>): string {
  const opener = pickRandom(toneOpeners.estrategico)
  return `${opener} o mercado de grupos geradores no Brasil nunca teve tanto potencial.

Por quê?

• A instabilidade do sistema elétrico brasileiro segue crescente
• A expansão agroindustrial e industrial exige infraestrutura mais robusta
• A digitalização da economia aumenta a dependência de energia ininterrupta
• Novas regulamentações de segurança exigem backup em setores críticos

${ctx.painPoint}. E o mercado para ${ctx.audience} está em franca expansão.

Isso cria uma oportunidade clara para quem está bem posicionado: representantes comerciais, engenheiros consultores, integradoras e empresas que atuam próximas a esse público.

Na FG Soluções Comerciais | Fenix Global, conectamos oportunidades com soluções. Representamos comercialmente a Geradores Capanema — fabricante brasileira com portfólio técnico para atender desde pequenas instalações até grandes projetos industriais.

O momento de entrar nesse mercado é agora.

${data.callToAction || pickRandom(ctaVariants.parceiros)}`
}

function buildIndirectProspectingPost(data: ContentFormData, ctx: ReturnType<typeof getContext>): string {
  const opener = pickRandom(toneOpeners[data.voiceTone])
  return `${opener}

Recentemente, conversamos com um gestor de ${ctx.audience.split(',')[0]} que estava avaliando sua infraestrutura energética.

A primeira pergunta que ele fez foi: "Como eu sei se meu gerador atual está dimensionado corretamente?"

É a pergunta certa. E a maioria das empresas não sabe a resposta.

${ctx.painPoint}. Muitas instalações operam com geradores subdimensionados, mal mantidos ou tecnicamente obsoletos — e só descobrem isso no pior momento possível.

Nossa abordagem é simples:
→ Análise técnica da sua necessidade real
→ Proposta alinhada à sua operação e orçamento
→ Suporte contínuo, não só na venda

Se você gerencia operações que dependem de energia confiável, vale a conversa.

FG Soluções Comerciais | Fenix Global — Geradores Capanema

${data.callToAction || 'Me chama no privado ou deixa seu contato nos comentários.'}`
}

function buildPartnersPost(data: ContentFormData, ctx: ReturnType<typeof getContext>): string {
  return `Procuramos parceiros estratégicos.

Se você atende ${ctx.audience} — seja como representante, engenheiro consultor, integradora ou empresa de facilities — existe uma oportunidade de parceria que vale sua atenção.

O mercado de grupos geradores diesel está em expansão e precisa de profissionais bem posicionados, com produto sólido e suporte técnico real por trás.

O que oferecemos aos nossos parceiros:
✔ Portfólio completo da Geradores Capanema (fabricante brasileira)
✔ Suporte técnico para especificação e dimensionamento
✔ Material comercial e de apoio a vendas
✔ Condições especiais para revendas e projetos
✔ Parceria de longo prazo com foco em resultado

${ctx.painPoint}. Quem está próximo desse público tem uma vantagem real.

Na FG Soluções Comerciais | Fenix Global, construímos parcerias inteligentes — baseadas em produto, técnica e relacionamento.

${data.callToAction || 'Se faz sentido para você, me chama. Vamos explorar essa oportunidade juntos.'}

#Parcerias #NegociosB2B #FGSolucoesComerciais`
}

function buildInstitutionalPost(data: ContentFormData, ctx: ReturnType<typeof getContext>): string {
  return `FG Soluções Comerciais | Fenix Global.

Por trás desse nome, existe uma missão clara: conectar empresas às soluções certas em energia de backup — com inteligência comercial, suporte técnico e relacionamento de longo prazo.

Representamos comercialmente a Geradores Capanema, fabricante brasileira de grupos geradores diesel, com portfólio que atende desde pequenas instalações até grandes projetos industriais e agroindustriais.

Nosso foco está nos setores que mais dependem de energia contínua:
→ ${Object.values(segmentContext).slice(0, 4).map(s => s.audience.split(',')[0]).join('\n→ ')}

${ctx.painPoint}. E cada setor tem suas particularidades técnicas e comerciais — que conhecemos de perto.

Não somos apenas representantes. Somos parceiros de negócio.

Se sua empresa busca um fornecedor confiável, ou se você quer construir uma parceria comercial no setor de energia, vamos conversar.

${data.callToAction || 'Entre em contato. Estamos prontos para contribuir com seu projeto.'}

#FGSolucoesComerciais #FenixGlobal #GeradoresCapanema #GruposGeradores`
}

function buildVideoScriptPost(data: ContentFormData, ctx: ReturnType<typeof getContext>): string {
  return `[ROTEIRO DE VÍDEO CURTO — LinkedIn/Instagram Reels]
Tema: ${data.theme || 'Energia de Backup para ' + ctx.audience.split(',')[0]}
Duração sugerida: 60 a 90 segundos
Tom: ${data.voiceTone}

---

[ABERTURA — 0 a 5 segundos]
Visual: Apresentador direto para câmera, fundo corporativo ou ambiente industrial
Fala: "${pickRandom(toneOpeners.direto)} ${ctx.painPoint.split('.')[0]}."

---

[CONTEXTO — 5 a 20 segundos]
Visual: Infográfico ou imagem de operação do setor
Fala: "${ctx.energyRisk}. E ainda assim, muitas empresas não têm um plano de contingência energético."

---

[VIRADA — 20 a 40 segundos]
Visual: Retorno ao apresentador
Fala: "Existe uma solução simples e comprovada: um grupo gerador dimensionado corretamente para a sua operação. Na FG Soluções Comerciais, trabalhamos com a Geradores Capanema para garantir que ${ctx.audience.split(',')[0]} tenham energia quando mais precisam."

---

[CHAMADA — 40 a 60 segundos]
Visual: Tela com contato ou QR code
Fala: "${data.callToAction || 'Quer saber qual o gerador certo para sua operação? Link na bio ou me chama no privado.'}"

---

[LEGENDA SUGERIDA]
${ctx.painPoint}. Na FG Soluções Comerciais | Fenix Global, garantimos que sua operação nunca pare.

Geradores Capanema — fabricante brasileira com portfólio completo.`
}

function buildCarouselPost(data: ContentFormData, ctx: ReturnType<typeof getContext>): string {
  return `[CARROSSEL LINKEDIN — ${data.theme || 'Energia de Backup: O Guia Completo'}]
Slides sugeridos: 8 a 10

---

SLIDE 1 — CAPA
Título: "${data.theme || ctx.painPoint.split('.')[0]}"
Subtítulo: "O que sua empresa precisa saber"
Visual: Background azul escuro com destaque dourado
Logo: FG Soluções Comerciais | Fenix Global

---

SLIDE 2 — PROBLEMA
Título: "O risco que ninguém quer calcular"
Texto: "${ctx.energyRisk}."
Visual: Ícone de risco elétrico ou imagem de operação parada

---

SLIDE 3 — DADOS DO MERCADO
Título: "O setor em números"
Texto: "O mercado de geradores no Brasil cresce consistentemente. ${ctx.painPoint}."
Visual: Gráfico de crescimento

---

SLIDE 4 — CAUSA RAIZ
Título: "Por que isso acontece?"
Texto: "Falta de planejamento energético. A maioria das empresas trata o gerador como item secundário — até que a falha acontece."
Visual: Checklist com itens marcados/não marcados

---

SLIDE 5 — A SOLUÇÃO
Título: "Como resolver definitivamente"
Texto: "1. Diagnóstico técnico da carga instalada\n2. Dimensionamento correto\n3. Instalação por equipe especializada\n4. Manutenção preventiva"
Visual: Ícones para cada passo

---

SLIDE 6 — POR QUE A FG SOLUÇÕES?
Título: "Nossa proposta de valor"
Texto: "Representação comercial da Geradores Capanema. Portfólio completo. Suporte técnico. Parceria de longo prazo."
Visual: Logos e foto da equipe

---

SLIDE 7 — PÚBLICO-ALVO
Título: "Quem atendemos"
Texto: "${ctx.audience}"
Visual: Ícones dos setores

---

SLIDE 8 — CTA
Título: "Próximo passo"
Texto: "${data.callToAction || 'Entre em contato e receba uma análise técnica sem compromisso.'}"
Visual: Botão de contato com WhatsApp e LinkedIn
Logo: FG Soluções Comerciais | Fenix Global — Geradores Capanema`
}

// --- Main generator ---

interface Context {
  painPoint: string
  energyRisk: string
  businessImpact: string
  audience: string
  keywords: string[]
}

function getContext(data: ContentFormData): Context {
  return segmentContext[data.segment] || segmentContext.geral
}

const contentBuilders: Record<ContentType, (data: ContentFormData, ctx: Context) => string> = {
  autoridade: buildAuthorityPost,
  comercial: buildCommercialPost,
  educativo: buildEducativePost,
  storytelling: buildStorytellingPost,
  oportunidade: buildOpportunityPost,
  'prospeccao-indireta': buildIndirectProspectingPost,
  parceiros: buildPartnersPost,
  institucional: buildInstitutionalPost,
  'roteiro-video': buildVideoScriptPost,
  carrossel: buildCarouselPost,
}

export function generateContent(data: ContentFormData): GeneratedContent {
  const ctx = getContext(data)
  const builder = contentBuilders[data.contentType]
  let content = builder(data, ctx)

  // Append additional notes if provided
  if (data.additionalNotes) {
    content += `\n\n[Nota: ${data.additionalNotes}]`
  }

  // Append reference source if provided
  if (data.referenceSource) {
    content += `\n\n[Fonte de referência: ${data.referenceSource}]`
  }

  // Build hashtag list
  const hashtags = [
    ...baseHashtags,
    ...(segmentHashtags[data.segment] || segmentHashtags.geral),
  ]
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .slice(0, 10)

  return { content, hashtags }
}
