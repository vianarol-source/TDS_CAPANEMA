import type { VercelRequest, VercelResponse } from '@vercel/node'
import { STATES } from '../_lib/states.js'
import { getQueryString } from '../_lib/queryHelpers.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const region = getQueryString(req.query.region)
  if (region) {
    return res.json(STATES.filter(s => s.region === region))
  }
  res.json(STATES)
}
