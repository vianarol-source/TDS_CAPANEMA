import { useState } from 'react';
import './LeadsFilters.css';

const CLASSIFICATIONS = ['Hot', 'Warm', 'Nurturing', 'Cold'];
const TYPES      = ['LP','LI','LO','LAC','LAS','LAAS'];
const STATUSES   = ['Ativa','Vencida','Suspensa','Cancelada','Em análise'];
const ACTIVITIES = [
  'Mineração','Petróleo e Gás','Aquicultura','Agropecuária','Silvicultura',
  'Infraestrutura Viária','Indústria de Transformação','Geração de Energia',
  'Saneamento','Comércio e Serviços',
];
const REGIONS = ['Norte','Nordeste','Centro-Oeste','Sudeste','Sul'];
const STATES  = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
  'RS','RO','RR','SC','SP','SE','TO',
];

const CLASS_COLORS = {
  Hot:       { bg: '#fee2e2', color: '#dc2626', border: '#fca5a5' },
  Warm:      { bg: '#ffedd5', color: '#c2410c', border: '#fdba74' },
  Nurturing: { bg: '#fef9c3', color: '#a16207', border: '#fde047' },
  Cold:      { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' },
};

export const DEFAULT_FILTERS = {
  q: '',
  classification: [],
  states: [],
  type: [],
  status: [],
  activity: [],
  region: [],
  ruralOnly: false,
  scoreMin: '',
  scoreMax: '',
  issueDateFrom: '',
  issueDateTo: '',
  expiryDateFrom: '',
  expiryDateTo: '',
  sortBy: 'score',
  sortDir: 'desc',
};

export default function LeadsFilters({ filters, onChange, onSearch, onExport, loading, total }) {
  const [open, setOpen] = useState(true);

  function set(key, value) { onChange({ ...filters, [key]: value }); }

  function toggleMulti(key, value) {
    const arr = filters[key] || [];
    set(key, arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]);
  }

  function clearAll() { onChange({ ...DEFAULT_FILTERS }); }

  const activeCount = countActive(filters);

  return (
    <div className="leads-filters">
      {/* Barra de topo */}
      <div className="lf-topbar">
        <button className="lf-toggle" onClick={() => setOpen(o => !o)}>
          <span>🎯</span>
          Filtros de Leads
          {activeCount > 0 && <span className="lf-badge">{activeCount}</span>}
          <span className="lf-chevron">{open ? '▲' : '▼'}</span>
        </button>
        <div className="lf-topbar-actions">
          {activeCount > 0 && (
            <button className="btn-clear-filters" onClick={clearAll}>Limpar filtros</button>
          )}
          <button className="btn-export" onClick={() => onExport(filters)} disabled={loading || !total}>
            ⬇ Exportar CSV {total != null ? `(${total.toLocaleString('pt-BR')})` : ''}
          </button>
          <button className="btn-apply" onClick={onSearch} disabled={loading}>
            {loading ? <><span className="spinner-sm"/>Buscando...</> : '🔍 Aplicar'}
          </button>
        </div>
      </div>

      {open && (
        <div className="lf-body">

          {/* Linha 1: busca + score */}
          <div className="lf-row">
            <div className="lf-group lf-wide">
              <label className="lf-label">Empresa / CNPJ / Número / Município</label>
              <input
                className="lf-input"
                placeholder="Buscar..."
                value={filters.q}
                onChange={e => set('q', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && onSearch()}
              />
            </div>
            <div className="lf-group">
              <label className="lf-label">Score mínimo</label>
              <input
                className="lf-input"
                type="number" min="0" max="100"
                placeholder="0"
                value={filters.scoreMin}
                onChange={e => set('scoreMin', e.target.value)}
              />
            </div>
            <div className="lf-group">
              <label className="lf-label">Score máximo</label>
              <input
                className="lf-input"
                type="number" min="0" max="100"
                placeholder="100"
                value={filters.scoreMax}
                onChange={e => set('scoreMax', e.target.value)}
              />
            </div>
          </div>

          {/* Linha 2: classificação (chips visuais) */}
          <div className="lf-row">
            <div className="lf-group lf-full">
              <label className="lf-label">Classificação</label>
              <div className="lf-chips">
                {CLASSIFICATIONS.map(cls => {
                  const sel = filters.classification.includes(cls);
                  const c = CLASS_COLORS[cls];
                  return (
                    <button
                      key={cls}
                      className={`chip-cls${sel ? ' chip-cls--sel' : ''}`}
                      style={sel ? { background: c.bg, color: c.color, borderColor: c.border } : {}}
                      onClick={() => toggleMulti('classification', cls)}
                    >
                      {cls === 'Hot' ? '🔴' : cls === 'Warm' ? '🟠' : cls === 'Nurturing' ? '🟡' : '⚪'} {cls}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Linha 3: tipo, status, ordenação */}
          <div className="lf-row">
            <div className="lf-group">
              <label className="lf-label">Tipo de Licença</label>
              <div className="lf-checkgroup">
                {TYPES.map(t => (
                  <label key={t} className="lf-check">
                    <input type="checkbox" checked={filters.type.includes(t)}
                      onChange={() => toggleMulti('type', t)} />
                    {t}
                  </label>
                ))}
              </div>
            </div>
            <div className="lf-group">
              <label className="lf-label">Status</label>
              <div className="lf-checkgroup lf-checkgroup--col">
                {STATUSES.map(s => (
                  <label key={s} className="lf-check">
                    <input type="checkbox" checked={filters.status.includes(s)}
                      onChange={() => toggleMulti('status', s)} />
                    {s}
                  </label>
                ))}
              </div>
            </div>
            <div className="lf-group">
              <label className="lf-label">Ordenar por</label>
              <select className="lf-select" value={filters.sortBy}
                onChange={e => set('sortBy', e.target.value)}>
                <option value="score">Score</option>
                <option value="company">Empresa</option>
                <option value="state">Estado</option>
                <option value="issueDate">Data Emissão</option>
                <option value="expiryDate">Data Validade</option>
                <option value="activity">Atividade</option>
              </select>
              <div className="lf-sortdir">
                <label className="lf-check">
                  <input type="radio" name="sortDir" value="desc"
                    checked={filters.sortDir === 'desc'}
                    onChange={() => set('sortDir', 'desc')} />
                  Maior primeiro
                </label>
                <label className="lf-check">
                  <input type="radio" name="sortDir" value="asc"
                    checked={filters.sortDir === 'asc'}
                    onChange={() => set('sortDir', 'asc')} />
                  Menor primeiro
                </label>
              </div>
            </div>
          </div>

          {/* Linha 4: atividade */}
          <div className="lf-row">
            <div className="lf-group lf-full">
              <label className="lf-label">Atividade</label>
              <div className="lf-checkgroup lf-checkgroup--wrap">
                {ACTIVITIES.map(a => (
                  <label key={a} className="lf-check">
                    <input type="checkbox" checked={filters.activity.includes(a)}
                      onChange={() => toggleMulti('activity', a)} />
                    {a}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Linha 5: região + estados */}
          <div className="lf-row">
            <div className="lf-group">
              <label className="lf-label">Região</label>
              <div className="lf-checkgroup lf-checkgroup--col">
                {REGIONS.map(r => (
                  <label key={r} className="lf-check">
                    <input type="checkbox" checked={filters.region.includes(r)}
                      onChange={() => toggleMulti('region', r)} />
                    {r}
                  </label>
                ))}
              </div>
            </div>
            <div className="lf-group lf-wide">
              <label className="lf-label">Estados</label>
              <div className="lf-states-grid">
                {STATES.map(uf => {
                  const sel = filters.states.includes(uf);
                  return (
                    <button
                      key={uf}
                      className={`state-mini${sel ? ' state-mini--sel' : ''}`}
                      onClick={() => toggleMulti('states', uf)}
                    >{uf}</button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Linha 6: datas + rural */}
          <div className="lf-row lf-row--dates">
            <div className="lf-group">
              <label className="lf-label">Emissão — de</label>
              <input className="lf-input" type="date" value={filters.issueDateFrom}
                onChange={e => set('issueDateFrom', e.target.value)} />
            </div>
            <div className="lf-group">
              <label className="lf-label">Emissão — até</label>
              <input className="lf-input" type="date" value={filters.issueDateTo}
                onChange={e => set('issueDateTo', e.target.value)} />
            </div>
            <div className="lf-group">
              <label className="lf-label">Validade — de</label>
              <input className="lf-input" type="date" value={filters.expiryDateFrom}
                onChange={e => set('expiryDateFrom', e.target.value)} />
            </div>
            <div className="lf-group">
              <label className="lf-label">Validade — até</label>
              <input className="lf-input" type="date" value={filters.expiryDateTo}
                onChange={e => set('expiryDateTo', e.target.value)} />
            </div>
            <div className="lf-group lf-group--rural">
              <label className="rural-toggle">
                <input type="checkbox" checked={!!filters.ruralOnly}
                  onChange={e => set('ruralOnly', e.target.checked)} />
                <span>🌾</span>
                <span className="rural-toggle-label">Apenas Produtores Rurais</span>
              </label>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

function countActive(f) {
  let n = 0;
  if (f.q)                    n++;
  if (f.classification?.length) n++;
  if (f.states?.length)       n++;
  if (f.type?.length)         n++;
  if (f.status?.length)       n++;
  if (f.activity?.length)     n++;
  if (f.region?.length)       n++;
  if (f.ruralOnly)            n++;
  if (f.scoreMin || f.scoreMax) n++;
  if (f.issueDateFrom || f.issueDateTo) n++;
  if (f.expiryDateFrom || f.expiryDateTo) n++;
  return n;
}
