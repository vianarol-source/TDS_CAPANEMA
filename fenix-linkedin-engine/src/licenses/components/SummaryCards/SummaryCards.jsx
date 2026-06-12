import styles from './SummaryCards.module.css';

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
    <div className={styles.summarySection}>
      <div className={styles.summaryTotal}>
        <span className={styles.totalNumber}>{total?.toLocaleString('pt-BR') ?? 0}</span>
        <span className={styles.totalLabel}>licenças encontradas</span>
      </div>

      {byStatus && Object.keys(byStatus).length > 0 && (
        <div className={styles.summaryRow}>
          {Object.entries(byStatus).map(([status, count]) => {
            const cfg = STATUS_CONFIG[status] || { color: '#6b7280', bg: '#f3f4f6', icon: '📋' };
            return (
              <div key={status} className={styles.summaryCard} style={{ background: cfg.bg }}>
                <span className={styles.summaryIcon}>{cfg.icon}</span>
                <span className={styles.summaryCount} style={{ color: cfg.color }}>
                  {count.toLocaleString('pt-BR')}
                </span>
                <span className={styles.summaryStatus} style={{ color: cfg.color }}>{status}</span>
              </div>
            );
          })}
        </div>
      )}

      {byType && Object.keys(byType).length > 0 && (
        <div className={styles.typeBreakdown}>
          {Object.entries(byType)
            .sort(([, a], [, b]) => b - a)
            .map(([type, count]) => (
              <div key={type} className={styles.typeBarItem}>
                <span className={styles.typeBarLabel}>{type}</span>
                <div className={styles.typeBarTrack}>
                  <div
                    className={styles.typeBarFill}
                    style={{ width: `${(count / total) * 100}%` }}
                  />
                </div>
                <span className={styles.typeBarCount}>{count}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
