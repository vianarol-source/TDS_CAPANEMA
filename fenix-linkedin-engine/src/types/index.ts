export type ContentType =
  | 'autoridade'
  | 'comercial'
  | 'educativo'
  | 'storytelling'
  | 'oportunidade'
  | 'prospeccao-indireta'
  | 'parceiros'
  | 'institucional'
  | 'roteiro-video'
  | 'carrossel'

export type VoiceTone =
  | 'profissional'
  | 'consultivo'
  | 'tecnico'
  | 'comercial'
  | 'inspirador'
  | 'direto'
  | 'estrategico'
  | 'emocional'

export type PostStatus = 'rascunho' | 'aprovado' | 'publicado'

export type MarketSegment =
  | 'avicultura'
  | 'agronegocio'
  | 'frigorifico'
  | 'cooperativa'
  | 'construcao'
  | 'condominio'
  | 'saude'
  | 'data-center'
  | 'industria'
  | 'saneamento'
  | 'locadora'
  | 'suprimentos'
  | 'parceiros'
  | 'geral'

export interface ContentFormData {
  theme: string
  segment: MarketSegment
  targetAudience: string
  objective: string
  voiceTone: VoiceTone
  contentType: ContentType
  callToAction: string
  referenceSource: string
  additionalNotes: string
}

export interface SavedPost {
  id: string
  createdAt: string
  theme: string
  segment: MarketSegment
  contentType: ContentType
  status: PostStatus
  content: string
  hashtags: string[]
  formData: ContentFormData
}

export interface CalendarEntry {
  dayOfWeek: number
  dayName: string
  theme: string
  contentType: ContentType
  description: string
  suggestion: string
}

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  autoridade: 'Post de Autoridade',
  comercial: 'Post Comercial',
  educativo: 'Post Educativo',
  storytelling: 'Post com Storytelling',
  oportunidade: 'Oportunidade de Mercado',
  'prospeccao-indireta': 'Prospecção Indireta',
  parceiros: 'Atração de Parceiros',
  institucional: 'Post Institucional',
  'roteiro-video': 'Roteiro de Vídeo Curto',
  carrossel: 'Carrossel para LinkedIn',
}

export const VOICE_TONE_LABELS: Record<VoiceTone, string> = {
  profissional: 'Profissional',
  consultivo: 'Consultivo',
  tecnico: 'Técnico',
  comercial: 'Comercial',
  inspirador: 'Inspirador',
  direto: 'Direto',
  estrategico: 'Estratégico',
  emocional: 'Emocional Moderado',
}

export const SEGMENT_LABELS: Record<MarketSegment, string> = {
  avicultura: 'Avicultura',
  agronegocio: 'Agronegócio',
  frigorifico: 'Frigoríficos',
  cooperativa: 'Cooperativas',
  construcao: 'Construção Civil',
  condominio: 'Condomínios',
  saude: 'Saúde (Hospitais/Clínicas)',
  'data-center': 'Data Centers',
  industria: 'Indústria',
  saneamento: 'Saneamento',
  locadora: 'Locadoras de Equipamentos',
  suprimentos: 'Suprimentos / Compras',
  parceiros: 'Parceiros Comerciais',
  geral: 'Geral / Múltiplos Segmentos',
}

export const STATUS_LABELS: Record<PostStatus, string> = {
  rascunho: 'Rascunho',
  aprovado: 'Aprovado',
  publicado: 'Publicado',
}

export const STATUS_COLORS: Record<PostStatus, string> = {
  rascunho: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  aprovado: 'bg-green-100 text-green-800 border-green-200',
  publicado: 'bg-blue-100 text-blue-800 border-blue-200',
}
