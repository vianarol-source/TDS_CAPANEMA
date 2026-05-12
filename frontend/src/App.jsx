import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header.jsx';
import Home from './pages/Home.jsx';
import Results from './pages/Results.jsx';
import './App.css';

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resultados" element={<Results />} />
        </Routes>
      </main>
    </div>
  );
}
