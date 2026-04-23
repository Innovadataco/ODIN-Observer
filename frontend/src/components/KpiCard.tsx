import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: string
  change: string
  icon: LucideIcon
  trend: 'up' | 'down' | 'neutral'
}

export default function KpiCard({ title, value, change, icon: Icon, trend }: KpiCardProps) {
  const trendConfig = {
    up: { icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    down: { icon: TrendingDown, color: 'text-red-400', bg: 'bg-red-500/10' },
    neutral: { icon: Minus, color: 'text-slate-400', bg: 'bg-slate-500/10' },
  }
  const t = trendConfig[trend]
  const TrendIcon = t.icon

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${t.bg}`}>
          <Icon className="w-4 h-4 text-slate-300" />
        </div>
      </div>
      <div className="flex items-center gap-1 mt-3">
        <TrendIcon className={`w-3.5 h-3.5 ${t.color}`} />
        <span className={`text-xs font-medium ${t.color}`}>{change}</span>
        <span className="text-xs text-slate-500">vs ayer</span>
      </div>
    </div>
  )
}
