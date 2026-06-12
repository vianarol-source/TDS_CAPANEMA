import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LicenseTable from '../components/LicenseTable/LicenseTable.jsx';
import SummaryCards from '../components/SummaryCards/SummaryCards.jsx';
import SearchFilters from '../components/SearchFilters/SearchFilters.jsx';
import StateSelector from '../components/StateSelector/StateSelector.jsx';
import { useLicenses } from '../hooks/useLicenses.js';
import styles from './Results.module.css';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data, loading, error, search } = useLicenses();

  const [selectedStates, setSelectedStates] = useState(
    location.state?.selectedStates ?? []
  );
  const [filters, setFilters] = useState(
    location.state?.filters ?? { query: '', type: '', status: '', ruralOnly: false }
  );
  const [page, setPage] = useState(1);
  const [showSelector, setShowSelector] = useState(false);

  useEffect(() => {
    search({ states: selectedStates, filters, page });
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  function handleSearch() {
    setPage(1);
    search({ states: selectedStates, filters, page: 1 });
    setShowSelector(false);
  }

  function handlePageChange(newPage) {
    setPage(newPage);
    search({ states: selectedStates, filters, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className={`${styles.results} p-4 lg:p-8 max-w-7xl mx-auto`}>
      <div className={styles.resultsTopbar}>
        <button className={styles.btnBack} onClick={() => navigate('/licencas')}>
          ← Voltar
        </button>
        <h1 className={styles.resultsTitle}>Resultados da Pesquisa</h1>
        <button
          className={styles.btnToggleSelector}
          onClick={() => setShowSelector(v => !v)}
        >
          {showSelector ? 'Ocultar estados' : `Estados (${selectedStates.length || 'todos'})`}
        </button>
      </div>

      {showSelector && (
        <StateSelector selected={selectedStates} onChange={setSelectedStates} />
      )}

      <SearchFilters
        filters={filters}
        onChange={setFilters}
        onSearch={handleSearch}
        loading={loading}
      />

      {error && (
        <div className={styles.errorBanner}>
          ⚠️ {error}
        </div>
      )}

      {data && (
        <SummaryCards summary={data.summary} />
      )}

      <LicenseTable
        licenses={data?.data}
        pagination={data?.pagination}
        onPageChange={handlePageChange}
        loading={loading}
      />
    </div>
  );
}
