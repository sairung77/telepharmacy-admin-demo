import { useNavigate } from 'react-router-dom'
import { branches, employees, provinces } from '../../../data/mockData'

export default function BranchesTab({ company }) {
  const navigate = useNavigate()
  const companyBranches = branches.filter(b => b.company_id === company.id)

  return (
    <div>
      <div className="mb-4">
        <p className="text-sm text-slate-600">สาขาของ <span className="font-medium">{company.name}</span></p>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="text-left px-4 py-3 font-medium text-slate-600">ชื่อสาขา</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">รหัสสาขา</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">จังหวัด</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600">เภสัชกร</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {companyBranches.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">ยังไม่มีสาขา</td></tr>
            )}
            {companyBranches.map(b => {
              const province = provinces.find(p => p.id === b.address.province_id)
              const pharCount = employees.filter(e => e.branch_id === b.id && e.is_pharmacist).length
              return (
                <tr key={b.id} className="hover:bg-slate-50 cursor-pointer"
                  onClick={() => navigate(`/companies/${company.id}/branches/${b.id}`)}>
                  <td className="px-4 py-3 font-medium text-slate-800">{b.name}</td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">{b.reference_code}</td>
                  <td className="px-4 py-3 text-slate-600">{province?.name || '-'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{pharCount}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-sky-600 hover:text-sky-800 text-xs font-medium"
                      onClick={e => { e.stopPropagation(); navigate(`/companies/${company.id}/branches/${b.id}`) }}>
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
