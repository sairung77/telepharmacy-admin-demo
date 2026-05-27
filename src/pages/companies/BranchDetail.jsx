import { useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Upload, X, Network } from 'lucide-react'
import { companies, branches, employees, provinces, cities, districts } from '../../data/mockData'
import Breadcrumb from '../../components/Breadcrumb'
import Badge from '../../components/Badge'
import LineLiffTab from './tabs/LineLiffTab'
import DeliveryTab from './tabs/DeliveryTab'

const TABS = ['ข้อมูลสาขา', 'LINE LIFF', 'ผู้จัดส่ง (Delivery)', 'พนักงาน']

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
      <p className="text-sm text-slate-800">{value || <span className="text-slate-400">-</span>}</p>
    </div>
  )
}

function NetworkPharmacyToggle({ value, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <Network size={16} className={value ? 'text-indigo-500' : 'text-slate-400'} />
        <div>
          <p className="text-sm font-medium text-slate-700">ร้านยาเครือข่าย (Network Pharmacy)</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {value
              ? 'สาขานี้ถูกลงทะเบียนเป็นร้านยาเครือข่าย — ผู้ป่วย EP Mode สามารถรับยาที่สาขานี้ได้'
              : 'สาขานี้ยังไม่ได้ลงทะเบียนเป็นร้านยาเครือข่าย'}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
          value ? 'bg-indigo-600' : 'bg-slate-200'
        }`}
        role="switch"
        aria-checked={value}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            value ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}

function BranchInfoTab({ branch }) {
  const province = provinces.find(p => p.id === branch.address.province_id)
  const city     = cities.find(c => c.id === branch.address.city_id)
  const district = districts.find(d => d.id === branch.address.district_id)

  const [isNetwork, setIsNetwork] = useState(branch.is_network_pharmacy ?? false)
  const [saved, setSaved] = useState(false)

  const handleToggle = (newValue) => {
    setIsNetwork(newValue)
    // mock save — production จะ call PATCH /api/v1/branches/{id} { is_network_pharmacy }
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="max-w-2xl space-y-5">

      {/* Network Pharmacy Setting Card */}
      <section className="bg-white rounded-xl p-5 border border-indigo-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-700">การตั้งค่าร้านยาเครือข่าย</h3>
            {isNetwork && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                <Network size={10} />
                เครือข่าย
              </span>
            )}
          </div>
          {saved && (
            <span className="text-xs text-green-600 font-medium animate-pulse">✓ บันทึกการเปลี่ยนแปลงแล้ว</span>
          )}
        </div>
        <NetworkPharmacyToggle value={isNetwork} onChange={handleToggle} />
      </section>

      <section className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">ข้อมูลทั่วไป</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Field label="ชื่อสาขา" value={branch.name} /></div>
          <Field label="รหัสสาขา" value={branch.reference_code} />
          <Field label="เบอร์โทรสาขา" value={branch.phone_no} />
        </div>
      </section>

      <section className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">ที่อยู่สาขา</h3>
        <div className="space-y-3">
          <Field label="ที่อยู่บรรทัด 1" value={branch.address.address1} />
          {branch.address.address2 && <Field label="ที่อยู่บรรทัด 2" value={branch.address.address2} />}
          <div className="grid grid-cols-3 gap-4">
            <Field label="จังหวัด"     value={province?.name} />
            <Field label="เขต/อำเภอ"  value={city?.name} />
            <Field label="ตำบล/แขวง"  value={district?.name} />
          </div>
          <Field label="รหัสไปรษณีย์" value={branch.address.zipcode} />
        </div>
      </section>

      <section className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">พิกัด GPS</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Latitude" value={branch.latitude} />
          <Field label="Longitude" value={branch.longitude} />
        </div>
      </section>
    </div>
  )
}

function AvatarUpload({ value, onChange }) {
  const inputRef = useRef(null)

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onChange(ev.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-20 h-20 rounded-full border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden cursor-pointer hover:border-sky-400 transition-colors"
        onClick={() => inputRef.current?.click()}
      >
        {value
          ? <img src={value} alt="avatar" className="w-full h-full object-cover" />
          : <Upload size={20} className="text-slate-300" />
        }
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="px-2.5 py-1 text-xs border rounded-lg hover:bg-slate-50 text-slate-600"
        >
          อัปโหลด
        </button>
        {value && (
          <button
            type="button"
            onClick={() => { onChange(''); if (inputRef.current) inputRef.current.value = '' }}
            className="px-2.5 py-1 text-xs border border-red-200 rounded-lg hover:bg-red-50 text-red-500"
          >
            <X size={11} />
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  )
}

function EmployeesTab({ branch }) {
  const [emps] = useState(employees.filter(e => e.branch_id === branch.id))
  const [avatars, setAvatars] = useState(
    Object.fromEntries(emps.map(e => [e.id, e.avatar || '']))
  )

  return (
    <div className="max-w-3xl">
      <p className="text-sm text-slate-500 mb-4">พนักงานประจำสาขา <span className="font-medium text-slate-700">{branch.name}</span></p>

      <div className="space-y-3">
        {emps.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-100 p-8 text-center text-slate-400 text-sm">
            ยังไม่มีพนักงาน
          </div>
        )}
        {emps.map(e => (
          <div key={e.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-center gap-5">
            <AvatarUpload
              value={avatars[e.id]}
              onChange={v => setAvatars(prev => ({ ...prev, [e.id]: v }))}
            />
            <div className="flex-1 grid grid-cols-3 gap-x-6 gap-y-3">
              <div className="col-span-3 flex items-center gap-2">
                <span className="text-base font-semibold text-slate-800">{e.first_name} {e.last_name}</span>
                <Badge color={e.is_pharmacist ? 'blue' : 'gray'}>
                  {e.is_pharmacist ? 'เภสัชกร' : 'พนักงานทั่วไป'}
                </Badge>
                <Badge color={e.enabled ? 'green' : 'red'}>{e.enabled ? 'ใช้งาน' : 'ปิด'}</Badge>
              </div>
              <div>
                <p className="text-xs text-slate-500">เลขใบประกอบฯ</p>
                <p className="text-sm text-slate-700 font-mono">{e.license_number || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">อีเมล</p>
                <p className="text-sm text-slate-700">{e.email || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">เบอร์โทร</p>
                <p className="text-sm text-slate-700">{e.phone_number || '-'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function BranchDetail() {
  const { companyId, branchId } = useParams()
  const [activeTab, setActiveTab] = useState('ข้อมูลสาขา')

  const company = companies.find(c => c.id === Number(companyId))
  const branch  = branches.find(b => b.id === Number(branchId))
  if (!company || !branch) return <div className="p-8 text-slate-500">ไม่พบข้อมูล</div>

  return (
    <div className="p-8">
      <Breadcrumb items={[
        { label: 'ร้านขายยา', to: '/companies' },
        { label: company.name, to: `/companies/${company.id}` },
        { label: branch.name },
      ]} />

      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-bold text-slate-800">{branch.name}</h2>
        {branch.is_network_pharmacy && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Network size={12} />
            ร้านยาเครือข่าย
          </span>
        )}
      </div>

      <div className="flex gap-1 border-b border-slate-200 mb-6">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'ข้อมูลสาขา' && <BranchInfoTab branch={branch} />}
      {activeTab === 'LINE LIFF' && <LineLiffTab company={company} branch={branch} />}
      {activeTab === 'ผู้จัดส่ง (Delivery)' && <DeliveryTab company={company} branch={branch} />}
      {activeTab === 'พนักงาน' && <EmployeesTab branch={branch} />}
    </div>
  )
}
