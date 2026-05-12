import { RURAL_ACTIVITIES } from '../data/cnae.js';

const NORTH_STATES   = new Set(['AM','PA','RR','AP','AC','RO','TO']);
const MATOPIBA       = new Set(['MA','TO','PI','BA']);
const STABLE_CAPITALS = new Set(['SP','RJ','DF']);

const ACTIVITY_SCORE = {
  'Mineração':               35,
  'Petróleo e Gás':          35,
  'Aquicultura':             30,
  'Agropecuária':            25,
  'Silvicultura':            22,
  'Infraestrutura Viária':   20,
  'Indústria de Transformação': 20,
  'Geração de Energia':      15,
  'Saneamento':              12,
  'Comércio e Serviços':     10,
};

const TYPE_SCORE = {
  LI:   30,
  LAC:  25,
  LO:   20,
  LAS:  18,
  LP:   15,
  LAAS: 12,
};

function geoScore(uf) {
  if (NORTH_STATES.has(uf))   return 20;
  if (MATOPIBA.has(uf))       return 15;
  if (STABLE_CAPITALS.has(uf)) return 5;
  return 10;
}

function timingScore(type, status, issueDate, expiryDate) {
  const now  = new Date();
  const issue  = new Date(issueDate);
  const expiry = new Date(expiryDate);
  const daysSinceIssue  = (now - issue)  / 86400000;
  const daysUntilExpiry = (expiry - now) / 86400000;

  if (type === 'LI') {
    if (daysSinceIssue <= 30)  return 15;
    if (daysSinceIssue <= 90)  return 10;
    if (daysSinceIssue <= 180) return 6;
    return 3;
  }

  if (status === 'Vencida')    return 25;
  if (status === 'Suspensa')   return 18;
  if (status === 'Em análise') return 10;

  if (daysUntilExpiry >= 0) {
    if (daysUntilExpiry <= 90)  return 12;
    if (daysUntilExpiry <= 180) return 8;
    if (daysUntilExpiry <= 365) return 5;
  }

  return 3;
}

export function scoreLicense(license) {
  const s1 = TYPE_SCORE[license.type] ?? 10;
  const s2 = ACTIVITY_SCORE[license.activity] ?? 10;
  const s3 = geoScore(license.state);
  const s4 = timingScore(license.type, license.status, license.issueDate, license.expiryDate);

  const total = Math.min(100, s1 + s2 + s3 + s4);

  let classification, priority, action;
  if (total >= 80) {
    classification = 'Hot';
    priority = 1;
    action = buildAction(license, total);
  } else if (total >= 60) {
    classification = 'Warm';
    priority = 2;
    action = buildAction(license, total);
  } else if (total >= 40) {
    classification = 'Nurturing';
    priority = 3;
    action = buildAction(license, total);
  } else {
    classification = 'Cold';
    priority = 4;
    action = 'Monitorar renovação futura';
  }

  return {
    ...license,
    score: total,
    scoreBreakdown: { licenseType: s1, activity: s2, geography: s3, timing: s4 },
    classification,
    priority,
    suggestedAction: action,
  };
}

function buildAction(license, score) {
  const { type, status, activity, stateName, municipality } = license;

  if (type === 'LI') {
    const days = Math.floor((new Date() - new Date(license.issueDate)) / 86400000);
    return `LI emitida há ${days} dias — obra iniciando em ${municipality}/${stateName}. Contatar para gerador de canteiro.`;
  }
  if (status === 'Vencida') {
    return `Licença vencida — risco de autuação. Gerador garante continuidade operacional durante regularização.`;
  }
  if (status === 'Suspensa') {
    return `Operação suspensa — gerador como parte do plano de retomada e conformidade.`;
  }
  if (activity === 'Mineração' || activity === 'Petróleo e Gás') {
    return `Operação crítica em área remota. Proposta de gerador de stand-by + contrato de manutenção.`;
  }
  if (activity === 'Aquicultura') {
    return `Aquicultura: interrupção de energia = perda total do estoque. Vender urgência de redundância.`;
  }
  if (RURAL_ACTIVITIES.includes(activity)) {
    return `Produtor rural: irrigação, câmara fria e ordenha dependem de energia contínua.`;
  }
  const daysExpiry = Math.floor((new Date(license.expiryDate) - new Date()) / 86400000);
  if (daysExpiry >= 0 && daysExpiry <= 180) {
    return `LO vence em ${daysExpiry} dias — ciclo de renovação é oportunidade de upgrade de contrato.`;
  }
  return `Operação ativa em ${stateName}. Proposta de backup e manutenção preventiva.`;
}
