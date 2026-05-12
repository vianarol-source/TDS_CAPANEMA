import { Router } from 'express';
import { mockLicenses } from '../data/mockLicenses.js';
import { scoreLicense } from '../services/scoringService.js';

const router = Router();

// Pré-calcula scores uma vez
const scoredLeads = mockLicenses.map(scoreLicense);

router.get('/', (req, res) => {
  const {
    q,
    classification,   // Hot | Warm | Nurturing | Cold (multi: "Hot,Warm")
    states,           // "SP,RJ"
    type,             // LP | LI | LO | LAC | LAS | LAAS (multi)
    status,           // Ativa | Vencida | ...
    activity,         // multi
    region,           // Norte | Nordeste | ...
    ruralOnly,
    scoreMin,
    scoreMax,
    issueDateFrom,
    issueDateTo,
    expiryDateFrom,
    expiryDateTo,
    sortBy   = 'score',    // score | issueDate | expiryDate | company | state
    sortDir  = 'desc',     // asc | desc
    page     = '1',
    limit    = '20',
    format,                // csv
  } = req.query;

  let results = [...scoredLeads];

  // ── Filtros ──────────────────────────────────────────────
  if (q) {
    const lq = q.toLowerCase();
    results = results.filter(l =>
      l.company.toLowerCase().includes(lq) ||
      l.cnpj.includes(lq) ||
      l.number.toLowerCase().includes(lq) ||
      l.municipality?.toLowerCase().includes(lq)
    );
  }

  if (classification) {
    const cls = classification.split(',').map(s => s.trim());
    results = results.filter(l => cls.includes(l.classification));
  }

  if (states) {
    const sts = states.split(',').filter(Boolean);
    results = results.filter(l => sts.includes(l.state));
  }

  if (type) {
    const types = type.split(',').filter(Boolean);
    results = results.filter(l => types.includes(l.type));
  }

  if (status) {
    const statuses = status.split(',').filter(Boolean);
    results = results.filter(l => statuses.includes(l.status));
  }

  if (activity) {
    const acts = activity.split(',').filter(Boolean);
    results = results.filter(l => acts.includes(l.activity));
  }

  if (region) {
    const regions = region.split(',').filter(Boolean);
    results = results.filter(l => regions.includes(l.region));
  }

  if (ruralOnly === 'true') {
    results = results.filter(l => l.isRuralProducer);
  }

  if (scoreMin) results = results.filter(l => l.score >= Number(scoreMin));
  if (scoreMax) results = results.filter(l => l.score <= Number(scoreMax));

  if (issueDateFrom) results = results.filter(l => l.issueDate >= issueDateFrom);
  if (issueDateTo)   results = results.filter(l => l.issueDate <= issueDateTo);
  if (expiryDateFrom) results = results.filter(l => l.expiryDate >= expiryDateFrom);
  if (expiryDateTo)   results = results.filter(l => l.expiryDate <= expiryDateTo);

  // ── Ordenação ────────────────────────────────────────────
  results.sort((a, b) => {
    let cmp;
    switch (sortBy) {
      case 'score':      cmp = a.score - b.score;                      break;
      case 'company':    cmp = a.company.localeCompare(b.company);     break;
      case 'state':      cmp = a.state.localeCompare(b.state);         break;
      case 'issueDate':  cmp = a.issueDate.localeCompare(b.issueDate); break;
      case 'expiryDate': cmp = a.expiryDate.localeCompare(b.expiryDate); break;
      case 'activity':   cmp = a.activity.localeCompare(b.activity);   break;
      default:           cmp = a.score - b.score;
    }
    return sortDir === 'desc' ? -cmp : cmp;
  });

  // ── Exportação CSV ───────────────────────────────────────
  if (format === 'csv') {
    const csv = toCSV(results);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="leads_geradores.csv"');
    return res.send('﻿' + csv); // BOM para Excel abrir em UTF-8
  }

  // ── Paginação ────────────────────────────────────────────
  const total    = results.length;
  const pageNum  = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));
  const offset   = (pageNum - 1) * limitNum;
  const data     = results.slice(offset, offset + limitNum);

  res.json({
    data,
    pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
    summary: buildSummary(results),
  });
});

function toCSV(leads) {
  const headers = [
    'Score','Classificação','Empresa','CNPJ','Número Licença','Tipo','Status',
    'Atividade','Produtor Rural','Estado','Município','Região','Órgão',
    'Data Emissão','Data Validade','Ação Sugerida',
  ];

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
  ]);

  return [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
}

function buildSummary(leads) {
  const byClassification = {};
  const byActivity = {};
  const byState = {};

  for (const l of leads) {
    byClassification[l.classification] = (byClassification[l.classification] || 0) + 1;
    byActivity[l.activity] = (byActivity[l.activity] || 0) + 1;
    byState[l.state] = (byState[l.state] || 0) + 1;
  }

  const avgScore = leads.length
    ? Math.round(leads.reduce((s, l) => s + l.score, 0) / leads.length)
    : 0;

  return { total: leads.length, avgScore, byClassification, byActivity, byState };
}

export default router;
