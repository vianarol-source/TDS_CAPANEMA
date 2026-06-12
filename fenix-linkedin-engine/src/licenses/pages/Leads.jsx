import { useEffect, useState } from 'react';
import LeadsFilters, { DEFAULT_FILTERS } from '../components/LeadsFilters/LeadsFilters.jsx';
import LeadsTable from '../components/LeadsTable/LeadsTable.jsx';
import { useLeads } from '../hooks/useLeads.js';
import styles from './Leads.module.css';

const CLASS_CONFIG = {
  Hot:       { icon: '🔴', color: '#dc2626', bg: '#fee2e2' },
  Warm:      { icon: '🟠', color: '#c2410c', bg: '#ffedd5' },
  Nurturing: { icon: '🟡', color: '#a16207', bg: '#fef9c3' },
  Cold:      { icon: '⚪', color: '#475569', bg: '#f1f5f9' },
};

export default function Leads() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage]       = useState(1);
  const { data, loading, error, search, exportCSV } = useLeads();

  useEffect(() => { search(DEFAULT_FILTERS, 1); }, []);  // eslint-disable-line

  function handleSearch() {
    setPage(1);
    search(filters, 1);
  }

  function handleSort(sortBy, sortDir) {
    const next = { ...filters, sortBy, sortDir };
    setFilters(next);
    setPage(1);
    search(next, 1);
  }

  function handlePage(newPage) {
    setPage(newPage);
    search(filters, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className={`${styles.leadsPage} p-4 lg:p-8 max-w-7xl mx-auto`}>
      <div className={styles.leadsHero}>
        <div>
          <h1 className={styles.leadsTitle}>🎯 Painel de Leads — Geradores de Energia</h1>
          <p className={styles.leadsDesc}>
            Licenças ambientais pontuadas por potencial de venda. Filtre, ordene e exporte para o CRM.
          </p>
        </div>
        {data?.summary && <LeadsSummary summary={data.summary} />}
      </div>

      <LeadsFilters
        filters={filters}
        onChange={setFilters}
        onSearch={handleSearch}
        onExport={exportCSV}
        loading={loading}
        total={data?.pagination?.total}
      />

      {error && <div className={styles.leadsError}>⚠️ {error}</div>}

      <LeadsTable
        leads={data?.data}
        pagination={data?.pagination}
        onPageChange={handlePage}
        onSort={handleSort}
        sortBy={filters.sortBy}
        sortDir={filters.sortDir}
        loading={loading}
      />
    </div>
  );
}

function LeadsSummary({ summary }) {
  const { byClassification = {}, avgScore = 0, total = 0 } = summary;
  return (
    <div className={styles.leadsSummary}>
      <div className={styles.summaryAvg}>
        <span className={styles.avgNum}>{avgScore}</span>
        <span className={styles.avgLabel}>score médio</span>
      </div>
      {['Hot','Warm','Nurturing','Cold'].map(cls => {
        const count = byClassification[cls] || 0;
        const pct   = total > 0 ? Math.round((count / total) * 100) : 0;
        const c     = CLASS_CONFIG[cls];
        return (
          <div key={cls} className={styles.summaryCls} style={{ background: c.bg }}>
            <span className={styles.clsIcon}>{c.icon}</span>
            <span className={styles.clsCount} style={{ color: c.color }}>{count.toLocaleString('pt-BR')}</span>
            <span className={styles.clsLabel} style={{ color: c.color }}>{cls}</span>
            <span className={styles.clsPct}  style={{ color: c.color }}>{pct}%</span>
          </div>
        );
      })}
    </div>
  );
}
