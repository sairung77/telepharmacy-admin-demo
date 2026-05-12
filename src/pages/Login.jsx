import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    if (error) setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!form.email || !form.password) {
      setError('กรุณากรอกอีเมลและรหัสผ่าน')
      return
    }

    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      if (form.email === 'admin@telepharmacy.com' && form.password === 'admin1234') {
        localStorage.setItem('admin_auth', 'true')
        navigate('/dashboard')
      } else {
        setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
        setLoading(false)
      }
    }, 800)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-500 text-white mb-4 shadow-lg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className="w-7 h-7">
              <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-800">Telepharmacy Admin</h1>
          <p className="text-sm text-slate-500 mt-1">เข้าสู่ระบบเพื่อจัดการข้อมูล</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                อีเมล
              </label>
              <input
                type="email"
                autoComplete="email"
                placeholder="admin@telepharmacy.com"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                className="w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder:text-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                รหัสผ่าน
              </label>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                className="w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder:text-slate-300"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors mt-2"
            >
              {loading ? 'กำลังเข้าสู่ระบบ…' : 'เข้าสู่ระบบ'}
            </button>
          </form>

          {/* Demo hint */}
          <p className="mt-4 text-center text-xs text-slate-400">
            Demo: <span className="font-mono">admin@telepharmacy.com</span> / <span className="font-mono">admin1234</span>
          </p>
        </div>
      </div>
    </div>
  )
}
