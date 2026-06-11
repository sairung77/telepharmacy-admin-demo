import { useState, useRef, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Search, ChevronDown, ChevronUp } from 'lucide-react'
import {
  medicationSets as initialSets,
  symptoms as initialSymptoms,
  medicationsForSet,
} from '../../data/mockData'
import SlideOver from '../../components/SlideOver'
import ConfirmModal from '../../components/ConfirmModal'

// ─── Tag Input Component (คล้าย VueMultiselect แบบ taggable) ──────────────────
function TagInput({ selectedTags, allTags, onChange, onCreateTag, placeholder }) {
  const [inputValue, setInputValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef(null)
  const containerRef = useRef(null)

  const filtered = allTags.filter(
    t => t.name.toLowerCase().includes(inputValue.toLowerCase()) &&
         !selectedTags.some(s => s.id === t.id)
  )
  const canCreate = inputValue.trim() &&
    !allTags.some(t => t.name.toLowerCase() === inputValue.trim().toLowerCase()) &&
    !selectedTags.some(t => t.name.toLowerCase() === inputValue.trim().toLowerCase())

  // ปิด dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const addTag = (tag) => {
    onChange([...selectedTags, tag])
    setInputValue('')
    inputRef.current?.focus()
  }

  const removeTag = (id) => {
    onChange(selectedTags.filter(t => t.id !== id))
  }

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && inputValue.trim()) {
      e.preventDefault()
      if (canCreate) {
        const newTag = onCreateTag(inputValue.trim())
        addTag(newTag)
      } else if (filtered.length > 0) {
        addTag(filtered[0])
      }
    }
    if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1].id)
    }
    if (e.key === 'Escape') setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <div
        className="min-h-[38px] px-2 py-1.5 border rounded-lg flex flex-wrap gap-1 cursor-text focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-sky-500 bg-white"
        onClick={() => { inputRef.current?.focus(); setIsOpen(true) }}
      >
        {selectedTags.map(tag => (
          <span key={tag.id} className="flex items-center gap-1 px-2 py-0.5 bg-sky-100 text-sky-700 text-xs rounded-full font-medium">
            {tag.name}
            <button type="button" onClick={(e) => { e.stopPropagation(); removeTag(tag.id) }} className="hover:text-sky-900">
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={inputValue}
          onChange={e => { setInputValue(e.target.value); setIsOpen(true) }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={selectedTags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] outline-none text-sm bg-transparent py-0.5"
        />
      </div>

      {/* Dropdown */}
      {isOpen && (filtered.length > 0 || canCreate) && (
        <div className="absolute z-20 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filtered.map(tag => (
            <button
              key={tag.id}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); addTag(tag) }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-sky-50 hover:text-sky-700"
            >
              {tag.name}
            </button>
          ))}
          {canCreate && (
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault()
                const newTag = onCreateTag(inputValue.trim())
                addTag(newTag)
              }}
              className="w-full text-left px-3 py-2 text-sm text-sky-600 font-medium hover:bg-sky-50 border-t"
            >
              + เพิ่มอาการ "{inputValue.trim()}"
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
const emptyForm = () => ({
  name: '',
  symptoms: [],
  default_follow_up_period: 3,
  order: 0,
  note: '',
  details: [],
})

const MAX_NOTE = 150

export default function MedicationSetList() {
  const [sets, setSets] = useState(initialSets)
  const [allSymptoms, setAllSymptoms] = useState(initialSymptoms)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyForm())
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [expandedId, setExpandedId] = useState(null)

  // medication search inside slide over
  const [medQuery, setMedQuery] = useState('')
  const [medResults, setMedResults] = useState([])
  const [searchOpen, setSearchOpen] = useState(false)
  const searchRef = useRef(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  // ─── Symptom tag creation ───────────────────────────────────────────────────
  const handleCreateSymptom = (name) => {
    const newTag = { id: Date.now(), name }
    setAllSymptoms(prev => [...prev, newTag])
    return newTag
  }

  // ─── Medication search ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!medQuery.trim()) { setMedResults([]); return }
    const q = medQuery.toLowerCase()
    setMedResults(
      medicationsForSet.filter(m =>
        m.name.toLowerCase().includes(q) || m.reference_code.includes(q)
      ).slice(0, 8)
    )
    setSearchOpen(true)
  }, [medQuery])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const addMedToForm = (med) => {
    if (form.details.some(d => d.product_id === med.id)) return
    set('details', [...form.details, {
      product_id: med.id,
      product_name: med.name,
      reference_code: med.reference_code,
      unit_id: med.units[0].id,
      unit_name: med.units[0].name,
      quantity: 1,
      price: med.units[0].price,
      units: med.units,
    }])
    setMedQuery('')
    setMedResults([])
    setSearchOpen(false)
  }

  const removeMed = (product_id) => {
    set('details', form.details.filter(d => d.product_id !== product_id))
  }

  const updateDetailUnit = (product_id, unit_id) => {
    set('details', form.details.map(d => {
      if (d.product_id !== product_id) return d
      const unit = d.units.find(u => u.id === unit_id) || d.units[0]
      return { ...d, unit_id: unit.id, unit_name: unit.name, price: unit.price }
    }))
  }

  const updateDetailQty = (product_id, qty) => {
    set('details', form.details.map(d =>
      d.product_id === product_id ? { ...d, quantity: Math.max(1, Number(qty)) } : d
    ))
  }

  // ─── CRUD ───────────────────────────────────────────────────────────────────
  const openAdd = () => { setForm(emptyForm()); setEditing(null); setOpen(true) }
  const openEdit = (s) => {
    setForm({
      name: s.name,
      symptoms: [...s.symptoms],
      default_follow_up_period: s.default_follow_up_period,
      order: s.order,
      note: s.note,
      details: s.details.map(d => ({ ...d, units: d.units || [] })),
    })
    setEditing(s.id)
    setOpen(true)
  }

  const handleSave = () => {
    if (!form.name.trim()) return
    if (editing) {
      setSets(prev => prev.map(s => s.id === editing ? { ...s, ...form } : s))
    } else {
      setSets(prev => [...prev, { ...form, id: Date.now() }])
    }
    setOpen(false)
  }

  const handleDelete = () => {
    setSets(prev => prev.filter(s => s.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  const totalPrice = (details) =>
    details.reduce((sum, d) => sum + (d.price || 0) * d.quantity, 0)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">จัดการชุดยา</h2>
          <p className="text-sm text-slate-500 mt-0.5">กำหนด template ชุดยาสำหรับ EP Mode</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white text-sm font-medium rounded-lg hover:bg-sky-600"
        >
          <Plus size={16} /> เพิ่มชุดยา
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="text-left px-4 py-3 font-medium text-slate-600">ชื่อชุดยา</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">อาการ</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600 w-20">รายการยา</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600 w-28">ติดตามอาการ</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600 w-16">ลำดับ</th>
              <th className="px-4 py-3 w-24"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sets.map(s => (
              <>
                <tr key={s.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    <div className="flex items-center gap-2">
                      {expandedId === s.id ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                      {s.name}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {s.symptoms.map(t => (
                        <span key={t.id} className="px-2 py-0.5 bg-sky-100 text-sky-700 text-xs rounded-full">{t.name}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-slate-600">{s.details.length} รายการ</td>
                  <td className="px-4 py-3 text-center text-slate-600">{s.default_follow_up_period} วัน</td>
                  <td className="px-4 py-3 text-center text-slate-500">{s.order || '-'}</td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => openEdit(s)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-sky-600">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleteTarget(s)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Expanded row — รายการยาในชุด */}
                {expandedId === s.id && (
                  <tr key={`${s.id}-expanded`}>
                    <td colSpan={6} className="px-4 pb-4 bg-slate-50">
                      <div className="rounded-lg border border-slate-200 overflow-hidden">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-slate-100 border-b">
                              <th className="text-left px-3 py-2 text-slate-500">รหัส</th>
                              <th className="text-left px-3 py-2 text-slate-500">ชื่อยา</th>
                              <th className="text-center px-3 py-2 text-slate-500">จำนวน</th>
                              <th className="text-center px-3 py-2 text-slate-500">หน่วย</th>
                              <th className="text-right px-3 py-2 text-slate-500">ราคา/ชุด</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {s.details.map((d, i) => (
                              <tr key={i}>
                                <td className="px-3 py-2 text-slate-500 font-mono">{d.reference_code}</td>
                                <td className="px-3 py-2 text-slate-800">{d.product_name}</td>
                                <td className="px-3 py-2 text-center">{d.quantity}</td>
                                <td className="px-3 py-2 text-center text-slate-500">{d.unit_name}</td>
                                <td className="px-3 py-2 text-right text-slate-700 font-medium">{(d.price * d.quantity).toLocaleString()} บาท</td>
                              </tr>
                            ))}
                            <tr className="bg-slate-50 border-t">
                              <td colSpan={4} className="px-3 py-2 text-right text-slate-500 font-medium">ราคารวมทั้งชุด</td>
                              <td className="px-3 py-2 text-right font-bold text-sky-700">{totalPrice(s.details).toLocaleString()} บาท</td>
                            </tr>
                          </tbody>
                        </table>
                        {s.note && <p className="px-3 py-2 text-xs text-slate-500 border-t bg-white">📝 {s.note}</p>}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
        {sets.length === 0 && (
          <div className="py-16 text-center text-slate-400 text-sm">ยังไม่มีชุดยา — กด "+ เพิ่มชุดยา" เพื่อเริ่มต้น</div>
        )}
      </div>

      {/* ─── SlideOver Form ─── */}
      <SlideOver
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'แก้ไขชุดยา' : 'เพิ่มชุดยา'}
        footer={
          <>
            <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm border rounded-lg hover:bg-slate-50">ยกเลิก</button>
            <button
              onClick={handleSave}
              disabled={!form.name.trim() || form.details.length === 0}
              className="px-4 py-2 text-sm bg-sky-500 text-white rounded-lg hover:bg-sky-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              บันทึก
            </button>
          </>
        }
      >
        {/* ชื่อชุดยา */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            ชื่อชุดยา <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="เช่น ชุดยาไข้หวัด (Common Cold)"
            maxLength={100}
            className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* อาการ — tag input */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            อาการ <span className="text-red-500">*</span>
            <span className="ml-1 text-slate-400 font-normal">(พิมพ์แล้วกด Enter เพื่อเพิ่มอาการใหม่)</span>
          </label>
          <TagInput
            selectedTags={form.symptoms}
            allTags={allSymptoms}
            onChange={v => set('symptoms', v)}
            onCreateTag={handleCreateSymptom}
            placeholder="เลือกหรือพิมพ์อาการ..."
          />
        </div>

        {/* ระยะวันติดตามอาการ */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">ระยะวันติดตามอาการ</label>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => set('default_follow_up_period', Math.max(1, form.default_follow_up_period - 1))}
              className="w-8 h-8 rounded-lg border text-lg font-bold text-sky-600 hover:bg-sky-50 flex items-center justify-center">−</button>
            <input
              type="number" min="1"
              value={form.default_follow_up_period}
              onChange={e => set('default_follow_up_period', Math.max(1, Number(e.target.value)))}
              className="w-20 px-3 py-1.5 text-sm border rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button type="button" onClick={() => set('default_follow_up_period', form.default_follow_up_period + 1)}
              className="w-8 h-8 rounded-lg border text-lg font-bold text-sky-600 hover:bg-sky-50 flex items-center justify-center">+</button>
            <span className="text-sm text-slate-500">วัน</span>
          </div>
        </div>

        {/* การเรียงลำดับ */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            การเรียงลำดับ <span className="text-slate-400 font-normal">(0 = ไม่จัดลำดับ)</span>
          </label>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => set('order', Math.max(0, form.order - 1))}
              className="w-8 h-8 rounded-lg border text-lg font-bold text-sky-600 hover:bg-sky-50 flex items-center justify-center">−</button>
            <input
              type="number" min="0"
              value={form.order}
              onChange={e => set('order', Math.max(0, Number(e.target.value)))}
              className="w-20 px-3 py-1.5 text-sm border rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button type="button" onClick={() => set('order', form.order + 1)}
              className="w-8 h-8 rounded-lg border text-lg font-bold text-sky-600 hover:bg-sky-50 flex items-center justify-center">+</button>
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Note</label>
          <textarea
            value={form.note}
            onChange={e => set('note', e.target.value)}
            maxLength={MAX_NOTE}
            rows={2}
            placeholder="หมายเหตุเพิ่มเติม (ไม่บังคับ)"
            className="w-full px-3 py-2 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <p className="text-right text-xs text-slate-400">{form.note.length}/{MAX_NOTE}</p>
        </div>

        {/* ─── เลือกยา ─── */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            เลือกยา <span className="text-red-500">*</span>
          </label>
          <div ref={searchRef} className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={medQuery}
                  onChange={e => setMedQuery(e.target.value)}
                  onFocus={() => medResults.length > 0 && setSearchOpen(true)}
                  placeholder="ค้นหาจากชื่อยา / รหัส"
                  className="w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
            {searchOpen && medResults.length > 0 && (
              <div className="absolute z-20 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {medResults.map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); addMedToForm(m) }}
                    disabled={form.details.some(d => d.product_id === m.id)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-sky-50 disabled:opacity-40 disabled:cursor-not-allowed flex justify-between items-center"
                  >
                    <div>
                      <span className="font-medium text-slate-800">{m.name}</span>
                      <span className="text-xs text-slate-400 ml-2">{m.reference_code}</span>
                    </div>
                    <span className="text-xs text-slate-500">{m.units[0].price} บาท/{m.units[0].name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* รายการยาในชุด */}
          {form.details.length > 0 && (
            <div className="mt-3 space-y-2">
              {form.details.map(d => (
                <div key={d.product_id} className="flex items-center gap-2 p-2 bg-slate-50 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-400">{d.reference_code}</div>
                    <div className="text-sm font-medium text-slate-800 truncate">{d.product_name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <select
                        value={d.unit_id}
                        onChange={e => updateDetailUnit(d.product_id, e.target.value)}
                        className="text-xs border rounded px-1.5 py-0.5 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                      >
                        {d.units.map(u => (
                          <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                      </select>
                      <span className="text-xs text-slate-400">✖</span>
                      <input
                        type="number" min="1"
                        value={d.quantity}
                        onChange={e => updateDetailQty(d.product_id, e.target.value)}
                        className="w-14 text-xs border rounded px-1.5 py-0.5 text-center focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-medium text-slate-700">{(d.price * d.quantity).toLocaleString()} บาท</div>
                    <button type="button" onClick={() => removeMed(d.product_id)} className="mt-1 text-red-400 hover:text-red-600">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex justify-end pt-1 border-t">
                <span className="text-xs text-slate-500">รวม:</span>
                <span className="text-xs font-bold text-sky-700 ml-1">{totalPrice(form.details).toLocaleString()} บาท</span>
              </div>
            </div>
          )}
          {form.details.length === 0 && (
            <p className="mt-2 text-xs text-slate-400 text-center py-3 border border-dashed rounded-lg">ยังไม่มีรายการยา — ค้นหาและเพิ่มยาด้านบน</p>
          )}
        </div>
      </SlideOver>

      {/* Delete confirm */}
      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`ลบชุดยา "${deleteTarget?.name}"`}
        message="ชุดยานี้จะถูกลบออกจากระบบและไม่สามารถกู้คืนได้"
      />
    </div>
  )
}
