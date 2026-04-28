import Card from '../ui/Card.jsx'
import Button from '../ui/Button.jsx'

function getInvitationUrl(invitation) {
  if (!invitation) return ''
  return `${window.location.origin}/activar/${invitation.token}`
}

export default function MemberAccessPanel({
  member,
  account,
  invitation,
  onCreateInvitation,
}) {
  const invitationUrl = getInvitationUrl(invitation)

  return (
    <Card className="member-access">
      <div className="member-access-header">
        <div>
          <h2>Acceso del miembro</h2>
          <p>El correo queda como referencia de la ficha y el socio puede crear su usuario.</p>
        </div>
        {!account && (
          <Button size="sm" onClick={() => onCreateInvitation(member)}>
            {invitation ? 'Reenviar invitacion' : 'Crear invitacion'}
          </Button>
        )}
      </div>

      <div className="member-access-grid">
        <div>
          <span className="member-access-label">Correo de referencia</span>
          <strong>{member.email || 'Sin correo registrado'}</strong>
        </div>
        <div>
          <span className="member-access-label">Estado</span>
          <strong>{account ? 'Cuenta activa' : invitation ? 'Invitacion pendiente' : 'Sin invitacion'}</strong>
        </div>
        {account && (
          <div>
            <span className="member-access-label">Usuario</span>
            <strong>{account.username}</strong>
          </div>
        )}
      </div>

      {!account && invitation && (
        <div className="member-access-invite">
          <span className="member-access-label">Enlace local de activacion</span>
          <input readOnly value={invitationUrl} onFocus={(event) => event.target.select()} />
          <p>Por ahora este enlace se entrega manualmente. Despues Firebase o un servicio de correo podra enviarlo.</p>
        </div>
      )}
    </Card>
  )
}
