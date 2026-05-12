import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { companies, branches } from '../../data/mockData'
import Badge from '../../components/Badge'

const modeLabel = { off: 'ปิด', pos: 'POS Mode', ep: 'EP Mode' }
const modeColor = { off: 'red', pos: 'blue', ep: 'yellow' }

export default function CompanyList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [modeFilter, setModeFilter] = useState('all')

  const filtered = companies.filter(c => {
    const matchName = c.name.toLowerCase().includes(search.toLowerCase())
    const matchMode = modeFilter === 'all' || c.telepharmacy_mode === modeFilter
    return matchName && matchMode
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800">รายการร้านขายยา</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white text-sm font-medium rounded-lg hover:bg-sky-600">
          <Plus size={16} /> เพิ่มร้านขายยา
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อร้าน..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 w-64"
          />
        </div>
        <select
          value={modeFilter}
          onChange={e => setModeFilter(e.target.value)}
          className="px-3 py-2 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="all">Telepharmacy Mode ทั้งหมด</option>
          <option value="off">ปิด</option>
          <option value="pos">POS Mode</option>
          <option value="ep">EP Mode</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="text-left px-4 py-3 font-medium text-slate-600">ชื่อร้านขายยา</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">เลขทะเบียน อย.</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600">สาขา</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Telepharmacy Mode</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">วันที่สร้าง</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(c => {
              const branchCount = branches.filter(b => b.company_id === c.id).length
              return (
                <tr key={c.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => navigate(`/companies/${c.id}`)}>
                  <td className="px-4 py-3 font-medium text-slate-800">{c.name}</td>
                  <td className="px-4 py-3 text-slate-600">{c.license_number}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge color="gray">{branchCount}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge color={modeColor[c.telepharmacy_mode]}>{modeLabel[c.telepharmacy_mode]}</Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{new Date(c.created_at).toLocaleDateString('th-TH')}</td>
                  <td className="px-4 py-3">
                    <button
                      className="text-sky-600 hover:text-sky-800 text-xs font-medium"
                      onClick={e => { e.stopPropagation(); navigate(`/companies/${c.id}`) }}
                    >
                      ดูรายละเอียด
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
