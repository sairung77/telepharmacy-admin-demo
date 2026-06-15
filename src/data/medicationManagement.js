// ─── Constants (อ้างอิง medcare_db / medcare-cms) ────────────────────────────────
export const TYPE = { oral: 'ยารับประทาน', cream: 'ยาทา', spray: 'ยาพ่น', patch: 'ยาป้าย', drop: 'ยาหยอด', other: 'อื่นๆ' }
export const WHEN_TO_USE = { none: 'ไม่ระบุ', before: 'ก่อนอาหาร', after: 'หลังอาหาร', during: 'พร้อมอาหาร', before30: 'ก่อนอาหาร 30 นาที', internal: 'ใช้ภายใน', external: 'ใช้ภายนอก' }
export const TIME = { morning: 'เช้า', afternoon: 'กลางวัน', evening: 'เย็น', bedtime: 'ก่อนนอน', every: 'ทุกๆ' }
export const DOSAGE_LABEL = { oral: 'รับประทานครั้งละ', cream: 'ทาครั้งละ', spray: 'พ่นครั้งละ', patch: 'ป้ายครั้งละ', drop: 'หยอดครั้งละ', other: 'ครั้งละ' }

// medcare_db.medication_management_notes
export const NOTE_OPTIONS = [
  { id: 8, text: 'ห้ามใช้ในผู้แพ้ยากลุ่มนี้' },
  { id: 9, text: 'ทานยาให้ครบตามที่แพทย์/เภสัชกรสั่ง' },
  { id: 10, text: 'อาจทำให้ง่วงซึม หลีกเลี่ยงการขับขี่' },
  { id: 11, text: 'ดื่มน้ำตามมากๆ' },
  { id: 12, text: 'หากมีอาการผิดปกติให้หยุดยาและปรึกษาเภสัชกร' },
]

// ─── Mock data (medcare_db.medication_management) ────────────────────────────────
export const initialMeds = [
  { id: 6, arincare_product_id: 308, arincare_product_name: "ARCOXIA 120MG.5'S.", arincare_product_reference_code: 'PCO00308', indication: 'ยาแก้อักเสบ ลดเจ็บ ลดปวด ลดบวม ลดไข้', how_to_use: '', type: 'oral', type_other: '', dosage_from: 1, dosage_to: 0, dosage_unit: 'เม็ด', frequency_from: 1, frequency_to: 0, when_to_use: 'none', timing: ['every'], every: 24, notes: [8], updated_at: '2024-03-06 20:03:41' },
  { id: 7, arincare_product_id: 4855, arincare_product_name: "TELFAST 180 MG TABLETS 10'S", arincare_product_reference_code: 'PCO04855', indication: 'ยาแก้แพ้ ลดน้ำมูก แก้คัน แบบไม่ง่วง', how_to_use: '', type: 'oral', type_other: '', dosage_from: 1, dosage_to: 0, dosage_unit: 'เม็ด', frequency_from: 1, frequency_to: 0, when_to_use: 'none', timing: ['every'], every: 24, notes: [], updated_at: '2024-09-22 12:30:36' },
  { id: 8, arincare_product_id: 311, arincare_product_name: "ARCOXIA 90 MG TABLETS 5'S", arincare_product_reference_code: 'PCO00311', indication: 'ยาแก้อักเสบ ลดเจ็บ ลดปวด ลดบวม ลดไข้', how_to_use: '', type: 'oral', type_other: '', dosage_from: 1, dosage_to: 0, dosage_unit: 'เม็ด', frequency_from: 1, frequency_to: 0, when_to_use: 'none', timing: ['every'], every: 24, notes: [], updated_at: '2024-03-06 20:04:15' },
]

const range = (a, b) => (b && b !== 0 && b !== a ? `${a}-${b}` : `${a}`)
export const usageText = (m) => {
  let s = `${DOSAGE_LABEL[m.type] || 'ครั้งละ'} ${range(m.dosage_from, m.dosage_to)} ${m.dosage_unit || ''}`.trim()
  if (m.frequency_from) s += ` วันละ ${range(m.frequency_from, m.frequency_to)} ครั้ง`
  if (m.timing && m.timing.length) s += ` (${m.timing.map(t => t === 'every' ? `ทุกๆ ${m.every || 0} ชม.` : TIME[t]).join(', ')})`
  if (m.when_to_use && m.when_to_use !== 'none') s += ` ${WHEN_TO_USE[m.when_to_use]}`
  return s
}

export const emptyForm = () => ({
  arincare_product_id: '', arincare_product_name: '', arincare_product_reference_code: '',
  indication: '', how_to_use: '', type: 'oral', type_other: '',
  dosage_from: 1, dosage_to: 0, dosage_unit: 'เม็ด', frequency_from: 1, frequency_to: 0,
  when_to_use: 'none', timing: [], every: 0, notes: [],
})
