import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ContentGenerator from './pages/ContentGenerator'
import Library from './pages/Library'
import Calendar from './pages/Calendar'
import LicensesHome from './licenses/pages/Home.jsx'
import LicensesResults from './licenses/pages/Results.jsx'
import LicensesLeads from './licenses/pages/Leads.jsx'
import './licenses/theme.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="gerar" element={<ContentGenerator />} />
          <Route path="biblioteca" element={<Library />} />
          <Route path="calendario" element={<Calendar />} />
          <Route path="licencas" element={<LicensesHome />} />
          <Route path="licencas/resultados" element={<LicensesResults />} />
          <Route path="licencas/leads" element={<LicensesLeads />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
