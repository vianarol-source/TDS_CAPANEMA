import type { VercelRequest, VercelResponse } from '@vercel/node'
import { REGIONS } from '../_lib/states.js'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.json(REGIONS)
}
