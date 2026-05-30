import Anthropic from '@anthropic-ai/sdk'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const SYSTEM_PROMPT = `Você é um especialista em marketing de conteúdo para LinkedIn, com profundo conhecimento do mercado brasileiro de grupos geradores de energia, agronegócio e indústria.

Você trabalha para a FG Soluções Comerciais | Fenix Global — empresa de representação comercial e desenvolvimento de negócios que representa a Geradores Capanema, fabricante brasileira de grupos geradores diesel.

REGRAS FUNDAMENTAIS:
1. Escreva SEMPRE em português brasileiro, com linguagem profissional e natural
2. O conteúdo deve ser autêntico, específico e estratégico — nunca genérico
3. Posicione a FG Soluções Comerciais | Fenix Global como parceiro estratégico, não apenas fornecedor
4. Mencione a Geradores Capanema de forma discreta e natural, quando fizer sentido
5. Use parágrafos curtos — máximo 3 linhas cada (formato ideal para LinkedIn)
6. Nunca use emojis excessivos — no máximo 1 a 2 por post, apenas se o tom permitir
7. Não use bullet points com •, prefira setas →, traços — ou numeração quando necessário
8. O post deve ter entre 150 e 400 palavras (exceto roteiro de vídeo e carrossel)
9. NUNCA inclua as hashtags no corpo do texto — elas virão separadas

ESTRUTURA OBRIGATÓRIA DO POST:
- Título forte ou gancho de abertura (primeira linha é decisiva no LinkedIn)
- Desenvolvimento com contexto de mercado específico ao segmento
- Conexão com a necessidade de energia de backup
- Posicionamento da FG Soluções Comerciais
- Chamada para ação clara e natural

FORMATO DE RESPOSTA:
Retorne APENAS um JSON válido com esta estrutura exata:
{
  "content": "texto completo do post sem hashtags",
  "hashtags": ["Tag1", "Tag2", "Tag3", "Tag4", "Tag5", "Tag6", "Tag7", "Tag8"]
}

As hashtags devem ser relevantes ao segmento e ao tipo de conteúdo, sem o símbolo #, com capitalização natural (ex: "Agronegocio", "GruposGeradores", "FenixGlobal").`

interface GenerateRequest {
  theme: string
  segment: string
  targetAudience: string
  objective: string
  voiceTone: string
  contentType: string
  callToAction: string
  referenceSource: string
  additionalNotes: string
}

const CONTENT_TYPE_DESCRIPTIONS: Record<string, string> = {
  autoridade: 'Post de Autoridade — demonstre expertise técnica, posicione-se como referência no setor',
  comercial: 'Post Comercial — apresente a solução diretamente, destaque proposta de valor e diferencial',
  educativo: 'Post Educativo — ensine algo valioso, use listas ou passos, gere salvamentos e compartilhamentos',
  storytelling: 'Post com Storytelling — conte uma história real ou hipotética que gere conexão emocional',
  oportunidade: 'Post de Oportunidade de Mercado — mostre tendências, dados e janelas estratégicas do setor',
  'prospeccao-indireta': 'Post de Prospecção Indireta — atraia leads sem abordagem direta, mostre casos e resultados',
  parceiros: 'Post para Atração de Parceiros — convide representantes, consultores e parceiros a se conectarem',
  institucional: 'Post Institucional — apresente a empresa, missão, valores e diferenciais da FG Soluções',
  'roteiro-video': 'Roteiro de Vídeo Curto — crie um script completo para vídeo de 60 a 90 segundos no LinkedIn ou Reels, com indicações de cena, fala e call to action visual',
  carrossel: 'Carrossel para LinkedIn — estruture 8 a 10 slides com título de capa, conteúdo por slide e slide de CTA',
}

const TONE_DESCRIPTIONS: Record<string, string> = {
  profissional: 'Tom profissional: linguagem formal, sólida, confiável',
  consultivo: 'Tom consultivo: fale como um parceiro estratégico que entende o problema do cliente',
  tecnico: 'Tom técnico: use termos do setor elétrico/energético, seja específico e preciso',
  comercial: 'Tom comercial: direto, focado em benefícios e resultados, senso de oportunidade',
  inspirador: 'Tom inspirador: motive, use frases de impacto, mostre o que é possível',
  direto: 'Tom direto: frases curtas, objetivas, sem rodeios, vá ao ponto imediatamente',
  estrategico: 'Tom estratégico: visão de longo prazo, posicionamento de mercado, decisões inteligentes',
  emocional: 'Tom emocional moderado: toque em dores reais e aspirações, mas de forma profissional e autêntica',
}

const SEGMENT_CONTEXTS: Record<string, string> = {
  avicultura: 'Avicultura — aviários climatizados, integradores, produtores rurais, riscos com mortalidade de lotes por falta de energia',
  agronegocio: 'Agronegócio — produtores rurais, automação agrícola, armazenagem, irrigação, silos',
  frigorifico: 'Frigoríficos — câmaras frias, abate, exportação, normas sanitárias, risco de perda de produto',
  cooperativa: 'Cooperativas — beneficiadoras, armazéns, logística rural, distribuição para cooperados',
  construcao: 'Construção Civil — canteiros de obras, equipamentos de terraplanagem, prazos contratuais',
  condominio: 'Condomínios — síndicos, administradoras, elevadores, segurança, bombas hidráulicas',
  saude: 'Saúde — hospitais, clínicas, UTI, centros cirúrgicos, normas ANVISA, risco de vida',
  'data-center': 'Data Centers — servidores, SLA, uptime, disponibilidade 24/7, TI crítica',
  industria: 'Indústria — linhas de produção, manufatura, automação industrial, paradas de linha',
  saneamento: 'Saneamento — estações de tratamento de água e esgoto, bombas, aeradores, serviço essencial',
  locadora: 'Locadoras de Equipamentos — frota de geradores, manutenção, disponibilidade, contratos',
  suprimentos: 'Suprimentos/Compras — gestores de compras, supply chain, especificação técnica, custo total',
  parceiros: 'Parceiros Comerciais — representantes, engenheiros consultores, integradoras, revendas',
  geral: 'Mercado geral — múltiplos segmentos, abordagem ampla sobre backup energético no Brasil',
}

function buildUserPrompt(data: GenerateRequest): string {
  const contentTypeDesc = CONTENT_TYPE_DESCRIPTIONS[data.contentType] || data.contentType
  const toneDesc = TONE_DESCRIPTIONS[data.voiceTone] || data.voiceTone
  const segmentCtx = SEGMENT_CONTEXTS[data.segment] || data.segment

  let prompt = `Crie um post para LinkedIn com as seguintes especificações:

TIPO DE CONTEÚDO: ${contentTypeDesc}
TOM DE VOZ: ${toneDesc}
SEGMENTO: ${segmentCtx}
TEMA PRINCIPAL: ${data.theme}
`

  if (data.targetAudience) {
    prompt += `PÚBLICO-ALVO: ${data.targetAudience}\n`
  }
  if (data.objective) {
    prompt += `OBJETIVO DO POST: ${data.objective}\n`
  }
  if (data.callToAction) {
    prompt += `CHAMADA PARA AÇÃO: ${data.callToAction}\n`
  }
  if (data.referenceSource) {
    prompt += `FONTE/REFERÊNCIA: ${data.referenceSource}\n`
  }
  if (data.additionalNotes) {
    prompt += `OBSERVAÇÕES ADICIONAIS: ${data.additionalNotes}\n`
  }

  prompt += `
Retorne APENAS o JSON válido conforme o formato especificado. Nenhum texto fora do JSON.`

  return prompt
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(503).json({ error: 'AI_NOT_CONFIGURED' })
  }

  const data = req.body as GenerateRequest
  if (!data?.theme) {
    return res.status(400).json({ error: 'Campo "theme" é obrigatório' })
  }

  try {
    const client = new Anthropic({ apiKey })

    const message = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: buildUserPrompt(data) },
      ],
    })

    const rawText = message.content[0].type === 'text' ? message.content[0].text.trim() : ''

    // Extract JSON from response (Claude may wrap it in markdown code blocks)
    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Resposta da IA não continha JSON válido')
    }

    const parsed = JSON.parse(jsonMatch[0]) as { content: string; hashtags: string[] }

    if (!parsed.content || !Array.isArray(parsed.hashtags)) {
      throw new Error('Estrutura de resposta inválida')
    }

    return res.status(200).json({
      content: parsed.content,
      hashtags: parsed.hashtags,
      source: 'ai',
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido'
    console.error('[generate] error:', message)
    return res.status(500).json({ error: message })
  }
}
