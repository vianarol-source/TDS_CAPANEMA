export interface StateInfo {
  uf: string
  name: string
  region: string
  agency: string
}

export const STATES: StateInfo[] = [
  { uf: 'AC', name: 'Acre', region: 'Norte', agency: 'IMAC' },
  { uf: 'AL', name: 'Alagoas', region: 'Nordeste', agency: 'IMA-AL' },
  { uf: 'AP', name: 'Amapá', region: 'Norte', agency: 'SEMA-AP' },
  { uf: 'AM', name: 'Amazonas', region: 'Norte', agency: 'IPAAM' },
  { uf: 'BA', name: 'Bahia', region: 'Nordeste', agency: 'INEMA' },
  { uf: 'CE', name: 'Ceará', region: 'Nordeste', agency: 'SEMACE' },
  { uf: 'DF', name: 'Distrito Federal', region: 'Centro-Oeste', agency: 'IBRAM-DF' },
  { uf: 'ES', name: 'Espírito Santo', region: 'Sudeste', agency: 'IEMA-ES' },
  { uf: 'GO', name: 'Goiás', region: 'Centro-Oeste', agency: 'SEMAD-GO' },
  { uf: 'MA', name: 'Maranhão', region: 'Nordeste', agency: 'SEMA-MA' },
  { uf: 'MT', name: 'Mato Grosso', region: 'Centro-Oeste', agency: 'SEMA-MT' },
  { uf: 'MS', name: 'Mato Grosso do Sul', region: 'Centro-Oeste', agency: 'IMASUL' },
  { uf: 'MG', name: 'Minas Gerais', region: 'Sudeste', agency: 'SUPRAM/SEMAD' },
  { uf: 'PA', name: 'Pará', region: 'Norte', agency: 'SEMAS-PA' },
  { uf: 'PB', name: 'Paraíba', region: 'Nordeste', agency: 'SUDEMA' },
  { uf: 'PR', name: 'Paraná', region: 'Sul', agency: 'IAT' },
  { uf: 'PE', name: 'Pernambuco', region: 'Nordeste', agency: 'CPRH' },
  { uf: 'PI', name: 'Piauí', region: 'Nordeste', agency: 'SEMAR-PI' },
  { uf: 'RJ', name: 'Rio de Janeiro', region: 'Sudeste', agency: 'INEA' },
  { uf: 'RN', name: 'Rio Grande do Norte', region: 'Nordeste', agency: 'IDEMA-RN' },
  { uf: 'RS', name: 'Rio Grande do Sul', region: 'Sul', agency: 'FEPAM' },
  { uf: 'RO', name: 'Rondônia', region: 'Norte', agency: 'SEDAM' },
  { uf: 'RR', name: 'Roraima', region: 'Norte', agency: 'FEMACT' },
  { uf: 'SC', name: 'Santa Catarina', region: 'Sul', agency: 'IMA-SC' },
  { uf: 'SP', name: 'São Paulo', region: 'Sudeste', agency: 'CETESB' },
  { uf: 'SE', name: 'Sergipe', region: 'Nordeste', agency: 'ADEMA' },
  { uf: 'TO', name: 'Tocantins', region: 'Norte', agency: 'NATURATINS' },
]

export const REGIONS = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul']
