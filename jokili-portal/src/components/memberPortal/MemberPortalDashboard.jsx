import MemberPortalProfile from './MemberPortalProfile.jsx'
import MemberPortalBalance from './MemberPortalBalance.jsx'
import MemberPortalDebts from './MemberPortalDebts.jsx'
import MemberPortalPayments from './MemberPortalPayments.jsx'
import MemberPortalNotice from './MemberPortalNotice.jsx'
import MemberPortalMessages from './MemberPortalMessages.jsx'

export default function MemberPortalDashboard({
  member,
  debts,
  payments,
  allDebts,
  allPayments,
  messages,
  onMarkMessageRead,
}) {
  return (
    <div className="page member-portal">
      <div className="page-header member-portal-header">
        <img src="/escudo.png" alt="Escudo Jokili" className="header-logo" />
        <div>
          <p className="member-portal-kicker">Jokili Verein</p>
          <h1 className="page-title"> Tovarer Narrenzunft - Portal del miembro</h1>
        </div>
      </div>

      <div className="member-portal-grid member-portal-grid--ficha">
        <MemberPortalProfile member={member} />
        <div className="member-portal-sidebar">
          <MemberPortalBalance
            member={member}
            debts={allDebts}
            payments={allPayments}
          />
          <MemberPortalMessages messages={messages} onMarkRead={onMarkMessageRead} />
          <MemberPortalDebts debts={debts} />
          <MemberPortalPayments payments={payments} />
        </div>
      </div>

      <MemberPortalNotice />
    </div>
  )
}
