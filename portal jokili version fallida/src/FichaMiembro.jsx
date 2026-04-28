const colors = {
  surface: "#ffffff",
  surface2: "#f5f7fa",
  border: "#e2e8f0",
  gold: "#a16800",
  goldLight: "#c8920e",
  goldDim: "#7a5208",
  text: "#0f172a",
  textDim: "#334155",
  textMuted: "#64748b",
  green: "#059669",
};

const valueOrDash = (value) => value || "-";

const calculateAge = (dateValue) => {
  if (!dateValue) return "-";
  const birth = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return "-";
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const birthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  if (today < birthday) age -= 1;
  return `${age} anos`;
};

const Field = ({ label, value, wide = false, highlight = false }) => (
  <div style={{ gridColumn: wide ? "1 / -1" : "auto", background: colors.surface2, padding: "13px 16px", border: `1px solid ${colors.border}` }}>
    <div style={{ fontSize: "9px", color: colors.textMuted, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, marginBottom: "4px" }}>{label}</div>
    <div style={{ fontSize: highlight ? "16px" : "14px", color: highlight ? colors.gold : colors.text, fontWeight: highlight ? 700 : 500 }}>{valueOrDash(value)}</div>
  </div>
);

const Section = ({ title, children, special = false }) => (
  <section style={{ border: `1px solid ${special ? colors.goldDim : colors.border}`, borderRadius: "12px", overflow: "hidden" }}>
    <div style={{ padding: "12px 16px", background: special ? `${colors.gold}12` : colors.surface2, borderBottom: `1px solid ${special ? colors.goldDim : colors.border}`, fontSize: "11px", color: special ? colors.gold : colors.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>{title}</div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1px", background: colors.border }}>
      {children}
    </div>
  </section>
);

export default function FichaMiembro({ user }) {
  const fichaNumero = user.fichaNumero || user.broche || "BD";
  const ingreso = user.fechaInscripcion || user.ingreso;
  const telefono = user.celular || user.telefono;

  return (
    <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}>
      <div style={{ padding: "18px 24px", borderBottom: `1px solid ${colors.goldDim}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "18px" }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 700, color: colors.text }}>Asociacion de Arlequines de la Colonia Tovar</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "17px", color: colors.textDim, marginTop: "2px" }}>Jokili Verein</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "9px", color: colors.textMuted, letterSpacing: "0.14em", textTransform: "uppercase" }}>Ficha No.</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", color: colors.goldLight, fontWeight: 700 }}>{fichaNumero}</div>
        </div>
      </div>

      <div style={{ padding: "28px 24px", background: `linear-gradient(135deg, ${colors.surface2}, ${colors.surface})`, borderBottom: `1px solid ${colors.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div style={{ width: "70px", height: "70px", borderRadius: "50%", background: colors.surface, border: `2px solid ${colors.goldDim}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: 700, color: colors.gold }}>J</div>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "34px", lineHeight: 1.1, fontWeight: 700, color: colors.text }}>{user.nombre}</h2>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center", marginTop: "8px" }}>
              <span style={{ color: colors.gold, fontSize: "13px", fontWeight: 700 }}>{user.cargo || "Miembro"}</span>
              <span style={{ color: colors.textMuted, fontSize: "12px" }}>Miembro desde {valueOrDash(ingreso)}</span>
              <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: "20px", background: "#ecfdf5", color: "#065f46", border: "1px solid #a7f3d0", fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{user.activo === false ? "Inactivo" : "Activo"}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
        <Section title="Datos personales">
          <Field label="Nombres" value={user.nombres || user.nombre} />
          <Field label="Apellido" value={user.apellido} />
          <Field label="Cedula de identidad" value={user.cedula} />
          <Field label="Fecha de nacimiento" value={user.fechaNacimiento} />
          <Field label="Sexo" value={user.sexo} />
          <Field label="Edad" value={calculateAge(user.fechaNacimiento)} />
          <Field label="Nombre conyuge" value={user.conyuge} />
          <Field label="Lugar de nacimiento" value={user.lugarNacimiento} />
          <Field label="Profesion u ocupacion" value={user.profesion} wide />
        </Section>

        <Section title="Contacto y direccion">
          <Field label="Direccion de habitacion" value={user.direccion} wide />
          <Field label="Estado" value={user.estadoRegion} />
          <Field label="Municipio" value={user.municipio} />
          <Field label="Ciudad" value={user.ciudad} />
          <Field label="Telefono habitacion" value={user.telefonoHabitacion} />
          <Field label="Celular" value={telefono} />
          <Field label="Correo electronico" value={user.email} />
        </Section>

        <Section title="Datos del club">
          <Field label="Numero de broche" value={user.broche} highlight />
          <Field label="Numero de carnet" value={user.carnet} />
          <Field label="Fecha de inscripcion" value={ingreso} />
          <Field label="Padrino" value={user.padrino} />
          <Field label="Cargo actual" value={user.cargo} />
          <Field label="Fecha del cargo" value={user.fechaCargo} />
          <Field label="Cuota anual que cancela" value={user.cuotaAnual} wide />
        </Section>

        <Section title="Tradiciones Jokili" special>
          <Field label="Bautizado" value={user.bautizado === "si" ? "Si" : "No"} />
          <Field label="Fecha de bautismo" value={user.fechaBautismo} />
          <Field label="Fue Oberjokili" value={user.oberjokili === "si" ? "Si" : "No"} />
          <Field label="Periodo como Oberjokili" value={user.periodoOberjokili} />
          <Field label="Bautizado en Jokili Brunnen" value={user.brunnen === "si" ? "Si" : "No"} />
          <Field label="Ano Jokili Brunnen" value={user.anioBrunnen} />
          <Field label="Otros" value={user.otros} wide />
        </Section>
      </div>
    </div>
  );
}
