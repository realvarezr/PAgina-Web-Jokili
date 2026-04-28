import { useEffect, useState } from 'react'
import Card from '../ui/Card.jsx'

const EMPTY_FORM = {
  fichaNro: '',
  nombres: '',
  apellido: '',
  cedula: '',
  fechaNacimiento: '',
  sexo: '',
  nombreConyuge: '',
  lugarNacimiento: '',
  profesion: '',
  direccion: '',
  estado: '',
  municipio: '',
  ciudad: '',
  telefonoHabitacion: '',
  celular: '',
  fax: '',
  email: '',
  numeroBroche: '',
  numeroCarnet: '',
  fechaInscripcion: '',
  padrino: '',
  cuotaCancelada: 'Si',
  cargoActual: '',
  cargoDesde: '',
  bautizado: false,
  fechaBautizo: '',
  fueOberjokili: false,
  fechaOberjokili: '',
  bautizadoJokiliBrunnen: false,
  anioJokiliBrunnen: '',
  fueStadttier: '',
  fueCiguena: '',
  fueNochCrop: '',
  otros: '',
}

function splitYears(value) {
  return value
    .split(',')
    .map((year) => year.trim())
    .filter(Boolean)
}

function joinYears(value) {
  return Array.isArray(value) ? value.join(', ') : value ?? ''
}

function getInitialForm(member) {
  if (!member) return EMPTY_FORM

  return {
    ...EMPTY_FORM,
    ...member,
    fueStadttier: joinYears(member.fueStadttier),
    fueCiguena: joinYears(member.fueCiguena),
    fueNochCrop: joinYears(member.fueNochCrop),
  }
}

export default function MemberForm({
  initialMember = null,
  mode = 'create',
  onAddMember,
  onCancel,
}) {
  const [form, setForm] = useState(() => getInitialForm(initialMember))
  const [error, setError] = useState('')
  const isEditing = mode === 'edit'

  useEffect(() => {
    setForm(getInitialForm(initialMember))
    setError('')
  }, [initialMember])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.nombres.trim()) return setError('El nombre es obligatorio.')
    if (!form.apellido.trim()) return setError('El apellido es obligatorio.')
    if (!form.fichaNro.trim()) return setError('La ficha Nro. es obligatoria.')
    if (!form.email.trim()) return setError('El correo electronico es obligatorio para crear el acceso del miembro.')

    setError('')
    onAddMember({
      ...form,
      nombres: form.nombres.trim(),
      apellido: form.apellido.trim(),
      fichaNro: form.fichaNro.trim(),
      email: form.email.trim(),
      fueStadttier: splitYears(form.fueStadttier),
      fueCiguena: splitYears(form.fueCiguena),
      fueNochCrop: splitYears(form.fueNochCrop),
    })
    if (!isEditing) setForm(EMPTY_FORM)
  }

  return (
    <Card className="member-form-card">
      <form className="member-form" onSubmit={handleSubmit}>
        <div className="member-form-header">
          <div>
            <span className="member-form-kicker">Tovarer Jokili 1976</span>
            <h2>{isEditing ? 'Editar socio' : 'Nuevo socio'}</h2>
          </div>
          <button className="member-form-close" type="button" onClick={onCancel} aria-label="Cerrar formulario">x</button>
        </div>
        <div className="member-form-bands" aria-hidden="true">
          <span className="band-yellow"></span>
          <span className="band-blue"></span>
          <span className="band-red"></span>
          <span className="band-black"></span>
          <span className="band-gold"></span>
        </div>
        {error && <p className="member-form-error">{error}</p>}

        <fieldset className="member-form-section">
          <legend>Datos personales</legend>
          <div className="member-form-grid">
            <label>Ficha Nro.<input name="fichaNro" value={form.fichaNro} onChange={handleChange} placeholder="A-12" /></label>
            <label>Nombres<input name="nombres" value={form.nombres} onChange={handleChange} placeholder="Nombres" /></label>
            <label>Apellido<input name="apellido" value={form.apellido} onChange={handleChange} placeholder="Apellido" /></label>
            <label>Cedula<input name="cedula" value={form.cedula} onChange={handleChange} placeholder="V-00.000.000" /></label>
            <label>Fecha nacimiento<input name="fechaNacimiento" type="date" value={form.fechaNacimiento} onChange={handleChange} /></label>
            <label>Sexo<select name="sexo" value={form.sexo} onChange={handleChange}><option value="">Seleccionar</option><option value="M">M</option><option value="F">F</option></select></label>
            <label>Conyuge<input name="nombreConyuge" value={form.nombreConyuge} onChange={handleChange} /></label>
            <label>Lugar nacimiento<input name="lugarNacimiento" value={form.lugarNacimiento} onChange={handleChange} /></label>
            <label>Profesion<input name="profesion" value={form.profesion} onChange={handleChange} /></label>
          </div>
        </fieldset>

        <fieldset className="member-form-section">
          <legend>Contacto</legend>
          <div className="member-form-grid">
            <label>Direccion<input name="direccion" value={form.direccion} onChange={handleChange} /></label>
            <label>Estado<input name="estado" value={form.estado} onChange={handleChange} /></label>
            <label>Municipio<input name="municipio" value={form.municipio} onChange={handleChange} /></label>
            <label>Ciudad<input name="ciudad" value={form.ciudad} onChange={handleChange} /></label>
            <label>Telefono habitacion<input name="telefonoHabitacion" value={form.telefonoHabitacion} onChange={handleChange} /></label>
            <label>Celular<input name="celular" value={form.celular} onChange={handleChange} /></label>
            <label>Fax<input name="fax" value={form.fax} onChange={handleChange} /></label>
            <label>Email<input name="email" type="email" value={form.email} onChange={handleChange} /></label>
          </div>
        </fieldset>

        <fieldset className="member-form-section">
          <legend>Datos del club</legend>
          <div className="member-form-grid">
            <label>Broche<input name="numeroBroche" value={form.numeroBroche} onChange={handleChange} /></label>
            <label>Carnet<input name="numeroCarnet" value={form.numeroCarnet} onChange={handleChange} /></label>
            <label>Inscripcion<input name="fechaInscripcion" type="date" value={form.fechaInscripcion} onChange={handleChange} /></label>
            <label>Padrino<input name="padrino" value={form.padrino} onChange={handleChange} /></label>
            <label>Cuota<select name="cuotaCancelada" value={form.cuotaCancelada} onChange={handleChange}><option value="Si">Si</option><option value="No">No</option><option value="Exonerada por miembro de honor">Honorario / exonerado</option></select></label>
            <label>Cargo actual<input name="cargoActual" value={form.cargoActual} onChange={handleChange} /></label>
            <label>Cargo desde<input name="cargoDesde" type="date" value={form.cargoDesde} onChange={handleChange} /></label>
          </div>
        </fieldset>

        <fieldset className="member-form-section">
          <legend>Historial Jokili</legend>
          <div className="member-form-grid">
            <label className="member-form-check"><input name="bautizado" type="checkbox" checked={form.bautizado} onChange={handleChange} /> Bautizado</label>
            <label>Fecha bautizo<input name="fechaBautizo" type="date" value={form.fechaBautizo} onChange={handleChange} /></label>
            <label className="member-form-check"><input name="fueOberjokili" type="checkbox" checked={form.fueOberjokili} onChange={handleChange} /> Oberjokili</label>
            <label>Fecha Oberjokili<input name="fechaOberjokili" type="date" value={form.fechaOberjokili} onChange={handleChange} /></label>
            <label className="member-form-check"><input name="bautizadoJokiliBrunnen" type="checkbox" checked={form.bautizadoJokiliBrunnen} onChange={handleChange} /> Jokili Brunnen</label>
            <label>Ano Jokili Brunnen<input name="anioJokiliBrunnen" value={form.anioJokiliBrunnen} onChange={handleChange} /></label>
            <label>Stadttier<input name="fueStadttier" value={form.fueStadttier} onChange={handleChange} placeholder="2004, 2008" /></label>
            <label>Ciguena<input name="fueCiguena" value={form.fueCiguena} onChange={handleChange} placeholder="1990" /></label>
            <label>Noch Crop<input name="fueNochCrop" value={form.fueNochCrop} onChange={handleChange} placeholder="2011, 2020" /></label>
          </div>
          <label className="member-form-notes">Observaciones<textarea name="otros" value={form.otros} onChange={handleChange} rows="3" /></label>
        </fieldset>

        <div className="member-form-actions">
          <button className="btn btn--ghost btn--md" type="button" onClick={onCancel}>Cancelar</button>
          <button className="btn btn--primary btn--md" type="submit">
            {isEditing ? 'Guardar cambios' : 'Guardar socio'}
          </button>
        </div>
      </form>
    </Card>
  )
}
