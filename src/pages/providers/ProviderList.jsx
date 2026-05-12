import { useState, useRef } from 'react'
import { Plus, Pencil, Trash2, Upload, X } from 'lucide-react'
import { deliveryProviders as initialProviders } from '../../data/mockData'
import Badge from '../../components/Badge'
import SlideOver from '../../components/SlideOver'
import ConfirmModal from '../../components/ConfirmModal'

const emptyForm = { code: '', name: '', logo_url: '', is_active: true }

function LogoUpload({ value, onChange }) {
  const inputRef = useRef(null)

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onChange(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleClear = () => {
    onChange('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">Logo</label>
      <div className="flex items-center gap-3">
        {/* Preview */}
        <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center bg-slate-50 flex-shrink-0 overflow-hidden">
          {value
            ? <img src={value} alt="logo" className="w-full h-full object-contain p-1" />
            : <Upload size={20} className="text-slate-300" />
          }
        </div>
        {/* Controls */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="px-3 py-1.5 text-xs border rounded-lg hover:bg-slate-50 text-slate-600 flex items-center gap-1.5"
          >
            <Upload size={12} /> อัปโหลดรูป
          </button>
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-1.5 text-xs border border-red-200 rounded-lg hover:bg-red-50 text-red-500 flex items-center gap-1.5"
            >
              <X size={12} /> ลบรูป
            </button>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
        </div>
      </div>
    </div>
  )
}

export default function ProviderList() {
  const [providers, setProviders] = useState(initialProviders)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const openAdd = () => { setForm(emptyForm); setEditing(null); setOpen(true) }
  const openEdit = (p) => { setForm(p); setEditing(p.id); setOpen(true) }
  const handleSave = () => {
    if (editing) setProviders(prev => prev.map(p => p.id === editing ? { ...form, id: editing } : p))
    else setProviders(prev => [...prev, { ...form, id: Date.now() }])
    setOpen(false)
  }
  const handleDelete = () => {
    setProviders(prev => prev.filter(p => p.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800">จัดการ Provider</h2>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white text-sm font-medium rounded-lg hover:bg-sky-600">
          <Plus size={16} /> เพิ่ม Provider
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="px-4 py-3 w-12"></th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">รหัส</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">ชื่อ Provider</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">สถานะ</th>
              <th className="px-4 py-3 w-24"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {providers.map(p => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="w-8 h-8 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden">
                    {p.logo_url
                      ? <img src={p.logo_url} alt={p.name} className="w-full h-full object-contain p-0.5" />
                      : <span className="text-[10px] font-bold text-slate-400">{p.code?.[0]}</span>
                    }
                  </div>
                </td>
                <td className="px-4 py-3 font-mono font-medium text-slate-700">{p.code}</td>
                <td className="px-4 py-3 text-slate-800">{p.name}</td>
                <td className="px-4 py-3">
                  <Badge color={p.is_active ? 'green' : 'red'}>{p.is_active ? 'เปิด' : 'ปิด'}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-sky-600">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => setDeleteTarget(p)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SlideOver open={open} onClose={() => setOpen(false)}
        title={editing ? 'แก้ไข Provider' : 'เพิ่ม Provider'}
        footer={
          <>
            <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm border rounded-lg hover:bg-slate-50">ยกเลิก</button>
            <button onClick={handleSave} className="px-4 py-2 text-sm bg-sky-500 text-white rounded-lg hover:bg-sky-600">บันทึก</button>
          </>
        }
      >
        {[
          { k: 'code', l: 'รหัส Provider (code)', db: 'delivery_providers.code', hint: 'UPPERCASE เช่น KERRY', req: true },
          { k: 'name', l: 'ชื่อ Provider', db: 'delivery_providers.name', req: true },
        ].map(f => (
          <div key={f.k}>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              {f.l} {f.req && <span className="text-red-500">*</span>}
            </label>
            <input type="text" value={form[f.k]} onChange={e => set(f.k, f.k === 'code' ? e.target.value.toUpperCase() : e.target.value)}
              placeholder={f.hint || ''}
              className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
        ))}

        <LogoUpload value={form.logo_url} onChange={v => set('logo_url', v)} />

        <div className="flex items-center justify-between py-1">
          <div>
            <span className="text-sm font-medium text-slate-700">เปิดใช้งาน</span>
          </div>
          <button
            onClick={() => set('is_active', !form.is_active)}
            style={{ width: 40, height: 22, borderRadius: 11, background: form.is_active ? '#0EA5E9' : '#CBD5E1', position: 'relative', transition: 'background 0.2s', border: 'none', cursor: 'pointer' }}
          >
            <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 2, left: form.is_active ? 20 : 2, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
          </button>
        </div>
      </SlideOver>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`ลบ Provider "${deleteTarget?.name}"`}
        message="คุณแน่ใจหรือไม่ว่าต้องการลบ Provider นี้? การดำเนินการนี้ไม่สามารถยกเลิกได้"
      />
    </div>
  )
}
