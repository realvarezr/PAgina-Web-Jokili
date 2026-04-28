import Card from '../ui/Card.jsx'
import {
  getMemberBalance,
  getMemberDebts,
  getMemberPayments,
  getTotalDebts,
  getTotalPayments,
} from '../../logic/paymentsAndDebtsLogic.js'
import { formatCurrency } from '../../utils/formatCurrency.js'
import { formatDate } from '../../utils/formatDate.js'

function parseMovementDate(date) {
  if (!date) return 0
  const parts = date.split('-')
  if (parts.length !== 3) return 0

  const normalized = parts[0].length === 2
    ? `${parts[2]}-${parts[1]}-${parts[0]}`
    : date

  return new Date(`${normalized}T00:00:00`).getTime()
}

function getRecentMovements(movements, type) {
  return movements
    .map((movement) => ({ ...movement, type }))
    .sort((a, b) => parseMovementDate(b.date) - parseMovementDate(a.date))
    .slice(0, 4)
}

export default function MemberFinancialSummary({ member, debts, payments }) {
  const memberDebts = getMemberDebts(member.id, debts)
  const memberPayments = getMemberPayments(member.id, payments)
  const totalDebts = getTotalDebts(member.id, debts)
  const totalPayments = getTotalPayments(member.id, payments)
  const balance = getMemberBalance(member.id, debts, payments)
  const currency = memberDebts[0]?.currency ?? memberPayments[0]?.currency ?? 'CHF'
  const recentMovements = [
    ...getRecentMovements(memberDebts, 'debt'),
    ...getRecentMovements(memberPayments, 'payment'),
  ]
    .sort((a, b) => parseMovementDate(b.date) - parseMovementDate(a.date))
    .slice(0, 4)

  return (
    <Card className="member-section member-financial-summary">
      <div className="member-financial-header">
        <div>
          <h2 className="section-title">Resumen de Pagos y Deudas</h2>
          <p className="member-financial-note">Vista informativa. Los cambios se administran desde Pagos y Deudas.</p>
        </div>
        <span className={`member-financial-status ${balance > 0 ? 'member-financial-status--pending' : 'member-financial-status--settled'}`}>
          {balance > 0 ? 'Pendiente' : 'Al dia'}
        </span>
      </div>

      <div className="member-financial-totals">
        <div className="member-financial-total member-financial-total--debt">
          <span>Deudas</span>
          <strong>{formatCurrency(totalDebts, currency)}</strong>
          <small>{memberDebts.length} registro{memberDebts.length === 1 ? '' : 's'}</small>
        </div>
        <div className="member-financial-total member-financial-total--payment">
          <span>Pagos</span>
          <strong>{formatCurrency(totalPayments, currency)}</strong>
          <small>{memberPayments.length} registro{memberPayments.length === 1 ? '' : 's'}</small>
        </div>
        <div className={`member-financial-total ${balance > 0 ? 'member-financial-total--pending' : 'member-financial-total--settled'}`}>
          <span>Balance</span>
          <strong>{formatCurrency(balance, currency)}</strong>
          <small>{balance > 0 ? 'Por cancelar' : 'Sin deuda pendiente'}</small>
        </div>
      </div>

      <div className="member-financial-movements">
        <h3 className="member-financial-subtitle">Ultimos movimientos</h3>
        {recentMovements.length === 0 ? (
          <p className="pad-empty">Sin deudas ni pagos registrados.</p>
        ) : (
          <ul className="member-financial-list">
            {recentMovements.map((movement) => (
              <li key={`${movement.type}-${movement.id}`} className="member-financial-movement">
                <div>
                  <span className="member-financial-movement-title">{movement.description}</span>
                  <span className="member-financial-movement-date">{formatDate(movement.date)}</span>
                </div>
                <strong className={`member-financial-amount member-financial-amount--${movement.type}`}>
                  {movement.type === 'payment' ? '+' : '-'}{formatCurrency(movement.amount, movement.currency)}
                </strong>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  )
}
