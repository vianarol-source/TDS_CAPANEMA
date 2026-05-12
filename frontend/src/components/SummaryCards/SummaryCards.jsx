import './SummaryCards.css';

const STATUS_CONFIG = {
  'Ativa':      { color: '#16a34a', bg: '#dcfce7', icon: '✅' },
  'Vencida':    { color: '#dc2626', bg: '#fee2e2', icon: '⚠️' },
  'Suspensa':   { color: '#ca8a04', bg: '#fef9c3', icon: '⏸️' },
  'Cancelada':  { color: '#6b7280', bg: '#f3f4f6', icon: '🚫' },
  'Em análise': { color: '#2563eb', bg: '#dbeafe', icon: '🔍' },
};

export default function SummaryCards({ summary }) {
  if (!summary) return null;

  const { total, byStatus, byType } = summary;

  return (
    <div className="summary-section">
      <div className="summary-total">
        <span className="total-number">{total?.toLocaleString('pt-BR') ?? 0}</span>
        <span className="total-label">licenças encontradas</span>
      </div>

      {byStatus && Object.keys(byStatus).length > 0 && (
        <div className="summary-row">
          {Object.entries(byStatus).map(([status, count]) => {
            const cfg = STATUS_CONFIG[status] || { color: '#6b7280', bg: '#f3f4f6', icon: '📋' };
            return (
              <div key={status} className="summary-card" style={{ background: cfg.bg }}>
                <span className="summary-icon">{cfg.icon}</span>
                <span className="summary-count" style={{ color: cfg.color }}>
                  {count.toLocaleString('pt-BR')}
                </span>
                <span className="summary-status" style={{ color: cfg.color }}>{status}</span>
              </div>
            );
          })}
        </div>
      )}

      {byType && Object.keys(byType).length > 0 && (
        <div className="type-breakdown">
          {Object.entries(byType)
            .sort(([, a], [, b]) => b - a)
            .map(([type, count]) => (
              <div key={type} className="type-bar-item">
                <span className="type-bar-label">{type}</span>
                <div className="type-bar-track">
                  <div
                    className="type-bar-fill"
                    style={{ width: `${(count / total) * 100}%` }}
                  />
                </div>
                <span className="type-bar-count">{count}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
