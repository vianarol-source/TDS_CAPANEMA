import { useState } from 'react';
import ContactPanel from '../ContactPanel/ContactPanel.jsx';
import './LeadsTable.css';

const CLASS_CONFIG = {
  Hot:       { icon: '🔴', bg: '#fee2e2', color: '#dc2626' },
  Warm:      { icon: '🟠', bg: '#ffedd5', color: '#c2410c' },
  Nurturing: { icon: '🟡', bg: '#fef9c3', color: '#a16207' },
  Cold:      { icon: '⚪', bg: '#f1f5f9', color: '#475569' },
};

const COLS = [
  { key: 'score',      label: 'Score',      sortable: true  },
  { key: 'company',    label: 'Empresa',     sortable: true  },
  { key: 'type',       label: 'Tipo',        sortable: false },
  { key: 'activity',   label: 'Atividade',   sortable: true  },
  { key: 'state',      label: 'UF',          sortable: true  },
  { key: 'status',     label: 'Status',      sortable: false },
  { key: 'issueDate',  label: 'Emissão',     sortable: true  },
  { key: 'expiryDate', label: 'Validade',    sortable: true  },
  { key: 'action',     label: 'Ação sugerida', sortable: false },
];

const STATUS_STYLE = {
  'Ativa':      { bg: '#dcfce7', color: '#15803d' },
  'Vencida':    { bg: '#fee2e2', color: '#dc2626' },
  'Suspensa':   { bg: '#fef9c3', color: '#a16207' },
  'Cancelada':  { bg: '#f3f4f6', color: '#374151' },
  'Em análise': { bg: '#dbeafe', color: '#1d4ed8' },
};

export default function LeadsTable({ leads, pagination, onPageChange, onSort, sortBy, sortDir, loading }) {
  const [expanded, setExpanded] = useState(null);

  function handleSort(key) {
    if (!COLS.find(c => c.key === key)?.sortable) return;
    const newDir = sortBy === key && sortDir === 'desc' ? 'asc' : 'desc';
    onSort(key, newDir);
  }

  function sortIcon(key) {
    if (sortBy !== key) return <span className="sort-idle">↕</span>;
    return <span className="sort-active">{sortDir === 'desc' ? '↓' : '↑'}</span>;
  }

  if (loading) {
    return (
      <div className="leads-loading">
        <div className="leads-spinner" />
        <p>Calculando scores e carregando leads...</p>
      </div>
    );
  }

  if (!leads || leads.length === 0) {
    return (
      <div className="leads-empty">
        <span>🎯</span>
        <p>Nenhum lead encontrado com os filtros aplicados.</p>
      </div>
    );
  }

  return (
    <div className="leads-table-wrap">
      <div className="leads-table-bar">
        <span className="leads-count">
          {pagination.total.toLocaleString('pt-BR')} lead{pagination.total !== 1 ? 's' : ''} encontrado{pagination.total !== 1 ? 's' : ''}
        </span>
        <span className="leads-pages">
          Página {pagination.page} de {pagination.totalPages}
        </span>
      </div>

      <div className="leads-scroll">
        <table className="leads-table">
          <thead>
            <tr>
              {COLS.map(col => (
                <th
                  key={col.key}
                  className={col.sortable ? 'th-sortable' : ''}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  {col.label}
                  {col.sortable && sortIcon(col.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => {
              const cls = CLASS_CONFIG[lead.classification] || CLASS_CONFIG.Cold;
              const isOpen = expanded === lead.id;
              return (
                <>
                  <tr
                    key={lead.id}
                    className={`lead-row${isOpen ? ' lead-row--open' : ''}`}
                    onClick={() => setExpanded(isOpen ? null : lead.id)}
                  >
                    {/* Score */}
                    <td className="td-score">
                      <div className="score-wrap">
                        <div className="score-bar-track">
                          <div
                            className="score-bar-fill"
                            style={{ width: `${lead.score}%`, background: cls.color }}
                          />
                        </div>
                        <div
                          className="score-num"
                          style={{ background: cls.bg, color: cls.color }}
                        >
                          {cls.icon} {lead.score}
                        </div>
                      </div>
                    </td>

                    {/* Empresa */}
                    <td className="td-company">
                      <div className="lead-company">
                        {lead.company}
                        {lead.isRuralProducer && <span className="rural-tag">🌾</span>}
                      </div>
                      <div className="lead-cnpj">{lead.cnpj}</div>
                    </td>

                    {/* Tipo */}
                    <td><span className="type-badge">{lead.type}</span></td>

                    {/* Atividade */}
                    <td className="td-activity">{lead.activity}</td>

                    {/* UF */}
                    <td><span className="state-pill">{lead.state}</span></td>

                    {/* Status */}
                    <td>
                      <span className="status-badge" style={STATUS_STYLE[lead.status] || {}}>
                        {lead.status}
                      </span>
                    </td>

                    {/* Datas */}
                    <td className="td-date">{fmtDate(lead.issueDate)}</td>
                    <td className={`td-date${isExpiring(lead.expiryDate) ? ' td-expiring' : ''}`}>
                      {fmtDate(lead.expiryDate)}
                      {isExpiring(lead.expiryDate) && <span className="expiry-warn" title="Vence em breve">⚠</span>}
                    </td>

                    {/* Ação */}
                    <td className="td-action">{lead.suggestedAction}</td>
                  </tr>

                  {/* Painel expandido */}
                  {isOpen && (
                    <tr key={`${lead.id}-det`} className="lead-detail-row">
                      <td colSpan={COLS.length}>
                        <div className="lead-detail">
                          <div className="lead-detail-meta">
                            <div>
                              <span className="det-label">Número</span>
                              <span className="det-val">{lead.number}</span>
                            </div>
                            <div>
                              <span className="det-label">Município</span>
                              <span className="det-val">{lead.municipality}</span>
                            </div>
                            <div>
                              <span className="det-label">Órgão</span>
                              <span className="det-val">{lead.agency}</span>
                            </div>
                            <div>
                              <span className="det-label">Região</span>
                              <span className="det-val">{lead.region}</span>
                            </div>
                          </div>
                          <div className="lead-detail-score">
                            <span className="det-label">Breakdown do Score</span>
                            <div className="score-breakdown">
                              {Object.entries({
                                'Tipo licença': lead.scoreBreakdown?.licenseType,
                                'Atividade':    lead.scoreBreakdown?.activity,
                                'Geografia':    lead.scoreBreakdown?.geography,
                                'Timing':       lead.scoreBreakdown?.timing,
                              }).map(([k, v]) => (
                                <div key={k} className="breakdown-item">
                                  <span>{k}</span>
                                  <div className="breakdown-bar">
                                    <div className="breakdown-fill" style={{ width: `${(v / 35) * 100}%` }} />
                                  </div>
                                  <span className="breakdown-val">+{v}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="lead-detail-contact">
                            <span className="det-label">Contato do Responsável</span>
                            <ContactPanel
                              cnpj={lead.cnpj}
                              company={lead.company}
                              isRuralProducer={lead.isRuralProducer}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="leads-pagination">
          <button className="page-btn" disabled={pagination.page === 1}
            onClick={() => onPageChange(1)}>«</button>
          <button className="page-btn" disabled={pagination.page === 1}
            onClick={() => onPageChange(pagination.page - 1)}>‹</button>
          {getPages(pagination.page, pagination.totalPages).map((p, i) =>
            p === '...'
              ? <span key={`e${i}`} className="page-ellipsis">…</span>
              : <button key={p} className={`page-btn${p === pagination.page ? ' page-btn--active' : ''}`}
                  onClick={() => onPageChange(p)}>{p}</button>
          )}
          <button className="page-btn" disabled={pagination.page === pagination.totalPages}
            onClick={() => onPageChange(pagination.page + 1)}>›</button>
          <button className="page-btn" disabled={pagination.page === pagination.totalPages}
            onClick={() => onPageChange(pagination.totalPages)}>»</button>
        </div>
      )}
    </div>
  );
}

function fmtDate(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function isExpiring(expiryDate) {
  if (!expiryDate) return false;
  const days = (new Date(expiryDate) - new Date()) / 86400000;
  return days >= 0 && days <= 90;
}

function getPages(cur, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (cur <= 4)          return [1, 2, 3, 4, 5, '...', total];
  if (cur >= total - 3)  return [1, '...', total-4, total-3, total-2, total-1, total];
  return [1, '...', cur-1, cur, cur+1, '...', total];
}
