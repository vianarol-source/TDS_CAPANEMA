import { useState } from 'react';
import styles from './StateSelector.module.css';

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
    <div className={styles.stateSelector}>
      <div className={styles.selectorHeader}>
        <div>
          <h2 className={styles.selectorTitle}>Selecione os Estados</h2>
          <p className={styles.selectorDesc}>
            {selected.length === 0
              ? 'Nenhum estado selecionado — pesquisa nacional'
              : `${selected.length} estado${selected.length > 1 ? 's' : ''} selecionado${selected.length > 1 ? 's' : ''}`}
          </p>
        </div>
        <div className={styles.selectorActions}>
          <button className={styles.btnText} onClick={selectAll}>Selecionar todos</button>
          <button className={styles.btnText} onClick={clearAll}>Limpar</button>
        </div>
      </div>

      {/* Filtro por região */}
      <div className={styles.regionFilter}>
        <button
          className={`${styles.regionBtn}${activeRegion === null ? ` ${styles.regionBtnActive}` : ''}`}
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
              className={`${styles.regionBtn}${isActive ? ` ${styles.regionBtnActive}` : ''}`}
              style={isActive ? { borderColor: REGION_COLORS[region], color: REGION_COLORS[region] } : {}}
              onClick={() => setActiveRegion(isActive ? null : region)}
            >
              {region}
              {count > 0 && (
                <span
                  className={styles.regionBadge}
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
        <div className={styles.regionQuickAction}>
          <button
            className={styles.btnRegionSelect}
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
      <div className={styles.statesGrid}>
        {visibleStates.map(state => {
          const isSelected = selected.includes(state.uf);
          const color = REGION_COLORS[state.region];
          return (
            <button
              key={state.uf}
              className={`${styles.stateCard}${isSelected ? ` ${styles.stateCardSelected}` : ''}`}
              style={isSelected ? { borderColor: color, background: `${color}12`, color } : {}}
              onClick={() => toggleState(state.uf)}
              title={state.name}
            >
              <span className={styles.stateUf}>{state.uf}</span>
              <span className={styles.stateName}>{state.name}</span>
              {isSelected && (
                <span className={styles.stateCheck} style={{ color }}>✓</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Chips dos selecionados */}
      {selected.length > 0 && (
        <div className={styles.selectedChips}>
          <span className={styles.chipsLabel}>Selecionados:</span>
          <div className={styles.chipsList}>
            {selected.map(uf => {
              const state = STATES.find(s => s.uf === uf);
              return (
                <span
                  key={uf}
                  className={styles.chip}
                  style={{ background: `${REGION_COLORS[state?.region]}18`, color: REGION_COLORS[state?.region], borderColor: `${REGION_COLORS[state?.region]}40` }}
                >
                  {uf}
                  <button
                    className={styles.chipRemove}
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
