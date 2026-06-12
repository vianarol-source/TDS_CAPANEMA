import styles from './SearchFilters.module.css';

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
    <div className={styles.searchFilters}>
      <h2 className={styles.filtersTitle}>Filtros de Pesquisa</h2>
      <div className={styles.filtersGrid}>
        <div className={styles.filterGroupWide}>
          <label className={styles.filterLabel} htmlFor="query">Empresa / CNPJ / Número</label>
          <input
            id="query"
            type="text"
            className={styles.filterInput}
            placeholder="Buscar por nome da empresa, CNPJ ou número da licença..."
            value={filters.query}
            onChange={e => handleChange('query', e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSearch()}
          />
        </div>

        <div>
          <label className={styles.filterLabel} htmlFor="type">Tipo de Licença</label>
          <select
            id="type"
            className={styles.filterSelect}
            value={filters.type}
            onChange={e => handleChange('type', e.target.value)}
          >
            {LICENSE_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={styles.filterLabel} htmlFor="status">Status</label>
          <select
            id="status"
            className={styles.filterSelect}
            value={filters.status}
            onChange={e => handleChange('status', e.target.value)}
          >
            {STATUSES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.filterRural}>
        <label className={styles.ruralToggle}>
          <input
            type="checkbox"
            checked={!!filters.ruralOnly}
            onChange={e => handleChange('ruralOnly', e.target.checked)}
          />
          <span className={styles.ruralToggleIcon}>🌾</span>
          <span className={styles.ruralToggleLabel}>Apenas Produtores Rurais</span>
          <span className={styles.ruralToggleHint}>
            Agropecuária · Silvicultura · Aquicultura
          </span>
        </label>
      </div>

      <div className={styles.filtersFooter}>
        <button
          className={styles.btnSearch}
          onClick={onSearch}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className={styles.spinner} />
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
