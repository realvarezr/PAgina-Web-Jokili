import MemberCard from './MemberCard.jsx'
import EmptyState from '../ui/EmptyState.jsx'

export default function MembersList({ members }) {
  if (members.length === 0) {
    return <EmptyState title="Sin resultados" message="Prueba con otro término de búsqueda." />
  }

  return (
    <div className="members-list">
      {members.map((m) => (
        <MemberCard key={m.id} member={m} />
      ))}
    </div>
  )
}
