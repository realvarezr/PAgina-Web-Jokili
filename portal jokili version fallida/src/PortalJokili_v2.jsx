import { useState } from "react";
import {
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

// ─── Funciones de validación ──────────────────────────────────────────────
const esEmailValido = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const esCedulaValida = (v) => /^[VEve]-[\d.]{6,}$/.test(v.trim());
const esMontoValido = (v) => v !== "" && !isNaN(v) && parseFloat(v) > 0;
const esConceptoAnualValido = (v) => /\b(19|20)\d{2}\b/.test(v.trim());

// ─── Estructura vacía de ficha ────────────────────────────────────────────
const FICHA_VACIA = {
  fichaNumero: "", nombres: "", apellido: "",
  cedula: "", fechaNacimiento: "", sexo: "", conyuge: "",
  lugarNacimiento: "", profesion: "",
  direccion: "", estado: "Aragua", municipio: "Tovar", ciudad: "Colonia Tovar",
  telefonoCasa: "", celular: "", email: "", password: "",
  padrino: "", broche: "",
  carnet: "", cargo: "Miembro", fechaCargo: "", cuotaAnual: "",
  activo: true,
  bautizado: null, fechaBautismo: "",
  fueOberjokili: null, periodoOberjokili: "",
  bautizadoBrunnen: null, anioBrunnen: "",
  otros: "",
};

// ─── Datos simulados ─────────────────────────────────────────────────────
const INITIAL_USERS = [
  { id: "admin", email: "admin@jokili.com", password: "admin123", role: "admin", nombre: "Administrador" },
  {
    id: "m1", role: "member", activo: true,
    nombre: "Carlos Mendoza",
    nombres: "Carlos Alberto", apellido: "Mendoza Pérez",
    fichaNumero: "00120", email: "carlos@jokili.com", password: "carlos123",
    cedula: "V-12.345.678", fechaNacimiento: "1985-06-15", sexo: "Masculino",
    conyuge: "", lugarNacimiento: "Colonia Tovar", profesion: "Agricultor",
    direccion: "Sector El Centro", estado: "Aragua", municipio: "Tovar", ciudad: "Colonia Tovar",
    telefonoCasa: "0244-355-1234", celular: "+58 412-555-1234", telefono: "+58 412-555-1234",
    padrino: "Hans Romer", broche: "120", carnet: "120",
    cargo: "Vocal", fechaCargo: "2020-01-15", cuotaAnual: "$240",
    ingreso: "2019-03-15",
    bautizado: true, fechaBautismo: "2019-11-10",
    fueOberjokili: false, periodoOberjokili: "",
    bautizadoBrunnen: true, anioBrunnen: "2021", otros: "",
  },
  {
    id: "m2", role: "member", activo: true,
    nombre: "Ana Rodríguez",
    nombres: "Ana María", apellido: "Rodríguez Müller",
    fichaNumero: "00135", email: "ana@jokili.com", password: "ana123",
    cedula: "V-15.234.567", fechaNacimiento: "1990-03-22", sexo: "Femenino",
    conyuge: "", lugarNacimiento: "Maracay", profesion: "Comerciante",
    direccion: "Sector Los Pinos", estado: "Aragua", municipio: "Tovar", ciudad: "Colonia Tovar",
    telefonoCasa: "", celular: "+58 416-555-5678", telefono: "+58 416-555-5678",
    padrino: "Klaus Weber", broche: "135", carnet: "135",
    cargo: "Tesorera", fechaCargo: "2022-02-01", cuotaAnual: "$240",
    ingreso: "2020-07-01",
    bautizado: true, fechaBautismo: "2020-11-08",
    fueOberjokili: false, periodoOberjokili: "",
    bautizadoBrunnen: false, anioBrunnen: "", otros: "",
  },
  {
    id: "m3", role: "member", activo: true,
    nombre: "Luis Torres",
    nombres: "Luis Eduardo", apellido: "Torres García",
    fichaNumero: "00138", email: "luis@jokili.com", password: "luis123",
    cedula: "V-18.765.432", fechaNacimiento: "1992-09-05", sexo: "Masculino",
    conyuge: "", lugarNacimiento: "Caracas", profesion: "Ingeniero",
    direccion: "Sector La Colonia", estado: "Aragua", municipio: "Tovar", ciudad: "Colonia Tovar",
    telefonoCasa: "", celular: "+58 424-555-9012", telefono: "+58 424-555-9012",
    padrino: "Friedrich Benitz", broche: "138", carnet: "",
    cargo: "Miembro", fechaCargo: "", cuotaAnual: "$240",
    ingreso: "2021-01-20",
    bautizado: false, fechaBautismo: "",
    fueOberjokili: false, periodoOberjokili: "",
    bautizadoBrunnen: false, anioBrunnen: "", otros: "",
  },
];

const INITIAL_PAYMENTS = [];

const INITIAL_DEBTS = [
  { id: "d1", miembroId: "m1", concepto: "Cuota Anual 2026", monto: 240, vencimiento: "2026-01-31", estado: "vencida" },
  { id: "d2", miembroId: "m2", concepto: "Cuota Anual 2026", monto: 240, vencimiento: "2026-01-31", estado: "vencida" },
  { id: "d3", miembroId: "m3", concepto: "Cuota Anual 2026", monto: 240, vencimiento: "2026-01-31", estado: "vencida" },
];

const INITIAL_NOTIFS = [
  { id: "n1", titulo: "Reunión Mensual", mensaje: "Habrá reunión el próximo sábado 26 de abril a las 4pm.", fecha: "2025-04-20" },
  { id: "n2", titulo: "Recordatorio de Cuota Anual", mensaje: "La cuota anual 2026 vence el 31 de enero.", fecha: "2025-04-15" },
];

const C = {
  bg: "#060b16", surface: "#0c1526", surface2: "#111e33", border: "#1c2c47",
  gold: "#c8920e", goldLight: "#e8aa22", goldDim: "#7a5a08", goldGlow: "#c8920e40",
  red: "#8b1525", redBright: "#c02037", green: "#0f6b3a", greenBright: "#1fad62",
  text: "#ddd0b4", textDim: "#7a8fa8", textMuted: "#3d5070",
  errorColor: "#ff6060", errorBg: "#1c0508", errorBorder: "#4a1018",
};

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: ${C.bg}; font-family: 'DM Sans', sans-serif; color: ${C.text}; }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: ${C.surface}; }
    ::-webkit-scrollbar-thumb { background: ${C.goldDim}; border-radius: 3px; }
    input, select, textarea { background: ${C.surface2}; border: 1px solid ${C.border}; color: ${C.text}; border-radius: 8px; padding: 10px 14px; font-family: 'DM Sans', sans-serif; font-size: 13px; width: 100%; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
    input:focus, select:focus, textarea:focus { border-color: ${C.gold}; box-shadow: 0 0 0 3px ${C.goldGlow}; }
    input::placeholder, textarea::placeholder { color: ${C.textMuted}; }
    select option { background: ${C.surface2}; }
    button { cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.18s; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .fadeUp { animation: fadeUp 0.35s ease forwards; }
    .fadeIn { animation: fadeIn 0.25s ease forwards; }
  `}</style>
);

const CampoError = ({ msg }) =>
  msg ? (
    <p style={{ color: C.errorColor, fontSize: "11px", marginTop: "5px", paddingLeft: "2px" }}>⚠ {msg}</p>
  ) : null;

const inputConError = (tieneError) =>
  tieneError ? { borderColor: C.errorColor, boxShadow: `0 0 0 3px ${C.errorColor}20` } : {};

// ─── Componentes de UI ────────────────────────────────────────────────────
const Btn = ({ onClick, children, variant = "primary", small = false, disabled = false, full = false, style: s = {} }) => {
  const base = { border: "none", borderRadius: "9px", fontWeight: "500", letterSpacing: "0.02em", padding: small ? "6px 14px" : "11px 22px", fontSize: small ? "12px" : "13px", width: full ? "100%" : "auto", opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "pointer" };
  const vars = {
    primary: { background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`, color: "#050a12", boxShadow: `0 4px 18px ${C.goldGlow}` },
    danger: { background: C.red, color: "#f4c4c4", border: `1px solid ${C.redBright}40` },
    ghost: { background: "transparent", color: C.textDim, border: `1px solid ${C.border}` },
    success: { background: C.green, color: "#b4f0d0" },
  };
  return <button onClick={!disabled ? onClick : undefined} style={{ ...base, ...vars[variant], ...s }}>{children}</button>;
};

const Badge = ({ type = "neutral", children }) => {
  const t = {
    pagado: { bg: "#081d10", c: C.greenBright, b: "#0f4020" },
    pendiente: { bg: "#1c1200", c: C.goldLight, b: "#4a3000" },
    vencida: { bg: "#1c0508", c: "#ff7070", b: "#4a1018" },
    activo: { bg: "#081d10", c: C.greenBright, b: "#0f4020" },
    inactivo: { bg: "#1c0508", c: "#ff7070", b: "#4a1018" },
    neutral: { bg: C.surface2, c: C.textDim, b: C.border },
  };
  const s = t[type] || t.neutral;
  return <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: "20px", background: s.bg, color: s.c, border: `1px solid ${s.b}`, fontSize: "10px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase" }}>{children}</span>;
};

const Card = ({ children, style: s = {}, className = "" }) => (
  <div className={className} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "24px", ...s }}>{children}</div>
);

const H1 = ({ children, sub }) => (
  <div style={{ marginBottom: "24px" }}>
    <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: "600", color: C.text, lineHeight: 1.1 }}>{children}</h1>
    {sub && <p style={{ color: C.textDim, fontSize: "13px", marginTop: "4px" }}>{sub}</p>}
  </div>
);

const Label = ({ children }) => (
  <label style={{ display: "block", fontSize: "11px", color: C.textMuted, marginBottom: "6px", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: "600" }}>{children}</label>
);

const Toast = ({ msg, type }) => (
  <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 9999, background: type === "danger" ? C.red : C.green, color: "#fff", padding: "12px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: "500", boxShadow: "0 8px 32px rgba(0,0,0,0.5)", animation: "fadeUp 0.3s ease" }}>
    {type === "danger" ? "🗑️" : "✅"} {msg}
  </div>
);

const EmptyState = ({ icon, msg }) => (
  <div style={{ textAlign: "center", padding: "40px 20px", color: C.textMuted }}>
    <div style={{ fontSize: "36px", marginBottom: "10px" }}>{icon}</div>
    <p style={{ fontSize: "14px" }}>{msg}</p>
  </div>
);

// ─── Botón Sí/No para tradiciones ────────────────────────────────────────
const ToggleSiNo = ({ valor, onChange }) => {
  const base = { padding: "8px 16px", borderRadius: "7px", fontSize: "12px", fontWeight: "500", border: "1px solid", cursor: "pointer" };
  return (
    <div style={{ display: "flex", gap: "6px" }}>
      <button
        onClick={() => onChange(valor === true ? null : true)}
        style={{ ...base, background: valor === true ? "#081d10" : "transparent", color: valor === true ? C.greenBright : C.textMuted, borderColor: valor === true ? "#0f4020" : C.border }}
      >Sí</button>
      <button
        onClick={() => onChange(valor === false ? null : false)}
        style={{ ...base, background: valor === false ? "#1c0508" : "transparent", color: valor === false ? "#ff7070" : C.textMuted, borderColor: valor === false ? "#4a1018" : C.border }}
      >No</button>
    </div>
  );
};

// ─── Sección de la ficha ──────────────────────────────────────────────────
const SeccionFicha = ({ titulo, icono, badge, especial, children }) => (
  <div style={{ border: `1px solid ${especial ? C.goldDim : C.border}`, borderRadius: "14px", overflow: "hidden", marginBottom: "16px" }}>
    <div style={{ padding: "12px 18px", borderBottom: `1px solid ${especial ? C.goldDim : C.border}`, display: "flex", alignItems: "center", gap: "8px", background: especial ? "linear-gradient(90deg, #1c1200, #111e33)" : C.surface2 }}>
      <span style={{ fontSize: "14px" }}>{icono}</span>
      <span style={{ fontSize: "11px", fontWeight: "600", color: especial ? C.goldLight : C.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", flex: 1 }}>{titulo}</span>
      {badge && <span style={{ fontSize: "9px", color: badge === "requerido" ? C.gold : C.textMuted, border: `1px solid ${badge === "requerido" ? C.goldDim : C.border}`, padding: "2px 8px", borderRadius: "10px", letterSpacing: "0.06em", textTransform: "uppercase" }}>{badge === "requerido" ? "Obligatorio al ingresar" : "Se completa con el tiempo"}</span>}
    </div>
    <div style={{ background: C.surface }}>{children}</div>
  </div>
);

// ─── Fila de campos de la ficha ───────────────────────────────────────────
const FilaCampos = ({ cols = 2, children }) => (
  <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "1px", background: C.border }}>
    {children}
  </div>
);

const CampoFicha = ({ label, requerido, ancho, children }) => (
  <div style={{ background: C.surface, padding: "13px 18px", gridColumn: ancho ? "1/-1" : undefined }}>
    <label style={{ display: "block", fontSize: "9px", color: C.textMuted, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: "600", marginBottom: "6px" }}>
      {label}{requerido && <span style={{ color: C.gold, marginLeft: "2px" }}>*</span>}
    </label>
    {children}
  </div>
);

// ─── Componente principal: Formulario de Ficha ────────────────────────────
const FichaForm = ({ ficha, setFicha, errores, onGuardar, onVolver, esNueva }) => {
  const set = (campo, val) => setFicha(f => ({ ...f, [campo]: val }));

  // Calcular progreso
  const camposContables = [
    "fichaNumero","nombres","apellido","cedula","fechaNacimiento","sexo",
    "conyuge","lugarNacimiento","profesion","direccion","telefonoCasa",
    "celular","email","padrino","broche","carnet","fechaCargo","cuotaAnual","otros",
  ];
  const llenos = camposContables.filter(c => ficha[c]?.toString().trim()).length
    + (ficha.bautizado !== null ? 1 : 0)
    + (ficha.fueOberjokili !== null ? 1 : 0)
    + (ficha.bautizadoBrunnen !== null ? 1 : 0);
  const total = camposContables.length + 3;
  const pct = Math.round((llenos / total) * 100);

  const nombreCompleto = [ficha.nombres, ficha.apellido].filter(Boolean).join(" ") || "Nuevo miembro";

  return (
    <div className="fadeUp">
      {/* Encabezado */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "16px 16px 0 0", padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.goldDim}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "28px" }}>🎭</span>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", color: C.text, fontWeight: "600" }}>Asociación de Arlequines Jokili Verein</div>
            <div style={{ fontSize: "9px", color: C.gold, letterSpacing: "0.18em", textTransform: "uppercase", marginTop: "3px" }}>Ficha de Datos del Asociado</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "9px", color: C.textMuted, letterSpacing: "0.14em", textTransform: "uppercase" }}>Ficha Nº</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: "700", color: ficha.fichaNumero ? C.goldLight : C.textMuted }}>
            {ficha.fichaNumero || "—"}
          </div>
        </div>
      </div>

      {/* Hero — nombre grande */}
      <div style={{ background: "linear-gradient(160deg, #0e1a2e 0%, #070d1a 100%)", border: `1px solid ${C.border}`, borderTop: "none", padding: "24px 24px 20px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "180px", height: "180px", background: `radial-gradient(circle, ${C.goldGlow} 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", fontWeight: "700", color: ficha.nombres || ficha.apellido ? C.text : C.textMuted, lineHeight: 1.1 }}>
          {nombreCompleto}
        </div>
        <div style={{ display: "flex", gap: "12px", marginTop: "8px", alignItems: "center", flexWrap: "wrap" }}>
          {ficha.cargo && <span style={{ fontSize: "13px", color: C.goldLight }}>{ficha.cargo}</span>}
          {ficha.ingreso && <span style={{ fontSize: "12px", color: C.textMuted }}>· Desde {ficha.ingreso}</span>}
          <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: "20px", fontSize: "10px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", background: ficha.activo ? "#081d10" : "#1c0508", color: ficha.activo ? C.greenBright : "#ff7070", border: `1px solid ${ficha.activo ? "#0f4020" : "#4a1018"}` }}>
            {ficha.activo ? "Activo" : "Inactivo"}
          </span>
        </div>
      </div>

      {/* Barra de progreso */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderTop: "none", padding: "12px 24px", display: "flex", alignItems: "center", gap: "14px" }}>
        <span style={{ fontSize: "12px", color: C.textDim, whiteSpace: "nowrap", flexShrink: 0 }}>
          Completitud: <strong style={{ color: C.goldLight }}>{llenos} / {total}</strong>
        </span>
        <div style={{ flex: 1, height: "5px", background: C.surface2, borderRadius: "10px", border: `1px solid ${C.border}`, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${C.goldDim}, ${C.goldLight})`, borderRadius: "10px", transition: "width 0.3s ease" }} />
        </div>
        <span style={{ fontSize: "12px", fontWeight: "600", color: C.goldLight, minWidth: "34px", textAlign: "right" }}>{pct}%</span>
      </div>

      {/* Cuerpo del formulario */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderTop: "none", borderRadius: "0 0 16px 16px", padding: "24px" }}>

        {/* ── Sección 1: Datos de Inscripción ── */}
        <SeccionFicha titulo="Datos de Inscripción" icono="📋" badge="requerido">
          <FilaCampos cols={2}>
            <CampoFicha label="Nº de Ficha" requerido>
              <input value={ficha.fichaNumero} onChange={e => set("fichaNumero", e.target.value)} placeholder="Ej: 00140" style={inputConError(errores.fichaNumero)} />
              <CampoError msg={errores.fichaNumero} />
            </CampoFicha>
            <CampoFicha label="Fecha de Inscripción" requerido>
              <input type="date" value={ficha.ingreso || ""} onChange={e => set("ingreso", e.target.value)} style={inputConError(errores.ingreso)} />
              <CampoError msg={errores.ingreso} />
            </CampoFicha>
          </FilaCampos>
          <FilaCampos cols={2}>
            <CampoFicha label="Nombres" requerido>
              <input value={ficha.nombres} onChange={e => set("nombres", e.target.value)} placeholder="Ej: Carlos Alberto" style={inputConError(errores.nombres)} />
              <CampoError msg={errores.nombres} />
            </CampoFicha>
            <CampoFicha label="Apellido" requerido>
              <input value={ficha.apellido} onChange={e => set("apellido", e.target.value)} placeholder="Ej: Mendoza Pérez" style={inputConError(errores.apellido)} />
              <CampoError msg={errores.apellido} />
            </CampoFicha>
          </FilaCampos>
          <FilaCampos cols={2}>
            <CampoFicha label="Cédula de Identidad" requerido>
              <input value={ficha.cedula} onChange={e => set("cedula", e.target.value)} placeholder="V-12.345.678" style={inputConError(errores.cedula)} />
              <CampoError msg={errores.cedula} />
            </CampoFicha>
            <CampoFicha label="Fecha de Nacimiento">
              <input type="date" value={ficha.fechaNacimiento} onChange={e => set("fechaNacimiento", e.target.value)} />
            </CampoFicha>
          </FilaCampos>
          <FilaCampos cols={3}>
            <CampoFicha label="Sexo">
              <select value={ficha.sexo} onChange={e => set("sexo", e.target.value)}>
                <option value="">Seleccionar...</option>
                <option>Masculino</option>
                <option>Femenino</option>
              </select>
            </CampoFicha>
            <CampoFicha label="Nombre Cónyuge">
              <input value={ficha.conyuge} onChange={e => set("conyuge", e.target.value)} placeholder="Nombre completo" />
            </CampoFicha>
            <CampoFicha label="Lugar de Nacimiento">
              <input value={ficha.lugarNacimiento} onChange={e => set("lugarNacimiento", e.target.value)} placeholder="Ciudad, Estado" />
            </CampoFicha>
          </FilaCampos>
          <FilaCampos cols={1}>
            <CampoFicha label="Profesión u Ocupación">
              <input value={ficha.profesion} onChange={e => set("profesion", e.target.value)} placeholder="Ej: Comerciante" />
            </CampoFicha>
          </FilaCampos>
          <FilaCampos cols={1}>
            <CampoFicha label="Dirección de Habitación" requerido>
              <input value={ficha.direccion} onChange={e => set("direccion", e.target.value)} placeholder="Ej: Sector Los Claveles" style={inputConError(errores.direccion)} />
              <CampoError msg={errores.direccion} />
            </CampoFicha>
          </FilaCampos>
          <FilaCampos cols={3}>
            <CampoFicha label="Estado">
              <input value={ficha.estado} onChange={e => set("estado", e.target.value)} />
            </CampoFicha>
            <CampoFicha label="Municipio">
              <input value={ficha.municipio} onChange={e => set("municipio", e.target.value)} />
            </CampoFicha>
            <CampoFicha label="Ciudad">
              <input value={ficha.ciudad} onChange={e => set("ciudad", e.target.value)} />
            </CampoFicha>
          </FilaCampos>
          <FilaCampos cols={3}>
            <CampoFicha label="Teléfono Habitación">
              <input value={ficha.telefonoCasa} onChange={e => set("telefonoCasa", e.target.value)} placeholder="0244-..." />
            </CampoFicha>
            <CampoFicha label="Celular" requerido>
              <input value={ficha.celular} onChange={e => set("celular", e.target.value)} placeholder="0412-..." style={inputConError(errores.celular)} />
              <CampoError msg={errores.celular} />
            </CampoFicha>
            <CampoFicha label="Correo Electrónico" requerido>
              <input type="email" value={ficha.email} onChange={e => set("email", e.target.value)} placeholder="correo@ejemplo.com" style={inputConError(errores.email)} />
              <CampoError msg={errores.email} />
            </CampoFicha>
          </FilaCampos>
          {esNueva && (
            <FilaCampos cols={1}>
              <CampoFicha label="Contraseña del portal" requerido>
                <input type="password" value={ficha.password} onChange={e => set("password", e.target.value)} placeholder="Mínimo 8 caracteres" style={inputConError(errores.password)} />
                <CampoError msg={errores.password} />
              </CampoFicha>
            </FilaCampos>
          )}
          <FilaCampos cols={2}>
            <CampoFicha label="Padrino" requerido>
              <input value={ficha.padrino} onChange={e => set("padrino", e.target.value)} placeholder="Nombre del padrino" style={inputConError(errores.padrino)} />
              <CampoError msg={errores.padrino} />
            </CampoFicha>
            <CampoFicha label="Nº de Broche">
              <input value={ficha.broche} onChange={e => set("broche", e.target.value)} placeholder="Ej: 140" />
            </CampoFicha>
          </FilaCampos>
        </SeccionFicha>

        {/* ── Sección 2: Datos del Club ── */}
        <SeccionFicha titulo="Datos del Club" icono="🃏" badge="opcional">
          <FilaCampos cols={3}>
            <CampoFicha label="Nº de Carnet">
              <input value={ficha.carnet} onChange={e => set("carnet", e.target.value)} placeholder="—" />
            </CampoFicha>
            <CampoFicha label="Cargo Actual">
              <select value={ficha.cargo} onChange={e => set("cargo", e.target.value)}>
                {["Miembro","Vocal","Secretario/a","Tesorero/a","Vicepresidente/a","Presidente/a"].map(c => <option key={c}>{c}</option>)}
              </select>
            </CampoFicha>
            <CampoFicha label="Fecha del Cargo">
              <input type="date" value={ficha.fechaCargo} onChange={e => set("fechaCargo", e.target.value)} />
            </CampoFicha>
          </FilaCampos>
          <FilaCampos cols={2}>
            <CampoFicha label="Cuota Anual">
              <input value={ficha.cuotaAnual} onChange={e => set("cuotaAnual", e.target.value)} placeholder="Ej: $240" />
            </CampoFicha>
            <CampoFicha label="Estado del Miembro">
              <select value={ficha.activo ? "true" : "false"} onChange={e => set("activo", e.target.value === "true")}>
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </CampoFicha>
          </FilaCampos>
        </SeccionFicha>

        {/* ── Sección 3: Tradiciones Jokili ── */}
        <SeccionFicha titulo="Tradiciones Jokili" icono="⭐" badge="opcional" especial>
          <FilaCampos cols={2}>
            <CampoFicha label="Bautizado en el Club">
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <ToggleSiNo valor={ficha.bautizado} onChange={v => set("bautizado", v)} />
                {ficha.bautizado && (
                  <input type="date" value={ficha.fechaBautismo} onChange={e => set("fechaBautismo", e.target.value)} style={{ flex: 1 }} />
                )}
              </div>
            </CampoFicha>
            <CampoFicha label="Fue Oberjokili">
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <ToggleSiNo valor={ficha.fueOberjokili} onChange={v => set("fueOberjokili", v)} />
                {ficha.fueOberjokili && (
                  <input value={ficha.periodoOberjokili} onChange={e => set("periodoOberjokili", e.target.value)} placeholder="Ej: Carnaval 2013" style={{ flex: 1 }} />
                )}
              </div>
            </CampoFicha>
          </FilaCampos>
          <FilaCampos cols={2}>
            <CampoFicha label="Bautizado en Jokili Brunnen">
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <ToggleSiNo valor={ficha.bautizadoBrunnen} onChange={v => set("bautizadoBrunnen", v)} />
                {ficha.bautizadoBrunnen && (
                  <input value={ficha.anioBrunnen} onChange={e => set("anioBrunnen", e.target.value)} placeholder="Año (Ej: 2012)" style={{ flex: 1 }} />
                )}
              </div>
            </CampoFicha>
            <CampoFicha label="Otros">
              <input value={ficha.otros} onChange={e => set("otros", e.target.value)} placeholder="Notas adicionales..." />
            </CampoFicha>
          </FilaCampos>
        </SeccionFicha>

        {/* Acciones */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", paddingTop: "8px" }}>
          <Btn variant="ghost" onClick={onVolver}>← Volver a la lista</Btn>
          <Btn onClick={onGuardar}>{esNueva ? "Crear ficha" : "Guardar cambios"}</Btn>
        </div>
      </div>
    </div>
  );
};

// ─── Ficha de miembro — solo lectura ─────────────────────────────────────
const FichaVistaLectura = ({ user }) => {
  const v = (campo) => {
    const val = user[campo];
    return val !== null && val !== undefined && val !== "" ? val : null;
  };

  const CampoL = ({ label, valor, destacado }) =>
    valor ? (
      <div style={{ background: C.surface2, padding: "13px 18px" }}>
        <div style={{ fontSize: "9px", color: C.textMuted, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: "600", marginBottom: "4px" }}>{label}</div>
        <div style={{ fontSize: destacado ? "16px" : "14px", color: destacado ? C.goldLight : C.text, fontWeight: "500", fontFamily: destacado ? "'Cormorant Garamond', serif" : "inherit" }}>{valor}</div>
      </div>
    ) : null;

  const SiNoL = ({ label, valor, detalle }) =>
    valor !== null && valor !== undefined ? (
      <div style={{ background: C.surface2, padding: "13px 18px" }}>
        <div style={{ fontSize: "9px", color: C.textMuted, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: "600", marginBottom: "6px" }}>{label}</div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "500", color: valor ? C.greenBright : C.textMuted }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: valor ? C.greenBright : C.textMuted, flexShrink: 0, display: "inline-block" }} />
            {valor ? "Sí" : "No"}
          </span>
          {valor && detalle && <span style={{ fontSize: "12px", color: C.textDim }}>{detalle}</span>}
        </div>
      </div>
    ) : null;

  const Grid = ({ cols = 2, children }) => {
    const hijos = Array.isArray(children) ? children.flat().filter(Boolean) : [children].filter(Boolean);
    if (hijos.length === 0) return null;
    return (
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "1px", background: C.border }}>
        {hijos}
      </div>
    );
  };

  const SeccionL = ({ titulo, icono, especial, children }) => {
    const hijos = Array.isArray(children) ? children.flat().filter(Boolean) : [children].filter(Boolean);
    if (hijos.length === 0) return null;
    return (
      <div style={{ border: `1px solid ${especial ? C.goldDim : C.border}`, borderRadius: "14px", overflow: "hidden", marginBottom: "16px" }}>
        <div style={{ padding: "12px 18px", borderBottom: `1px solid ${especial ? C.goldDim : C.border}`, display: "flex", alignItems: "center", gap: "8px", background: especial ? "linear-gradient(90deg, #1c1200, #111e33)" : C.surface2 }}>
          <span style={{ fontSize: "14px" }}>{icono}</span>
          <span style={{ fontSize: "11px", fontWeight: "600", color: especial ? C.goldLight : C.textMuted, letterSpacing: "0.1em", textTransform: "uppercase" }}>{titulo}</span>
        </div>
        <div style={{ background: C.surface }}>{hijos}</div>
      </div>
    );
  };

  const nombreCompleto = user.nombre || [user.nombres, user.apellido].filter(Boolean).join(" ") || "—";

  return (
    <div className="fadeUp">
      {/* Encabezado */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "16px 16px 0 0", padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.goldDim}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "30px" }}>🎭</span>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", color: C.text, fontWeight: "600" }}>Asociación de Arlequines Jokili Verein</div>
            <div style={{ fontSize: "9px", color: C.gold, letterSpacing: "0.18em", textTransform: "uppercase", marginTop: "3px" }}>Ficha de Datos del Asociado</div>
          </div>
        </div>
        {v("fichaNumero") && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "9px", color: C.textMuted, letterSpacing: "0.14em", textTransform: "uppercase" }}>Ficha Nº</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: "700", color: C.goldLight }}>{user.fichaNumero}</div>
          </div>
        )}
      </div>

      {/* Hero — nombre grande */}
      <div style={{ background: "linear-gradient(160deg, #0e1a2e 0%, #070d1a 100%)", border: `1px solid ${C.border}`, borderTop: "none", padding: "28px 24px 22px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "180px", height: "180px", background: `radial-gradient(circle, ${C.goldGlow} 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "34px", fontWeight: "700", color: C.text, lineHeight: 1.1 }}>{nombreCompleto}</div>
        <div style={{ display: "flex", gap: "12px", marginTop: "8px", alignItems: "center", flexWrap: "wrap" }}>
          {v("cargo") && <span style={{ fontSize: "13px", color: C.goldLight }}>{user.cargo}</span>}
          {v("ingreso") && <span style={{ fontSize: "12px", color: C.textMuted }}>· Miembro desde {user.ingreso}</span>}
          <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: "20px", fontSize: "10px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", background: user.activo ? "#081d10" : "#1c0508", color: user.activo ? C.greenBright : "#ff7070", border: `1px solid ${user.activo ? "#0f4020" : "#4a1018"}` }}>
            {user.activo ? "Activo" : "Inactivo"}
          </span>
        </div>
      </div>

      {/* Cuerpo */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderTop: "none", borderRadius: "0 0 16px 16px", padding: "24px" }}>

        <SeccionL titulo="Datos Personales" icono="👤">
          <Grid cols={2}>
            <CampoL label="Cédula de Identidad" valor={v("cedula")} />
            <CampoL label="Fecha de Nacimiento" valor={v("fechaNacimiento")} />
            <CampoL label="Sexo" valor={v("sexo")} />
            <CampoL label="Nombre Cónyuge" valor={v("conyuge")} />
            <CampoL label="Lugar de Nacimiento" valor={v("lugarNacimiento")} />
            <CampoL label="Profesión u Ocupación" valor={v("profesion")} />
          </Grid>
        </SeccionL>

        <SeccionL titulo="Contacto y Dirección" icono="📍">
          <Grid cols={1}>
            <CampoL label="Dirección de Habitación" valor={v("direccion")} />
          </Grid>
          <Grid cols={3}>
            <CampoL label="Estado" valor={v("estado")} />
            <CampoL label="Municipio" valor={v("municipio")} />
            <CampoL label="Ciudad" valor={v("ciudad")} />
            <CampoL label="Teléfono Habitación" valor={v("telefonoCasa")} />
            <CampoL label="Celular" valor={v("celular") || v("telefono")} />
            <CampoL label="Correo Electrónico" valor={v("email")} />
          </Grid>
        </SeccionL>

        <SeccionL titulo="Datos del Club" icono="🃏">
          <Grid cols={3}>
            <CampoL label="Nº de Broche" valor={v("broche")} destacado />
            <CampoL label="Nº de Carnet" valor={v("carnet")} />
            <CampoL label="Padrino" valor={v("padrino")} />
            <CampoL label="Fecha de Inscripción" valor={v("ingreso")} />
            <CampoL label="Cargo Actual" valor={v("cargo")} />
            <CampoL label="Cuota Anual" valor={v("cuotaAnual")} />
          </Grid>
        </SeccionL>

        {(user.bautizado !== null || user.fueOberjokili !== null || user.bautizadoBrunnen !== null || v("otros")) && (
          <SeccionL titulo="Tradiciones Jokili" icono="⭐" especial>
            <Grid cols={2}>
              <SiNoL label="Bautizado en el Club" valor={user.bautizado} detalle={v("fechaBautismo")} />
              <SiNoL label="Fue Oberjokili" valor={user.fueOberjokili} detalle={v("periodoOberjokili")} />
              <SiNoL label="Bautizado en Jokili Brunnen" valor={user.bautizadoBrunnen} detalle={v("anioBrunnen") ? `Año ${user.anioBrunnen}` : null} />
              <CampoL label="Otros" valor={v("otros")} />
            </Grid>
          </SeccionL>
        )}
      </div>
    </div>
  );
};

// ─── App raíz ────────────────────────────────────────────────────────────
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState(INITIAL_USERS);
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [debts, setDebts] = useState(INITIAL_DEBTS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFS);
  const logout = () => setCurrentUser(null);
  return (
    <>
      <GlobalStyle />
      {!currentUser && <LoginPageWrapper allUsers={allUsers} onLogin={setCurrentUser} />}
      {currentUser?.role === "admin" && <AdminConsole allUsers={allUsers} setAllUsers={setAllUsers} payments={payments} setPayments={setPayments} debts={debts} setDebts={setDebts} notifications={notifications} setNotifications={setNotifications} onLogout={logout} />}
      {currentUser?.role === "member" && <MemberPortal user={currentUser} payments={payments} debts={debts} notifications={notifications} onLogout={logout} />}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════════════════════════════════
const LoginPageWrapper = ({ allUsers, onLogin }) => {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [errores, setErrores] = useState({});
  const [loginErr, setLoginErr] = useState("");
  const [loading, setLoading] = useState(false);

  const validarLogin = () => {
    const e = {};
    if (!esEmailValido(email))  e.email = "Ingresa un correo válido (ej: usuario@correo.com)";
    if (!pw.trim())             e.pw    = "La contraseña no puede estar vacía";
    return e;
  };

  const handleLogin = () => {
    const e = validarLogin();
    if (Object.keys(e).length > 0) { setErrores(e); return; }
    setErrores({});
    setLoginErr("");
    setLoading(true);
    setTimeout(() => {
      const user = allUsers.find(u => u.email === email && u.password === pw);
      if (user) { onLogin(user); }
      else { setLoginErr("Correo o contraseña incorrectos"); setLoading(false); }
    }, 700);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: `radial-gradient(ellipse at 15% 60%, #1e0a3a 0%, transparent 55%), radial-gradient(ellipse at 85% 20%, #1a0608 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, #0a1428 0%, ${C.bg} 60%)`, padding: "20px" }}>
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", opacity: 0.05 }}>
        {[...Array(10)].map((_, i) => <div key={i} style={{ position: "absolute", left: `${i * 11}%`, top: 0, bottom: 0, width: "1px", background: `linear-gradient(to bottom, transparent 0%, ${C.gold} 40%, ${C.gold} 60%, transparent 100%)` }} />)}
      </div>
      <div className="fadeUp" style={{ width: "100%", maxWidth: "400px" }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{ width: "76px", height: "76px", margin: "0 auto 16px", background: `linear-gradient(135deg, ${C.goldDim}, ${C.gold})`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "34px", boxShadow: `0 0 50px ${C.goldGlow}` }}>🎭</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "30px", color: C.text, fontWeight: "700" }}>Club Tovarerjokili</h1>
          <p style={{ color: C.textDim, fontSize: "11px", marginTop: "6px", letterSpacing: "0.18em", textTransform: "uppercase" }}>Portal de Miembros</p>
        </div>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "20px", padding: "36px", boxShadow: "0 30px 80px rgba(0,0,0,0.7)" }}>
          <div style={{ marginBottom: "18px" }}>
            <Label>Correo electrónico</Label>
            <input type="email" value={email} onChange={e => { setEmail(e.target.value); setErrores(prev => ({ ...prev, email: "" })); }} placeholder="tu@correo.com" style={inputConError(errores.email)} />
            <CampoError msg={errores.email} />
          </div>
          <div style={{ marginBottom: "26px" }}>
            <Label>Contraseña</Label>
            <input type="password" value={pw} onChange={e => { setPw(e.target.value); setErrores(prev => ({ ...prev, pw: "" })); }} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && handleLogin()} style={inputConError(errores.pw)} />
            <CampoError msg={errores.pw} />
          </div>
          {loginErr && (
            <div style={{ background: C.errorBg, border: `1px solid ${C.errorBorder}`, borderRadius: "8px", padding: "10px 14px", color: "#ff8080", fontSize: "13px", marginBottom: "18px" }}>{loginErr}</div>
          )}
          <button onClick={handleLogin} disabled={loading} style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "none", background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`, color: "#050a12", fontWeight: "600", fontSize: "14px", opacity: loading ? 0.7 : 1, boxShadow: `0 4px 20px ${C.goldGlow}` }}>
            {loading ? "Verificando..." : "Iniciar Sesión"}
          </button>
          <div style={{ marginTop: "22px", padding: "14px", background: C.surface2, borderRadius: "10px", border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: "11px", color: C.textDim, fontWeight: "600", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.07em" }}>Credenciales de prueba</div>
            {[["Admin", "admin@jokili.com", "admin123"], ["Miembro", "carlos@jokili.com", "carlos123"]].map(([rol, em, pass]) => (
              <div key={rol} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: C.textMuted, marginBottom: "4px", gap: "8px" }}>
                <span style={{ color: C.gold, flexShrink: 0 }}>{rol}</span>
                <span style={{ textAlign: "right" }}>{em} / <span style={{ color: C.textDim }}>{pass}</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// PORTAL DEL MIEMBRO
// ═══════════════════════════════════════════════════════════════════
const MemberPortal = ({ user, payments, debts, notifications, onLogout }) => {
  const [tab, setTab] = useState("perfil");
  const myPayments = payments.filter(p => p.miembroId === user.id);
  const myDebts = debts.filter(d => d.miembroId === user.id);
  const totalPaid = myPayments.reduce((s, p) => s + p.monto, 0);
  const totalOwed = myDebts.reduce((s, d) => s + d.monto, 0);
  const TABS = [
    { id: "perfil", label: "Mi Perfil", icon: "👤" },
    { id: "cuotas", label: "Cuotas Anuales", icon: "💳" },
    { id: "deudas", label: "Deudas", icon: "⚠️", badge: myDebts.length },
    { id: "avisos", label: "Avisos", icon: "📢", badge: notifications.length },
  ];
  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      <header style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "62px", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "20px" }}>🎭</span>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "15px", color: C.text, fontWeight: "600" }}>Tovarerjokili</div>
            <div style={{ fontSize: "10px", color: C.textMuted, letterSpacing: "0.08em", textTransform: "uppercase" }}>Portal de Miembros</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "13px", color: C.text, fontWeight: "500" }}>{user.nombre}</div>
            <div style={{ fontSize: "11px", color: C.textMuted }}>{user.cargo}</div>
          </div>
          <Btn variant="ghost" small onClick={onLogout}>Salir ↩</Btn>
        </div>
      </header>
      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "28px 16px" }}>
        <div className="fadeUp" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", marginBottom: "24px" }}>
          {[
            { icon: "💳", label: "Total Pagado", val: `$${totalPaid}`, color: C.greenBright },
            { icon: "⚡", label: "Deuda Pendiente", val: `$${totalOwed}`, color: totalOwed > 0 ? "#ff7070" : C.greenBright },
            { icon: "📋", label: "Cuotas Anuales Pagadas", val: myPayments.length, color: C.goldLight },
          ].map(s => (
            <Card key={s.label} style={{ padding: "18px 20px", textAlign: "center" }}>
              <div style={{ fontSize: "20px", marginBottom: "6px" }}>{s.icon}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "26px", fontWeight: "600", color: s.color }}>{s.val}</div>
              <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "2px" }}>{s.label}</div>
            </Card>
          ))}
        </div>
        <div style={{ display: "flex", gap: "2px", background: C.surface, borderRadius: "12px", padding: "4px", marginBottom: "20px", border: `1px solid ${C.border}` }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "10px 6px", borderRadius: "8px", border: "none", background: tab === t.id ? `${C.gold}1a` : "transparent", color: tab === t.id ? C.goldLight : C.textDim, fontSize: "12px", fontWeight: tab === t.id ? "600" : "400", borderBottom: tab === t.id ? `2px solid ${C.gold}` : "2px solid transparent", position: "relative" }}>
              {t.icon} {t.label}
              {t.badge > 0 && <span style={{ position: "absolute", top: "4px", right: "6px", background: C.red, color: "#fff", fontSize: "9px", borderRadius: "10px", padding: "0 5px", fontWeight: "700" }}>{t.badge}</span>}
            </button>
          ))}
        </div>
        <div key={tab} className="fadeUp">
          {tab === "perfil" && <FichaVistaLectura user={user} />}
          {tab === "cuotas" && (
            <Card>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", marginBottom: "20px", fontWeight: "600" }}>Historial de Cuotas Anuales</h2>
              {myPayments.length === 0 ? <EmptyState icon="📋" msg="Sin registros de pago aún" /> : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {myPayments.map(p => (
                    <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: C.surface2, borderRadius: "10px", border: `1px solid ${C.border}` }}>
                      <div>
                        <div style={{ fontSize: "14px", color: C.text, fontWeight: "500" }}>{p.concepto}</div>
                        <div style={{ fontSize: "12px", color: C.textMuted, marginTop: "2px" }}>{p.fecha}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ color: C.goldLight, fontWeight: "700", fontSize: "16px" }}>${p.monto}</span>
                        <Badge type="pagado">Pagado</Badge>
                      </div>
                    </div>
                  ))}
                  <div style={{ padding: "12px 16px", display: "flex", justifyContent: "flex-end" }}>
                    <span style={{ fontSize: "13px", color: C.textDim }}>Total: <strong style={{ color: C.greenBright }}>${totalPaid}</strong></span>
                  </div>
                </div>
              )}
            </Card>
          )}
          {tab === "deudas" && (
            <Card>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", marginBottom: "20px", fontWeight: "600" }}>Mis Deudas</h2>
              {myDebts.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>🎉</div>
                  <p style={{ color: C.greenBright, fontWeight: "600", fontSize: "15px" }}>¡Estás al día! Sin deudas pendientes.</p>
                </div>
              ) : (
                <>
                  <div style={{ background: "#1c0508", border: "1px solid #4a1018", borderRadius: "10px", padding: "14px 18px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#ff9090", fontSize: "14px" }}>⚠️ Total adeudado</span>
                    <span style={{ color: "#ff7070", fontWeight: "700", fontSize: "20px" }}>${totalOwed}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {myDebts.map(d => (
                      <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: C.surface2, borderRadius: "10px", border: `1px solid ${d.estado === "vencida" ? "#4a1018" : C.border}` }}>
                        <div>
                          <div style={{ fontSize: "14px", color: C.text, fontWeight: "500" }}>{d.concepto}</div>
                          <div style={{ fontSize: "12px", color: C.textMuted, marginTop: "2px" }}>Vence: {d.vencimiento}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <span style={{ color: "#ff8080", fontWeight: "700", fontSize: "16px" }}>${d.monto}</span>
                          <Badge type={d.estado}>{d.estado}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Card>
          )}
          {tab === "avisos" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {notifications.length === 0 ? <Card><EmptyState icon="📢" msg="Sin avisos por ahora" /></Card> : notifications.map(n => (
                <Card key={n.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                    <h3 style={{ color: C.goldLight, fontWeight: "600", fontSize: "15px" }}>📢 {n.titulo}</h3>
                    <span style={{ fontSize: "11px", color: C.textMuted }}>{n.fecha}</span>
                  </div>
                  <p style={{ color: C.textDim, fontSize: "14px", lineHeight: "1.65" }}>{n.mensaje}</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// CONSOLA DE ADMINISTRACIÓN
// ═══════════════════════════════════════════════════════════════════
const AdminConsole = ({ allUsers, setAllUsers, payments, setPayments, debts, setDebts, notifications, setNotifications, onLogout }) => {
  const [tab, setTab] = useState("dashboard");

  // ── Estado de la ficha (reemplaza modal anterior) ─────────────────
  const [fichaVista, setFichaVista] = useState(null);   // null | "nueva" | "editar"
  const [fichaTarget, setFichaTarget] = useState(null); // miembro siendo editado
  const [fichaForm, setFichaForm] = useState(FICHA_VACIA);
  const [fichaErrors, setFichaErrors] = useState({});

  const [payForm, setPayForm] = useState({ miembroId: "", concepto: "", monto: "", fecha: new Date().toISOString().split("T")[0], tipo: "pago" });
  const [notifForm, setNotifForm] = useState({ titulo: "", mensaje: "" });
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showDebtors, setShowDebtors] = useState(false);
  const [payErrors, setPayErrors] = useState({});

  const members = allUsers.filter(u => u.role === "member");
  const fireToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };
  const totalRec = payments.reduce((s, p) => s + p.monto, 0);
  const totalDeuda = debts.reduce((s, d) => s + d.monto, 0);
  const activeMembersCount = members.filter(m => m.activo).length;
  const inactiveMembersCount = members.filter(m => !m.activo).length;
  const debtorsList = members.map(m => ({
    ...m,
    deudaTotal: debts.filter(d => d.miembroId === m.id).reduce((s, d) => s + d.monto, 0),
  })).filter(m => m.deudaTotal > 0).sort((a, b) => b.deudaTotal - a.deudaTotal);
  const deudoresCount = debtorsList.length;
  const pieData = [{ name: "Recaudado", value: totalRec }, { name: "Por cobrar", value: totalDeuda }];

  // ── Abrir ficha nueva ─────────────────────────────────────────────
  const abrirFichaNueva = () => {
    setFichaTarget(null);
    setFichaForm({ ...FICHA_VACIA });
    setFichaErrors({});
    setFichaVista("nueva");
  };

  // ── Abrir ficha para editar ───────────────────────────────────────
  const abrirFichaEditar = (m) => {
    setFichaTarget(m);
    setFichaForm({
      fichaNumero:      m.fichaNumero      || "",
      nombres:          m.nombres          || m.nombre || "",
      apellido:         m.apellido         || "",
      cedula:           m.cedula           || "",
      fechaNacimiento:  m.fechaNacimiento  || "",
      sexo:             m.sexo             || "",
      conyuge:          m.conyuge          || "",
      lugarNacimiento:  m.lugarNacimiento  || "",
      profesion:        m.profesion        || "",
      direccion:        m.direccion        || "",
      estado:           m.estado           || "Aragua",
      municipio:        m.municipio        || "Tovar",
      ciudad:           m.ciudad           || "Colonia Tovar",
      telefonoCasa:     m.telefonoCasa     || "",
      celular:          m.celular          || m.telefono || "",
      email:            m.email            || "",
      password:         m.password         || "",
      padrino:          m.padrino          || "",
      broche:           m.broche           || "",
      carnet:           m.carnet           || "",
      cargo:            m.cargo            || "Miembro",
      fechaCargo:       m.fechaCargo       || "",
      cuotaAnual:       m.cuotaAnual       || "",
      activo:           m.activo           ?? true,
      ingreso:          m.ingreso          || "",
      bautizado:        m.bautizado        ?? null,
      fechaBautismo:    m.fechaBautismo    || "",
      fueOberjokili:    m.fueOberjokili    ?? null,
      periodoOberjokili:m.periodoOberjokili|| "",
      bautizadoBrunnen: m.bautizadoBrunnen ?? null,
      anioBrunnen:      m.anioBrunnen      || "",
      otros:            m.otros            || "",
    });
    setFichaErrors({});
    setFichaVista("editar");
  };

  // ── Validar ficha ─────────────────────────────────────────────────
  const validarFicha = () => {
    const e = {};
    if (!fichaForm.fichaNumero.trim())       e.fichaNumero = "El número de ficha es obligatorio";
    if (!fichaForm.nombres.trim())           e.nombres     = "Los nombres son obligatorios";
    if (!fichaForm.apellido.trim())          e.apellido    = "El apellido es obligatorio";
    if (!esEmailValido(fichaForm.email))     e.email       = "Ingresa un correo válido";
    if (fichaVista === "nueva" && fichaForm.password.length < 8)
                                             e.password    = "La contraseña debe tener mínimo 8 caracteres";
    if (!fichaForm.celular.trim())           e.celular     = "El celular no puede estar vacío";
    if (!fichaForm.direccion.trim())         e.direccion   = "La dirección es obligatoria";
    if (!fichaForm.padrino.trim())           e.padrino     = "El padrino es obligatorio";
    if (fichaForm.cedula && !esCedulaValida(fichaForm.cedula))
                                             e.cedula      = "Formato venezolano: V-12.345.678 o E-12.345.678";
    return e;
  };

  // ── Guardar ficha ─────────────────────────────────────────────────
  const guardarFicha = () => {
    const e = validarFicha();
    if (Object.keys(e).length > 0) { setFichaErrors(e); return; }
    setFichaErrors({});
    const nombreCompleto = `${fichaForm.nombres.trim()} ${fichaForm.apellido.trim()}`.trim();
    if (fichaVista === "nueva") {
      setAllUsers(prev => [...prev, {
        ...fichaForm,
        id: "m" + Date.now(),
        role: "member",
        nombre: nombreCompleto,
        telefono: fichaForm.celular,
      }]);
      fireToast(`Ficha de ${nombreCompleto} creada`);
    } else {
      setAllUsers(prev => prev.map(u => u.id === fichaTarget.id
        ? { ...u, ...fichaForm, nombre: nombreCompleto, telefono: fichaForm.celular }
        : u
      ));
      fireToast("Ficha actualizada");
    }
    setFichaVista(null);
  };

  const volverALista = () => { setFichaVista(null); setFichaErrors({}); };

  // ── Eliminar miembro ──────────────────────────────────────────────
  const requestDeleteMember = (member) => {
    const pagosCount = payments.filter(p => p.miembroId === member.id).length;
    const deudasCount = debts.filter(d => d.miembroId === member.id).length;
    setConfirmDelete({ member, pagosCount, deudasCount });
  };

  const deleteMember = (id) => {
    const member = members.find(m => m.id === id);
    if (member) requestDeleteMember(member);
  };

  const cancelDeleteMember = () => setConfirmDelete(null);

  const confirmDeleteMember = () => {
    if (!confirmDelete) return;
    const memberId = confirmDelete.member.id;
    setAllUsers(prev => prev.filter(u => u.id !== memberId));
    setPayments(prev => prev.filter(p => p.miembroId !== memberId));
    setDebts(prev => prev.filter(d => d.miembroId !== memberId));
    setConfirmDelete(null);
    fireToast("Miembro eliminado", "danger");
  };

  // ── Pagos/Deudas ──────────────────────────────────────────────────
  const validarPago = () => {
    const e = {};
    if (!payForm.miembroId)               e.miembroId = "Debes seleccionar un miembro";
    if (!payForm.concepto.trim())         e.concepto  = "El concepto no puede estar vacío";
    else if (!esConceptoAnualValido(payForm.concepto)) e.concepto = "Incluye el año, ej: Cuota Anual 2026";
    if (!esMontoValido(payForm.monto))    e.monto     = "Ingresa un monto válido mayor a cero";
    if (!payForm.fecha)                   e.fecha     = "La fecha no puede estar vacía";
    return e;
  };

  const registerPayment = () => {
    const e = validarPago();
    if (Object.keys(e).length > 0) { setPayErrors(e); return; }
    setPayErrors({});
    if (payForm.tipo === "pago") {
      setPayments(prev => [...prev, { id: "p" + Date.now(), miembroId: payForm.miembroId, concepto: payForm.concepto, monto: Number(payForm.monto), fecha: payForm.fecha, estado: "pagado" }]);
      fireToast("Pago registrado");
    } else {
      setDebts(prev => [...prev, { id: "d" + Date.now(), miembroId: payForm.miembroId, concepto: payForm.concepto, monto: Number(payForm.monto), vencimiento: payForm.fecha, estado: "pendiente" }]);
      fireToast("Deuda registrada");
    }
    setPayForm({ miembroId: "", concepto: "", monto: "", fecha: new Date().toISOString().split("T")[0], tipo: "pago" });
  };

  const sendNotif = () => {
    if (!notifForm.titulo || !notifForm.mensaje) return;
    setNotifications(prev => [{ id: "n" + Date.now(), ...notifForm, fecha: new Date().toISOString().split("T")[0] }, ...prev]);
    setNotifForm({ titulo: "", mensaje: "" });
    fireToast("Aviso publicado");
  };

  const SIDEBAR_ITEMS = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "miembros",  icon: "👥", label: "Miembros" },
    { id: "pagos",     icon: "💰", label: "Pagos Anuales" },
    { id: "avisos",    icon: "📢", label: "Avisos" },
    { id: "reportes",  icon: "📈", label: "Reportes" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg }}>
      <aside style={{ width: "230px", minHeight: "100vh", background: C.surface, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: "26px", marginBottom: "10px" }}>🎭</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", color: C.text, fontWeight: "600" }}>Tovarerjokili</div>
          <div style={{ fontSize: "9px", color: C.gold, letterSpacing: "0.2em", textTransform: "uppercase", marginTop: "4px" }}>Consola de Administración</div>
        </div>
        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {SIDEBAR_ITEMS.map(item => (
            <button key={item.id} onClick={() => { setTab(item.id); setFichaVista(null); }} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "11px 14px", borderRadius: "10px", border: "none", background: tab === item.id ? `${C.gold}18` : "transparent", color: tab === item.id ? C.goldLight : C.textDim, fontSize: "13px", fontWeight: tab === item.id ? "600" : "400", marginBottom: "2px", textAlign: "left", borderLeft: tab === item.id ? `3px solid ${C.gold}` : "3px solid transparent" }}>
              <span style={{ fontSize: "15px" }}>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "16px" }}>
          <button onClick={onLogout} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "transparent", border: `1px solid ${C.border}`, color: C.textMuted, fontSize: "12px" }}>← Cerrar sesión</button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: "30px 28px", overflow: "auto" }}>
        {toast && <Toast msg={toast.msg} type={toast.type} />}

        {/* ── DASHBOARD ── */}
        {tab === "dashboard" && (
          <div className="fadeUp">
            <H1 sub="Resumen general del club">Dashboard</H1>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginBottom: "24px" }}>
              {[
                { icon: "A", label: "Miembros Activos",   val: activeMembersCount,   color: C.gold },
                { icon: "I", label: "Miembros Inactivos", val: inactiveMembersCount, color: "#ff7070" },
                { icon: "$", label: "Total Recaudado",    val: `$${totalRec}`,        color: C.greenBright },
                { icon: "!", label: "Total Adeudado",     val: `$${totalDeuda}`,      color: "#ff7070" },
                { icon: "D", label: "Miembros c/ Deuda",  val: deudoresCount,         color: C.goldLight, clickable: true },
              ].map(s => (
                <Card key={s.label} style={{ padding: "20px", cursor: s.clickable ? "pointer" : "default", outline: s.clickable && showDebtors ? `1px solid ${C.gold}` : "none", boxShadow: s.clickable && showDebtors ? `0 0 0 3px ${C.goldGlow}` : "none" }}>
                  <div onClick={s.clickable ? () => setShowDebtors(v => !v) : undefined} style={{ margin: "-20px", padding: "20px" }}>
                    <div style={{ fontSize: "24px", marginBottom: "8px" }}>{s.icon}</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "26px", fontWeight: "700", color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "4px" }}>{s.label}{s.clickable ? " — Ver lista" : ""}</div>
                  </div>
                </Card>
              ))}
            </div>
            {showDebtors && (
              <Card style={{ padding: 0, overflow: "hidden", marginBottom: "16px" }}>
                <div style={{ padding: "18px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "13px", color: C.textDim, fontWeight: "600" }}>Miembros con deuda</div>
                    <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "3px" }}>{deudoresCount} miembros con saldo pendiente</div>
                  </div>
                  <Btn variant="ghost" small onClick={() => setShowDebtors(false)}>Cerrar</Btn>
                </div>
                {debtorsList.length === 0 ? (
                  <div style={{ padding: "18px 20px", color: C.greenBright, fontSize: "13px" }}>No hay miembros con deuda registrada.</div>
                ) : (
                  <div>
                    {debtorsList.map((m, i) => (
                      <div key={m.id} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "12px", padding: "14px 20px", borderTop: i === 0 ? "none" : `1px solid ${C.border}`, alignItems: "center" }}>
                        <div>
                          <div style={{ color: C.text, fontWeight: "600", fontSize: "13px" }}>{m.nombre}</div>
                          <div style={{ color: C.textMuted, fontSize: "11px", marginTop: "3px" }}>{m.email}</div>
                        </div>
                        <div style={{ color: "#ff7070", fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: "700" }}>${m.deudaTotal}</div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}
            <div style={{ maxWidth: "520px" }}>
              <Card>
                <div style={{ fontSize: "13px", color: C.textDim, marginBottom: "16px", fontWeight: "600" }}>Estado Financiero</div>
                <ResponsiveContainer width="100%" height={210}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} dataKey="value" paddingAngle={4}>
                      {pieData.map((_, i) => <Cell key={i} fill={[C.greenBright, "#c03050"][i]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: "8px", color: C.text, fontSize: "12px" }} />
                    <Legend wrapperStyle={{ color: C.textDim, fontSize: "12px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </div>
        )}

        {/* ── MIEMBROS ── */}
        {tab === "miembros" && (
          fichaVista ? (
            <FichaForm
              ficha={fichaForm}
              setFicha={setFichaForm}
              errores={fichaErrors}
              onGuardar={guardarFicha}
              onVolver={volverALista}
              esNueva={fichaVista === "nueva"}
            />
          ) : (
            <div className="fadeUp">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                <H1 sub={`${members.length} miembros registrados`}>Gestión de Miembros</H1>
                <Btn onClick={abrirFichaNueva}>+ Agregar Miembro</Btn>
              </div>
              <Card style={{ padding: 0, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: C.surface2, borderBottom: `1px solid ${C.border}` }}>
                      {["Ficha Nº", "Nombre", "Cédula", "Cargo", "Broche", "Estado", "Acciones"].map(h => (
                        <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "10px", color: C.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: "600" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((m, i) => (
                      <tr key={m.id} style={{ borderBottom: `1px solid ${C.border}40`, background: i % 2 ? `${C.surface2}50` : "transparent" }}>
                        <td style={{ padding: "13px 16px", fontSize: "12px", color: C.goldLight, fontWeight: "700" }}>{m.fichaNumero || "—"}</td>
                        <td style={{ padding: "13px 16px", fontSize: "14px", color: C.text, fontWeight: "500" }}>{m.nombre}</td>
                        <td style={{ padding: "13px 16px", fontSize: "12px", color: C.textDim }}>{m.cedula || "—"}</td>
                        <td style={{ padding: "13px 16px", fontSize: "12px", color: C.textDim }}>{m.cargo}</td>
                        <td style={{ padding: "13px 16px", fontSize: "12px", color: C.textDim }}>{m.broche || "—"}</td>
                        <td style={{ padding: "13px 16px" }}><Badge type={m.activo ? "activo" : "inactivo"}>{m.activo ? "Activo" : "Inactivo"}</Badge></td>
                        <td style={{ padding: "13px 16px" }}>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <Btn small variant="ghost" onClick={() => abrirFichaEditar(m)}>✏️ Ficha</Btn>
                            <Btn small variant="danger" onClick={() => deleteMember(m.id)}>🗑️</Btn>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          )
        )}

        {/* ── PAGOS Y DEUDAS ── */}
        {tab === "pagos" && (
          <div className="fadeUp">
            <H1 sub="Registra cuotas anuales pagadas y deudas pendientes">Pagos Anuales y Deudas</H1>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <Card>
                <div style={{ fontSize: "14px", color: C.goldLight, fontWeight: "600", marginBottom: "18px" }}>Registrar</div>
                <div style={{ display: "flex", gap: "8px", marginBottom: "18px" }}>
                  {[["pago", "✅ Cuota Anual Pagada"], ["deuda", "⚠️ Nueva Deuda Anual"]].map(([val, lbl]) => (
                    <button key={val} onClick={() => { setPayForm(f => ({ ...f, tipo: val })); setPayErrors({}); }} style={{ flex: 1, padding: "10px", borderRadius: "8px", border: `1px solid ${payForm.tipo === val ? C.gold : C.border}`, background: payForm.tipo === val ? `${C.gold}18` : "transparent", color: payForm.tipo === val ? C.goldLight : C.textDim, fontSize: "12px", fontWeight: "500" }}>{lbl}</button>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <Label>Miembro</Label>
                    <select value={payForm.miembroId} onChange={e => { setPayForm(f => ({ ...f, miembroId: e.target.value })); setPayErrors(p => ({ ...p, miembroId: "" })); }} style={inputConError(payErrors.miembroId)}>
                      <option value="">Seleccionar miembro...</option>
                      {members.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                    </select>
                    <CampoError msg={payErrors.miembroId} />
                  </div>
                  <div>
                    <Label>Concepto</Label>
                    <input value={payForm.concepto} onChange={e => { setPayForm(f => ({ ...f, concepto: e.target.value })); setPayErrors(p => ({ ...p, concepto: "" })); }} placeholder="Ej: Cuota Anual 2026" style={inputConError(payErrors.concepto)} />
                    <CampoError msg={payErrors.concepto} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div>
                      <Label>Monto ($)</Label>
                      <input type="number" value={payForm.monto} onChange={e => { setPayForm(f => ({ ...f, monto: e.target.value })); setPayErrors(p => ({ ...p, monto: "" })); }} placeholder="240" style={inputConError(payErrors.monto)} />
                      <CampoError msg={payErrors.monto} />
                    </div>
                    <div>
                      <Label>{payForm.tipo === "pago" ? "Fecha de pago" : "Vencimiento anual"}</Label>
                      <input type="date" value={payForm.fecha} onChange={e => { setPayForm(f => ({ ...f, fecha: e.target.value })); setPayErrors(p => ({ ...p, fecha: "" })); }} style={inputConError(payErrors.fecha)} />
                      <CampoError msg={payErrors.fecha} />
                    </div>
                  </div>
                  <Btn onClick={registerPayment}>Registrar {payForm.tipo === "pago" ? "Cuota Anual" : "Deuda Anual"}</Btn>
                </div>
              </Card>
              <Card>
                <div style={{ fontSize: "14px", color: C.goldLight, fontWeight: "600", marginBottom: "16px" }}>Últimos Registros</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "400px", overflowY: "auto" }}>
                  {[...payments.map(p => ({ ...p, _k: "pago" })), ...debts.map(d => ({ ...d, fecha: d.vencimiento, _k: "deuda" }))].sort((a, b) => b.fecha?.localeCompare(a.fecha || "") || 0).map(item => {
                    const m = members.find(mb => mb.id === item.miembroId);
                    return (
                      <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: C.surface2, borderRadius: "8px", border: `1px solid ${C.border}` }}>
                        <div>
                          <div style={{ fontSize: "12px", color: C.text }}>{item.concepto}</div>
                          <div style={{ fontSize: "11px", color: C.textMuted }}>{m?.nombre?.split(" ")[0] || "—"} · {item.fecha}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "13px", fontWeight: "700", color: item._k === "pago" ? C.greenBright : "#ff7070" }}>${item.monto}</div>
                          <Badge type={item.estado}>{item.estado}</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ── AVISOS ── */}
        {tab === "avisos" && (
          <div className="fadeUp">
            <H1 sub="Comunica noticias a todos los miembros">Avisos y Notificaciones</H1>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <Card>
                <div style={{ fontSize: "14px", color: C.goldLight, fontWeight: "600", marginBottom: "18px" }}>Nuevo Aviso</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div><Label>Título</Label><input value={notifForm.titulo} onChange={e => setNotifForm(f => ({ ...f, titulo: e.target.value }))} placeholder="Ej: Reunión del mes" /></div>
                  <div><Label>Mensaje</Label><textarea value={notifForm.mensaje} onChange={e => setNotifForm(f => ({ ...f, mensaje: e.target.value }))} placeholder="Escribe el aviso..." style={{ minHeight: "110px", resize: "vertical" }} /></div>
                  <div style={{ padding: "10px 14px", background: C.surface2, borderRadius: "8px", fontSize: "12px", color: C.textDim, border: `1px solid ${C.border}` }}>📢 Visible para <strong style={{ color: C.text }}>todos los miembros activos</strong></div>
                  <Btn onClick={sendNotif}>Publicar Aviso</Btn>
                </div>
              </Card>
              <Card>
                <div style={{ fontSize: "14px", color: C.goldLight, fontWeight: "600", marginBottom: "16px" }}>Historial de Avisos</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "400px", overflowY: "auto" }}>
                  {notifications.length === 0 ? <EmptyState icon="📢" msg="Sin avisos publicados" /> : notifications.map(n => (
                    <div key={n.id} style={{ padding: "14px", background: C.surface2, borderRadius: "10px", border: `1px solid ${C.border}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: C.goldLight, fontWeight: "600", fontSize: "13px" }}>📢 {n.titulo}</span>
                        <span style={{ fontSize: "11px", color: C.textMuted }}>{n.fecha}</span>
                      </div>
                      <p style={{ color: C.textDim, fontSize: "12px", lineHeight: "1.55" }}>{n.mensaje}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ── REPORTES ── */}
        {tab === "reportes" && (
          <div className="fadeUp">
            <H1 sub="Estado de cuentas y resumen por miembro">Reportes</H1>
            <Card style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "18px 20px", borderBottom: `1px solid ${C.border}`, fontSize: "13px", color: C.textDim, fontWeight: "600" }}>Estado de cuenta por miembro</div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: C.surface2, borderBottom: `1px solid ${C.border}` }}>
                    {["Miembro", "Cuotas Anuales Pagadas", "Total Pagado", "Nº Deudas Anuales", "Total Adeudado", "Estado"].map(h => (
                      <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontSize: "10px", color: C.textMuted, letterSpacing: "0.09em", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {members.map((m, i) => {
                    const mPays = payments.filter(p => p.miembroId === m.id);
                    const mDebts = debts.filter(d => d.miembroId === m.id);
                    const paid = mPays.reduce((s, p) => s + p.monto, 0);
                    const owed = mDebts.reduce((s, d) => s + d.monto, 0);
                    return (
                      <tr key={m.id} style={{ borderBottom: `1px solid ${C.border}40`, background: i % 2 ? `${C.surface2}50` : "transparent" }}>
                        <td style={{ padding: "13px 14px", fontSize: "14px", color: C.text, fontWeight: "500" }}>{m.nombre}</td>
                        <td style={{ padding: "13px 14px", fontSize: "13px", color: C.textDim }}>{mPays.length}</td>
                        <td style={{ padding: "13px 14px", fontSize: "13px", color: C.greenBright, fontWeight: "600" }}>${paid}</td>
                        <td style={{ padding: "13px 14px", fontSize: "13px", color: C.textDim }}>{mDebts.length}</td>
                        <td style={{ padding: "13px 14px", fontSize: "13px", color: owed > 0 ? "#ff8080" : C.textDim, fontWeight: owed > 0 ? "700" : "400" }}>${owed}</td>
                        <td style={{ padding: "13px 14px" }}><Badge type={owed === 0 ? "pagado" : "vencida"}>{owed === 0 ? "Al día" : "Con deuda"}</Badge></td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ borderTop: `2px solid ${C.border}`, background: `${C.gold}10` }}>
                    <td style={{ padding: "13px 14px", fontSize: "13px", color: C.goldLight, fontWeight: "700" }}>TOTAL</td>
                    <td style={{ padding: "13px 14px", fontSize: "13px", color: C.textDim }}>{payments.length}</td>
                    <td style={{ padding: "13px 14px", fontSize: "13px", color: C.greenBright, fontWeight: "700" }}>${totalRec}</td>
                    <td style={{ padding: "13px 14px", fontSize: "13px", color: C.textDim }}>{debts.length}</td>
                    <td style={{ padding: "13px 14px", fontSize: "13px", color: "#ff7070", fontWeight: "700" }}>${totalDeuda}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </Card>
          </div>
        )}
      </main>

      {/* ── MODAL: Confirmar eliminación ── */}
      {confirmDelete && (
        <div className="fadeIn" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.78)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 250 }} onClick={(e) => e.target === e.currentTarget && cancelDeleteMember()}>
          <div className="fadeUp" style={{ background: C.surface, border: `1px solid ${C.errorBorder}`, borderRadius: "18px", padding: "28px", width: "440px", maxWidth: "92vw", boxShadow: "0 30px 80px rgba(0,0,0,0.72)" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: C.errorBg, border: `1px solid ${C.errorBorder}`, color: C.errorColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", marginBottom: "16px" }}>!</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "23px", marginBottom: "8px", fontWeight: "600", color: C.text }}>Confirmar eliminación</h2>
            <p style={{ color: C.textDim, fontSize: "13px", lineHeight: "1.55", marginBottom: "14px" }}>
              Vas a eliminar a <strong style={{ color: C.text }}>{confirmDelete.member.nombre}</strong>. Esta acción también quitará sus registros asociados.
            </p>
            <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "12px 14px", marginBottom: "22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: C.textDim, fontSize: "12px", marginBottom: "6px" }}>
                <span>Pagos asociados</span><strong style={{ color: C.greenBright }}>{confirmDelete.pagosCount}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: C.textDim, fontSize: "12px" }}>
                <span>Deudas asociadas</span><strong style={{ color: "#ff7070" }}>{confirmDelete.deudasCount}</strong>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <Btn variant="ghost" onClick={cancelDeleteMember}>Cancelar</Btn>
              <Btn variant="danger" onClick={confirmDeleteMember}>Sí, eliminar</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
