import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Socios', icon: 'S' },
  { to: '/pagos', label: 'Pagos y Deudas', icon: '$' },
  { to: '/mensajes', label: 'Mensajes' },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {navItems.map(({ to, label, icon, disabled }) =>
          disabled ? (
            <span key={to} className="sidebar-link sidebar-link--disabled">
              {label}
              <span className="sidebar-link-soon">pronto</span>
            </span>
          ) : (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `sidebar-link${isActive ? ' sidebar-link--active' : ''}`
              }
            >
              {label}
            </NavLink>
          )
        )}
      </nav>
    </aside>
  )
}
