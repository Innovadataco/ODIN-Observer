import { LogOut, Users, Activity, Clock, BarChart3, AlertTriangle, AlertOctagon, Info } from 'lucide-react'
import KpiCard from '../components/KpiCard'
import { useAuth } from '../hooks/useAuth'

const mockEvents = [
  { id: 1, severity: 'critical', message: 'CPU > 95% en servidor principal', time: 'Hace 2 min', service: 'infra-core' },
  { id: 2, severity: 'warning', message: 'Latencia API elevada (850ms)', time: 'Hace 5 min', service: 'api-gateway' },
  { id: 3, severity: 'info', message: 'Deploy completado v2.4.1', time: 'Hace 12 min', service: 'ci-cd' },
  { id: 4, severity: 'warning', message: 'Disco > 80% en nodo-03', time: 'Hace 18 min', service: 'infra-core' },
  { id: 5, severity: 'critical', message: 'DB connection pool exhausted', time: 'Hace 25 min', service: 'database' },
]

const severityConfig = {
  critical: { icon: AlertOctagon, color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  warning: { icon: AlertTriangle, color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  info: { icon: Info, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
}

const chartBars = [35, 55, 42, 78, 62, 88, 45, 70, 58, 82, 65, 90]

export default function Dashboard() {
  const { logout } = useAuth()

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Dashboard Ejecutivo</h2>
          <p className="text-sm text-slate-400">Visión global del sistema ODIN</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-slate-800"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <KpiCard title="Usuarios activos" value="1,247" change="+12%" icon={Users} trend="up" />
        <KpiCard title="Eventos hoy" value="38" change="+5" icon={Activity} trend="up" />
        <KpiCard title="Uptime" value="99.97%" change="-0.01%" icon={Clock} trend="neutral" />
        <KpiCard title="Métricas/min" value="4.2K" change="+8%" icon={BarChart3} trend="up" />
      </div>

      {/* Chart + Events */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Chart */}
        <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700 rounded-2xl p-4 md:p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Tráfico de eventos (última hora)</h3>
          <div className="flex items-end gap-2 h-40">
            {chartBars.map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-emerald-500/80 rounded-t hover:bg-emerald-400 transition-colors"
                style={{ height: `${h}%` }}
                title={`${h}%`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span>-60 min</span>
            <span>-30 min</span>
            <span>Ahora</span>
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 md:p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Eventos recientes</h3>
          <div className="space-y-3">
            {mockEvents.map((event) => {
              const { icon: Icon, color } = severityConfig[event.severity as keyof typeof severityConfig]
              return (
                <div key={event.id} className="flex items-start gap-3">
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg border ${color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-200 truncate">{event.message}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-500">{event.service}</span>
                      <span className="text-xs text-slate-600">·</span>
                      <span className="text-xs text-slate-500">{event.time}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
