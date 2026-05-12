import { useState } from 'react'
import { Eye, EyeOff, Copy, Check } from 'lucide-react'

function MaskedInput({ value, onChange, label, fieldName, multiline = false }) {
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

function ReadonlyWithCopy({ label, value, fieldName }) {
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

export default function LineLiffTab({ company }) {
  const [form, setForm] = useState({ ...company.line_credential })
  const [saved, setSaved] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const liff_url = `https://liff.line.me/${form.liff_id}`
  const webhook_url = `https://api.telepharmacy.th/webhook/${company.id}`

  return (
    <div className="max-w-xl space-y-6">
     

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
          onChange={e => set('line_channel_secret', e.target.value)} fieldName="line_channel_secret" />
        <MaskedInput label="Channel Access Token" value={form.line_channel_access_token}
          onChange={e => set('line_channel_access_token', e.target.value)}
          fieldName="line_channel_access_token" multiline />
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
        <ReadonlyWithCopy label="LIFF URL (auto-generated)" value={liff_url} fieldName="computed: https://liff.line.me/{liff_id}" />
      </section>

      {/* Webhook */}
      <section className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Webhook</h3>
        <ReadonlyWithCopy label="Webhook URL (system-generated — copy ไปตั้งใน LINE Console)" value={webhook_url}
          fieldName="computed: /webhook/{company_id}" />
      </section>

      <div className="flex gap-2">
        <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }}
          className="px-5 py-2 bg-sky-500 text-white text-sm font-medium rounded-lg hover:bg-sky-600">บันทึก</button>
        <button className="px-5 py-2 border text-sm font-medium rounded-lg hover:bg-slate-50 text-slate-600">ยกเลิก</button>
      </div>
    </div>
  )
}
