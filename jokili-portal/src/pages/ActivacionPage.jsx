import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import Button from '../components/ui/Button.jsx'
import { auth, db } from '../services/firebase.js'
import {
  getInvitationByToken,
  linkMemberAccount,
  markInvitationAsUsed,
} from '../services/invitationService.js'
import { CLUB_NAME } from '../utils/constants.js'

const EMPTY_FORM = {
  password: '',
  confirmPassword: '',
}

function getActivationError(error) {
  if (error?.code === 'auth/email-already-in-use') {
    return 'Ya existe una cuenta con este correo.'
  }

  if (error?.code === 'auth/weak-password') {
    return 'La contraseña debe tener al menos 8 caracteres.'
  }

  return 'No se pudo activar la cuenta. Intenta nuevamente.'
}

export default function ActivacionPage() {
  const { token } = useParams()
  const [invitation, setInvitation] = useState(null)
  const [status, setStatus] = useState('loading')
  const [form, setForm] = useState(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function verifyInvitation() {
      setStatus('loading')

      try {
        const foundInvitation = await getInvitationByToken(token)
        if (!isMounted) return

        if (!foundInvitation) {
          setStatus('invalid')
          return
        }

        if (foundInvitation.status === 'used') {
          setStatus('used')
          return
        }

        if (foundInvitation.status !== 'pending') {
          setStatus('invalid')
          return
        }

        setInvitation(foundInvitation)
        setStatus('ready')
      } catch (error) {
        if (!isMounted) return
        console.error('Error al verificar la invitacion.', error)
        setStatus('invalid')
      }
    }

    verifyInvitation()

    return () => {
      isMounted = false
    }
  }, [token])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => ({ ...prev, [name]: '' }))
  }

  function validateForm() {
    const errors = {}

    if (!form.password) {
      errors.password = 'La contraseña no puede estar vacía.'
    } else if (form.password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres.'
    }

    if (!form.confirmPassword) {
      errors.confirmPassword = 'Confirma tu contraseña.'
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas deben coincidir.'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitError('')

    if (!validateForm() || !invitation) return

    setIsSubmitting(true)

    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        invitation.email,
        form.password
      )
      const { user } = credential
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        role: 'member',
        active: true,
      })
      await markInvitationAsUsed(invitation.id)
      await linkMemberAccount(invitation.memberId, user.uid)
      setStatus('success')
      setForm(EMPTY_FORM)
    } catch (error) {
      console.error('Error al activar la cuenta.', error)
      setSubmitError(getActivationError(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-brand">
          <span className="auth-logo">TJ</span>
          <div>
            <h1>{CLUB_NAME}</h1>
            <p>Activar cuenta</p>
          </div>
        </div>

        {status === 'loading' && <p className="auth-help">Verificando enlace...</p>}

        {status === 'invalid' && (
          <p className="auth-error">Este enlace no es válido.</p>
        )}

        {status === 'used' && (
          <p className="auth-error">
            Este enlace ya fue utilizado. Si necesitas acceso contacta al administrador.
          </p>
        )}

        {status === 'success' && (
          <div className="auth-form">
            <p className="auth-help auth-help--top">
              Cuenta activada correctamente. Ya puedes iniciar sesión.
            </p>
            <Link className="btn btn--primary btn--md" to="/login">
              Ir al login
            </Link>
          </div>
        )}

        {status === 'ready' && (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-help auth-help--top">
              <strong>Correo de activación</strong>
              <span>{invitation.email}</span>
            </div>

            <div className="auth-field">
              <label htmlFor="activation-password">Contraseña</label>
              <input
                id="activation-password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              {fieldErrors.password && (
                <p className="auth-error">{fieldErrors.password}</p>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="activation-confirm-password">
                Confirmar contraseña
              </label>
              <input
                id="activation-confirm-password"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
              {fieldErrors.confirmPassword && (
                <p className="auth-error">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            {submitError && <p className="auth-error">{submitError}</p>}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Activando...' : 'Activar cuenta'}
            </Button>
          </form>
        )}
      </section>
    </main>
  )
}
