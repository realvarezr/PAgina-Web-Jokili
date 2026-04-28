import { useState } from 'react'
import { getMemberFullName } from '../../logic/memberLogic.js'

const EMPTY = { memberId: 'all', title: '', body: '' }

export default function MessageCompose({ members, onSend }) {
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')
  const [successCount, setSuccessCount] = useState(null)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
    setSuccessCount(null)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) { setError('Escribe un titulo.'); return }
    if (!form.body.trim()) { setError('Escribe el mensaje.'); return }
    const count = onSend(form)
    setSuccessCount(count)
    setForm(EMPTY)
  }

  return (
    <div className="msg-compose">
      <span className="msg-compose-kicker">Nuevo mensaje</span>
      <form className="msg-compose-form" onSubmit={handleSubmit}>
        <div className="msg-compose-field">
          <label htmlFor="mc-member">Para</label>
          <select id="mc-member" name="memberId" value={form.memberId} onChange={handleChange}>
            <option value="all">Todos los socios activos</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>{getMemberFullName(m)}</option>
            ))}
          </select>
        </div>
        <div className="msg-compose-field">
          <label htmlFor="mc-title">Titulo</label>
          <input
            id="mc-title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            placeholder="Ej: Recordatorio de pago"
          />
        </div>
        <div className="msg-compose-field">
          <label htmlFor="mc-body">Mensaje</label>
          <textarea
            id="mc-body"
            name="body"
            rows={4}
            value={form.body}
            onChange={handleChange}
            placeholder="Escribe el contenido del mensaje..."
          />
        </div>
        {error && <p className="msg-error">{error}</p>}
        {successCount !== null && (
          <p className="msg-success">
            Mensaje enviado a {successCount} socio{successCount !== 1 ? 's' : ''}.
          </p>
        )}
        <button type="submit" className="btn btn--md btn--primary">Enviar mensaje</button>
      </form>
    </div>
  )
}
