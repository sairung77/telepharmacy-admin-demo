import { NavLink, useNavigate, Outlet } from 'react-router-dom'
import { LayoutDashboard, Store, Truck, LogOut } from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'แดชบอร์ด' },
  { to: '/companies', icon: Store, label: 'จัดการร้านขายยา' },
  { to: '/providers', icon: Truck, label: 'จัดการ Provider' },
]

const MOCK_USER = {
  name: 'Admin User',
  email: 'admin@telepharmacy.com',
  initials: 'AU',
}

export default function Layout() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('admin_auth')
    navigate('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 bg-slate-900 flex flex-col flex-shrink-0">
        {/* Brand */}
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-white font-bold text-lg">Telepharmacy</h1>
          <p className="text-slate-400 text-xs mt-0.5">Admin Portal</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User info + Logout */}
        <div className="p-3 border-t border-slate-700">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-white">{MOCK_USER.initials}</span>
            </div>
            {/* Name / Email */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{MOCK_USER.name}</p>
              <p className="text-xs text-slate-400 truncate">{MOCK_USER.email}</p>
            </div>
          </div>
          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="mt-1 w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
          >
            <LogOut size={18} />
            ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto bg-slate-50">
        <Outlet />
      </main>
    </div>
  )
}
