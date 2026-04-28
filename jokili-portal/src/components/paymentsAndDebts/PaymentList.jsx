import { getMemberPayments } from '../../logic/paymentsAndDebtsLogic.js'
import { formatCurrency } from '../../utils/formatCurrency.js'
import { formatDate } from '../../utils/formatDate.js'

const METHOD_LABELS = {
  efectivo: 'Efectivo',
  transferencia: 'Transferencia',
  tarjeta: 'Tarjeta',
  otro: 'Otro',
}

export default function PaymentList({ member, payments }) {
  const memberPayments = getMemberPayments(member.id, payments)

  if (memberPayments.length === 0) {
    return <p className="pad-empty">Sin pagos registrados.</p>
  }

  return (
    <div className="pad-list">
      <h4 className="pad-list-title">Pagos</h4>
      <table className="pad-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Método</th>
            <th>Monto</th>
            <th>Nota</th>
          </tr>
        </thead>
        <tbody>
          {memberPayments.map((p) => (
            <tr key={p.id}>
              <td>{formatDate(p.date)}</td>
              <td>{p.description}</td>
              <td>{METHOD_LABELS[p.method] ?? p.method}</td>
              <td className="pad-table-amount pad-table-amount--payment">{formatCurrency(p.amount, p.currency)}</td>
              <td className="pad-table-note">{p.note || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
