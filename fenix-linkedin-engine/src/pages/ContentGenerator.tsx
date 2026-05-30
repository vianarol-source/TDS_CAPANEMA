import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Zap,
  Copy,
  Check,
  Save,
  RefreshCw,
  Hash,
  ChevronDown,
  Sparkles,
  AlertCircle,
  BookOpen,
  Bot,
  Cpu,
} from 'lucide-react'
import {
  ContentFormData,
  ContentType,
  VoiceTone,
  MarketSegment,
  CONTENT_TYPE_LABELS,
  VOICE_TONE_LABELS,
  SEGMENT_LABELS,
  SavedPost,
} from '../types'
import { generateContent } from '../utils/contentGenerator'
import { savePost, generateId } from '../utils/storage'

const defaultForm: ContentFormData = {
  theme: '',
  segment: 'geral',
  targetAudience: '',
  objective: '',
  voiceTone: 'profissional',
  contentType: 'autoridade',
  callToAction: '',
  referenceSource: '',
  additionalNotes: '',
}

interface SelectProps {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  hint?: string
}

function SelectField({ label, value, onChange, options, hint }: SelectProps) {
  return (
    <div>
      <label className="form-label">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-1.5">{hint}</p>}
      <div className="relative">
        <select
          className="form-select pr-9"
          value={value}
          onChange={e => onChange(e.target.value)}
        >
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  )
}

export default function ContentGenerator() {
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState<ContentFormData>(defaultForm)

  // Apply prefill from Calendar navigation
  useEffect(() => {
    const state = location.state as { prefill?: Partial<ContentFormData> } | null
    if (state?.prefill) {
      setForm(prev => ({ ...prev, ...state.prefill }))
    }
  }, [location.state])
  const [generated, setGenerated] = useState<{ content: string; hashtags: string[] } | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationSource, setGenerationSource] = useState<'ai' | 'template' | null>(null)
  const [copied, setCopied] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [editableContent, setEditableContent] = useState('')
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)

  function setField<K extends keyof ContentFormData>(key: K, value: ContentFormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
    setSavedId(null)
    setShowSaveSuccess(false)
  }

  async function handleGenerate() {
    if (!form.theme.trim()) return
    setIsGenerating(true)
    setSavedId(null)
    setShowSaveSuccess(false)

    let result: { content: string; hashtags: string[] }
    let source: 'ai' | 'template' = 'template'

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (response.ok) {
        const data = await response.json() as { content: string; hashtags: string[]; source?: string }
        if (data.content && Array.isArray(data.hashtags)) {
          result = { content: data.content, hashtags: data.hashtags }
          source = 'ai'
        } else {
          result = generateContent(form)
        }
      } else {
        // API not configured or error — fall back to template engine
        result = generateContent(form)
      }
    } catch {
      // Network error or API unavailable — fall back to template engine
      result = generateContent(form)
    }

    setGenerated(result)
    setGenerationSource(source)
    setEditableContent(result.content)
    setIsGenerating(false)
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  function handleCopy() {
    if (!generated) return
    const text = editableContent + '\n\n' + generated.hashtags.map(h => `#${h}`).join(' ')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleSave() {
    if (!generated) return
    const id = savedId || generateId()
    const post: SavedPost = {
      id,
      createdAt: new Date().toISOString(),
      theme: form.theme,
      segment: form.segment,
      contentType: form.contentType,
      status: 'rascunho',
      content: editableContent,
      hashtags: generated.hashtags,
      formData: form,
    }
    savePost(post)
    setSavedId(id)
    setShowSaveSuccess(true)
    setTimeout(() => setShowSaveSuccess(false), 3000)
  }

  function handleReset() {
    setForm(defaultForm)
    setGenerated(null)
    setEditableContent('')
    setSavedId(null)
  }

  const isFormValid = form.theme.trim().length > 0

  const contentTypeOptions = Object.entries(CONTENT_TYPE_LABELS).map(([v, l]) => ({ value: v, label: l }))
  const voiceToneOptions = Object.entries(VOICE_TONE_LABELS).map(([v, l]) => ({ value: v, label: l }))
  const segmentOptions = Object.entries(SEGMENT_LABELS).map(([v, l]) => ({ value: v, label: l }))

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-gold-500" />
          <h1 className="section-title">Gerar Conteúdo</h1>
        </div>
        <p className="section-subtitle">
          Preencha os campos abaixo para criar um post estratégico para o LinkedIn
        </p>
      </div>

      <div className="grid xl:grid-cols-5 gap-6">
        {/* Form */}
        <div className="xl:col-span-2 space-y-5">
          <div className="card">
            <h2 className="font-bold text-navy-800 text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-gold-500 rounded-full inline-block" />
              Configurações do Post
            </h2>

            <div className="space-y-4">
              {/* Theme */}
              <div>
                <label className="form-label">
                  Tema Principal <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Energia de backup para aviários"
                  value={form.theme}
                  onChange={e => setField('theme', e.target.value)}
                />
              </div>

              {/* Segment */}
              <SelectField
                label="Segmento de Mercado"
                value={form.segment}
                onChange={v => setField('segment', v as MarketSegment)}
                options={segmentOptions}
              />

              {/* Target audience */}
              <div>
                <label className="form-label">Público-Alvo</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Produtores rurais e integradores"
                  value={form.targetAudience}
                  onChange={e => setField('targetAudience', e.target.value)}
                />
              </div>

              {/* Objective */}
              <div>
                <label className="form-label">Objetivo do Post</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Atrair parceiros comerciais"
                  value={form.objective}
                  onChange={e => setField('objective', e.target.value)}
                />
              </div>

              {/* Content type */}
              <SelectField
                label="Tipo de Conteúdo"
                value={form.contentType}
                onChange={v => setField('contentType', v as ContentType)}
                options={contentTypeOptions}
              />

              {/* Voice tone */}
              <SelectField
                label="Tom de Voz"
                value={form.voiceTone}
                onChange={v => setField('voiceTone', v as VoiceTone)}
                options={voiceToneOptions}
              />
            </div>
          </div>

          <div className="card">
            <h2 className="font-bold text-navy-800 text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-navy-400 rounded-full inline-block" />
              Detalhes Adicionais
            </h2>

            <div className="space-y-4">
              {/* CTA */}
              <div>
                <label className="form-label">Chamada para Ação</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Entre em contato pelo LinkedIn"
                  value={form.callToAction}
                  onChange={e => setField('callToAction', e.target.value)}
                />
              </div>

              {/* Reference */}
              <div>
                <label className="form-label">Fonte ou Notícia de Referência</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Relatório ANEEL 2024"
                  value={form.referenceSource}
                  onChange={e => setField('referenceSource', e.target.value)}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="form-label">Observações Adicionais</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Informações específicas, contexto extra..."
                  value={form.additionalNotes}
                  onChange={e => setField('additionalNotes', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={!isFormValid || isGenerating}
            className="btn-gold w-full justify-center py-3.5 text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Gerando conteúdo...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Gerar Conteúdo com IA
              </>
            )}
          </button>

          {!isFormValid && (
            <p className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              Preencha o <strong>Tema Principal</strong> para continuar.
            </p>
          )}

          <button
            onClick={handleReset}
            className="btn-ghost w-full justify-center text-gray-400"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Limpar formulário
          </button>
        </div>

        {/* Result */}
        <div className="xl:col-span-3" ref={resultRef}>
          {!generated && !isGenerating && (
            <div className="card h-full min-h-64 flex flex-col items-center justify-center text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-navy-50 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-navy-300" />
              </div>
              <h3 className="font-bold text-navy-700 text-base mb-2">Pronto para gerar</h3>
              <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                Preencha o formulário à esquerda e clique em{' '}
                <strong className="text-navy-600">"Gerar Conteúdo"</strong> para criar seu post estratégico.
              </p>
            </div>
          )}

          {isGenerating && (
            <div className="card h-full min-h-64 flex flex-col items-center justify-center text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-gold-50 flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-gold-500 animate-pulse" />
              </div>
              <h3 className="font-bold text-navy-700 text-base mb-2">Gerando seu conteúdo...</h3>
              <p className="text-sm text-gray-400">Analisando contexto e construindo o post estratégico</p>
              <div className="mt-6 w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gold-400 rounded-full shimmer" style={{ width: '60%' }} />
              </div>
            </div>
          )}

          {generated && !isGenerating && (
            <div className="space-y-4">
              {/* Content card */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-sm font-semibold text-navy-700">Conteúdo Gerado</span>
                    <span className="badge bg-gold-50 text-gold-700 border-gold-200 text-xs">
                      {CONTENT_TYPE_LABELS[form.contentType]}
                    </span>
                    {generationSource === 'ai' ? (
                      <span className="badge bg-purple-50 text-purple-700 border-purple-200 text-xs flex items-center gap-1">
                        <Bot className="w-3 h-3" /> IA (Claude)
                      </span>
                    ) : (
                      <span className="badge bg-gray-50 text-gray-500 border-gray-200 text-xs flex items-center gap-1">
                        <Cpu className="w-3 h-3" /> Template
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {showSaveSuccess && (
                      <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                        <Check className="w-3.5 h-3.5" />
                        Salvo!
                      </span>
                    )}
                    <button onClick={handleCopy} className="btn-ghost text-xs">
                      {copied ? (
                        <><Check className="w-3.5 h-3.5 text-green-500" />Copiado!</>
                      ) : (
                        <><Copy className="w-3.5 h-3.5" />Copiar</>
                      )}
                    </button>
                    <button onClick={handleSave} className="btn-secondary text-xs py-1.5 px-3">
                      <Save className="w-3.5 h-3.5" />
                      {savedId ? 'Atualizar' : 'Salvar'}
                    </button>
                  </div>
                </div>

                {/* Editable content */}
                <textarea
                  className="w-full text-sm text-navy-800 leading-relaxed bg-gray-50 rounded-lg p-4 border border-gray-100 resize-none outline-none focus:border-navy-300 focus:bg-white transition-all"
                  rows={18}
                  value={editableContent}
                  onChange={e => setEditableContent(e.target.value)}
                />

                <p className="text-xs text-gray-400 mt-2">
                  Você pode editar o texto acima antes de salvar ou copiar.
                </p>
              </div>

              {/* Hashtags */}
              <div className="card">
                <div className="flex items-center gap-2 mb-3">
                  <Hash className="w-4 h-4 text-navy-500" />
                  <span className="text-sm font-semibold text-navy-700">Hashtags Sugeridas</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {generated.hashtags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 bg-navy-50 text-navy-700 border border-navy-100 rounded-full px-3 py-1 text-xs font-medium cursor-pointer hover:bg-navy-100 transition-colors"
                      onClick={() => {
                        const tagText = `#${tag}`
                        navigator.clipboard.writeText(tagText)
                      }}
                    >
                      <Hash className="w-3 h-3 opacity-60" />
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-3">Clique em uma hashtag para copiá-la</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleGenerate}
                  className="btn-secondary flex-1 justify-center"
                >
                  <RefreshCw className="w-4 h-4" />
                  Regenerar
                </button>
                <button
                  onClick={() => { handleSave(); navigate('/biblioteca') }}
                  className="btn-primary flex-1 justify-center"
                >
                  <BookOpen className="w-4 h-4" />
                  Salvar na Biblioteca
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
