import { useState } from 'react'
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom'
import MemberProfile from '../components/members/MemberProfile.jsx'
import MemberForm from '../components/members/MemberForm.jsx'
import MemberAccessPanel from '../components/members/MemberAccessPanel.jsx'
import MemberFinancialSummary from '../components/paymentsAndDebts/MemberFinancialSummary.jsx'
import Button from '../components/ui/Button.jsx'
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx'
import { getMemberFullName } from '../logic/memberLogic.js'

export default function MemberDetailPage({
  members,
  debts,
  manualPayments,
  memberAccounts,
  memberInvitations,
  updateMember,
  deleteMember,
  createMemberInvitation,
}) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const member = members.find((m) => m.id === id) ?? null

  if (!member) return <Navigate to="/" replace />

  const account = memberAccounts.find((item) => item.memberId === member.id) ?? null
  const invitation =
    memberInvitations.find(
      (item) => item.memberId === member.id && item.status === 'pending'
    ) ?? null

  function handleUpdateMember(memberData) {
    updateMember(member.id, memberData)
    setIsEditing(false)
  }

  function handleDeleteConfirm() {
    deleteMember(member.id)
    navigate('/', { replace: true })
  }

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/">
          <Button variant="ghost" size="sm">&lt;- Volver</Button>
        </Link>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button size="sm" onClick={() => setIsEditing((value) => !value)}>
            {isEditing ? 'Cerrar edicion' : 'Editar socio'}
          </Button>
          <button
            type="button"
            className="btn btn--danger btn--sm"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Eliminar socio
          </button>
        </div>
      </div>
      {isEditing && (
        <MemberForm
          mode="edit"
          initialMember={member}
          onAddMember={handleUpdateMember}
          onCancel={() => setIsEditing(false)}
        />
      )}
      {showDeleteConfirm && (
        <ConfirmDialog
          title="Eliminar socio"
          message={`¿Estás seguro que deseas eliminar a ${getMemberFullName(member)}? Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
      <MemberProfile member={member} />
      <MemberAccessPanel
        member={member}
        account={account}
        invitation={invitation}
        onCreateInvitation={createMemberInvitation}
      />
      <MemberFinancialSummary member={member} debts={debts} payments={manualPayments} />
    </div>
  )
}
