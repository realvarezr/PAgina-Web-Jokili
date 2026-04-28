export default function EmptyState({ title = 'Sin resultados', message = '', icon = '📭' }) {
  return (
    <div className="empty-state">
      <span className="empty-state-icon">{icon}</span>
      <h3 className="empty-state-title">{title}</h3>
      {message && <p className="empty-state-message">{message}</p>}
    </div>
  )
}
