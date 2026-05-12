import { useState } from 'react'
import { Plus, Eye, EyeOff } from 'lucide-react'
import { deliveryProviders } from '../../../data/mockData'
import Badge from '../../../components/Badge'
import SlideOver from '../../../components/SlideOver'

const emptyForm = {
  provider_code: '',
  scope: 'company',
  branch_id: null,
  api_key_enc: '',
  api_secret_enc: '',
  api_endpoint: '',
  merchant_id: '',
  additional_config: '',
  is_active: true,
}

function MaskedField({ label, value, onChange, required, fieldName }) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
      <div className="relative">
        <input type={show ? 'text' : 'password'} value={value} onChange={onChange}
          className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 pr-10 font-mono" />
        <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-2.5 text-slate-400">
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  )
}

export default function DeliveryTab({ company }) {
  const [creds, setCreds] = useState(company.delivery_credentials)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const openAdd = () => { setForm(emptyForm); setEditing(null); setOpen(true) }
  const openEdit = (c) => { setForm({ ...c, scope: c.scope || 'company' }); setEditing(c.id); setOpen(true) }

  const handleSave = () => {
    if (editing) {
      setCreds(prev => prev.map(c => c.id === editing ? { ...form, id: editing } : c))
    } else {
      setCreds(prev => [...prev, { ...form, id: Date.now() }])
    }
    setOpen(false)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-xs text-slate-500">ข้อมูลบันทึกใน <code>telepharmacy_db.delivery_provider_credentials</code></p>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-3 py-2 bg-sky-500 text-white text-xs font-medium rounded-lg hover:bg-sky-600">
          <Plus size={14} /> เพิ่ม Provider
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="text-left px-4 py-3 font-medium text-slate-600">Provider</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">ระดับ</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Endpoint</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">สถานะ</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {creds.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400 text-sm">ยังไม่มี Provider — กด "เพิ่ม Provider" เพื่อเริ่มต้น</td></tr>
            )}
            {creds.map(c => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium">{c.provider_code}</td>
                <td className="px-4 py-3">
                  <Badge color={c.scope === 'company' ? 'gray' : 'blue'}>
                    {c.scope === 'company' ? 'บริษัท' : 'สาขาเฉพาะ'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs font-mono">{c.api_endpoint}</td>
                <td className="px-4 py-3">
                  <Badge color={c.is_active ? 'green' : 'red'}>{c.is_active ? 'เปิด' : 'ปิด'}</Badge>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => openEdit(c)} className="text-sky-600 hover:text-sky-800 text-xs font-medium">แก้ไข</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SlideOver
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'แก้ไข Delivery Credential' : 'เพิ่ม Delivery Credential'}
        footer={
          <>
            <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm border rounded-lg hover:bg-slate-50">ยกเลิก</button>
            <button onClick={handleSave} className="px-4 py-2 text-sm bg-sky-500 text-white rounded-lg hover:bg-sky-600">บันทึก</button>
          </>
        }
      >
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Provider <span className="text-red-500">*</span></label>
          <select value={form.provider_code} onChange={e => set('provider_code', e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
            <option value="">เลือก Provider</option>
            {deliveryProviders.filter(p => p.is_active).map(p => (
              <option key={p.code} value={p.code}>{p.name} ({p.code})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-2">ระดับ <span className="text-red-500">*</span></label>
          <div className="flex gap-3">
            {[{ v: 'company', l: 'บริษัท (ใช้ทุกสาขา)' }, { v: 'branch', l: 'สาขาเฉพาะ' }].map(o => (
              <label key={o.v} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="scope" value={o.v} checked={form.scope === o.v} onChange={e => set('scope', e.target.value)} />
                <span className="text-sm">{o.l}</span>
              </label>
            ))}
          </div>
        </div>

        <MaskedField label="API Key" value={form.api_key_enc} onChange={e => set('api_key_enc', e.target.value)} required fieldName="api_key_enc" />
        <MaskedField label="API Secret" value={form.api_secret_enc} onChange={e => set('api_secret_enc', e.target.value)} fieldName="api_secret_enc" />

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">API Endpoint <span className="text-red-500">*</span></label>
          <input type="url" value={form.api_endpoint} onChange={e => set('api_endpoint', e.target.value)}
            placeholder="https://api.provider.com/v1"
            className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono" />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Merchant ID</label>
          <input type="text" value={form.merchant_id} onChange={e => set('merchant_id', e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
        </div>

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
    </div>
  )
}
