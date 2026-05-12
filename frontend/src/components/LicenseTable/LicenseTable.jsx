import { useState } from 'react';
import './LicenseTable.css';

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
      <div className="table-loading">
        <div className="loading-spinner" />
        <p>Carregando licenças...</p>
      </div>
    );
  }

  if (!licenses || licenses.length === 0) {
    return (
      <div className="table-empty">
        <span className="empty-icon">📋</span>
        <p>Nenhuma licença encontrada.</p>
        <p className="empty-hint">Ajuste os filtros ou selecione outros estados.</p>
      </div>
    );
  }

  return (
    <div className="license-table-wrap">
      <div className="table-header-bar">
        <span className="table-count">
          {pagination.total.toLocaleString('pt-BR')} licença{pagination.total !== 1 ? 's' : ''} encontrada{pagination.total !== 1 ? 's' : ''}
        </span>
        <span className="table-pages">
          Página {pagination.page} de {pagination.totalPages}
        </span>
      </div>

      <div className="table-scroll">
        <table className="license-table">
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
              <>
                <tr
                  key={license.id}
                  className={`license-row${expanded === license.id ? ' license-row--open' : ''}`}
                  onClick={() => setExpanded(expanded === license.id ? null : license.id)}
                >
                  <td className="td-number">{license.number}</td>
                  <td className="td-company">
                    <div className="company-name">{license.company}</div>
                    <div className="company-cnpj">{license.cnpj}</div>
                  </td>
                  <td>
                    <span className="type-badge">{license.type}</span>
                  </td>
                  <td>
                    <span className="state-pill">{license.state}</span>
                  </td>
                  <td className="td-activity">{license.activity}</td>
                  <td className="td-date">{formatDate(license.issueDate)}</td>
                  <td className="td-date">{formatDate(license.expiryDate)}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={STATUS_STYLES[license.status] || {}}
                    >
                      {license.status}
                    </span>
                  </td>
                </tr>
                {expanded === license.id && (
                  <tr key={`${license.id}-detail`} className="detail-row">
                    <td colSpan={8}>
                      <div className="detail-panel">
                        <div className="detail-grid">
                          <div>
                            <span className="detail-label">Órgão Ambiental</span>
                            <span className="detail-value">{license.agency}</span>
                          </div>
                          <div>
                            <span className="detail-label">Município</span>
                            <span className="detail-value">{license.municipality}</span>
                          </div>
                          <div>
                            <span className="detail-label">Região</span>
                            <span className="detail-value">{license.region}</span>
                          </div>
                          <div>
                            <span className="detail-label">Tipo Completo</span>
                            <span className="detail-value">{license.typeLabel}</span>
                          </div>
                        </div>
                        <div className="detail-desc">
                          <span className="detail-label">Descrição</span>
                          <span className="detail-value">{license.description}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            disabled={pagination.page === 1}
            onClick={() => onPageChange(1)}
          >
            «
          </button>
          <button
            className="page-btn"
            disabled={pagination.page === 1}
            onClick={() => onPageChange(pagination.page - 1)}
          >
            ‹
          </button>
          {getPageNumbers(pagination.page, pagination.totalPages).map((p, i) =>
            p === '...' ? (
              <span key={`ellipsis-${i}`} className="page-ellipsis">…</span>
            ) : (
              <button
                key={p}
                className={`page-btn${p === pagination.page ? ' page-btn--active' : ''}`}
                onClick={() => onPageChange(p)}
              >
                {p}
              </button>
            )
          )}
          <button
            className="page-btn"
            disabled={pagination.page === pagination.totalPages}
            onClick={() => onPageChange(pagination.page + 1)}
          >
            ›
          </button>
          <button
            className="page-btn"
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
