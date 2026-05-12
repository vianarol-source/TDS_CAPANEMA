import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StateSelector from '../components/StateSelector/StateSelector.jsx';
import SearchFilters from '../components/SearchFilters/SearchFilters.jsx';
import { useLicenses } from '../hooks/useLicenses.js';
import './Home.css';

const DEFAULT_FILTERS = { query: '', type: '', status: '' };

export default function Home() {
  const [selectedStates, setSelectedStates] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const { loading, search } = useLicenses();
  const navigate = useNavigate();

  async function handleSearch() {
    navigate('/resultados', {
      state: { selectedStates, filters },
    });
  }

  return (
    <div className="home">
      <div className="home-hero">
        <h1 className="hero-title">Consulta de Licenças Ambientais</h1>
        <p className="hero-desc">
          Selecione os estados e aplique filtros para pesquisar licenças ambientais
          emitidas pelos órgãos estaduais e pelo IBAMA em todo o Brasil.
        </p>
      </div>

      <div className="home-grid">
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

      <div className="home-footer">
        <div className="footer-info">
          <span className="info-dot" />
          {selectedStates.length === 0
            ? 'A pesquisa abrangerá todos os 27 estados e o Distrito Federal.'
            : `A pesquisa abrangerá ${selectedStates.length} estado${selectedStates.length > 1 ? 's' : ''}: ${selectedStates.join(', ')}.`}
        </div>
      </div>
    </div>
  );
}
