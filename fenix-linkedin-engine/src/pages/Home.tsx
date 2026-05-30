import { useNavigate } from 'react-router-dom'
import {
  Zap,
  PenSquare,
  BookOpen,
  CalendarDays,
  ArrowRight,
  Target,
  Users,
  TrendingUp,
  Building2,
  Wheat,
  Factory,
  Heart,
  Server,
  Truck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'

const features = [
  {
    icon: PenSquare,
    title: 'Geração de Conteúdo',
    description: 'Crie posts estratégicos com IA para múltiplos formatos: autoridade, comercial, storytelling, carrossel e mais.',
    color: 'text-navy-600 bg-navy-50',
    link: '/gerar',
  },
  {
    icon: BookOpen,
    title: 'Biblioteca de Posts',
    description: 'Salve, organize e gerencie todos os seus conteúdos com status de rascunho, aprovado ou publicado.',
    color: 'text-gold-600 bg-gold-50',
    link: '/biblioteca',
  },
  {
    icon: CalendarDays,
    title: 'Calendário Editorial',
    description: 'Planejamento semanal inteligente com sugestões de temas por dia da semana para máxima consistência.',
    color: 'text-emerald-600 bg-emerald-50',
    link: '/calendario',
  },
]

const segments = [
  { icon: Wheat, label: 'Avicultura' },
  { icon: Building2, label: 'Construção' },
  { icon: Factory, label: 'Indústria' },
  { icon: Heart, label: 'Saúde' },
  { icon: Server, label: 'Data Centers' },
  { icon: Truck, label: 'Locadoras' },
  { icon: Users, label: 'Cooperativas' },
  { icon: Target, label: 'Parceiros' },
]

const contentTypes = [
  'Post de Autoridade',
  'Post Comercial',
  'Post Educativo',
  'Storytelling',
  'Oportunidade de Mercado',
  'Prospecção Indireta',
  'Atração de Parceiros',
  'Post Institucional',
  'Roteiro de Vídeo',
  'Carrossel LinkedIn',
]

const stats = [
  { value: '10', label: 'Tipos de Conteúdo', icon: Sparkles },
  { value: '8', label: 'Tons de Voz', icon: Target },
  { value: '14', label: 'Segmentos', icon: Building2 },
  { value: '100%', label: 'Focado em Geradores', icon: Zap },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-10">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-navy-900 px-6 py-10 lg:px-10 lg:py-14">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-navy-400 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-300 border border-gold-500/30 rounded-full px-3.5 py-1.5 text-xs font-semibold mb-5">
            <Zap className="w-3.5 h-3.5" />
            FG Soluções Comerciais | Fenix Global
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-4">
            Fenix LinkedIn
            <span className="block text-gold-400">Content Engine</span>
          </h1>

          <p className="text-navy-300 text-base lg:text-lg leading-relaxed mb-8 max-w-2xl">
            Ferramenta estratégica para criação de conteúdo de alta performance no LinkedIn,
            voltada à geração de autoridade, prospecção comercial e desenvolvimento de negócios
            no setor de <span className="text-white font-semibold">grupos geradores de energia</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/gerar')}
              className="btn-gold text-sm px-6 py-3 text-base font-bold shadow-lg shadow-gold-900/20"
            >
              <PenSquare className="w-4 h-4" />
              Criar Conteúdo Agora
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/calendario')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-lg border border-white/20 transition-all duration-200"
            >
              <CalendarDays className="w-4 h-4" />
              Ver Calendário Editorial
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ value, label, icon: Icon }) => (
          <div key={label} className="card text-center py-5">
            <div className="flex justify-center mb-2">
              <div className="w-9 h-9 rounded-lg bg-navy-50 flex items-center justify-center">
                <Icon className="w-4 h-4 text-navy-600" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-navy-900">{value}</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Features */}
      <div>
        <div className="mb-6">
          <h2 className="section-title">O que você pode fazer</h2>
          <p className="section-subtitle">Três módulos integrados para sua estratégia de LinkedIn</p>
        </div>
        <div className="grid lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, description, color, link }) => (
            <div
              key={title}
              className="card-hover group"
              onClick={() => navigate(link)}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-navy-900 text-base mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">{description}</p>
              <div className="flex items-center gap-1.5 text-navy-600 text-sm font-semibold group-hover:gap-2.5 transition-all duration-200">
                Acessar módulo <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Content types */}
        <div className="card">
          <div className="mb-5">
            <h2 className="section-title">Tipos de Conteúdo</h2>
            <p className="section-subtitle">10 formatos estratégicos disponíveis</p>
          </div>
          <div className="space-y-2">
            {contentTypes.map(type => (
              <div key={type} className="flex items-center gap-2.5 text-sm text-navy-700">
                <CheckCircle2 className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <span className="font-medium">{type}</span>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <button onClick={() => navigate('/gerar')} className="btn-primary w-full justify-center">
              <PenSquare className="w-4 h-4" />
              Começar a Criar
            </button>
          </div>
        </div>

        {/* Segments */}
        <div className="card">
          <div className="mb-5">
            <h2 className="section-title">Segmentos Atendidos</h2>
            <p className="section-subtitle">Conteúdo contextualizado por setor</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {segments.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 p-3 rounded-lg bg-gray-50 hover:bg-navy-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-md bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                  <Icon className="w-4 h-4 text-navy-600" />
                </div>
                <span className="text-sm font-medium text-navy-700">{label}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 p-3.5 bg-navy-50 rounded-lg border border-navy-100">
            <p className="text-xs text-navy-600 leading-relaxed">
              <span className="font-semibold">Representação comercial: </span>
              Geradores Capanema — Fabricante brasileira de grupos geradores diesel
              com portfólio completo para todos os segmentos.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Bottom */}
      <div className="rounded-xl bg-gradient-to-r from-navy-800 to-navy-900 p-6 lg:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div>
          <h3 className="text-white font-bold text-lg mb-1">Pronto para criar seu próximo conteúdo?</h3>
          <p className="text-navy-300 text-sm">Preencha o formulário e gere um post estratégico em segundos.</p>
        </div>
        <button
          onClick={() => navigate('/gerar')}
          className="btn-gold flex-shrink-0 px-6 py-3 text-sm font-bold whitespace-nowrap"
        >
          <Zap className="w-4 h-4" />
          Gerar Conteúdo
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
