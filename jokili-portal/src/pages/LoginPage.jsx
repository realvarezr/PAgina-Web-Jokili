import { Navigate } from 'react-router-dom'
import LoginForm from '../components/auth/LoginForm.jsx'
import { CLUB_NAME } from '../utils/constants.js'

export default function LoginPage({ currentUser, onLogin }) {
  if (currentUser?.role === 'admin') return <Navigate to="/" replace />
  if (currentUser?.role === 'member') return <Navigate to="/portal-miembro" replace />

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-brand">
          <img src="/escudo.png" alt="Escudo Jokili" className="auth-logo" />
          <div>
            <h1>{CLUB_NAME}</h1>
            <p>Portal Jokili</p>
          </div>
        </div>

        <LoginForm onLogin={onLogin} />
      </section>
    </main>
  )
}
