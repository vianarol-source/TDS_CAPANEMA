import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StateSelector from '../components/StateSelector/StateSelector.jsx';
import SearchFilters from '../components/SearchFilters/SearchFilters.jsx';
import { useLicenses } from '../hooks/useLicenses.js';
import styles from './Home.module.css';

const DEFAULT_FILTERS = { query: '', type: '', status: '', ruralOnly: false };

export default function Home() {
  const [selectedStates, setSelectedStates] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const { loading, search } = useLicenses();
  const navigate = useNavigate();

  async function handleSearch() {
    navigate('/licencas/resultados', {
      state: { selectedStates, filters },
    });
  }

  return (
    <div className={`${styles.home} p-4 lg:p-8 max-w-7xl mx-auto`}>
      <div className={styles.homeHero}>
        <h1 className={styles.heroTitle}>Consulta de Licenças Ambientais</h1>
        <p className={styles.heroDesc}>
          Selecione os estados e aplique filtros para pesquisar licenças ambientais
          emitidas pelos órgãos estaduais e pelo IBAMA em todo o Brasil.
        </p>
      </div>

      <div className={styles.homeGrid}>
        <StateSelector
          selected={selectedStates}
          onChange={setSelectedStates}
        />
        <SearchFilters
          filters={filters}
          onChange={setFilters}
          onSearch={handleSearch}
          loading={loading}
        />
      </div>

      <div className={styles.homeFooter}>
        <div className={styles.footerInfo}>
          <span className={styles.infoDot} />
          {selectedStates.length === 0
            ? 'A pesquisa abrangerá todos os 27 estados e o Distrito Federal.'
            : `A pesquisa abrangerá ${selectedStates.length} estado${selectedStates.length > 1 ? 's' : ''}: ${selectedStates.join(', ')}.`}
        </div>
      </div>
    </div>
  );
}
