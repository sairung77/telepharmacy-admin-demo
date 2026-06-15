import { useState } from 'react'
import { useNavigate, useParams, useOutletContext } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import {
  TYPE, WHEN_TO_USE, TIME, DOSAGE_LABEL, usageText, emptyForm,
} from '../../data/medicationManagement'
import NotesMultiSelect from '../../components/NotesMultiSelect'

export default function MedicationManagementForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getMed, saveMed, noteOptions, setNoteOptions } = useOutletContext()
  const existing = id ? getMed(id) : null

  const [form, setForm] = useState(
    existing ? { ...emptyForm(), ...existing, timing: [...(existing.timing || [])], notes: [...(existing.notes || [])] } : emptyForm()
  )
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const toggle = (k, val) => setForm(f => ({ ...f, [k]: f[k].includes(val) ? f[k].filter(x => x !== val) : [...f[k], val] }))

  const handleSave = () => {
    if (!form.arincare_product_name.trim()) return
    saveMed(form, existing ? existing.id : null)
    navigate('..')
  }

  const numField = (label, k, w = 'w-20') => (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      <input type="number" min="0" value={form[k]} onChange={e => set(k, Math.max(0, Number(e.target.value)))}
        className={`${w} px-2 py-2 text-sm border rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-sky-500`} />
    </div>
  )

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('..')} className="p-2 rounded-lg border hover:bg-slate-50 text-slate-600">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-800">{existing ? 'แก้ไขข้อมูลยา' : 'เพิ่มข้อมูลยา'}</h2>
          <p className="text-sm text-slate-500 mt-0.5">medication_management (EP Mode)</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Section: Product */}
        <section className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-700">ข้อมูลสินค้า</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">รหัสยา (reference_code)</label>
              <input type="text" value={form.arincare_product_reference_code} onChange={e => set('arincare_product_reference_code', e.target.value)}
                placeholder="PCO00308" className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">arincare_product_id</label>
              <input type="text" value={form.arincare_product_id} onChange={e => set('arincare_product_id', e.target.value)}
                placeholder="308" className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">ชื่อยา <span className="text-red-500">*</span></label>
              <input type="text" value={form.arincare_product_name} onChange={e => set('arincare_product_name', e.target.value)}
                placeholder="ARCOXIA 120MG.5'S." className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">ข้อบ่งใช้ (indication)</label>
            <input type="text" value={form.indication} onChange={e => set('indication', e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
        </section>

        {/* Section: Usage */}
        <section className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-700">รายละเอียดการใช้ยา</h3>

          <div className="flex items-end gap-4">
            <div className="w-56">
              <label className="block text-xs font-medium text-slate-600 mb-1">รูปแบบยา (type)</label>
              <select value={form.type} onChange={e => set('type', e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500">
                {Object.entries(TYPE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            {form.type === 'other' && (
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-600 mb-1">ระบุ (type_other)</label>
                <input type="text" value={form.type_other} onChange={e => set('type_other', e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
            )}
          </div>

          {/* dosage */}
          <div className="flex items-end gap-3">
            <span className="text-sm text-blue-600 font-medium pb-2">{DOSAGE_LABEL[form.type]}</span>
            {numField('ขนาด (จาก)', 'dosage_from')}
            {numField('ถึง', 'dosage_to')}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">หน่วย</label>
              <input type="text" value={form.dosage_unit} onChange={e => set('dosage_unit', e.target.value)}
                className="w-24 px-2 py-2 text-sm border rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
          </div>

          {/* frequency */}
          <div className="flex items-end gap-3">
            <span className="text-sm text-blue-600 font-medium pb-2">วันละ</span>
            {numField('ความถี่ (จาก)', 'frequency_from')}
            {numField('ถึง', 'frequency_to')}
            <span className="text-sm text-slate-500 pb-2">ครั้ง</span>
          </div>

          {/* timing */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">ช่วงเวลา (timing)</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(TIME).map(([k, v]) => (
                <button key={k} type="button" onClick={() => toggle('timing', k)}
                  className={`px-4 py-1.5 rounded-full border text-sm ${form.timing.includes(k) ? 'bg-teal-500 text-white border-teal-500' : 'bg-white text-slate-600 border-slate-300'}`}>{v}</button>
              ))}
            </div>
            {form.timing.includes('every') && (
              <div className="flex items-center gap-2 mt-3">
                <span className="text-sm text-slate-500">ทุกๆ</span>
                <input type="number" min="0" value={form.every} onChange={e => set('every', Math.max(0, Number(e.target.value)))}
                  className="w-20 px-2 py-1.5 text-sm border rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-sky-500" />
                <span className="text-sm text-slate-500">ชั่วโมง</span>
              </div>
            )}
          </div>

          {/* when_to_use */}
          <div className="w-72">
            <label className="block text-xs font-medium text-slate-600 mb-1">เวลาใช้ยา (when_to_use)</label>
            <select value={form.when_to_use} onChange={e => set('when_to_use', e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500">
              {Object.entries(WHEN_TO_USE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>

          {/* notes — multiselect (ค้นหา/เพิ่ม/แก้ไข/ลบ master ได้) */}
          <div className="max-w-xl">
            <label className="block text-xs font-medium text-slate-600 mb-1.5">คำแนะนำ / คำเตือน (notes)</label>
            <NotesMultiSelect
              value={form.notes}
              options={noteOptions}
              onChange={(ids) => set('notes', ids)}
              onOptionsChange={setNoteOptions}
              maxSelect={3}
            />
          </div>

          {/* summary */}
          <div className="bg-slate-50 rounded-lg p-4 border">
            <div className="text-xs text-slate-400 mb-0.5">สรุปวิธีใช้ (how_to_use)</div>
            <div className="text-sm font-medium text-slate-700">{usageText(form)}</div>
          </div>
        </section>

        {/* Footer actions */}
        <div className="flex justify-end gap-3">
          <button onClick={() => navigate('..')} className="px-5 py-2.5 text-sm border rounded-lg hover:bg-slate-50">ยกเลิก</button>
          <button onClick={handleSave} disabled={!form.arincare_product_name.trim()}
            className="flex items-center gap-2 px-5 py-2.5 text-sm bg-sky-500 text-white rounded-lg hover:bg-sky-600 disabled:bg-slate-300 disabled:cursor-not-allowed">
            <Save size={16} /> บันทึก
          </button>
        </div>
      </div>
    </div>
  )
}
