import { useState, useRef, useEffect } from 'react'
import { Heading1, Heading2, Type, Bold, List, RotateCcw, Save, Check } from 'lucide-react'

// Template มาตรฐาน (default) — ใช้เริ่มต้นสำหรับร้านที่ยังไม่เคยตั้งค่า
const defaultTemplate = (companyName) => `
<h1>นโยบายความเป็นส่วนตัวและการขอความยินยอม</h1>
<p>${companyName} ("ร้าน") ให้บริการเภสัชกรรมทางไกล (Telepharmacy) และเก็บรวบรวมข้อมูลส่วนบุคคลของท่านเพื่อการให้บริการตามกฎหมายที่เกี่ยวข้อง</p>
<h2>1. ข้อมูลที่เก็บรวบรวม</h2>
<p>ชื่อ-นามสกุล เบอร์โทรศัพท์ ที่อยู่จัดส่ง และข้อมูลสุขภาพที่จำเป็นต่อการให้บริการ</p>
<h2>2. การใช้ข้อมูลสุขภาพ</h2>
<p>ข้อมูลสุขภาพของท่าน (อาการของโรค โรคประจำตัว ประวัติแพ้ยา ฯลฯ) เป็นข้อมูลอ่อนไหวตามกฎหมาย แต่เป็นข้อมูลที่จำเป็นอย่างยิ่งสำหรับเภสัชกรที่ขึ้นทะเบียนใช้เพื่อประกอบการสั่งจ่ายยา</p>
<h2>3. การเก็บรักษาและความปลอดภัย</h2>
<p>ข้อมูลถูกจัดเก็บอย่างปลอดภัยและบันทึกประวัติการให้บริการไว้ไม่น้อยกว่า 1 ปีตามกฎหมาย</p>
<h2>4. สิทธิของเจ้าของข้อมูล</h2>
<p>ท่านมีสิทธิเข้าถึง แก้ไข หรือถอนความยินยอมได้ โดยติดต่อร้านผ่านช่องทางที่กำหนด</p>
`.trim()

export default function PrivacyNoticeTab({ company }) {
  const editorRef = useRef(null)
  const [saved, setSaved] = useState(false)
  // ในระบบจริงค่านี้ดึง/บันทึกต่อร้าน (company.id) — demo เก็บใน state
  const [html, setHtml] = useState(company?.privacy_notice || defaultTemplate(company?.name || 'ร้านขายยา'))

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== html) {
      editorRef.current.innerHTML = html
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const exec = (cmd, val = null) => {
    editorRef.current?.focus()
    document.execCommand(cmd, false, val)
    setHtml(editorRef.current?.innerHTML || '')
  }
  const onInput = () => setHtml(editorRef.current?.innerHTML || '')

  const resetTemplate = () => {
    const t = defaultTemplate(company?.name || 'ร้านขายยา')
    if (editorRef.current) editorRef.current.innerHTML = t
    setHtml(t)
  }
  const handleSave = () => {
    // demo: mock save → production: PUT privacy_notice ต่อร้าน
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const ToolBtn = ({ onClick, title, children }) => (
    <button type="button" title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-sky-600 flex items-center gap-1 text-xs font-medium">
      {children}
    </button>
  )

  return (
    <div className="max-w-3xl">
      <style>{`
        .pn-editor h1 { font-size: 1.5rem; font-weight: 700; color: #1e293b; margin: 0.5rem 0; }
        .pn-editor h2 { font-size: 1.125rem; font-weight: 700; color: #334155; margin: 0.75rem 0 0.25rem; }
        .pn-editor p  { font-size: 0.9rem; color: #475569; margin: 0.35rem 0; line-height: 1.6; }
        .pn-editor ul { list-style: disc; padding-left: 1.25rem; margin: 0.35rem 0; }
        .pn-editor:focus { outline: none; }
      `}</style>

      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-800">ตั้งค่านโยบายความเป็นส่วนตัว (Privacy Notice)</h3>
        <p className="text-sm text-slate-500 mt-0.5">กำหนดข้อความนโยบาย/การขอความยินยอมสำหรับร้านนี้ — แสดงให้ผู้ป่วยในขั้นตอนยินยอมบน LINE LIFF</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 flex-wrap border border-slate-200 rounded-t-xl bg-slate-50 px-2 py-1.5">
        <ToolBtn title="หัวข้อใหญ่" onClick={() => exec('formatBlock', 'H1')}><Heading1 size={15} /> หัวข้อใหญ่</ToolBtn>
        <ToolBtn title="หัวข้อย่อย" onClick={() => exec('formatBlock', 'H2')}><Heading2 size={15} /> หัวข้อย่อย</ToolBtn>
        <ToolBtn title="ข้อความปกติ" onClick={() => exec('formatBlock', 'P')}><Type size={15} /> ปกติ</ToolBtn>
        <span className="w-px h-5 bg-slate-200 mx-1" />
        <ToolBtn title="ตัวหนา" onClick={() => exec('bold')}><Bold size={15} /></ToolBtn>
        <ToolBtn title="รายการ (bullet)" onClick={() => exec('insertUnorderedList')}><List size={15} /></ToolBtn>
        <div className="flex-1" />
        <ToolBtn title="โหลด template มาตรฐาน" onClick={resetTemplate}><RotateCcw size={14} /> Template มาตรฐาน</ToolBtn>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={onInput}
        className="pn-editor min-h-[360px] border border-t-0 border-slate-200 rounded-b-xl bg-white px-5 py-4 overflow-y-auto"
      />

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 mt-4">
        {saved && (
          <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
            <Check size={16} /> บันทึกแล้ว
          </span>
        )}
        <button onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 text-sm bg-sky-500 text-white rounded-lg hover:bg-sky-600">
          <Save size={16} /> บันทึกนโยบายของร้านนี้
        </button>
      </div>
    </div>
  )
}
