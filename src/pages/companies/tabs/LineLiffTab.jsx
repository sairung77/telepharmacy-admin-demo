import { useState } from 'react'
import { Eye, EyeOff, Copy, Check, Building2, GitBranch } from 'lucide-react'
import { branches, companies } from '../../../data/mockData'

function MaskedInput({ value, onChange, label, multiline = false }) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label} <span className="text-red-500">*</span></label>
      <div className="relative">
        {multiline ? (
          <textarea
            value={show ? value : '••••••••••••••••••••••••'}
            onChange={onChange}
            rows={3}
            className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 pr-10 font-mono resize-none"
          />
        ) : (
          <input
            type={show ? 'text' : 'password'}
            value={value}
            onChange={onChange}
            className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 pr-10 font-mono"
          />
        )}
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  )
}

function ReadonlyWithCopy({ label, value }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      <div className="flex gap-2">
        <input type="text" value={value} readOnly
          className="flex-1 px-3 py-2 text-sm border rounded-lg bg-slate-50 text-slate-500 font-mono" />
        <button onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-2 text-xs border rounded-lg hover:bg-slate-50 text-slate-600">
          {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  )
}

// ── Company-level LINE Credential (EP Mode) ──────────────────────
function CompanyLineLiffTab({ company }) {
  const [form, setForm] = useState({
    line_channel_id: company?.line_credential?.line_channel_id || '',
    line_channel_secret: company?.line_credential?.line_channel_secret || '',
    line_channel_access_token: company?.line_credential?.line_channel_access_token || '',
    liff_id: company?.line_credential?.liff_id || '',
  })
  const [saved, setSaved] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const liff_url = form.liff_id ? `https://liff.line.me/${form.liff_id}` : ''
  // EP Mode: webhook ระดับ company ไม่ใช่สาขา
  const webhook_url = `https://api.telepharmacy.th/webhook/companies/${company?.id}`

  const handleSave = () => {
    const target = companies.find(c => c.id === company?.id)
    if (target) target.line_credential = { ...form }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }
  const handleCancel = () => setForm({
    line_channel_id: company?.line_credential?.line_channel_id || '',
    line_channel_secret: company?.line_credential?.line_channel_secret || '',
    line_channel_access_token: company?.line_credential?.line_channel_access_token || '',
    liff_id: company?.line_credential?.liff_id || '',
  })

  return (
    <div className="max-w-xl space-y-6">
      {/* EP Mode Info Banner */}
      <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
        <Building2 size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="font-semibold text-yellow-800">EP Mode — LINE Credential ระดับบริษัท</p>
          <p className="text-yellow-700 mt-0.5 text-xs leading-relaxed">
            ร้านยานี้ใช้โหมด EP (Electronic Prescription) ซึ่งใช้ LINE Channel เดียวร่วมกันทุกสาขา
            การตั้งค่านี้จะมีผลกับทุกสาขาภายใต้บริษัทนี้
          </p>
        </div>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-2.5 rounded-lg">
          บันทึกข้อมูลสำเร็จ
        </div>
      )}

      {/* LINE Official Account */}
      <section className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-slate-700">LINE Official Account</h3>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Channel ID <span className="text-red-500">*</span></label>
          <input type="text" value={form.line_channel_id} onChange={e => set('line_channel_id', e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono" />
        </div>
        <MaskedInput label="Channel Secret" value={form.line_channel_secret}
          onChange={e => set('line_channel_secret', e.target.value)} />
        <MaskedInput label="Channel Access Token" value={form.line_channel_access_token}
          onChange={e => set('line_channel_access_token', e.target.value)}
          multiline />
      </section>

      {/* LIFF */}
      <section className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-slate-700">LIFF Application</h3>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">LIFF ID <span className="text-red-500">*</span></label>
          <input type="text" value={form.liff_id} onChange={e => set('liff_id', e.target.value)}
            placeholder="{channelId}-{suffix}"
            className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono" />
        </div>
        <ReadonlyWithCopy label="LIFF URL (auto-generated)" value={liff_url} />
      </section>

      {/* Webhook — company level */}
      <section className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-1">Webhook</h3>
        <p className="text-xs text-slate-500 mb-3">
          EP Mode ใช้ Webhook ระดับบริษัท — ระบบจะ route ไปสาขาที่ถูกต้องโดยอัตโนมัติ
        </p>
        <ReadonlyWithCopy label="Webhook URL (copy ไปตั้งใน LINE Console)" value={webhook_url} />
      </section>

      <div className="flex gap-2">
        <button onClick={handleSave}
          className="px-5 py-2 bg-sky-500 text-white text-sm font-medium rounded-lg hover:bg-sky-600">บันทึก</button>
        <button onClick={handleCancel} className="px-5 py-2 border text-sm font-medium rounded-lg hover:bg-slate-50 text-slate-600">ยกเลิก</button>
      </div>
    </div>
  )
}

// ── Branch-level LINE Credential (POS Mode) ──────────────────────
function BranchLineLiffTab({ branch }) {
  const [form, setForm] = useState({
    line_channel_id: branch?.line_credential?.line_channel_id || '',
    line_channel_secret: branch?.line_credential?.line_channel_secret || '',
    line_channel_access_token: branch?.line_credential?.line_channel_access_token || '',
    liff_id: branch?.line_credential?.liff_id || '',
  })
  const [saved, setSaved] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const liff_url = form.liff_id ? `https://liff.line.me/${form.liff_id}` : ''
  const webhook_url = `https://api.telepharmacy.th/webhook/branches/${branch?.id}`

  const handleSave = () => {
    const target = branches.find(b => b.id === branch?.id)
    if (target) target.line_credential = { ...form }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }
  const handleCancel = () => setForm({
    line_channel_id: branch?.line_credential?.line_channel_id || '',
    line_channel_secret: branch?.line_credential?.line_channel_secret || '',
    line_channel_access_token: branch?.line_credential?.line_channel_access_token || '',
    liff_id: branch?.line_credential?.liff_id || '',
  })

  return (
    <div className="max-w-xl space-y-6">
      {/* Branch-level LINE Info Banner */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
        <GitBranch size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="font-semibold text-blue-800">LINE Credential ระดับสาขา</p>
          <p className="text-blue-700 mt-0.5 text-xs leading-relaxed">
            แต่ละสาขามี LINE Channel แยกกัน — การตั้งค่านี้มีผลเฉพาะสาขา <strong>{branch?.name}</strong> เท่านั้น
          </p>
        </div>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-2.5 rounded-lg">
          บันทึกข้อมูลสำเร็จ
        </div>
      )}

      {/* LINE Official Account */}
      <section className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-slate-700">LINE Official Account</h3>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Channel ID <span className="text-red-500">*</span></label>
          <input type="text" value={form.line_channel_id} onChange={e => set('line_channel_id', e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono" />
        </div>
        <MaskedInput label="Channel Secret" value={form.line_channel_secret}
          onChange={e => set('line_channel_secret', e.target.value)} />
        <MaskedInput label="Channel Access Token" value={form.line_channel_access_token}
          onChange={e => set('line_channel_access_token', e.target.value)}
          multiline />
      </section>

      {/* LIFF */}
      <section className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-slate-700">LIFF Application</h3>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">LIFF ID <span className="text-red-500">*</span></label>
          <input type="text" value={form.liff_id} onChange={e => set('liff_id', e.target.value)}
            placeholder="{channelId}-{suffix}"
            className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono" />
        </div>
        <ReadonlyWithCopy label="LIFF URL (auto-generated)" value={liff_url} />
      </section>

      {/* Webhook */}
      <section className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Webhook</h3>
        <ReadonlyWithCopy label="Webhook URL (copy ไปตั้งใน LINE Console)" value={webhook_url} />
      </section>

      <div className="flex gap-2">
        <button onClick={handleSave}
          className="px-5 py-2 bg-sky-500 text-white text-sm font-medium rounded-lg hover:bg-sky-600">บันทึก</button>
        <button onClick={handleCancel} className="px-5 py-2 border text-sm font-medium rounded-lg hover:bg-slate-50 text-slate-600">ยกเลิก</button>
      </div>
    </div>
  )
}

// ── Export: auto-route ตาม scope ─────────────────────────────────
export default function LineLiffTab({ company, branch }) {
  // ถ้าส่ง company มา = company-level (EP Mode)
  // ถ้าส่ง branch มา = branch-level (POS Mode)
  if (company && !branch) return <CompanyLineLiffTab company={company} />
  return <BranchLineLiffTab branch={branch} />
}
