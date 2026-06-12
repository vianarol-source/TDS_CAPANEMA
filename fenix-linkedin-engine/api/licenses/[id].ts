import type { VercelRequest, VercelResponse } from '@vercel/node'
import { mockLicenses } from '../_lib/mockLicenses.js'
import { getQueryString } from '../_lib/queryHelpers.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const idParam = getQueryString(req.query.id)
  const license = mockLicenses.find(l => l.id === Number(idParam))
  if (!license) return res.status(404).json({ error: 'Licença não encontrada' })
  res.json(license)
}
