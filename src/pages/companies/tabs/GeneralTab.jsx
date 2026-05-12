import { useState } from 'react'
import { provinces, cities, districts } from '../../../data/mockData'

const modeOptions = [
  { value: 'off', label: 'ปิด',      color: 'bg-red-100 text-red-700 border-red-300' },
  { value: 'pos', label: 'POS Mode', color: 'bg-sky-100 text-sky-700 border-sky-300' },
  { value: 'ep',  label: 'EP Mode',  color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
]

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500 mb-0.5">{label}</p>
      <p className="text-sm text-slate-800">{value || <span className="text-slate-300 italic">—</span>}</p>
    </div>
  )
}

export default function GeneralTab({ company }) {
  const [telepharmacyMode, setTelepharmacyMode] = useState(company.telepharmacy_mode)
  const [saved, setSaved] = useState(false)

  const provinceName = provinces.find(p => p.id === company.address.province_id)?.name || ''
  const cityName     = cities.find(c => c.id === company.address.city_id)?.name || ''
  const districtName = districts.find(d => d.id === company.address.district_id)?.name || ''

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
            <InfoRow label="ชื่อร้านขายยา" value={company.name} />
          </div>
          <InfoRow label="เลขประจำตัวผู้เสียภาษี" value={company.tax_id} />
          <InfoRow label="เลขทะเบียน อย." value={company.license_number} />
        </div>
      </section>

      {/* Telepharmacy Mode */}
      <section className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Telepharmacy Mode</h3>
        <div className="flex gap-2">
          {modeOptions.map(opt => (
            <button key={opt.value} onClick={() => setTelepharmacyMode(opt.value)}
              className={`px-4 py-2 text-sm rounded-lg border-2 font-medium transition-all ${
                telepharmacyMode === opt.value ? opt.color : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
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
          <InfoRow label="ที่อยู่บรรทัด 1" value={company.address.address1} />
          <InfoRow label="ที่อยู่บรรทัด 2" value={company.address.address2} />
          <div className="grid grid-cols-3 gap-3">
            <InfoRow label="จังหวัด"    value={provinceName} />
            <InfoRow label="เขต/อำเภอ"  value={cityName} />
            <InfoRow label="ตำบล/แขวง"  value={districtName} />
          </div>
          <div className="w-32">
            <InfoRow label="รหัสไปรษณีย์" value={company.address.zipcode} />
          </div>
        </div>
      </section>
    </div>
  )
}
