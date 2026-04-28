import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import Button from '../components/ui/Button.jsx'
import { CLUB_NAME } from '../utils/constants.js'

export default function ActivateAccountPage({
  currentUser,
  dataReady,
  memberInvitations,
  onActivateInvitation,
}) {
  const { token } = useParams()
  const invitation = memberInvitations.find((item) => item.token === token) ?? null
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (currentUser?.role === 'admin') return <Navigate to="/" replace />
  if (currentUser?.role === 'member') return <Navigate to="/portal-miembro" replace />

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    const result = await onActivateInvitation(token, form)
    setIsSubmitting(false)

    if (!result.ok) {
      setError(result.message)
      return
    }

    setError('')
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-brand">
          <span className="auth-logo">TJ</span>
          <div>
            <h1>{CLUB_NAME}</h1>
            <p>Activar cuenta de miembro</p>
          </div>
        </div>

        {!dataReady ? (
          <p className="auth-help">Cargando invitacion...</p>
        ) : !invitation || invitation.status === 'accepted' ? (
          <p className="auth-error">La invitacion no existe o ya fue usada.</p>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-help auth-help--top">
              <strong>Correo de referencia</strong>
              <span>{invitation.email}</span>
            </div>

            <div className="auth-field">
              <label htmlFor="activation-username">Usuario</label>
              <input
                id="activation-username"
                name="username"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="activation-password">Clave</label>
              <input
                id="activation-password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="activation-confirm-password">Confirmar clave</label>
              <input
                id="activation-confirm-password"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Activando...' : 'Activar cuenta'}
            </Button>
          </form>
        )}
      </section>
    </main>
  )
}
