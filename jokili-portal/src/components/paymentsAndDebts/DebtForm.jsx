import { useState } from 'react'

const EMPTY_FORM = {
  description: '',
  amount: '',
  currency: 'USD',
  date: new Date().toISOString().slice(0, 10),
  note: '',
}

export default function DebtForm({ member, onAddDebt }) {
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
    onAddDebt({
      memberId: member.id,
      description: form.description.trim(),
      amount,
      currency: form.currency,
      date: form.date,
      note: form.note.trim(),
    })
    setForm(EMPTY_FORM)
  }

  return (
    <form className="pad-form" onSubmit={handleSubmit}>
      <h4 className="pad-form-title">Registrar deuda</h4>
      {error && <p className="pad-form-error">{error}</p>}
      <div className="pad-form-row">
        <label className="pad-form-label">Descripción</label>
        <input className="pad-form-input" name="description" value={form.description} onChange={handleChange} placeholder="Ej: Anualidad 2026" />
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
        <label className="pad-form-label">Nota</label>
        <input className="pad-form-input" name="note" value={form.note} onChange={handleChange} placeholder="Opcional" />
      </div>
      <button className="pad-form-btn" type="submit">Agregar deuda</button>
    </form>
  )
}
