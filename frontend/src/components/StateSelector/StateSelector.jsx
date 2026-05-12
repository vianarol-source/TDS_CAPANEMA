import { useState } from 'react';
import './StateSelector.css';

const STATES = [
  { uf: 'AC', name: 'Acre', region: 'Norte' },
  { uf: 'AL', name: 'Alagoas', region: 'Nordeste' },
  { uf: 'AP', name: 'Amapá', region: 'Norte' },
  { uf: 'AM', name: 'Amazonas', region: 'Norte' },
  { uf: 'BA', name: 'Bahia', region: 'Nordeste' },
  { uf: 'CE', name: 'Ceará', region: 'Nordeste' },
  { uf: 'DF', name: 'Distrito Federal', region: 'Centro-Oeste' },
  { uf: 'ES', name: 'Espírito Santo', region: 'Sudeste' },
  { uf: 'GO', name: 'Goiás', region: 'Centro-Oeste' },
  { uf: 'MA', name: 'Maranhão', region: 'Nordeste' },
  { uf: 'MT', name: 'Mato Grosso', region: 'Centro-Oeste' },
  { uf: 'MS', name: 'Mato Grosso do Sul', region: 'Centro-Oeste' },
  { uf: 'MG', name: 'Minas Gerais', region: 'Sudeste' },
  { uf: 'PA', name: 'Pará', region: 'Norte' },
  { uf: 'PB', name: 'Paraíba', region: 'Nordeste' },
  { uf: 'PR', name: 'Paraná', region: 'Sul' },
  { uf: 'PE', name: 'Pernambuco', region: 'Nordeste' },
  { uf: 'PI', name: 'Piauí', region: 'Nordeste' },
  { uf: 'RJ', name: 'Rio de Janeiro', region: 'Sudeste' },
  { uf: 'RN', name: 'Rio Grande do Norte', region: 'Nordeste' },
  { uf: 'RS', name: 'Rio Grande do Sul', region: 'Sul' },
  { uf: 'RO', name: 'Rondônia', region: 'Norte' },
  { uf: 'RR', name: 'Roraima', region: 'Norte' },
  { uf: 'SC', name: 'Santa Catarina', region: 'Sul' },
  { uf: 'SP', name: 'São Paulo', region: 'Sudeste' },
  { uf: 'SE', name: 'Sergipe', region: 'Nordeste' },
  { uf: 'TO', name: 'Tocantins', region: 'Norte' },
];

const REGIONS = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'];

const REGION_COLORS = {
  Norte: '#16a34a',
  Nordeste: '#ca8a04',
  'Centro-Oeste': '#9333ea',
  Sudeste: '#2563eb',
  Sul: '#dc2626',
};

export default function StateSelector({ selected, onChange }) {
  const [activeRegion, setActiveRegion] = useState(null);

  const visibleStates = activeRegion
    ? STATES.filter(s => s.region === activeRegion)
    : STATES;

  function toggleState(uf) {
    if (selected.includes(uf)) {
      onChange(selected.filter(s => s !== uf));
    } else {
      onChange([...selected, uf]);
    }
  }

  function toggleRegion(region) {
    const regionUFs = STATES.filter(s => s.region === region).map(s => s.uf);
    const allSelected = regionUFs.every(uf => selected.includes(uf));
    if (allSelected) {
      onChange(selected.filter(uf => !regionUFs.includes(uf)));
    } else {
      const newSelected = [...new Set([...selected, ...regionUFs])];
      onChange(newSelected);
    }
  }

  function selectAll() { onChange(STATES.map(s => s.uf)); }
  function clearAll()  { onChange([]); }

  const regionSelected = (region) => {
    const ufs = STATES.filter(s => s.region === region).map(s => s.uf);
    const count = ufs.filter(uf => selected.includes(uf)).length;
    return { count, total: ufs.length, all: count === ufs.length };
  };

  return (
    <div className="state-selector">
      <div className="selector-header">
        <div>
          <h2 className="selector-title">Selecione os Estados</h2>
          <p className="selector-desc">
            {selected.length === 0
              ? 'Nenhum estado selecionado — pesquisa nacional'
              : `${selected.length} estado${selected.length > 1 ? 's' : ''} selecionado${selected.length > 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="selector-actions">
          <button className="btn-text" onClick={selectAll}>Selecionar todos</button>
          <button className="btn-text" onClick={clearAll}>Limpar</button>
        </div>
      </div>

      {/* Filtro por região */}
      <div className="region-filter">
        <button
          className={`region-btn${activeRegion === null ? ' region-btn--active' : ''}`}
          onClick={() => setActiveRegion(null)}
          style={activeRegion === null ? { borderColor: '#166534', color: '#166534' } : {}}
        >
          Todas
        </button>
        {REGIONS.map(region => {
          const { count, total, all } = regionSelected(region);
          const isActive = activeRegion === region;
          return (
            <button
              key={region}
              className={`region-btn${isActive ? ' region-btn--active' : ''}`}
              style={isActive ? { borderColor: REGION_COLORS[region], color: REGION_COLORS[region] } : {}}
              onClick={() => setActiveRegion(isActive ? null : region)}
            >
              {region}
              {count > 0 && (
                <span
                  className="region-badge"
                  style={{ background: all ? REGION_COLORS[region] : '#9ca3af' }}
                >
                  {count}/{total}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Ação rápida por região */}
      {activeRegion && (
        <div className="region-quick-action">
          <button
            className="btn-region-select"
            style={{ color: REGION_COLORS[activeRegion], borderColor: REGION_COLORS[activeRegion] }}
            onClick={() => toggleRegion(activeRegion)}
          >
            {regionSelected(activeRegion).all
              ? `Desmarcar todos do ${activeRegion}`
              : `Selecionar todos do ${activeRegion}`}
          </button>
        </div>
      )}

      {/* Grid de estados */}
      <div className="states-grid">
        {visibleStates.map(state => {
          const isSelected = selected.includes(state.uf);
          const color = REGION_COLORS[state.region];
          return (
            <button
              key={state.uf}
              className={`state-card${isSelected ? ' state-card--selected' : ''}`}
              style={isSelected ? { borderColor: color, background: `${color}12`, color } : {}}
              onClick={() => toggleState(state.uf)}
              title={state.name}
            >
              <span className="state-uf">{state.uf}</span>
              <span className="state-name">{state.name}</span>
              {isSelected && (
                <span className="state-check" style={{ color }}>✓</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Chips dos selecionados */}
      {selected.length > 0 && (
        <div className="selected-chips">
          <span className="chips-label">Selecionados:</span>
          <div className="chips-list">
            {selected.map(uf => {
              const state = STATES.find(s => s.uf === uf);
              return (
                <span
                  key={uf}
                  className="chip"
                  style={{ background: `${REGION_COLORS[state?.region]}18`, color: REGION_COLORS[state?.region], borderColor: `${REGION_COLORS[state?.region]}40` }}
                >
                  {uf}
                  <button
                    className="chip-remove"
                    onClick={() => toggleState(uf)}
                    aria-label={`Remover ${uf}`}
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
