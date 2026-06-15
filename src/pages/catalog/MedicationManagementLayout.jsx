import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { initialMeds, NOTE_OPTIONS } from '../../data/medicationManagement'

export default function MedicationManagementLayout() {
  const [meds, setMeds] = useState(initialMeds)
  const [noteOptions, setNoteOptions] = useState(NOTE_OPTIONS)

  const getMed = (id) => meds.find(m => String(m.id) === String(id))

  const saveMed = (form, id) => {
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
    if (id) setMeds(prev => prev.map(m => String(m.id) === String(id) ? { ...m, ...form, updated_at: now } : m))
    else setMeds(prev => [...prev, { ...form, id: Date.now(), updated_at: now }])
  }

  const deleteMed = (id) => setMeds(prev => prev.filter(m => String(m.id) !== String(id)))

  return <Outlet context={{ meds, getMed, saveMed, deleteMed, noteOptions, setNoteOptions }} />
}
