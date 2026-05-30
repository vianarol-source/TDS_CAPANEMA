import { useNavigate } from 'react-router-dom'
import {
  CalendarDays,
  PenSquare,
  ArrowRight,
  Target,
  Lightbulb,
  TrendingUp,
  Users,
  Building2,
  Zap,
  BookOpen,
  Star,
} from 'lucide-react'
import { ContentType, MarketSegment } from '../types'

interface DayPlan {
  day: number
  dayName: string
  shortName: string
  theme: string
  contentType: ContentType
  contentTypeLabel: string
  segment: MarketSegment
  icon: React.ElementType
  color: string
  bgColor: string
  borderColor: string
  description: string
  suggestedThemes: string[]
  objective: string
  tone: string
}

const weekPlan: DayPlan[] = [
  {
    day: 1,
    dayName: 'Segunda-feira',
    shortName: 'Seg',
    theme: 'Autoridade Técnica',
    contentType: 'autoridade',
    contentTypeLabel: 'Post de Autoridade',
    segment: 'geral',
    icon: Star,
    color: 'text-navy-600',
    bgColor: 'bg-navy-50',
    borderColor: 'border-navy-200',
    description: 'Demonstre expertise técnica no setor de grupos geradores. Posts que educam e posicionam a FG Soluções como referência.',
    suggestedThemes: [
      'Dimensionamento correto de grupos geradores',
      'Diferença entre grupo gerador e nobreak',
      'Quando investir em gerador trifásico',
      'Manutenção preventiva vs. corretiva em geradores',
    ],
    objective: 'Construir autoridade e reconhecimento técnico',
    tone: 'Técnico / Profissional',
  },
  {
    day: 2,
    dayName: 'Terça-feira',
    shortName: 'Ter',
    theme: 'Oportunidade de Mercado',
    contentType: 'oportunidade',
    contentTypeLabel: 'Oportunidade de Mercado',
    segment: 'agronegocio',
    icon: TrendingUp,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    description: 'Explore tendências do mercado, dados do setor e janelas de oportunidade para os segmentos-alvo.',
    suggestedThemes: [
      'Expansão do agronegócio e demanda por energia backup',
      'Crescimento de data centers no Brasil',
      'Instabilidade elétrica nas regiões Norte e Nordeste',
      'Novas regulamentações de segurança energética',
    ],
    objective: 'Gerar awareness e despertar interesse',
    tone: 'Estratégico / Comercial',
  },
  {
    day: 3,
    dayName: 'Quarta-feira',
    shortName: 'Qua',
    theme: 'Conteúdo Educativo',
    contentType: 'educativo',
    contentTypeLabel: 'Post Educativo',
    segment: 'geral',
    icon: Lightbulb,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    description: 'Conteúdos que ensinam e agregam valor genuíno ao público. Ótimos para engajamento e salvamentos.',
    suggestedThemes: [
      '5 erros ao escolher um grupo gerador',
      'Como calcular a potência necessária para sua operação',
      'Diesel vs. gás natural: qual combustível escolher?',
      'Checklist de manutenção mensal para geradores',
    ],
    objective: 'Gerar engajamento e compartilhamentos',
    tone: 'Consultivo / Educativo',
  },
  {
    day: 4,
    dayName: 'Quinta-feira',
    shortName: 'Qui',
    theme: 'Parceria Comercial',
    contentType: 'parceiros',
    contentTypeLabel: 'Atração de Parceiros',
    segment: 'parceiros',
    icon: Users,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    description: 'Posts voltados a atrair representantes, consultores e parceiros que atuam nos segmentos-alvo.',
    suggestedThemes: [
      'Parceria para atender integradores avícolas',
      'Oportunidade para engenheiros eletricistas consultores',
      'Representantes comerciais: expanda seu portfólio',
      'Empresas de facilities: solucionamos sua energia',
    ],
    objective: 'Atrair parceiros e representantes',
    tone: 'Comercial / Direto',
  },
  {
    day: 5,
    dayName: 'Sexta-feira',
    shortName: 'Sex',
    theme: 'Institucional ou Storytelling',
    contentType: 'storytelling',
    contentTypeLabel: 'Storytelling / Institucional',
    segment: 'geral',
    icon: Building2,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    description: 'Histórias reais, cases de sucesso e posts institucionais que humanizam a marca e criam conexão.',
    suggestedThemes: [
      'Como ajudamos um frigorifico a evitar parada de produção',
      'Por que fundamos a FG Soluções Comerciais',
      'Caso real: gerador que salvou uma colheita',
      'O que nos motivou a representar a Geradores Capanema',
    ],
    objective: 'Criar conexão emocional e confiança',
    tone: 'Emocional Moderado / Inspirador',
  },
]

interface DayCardProps {
  plan: DayPlan
  onGenerate: (plan: DayPlan) => void
  isToday?: boolean
}

function DayCard({ plan, onGenerate, isToday }: DayCardProps) {
  const Icon = plan.icon

  return (
    <div
      className={`card hover:shadow-card-hover transition-all duration-200 ${
        isToday ? 'ring-2 ring-gold-400 ring-offset-2' : ''
      }`}
    >
      {isToday && (
        <div className="flex items-center gap-1.5 mb-3">
          <Zap className="w-3.5 h-3.5 text-gold-500" />
          <span className="text-xs font-bold text-gold-600 uppercase tracking-wider">Hoje</span>
        </div>
      )}

      {/* Day header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.bgColor} flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${plan.color}`} />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{plan.shortName}</p>
          <p className="font-bold text-navy-900 text-sm">{plan.dayName}</p>
        </div>
      </div>

      {/* Theme */}
      <div className={`rounded-lg border px-3 py-2 mb-4 ${plan.bgColor} ${plan.borderColor}`}>
        <p className={`text-xs font-bold uppercase tracking-wider ${plan.color} mb-0.5`}>Tema</p>
        <p className="text-sm font-semibold text-navy-900">{plan.theme}</p>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-500 leading-relaxed mb-4">{plan.description}</p>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-gray-50 rounded-lg p-2.5">
          <p className="text-xs text-gray-400 font-medium mb-0.5">Tipo</p>
          <p className="text-xs font-semibold text-navy-700 leading-tight">{plan.contentTypeLabel}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2.5">
          <p className="text-xs text-gray-400 font-medium mb-0.5">Tom</p>
          <p className="text-xs font-semibold text-navy-700 leading-tight">{plan.tone}</p>
        </div>
      </div>

      {/* Suggested themes */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Sugestões de Tema
        </p>
        <ul className="space-y-1.5">
          {plan.suggestedThemes.map((theme, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-navy-700">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-1.5 flex-shrink-0" />
              {theme}
            </li>
          ))}
        </ul>
      </div>

      {/* Objective */}
      <div className="flex items-start gap-2 p-3 bg-navy-50 rounded-lg border border-navy-100 mb-4">
        <Target className="w-3.5 h-3.5 text-navy-500 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-navy-600 leading-relaxed">
          <span className="font-semibold">Objetivo: </span>{plan.objective}
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={() => onGenerate(plan)}
        className="btn-primary w-full justify-center text-xs py-2.5"
      >
        <PenSquare className="w-3.5 h-3.5" />
        Criar post de {plan.shortName}
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

export default function Calendar() {
  const navigate = useNavigate()

  const todayDow = new Date().getDay()

  function handleGenerate(plan: DayPlan) {
    navigate('/gerar', {
      state: {
        prefill: {
          contentType: plan.contentType,
          segment: plan.segment,
          objective: plan.objective,
          voiceTone: plan.tone.toLowerCase().includes('técnico') ? 'tecnico' :
            plan.tone.toLowerCase().includes('emocional') ? 'emocional' :
            plan.tone.toLowerCase().includes('inspirador') ? 'inspirador' :
            plan.tone.toLowerCase().includes('comercial') ? 'comercial' :
            plan.tone.toLowerCase().includes('estratégico') ? 'estrategico' :
            plan.tone.toLowerCase().includes('consultivo') ? 'consultivo' : 'profissional',
        }
      }
    })
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-7 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays className="w-5 h-5 text-navy-600" />
            <h1 className="section-title">Calendário Editorial</h1>
          </div>
          <p className="section-subtitle">
            Planejamento semanal estratégico para máxima consistência no LinkedIn
          </p>
        </div>
        <button onClick={() => navigate('/biblioteca')} className="btn-secondary flex-shrink-0">
          <BookOpen className="w-4 h-4" />
          Ver Biblioteca
        </button>
      </div>

      {/* Strategy strip */}
      <div className="rounded-xl bg-gradient-to-r from-navy-800 to-navy-900 p-4 lg:p-5 mb-7 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gold-500/20 flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-gold-400" />
        </div>
        <div className="flex-1">
          <p className="text-white font-semibold text-sm mb-1">Estratégia de Publicação Recomendada</p>
          <p className="text-navy-300 text-xs leading-relaxed">
            Publicar 5x por semana com temas variados cria autoridade, gera leads e atrai parceiros de forma consistente.
            Use este calendário como guia e adapte os temas à realidade da semana.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-white/10 text-white border border-white/20 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap">
          <Target className="w-3.5 h-3.5 text-gold-400" />
          5 posts / semana
        </div>
      </div>

      {/* Calendar grid */}
      <div className="grid lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {weekPlan.map(plan => (
          <DayCard
            key={plan.day}
            plan={plan}
            onGenerate={handleGenerate}
            isToday={plan.day === todayDow}
          />
        ))}
      </div>

      {/* Tips */}
      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        {[
          {
            icon: Lightbulb,
            title: 'Consistência é tudo',
            desc: 'O algoritmo do LinkedIn privilegia criadores consistentes. Publicar regularmente é mais importante que publicar perfeitamente.',
          },
          {
            icon: TrendingUp,
            title: 'Meça o desempenho',
            desc: 'Acompanhe impressões, engajamento e mensagens recebidas. Os posts que geram mais DMs são os mais valiosos.',
          },
          {
            icon: Users,
            title: 'Responda sempre',
            desc: 'Responder comentários nas primeiras horas aumenta o alcance. Uma conversa nos comentários é um sinal positivo para o algoritmo.',
          },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card">
            <div className="w-9 h-9 rounded-lg bg-navy-50 flex items-center justify-center mb-3">
              <Icon className="w-4 h-4 text-navy-600" />
            </div>
            <p className="font-bold text-navy-800 text-sm mb-1.5">{title}</p>
            <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
