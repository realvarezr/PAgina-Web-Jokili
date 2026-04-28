import { getTotalDebts, getTotalPayments, getMemberBalance } from '../../logic/paymentsAndDebtsLogic.js'
import { formatCurrency } from '../../utils/formatCurrency.js'

export default function BalanceSummary({ member, debts, payments }) {
  const memberId = member.id
  const totalDeudas = getTotalDebts(memberId, debts)
  const totalPagos = getTotalPayments(memberId, payments)
  const balance = getMemberBalance(memberId, debts, payments)
  const currency = debts[0]?.currency ?? payments[0]?.currency ?? 'USD'

  return (
    <div className="balance-summary">
      <div className="balance-item balance-item--debt">
        <span className="balance-label">Total deudas</span>
        <span className="balance-amount">{formatCurrency(totalDeudas, currency)}</span>
      </div>
      <div className="balance-item balance-item--payment">
        <span className="balance-label">Total pagos</span>
        <span className="balance-amount">{formatCurrency(totalPagos, currency)}</span>
      </div>
      <div className={`balance-item balance-item--balance ${balance > 0 ? 'balance-item--pending' : 'balance-item--settled'}`}>
        <span className="balance-label">Balance pendiente</span>
        <span className="balance-amount">{formatCurrency(balance, currency)}</span>
      </div>
    </div>
  )
}
