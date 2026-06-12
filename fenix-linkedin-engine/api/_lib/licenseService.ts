import axios from 'axios'
import { mockLicenses } from './mockLicenses'
import type { License, LicenseStatus, LicenseType } from './mockLicenses'

const USE_MOCK = process.env.USE_MOCK !== 'false'

// IBAMA open data base URL (dadosabertos.ibama.gov.br)
const IBAMA_BASE_URL = 'https://dadosabertos.ibama.gov.br/dados/SIFISC/auto_infracao'

export interface SearchLicensesParams {
  states?: string[]
  type?: LicenseType
  status?: LicenseStatus
  query?: string
  ruralOnly?: boolean
  page?: number
  limit?: number
}

export interface LicenseSummary {
  byStatus: Record<string, number>
  byType: Record<string, number>
  byState: Record<string, number>
  total: number
}

export interface SearchLicensesResult {
  data: License[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  summary: LicenseSummary
}

export async function searchLicenses({
  states = [],
  type,
  status,
  query,
  ruralOnly,
  page = 1,
  limit = 20,
}: SearchLicensesParams): Promise<SearchLicensesResult> {
  if (USE_MOCK) {
    return searchMock({ states, type, status, query, ruralOnly, page, limit })
  }
  return searchIBAMA({ states, type, status, query, page, limit })
}

function searchMock({
  states = [],
  type,
  status,
  query,
  ruralOnly,
  page = 1,
  limit = 20,
}: SearchLicensesParams): SearchLicensesResult {
  let results = [...mockLicenses]

  if (states.length > 0) {
    results = results.filter(l => states.includes(l.state))
  }
  if (type) {
    results = results.filter(l => l.type === type)
  }
  if (status) {
    results = results.filter(l => l.status === status)
  }
  if (ruralOnly) {
    results = results.filter(l => l.isRuralProducer)
  }
  if (query) {
    const q = query.toLowerCase()
    results = results.filter(l =>
      l.company.toLowerCase().includes(q) ||
      l.cnpj.includes(q) ||
      l.number.toLowerCase().includes(q) ||
      l.municipality.toLowerCase().includes(q)
    )
  }

  const total = results.length
  const offset = (page - 1) * limit
  const data = results.slice(offset, offset + limit)

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    summary: buildSummary(results),
  }
}

function buildSummary(licenses: License[]): LicenseSummary {
  const byStatus: Record<string, number> = {}
  const byType: Record<string, number> = {}
  const byState: Record<string, number> = {}

  for (const l of licenses) {
    byStatus[l.status] = (byStatus[l.status] || 0) + 1
    byType[l.type] = (byType[l.type] || 0) + 1
    byState[l.state] = (byState[l.state] || 0) + 1
  }

  return { byStatus, byType, byState, total: licenses.length }
}

async function searchIBAMA({
  states = [],
  type,
  status,
  query,
  page = 1,
  limit = 20,
}: SearchLicensesParams): Promise<SearchLicensesResult> {
  try {
    const params = new URLSearchParams()
    if (states.length > 0) params.set('estado', states.join(','))
    if (type) params.set('tipo_licenca', type)
    if (status) params.set('situacao', status)
    if (query) params.set('q', query)
    params.set('page', String(page))
    params.set('limit', String(limit))

    const response = await axios.get(`${IBAMA_BASE_URL}?${params}`, { timeout: 10000 })
    return response.data as SearchLicensesResult
  } catch {
    // Fallback to mock on API failure
    return searchMock({ states, type, status, query, page, limit })
  }
}

export function getStatsSummary(licenses: License[]): LicenseSummary {
  return buildSummary(licenses)
}
