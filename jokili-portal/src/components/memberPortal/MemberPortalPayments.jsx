import { formatCurrency } from '../../utils/formatCurrency.js'
import { formatDate } from '../../utils/formatDate.js'

export default function MemberPortalPayments({ payments }) {
  return (
    <section className="member-portal-panel">
      <div className="member-portal-panel-header">
        <h2>Mis pagos</h2>
      </div>

      {payments.length === 0 ? (
        <p className="member-portal-muted">No tienes pagos registrados.</p>
      ) : (
        <div className="member-portal-list">
          {payments.map((payment) => (
            <article className="member-portal-list-item" key={payment.id}>
              <div>
                <h3>{payment.description}</h3>
                <p>{payment.note || 'Sin nota'}</p>
                <span className="member-portal-chip">
                  {payment.method || 'Metodo no registrado'}
                </span>
              </div>
              <div className="member-portal-list-meta">
                <strong>{formatCurrency(payment.amount, payment.currency ?? 'USD')}</strong>
                <span>{formatDate(payment.date)}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
