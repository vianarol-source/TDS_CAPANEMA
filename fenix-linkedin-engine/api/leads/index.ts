import type { VercelRequest, VercelResponse } from '@vercel/node'
import { mockLicenses } from '../_lib/mockLicenses'
import { scoreLicense } from '../_lib/scoringService'
import type { ScoredLicense } from '../_lib/scoringService'
import { getQueryString, getQueryStringOrDefault } from '../_lib/queryHelpers'

// Pré-calcula scores uma vez
const scoredLeads: ScoredLicense[] = mockLicenses.map(scoreLicense)

interface SummaryResult {
  total: number
  avgScore: number
  byClassification: Record<string, number>
  byActivity: Record<string, number>
  byState: Record<string, number>
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const q = getQueryString(req.query.q)
  const classification = getQueryString(req.query.classification)
  const states = getQueryString(req.query.states)
  const type = getQueryString(req.query.type)
  const status = getQueryString(req.query.status)
  const activity = getQueryString(req.query.activity)
  const region = getQueryString(req.query.region)
  const ruralOnly = getQueryString(req.query.ruralOnly)
  const scoreMin = getQueryString(req.query.scoreMin)
  const scoreMax = getQueryString(req.query.scoreMax)
  const issueDateFrom = getQueryString(req.query.issueDateFrom)
  const issueDateTo = getQueryString(req.query.issueDateTo)
  const expiryDateFrom = getQueryString(req.query.expiryDateFrom)
  const expiryDateTo = getQueryString(req.query.expiryDateTo)
  const sortBy = getQueryStringOrDefault(req.query.sortBy, 'score')
  const sortDir = getQueryStringOrDefault(req.query.sortDir, 'desc')
  const page = getQueryStringOrDefault(req.query.page, '1')
  const limit = getQueryStringOrDefault(req.query.limit, '20')
  const format = getQueryString(req.query.format)

  let results: ScoredLicense[] = [...scoredLeads]

  // ── Filtros ──────────────────────────────────────────────
  if (q) {
    const lq = q.toLowerCase()
    results = results.filter(l =>
      l.company.toLowerCase().includes(lq) ||
      l.cnpj.includes(lq) ||
      l.number.toLowerCase().includes(lq) ||
      l.municipality?.toLowerCase().includes(lq)
    )
  }

  if (classification) {
    const cls = classification.split(',').map(s => s.trim())
    results = results.filter(l => cls.includes(l.classification))
  }

  if (states) {
    const sts = states.split(',').filter(Boolean)
    results = results.filter(l => sts.includes(l.state))
  }

  if (type) {
    const types = type.split(',').filter(Boolean)
    results = results.filter(l => types.includes(l.type))
  }

  if (status) {
    const statuses = status.split(',').filter(Boolean)
    results = results.filter(l => statuses.includes(l.status))
  }

  if (activity) {
    const acts = activity.split(',').filter(Boolean)
    results = results.filter(l => acts.includes(l.activity))
  }

  if (region) {
    const regions = region.split(',').filter(Boolean)
    results = results.filter(l => regions.includes(l.region))
  }

  if (ruralOnly === 'true') {
    results = results.filter(l => l.isRuralProducer)
  }

  if (scoreMin) results = results.filter(l => l.score >= Number(scoreMin))
  if (scoreMax) results = results.filter(l => l.score <= Number(scoreMax))

  if (issueDateFrom) results = results.filter(l => l.issueDate >= issueDateFrom)
  if (issueDateTo) results = results.filter(l => l.issueDate <= issueDateTo)
  if (expiryDateFrom) results = results.filter(l => l.expiryDate >= expiryDateFrom)
  if (expiryDateTo) results = results.filter(l => l.expiryDate <= expiryDateTo)

  // ── Ordenação ────────────────────────────────────────────
  results.sort((a, b) => {
    let cmp: number
    switch (sortBy) {
      case 'score': cmp = a.score - b.score; break
      case 'company': cmp = a.company.localeCompare(b.company); break
      case 'state': cmp = a.state.localeCompare(b.state); break
      case 'issueDate': cmp = a.issueDate.localeCompare(b.issueDate); break
      case 'expiryDate': cmp = a.expiryDate.localeCompare(b.expiryDate); break
      case 'activity': cmp = a.activity.localeCompare(b.activity); break
      default: cmp = a.score - b.score
    }
    return sortDir === 'desc' ? -cmp : cmp
  })

  // ── Exportação CSV ───────────────────────────────────────
  if (format === 'csv') {
    const csv = toCSV(results)
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename="leads_geradores.csv"')
    return res.send('﻿' + csv) // BOM para Excel abrir em UTF-8
  }

  // ── Paginação ────────────────────────────────────────────
  const total = results.length
  const pageNum = Math.max(1, Number(page))
  const limitNum = Math.min(100, Math.max(1, Number(limit)))
  const offset = (pageNum - 1) * limitNum
  const data = results.slice(offset, offset + limitNum)

  res.json({
    data,
    pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
    summary: buildSummary(results),
  })
}

function toCSV(leads: ScoredLicense[]): string {
  const headers = [
    'Score', 'Classificação', 'Empresa', 'CNPJ', 'Número Licença', 'Tipo', 'Status',
    'Atividade', 'Produtor Rural', 'Estado', 'Município', 'Região', 'Órgão',
    'Data Emissão', 'Data Validade', 'Ação Sugerida',
  ]

  const rows = leads.map(l => [
    l.score,
    l.classification,
    l.company,
    l.cnpj,
    l.number,
    l.type,
    l.status,
    l.activity,
    l.isRuralProducer ? 'Sim' : 'Não',
    l.state,
    l.municipality,
    l.region,
    l.agency,
    l.issueDate,
    l.expiryDate,
    `"${(l.suggestedAction || '').replace(/"/g, '""')}"`,
  ])

  return [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n')
}

function buildSummary(leads: ScoredLicense[]): SummaryResult {
  const byClassification: Record<string, number> = {}
  const byActivity: Record<string, number> = {}
  const byState: Record<string, number> = {}

  for (const l of leads) {
    byClassification[l.classification] = (byClassification[l.classification] || 0) + 1
    byActivity[l.activity] = (byActivity[l.activity] || 0) + 1
    byState[l.state] = (byState[l.state] || 0) + 1
  }

  const avgScore = leads.length
    ? Math.round(leads.reduce((s, l) => s + l.score, 0) / leads.length)
    : 0

  return { total: leads.length, avgScore, byClassification, byActivity, byState }
}
