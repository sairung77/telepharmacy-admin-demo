import { useState } from 'react'
import { ChevronDown, ChevronUp, Search, MoreVertical, Pencil, Trash2, Check, X } from 'lucide-react'

// Multiselect หมายเหตุ — ค้นหา/เพิ่ม/แก้ไข/ลบ master ได้ในตัว, เลือกได้สูงสุด maxSelect
// panel เป็น in-flow (ไม่ absolute) เพื่อไม่ให้ถูก overflow ของ container ตัด
export default function NotesMultiSelect({ value = [], options = [], onChange, onOptionsChange, maxSelect = 3, disabled }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [menuId, setMenuId] = useState(null)
  const [editId, setEditId] = useState(null)
  const [editText, setEditText] = useState('')

  const selected = options.filter(o => value.includes(o.id))
  const filtered = options.filter(o => o.text.toLowerCase().includes(query.trim().toLowerCase()))
  const canAdd = query.trim() && !options.some(o => o.text.toLowerCase() === query.trim().toLowerCase())
  const atMax = value.length >= maxSelect

  const toggle = (id) => {
    if (value.includes(id)) onChange(value.filter(v => v !== id))
    else if (!atMax) onChange([...value, id])
  }
  const addNote = () => {
    const note = { id: Date.now(), text: query.trim() }
    onOptionsChange && onOptionsChange([...options, note])
    if (!atMax) onChange([...value, note.id])
    setQuery('')
  }
  const startEdit = (o) => { setEditId(o.id); setEditText(o.text); setMenuId(null) }
  const saveEdit = () => {
    if (!editText.trim()) return
    onOptionsChange && onOptionsChange(options.map(o => o.id === editId ? { ...o, text: editText.trim() } : o))
    setEditId(null); setEditText('')
  }
  const deleteNote = (id) => {
    onOptionsChange && onOptionsChange(options.filter(o => o.id !== id))
    onChange(value.filter(v => v !== id))
    setMenuId(null)
  }

  return (
    <div className="relative">
      <button type="button" disabled={disabled} onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 border rounded-lg bg-white text-left ${disabled ? 'bg-slate-100' : 'hover:border-sky-400'}`}>
        <span className={`text-sm flex-1 truncate ${selected.length ? 'text-slate-800' : 'text-slate-400'}`}>
          {selected.length ? selected.map(s => s.text).join(', ') : 'ไม่ระบุ'}
        </span>
        {open ? <ChevronUp size={16} className="text-slate-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />}
      </button>

      {open && !disabled && (
        <div className="mt-1 w-full bg-white border rounded-lg shadow-md">
          <div className="p-2 border-b">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="ค้นหาหมายเหตุหรือเพิ่มหมายเหตุ"
                onKeyDown={e => { if (e.key === 'Enter' && canAdd) { e.preventDefault(); addNote() } }}
                className="w-full pl-8 pr-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto py-1">
            {canAdd && (
              <button type="button" onClick={addNote}
                className="w-full text-left px-3 py-2 text-sm text-sky-600 font-medium hover:bg-sky-50 flex items-center gap-2">
                <span className="text-base leading-none">+</span> เพิ่มหมายเหตุ “{query.trim()}”
              </button>
            )}
            {filtered.map(o => (
              <div key={o.id} className="px-3 py-1.5 hover:bg-slate-50">
                {editId === o.id ? (
                  <div className="flex items-center gap-1">
                    <input value={editText} onChange={e => setEditText(e.target.value)} autoFocus
                      onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditId(null) }}
                      className="flex-1 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-sky-500" />
                    <button type="button" onClick={saveEdit} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check size={14} /></button>
                    <button type="button" onClick={() => setEditId(null)} className="p-1 text-slate-400 hover:bg-slate-100 rounded"><X size={14} /></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <label className={`flex items-center gap-2 flex-1 ${(!value.includes(o.id) && atMax) ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
                      <input type="checkbox" checked={value.includes(o.id)} disabled={!value.includes(o.id) && atMax}
                        onChange={() => toggle(o.id)} className="accent-sky-600" />
                      <span className="text-sm text-slate-700">{o.text}</span>
                    </label>
                    {menuId === o.id ? (
                      <span className="flex items-center gap-1">
                        <button type="button" onClick={() => startEdit(o)} className="p-1 text-slate-500 hover:text-sky-600 hover:bg-slate-100 rounded" title="แก้ไขหมายเหตุ"><Pencil size={14} /></button>
                        <button type="button" onClick={() => deleteNote(o.id)} className="p-1 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded" title="ลบหมายเหตุ"><Trash2 size={14} /></button>
                        <button type="button" onClick={() => setMenuId(null)} className="p-1 text-slate-400 hover:bg-slate-100 rounded"><X size={14} /></button>
                      </span>
                    ) : (
                      <button type="button" onClick={() => setMenuId(o.id)} className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"><MoreVertical size={14} /></button>
                    )}
                  </div>
                )}
              </div>
            ))}
            {filtered.length === 0 && !canAdd && <div className="px-3 py-4 text-center text-xs text-slate-400">ไม่พบหมายเหตุ</div>}
          </div>

          <div className="px-3 py-1.5 border-t text-xs text-slate-400 flex items-center justify-between">
            <span>เลือกได้สูงสุด {maxSelect} หมายเหตุ</span>
            <button type="button" onClick={() => setOpen(false)} className="text-sky-600 font-medium">เสร็จ</button>
          </div>
        </div>
      )}
    </div>
  )
}
