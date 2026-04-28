import { formatCurrency } from '../../utils/formatCurrency.js'
import { formatDate } from '../../utils/formatDate.js'

export default function MemberPortalDebts({ debts }) {
  return (
    <section className="member-portal-panel">
      <div className="member-portal-panel-header">
        <h2>Mis deudas</h2>
      </div>

      {debts.length === 0 ? (
        <p className="member-portal-muted">No tienes deudas registradas.</p>
      ) : (
        <div className="member-portal-list">
          {debts.map((debt) => (
            <article className="member-portal-list-item" key={debt.id}>
              <div>
                <h3>{debt.description}</h3>
                <p>{debt.note || 'Sin nota'}</p>
              </div>
              <div className="member-portal-list-meta">
                <strong>{formatCurrency(debt.amount, debt.currency ?? 'USD')}</strong>
                <span>{formatDate(debt.date)}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
