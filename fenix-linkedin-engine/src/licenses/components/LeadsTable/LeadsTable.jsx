import { useState, Fragment } from 'react';
import ContactPanel from '../ContactPanel/ContactPanel.jsx';
import styles from './LeadsTable.module.css';

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
    if (sortBy !== key) return <span className={styles.sortIdle}>↕</span>;
    return <span className={styles.sortActive}>{sortDir === 'desc' ? '↓' : '↑'}</span>;
  }

  if (loading) {
    return (
      <div className={styles.leadsLoading}>
        <div className={styles.leadsSpinner} />
        <p>Calculando scores e carregando leads...</p>
      </div>
    );
  }

  if (!leads || leads.length === 0) {
    return (
      <div className={styles.leadsEmpty}>
        <span>🎯</span>
        <p>Nenhum lead encontrado com os filtros aplicados.</p>
      </div>
    );
  }

  return (
    <div className={styles.leadsTableWrap}>
      <div className={styles.leadsTableBar}>
        <span className={styles.leadsCount}>
          {pagination.total.toLocaleString('pt-BR')} lead{pagination.total !== 1 ? 's' : ''} encontrado{pagination.total !== 1 ? 's' : ''}
        </span>
        <span className={styles.leadsPages}>
          Página {pagination.page} de {pagination.totalPages}
        </span>
      </div>

      <div className={styles.leadsScroll}>
        <table className={styles.leadsTable}>
          <thead>
            <tr>
              {COLS.map(col => (
                <th
                  key={col.key}
                  className={col.sortable ? styles.thSortable : ''}
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
                <Fragment key={lead.id}>
                  <tr
                    className={`${styles.leadRow}${isOpen ? ` ${styles.leadRowOpen}` : ''}`}
                    onClick={() => setExpanded(isOpen ? null : lead.id)}
                  >
                    {/* Score */}
                    <td className={styles.tdScore}>
                      <div className={styles.scoreWrap}>
                        <div className={styles.scoreBarTrack}>
                          <div
                            className={styles.scoreBarFill}
                            style={{ width: `${lead.score}%`, background: cls.color }}
                          />
                        </div>
                        <div
                          className={styles.scoreNum}
                          style={{ background: cls.bg, color: cls.color }}
                        >
                          {cls.icon} {lead.score}
                        </div>
                      </div>
                    </td>

                    {/* Empresa */}
                    <td className={styles.tdCompany}>
                      <div className={styles.leadCompany}>
                        {lead.company}
                        {lead.isRuralProducer && <span className={styles.ruralTag}>🌾</span>}
                      </div>
                      <div className={styles.leadCnpj}>{lead.cnpj}</div>
                    </td>

                    {/* Tipo */}
                    <td><span className={styles.typeBadge}>{lead.type}</span></td>

                    {/* Atividade */}
                    <td className={styles.tdActivity}>{lead.activity}</td>

                    {/* UF */}
                    <td><span className={styles.statePill}>{lead.state}</span></td>

                    {/* Status */}
                    <td>
                      <span className={styles.statusBadge} style={STATUS_STYLE[lead.status] || {}}>
                        {lead.status}
                      </span>
                    </td>

                    {/* Datas */}
                    <td className={styles.tdDate}>{fmtDate(lead.issueDate)}</td>
                    <td className={`${styles.tdDate}${isExpiring(lead.expiryDate) ? ` ${styles.tdExpiring}` : ''}`}>
                      {fmtDate(lead.expiryDate)}
                      {isExpiring(lead.expiryDate) && <span className={styles.expiryWarn} title="Vence em breve">⚠</span>}
                    </td>

                    {/* Ação */}
                    <td className={styles.tdAction}>{lead.suggestedAction}</td>
                  </tr>

                  {/* Painel expandido */}
                  {isOpen && (
                    <tr className={styles.leadDetailRow}>
                      <td colSpan={COLS.length}>
                        <div className={styles.leadDetail}>
                          <div className={styles.leadDetailMeta}>
                            <div>
                              <span className={styles.detLabel}>Número</span>
                              <span className={styles.detVal}>{lead.number}</span>
                            </div>
                            <div>
                              <span className={styles.detLabel}>Município</span>
                              <span className={styles.detVal}>{lead.municipality}</span>
                            </div>
                            <div>
                              <span className={styles.detLabel}>Órgão</span>
                              <span className={styles.detVal}>{lead.agency}</span>
                            </div>
                            <div>
                              <span className={styles.detLabel}>Região</span>
                              <span className={styles.detVal}>{lead.region}</span>
                            </div>
                          </div>
                          <div className={styles.leadDetailScore}>
                            <span className={styles.detLabel}>Breakdown do Score</span>
                            <div className={styles.scoreBreakdown}>
                              {Object.entries({
                                'Tipo licença': lead.scoreBreakdown?.licenseType,
                                'Atividade':    lead.scoreBreakdown?.activity,
                                'Geografia':    lead.scoreBreakdown?.geography,
                                'Timing':       lead.scoreBreakdown?.timing,
                              }).map(([k, v]) => (
                                <div key={k} className={styles.breakdownItem}>
                                  <span>{k}</span>
                                  <div className={styles.breakdownBar}>
                                    <div className={styles.breakdownFill} style={{ width: `${(v / 35) * 100}%` }} />
                                  </div>
                                  <span className={styles.breakdownVal}>+{v}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className={styles.leadDetailContact}>
                            <span className={styles.detLabel}>Contato do Responsável</span>
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
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className={styles.leadsPagination}>
          <button className={styles.pageBtn} disabled={pagination.page === 1}
            onClick={() => onPageChange(1)}>«</button>
          <button className={styles.pageBtn} disabled={pagination.page === 1}
            onClick={() => onPageChange(pagination.page - 1)}>‹</button>
          {getPages(pagination.page, pagination.totalPages).map((p, i) =>
            p === '...'
              ? <span key={`e${i}`} className={styles.pageEllipsis}>…</span>
              : <button key={p} className={`${styles.pageBtn}${p === pagination.page ? ` ${styles.pageBtnActive}` : ''}`}
                  onClick={() => onPageChange(p)}>{p}</button>
          )}
          <button className={styles.pageBtn} disabled={pagination.page === pagination.totalPages}
            onClick={() => onPageChange(pagination.page + 1)}>›</button>
          <button className={styles.pageBtn} disabled={pagination.page === pagination.totalPages}
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
