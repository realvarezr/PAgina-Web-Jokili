import MemberStatusBadge from './MemberStatusBadge.jsx'
import MemberContactInfo from './MemberContactInfo.jsx'
import MemberClubInfo from './MemberClubInfo.jsx'
import { getMemberFullName } from '../../logic/memberLogic.js'

export default function MemberProfile({ member }) {
  const nombre = getMemberFullName(member)

  return (
    <div className="member-profile">
      <div className="member-profile-header">
        <div className="member-profile-avatar">{member.nombres.charAt(0)}</div>
        <div className="member-profile-identity">
          <h1 className="member-profile-name">{nombre}</h1>
          <span className="member-profile-rol">{member.cargoActual}</span>
          <MemberStatusBadge member={member} />
        </div>
      </div>
      <MemberContactInfo member={member} />
      <MemberClubInfo member={member} />
    </div>
  )
}
