const Section = ({ title, children, special = false }) => (
  <div style={{ border: `1px solid ${special ? "#7a5208" : "#e2e8f0"}`, borderRadius: "12px", overflow: "hidden" }}>
    <div style={{ background: special ? "#a1680012" : "#f5f7fa", borderBottom: `1px solid ${special ? "#7a5208" : "#e2e8f0"}`, padding: "12px 16px", fontSize: "11px", color: special ? "#a16800" : "#64748b", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>{title}</div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px", padding: "16px" }}>
      {children}
    </div>
  </div>
);

const Field = ({ label, error, children, wide = false, Label, CampoError }) => (
  <div style={{ gridColumn: wide ? "1 / -1" : "auto" }}>
    <Label>{label}</Label>
    {children}
    <CampoError msg={error} />
  </div>
);

export default function FormularioFichaAdmin({ form, setForm, memberErrors, setMemberErrors, Label, CampoError, inputConError }) {
  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const clearError = (key) => setMemberErrors((e) => ({ ...e, [key]: "" }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f5f7fa", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "14px 18px" }}>
        <div style={{ fontSize: "12px", color: "#334155" }}>Ficha No. <strong style={{ color: "#a16800" }}>{form.fichaNumero || "BD"}</strong></div>
        <div style={{ fontSize: "12px", color: "#64748b" }}>Estos datos apareceran en la ficha del miembro.</div>
      </div>

      <Section title="Datos de inscripcion">
        <Field label="No. de ficha" Label={Label} CampoError={CampoError}>
          <input value={form.fichaNumero || ""} onChange={(e) => set("fichaNumero", e.target.value)} placeholder="Ej: 00140" />
        </Field>
        <Field label="Fecha de inscripcion" Label={Label} CampoError={CampoError}>
          <input type="date" value={form.fechaInscripcion || form.ingreso || ""} onChange={(e) => set("fechaInscripcion", e.target.value)} />
        </Field>
        <Field label="Nombre completo" error={memberErrors.nombre} Label={Label} CampoError={CampoError} wide>
          <input value={form.nombre || ""} onChange={(e) => { set("nombre", e.target.value); clearError("nombre"); }} placeholder="Ej: Carlos Mendoza" style={inputConError(memberErrors.nombre)} />
        </Field>
        <Field label="Nombres" Label={Label} CampoError={CampoError}>
          <input value={form.nombres || ""} onChange={(e) => set("nombres", e.target.value)} placeholder="Ej: Carlos Andres" />
        </Field>
        <Field label="Apellido" Label={Label} CampoError={CampoError}>
          <input value={form.apellido || ""} onChange={(e) => set("apellido", e.target.value)} placeholder="Ej: Muttach Fehr" />
        </Field>
        <Field label="Correo" error={memberErrors.email} Label={Label} CampoError={CampoError}>
          <input type="email" value={form.email || ""} onChange={(e) => { set("email", e.target.value); clearError("email"); }} placeholder="correo@jokili.com" style={inputConError(memberErrors.email)} />
        </Field>
        <Field label="Contrasena" error={memberErrors.password} Label={Label} CampoError={CampoError}>
          <input type="password" value={form.password || ""} onChange={(e) => { set("password", e.target.value); clearError("password"); }} placeholder="Minimo 8 caracteres" style={inputConError(memberErrors.password)} />
        </Field>
        <Field label="Cedula" error={memberErrors.cedula} Label={Label} CampoError={CampoError}>
          <input value={form.cedula || ""} onChange={(e) => { set("cedula", e.target.value); clearError("cedula"); }} placeholder="V-12.345.678" style={inputConError(memberErrors.cedula)} />
        </Field>
        <Field label="Fecha de nacimiento" Label={Label} CampoError={CampoError}>
          <input type="date" value={form.fechaNacimiento || ""} onChange={(e) => set("fechaNacimiento", e.target.value)} />
        </Field>
        <Field label="Sexo" Label={Label} CampoError={CampoError}>
          <select value={form.sexo || ""} onChange={(e) => set("sexo", e.target.value)}>
            <option value="">Seleccionar...</option>
            <option>Masculino</option>
            <option>Femenino</option>
          </select>
        </Field>
        <Field label="Nombre conyuge" Label={Label} CampoError={CampoError}>
          <input value={form.conyuge || ""} onChange={(e) => set("conyuge", e.target.value)} />
        </Field>
        <Field label="Lugar de nacimiento" Label={Label} CampoError={CampoError}>
          <input value={form.lugarNacimiento || ""} onChange={(e) => set("lugarNacimiento", e.target.value)} />
        </Field>
        <Field label="Profesion u ocupacion" Label={Label} CampoError={CampoError}>
          <input value={form.profesion || ""} onChange={(e) => set("profesion", e.target.value)} />
        </Field>
      </Section>

      <Section title="Contacto y direccion">
        <Field label="Direccion de habitacion" Label={Label} CampoError={CampoError} wide>
          <input value={form.direccion || ""} onChange={(e) => set("direccion", e.target.value)} />
        </Field>
        <Field label="Estado" Label={Label} CampoError={CampoError}>
          <input value={form.estadoRegion || ""} onChange={(e) => set("estadoRegion", e.target.value)} placeholder="Aragua" />
        </Field>
        <Field label="Municipio" Label={Label} CampoError={CampoError}>
          <input value={form.municipio || ""} onChange={(e) => set("municipio", e.target.value)} placeholder="Tovar" />
        </Field>
        <Field label="Ciudad" Label={Label} CampoError={CampoError}>
          <input value={form.ciudad || ""} onChange={(e) => set("ciudad", e.target.value)} placeholder="Colonia Tovar" />
        </Field>
        <Field label="Telefono habitacion" Label={Label} CampoError={CampoError}>
          <input value={form.telefonoHabitacion || ""} onChange={(e) => set("telefonoHabitacion", e.target.value)} />
        </Field>
        <Field label="Telefono / celular" error={memberErrors.telefono} Label={Label} CampoError={CampoError}>
          <input value={form.telefono || ""} onChange={(e) => { set("telefono", e.target.value); clearError("telefono"); }} placeholder="+58 412-..." style={inputConError(memberErrors.telefono)} />
        </Field>
      </Section>

      <Section title="Datos del club">
        <Field label="No. de broche" Label={Label} CampoError={CampoError}>
          <input value={form.broche || ""} onChange={(e) => set("broche", e.target.value)} />
        </Field>
        <Field label="No. de carnet" Label={Label} CampoError={CampoError}>
          <input value={form.carnet || ""} onChange={(e) => set("carnet", e.target.value)} />
        </Field>
        <Field label="Padrino" Label={Label} CampoError={CampoError}>
          <input value={form.padrino || ""} onChange={(e) => set("padrino", e.target.value)} />
        </Field>
        <Field label="Cuota anual que cancela" Label={Label} CampoError={CampoError}>
          <input value={form.cuotaAnual || ""} onChange={(e) => set("cuotaAnual", e.target.value)} />
        </Field>
        <Field label="Cargo actual" Label={Label} CampoError={CampoError}>
          <select value={form.cargo || "Miembro"} onChange={(e) => set("cargo", e.target.value)}>
            {["Miembro", "Vocal", "Secretario/a", "Tesorero/a", "Vicepresidente/a", "Presidente/a", "Oberzunftmeister"].map((cargo) => <option key={cargo}>{cargo}</option>)}
          </select>
        </Field>
        <Field label="Fecha del cargo" Label={Label} CampoError={CampoError}>
          <input type="date" value={form.fechaCargo || ""} onChange={(e) => set("fechaCargo", e.target.value)} />
        </Field>
        <Field label="Estado del miembro" Label={Label} CampoError={CampoError}>
          <select value={form.activo ? "true" : "false"} onChange={(e) => set("activo", e.target.value === "true")}>
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </Field>
      </Section>

      <Section title="Tradiciones Jokili" special>
        <Field label="Bautizado" Label={Label} CampoError={CampoError}>
          <select value={form.bautizado || "no"} onChange={(e) => set("bautizado", e.target.value)}>
            <option value="si">Si</option>
            <option value="no">No</option>
          </select>
        </Field>
        <Field label="Fecha de bautismo" Label={Label} CampoError={CampoError}>
          <input type="date" value={form.fechaBautismo || ""} onChange={(e) => set("fechaBautismo", e.target.value)} />
        </Field>
        <Field label="Fue Oberjokili" Label={Label} CampoError={CampoError}>
          <select value={form.oberjokili || "no"} onChange={(e) => set("oberjokili", e.target.value)}>
            <option value="si">Si</option>
            <option value="no">No</option>
          </select>
        </Field>
        <Field label="Periodo como Oberjokili" Label={Label} CampoError={CampoError}>
          <input value={form.periodoOberjokili || ""} onChange={(e) => set("periodoOberjokili", e.target.value)} />
        </Field>
        <Field label="Bautizado en Jokili Brunnen" Label={Label} CampoError={CampoError}>
          <select value={form.brunnen || "no"} onChange={(e) => set("brunnen", e.target.value)}>
            <option value="si">Si</option>
            <option value="no">No</option>
          </select>
        </Field>
        <Field label="Ano Jokili Brunnen" Label={Label} CampoError={CampoError}>
          <input value={form.anioBrunnen || ""} onChange={(e) => set("anioBrunnen", e.target.value)} />
        </Field>
        <Field label="Otros" Label={Label} CampoError={CampoError} wide>
          <textarea value={form.otros || ""} onChange={(e) => set("otros", e.target.value)} rows={3} />
        </Field>
      </Section>
    </div>
  );
}
