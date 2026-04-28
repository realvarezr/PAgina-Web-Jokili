import {
  getMemberDebts,
  getMemberPayments,
} from '../logic/paymentsAndDebtsLogic.js'
import MemberPortalDashboard from '../components/memberPortal/MemberPortalDashboard.jsx'

export default function MemberPortalPage({ currentUser, members, debts, payments, messages, onMarkMessageRead }) {
  const member = members.find((item) => item.id === currentUser?.memberId) ?? null

  if (!member) {
    return (
      <div className="page member-portal">
        <div className="page-header">
          <h1 className="page-title">Portal del miembro</h1>
        </div>
        <div className="member-portal-empty">
          No se encontro la ficha asociada a este usuario.
        </div>
      </div>
    )
  }

  const memberDebts = getMemberDebts(member.id, debts)
  const memberPayments = getMemberPayments(member.id, payments)
  const memberMessages = messages.filter((m) => m.memberId === member.id)

  return (
    <MemberPortalDashboard
      member={member}
      debts={memberDebts}
      payments={memberPayments}
      allDebts={debts}
      allPayments={payments}
      messages={memberMessages}
      onMarkMessageRead={onMarkMessageRead}
    />
  )
}
