import { STATES } from './states.js';
import { RURAL_ACTIVITIES } from './cnae.js';

const LICENSE_TYPES = ['LP', 'LI', 'LO', 'LAC', 'LAS', 'LAAS'];
const LICENSE_TYPE_LABELS = {
  LP: 'Licença Prévia',
  LI: 'Licença de Instalação',
  LO: 'Licença de Operação',
  LAC: 'Licença Ambiental Corretiva',
  LAS: 'Licença Ambiental Simplificada',
  LAAS: 'Licença de Autorização e Supressão',
};

const STATUSES = ['Ativa', 'Vencida', 'Suspensa', 'Cancelada', 'Em análise'];

const ACTIVITIES = [
  'Indústria de Transformação',
  'Mineração',
  'Agropecuária',
  'Infraestrutura Viária',
  'Geração de Energia',
  'Petróleo e Gás',
  'Saneamento',
  'Comércio e Serviços',
  'Silvicultura',
  'Aquicultura',
];

const COMPANIES = [
  'Vale S.A.', 'Petrobras', 'BRF S.A.', 'JBS S.A.', 'Suzano S.A.',
  'Fibria Celulose', 'Samarco Mineração', 'Anglo American', 'Braskem',
  'Cemig', 'Copel', 'Eletrobrás', 'Klabin S.A.', 'CPFL Energia',
  'Usiminas', 'Gerdau', 'CSN', 'Votorantim', 'Cargill', 'ADM do Brasil',
  'Embraer', 'WEG', 'Raízen', 'Biosev', 'São Martinho',
];

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    .toISOString().split('T')[0];
}

function generateCNPJ() {
  const n = () => Math.floor(Math.random() * 9);
  return `${n()}${n()}.${n()}${n()}${n()}.${n()}${n()}${n()}/${n()}${n()}${n()}${n()}-${n()}${n()}`;
}

function generateLicenseNumber(uf, year, seq) {
  return `${uf}-${year}-${String(seq).padStart(5, '0')}`;
}

let idCounter = 1;

function generateLicenses(count) {
  const licenses = [];
  const now = new Date();
  const twoYearsAgo = new Date(now.getFullYear() - 2, 0, 1);
  const twoYearsAhead = new Date(now.getFullYear() + 2, 11, 31);

  for (let i = 0; i < count; i++) {
    const state = STATES[Math.floor(Math.random() * STATES.length)];
    const type = LICENSE_TYPES[Math.floor(Math.random() * LICENSE_TYPES.length)];
    const issueDate = randomDate(twoYearsAgo, now);
    const expiryDate = randomDate(now, twoYearsAhead);
    const isExpired = new Date(expiryDate) < now;
    const status = isExpired
      ? (Math.random() > 0.5 ? 'Vencida' : 'Cancelada')
      : STATUSES[Math.floor(Math.random() * 3)];

    const year = issueDate.substring(0, 4);
    const seq = Math.floor(Math.random() * 99999) + 1;

    const activity = ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)];
    const isRuralProducer = RURAL_ACTIVITIES.includes(activity);

    licenses.push({
      id: idCounter++,
      number: generateLicenseNumber(state.uf, year, seq),
      type,
      typeLabel: LICENSE_TYPE_LABELS[type],
      status,
      company: COMPANIES[Math.floor(Math.random() * COMPANIES.length)],
      cnpj: generateCNPJ(),
      activity,
      isRuralProducer,
      state: state.uf,
      stateName: state.name,
      region: state.region,
      agency: state.agency,
      issueDate,
      expiryDate,
      municipality: `Município ${Math.floor(Math.random() * 100) + 1}`,
      description: `Licença ${LICENSE_TYPE_LABELS[type]} para atividade de ${activity.toLowerCase()} no estado de ${state.name}.`,
    });
  }

  return licenses;
}

export const mockLicenses = generateLicenses(500);
