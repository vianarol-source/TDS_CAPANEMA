import { useState, Fragment } from 'react';
import ContactPanel from '../ContactPanel/ContactPanel.jsx';
import styles from './LicenseTable.module.css';

const STATUS_STYLES = {
  'Ativa':       { bg: '#dcfce7', color: '#15803d' },
  'Vencida':     { bg: '#fee2e2', color: '#dc2626' },
  'Suspensa':    { bg: '#fef9c3', color: '#a16207' },
  'Cancelada':   { bg: '#f3f4f6', color: '#374151' },
  'Em análise':  { bg: '#dbeafe', color: '#1d4ed8' },
};

export default function LicenseTable({ licenses, pagination, onPageChange, loading }) {
  const [expanded, setExpanded] = useState(null);

  if (loading) {
    return (
      <div className={styles.tableLoading}>
        <div className={styles.loadingSpinner} />
        <p>Carregando licenças...</p>
      </div>
    );
  }

  if (!licenses || licenses.length === 0) {
    return (
      <div className={styles.tableEmpty}>
        <span className={styles.emptyIcon}>📋</span>
        <p>Nenhuma licença encontrada.</p>
        <p className={styles.emptyHint}>Ajuste os filtros ou selecione outros estados.</p>
      </div>
    );
  }

  return (
    <div className={styles.licenseTableWrap}>
      <div className={styles.tableHeaderBar}>
        <span className={styles.tableCount}>
          {pagination.total.toLocaleString('pt-BR')} licença{pagination.total !== 1 ? 's' : ''} encontrada{pagination.total !== 1 ? 's' : ''}
        </span>
        <span className={styles.tablePages}>
          Página {pagination.page} de {pagination.totalPages}
        </span>
      </div>

      <div className={styles.tableScroll}>
        <table className={styles.licenseTable}>
          <thead>
            <tr>
              <th>Número</th>
              <th>Empresa</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Atividade</th>
              <th>Emissão</th>
              <th>Validade</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {licenses.map(license => (
              <Fragment key={license.id}>
                <tr
                  className={`${styles.licenseRow}${expanded === license.id ? ` ${styles.licenseRowOpen}` : ''}`}
                  onClick={() => setExpanded(expanded === license.id ? null : license.id)}
                >
                  <td className={styles.tdNumber}>{license.number}</td>
                  <td className={styles.tdCompany}>
                    <div className={styles.companyName}>
                      {license.company}
                      {license.isRuralProducer && (
                        <span className={styles.ruralBadge} title="Produtor Rural">🌾 Rural</span>
                      )}
                    </div>
                    <div className={styles.companyCnpj}>{license.cnpj}</div>
                  </td>
                  <td>
                    <span className={styles.typeBadge}>{license.type}</span>
                  </td>
                  <td>
                    <span className={styles.statePill}>{license.state}</span>
                  </td>
                  <td className={styles.tdActivity}>{license.activity}</td>
                  <td className={styles.tdDate}>{formatDate(license.issueDate)}</td>
                  <td className={styles.tdDate}>{formatDate(license.expiryDate)}</td>
                  <td>
                    <span
                      className={styles.statusBadge}
                      style={STATUS_STYLES[license.status] || {}}
                    >
                      {license.status}
                    </span>
                  </td>
                </tr>
                {expanded === license.id && (
                  <tr className={styles.detailRow}>
                    <td colSpan={8}>
                      <div className={styles.detailPanel}>
                        <div className={styles.detailGrid}>
                          <div>
                            <span className={styles.detailLabel}>Órgão Ambiental</span>
                            <span className={styles.detailValue}>{license.agency}</span>
                          </div>
                          <div>
                            <span className={styles.detailLabel}>Município</span>
                            <span className={styles.detailValue}>{license.municipality}</span>
                          </div>
                          <div>
                            <span className={styles.detailLabel}>Região</span>
                            <span className={styles.detailValue}>{license.region}</span>
                          </div>
                          <div>
                            <span className={styles.detailLabel}>Tipo Completo</span>
                            <span className={styles.detailValue}>{license.typeLabel}</span>
                          </div>
                        </div>
                        <div className={styles.detailDesc}>
                          <span className={styles.detailLabel}>Descrição</span>
                          <span className={styles.detailValue}>{license.description}</span>
                        </div>
                        <div className={styles.detailContact}>
                          <span className={styles.detailLabel}>Contato do Responsável</span>
                          <ContactPanel
                            cnpj={license.cnpj}
                            company={license.company}
                            isRuralProducer={license.isRuralProducer}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            disabled={pagination.page === 1}
            onClick={() => onPageChange(1)}
          >
            «
          </button>
          <button
            className={styles.pageBtn}
            disabled={pagination.page === 1}
            onClick={() => onPageChange(pagination.page - 1)}
          >
            ‹
          </button>
          {getPageNumbers(pagination.page, pagination.totalPages).map((p, i) =>
            p === '...' ? (
              <span key={`ellipsis-${i}`} className={styles.pageEllipsis}>…</span>
            ) : (
              <button
                key={p}
                className={`${styles.pageBtn}${p === pagination.page ? ` ${styles.pageBtnActive}` : ''}`}
                onClick={() => onPageChange(p)}
              >
                {p}
              </button>
            )
          )}
          <button
            className={styles.pageBtn}
            disabled={pagination.page === pagination.totalPages}
            onClick={() => onPageChange(pagination.page + 1)}
          >
            ›
          </button>
          <button
            className={styles.pageBtn}
            disabled={pagination.page === pagination.totalPages}
            onClick={() => onPageChange(pagination.totalPages)}
          >
            »
          </button>
        </div>
      )}
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
  if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
}
