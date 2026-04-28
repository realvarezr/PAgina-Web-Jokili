import { CLUB_NAME } from '../../utils/constants.js'
import LogoutButton from '../auth/LogoutButton.jsx'

export default function Header({ currentUser, onLogout }) {
  const roleLabel = currentUser?.role === 'admin' ? 'Administrador' : 'Miembro'

  return (
    <header className="header">
      <div className="header-brand">
        <img src="/escudo.png" alt="Escudo Jokili" className="header-logo" />
        <span className="header-name">{CLUB_NAME}</span>
        <span className="header-subtitle">{currentUser?.role === 'admin' ? 'Portal Administrativo' : 'Portal del Miembro'}</span>
      </div>
      {currentUser && (
        <div className="header-session">
          <span className="header-user">
            {roleLabel}: {currentUser.username}
          </span>
          <LogoutButton onLogout={onLogout} />
        </div>
      )}
    </header>
  )
}
