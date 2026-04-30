import { useEffect, useState } from 'react'
import Card from '../ui/Card.jsx'
import MemberHistorialSection from './MemberHistorialSection.jsx'

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

  const cuotaActiva =
    form.cuotaCancelada === 'Si' ||
    form.cuotaCancelada === true ||
    form.cuotaCancelada === 'Exonerada por miembro de honor'

  return (
    <Card className="member-form-card">
      <form className="member-form" onSubmit={handleSubmit}>

        {/* Encabezado */}
        <div className="member-form-header">
          <div>
            <span className="member-form-kicker">Tovarer Jokili 1976</span>
            <h2>{isEditing ? 'Editar socio' : 'Nuevo socio'}</h2>
          </div>
          <button className="member-form-close" type="button" onClick={onCancel} aria-label="Cerrar formulario">✕</button>
        </div>

        <div className="member-form-bands" aria-hidden="true">
          <span className="band-yellow"></span>
          <span className="band-blue"></span>
          <span className="band-red"></span>
          <span className="band-black"></span>
          <span className="band-gold"></span>
        </div>

        {error && <p className="member-form-error" role="alert">{error}</p>}

        {/* Datos personales */}
        <fieldset className="member-form-section">
          <legend>
            <span className="member-form-section-icon" aria-hidden="true">👤</span>
            Datos personales
          </legend>
          <div className="member-form-grid">
            <div className="member-form-field">
              <label htmlFor="f-fichaNro">Ficha Nro.</label>
              <input id="f-fichaNro" name="fichaNro" value={form.fichaNro} onChange={handleChange} placeholder="A-12" />
            </div>
            <div className="member-form-field">
              <label htmlFor="f-nombres">Nombres</label>
              <input id="f-nombres" name="nombres" value={form.nombres} onChange={handleChange} placeholder="Nombres" />
            </div>
            <div className="member-form-field">
              <label htmlFor="f-apellido">Apellido</label>
              <input id="f-apellido" name="apellido" value={form.apellido} onChange={handleChange} placeholder="Apellido" />
            </div>
            <div className="member-form-field">
              <label htmlFor="f-cedula">Cédula</label>
              <input id="f-cedula" name="cedula" value={form.cedula} onChange={handleChange} placeholder="V-00.000.000" />
            </div>
            <div className="member-form-field">
              <label htmlFor="f-fechaNacimiento">Fecha de nacimiento</label>
              <input id="f-fechaNacimiento" name="fechaNacimiento" type="date" value={form.fechaNacimiento} onChange={handleChange} />
            </div>
            <div className="member-form-field">
              <label htmlFor="f-sexo">Sexo</label>
              <select id="f-sexo" name="sexo" value={form.sexo} onChange={handleChange}>
                <option value="">Seleccionar</option>
                <option value="M">M</option>
                <option value="F">F</option>
              </select>
            </div>
            <div className="member-form-field">
              <label htmlFor="f-nombreConyuge">Cónyuge</label>
              <input id="f-nombreConyuge" name="nombreConyuge" value={form.nombreConyuge} onChange={handleChange} />
            </div>
            <div className="member-form-field">
              <label htmlFor="f-lugarNacimiento">Lugar de nacimiento</label>
              <input id="f-lugarNacimiento" name="lugarNacimiento" value={form.lugarNacimiento} onChange={handleChange} />
            </div>
            <div className="member-form-field">
              <label htmlFor="f-profesion">Profesión</label>
              <input id="f-profesion" name="profesion" value={form.profesion} onChange={handleChange} />
            </div>
          </div>
        </fieldset>

        {/* Contacto */}
        <fieldset className="member-form-section">
          <legend>
            <span className="member-form-section-icon" aria-hidden="true">📞</span>
            Contacto
          </legend>
          <div className="member-form-grid">
            <div className="member-form-field member-form-field--wide">
              <label htmlFor="f-direccion">Dirección</label>
              <input id="f-direccion" name="direccion" value={form.direccion} onChange={handleChange} />
            </div>
            <div className="member-form-field">
              <label htmlFor="f-estado">Estado</label>
              <input id="f-estado" name="estado" value={form.estado} onChange={handleChange} />
            </div>
            <div className="member-form-field">
              <label htmlFor="f-municipio">Municipio</label>
              <input id="f-municipio" name="municipio" value={form.municipio} onChange={handleChange} />
            </div>
            <div className="member-form-field">
              <label htmlFor="f-ciudad">Ciudad</label>
              <input id="f-ciudad" name="ciudad" value={form.ciudad} onChange={handleChange} />
            </div>
            <div className="member-form-field">
              <label htmlFor="f-telefonoHabitacion">Teléfono habitación</label>
              <input id="f-telefonoHabitacion" name="telefonoHabitacion" value={form.telefonoHabitacion} onChange={handleChange} />
            </div>
            <div className="member-form-field">
              <label htmlFor="f-celular">Celular</label>
              <input id="f-celular" name="celular" value={form.celular} onChange={handleChange} />
            </div>
            <div className="member-form-field">
              <label htmlFor="f-fax">Fax</label>
              <input id="f-fax" name="fax" value={form.fax} onChange={handleChange} />
            </div>
            <div className="member-form-field">
              <label htmlFor="f-email">Correo electrónico</label>
              <input id="f-email" name="email" type="email" value={form.email} onChange={handleChange} />
            </div>
          </div>
        </fieldset>

        {/* Datos del club */}
        <fieldset className="member-form-section">
          <legend>
            <span className="member-form-section-icon" aria-hidden="true">🏛️</span>
            Datos del club
          </legend>
          <div className="member-form-grid">
            <div className="member-form-field">
              <label htmlFor="f-numeroBroche">Broche Nro.</label>
              <input id="f-numeroBroche" name="numeroBroche" value={form.numeroBroche} onChange={handleChange} />
            </div>
            <div className="member-form-field">
              <label htmlFor="f-numeroCarnet">Carnet Nro.</label>
              <input id="f-numeroCarnet" name="numeroCarnet" value={form.numeroCarnet} onChange={handleChange} />
            </div>
            <div className="member-form-field">
              <label htmlFor="f-fechaInscripcion">Fecha de inscripción</label>
              <input id="f-fechaInscripcion" name="fechaInscripcion" type="date" value={form.fechaInscripcion} onChange={handleChange} />
            </div>
            <div className="member-form-field">
              <label htmlFor="f-padrino">Padrino</label>
              <input id="f-padrino" name="padrino" value={form.padrino} onChange={handleChange} />
            </div>
            <div className="member-form-field">
              <label htmlFor="f-cuotaCancelada">
                Estado del miembro
                {!isEditing && (
                  <span className={`member-status-badge ${cuotaActiva ? 'member-status-badge--active' : 'member-status-badge--inactive'}`}>
                    {cuotaActiva ? 'Activo' : 'Inactivo'}
                  </span>
                )}
              </label>
              <select
                id="f-cuotaCancelada"
                name="cuotaCancelada"
                value={form.cuotaCancelada}
                onChange={handleChange}
                className={`cuota-select cuota-select--${cuotaActiva ? 'active' : 'inactive'}`}
              >
                <option value="Si">Sí — Activo</option>
                <option value="No">No — Inactivo</option>
                <option value="Exonerada por miembro de honor">Honorario / Exonerado</option>
              </select>
            </div>
            <div className="member-form-field">
              <label htmlFor="f-cargoActual">Cargo actual</label>
              <input id="f-cargoActual" name="cargoActual" value={form.cargoActual} onChange={handleChange} />
            </div>
            <div className="member-form-field">
              <label htmlFor="f-cargoDesde">Cargo desde</label>
              <input id="f-cargoDesde" name="cargoDesde" type="date" value={form.cargoDesde} onChange={handleChange} />
            </div>
          </div>
        </fieldset>

        {/* Historial Jokili */}
        <MemberHistorialSection form={form} onChange={handleChange} />

        {/* Acciones */}
        <div className="member-form-actions">
          <button className="btn btn--ghost btn--md" type="button" onClick={onCancel}>Cancelar</button>
          <button className="btn btn--primary btn--md member-form-btn-save" type="submit">
            {isEditing ? 'Guardar cambios' : 'Guardar socio'}
          </button>
        </div>

      </form>
    </Card>
  )
}
