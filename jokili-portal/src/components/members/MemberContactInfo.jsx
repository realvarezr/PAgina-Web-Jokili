import Card from '../ui/Card.jsx'

export default function MemberContactInfo({ member }) {
  const direccionCompleta = [member.direccion, member.ciudad, member.municipio, member.estado]
    .filter(Boolean)
    .join(', ')

  return (
    <Card className="member-section">
      <h2 className="section-title">Contacto</h2>
      <dl className="info-list">
        <dt>Cédula</dt>
        <dd>{member.cedula}</dd>
        {member.email && (
          <>
            <dt>Email</dt>
            <dd><a href={`mailto:${member.email}`}>{member.email}</a></dd>
          </>
        )}
        {member.celular && (
          <>
            <dt>Celular</dt>
            <dd>{member.celular}</dd>
          </>
        )}
        {member.telefonoHabitacion && (
          <>
            <dt>Teléfono</dt>
            <dd>{member.telefonoHabitacion}</dd>
          </>
        )}
        {member.fax && (
          <>
            <dt>Fax</dt>
            <dd>{member.fax}</dd>
          </>
        )}
        <dt>Dirección</dt>
        <dd>{direccionCompleta}</dd>
      </dl>
    </Card>
  )
}
