import { useState } from 'react'

const EMPTY_FORM = {
  description: '',
  amount: '',
  currency: 'USD',
  date: new Date().toISOString().slice(0, 10),
  method: 'efectivo',
  note: '',
}

export default function PaymentForm({ member, onAddPayment }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.description.trim()) return setError('La descripción es obligatoria.')
    const amount = parseFloat(form.amount)
    if (isNaN(amount) || amount <= 0) return setError('El monto debe ser mayor a 0.')
    setError('')
    onAddPayment({
      memberId: member.id,
      description: form.description.trim(),
      amount,
      currency: form.currency,
      date: form.date,
      method: form.method,
      note: form.note.trim(),
    })
    setForm(EMPTY_FORM)
  }

  return (
    <form className="pad-form" onSubmit={handleSubmit}>
      <h4 className="pad-form-title">Registrar pago</h4>
      {error && <p className="pad-form-error">{error}</p>}
      <div className="pad-form-row">
        <label className="pad-form-label">Descripción</label>
        <input className="pad-form-input" name="description" value={form.description} onChange={handleChange} placeholder="Ej: Pago anualidad 2026" />
      </div>
      <div className="pad-form-row pad-form-row--inline">
        <div>
          <label className="pad-form-label">Monto</label>
          <input className="pad-form-input" name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={handleChange} placeholder="0.00" />
        </div>
        <div>
          <label className="pad-form-label">Moneda</label>
          <select className="pad-form-select" name="currency" value={form.currency} onChange={handleChange}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="CHF">CHF</option>
            <option value="VES">VES</option>
          </select>
        </div>
        <div>
          <label className="pad-form-label">Fecha</label>
          <input className="pad-form-input" name="date" type="date" value={form.date} onChange={handleChange} />
        </div>
      </div>
      <div className="pad-form-row">
        <label className="pad-form-label">Método de pago</label>
        <select className="pad-form-select" name="method" value={form.method} onChange={handleChange}>
          <option value="efectivo">Efectivo</option>
          <option value="transferencia">Transferencia</option>
          <option value="tarjeta">Tarjeta</option>
          <option value="otro">Otro</option>
        </select>
      </div>
      <div className="pad-form-row">
        <label className="pad-form-label">Nota</label>
        <input className="pad-form-input" name="note" value={form.note} onChange={handleChange} placeholder="Opcional" />
      </div>
      <button className="pad-form-btn pad-form-btn--payment" type="submit">Agregar pago</button>
    </form>
  )
}
