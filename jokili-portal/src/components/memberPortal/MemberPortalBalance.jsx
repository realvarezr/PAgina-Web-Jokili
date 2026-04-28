import {
  getMemberBalance,
  getTotalDebts,
  getTotalPayments,
} from '../../logic/paymentsAndDebtsLogic.js'
import { formatCurrency } from '../../utils/formatCurrency.js'

export default function MemberPortalBalance({ member, debts, payments }) {
  const totalDebts = getTotalDebts(member.id, debts)
  const totalPayments = getTotalPayments(member.id, payments)
  const balance = getMemberBalance(member.id, debts, payments)
  const currency = debts[0]?.currency ?? payments[0]?.currency ?? 'USD'

  return (
    <section className="member-portal-panel member-portal-balance">
      <div className="member-portal-panel-header">
        <h2>Resumen financiero</h2>
      </div>

      <div className="member-portal-balance-list">
        <div className="member-portal-balance-item">
          <span>Total de deudas</span>
          <strong>{formatCurrency(totalDebts, currency)}</strong>
        </div>
        <div className="member-portal-balance-item">
          <span>Total pagado</span>
          <strong>{formatCurrency(totalPayments, currency)}</strong>
        </div>
        <div className="member-portal-balance-item member-portal-balance-item--pending">
          <span>Balance pendiente</span>
          <strong>{formatCurrency(balance, currency)}</strong>
        </div>
      </div>
    </section>
  )
}
