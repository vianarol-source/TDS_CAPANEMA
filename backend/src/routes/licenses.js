import { Router } from 'express';
import { query, validationResult } from 'express-validator';
import { searchLicenses } from '../services/licenseService.js';

const router = Router();

router.get(
  '/',
  [
    query('states').optional().isString(),
    query('type').optional().isIn(['LP', 'LI', 'LO', 'LAC', 'LAS', 'LAAS']),
    query('status').optional().isIn(['Ativa', 'Vencida', 'Suspensa', 'Cancelada', 'Em análise']),
    query('q').optional().isString().trim(),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const states = req.query.states ? req.query.states.split(',').filter(Boolean) : [];
    const result = await searchLicenses({
      states,
      type: req.query.type,
      status: req.query.status,
      query: req.query.q,
      page: req.query.page || 1,
      limit: req.query.limit || 20,
    });

    res.json(result);
  }
);

router.get('/:id', async (req, res) => {
  const { mockLicenses } = await import('../data/mockLicenses.js');
  const license = mockLicenses.find(l => l.id === Number(req.params.id));
  if (!license) return res.status(404).json({ error: 'Licença não encontrada' });
  res.json(license);
});

export default router;
