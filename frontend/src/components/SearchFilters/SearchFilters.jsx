import './SearchFilters.css';

const LICENSE_TYPES = [
  { value: '', label: 'Todos os tipos' },
  { value: 'LP', label: 'LP — Licença Prévia' },
  { value: 'LI', label: 'LI — Licença de Instalação' },
  { value: 'LO', label: 'LO — Licença de Operação' },
  { value: 'LAC', label: 'LAC — Licença Ambiental Corretiva' },
  { value: 'LAS', label: 'LAS — Licença Ambiental Simplificada' },
  { value: 'LAAS', label: 'LAAS — Licença de Autorização e Supressão' },
];

const STATUSES = [
  { value: '', label: 'Todos os status' },
  { value: 'Ativa', label: 'Ativa' },
  { value: 'Vencida', label: 'Vencida' },
  { value: 'Suspensa', label: 'Suspensa' },
  { value: 'Cancelada', label: 'Cancelada' },
  { value: 'Em análise', label: 'Em análise' },
];

export default function SearchFilters({ filters, onChange, onSearch, loading }) {
  function handleChange(key, value) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="search-filters">
      <h2 className="filters-title">Filtros de Pesquisa</h2>
      <div className="filters-grid">
        <div className="filter-group filter-group--wide">
          <label className="filter-label" htmlFor="query">Empresa / CNPJ / Número</label>
          <input
            id="query"
            type="text"
            className="filter-input"
            placeholder="Buscar por nome da empresa, CNPJ ou número da licença..."
            value={filters.query}
            onChange={e => handleChange('query', e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSearch()}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label" htmlFor="type">Tipo de Licença</label>
          <select
            id="type"
            className="filter-select"
            value={filters.type}
            onChange={e => handleChange('type', e.target.value)}
          >
            {LICENSE_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label" htmlFor="status">Status</label>
          <select
            id="status"
            className="filter-select"
            value={filters.status}
            onChange={e => handleChange('status', e.target.value)}
          >
            {STATUSES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="filters-footer">
        <button
          className="btn-search"
          onClick={onSearch}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner" />
              Pesquisando...
            </>
          ) : (
            <>
              <span>🔍</span>
              Pesquisar Licenças
            </>
          )}
        </button>
      </div>
    </div>
  );
}
