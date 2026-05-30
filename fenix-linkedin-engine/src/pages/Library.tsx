import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BookOpen,
  Copy,
  Check,
  Trash2,
  Edit3,
  Save,
  X,
  Search,
  Filter,
  PenSquare,
  Hash,
  Calendar,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react'
import {
  SavedPost,
  PostStatus,
  CONTENT_TYPE_LABELS,
  SEGMENT_LABELS,
  STATUS_LABELS,
  STATUS_COLORS,
} from '../types'
import {
  getAllPosts,
  deletePost,
  updatePostStatus,
  savePost,
} from '../utils/storage'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

function EmptyState({ onGenerate }: { onGenerate: () => void }) {
  return (
    <div className="card flex flex-col items-center justify-center text-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-navy-50 flex items-center justify-center mb-4">
        <BookOpen className="w-8 h-8 text-navy-300" />
      </div>
      <h3 className="font-bold text-navy-700 text-base mb-2">Biblioteca vazia</h3>
      <p className="text-sm text-gray-400 max-w-xs leading-relaxed mb-5">
        Você ainda não salvou nenhum conteúdo. Gere seu primeiro post e salve-o aqui.
      </p>
      <button onClick={onGenerate} className="btn-gold">
        <PenSquare className="w-4 h-4" />
        Criar Primeiro Post
      </button>
    </div>
  )
}

interface PostCardProps {
  post: SavedPost
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: PostStatus) => void
  onEdit: (post: SavedPost) => void
}

function PostCard({ post, onDelete, onStatusChange, onEdit }: PostCardProps) {
  const [copied, setCopied] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  function handleCopy() {
    const text = post.content + '\n\n' + post.hashtags.map(h => `#${h}`).join(' ')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDelete() {
    if (confirmDelete) {
      onDelete(post.id)
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
    }
  }

  const dateFormatted = (() => {
    try {
      return format(new Date(post.createdAt), "dd MMM yyyy", { locale: ptBR })
    } catch {
      return '—'
    }
  })()

  const statusOptions: { value: PostStatus; label: string }[] = [
    { value: 'rascunho', label: 'Rascunho' },
    { value: 'aprovado', label: 'Aprovado' },
    { value: 'publicado', label: 'Publicado' },
  ]

  return (
    <div className="card hover:shadow-card-hover transition-all duration-200">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-navy-900 text-sm truncate">{post.theme}</h3>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className="badge bg-navy-50 text-navy-600 border-navy-100 text-xs">
              {SEGMENT_LABELS[post.segment]}
            </span>
            <span className="badge bg-gray-100 text-gray-600 border-gray-200 text-xs">
              {CONTENT_TYPE_LABELS[post.contentType]}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 ml-2">
          <div className="relative">
            <select
              className={`badge text-xs cursor-pointer border ${STATUS_COLORS[post.status]} pr-5 appearance-none`}
              value={post.status}
              onChange={e => onStatusChange(post.id, e.target.value as PostStatus)}
            >
              {statusOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 pointer-events-none opacity-60" />
          </div>
        </div>
      </div>

      {/* Content preview */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-100">
        <p className="text-xs text-gray-600 leading-relaxed line-clamp-5 whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {/* Hashtags */}
      {post.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.hashtags.slice(0, 5).map(tag => (
            <span key={tag} className="inline-flex items-center gap-0.5 text-xs text-navy-600 bg-navy-50 rounded-full px-2 py-0.5">
              <Hash className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
          {post.hashtags.length > 5 && (
            <span className="text-xs text-gray-400">+{post.hashtags.length - 5}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Calendar className="w-3.5 h-3.5" />
          {dateFormatted}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={handleCopy} className="btn-ghost text-xs py-1.5 px-2.5">
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copiado' : 'Copiar'}
          </button>
          <button onClick={() => onEdit(post)} className="btn-ghost text-xs py-1.5 px-2.5">
            <Edit3 className="w-3.5 h-3.5" />
            Editar
          </button>
          <button
            onClick={handleDelete}
            className={`btn-danger text-xs py-1.5 px-2.5 ${confirmDelete ? 'bg-red-50 text-red-600' : ''}`}
          >
            {confirmDelete ? (
              <><AlertTriangle className="w-3.5 h-3.5" />Confirmar</>
            ) : (
              <><Trash2 className="w-3.5 h-3.5" />Excluir</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

interface EditModalProps {
  post: SavedPost
  onSave: (updated: SavedPost) => void
  onClose: () => void
}

function EditModal({ post, onSave, onClose }: EditModalProps) {
  const [content, setContent] = useState(post.content)
  const [theme, setTheme] = useState(post.theme)

  return (
    <div className="fixed inset-0 bg-navy-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-navy-900">Editar Post</h2>
          <button onClick={onClose} className="btn-ghost p-2">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div>
            <label className="form-label">Tema</label>
            <input
              type="text"
              className="form-input"
              value={theme}
              onChange={e => setTheme(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Conteúdo do Post</label>
            <textarea
              className="form-textarea"
              rows={16}
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="btn-secondary">
            <X className="w-4 h-4" />
            Cancelar
          </button>
          <button
            onClick={() => onSave({ ...post, theme, content })}
            className="btn-primary"
          >
            <Save className="w-4 h-4" />
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Library() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<SavedPost[]>([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<PostStatus | 'todos'>('todos')
  const [filterSegment, setFilterSegment] = useState<string>('todos')
  const [editingPost, setEditingPost] = useState<SavedPost | null>(null)

  const loadPosts = useCallback(() => {
    setPosts(getAllPosts())
  }, [])

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  function handleDelete(id: string) {
    deletePost(id)
    loadPosts()
  }

  function handleStatusChange(id: string, status: PostStatus) {
    updatePostStatus(id, status)
    loadPosts()
  }

  function handleEditSave(updated: SavedPost) {
    savePost(updated)
    loadPosts()
    setEditingPost(null)
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch =
      !search ||
      post.theme.toLowerCase().includes(search.toLowerCase()) ||
      post.content.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'todos' || post.status === filterStatus
    const matchesSegment = filterSegment === 'todos' || post.segment === filterSegment
    return matchesSearch && matchesStatus && matchesSegment
  })

  const statusCounts = {
    rascunho: posts.filter(p => p.status === 'rascunho').length,
    aprovado: posts.filter(p => p.status === 'aprovado').length,
    publicado: posts.filter(p => p.status === 'publicado').length,
  }

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-start justify-between mb-7 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-navy-600" />
            <h1 className="section-title">Biblioteca de Posts</h1>
          </div>
          <p className="section-subtitle">
            {posts.length} post{posts.length !== 1 ? 's' : ''} salvo{posts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={() => navigate('/gerar')} className="btn-primary flex-shrink-0">
          <PenSquare className="w-4 h-4" />
          Novo Post
        </button>
      </div>

      {posts.length > 0 && (
        <>
          {/* Status summary */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {(Object.entries(statusCounts) as [PostStatus, number][]).map(([status, count]) => (
              <button
                key={status}
                onClick={() => setFilterStatus(filterStatus === status ? 'todos' : status)}
                className={`card py-3 text-center transition-all duration-200 ${
                  filterStatus === status
                    ? 'border-navy-300 bg-navy-50 shadow-md'
                    : 'hover:border-gray-200 hover:shadow-md'
                }`}
              >
                <p className="text-xl font-extrabold text-navy-900">{count}</p>
                <p className={`badge mx-auto mt-1 ${STATUS_COLORS[status]}`}>
                  {STATUS_LABELS[status]}
                </p>
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                className="form-input pl-10"
                placeholder="Buscar por tema ou conteúdo..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div className="relative">
                <select
                  className="form-select text-xs py-2 pr-8"
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value as PostStatus | 'todos')}
                >
                  <option value="todos">Todos os status</option>
                  <option value="rascunho">Rascunho</option>
                  <option value="aprovado">Aprovado</option>
                  <option value="publicado">Publicado</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  className="form-select text-xs py-2 pr-8"
                  value={filterSegment}
                  onChange={e => setFilterSegment(e.target.value)}
                >
                  <option value="todos">Todos os segmentos</option>
                  {Object.entries(SEGMENT_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </>
      )}

      {posts.length === 0 ? (
        <EmptyState onGenerate={() => navigate('/gerar')} />
      ) : filteredPosts.length === 0 ? (
        <div className="card flex flex-col items-center justify-center text-center py-16">
          <Search className="w-10 h-10 text-gray-200 mb-3" />
          <h3 className="font-semibold text-navy-700 text-sm mb-1">Nenhum resultado</h3>
          <p className="text-xs text-gray-400">Tente outros filtros ou termos de busca.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              onEdit={setEditingPost}
            />
          ))}
        </div>
      )}

      {editingPost && (
        <EditModal
          post={editingPost}
          onSave={handleEditSave}
          onClose={() => setEditingPost(null)}
        />
      )}
    </div>
  )
}
