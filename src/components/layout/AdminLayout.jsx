import { NavLink, Outlet } from 'react-router-dom'
import { MessageOutlined, DatabaseOutlined, HomeOutlined } from '@ant-design/icons'

const NAV_ITEMS = [
  { to: '/admin/conversations', icon: <MessageOutlined />, label: 'Conversations' },
  { to: '/admin/knowledge', icon: <DatabaseOutlined />, label: 'Knowledge Base' },
]

/**
 * Admin layout with a sidebar and main content area.
 * Routes render into <Outlet />.
 */
export default function AdminLayout() {
  return (
    <div className="h-screen flex bg-surface-50 overflow-hidden">
      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside className="w-60 flex-shrink-0 bg-white border-r border-slate-100 flex flex-col shadow-sm h-full overflow-y-auto">
        {/* Logo / Brand */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
              <span className="text-white text-lg">🤖</span>
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm leading-tight">Appota ChatBot</p>
              <p className="text-xs text-slate-400 leading-tight">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <span className="text-base">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer link back to chat */}
        <div className="p-4 border-t border-slate-100">
          <NavLink to="/" className="sidebar-link text-slate-500">
            <HomeOutlined />
            <span>Về trang Chat</span>
          </NavLink>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────── */}
      <main className="flex-1 h-full overflow-y-auto scrollbar-thin">
        <Outlet />
      </main>
    </div>
  )
}
