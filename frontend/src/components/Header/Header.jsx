import { Link, useLocation } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-brand">
          <span className="header-icon">🌿</span>
          <div>
            <span className="header-title">LicençasAmbientais</span>
            <span className="header-subtitle">Consulta Nacional</span>
          </div>
        </Link>
        <nav className="header-nav">
          <Link to="/" className={`nav-link${location.pathname === '/' ? ' active' : ''}`}>
            Pesquisar
          </Link>
          <Link to="/resultados" className={`nav-link${location.pathname === '/resultados' ? ' active' : ''}`}>
            Resultados
          </Link>
        </nav>
      </div>
    </header>
  );
}
