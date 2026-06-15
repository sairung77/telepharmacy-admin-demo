import { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import ConfirmModal from '../../components/ConfirmModal'
import { usageText } from '../../data/medicationManagement'

export default function MedicationManagementList() {
  const { meds, deleteMed } = useOutletContext()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filtered = meds.filter(m =>
    m.arincare_product_name.toLowerCase().includes(query.toLowerCase()) ||
    m.arincare_product_reference_code.toLowerCase().includes(query.toLowerCase()))

  const handleDelete = () => { deleteMed(deleteTarget.id); setDeleteTarget(null) }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">จัดการข้อมูลยา (EP)</h2>
          <p className="text-sm text-slate-500 mt-0.5">ตั้งค่ารายละเอียดการใช้ยา (medication_management) สำหรับ EP Mode — โหลดค่าเริ่มต้นให้เภสัชกรในหน้าจ่ายยา</p>
        </div>
        <button onClick={() => navigate('new')} className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white text-sm font-medium rounded-lg hover:bg-sky-600">
          <Plus size={16} /> เพิ่มข้อมูลยา
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="ค้นหาชื่อยา / รหัสยา"
          className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="text-left px-4 py-3 font-medium text-slate-600 w-28">รหัสยา</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">ชื่อยา</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">ข้อบ่งใช้</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">สรุปวิธีใช้</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600 w-36">อัปเดตล่าสุด</th>
              <th className="px-4 py-3 w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(m => (
              <tr key={m.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => navigate(`${m.id}`)}>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{m.arincare_product_reference_code}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{m.arincare_product_name}</td>
                <td className="px-4 py-3 text-slate-600 max-w-[220px]"><span className="line-clamp-2">{m.indication || '-'}</span></td>
                <td className="px-4 py-3 text-slate-600 text-xs max-w-[240px]">{usageText(m)}</td>
                <td className="px-4 py-3 text-slate-400 text-xs">{m.updated_at}</td>
                <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => navigate(`${m.id}`)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-sky-600"><Pencil size={14} /></button>
                    <button onClick={() => setDeleteTarget(m)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="py-16 text-center text-slate-400 text-sm">ไม่พบข้อมูลยา</div>}
      </div>

      <ConfirmModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title={`ลบข้อมูลยา "${deleteTarget?.arincare_product_name}"`}
        message="ข้อมูลการใช้ยานี้จะถูกลบออกจากระบบและไม่สามารถกู้คืนได้" />
    </div>
  )
}
