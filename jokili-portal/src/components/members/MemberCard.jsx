import { Link } from 'react-router-dom'
import MemberStatusBadge from './MemberStatusBadge.jsx'
import { getMemberFullName } from '../../logic/memberLogic.js'

export default function MemberCard({ member }) {
  const nombre = getMemberFullName(member)

  return (
    <Link to={`/socios/${member.id}`} className="member-card">
      <div className="member-card-avatar">{member.nombres.charAt(0)}</div>
      <div className="member-card-info">
        <span className="member-card-numero">{member.numeroCarnet}</span>
        <h3 className="member-card-nombre">{nombre}</h3>
        <span className="member-card-rol">{member.cargoActual}</span>
      </div>
      <div className="member-card-meta">
        <MemberStatusBadge member={member} />
      </div>
    </Link>
  )
}
