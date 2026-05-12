import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { companies } from '../../data/mockData'
import Breadcrumb from '../../components/Breadcrumb'
import Badge from '../../components/Badge'
import GeneralTab from './tabs/GeneralTab'
import LineLiffTab from './tabs/LineLiffTab'
import DeliveryTab from './tabs/DeliveryTab'
import BranchesTab from './tabs/BranchesTab'

const modeLabel = { off: 'ปิด', pos: 'POS Mode', ep: 'EP Mode' }
const modeColor = { off: 'red', pos: 'blue', ep: 'yellow' }

const TABS = ['ทั่วไป', 'LINE LIFF', 'Delivery Providers', 'สาขาทั้งหมด']

export default function CompanyDetail() {
  const { companyId } = useParams()
  const [activeTab, setActiveTab] = useState('ทั่วไป')

  const company = companies.find(c => c.id === Number(companyId))
  if (!company) return <div className="p-8 text-slate-500">ไม่พบร้านขายยา</div>

  return (
    <div className="p-8">
      <Breadcrumb items={[
        { label: 'ร้านขายยา', to: '/companies' },
        { label: company.name },
      ]} />

      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-bold text-slate-800">{company.name}</h2>
        <Badge color={modeColor[company.telepharmacy_mode]}>{modeLabel[company.telepharmacy_mode]}</Badge>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 mb-6">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'ทั่วไป' && <GeneralTab company={company} />}
      {activeTab === 'LINE LIFF' && <LineLiffTab company={company} />}
      {activeTab === 'Delivery Providers' && <DeliveryTab company={company} />}
      {activeTab === 'สาขาทั้งหมด' && <BranchesTab company={company} />}
    </div>
  )
}
