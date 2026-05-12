import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { companies, branches } from '../../data/mockData'
import Badge from '../../components/Badge'

const modeLabel = { off: 'ปิด', pos: 'POS Mode', ep: 'EP Mode' }
const modeColor = { off: 'red', pos: 'blue', ep: 'yellow' }
const PAGE_SIZE = 10

export default function CompanyList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [modeFilter, setModeFilter] = useState('all')
  const [page, setPage] = useState(1)

  const filtered = companies.filter(c => {
    const matchName = c.name.toLowerCase().includes(search.toLowerCase())
    const matchMode = modeFilter === 'all' || c.telepharmacy_mode === modeFilter
    return matchName && matchMode
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleSearch = (val) => { setSearch(val); setPage(1) }
  const handleMode = (val) => { setModeFilter(val); setPage(1) }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">รายการร้านขายยา</h2>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อร้าน..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 w-64"
          />
        </div>
        <select
          value={modeFilter}
          onChange={e => handleMode(e.target.value)}
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
            {paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">ไม่พบร้านขายยา</td>
              </tr>
            )}
            {paginated.map(c => {
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

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50">
          <p className="text-xs text-slate-500">
            แสดง {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} จาก {filtered.length} รายการ
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 text-xs rounded-lg font-medium transition-colors ${
                  p === currentPage
                    ? 'bg-sky-500 text-white'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
