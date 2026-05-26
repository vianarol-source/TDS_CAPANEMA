import { Router } from 'express';
import { STATES, REGIONS } from '../data/states.js';

const router = Router();

router.get('/', (req, res) => {
  const { region } = req.query;
  if (region) {
    return res.json(STATES.filter(s => s.region === region));
  }
  res.json(STATES);
});

router.get('/regions', (req, res) => {
  res.json(REGIONS);
});

export default router;
