import { Store, GitBranch, UserCheck, Activity } from 'lucide-react'

const stats = [
  { label: 'ร้านขายยา', value: '2', icon: Store, color: 'text-sky-500', bg: 'bg-sky-50' },
  { label: 'สาขาทั้งหมด', value: '3', icon: GitBranch, color: 'text-violet-500', bg: 'bg-violet-50' },
  { label: 'เภสัชกร Active', value: '3', icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { label: 'Encounter วันนี้', value: '12', icon: Activity, color: 'text-orange-500', bg: 'bg-orange-50' },
]

export default function Dashboard() {
  return (
    <div className="p-8">
      <h2 className="text-xl font-bold text-slate-800 mb-6">แดชบอร์ด</h2>
      <div className="grid grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon size={20} className={s.color} />
            </div>
            <div className="text-2xl font-bold text-slate-800">{s.value}</div>
            <div className="text-sm text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
