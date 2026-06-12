import { Outlet, NavLink, useLocation } from 'react-router-dom'
import {
  Zap,
  PenSquare,
  BookOpen,
  CalendarDays,
  Home,
  Menu,
  X,
  ChevronRight,
  Leaf,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { getAllPosts } from '../utils/storage'

const navItems = [
  { to: '/', label: 'Início', icon: Home, exact: true },
  { to: '/gerar', label: 'Gerar Conteúdo', icon: PenSquare, exact: false },
  { to: '/biblioteca', label: 'Biblioteca', icon: BookOpen, exact: false },
  { to: '/calendario', label: 'Calendário Editorial', icon: CalendarDays, exact: false },
  { to: '/licencas', label: 'Licenças Ambientais', icon: Leaf, exact: false },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [postCount, setPostCount] = useState(0)
  const location = useLocation()

  useEffect(() => {
    setPostCount(getAllPosts().length)
  }, [location.pathname])

  const currentPage = navItems.find(item =>
    item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to) && item.to !== '/'
  ) || navItems[0]

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-navy-950/60 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30 w-64 flex flex-col
          bg-navy-900 border-r border-navy-800
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-navy-800">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gold-500 shadow-md shadow-gold-900/30 flex-shrink-0">
            <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold text-sm leading-tight">Fenix LinkedIn</p>
            <p className="text-gold-400 text-xs font-medium">Content Engine</p>
          </div>
          <button
            className="lg:hidden ml-auto text-navy-400 hover:text-white p-1"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-navy-500 text-xs font-semibold uppercase tracking-wider px-3.5 pb-2 pt-1">
            Menu
          </p>
          {navItems.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                isActive ? 'nav-link-active' : 'nav-link text-navy-300 hover:text-white hover:bg-navy-800'
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {to === '/biblioteca' && postCount > 0 && (
                <span className="ml-auto bg-gold-500/20 text-gold-300 text-xs font-bold rounded-full px-1.5 py-0.5 leading-none">
                  {postCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer brand */}
        <div className="px-4 py-4 border-t border-navy-800">
          <div className="bg-navy-800/60 rounded-lg p-3">
            <p className="text-navy-300 text-xs font-semibold leading-snug">FG Soluções Comerciais</p>
            <p className="text-gold-400 text-xs font-medium">Fenix Global</p>
            <p className="text-navy-500 text-xs mt-1">Geradores Capanema</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="bg-white border-b border-gray-100 px-4 lg:px-6 py-3.5 flex items-center gap-3 flex-shrink-0">
          <button
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-navy-700 hover:bg-gray-100 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm min-w-0">
            <span className="text-gray-400 hidden sm:block">Fenix LinkedIn Engine</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300 hidden sm:block flex-shrink-0" />
            <span className="font-semibold text-navy-800 truncate">{currentPage.label}</span>
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 bg-navy-50 text-navy-700 rounded-lg px-3 py-1.5">
              <Zap className="w-3.5 h-3.5 text-gold-500" />
              <span className="text-xs font-semibold">FG Soluções Comerciais</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
