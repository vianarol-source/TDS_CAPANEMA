// Divisões CNAE que caracterizam Produtor Rural
// Fonte: IBGE – Classificação Nacional de Atividades Econômicas (CNAE 2.0)
export const RURAL_CNAE_DIVISIONS = new Set([
  '01', // Agricultura, pecuária e serviços relacionados
  '02', // Produção florestal
  '03', // Pesca e aquicultura
])

// Palavras-chave na descrição do CNAE que também identificam produtor rural
const RURAL_KEYWORDS = [
  'agricultur', 'pecuári', 'lavoura', 'cultivo', 'criação de',
  'suinicultur', 'avicultur', 'bovinocultur', 'apicultur',
  'silvicultur', 'reflorestamento', 'extrativ', 'madeireiro',
  'pesca', 'aquicultur', 'piscicultur', 'carcinicultur',
  'cooperativa agropecuária', 'produção rural',
]

export function isRuralByCnae(cnaeCode?: string | number | null, cnaeDesc?: string | null): boolean {
  if (!cnaeCode && !cnaeDesc) return false

  if (cnaeCode) {
    const digits = String(cnaeCode).replace(/\D/g, '')
    const division = digits.slice(0, 2)
    if (RURAL_CNAE_DIVISIONS.has(division)) return true
  }

  if (cnaeDesc) {
    const desc = cnaeDesc.toLowerCase()
    if (RURAL_KEYWORDS.some(kw => desc.includes(kw))) return true
  }

  return false
}

export const RURAL_ACTIVITIES = [
  'Agropecuária',
  'Silvicultura',
  'Aquicultura',
]
