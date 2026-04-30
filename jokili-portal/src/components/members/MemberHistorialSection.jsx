export default function MemberHistorialSection({ form, onChange }) {
  return (
    <fieldset className="member-form-section">
      <legend>
        <span className="member-form-section-icon" aria-hidden="true">📜</span>
        Historial Jokili
      </legend>
      <div className="member-form-grid">
        <div className="member-form-field member-form-field--check">
          <label htmlFor="f-bautizado" className="member-form-check">
            <input id="f-bautizado" name="bautizado" type="checkbox" checked={form.bautizado} onChange={onChange} />
            Bautizado
          </label>
        </div>
        <div className="member-form-field">
          <label htmlFor="f-fechaBautizo">Fecha de bautizo</label>
          <input id="f-fechaBautizo" name="fechaBautizo" type="date" value={form.fechaBautizo} onChange={onChange} />
        </div>
        <div className="member-form-field member-form-field--check">
          <label htmlFor="f-fueOberjokili" className="member-form-check">
            <input id="f-fueOberjokili" name="fueOberjokili" type="checkbox" checked={form.fueOberjokili} onChange={onChange} />
            Oberjokili
          </label>
        </div>
        <div className="member-form-field">
          <label htmlFor="f-fechaOberjokili">Fecha Oberjokili</label>
          <input id="f-fechaOberjokili" name="fechaOberjokili" type="date" value={form.fechaOberjokili} onChange={onChange} />
        </div>
        <div className="member-form-field member-form-field--check">
          <label htmlFor="f-bautizadoJokiliBrunnen" className="member-form-check">
            <input id="f-bautizadoJokiliBrunnen" name="bautizadoJokiliBrunnen" type="checkbox" checked={form.bautizadoJokiliBrunnen} onChange={onChange} />
            Jokili Brunnen
          </label>
        </div>
        <div className="member-form-field">
          <label htmlFor="f-anioJokiliBrunnen">Año Jokili Brunnen</label>
          <input id="f-anioJokiliBrunnen" name="anioJokiliBrunnen" value={form.anioJokiliBrunnen} onChange={onChange} />
        </div>
        <div className="member-form-field">
          <label htmlFor="f-fueStadttier">Stadttier (años)</label>
          <input id="f-fueStadttier" name="fueStadttier" value={form.fueStadttier} onChange={onChange} placeholder="2004, 2008" />
        </div>
        <div className="member-form-field">
          <label htmlFor="f-fueCiguena">Cigüeña (años)</label>
          <input id="f-fueCiguena" name="fueCiguena" value={form.fueCiguena} onChange={onChange} placeholder="1990" />
        </div>
        <div className="member-form-field">
          <label htmlFor="f-fueNochCrop">Noch Crop (años)</label>
          <input id="f-fueNochCrop" name="fueNochCrop" value={form.fueNochCrop} onChange={onChange} placeholder="2011, 2020" />
        </div>
      </div>
      <div className="member-form-field member-form-field--full" style={{ marginTop: '12px' }}>
        <label htmlFor="f-otros">Observaciones</label>
        <textarea id="f-otros" name="otros" value={form.otros} onChange={onChange} rows="3" />
      </div>
    </fieldset>
  )
}
