import { Outlet, useLocation, Link } from 'react-router-dom'
import { Shield, LayoutDashboard, Menu, X } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
]

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-800/50 border-r border-slate-700/50">
        <div className="p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
            <Shield className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="font-bold text-white tracking-tight">ODIN Observer</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 text-xs text-slate-600 border-t border-slate-700/50">
          v0.1.0 · InnovaDataCO
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-800/80 backdrop-blur border-b border-slate-700/50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-500" />
            <span className="font-bold text-white text-sm">ODIN Observer</span>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-slate-400 hover:text-white"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {mobileOpen && (
          <nav className="px-4 pb-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 md:pt-0 pt-14">
        <Outlet />
      </main>
    </div>
  )
}
