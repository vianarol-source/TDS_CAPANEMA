import { STATES } from './states'
import { RURAL_ACTIVITIES } from './cnae'

export type LicenseType = 'LP' | 'LI' | 'LO' | 'LAC' | 'LAS' | 'LAAS'
export type LicenseStatus = 'Ativa' | 'Vencida' | 'Suspensa' | 'Cancelada' | 'Em análise'

export interface License {
  id: number
  number: string
  type: LicenseType
  typeLabel: string
  status: LicenseStatus
  company: string
  cnpj: string
  activity: string
  isRuralProducer: boolean
  state: string
  stateName: string
  region: string
  agency: string
  issueDate: string
  expiryDate: string
  municipality: string
  description: string
}

const LICENSE_TYPES: LicenseType[] = ['LP', 'LI', 'LO', 'LAC', 'LAS', 'LAAS']
const LICENSE_TYPE_LABELS: Record<LicenseType, string> = {
  LP: 'Licença Prévia',
  LI: 'Licença de Instalação',
  LO: 'Licença de Operação',
  LAC: 'Licença Ambiental Corretiva',
  LAS: 'Licença Ambiental Simplificada',
  LAAS: 'Licença de Autorização e Supressão',
}

const STATUSES: LicenseStatus[] = ['Ativa', 'Vencida', 'Suspensa', 'Cancelada', 'Em análise']

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
]

const COMPANIES = [
  'Vale S.A.', 'Petrobras', 'BRF S.A.', 'JBS S.A.', 'Suzano S.A.',
  'Fibria Celulose', 'Samarco Mineração', 'Anglo American', 'Braskem',
  'Cemig', 'Copel', 'Eletrobrás', 'Klabin S.A.', 'CPFL Energia',
  'Usiminas', 'Gerdau', 'CSN', 'Votorantim', 'Cargill', 'ADM do Brasil',
  'Embraer', 'WEG', 'Raízen', 'Biosev', 'São Martinho',
]

function randomDate(start: Date, end: Date): string {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    .toISOString().split('T')[0]
}

function generateCNPJ(): string {
  const n = () => Math.floor(Math.random() * 9)
  return `${n()}${n()}.${n()}${n()}${n()}.${n()}${n()}${n()}/${n()}${n()}${n()}${n()}-${n()}${n()}`
}

function generateLicenseNumber(uf: string, year: string, seq: number): string {
  return `${uf}-${year}-${String(seq).padStart(5, '0')}`
}

let idCounter = 1

function generateLicenses(count: number): License[] {
  const licenses: License[] = []
  const now = new Date()
  const twoYearsAgo = new Date(now.getFullYear() - 2, 0, 1)
  const twoYearsAhead = new Date(now.getFullYear() + 2, 11, 31)

  for (let i = 0; i < count; i++) {
    const state = STATES[Math.floor(Math.random() * STATES.length)]
    const type = LICENSE_TYPES[Math.floor(Math.random() * LICENSE_TYPES.length)]
    const issueDate = randomDate(twoYearsAgo, now)
    const expiryDate = randomDate(now, twoYearsAhead)
    const isExpired = new Date(expiryDate) < now
    const status: LicenseStatus = isExpired
      ? (Math.random() > 0.5 ? 'Vencida' : 'Cancelada')
      : STATUSES[Math.floor(Math.random() * 3)]

    const year = issueDate.substring(0, 4)
    const seq = Math.floor(Math.random() * 99999) + 1

    const activity = ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)]
    const isRuralProducer = RURAL_ACTIVITIES.includes(activity)

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
    })
  }

  return licenses
}

export const mockLicenses: License[] = generateLicenses(500)
