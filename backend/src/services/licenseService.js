import axios from 'axios';
import { mockLicenses } from '../data/mockLicenses.js';

const USE_MOCK = process.env.USE_MOCK !== 'false';

// IBAMA open data base URL (dadosabertos.ibama.gov.br)
const IBAMA_BASE_URL = 'https://dadosabertos.ibama.gov.br/dados/SIFISC/auto_infracao';

export async function searchLicenses({ states = [], type, status, query, page = 1, limit = 20 }) {
  if (USE_MOCK) {
    return searchMock({ states, type, status, query, page, limit });
  }
  return searchIBAMA({ states, type, status, query, page, limit });
}

function searchMock({ states, type, status, query, page, limit }) {
  let results = [...mockLicenses];

  if (states.length > 0) {
    results = results.filter(l => states.includes(l.state));
  }
  if (type) {
    results = results.filter(l => l.type === type);
  }
  if (status) {
    results = results.filter(l => l.status === status);
  }
  if (query) {
    const q = query.toLowerCase();
    results = results.filter(l =>
      l.company.toLowerCase().includes(q) ||
      l.cnpj.includes(q) ||
      l.number.toLowerCase().includes(q) ||
      l.municipality.toLowerCase().includes(q)
    );
  }

  const total = results.length;
  const offset = (page - 1) * limit;
  const data = results.slice(offset, offset + limit);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    summary: buildSummary(results),
  };
}

function buildSummary(licenses) {
  const byStatus = {};
  const byType = {};
  const byState = {};

  for (const l of licenses) {
    byStatus[l.status] = (byStatus[l.status] || 0) + 1;
    byType[l.type] = (byType[l.type] || 0) + 1;
    byState[l.state] = (byState[l.state] || 0) + 1;
  }

  return { byStatus, byType, byState, total: licenses.length };
}

async function searchIBAMA({ states, type, status, query, page, limit }) {
  try {
    const params = new URLSearchParams();
    if (states.length > 0) params.set('estado', states.join(','));
    if (type) params.set('tipo_licenca', type);
    if (status) params.set('situacao', status);
    if (query) params.set('q', query);
    params.set('page', page);
    params.set('limit', limit);

    const response = await axios.get(`${IBAMA_BASE_URL}?${params}`, { timeout: 10000 });
    return response.data;
  } catch {
    // Fallback to mock on API failure
    return searchMock({ states, type, status, query, page, limit });
  }
}

export function getStatsSummary(licenses) {
  return buildSummary(licenses);
}
