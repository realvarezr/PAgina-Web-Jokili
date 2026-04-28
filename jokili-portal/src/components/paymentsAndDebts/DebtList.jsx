import { getMemberDebts } from '../../logic/paymentsAndDebtsLogic.js'
import { formatCurrency } from '../../utils/formatCurrency.js'
import { formatDate } from '../../utils/formatDate.js'

export default function DebtList({ member, debts }) {
  const memberDebts = getMemberDebts(member.id, debts)

  if (memberDebts.length === 0) {
    return <p className="pad-empty">Sin deudas registradas.</p>
  }

  return (
    <div className="pad-list">
      <h4 className="pad-list-title">Deudas</h4>
      <table className="pad-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Monto</th>
            <th>Nota</th>
          </tr>
        </thead>
        <tbody>
          {memberDebts.map((d) => (
            <tr key={d.id}>
              <td>{formatDate(d.date)}</td>
              <td>{d.description}</td>
              <td className="pad-table-amount pad-table-amount--debt">{formatCurrency(d.amount, d.currency)}</td>
              <td className="pad-table-note">{d.note || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
