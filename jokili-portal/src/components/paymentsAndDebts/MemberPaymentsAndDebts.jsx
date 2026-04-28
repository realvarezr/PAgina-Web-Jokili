import BalanceSummary from './BalanceSummary.jsx'
import DebtList from './DebtList.jsx'
import PaymentList from './PaymentList.jsx'
import DebtForm from './DebtForm.jsx'
import PaymentForm from './PaymentForm.jsx'

export default function MemberPaymentsAndDebts({ member, debts, payments, onAddDebt, onAddPayment }) {
  return (
    <section className="pad-section">
      <h3 className="pad-section-title">Pagos y Deudas</h3>
      <BalanceSummary member={member} debts={debts} payments={payments} />
      <div className="pad-lists">
        <DebtList member={member} debts={debts} />
        <PaymentList member={member} payments={payments} />
      </div>
      <div className="pad-forms">
        <DebtForm member={member} onAddDebt={onAddDebt} />
        <PaymentForm member={member} onAddPayment={onAddPayment} />
      </div>
    </section>
  )
}
