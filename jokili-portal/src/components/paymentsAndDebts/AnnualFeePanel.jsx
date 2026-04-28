import { useState } from 'react'
import { getMemberStatus } from '../../logic/memberLogic.js'

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR + i)

const EMPTY = { year: CURRENT_YEAR, amount: '', currency: 'USD' }

export default function AnnualFeePanel({ members, onAddAnnualFee }) {
  const [form, setForm]         = useState(EMPTY)
  const [confirming, setConfirming] = useState(false)
  const [successCount, setSuccessCount] = useState(null)
  const [error, setError]       = useState('')

  const activeCount = members.filter((m) => getMemberStatus(m) === 'activo').length

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
    setSuccessCount(null)
  }

  function handlePreview(e) {
    e.preventDefault()
    if (!form.amount || Number(form.amount) <= 0) { setError('El monto debe ser mayor a 0.'); return }
    setConfirming(true)
  }

  function handleConfirm() {
    const count = onAddAnnualFee({ ...form, description: `Anualidad ${form.year}` })
    setSuccessCount(count)
    setConfirming(false)
    setForm(EMPTY)
  }

  function handleCancel() {
    setConfirming(false)
  }

  return (
    <div className="annual-fee-panel">
      <div className="annual-fee-header">
        <div>
          <span className="annual-fee-kicker">Accion masiva</span>
          <h2 className="annual-fee-title">Agregar anualidad</h2>
        </div>
        <span className="annual-fee-badge">{activeCount} socios activos</span>
      </div>

      {successCount !== null && (
        <p className="annual-fee-success">
          Anualidad registrada para {successCount} socio{successCount !== 1 ? 's' : ''}.
        </p>
      )}

      {!confirming ? (
        <form className="annual-fee-form" onSubmit={handlePreview}>
          <div className="annual-fee-fields">
            <div className="annual-fee-field">
              <label htmlFor="af-year">Anualidad</label>
              <select id="af-year" name="year" value={form.year} onChange={handleChange}>
                {YEARS.map((y) => (
                  <option key={y} value={y}>Anualidad {y}</option>
                ))}
              </select>
            </div>
            <div className="annual-fee-field">
              <label htmlFor="af-amount">Monto</label>
              <input
                id="af-amount"
                name="amount"
                type="number"
                min="1"
                step="0.01"
                value={form.amount}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
            <div className="annual-fee-field">
              <label htmlFor="af-currency">Moneda</label>
              <select id="af-currency" name="currency" value={form.currency} onChange={handleChange}>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="Bs">Bs</option>
              </select>
            </div>
          </div>
          {error && <p className="annual-fee-error">{error}</p>}
          <button type="submit" className="btn btn--md btn--primary annual-fee-btn">
            Vista previa
          </button>
        </form>
      ) : (
        <div className="annual-fee-confirm">
          <p className="annual-fee-confirm-text">
            Se registrara <strong>Anualidad {form.year}</strong> de{' '}
            <strong>{form.currency} {Number(form.amount).toFixed(2)}</strong> a{' '}
            <strong>{activeCount} socios activos</strong>. Esta accion no se puede deshacer.
          </p>
          <div className="annual-fee-confirm-actions">
            <button className="btn btn--md btn--ghost" onClick={handleCancel}>Cancelar</button>
            <button className="btn btn--md btn--primary" onClick={handleConfirm}>Confirmar</button>
          </div>
        </div>
      )}
    </div>
  )
}
