import { useState } from 'react'
import { provinces, cities, districts } from '../../../data/mockData'

const modeOptions = [
  { value: 'off', label: 'ปิด',      color: 'bg-red-100 text-red-700 border-red-300' },
  { value: 'pos', label: 'POS Mode', color: 'bg-sky-100 text-sky-700 border-sky-300' },
  { value: 'ep',  label: 'EP Mode',  color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
]

export default function GeneralTab({ company }) {
  const [form, setForm] = useState({
    name:               company.name,
    tax_id:             company.tax_id,
    license_number:     company.license_number,
    telepharmacy_mode:  company.telepharmacy_mode,
    address1:           company.address.address1,
    address2:           company.address.address2,
    province_id:        company.address.province_id,
    city_id:            company.address.city_id,
    district_id:        company.address.district_id,
    zipcode:            company.address.zipcode,
  })
  const [saved, setSaved] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const filteredCities    = cities.filter(c => c.province_id === Number(form.province_id))
  const filteredDistricts = districts.filter(d => d.city_id === Number(form.city_id))

  return (
    <div className="max-w-2xl space-y-6">
      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-2.5 rounded-lg">
          บันทึกข้อมูลสำเร็จ
        </div>
      )}

      {/* ข้อมูลบริษัท */}
      <section className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">ข้อมูลบริษัท</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">ชื่อร้านขายยา <span className="text-red-500">*</span></label>
            <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">เลขประจำตัวผู้เสียภาษี</label>
            <input type="text" value={form.tax_id} onChange={e => set('tax_id', e.target.value)}
              maxLength={13}
              className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">เลขทะเบียน อย. <span className="text-red-500">*</span></label>
            <input type="text" value={form.license_number} onChange={e => set('license_number', e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
        </div>
      </section>

      {/* Telepharmacy Mode */}
      <section className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Telepharmacy Mode</h3>
        <div className="flex gap-2">
          {modeOptions.map(opt => (
            <button key={opt.value} onClick={() => set('telepharmacy_mode', opt.value)}
              className={`px-4 py-2 text-sm rounded-lg border-2 font-medium transition-all ${
                form.telepharmacy_mode === opt.value ? opt.color : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
              }`}>
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* ที่อยู่ */}
      <section className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">ที่อยู่บริษัท</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">ที่อยู่บรรทัด 1 <span className="text-red-500">*</span></label>
            <input type="text" value={form.address1} onChange={e => set('address1', e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">ที่อยู่บรรทัด 2</label>
            <input type="text" value={form.address2} onChange={e => set('address2', e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">จังหวัด <span className="text-red-500">*</span></label>
              <select value={form.province_id}
                onChange={e => { set('province_id', Number(e.target.value)); set('city_id', ''); set('district_id', '') }}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                <option value="">เลือกจังหวัด</option>
                {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">เขต/อำเภอ <span className="text-red-500">*</span></label>
              <select value={form.city_id}
                onChange={e => { set('city_id', Number(e.target.value)); set('district_id', '') }}
                disabled={!form.province_id}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-slate-50 disabled:text-slate-400">
                <option value="">เลือกเขต/อำเภอ</option>
                {filteredCities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">ตำบล/แขวง <span className="text-red-500">*</span></label>
              <select value={form.district_id}
                onChange={e => set('district_id', Number(e.target.value))}
                disabled={!form.city_id}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-slate-50 disabled:text-slate-400">
                <option value="">เลือกตำบล/แขวง</option>
                {filteredDistricts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>
          <div className="w-32">
            <label className="block text-xs font-medium text-slate-600 mb-1">รหัสไปรษณีย์</label>
            <input type="text" value={form.zipcode} onChange={e => set('zipcode', e.target.value)}
              maxLength={5}
              className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
        </div>
      </section>

      <div className="flex gap-2">
        <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }}
          className="px-5 py-2 bg-sky-500 text-white text-sm font-medium rounded-lg hover:bg-sky-600">บันทึก</button>
        <button className="px-5 py-2 border text-sm font-medium rounded-lg hover:bg-slate-50 text-slate-600">ยกเลิก</button>
      </div>
    </div>
  )
}
