import type { VercelRequest, VercelResponse } from '@vercel/node'
import { searchLicenses } from '../_lib/licenseService'
import { getQueryString } from '../_lib/queryHelpers'
import type { LicenseStatus, LicenseType } from '../_lib/mockLicenses'

const VALID_TYPES: LicenseType[] = ['LP', 'LI', 'LO', 'LAC', 'LAS', 'LAAS']
const VALID_STATUSES: LicenseStatus[] = ['Ativa', 'Vencida', 'Suspensa', 'Cancelada', 'Em análise']

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const statesRaw = getQueryString(req.query.states)
  const typeRaw = getQueryString(req.query.type)
  const statusRaw = getQueryString(req.query.status)
  const qRaw = getQueryString(req.query.q)
  const pageRaw = getQueryString(req.query.page)
  const limitRaw = getQueryString(req.query.limit)
  const ruralOnlyRaw = getQueryString(req.query.ruralOnly)

  // ── Validação manual (substitui express-validator) ────────
  if (typeRaw !== undefined && !VALID_TYPES.includes(typeRaw as LicenseType)) {
    return res.status(400).json({ error: `Parâmetro "type" inválido. Valores aceitos: ${VALID_TYPES.join(', ')}` })
  }

  if (statusRaw !== undefined && !VALID_STATUSES.includes(statusRaw as LicenseStatus)) {
    return res.status(400).json({ error: `Parâmetro "status" inválido. Valores aceitos: ${VALID_STATUSES.join(', ')}` })
  }

  let page = 1
  if (pageRaw !== undefined) {
    const parsed = Number.parseInt(pageRaw, 10)
    if (!Number.isInteger(parsed) || parsed < 1 || String(parsed) !== pageRaw.trim()) {
      return res.status(400).json({ error: 'Parâmetro "page" inválido. Deve ser um inteiro >= 1.' })
    }
    page = parsed
  }

  let limit = 20
  if (limitRaw !== undefined) {
    const parsed = Number.parseInt(limitRaw, 10)
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 100 || String(parsed) !== limitRaw.trim()) {
      return res.status(400).json({ error: 'Parâmetro "limit" inválido. Deve ser um inteiro entre 1 e 100.' })
    }
    limit = parsed
  }

  const states = statesRaw ? statesRaw.split(',').filter(Boolean) : []
  const ruralOnly = ruralOnlyRaw === 'true'

  const result = await searchLicenses({
    states,
    type: typeRaw as LicenseType | undefined,
    status: statusRaw as LicenseStatus | undefined,
    query: qRaw?.trim(),
    ruralOnly,
    page,
    limit,
  })

  res.json(result)
}
