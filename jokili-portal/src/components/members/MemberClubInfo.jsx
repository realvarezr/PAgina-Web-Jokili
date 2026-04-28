import Card from '../ui/Card.jsx'
import { formatDate, yearsSince } from '../../utils/formatDate.js'

function YearsTag({ years }) {
  if (!years || years.length === 0) return <span className="tag-none">—</span>
  return (
    <span className="tag-list">
      {years.map((y) => <span key={y} className="tag">{y}</span>)}
    </span>
  )
}

export default function MemberClubInfo({ member }) {
  const antiguedad = yearsSince(member.fechaInscripcion)

  return (
    <Card className="member-section">
      <h2 className="section-title">Datos del Club</h2>
      <dl className="info-list">
        <dt>Ficha Nro.</dt>
        <dd>{member.fichaNro}</dd>
        <dt>Carnet</dt>
        <dd>{member.numeroCarnet}</dd>
        <dt>Broche</dt>
        <dd>{member.numeroBroche}</dd>
        <dt>Cargo actual</dt>
        <dd>{member.cargoActual} <span className="text-muted">(desde {formatDate(member.cargoDesde)})</span></dd>
        <dt>Inscripción</dt>
        <dd>{formatDate(member.fechaInscripcion)} — {antiguedad} {antiguedad === 1 ? 'año' : 'años'} de socio</dd>
        <dt>Padrino</dt>
        <dd>{member.padrino || '—'}</dd>
        <dt>Cuota</dt>
        <dd>{member.cuotaCancelada}</dd>
        <dt>Bautizado</dt>
        <dd>{member.bautizado ? `Sí — ${formatDate(member.fechaBautizo)}` : 'No'}</dd>
        <dt>Oberjokili</dt>
        <dd>{member.fueOberjokili ? formatDate(member.fechaOberjokili) : '—'}</dd>
        <dt>Jokili Brunnen</dt>
        <dd>{member.bautizadoJokiliBrunnen ? member.anioJokiliBrunnen : '—'}</dd>
        <dt>Stadttier</dt>
        <dd><YearsTag years={member.fueStadttier} /></dd>
        <dt>Cigüeña</dt>
        <dd><YearsTag years={member.fueCiguena} /></dd>
        <dt>Noch Crop</dt>
        <dd><YearsTag years={member.fueNochCrop} /></dd>
      </dl>
      {member.otros && (
        <div className="member-notas">
          <span className="member-notas-label">Observaciones</span>
          <p>{member.otros}</p>
        </div>
      )}
    </Card>
  )
}
