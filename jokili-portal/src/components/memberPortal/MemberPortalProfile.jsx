import { getMemberStatus } from '../../logic/memberLogic.js'
import { formatDate, yearsSince } from '../../utils/formatDate.js'

const statusLabels = {
  activo: 'Activo',
  honorario: 'Honorario',
  inactivo: 'Inactivo',
}

function Detail({ label, value, fullWidth = false }) {
  return (
    <div className={`member-portal-detail${fullWidth ? ' member-portal-detail--full' : ''}`}>
      <span>{label}</span>
      <strong>{value || 'No registrado'}</strong>
    </div>
  )
}

function YearTags({ years }) {
  if (!years || years.length === 0) return <strong className="member-portal-detail-value">—</strong>
  return (
    <div className="member-portal-tags">
      {years.map((y) => <span key={y} className="member-portal-tag">{y}</span>)}
    </div>
  )
}

function DetailTags({ label, years }) {
  return (
    <div className="member-portal-detail member-portal-detail--full">
      <span>{label}</span>
      <YearTags years={years} />
    </div>
  )
}

export default function MemberPortalProfile({ member }) {
  const status = getMemberStatus(member)
  const antiguedad = yearsSince(member.fechaInscripcion)

  const direccionCompleta = [member.direccion, member.ciudad, member.municipio, member.estado]
    .filter(Boolean)
    .join(', ')

  return (
    <section className="member-portal-panel">
      {/* Encabezado */}
      <div className="member-portal-panel-header">
        <h2>Ficha del miembro</h2>
        <span className={`member-portal-status member-portal-status--${status}`}>
          {statusLabels[status] ?? status}
        </span>
      </div>

      {/* Nombre */}
      <div className="member-portal-profile-name">
        <span>{member.nombres}</span>
        <strong>{member.apellido}</strong>
      </div>

      {/* Contacto */}
      <p className="member-portal-section-label">Contacto</p>
      <div className="member-portal-details">
        <Detail label="Cédula" value={member.cedula} />
        <Detail label="Número de socio" value={member.numeroCarnet} />
        {member.email && (
          <div className="member-portal-detail member-portal-detail--full">
            <span>Email</span>
            <strong><a href={`mailto:${member.email}`} className="member-portal-link">{member.email}</a></strong>
          </div>
        )}
        {member.celular && <Detail label="Celular" value={member.celular} />}
        {member.telefonoHabitacion && <Detail label="Teléfono" value={member.telefonoHabitacion} />}
        {member.fax && <Detail label="Fax" value={member.fax} />}
        {direccionCompleta && <Detail label="Dirección" value={direccionCompleta} fullWidth />}
      </div>

      {/* Datos del club */}
      <p className="member-portal-section-label">Datos del club</p>
      <div className="member-portal-details">
        <Detail label="Ficha Nro." value={member.fichaNro} />
        <Detail label="Carnet" value={member.numeroCarnet} />
        <Detail label="Broche" value={member.numeroBroche} />
        <Detail
          label="Cargo actual"
          value={member.cargoActual
            ? `${member.cargoActual}${member.cargoDesde ? ` (desde ${formatDate(member.cargoDesde)})` : ''}`
            : null}
          fullWidth
        />
        <Detail
          label="Inscripción"
          value={member.fechaInscripcion
            ? `${formatDate(member.fechaInscripcion)} — ${antiguedad} ${antiguedad === 1 ? 'año' : 'años'} de socio`
            : null}
          fullWidth
        />
        <Detail label="Padrino" value={member.padrino || '—'} />
        <Detail label="Cuota" value={member.cuotaCancelada} />
        <Detail
          label="Bautizado"
          value={member.bautizado
            ? `Sí — ${formatDate(member.fechaBautizo)}`
            : 'No'}
        />
        <Detail
          label="Oberjokili"
          value={member.fueOberjokili ? formatDate(member.fechaOberjokili) : '—'}
        />
        <Detail
          label="Jokili Brunnen"
          value={member.bautizadoJokiliBrunnen ? String(member.anioJokiliBrunnen) : '—'}
        />
        <DetailTags label="Stadttier" years={member.fueStadttier} />
        <DetailTags label="Cigüeña" years={member.fueCiguena} />
        <DetailTags label="Noch Crop" years={member.fueNochCrop} />
      </div>

      {/* Observaciones */}
      {member.otros && (
        <div className="member-portal-notas">
          <span className="member-portal-notas-label">Observaciones</span>
          <p>{member.otros}</p>
        </div>
      )}
    </section>
  )
}
