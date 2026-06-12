import { useState } from 'react';
import styles from './LeadsFilters.module.css';

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
    <div className={styles.leadsFilters}>
      {/* Barra de topo */}
      <div className={styles.lfTopbar}>
        <button className={styles.lfToggle} onClick={() => setOpen(o => !o)}>
          <span>🎯</span>
          Filtros de Leads
          {activeCount > 0 && <span className={styles.lfBadge}>{activeCount}</span>}
          <span className={styles.lfChevron}>{open ? '▲' : '▼'}</span>
        </button>
        <div className={styles.lfTopbarActions}>
          {activeCount > 0 && (
            <button className={styles.btnClearFilters} onClick={clearAll}>Limpar filtros</button>
          )}
          <button className={styles.btnExport} onClick={() => onExport(filters)} disabled={loading || !total}>
            ⬇ Exportar CSV {total != null ? `(${total.toLocaleString('pt-BR')})` : ''}
          </button>
          <button className={styles.btnApply} onClick={onSearch} disabled={loading}>
            {loading ? <><span className={styles.spinnerSm}/>Buscando...</> : '🔍 Aplicar'}
          </button>
        </div>
      </div>

      {open && (
        <div className={styles.lfBody}>

          {/* Linha 1: busca + score */}
          <div className={styles.lfRow}>
            <div className={`${styles.lfGroup} ${styles.lfWide}`}>
              <label className={styles.lfLabel}>Empresa / CNPJ / Número / Município</label>
              <input
                className={styles.lfInput}
                placeholder="Buscar..."
                value={filters.q}
                onChange={e => set('q', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && onSearch()}
              />
            </div>
            <div className={styles.lfGroup}>
              <label className={styles.lfLabel}>Score mínimo</label>
              <input
                className={styles.lfInput}
                type="number" min="0" max="100"
                placeholder="0"
                value={filters.scoreMin}
                onChange={e => set('scoreMin', e.target.value)}
              />
            </div>
            <div className={styles.lfGroup}>
              <label className={styles.lfLabel}>Score máximo</label>
              <input
                className={styles.lfInput}
                type="number" min="0" max="100"
                placeholder="100"
                value={filters.scoreMax}
                onChange={e => set('scoreMax', e.target.value)}
              />
            </div>
          </div>

          {/* Linha 2: classificação (chips visuais) */}
          <div className={styles.lfRow}>
            <div className={`${styles.lfGroup} ${styles.lfFull}`}>
              <label className={styles.lfLabel}>Classificação</label>
              <div className={styles.lfChips}>
                {CLASSIFICATIONS.map(cls => {
                  const sel = filters.classification.includes(cls);
                  const c = CLASS_COLORS[cls];
                  return (
                    <button
                      key={cls}
                      className={`${styles.chipCls}${sel ? ` ${styles.chipClsSel}` : ''}`}
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
          <div className={styles.lfRow}>
            <div className={styles.lfGroup}>
              <label className={styles.lfLabel}>Tipo de Licença</label>
              <div className={styles.lfCheckgroup}>
                {TYPES.map(t => (
                  <label key={t} className={styles.lfCheck}>
                    <input type="checkbox" checked={filters.type.includes(t)}
                      onChange={() => toggleMulti('type', t)} />
                    {t}
                  </label>
                ))}
              </div>
            </div>
            <div className={styles.lfGroup}>
              <label className={styles.lfLabel}>Status</label>
              <div className={`${styles.lfCheckgroup} ${styles.lfCheckgroupCol}`}>
                {STATUSES.map(s => (
                  <label key={s} className={styles.lfCheck}>
                    <input type="checkbox" checked={filters.status.includes(s)}
                      onChange={() => toggleMulti('status', s)} />
                    {s}
                  </label>
                ))}
              </div>
            </div>
            <div className={styles.lfGroup}>
              <label className={styles.lfLabel}>Ordenar por</label>
              <select className={styles.lfSelect} value={filters.sortBy}
                onChange={e => set('sortBy', e.target.value)}>
                <option value="score">Score</option>
                <option value="company">Empresa</option>
                <option value="state">Estado</option>
                <option value="issueDate">Data Emissão</option>
                <option value="expiryDate">Data Validade</option>
                <option value="activity">Atividade</option>
              </select>
              <div className={styles.lfSortdir}>
                <label className={styles.lfCheck}>
                  <input type="radio" name="sortDir" value="desc"
                    checked={filters.sortDir === 'desc'}
                    onChange={() => set('sortDir', 'desc')} />
                  Maior primeiro
                </label>
                <label className={styles.lfCheck}>
                  <input type="radio" name="sortDir" value="asc"
                    checked={filters.sortDir === 'asc'}
                    onChange={() => set('sortDir', 'asc')} />
                  Menor primeiro
                </label>
              </div>
            </div>
          </div>

          {/* Linha 4: atividade */}
          <div className={styles.lfRow}>
            <div className={`${styles.lfGroup} ${styles.lfFull}`}>
              <label className={styles.lfLabel}>Atividade</label>
              <div className={`${styles.lfCheckgroup} ${styles.lfCheckgroupWrap}`}>
                {ACTIVITIES.map(a => (
                  <label key={a} className={styles.lfCheck}>
                    <input type="checkbox" checked={filters.activity.includes(a)}
                      onChange={() => toggleMulti('activity', a)} />
                    {a}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Linha 5: região + estados */}
          <div className={styles.lfRow}>
            <div className={styles.lfGroup}>
              <label className={styles.lfLabel}>Região</label>
              <div className={`${styles.lfCheckgroup} ${styles.lfCheckgroupCol}`}>
                {REGIONS.map(r => (
                  <label key={r} className={styles.lfCheck}>
                    <input type="checkbox" checked={filters.region.includes(r)}
                      onChange={() => toggleMulti('region', r)} />
                    {r}
                  </label>
                ))}
              </div>
            </div>
            <div className={`${styles.lfGroup} ${styles.lfWide}`}>
              <label className={styles.lfLabel}>Estados</label>
              <div className={styles.lfStatesGrid}>
                {STATES.map(uf => {
                  const sel = filters.states.includes(uf);
                  return (
                    <button
                      key={uf}
                      className={`${styles.stateMini}${sel ? ` ${styles.stateMiniSel}` : ''}`}
                      onClick={() => toggleMulti('states', uf)}
                    >{uf}</button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Linha 6: datas + rural */}
          <div className={`${styles.lfRow} ${styles.lfRowDates}`}>
            <div className={styles.lfGroup}>
              <label className={styles.lfLabel}>Emissão — de</label>
              <input className={styles.lfInput} type="date" value={filters.issueDateFrom}
                onChange={e => set('issueDateFrom', e.target.value)} />
            </div>
            <div className={styles.lfGroup}>
              <label className={styles.lfLabel}>Emissão — até</label>
              <input className={styles.lfInput} type="date" value={filters.issueDateTo}
                onChange={e => set('issueDateTo', e.target.value)} />
            </div>
            <div className={styles.lfGroup}>
              <label className={styles.lfLabel}>Validade — de</label>
              <input className={styles.lfInput} type="date" value={filters.expiryDateFrom}
                onChange={e => set('expiryDateFrom', e.target.value)} />
            </div>
            <div className={styles.lfGroup}>
              <label className={styles.lfLabel}>Validade — até</label>
              <input className={styles.lfInput} type="date" value={filters.expiryDateTo}
                onChange={e => set('expiryDateTo', e.target.value)} />
            </div>
            <div className={`${styles.lfGroup} ${styles.lfGroupRural}`}>
              <label className={styles.ruralToggle}>
                <input type="checkbox" checked={!!filters.ruralOnly}
                  onChange={e => set('ruralOnly', e.target.checked)} />
                <span>🌾</span>
                <span className={styles.ruralToggleLabel}>Apenas Produtores Rurais</span>
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
