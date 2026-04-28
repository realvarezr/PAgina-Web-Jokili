import { useState } from "react";
import {
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

// """""""""""""""""""""""""""""""""""""""""""
// VALIDACIONES AGREGADAS EN:
//   1. Login (email vlido + contrasea no vaca)
//   2. Modal de miembro (nombre, email, contrasea 08, telfono, cdula)
//   3. Formulario de pagos (miembro, concepto, monto >0, fecha)
// """""""""""""""""""""""""""""""""""""""""""

// === Funciones de validacion ===
const esEmailValido = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const esCedulaValida = (v) => /^[VEve]-[\d.]{6,}$/.test(v.trim());
const esMontoValido = (v) => v !== "" && !isNaN(v) && parseFloat(v) > 0;

// Derivar estado de una deuda a partir de saldo y vencimiento (nica fuente de verdad)
const calcularEstado = (saldoPendiente, montoOriginal, vencimiento) => {
  if (saldoPendiente === 0) return "pagada";
  const hoy = new Date().toISOString().split("T")[0];
  if (vencimiento < hoy) return "vencida";
  if (saldoPendiente < montoOriginal) return "parcial";
  return "pendiente";
};

// === Datos simulados ===
const INITIAL_USERS = [
  { id: "admin", email: "admin@jokili.com", password: "admin123", role: "admin", nombre: "Administrador" },
  { id: "m1", email: "carlos@jokili.com", password: "carlos123", role: "member", nombre: "Carlos Mendoza", telefono: "+58 412-555-1234", cedula: "V-12.345.678", ingreso: "2019-03-15", cargo: "Vocal", activo: true },
  { id: "m2", email: "ana@jokili.com", password: "ana123", role: "member", nombre: "Ana Rodrguez", telefono: "+58 416-555-5678", cedula: "V-15.234.567", ingreso: "2020-07-01", cargo: "Tesorera", activo: true },
  { id: "m3", email: "luis@jokili.com", password: "luis123", role: "member", nombre: "Luis Torres", telefono: "+58 424-555-9012", cedula: "V-18.765.432", ingreso: "2021-01-20", cargo: "Miembro", activo: true },
];

// Abonos: cada abono queda vinculado a una deuda concreta (deudaId)
const INITIAL_ABONOS = [
  { id: "a1", miembroId: "m2", deudaId: "d3", concepto: "Abono: Anualidad 2025", monto: 15, fecha: "2025-03-10" },
];

// Deudas: montoOriginal fijo histrico, saldoPendiente se reduce con abonos
const INITIAL_DEBTS = [
  { id: "d1", miembroId: "m1", concepto: "Anualidad 2024", montoOriginal: 25, saldoPendiente: 25, vencimiento: "2024-01-31", estado: "vencida", fechaCreacion: "2024-01-01" },
  { id: "d2", miembroId: "m1", concepto: "Broche", montoOriginal: 100, saldoPendiente: 100, vencimiento: "2026-06-30", estado: "pendiente", fechaCreacion: "2025-12-01" },
  { id: "d3", miembroId: "m2", concepto: "Anualidad 2025", montoOriginal: 30, saldoPendiente: 15, vencimiento: "2025-01-31", estado: "vencida", fechaCreacion: "2025-01-01" },
  { id: "d4", miembroId: "m2", concepto: "Zapatos", montoOriginal: 200, saldoPendiente: 200, vencimiento: "2026-06-30", estado: "pendiente", fechaCreacion: "2025-12-01" },
  { id: "d5", miembroId: "m3", concepto: "Anualidad 2026", montoOriginal: 35, saldoPendiente: 35, vencimiento: "2026-01-31", estado: "vencida", fechaCreacion: "2026-01-01" },
];

const INITIAL_NOTIFS = [
  { id: "n1", titulo: "Reunin Mensual", mensaje: "Habr reunin el prximo sbado 26 de abril a las 4pm.", fecha: "2025-04-20" },
  { id: "n2", titulo: "Recordatorio de Cuota Anual", mensaje: "La cuota anual 2026 vence el 31 de enero.", fecha: "2025-04-15" },
];

//  GUA VISUAL 
// Superficies: bg (fondo app), surface (tarjetas), surface2 (filas/inputs)
// Sidebar: panel oscuro dedicado  nav separado visualmente del contenido
// Acento: gold solo para identidad/brand, nunca como color de lectura principal
// Estados: greenBright (pagado/activo), redBright (vencida/error), goldLight (pendiente)
// Texto: text (principal) > textDim (secundario) > textMuted (labels/muted)
// 
const C = {
  // Superficies (tema claro  lectura cmoda, alto contraste)
  bg:       "#f0f2f5",   // fondo general de la aplicacin
  surface:  "#ffffff",   // tarjetas y paneles principales
  surface2: "#f5f7fa",   // superficie secundaria (inputs, filas alternas)
  border:   "#e2e8f0",   // bordes sutiles

  // Sidebar (panel oscuro  navegacin y marca)
  sidebar:       "#192334",
  sidebarBorder: "#243349",
  sidebarText:   "#b8c8dc",
  sidebarMuted:  "#546880",

  // Acento dorado Jokili
  gold:      "#a16800",   // oscuro  contraste WCAG AA sobre fondo claro (5.3:1)
  goldLight: "#c8920e",   // estndar  para sidebar oscuro y decoracin grande
  goldDim:   "#7a5208",
  goldGlow:  "#c8920e22",

  // Estados semnticos
  red:         "#be1a2c",
  redBright:   "#dc2626",
  green:       "#0a7a40",
  greenBright: "#059669",

  // Texto (sobre fondos claros)
  text:      "#0f172a",   // principal  mximo contraste
  textDim:   "#334155",   // secundario
  textMuted: "#64748b",   // labels, metadatos

  // Feedback de error
  errorColor:  "#dc2626",
  errorBg:     "#fef2f2",
  errorBorder: "#fecaca",
};

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: ${C.bg}; font-family: 'Inter', sans-serif; color: ${C.text}; -webkit-font-smoothing: antialiased; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: ${C.bg}; }
    ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: ${C.textMuted}; }
    input, select, textarea { background: ${C.surface}; border: 1.5px solid ${C.border}; color: ${C.text}; border-radius: 8px; padding: 10px 14px; font-family: 'Inter', sans-serif; font-size: 13.5px; width: 100%; outline: none; transition: border-color 0.15s, box-shadow 0.15s; }
    input:focus, select:focus, textarea:focus { border-color: ${C.goldLight}; box-shadow: 0 0 0 3px ${C.goldGlow}; }
    input::placeholder, textarea::placeholder { color: ${C.textMuted}; }
    select option { background: ${C.surface}; color: ${C.text}; }
    button { cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.15s; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .fadeUp { animation: fadeUp 0.28s ease forwards; }
    .fadeIn { animation: fadeIn 0.2s ease forwards; }
  `}</style>
);

// === Componente reutilizable para mensajes de error ===
// Se usa debajo de cada campo con error. Aparece solo si hay mensaje.
const CampoError = ({ msg }) =>
  msg ? (
    <p style={{ color: C.errorColor, fontSize: "11px", marginTop: "5px", paddingLeft: "2px" }}>
      a {msg}
    </p>
  ) : null;

// Estilo para pintar el borde del input en rojo cuando hay error
const inputConError = (tieneError) =>
  tieneError ? { borderColor: C.errorColor, boxShadow: `0 0 0 3px ${C.errorColor}20` } : {};

// === Componentes de UI ===
const Btn = ({ onClick, children, variant = "primary", small = false, disabled = false, full = false, style: s = {} }) => {
  const base = { border: "none", borderRadius: "8px", fontWeight: "500", letterSpacing: "0.01em", padding: small ? "6px 14px" : "10px 20px", fontSize: small ? "12.5px" : "13.5px", width: full ? "100%" : "auto", opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "pointer" };
  const vars = {
    primary: { background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`, color: "#ffffff", boxShadow: `0 2px 10px ${C.goldGlow}` },
    danger:  { background: "#fef2f2", color: "#991b1b", border: "1.5px solid #fca5a5" },
    ghost:   { background: "transparent", color: C.textDim, border: `1.5px solid ${C.border}` },
    success: { background: "#ecfdf5", color: "#065f46", border: "1.5px solid #a7f3d0" },
  };
  return <button onClick={!disabled ? onClick : undefined} style={{ ...base, ...vars[variant], ...s }}>{children}</button>;
};

const Badge = ({ type = "neutral", children }) => {
  const t = {
    pagado:   { bg: "#ecfdf5", c: "#065f46", b: "#a7f3d0" },
    pendiente:{ bg: "#fffbeb", c: "#92400e", b: "#fde68a" },
    parcial:  { bg: "#fff7ed", c: "#9a3412", b: "#fed7aa" },
    vencida:  { bg: "#fef2f2", c: "#991b1b", b: "#fca5a5" },
    activo:   { bg: "#ecfdf5", c: "#065f46", b: "#a7f3d0" },
    inactivo: { bg: "#fef2f2", c: "#991b1b", b: "#fca5a5" },
    neutral:  { bg: C.surface2, c: C.textMuted, b: C.border },
  };
  const s = t[type] || t.neutral;
  return <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: "20px", background: s.bg, color: s.c, border: `1px solid ${s.b}`, fontSize: "10px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase" }}>{children}</span>;
};

const Card = ({ children, style: s = {}, className = "" }) => (
  <div className={className} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "24px", boxShadow: "0 1px 4px rgba(15,23,42,0.06)", ...s }}>{children}</div>
);

const H1 = ({ children, sub }) => (
  <div style={{ marginBottom: "24px" }}>
    <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "27px", fontWeight: "700", color: C.text, lineHeight: 1.15 }}>{children}</h1>
    {sub && <p style={{ color: C.textMuted, fontSize: "13px", marginTop: "5px", fontWeight: "400" }}>{sub}</p>}
  </div>
);

const Label = ({ children }) => (
  <label style={{ display: "block", fontSize: "11.5px", color: C.textDim, marginBottom: "6px", letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: "600" }}>{children}</label>
);

const ModalSection = ({ title, children, special = false }) => (
  <div style={{ border: `1px solid ${special ? C.goldDim : C.border}`, borderRadius: "12px", overflow: "hidden" }}>
    <div style={{ background: special ? `${C.gold}12` : C.surface2, borderBottom: `1px solid ${special ? C.goldDim : C.border}`, padding: "12px 16px", fontSize: "11px", color: special ? C.gold : C.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: "700" }}>{title}</div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px", padding: "16px" }}>
      {children}
    </div>
  </div>
);

const ModalField = ({ label, error, children, wide = false }) => (
  <div style={{ gridColumn: wide ? "1 / -1" : "auto" }}>
    <Label>{label}</Label>
    {children}
    <CampoError msg={error} />
  </div>
);

const Toast = ({ msg, type }) => (
  <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 9999, background: type === "danger" ? "#fef2f2" : "#ecfdf5", color: type === "danger" ? "#991b1b" : "#065f46", padding: "12px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: "500", border: `1.5px solid ${type === "danger" ? "#fca5a5" : "#a7f3d0"}`, boxShadow: "0 6px 24px rgba(15,23,42,0.12)", animation: "fadeUp 0.3s ease" }}>
    {type === "danger" ? "x" : "S&"} {msg}
  </div>
);

const EmptyState = ({ icon, msg }) => (
  <div style={{ textAlign: "center", padding: "40px 20px", color: C.textMuted }}>
    <div style={{ fontSize: "34px", marginBottom: "10px", opacity: 0.5 }}>{icon}</div>
    <p style={{ fontSize: "14px", fontWeight: "400" }}>{msg}</p>
  </div>
);

const generarNumeroFicha = (members = []) => {
  const max = members.reduce((n, m) => {
    const raw = String(m.fichaNumero || "").replace(/\D/g, "");
    return Math.max(n, Number(raw) || 0);
  }, 139);
  return String(max + 1).padStart(5, "0");
};

const crearFormularioMiembro = (m = {}, members = []) => {
  const partes = (m.nombre || "").trim().split(" ").filter(Boolean);
  const apellidoDerivado = partes.length > 1 ? partes.slice(1).join(" ") : "";
  return {
    fichaNumero: m.fichaNumero || generarNumeroFicha(members),
    nombres: m.nombres || partes[0] || "",
    apellido: m.apellido || apellidoDerivado,
    email: m.email || "",
    password: m.password || "",
    cedula: m.cedula || "",
    fechaNacimiento: m.fechaNacimiento || "",
    sexo: m.sexo || "",
    conyuge: m.conyuge || "",
    lugarNacimiento: m.lugarNacimiento || "",
    profesion: m.profesion || "",
    direccion: m.direccion || "",
    estadoRegion: m.estadoRegion || "Aragua",
    municipio: m.municipio || "Tovar",
    ciudad: m.ciudad || "Colonia Tovar",
    telefonoHabitacion: m.telefonoHabitacion || "",
    celular: m.celular || m.telefono || "",
    broche: m.broche || "",
    carnet: m.carnet || "",
    fechaInscripcion: m.fechaInscripcion || m.ingreso || new Date().toISOString().split("T")[0],
    padrino: m.padrino || "",
    cuotaAnual: m.cuotaAnual || "",
    cargo: m.cargo || "Miembro",
    fechaCargo: m.fechaCargo || "",
    activo: m.activo ?? true,
    bautizado: m.bautizado || "no",
    fechaBautismo: m.fechaBautismo || "",
    oberjokili: m.oberjokili || "no",
    periodoOberjokili: m.periodoOberjokili || "",
    brunnen: m.brunnen || "no",
    anioBrunnen: m.anioBrunnen || "",
    otros: m.otros || "",
  };
};

const calcularEdadTexto = (fecha) => {
  if (!fecha) return "-";
  const nacimiento = new Date(`${fecha}T00:00:00`);
  if (Number.isNaN(nacimiento.getTime())) return "-";
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const cumple = new Date(hoy.getFullYear(), nacimiento.getMonth(), nacimiento.getDate());
  if (hoy < cumple) edad -= 1;
  return `${edad} anos`;
};

const valorFicha = (v) => (v === true ? "Si" : v === false ? "No" : v || "-");

const FichaCampo = ({ label, value, wide = false, highlight = false }) => (
  <div style={{ gridColumn: wide ? "1 / -1" : "auto", background: C.surface2, padding: "13px 16px", border: `1px solid ${C.border}` }}>
    <div style={{ fontSize: "9px", color: C.textMuted, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: "700", marginBottom: "4px" }}>{label}</div>
    <div style={{ fontSize: highlight ? "16px" : "14px", color: highlight ? C.gold : C.text, fontWeight: highlight ? "700" : "500" }}>{valorFicha(value)}</div>
  </div>
);

const FichaMiembroVista = ({ user }) => (
  <Card style={{ padding: 0, overflow: "hidden" }}>
    <div style={{ padding: "18px 24px", borderBottom: `1px solid ${C.goldDim}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: C.surface }}>
      <div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: "700" }}>Asociacion de Arlequines Jokili Verein</div>
        <div style={{ fontSize: "10px", color: C.gold, letterSpacing: "0.16em", textTransform: "uppercase", marginTop: "3px" }}>Colonia Tovar - Seit 1976</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: "9px", color: C.textMuted, letterSpacing: "0.14em", textTransform: "uppercase" }}>Ficha No.</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", color: C.gold, fontWeight: "700" }}>{user.fichaNumero || "-"}</div>
      </div>
    </div>

    <div style={{ padding: "28px 24px", background: `linear-gradient(135deg, ${C.surface2}, ${C.surface})`, borderBottom: `1px solid ${C.border}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
        <div style={{ width: "68px", height: "68px", borderRadius: "50%", background: C.surface, border: `2px solid ${C.goldDim}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>J</div>
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "34px", lineHeight: 1.1, fontWeight: "700" }}>{user.nombre}</h2>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center", marginTop: "8px" }}>
            <span style={{ color: C.gold, fontSize: "13px", fontWeight: "700" }}>{user.cargo || "Miembro"}</span>
            <span style={{ color: C.textMuted, fontSize: "12px" }}>Miembro desde {user.fechaInscripcion || user.ingreso || "-"}</span>
            <Badge type={user.activo ? "activo" : "inactivo"}>{user.activo ? "Activo" : "Inactivo"}</Badge>
          </div>
        </div>
      </div>
    </div>

    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
      <FichaSeccion title="Datos personales">
        <FichaCampo label="Nombres" value={user.nombres || user.nombre} />
        <FichaCampo label="Apellido" value={user.apellido} />
        <FichaCampo label="Cedula de identidad" value={user.cedula} />
        <FichaCampo label="Fecha de nacimiento" value={user.fechaNacimiento} />
        <FichaCampo label="Sexo" value={user.sexo} />
        <FichaCampo label="Edad" value={calcularEdadTexto(user.fechaNacimiento)} />
        <FichaCampo label="Nombre conyuge" value={user.conyuge} />
        <FichaCampo label="Lugar de nacimiento" value={user.lugarNacimiento} />
        <FichaCampo label="Profesion u ocupacion" value={user.profesion} wide />
      </FichaSeccion>

      <FichaSeccion title="Contacto y direccion">
        <FichaCampo label="Direccion de habitacion" value={user.direccion} wide />
        <FichaCampo label="Estado" value={user.estadoRegion} />
        <FichaCampo label="Municipio" value={user.municipio} />
        <FichaCampo label="Ciudad" value={user.ciudad} />
        <FichaCampo label="Telefono habitacion" value={user.telefonoHabitacion} />
        <FichaCampo label="Celular" value={user.celular || user.telefono} />
        <FichaCampo label="Correo electronico" value={user.email} />
      </FichaSeccion>

      <FichaSeccion title="Datos del club">
        <FichaCampo label="No. de broche" value={user.broche} highlight />
        <FichaCampo label="No. de carnet" value={user.carnet} />
        <FichaCampo label="Fecha de inscripcion" value={user.fechaInscripcion || user.ingreso} />
        <FichaCampo label="Padrino" value={user.padrino} />
        <FichaCampo label="Cargo actual" value={user.cargo} />
        <FichaCampo label="Fecha del cargo" value={user.fechaCargo} />
        <FichaCampo label="Cuota anual que cancela" value={user.cuotaAnual} wide />
      </FichaSeccion>

      <FichaSeccion title="Tradiciones Jokili" special>
        <FichaCampo label="Bautizado" value={user.bautizado === "si" ? "Si" : "No"} />
        <FichaCampo label="Fecha de bautismo" value={user.fechaBautismo} />
        <FichaCampo label="Fue Oberjokili" value={user.oberjokili === "si" ? "Si" : "No"} />
        <FichaCampo label="Periodo como Oberjokili" value={user.periodoOberjokili} />
        <FichaCampo label="Bautizado en Jokili Brunnen" value={user.brunnen === "si" ? "Si" : "No"} />
        <FichaCampo label="Ano Jokili Brunnen" value={user.anioBrunnen} />
        <FichaCampo label="Otros" value={user.otros} wide />
      </FichaSeccion>
    </div>
  </Card>
);

const FichaSeccion = ({ title, children, special = false }) => (
  <section style={{ border: `1px solid ${special ? C.goldDim : C.border}`, borderRadius: "12px", overflow: "hidden" }}>
    <div style={{ padding: "12px 16px", background: special ? `${C.gold}12` : C.surface2, borderBottom: `1px solid ${special ? C.goldDim : C.border}`, fontSize: "11px", color: special ? C.gold : C.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: "700" }}>{title}</div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1px", background: C.border }}>
      {children}
    </div>
  </section>
);

// === App raiz ===
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState(INITIAL_USERS);
  const [abonos, setAbonos] = useState(INITIAL_ABONOS);
  const [debts, setDebts] = useState(INITIAL_DEBTS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFS);
  const logout = () => setCurrentUser(null);
  return (
    <>
      <GlobalStyle />
      {!currentUser && <LoginPageWrapper allUsers={allUsers} onLogin={setCurrentUser} />}
      {currentUser?.role === "admin" && <AdminConsole allUsers={allUsers} setAllUsers={setAllUsers} abonos={abonos} setAbonos={setAbonos} debts={debts} setDebts={setDebts} notifications={notifications} setNotifications={setNotifications} onLogout={logout} />}
      {currentUser?.role === "member" && <MemberPortal user={currentUser} abonos={abonos} debts={debts} notifications={notifications} onLogout={logout} />}
    </>
  );
}

// """""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
// LOGIN con validaciones
// """""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const LoginPageWrapper = ({ allUsers, onLogin }) => {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [errores, setErrores] = useState({});        //   NUEVO: errores por campo
  const [loginErr, setLoginErr] = useState("");       //   error general de credenciales
  const [loading, setLoading] = useState(false);

// LOGIN con validaciones
  const validarLogin = () => {
    const e = {};
    if (!esEmailValido(email))  e.email = "Ingresa un correo vlido (ej: usuario@correo.com)";
    if (!pw.trim())             e.pw    = "La contrasea no puede estar vaca";
    return e;
  };

  const handleLogin = () => {
    const e = validarLogin();
    if (Object.keys(e).length > 0) {
      setErrores(e);   // muestra errores, no contina
      return;
    }
    setErrores({});
    setLoginErr("");
    setLoading(true);
    setTimeout(() => {
      const user = allUsers.find(u => u.email === email && u.password === pw);
      if (user) { onLogin(user); }
      else { setLoginErr("Correo o contrasea incorrectos"); setLoading(false); }
    }, 700);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(150deg, #eef2f7 0%, #f5f7fa 50%, #edf2ee 100%)", padding: "20px" }}>
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", opacity: 0.06 }}>
        {[...Array(10)].map((_, i) => <div key={i} style={{ position: "absolute", left: `${i * 11}%`, top: 0, bottom: 0, width: "1px", background: `linear-gradient(to bottom, transparent 0%, ${C.goldLight} 40%, ${C.goldLight} 60%, transparent 100%)` }} />)}
      </div>
      <div className="fadeUp" style={{ width: "100%", maxWidth: "400px" }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{ width: "76px", height: "76px", margin: "0 auto 16px", background: `linear-gradient(135deg, ${C.goldDim}, ${C.goldLight})`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "34px", boxShadow: `0 4px 24px ${C.goldGlow}` }}>x}</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "30px", color: C.text, fontWeight: "700" }}>Club Tovarerjokili</h1>
          <p style={{ color: C.textMuted, fontSize: "11px", marginTop: "6px", letterSpacing: "0.18em", textTransform: "uppercase" }}>Portal de Miembros</p>
        </div>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "36px", boxShadow: "0 8px 40px rgba(15,23,42,0.10)" }}>

          {/* Campo: Correo */}
          <div style={{ marginBottom: "18px" }}>
            <Label>Correo electrnico</Label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setErrores(prev => ({ ...prev, email: "" })); }}
              placeholder="tu@correo.com"
              style={inputConError(errores.email)}
            />
            <CampoError msg={errores.email} />
          </div>

          {/* Campo: Contrasea */}
          <div style={{ marginBottom: "26px" }}>
            <Label>Contrasea</Label>
            <input
              type="password"
              value={pw}
              onChange={e => { setPw(e.target.value); setErrores(prev => ({ ...prev, pw: "" })); }}
              placeholder=""
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              style={inputConError(errores.pw)}
            />
            <CampoError msg={errores.pw} />
          </div>

          {/* Error general de credenciales */}
          {loginErr && (
            <div style={{ background: C.errorBg, border: `1px solid ${C.errorBorder}`, borderRadius: "8px", padding: "10px 14px", color: "#ff8080", fontSize: "13px", marginBottom: "18px" }}>
              {loginErr}
            </div>
          )}

          <button onClick={handleLogin} disabled={loading} style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "none", background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`, color: "#ffffff", fontWeight: "600", fontSize: "14px", opacity: loading ? 0.7 : 1, boxShadow: `0 4px 20px ${C.goldGlow}` }}>
            {loading ? "Verificando..." : "Iniciar Sesin"}
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

// """""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
// PORTAL DEL MIEMBRO
// """""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const MemberPortal = ({ user, abonos, debts, notifications, onLogout }) => {
  const [tab, setTab] = useState("perfil");
  const myAbonos = abonos.filter(a => a.miembroId === user.id);
  const myDebts = debts.filter(d => d.miembroId === user.id);
  const myPendingDebts = myDebts.filter(d => d.estado !== "pagada");
  const totalPaid = myAbonos.reduce((s, a) => s + a.monto, 0);
  const totalOwed = myPendingDebts.reduce((s, d) => s + d.saldoPendiente, 0);
  const TABS = [
    { id: "perfil", label: "Mi Perfil", icon: "x" },
    { id: "cuotas", label: "Historial de Abonos", icon: "x" },
    { id: "deudas", label: "Deudas", icon: "a", badge: myPendingDebts.length },
    { id: "avisos", label: "Avisos", icon: "x", badge: notifications.length },
  ];
  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      <header style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "62px", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "20px" }}>x}</span>
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
          <Btn variant="ghost" small onClick={onLogout}>Salir  </Btn>
        </div>
      </header>
      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "28px 16px" }}>
        <div className="fadeUp" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", marginBottom: "24px" }}>
          {[
            { icon: "x", label: "Total Abonado", val: `$${totalPaid}`, color: C.greenBright },
            { icon: "a", label: "Deuda Pendiente", val: `$${totalOwed}`, color: totalOwed > 0 ? "#dc2626" : C.greenBright },
            { icon: "x9", label: "Abonos Realizados", val: myAbonos.length, color: C.goldLight },
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
            <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "10px 6px", borderRadius: "8px", border: "none", background: tab === t.id ? C.goldGlow : "transparent", color: tab === t.id ? C.gold : C.textMuted, fontSize: "12px", fontWeight: tab === t.id ? "600" : "400", borderBottom: tab === t.id ? `2px solid ${C.gold}` : "2px solid transparent", position: "relative" }}>
              {t.icon} {t.label}
              {t.badge > 0 && <span style={{ position: "absolute", top: "4px", right: "6px", background: C.red, color: "#fff", fontSize: "9px", borderRadius: "10px", padding: "0 5px", fontWeight: "700" }}>{t.badge}</span>}
            </button>
          ))}
        </div>
        <div key={tab} className="fadeUp">
          {tab === "perfil" && (
            <FichaMiembroVista user={user} />
          )}
          {tab === "cuotas" && (
            <Card>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", marginBottom: "20px", fontWeight: "600" }}>Historial de Abonos</h2>
              {myAbonos.length === 0 ? <EmptyState icon="x9" msg="Sin abonos registrados an" /> : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {myAbonos.map(a => {
                    const deuda = debts.find(d => d.id === a.deudaId);
                    return (
                      <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: C.surface2, borderRadius: "10px", border: `1px solid ${C.border}` }}>
                        <div>
                          <div style={{ fontSize: "14px", color: C.text, fontWeight: "500" }}>{a.concepto}</div>
                          <div style={{ fontSize: "12px", color: C.textMuted, marginTop: "2px" }}>
                            {deuda ? `Deuda: ${deuda.concepto}` : ""}{deuda ? "  " : ""}{a.fecha}
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <span style={{ color: C.gold, fontWeight: "700", fontSize: "16px" }}>${a.monto}</span>
                          <Badge type="pagado">Abono</Badge>
                        </div>
                      </div>
                    );
                  })}
                  <div style={{ padding: "12px 16px", display: "flex", justifyContent: "flex-end" }}>
                    <span style={{ fontSize: "13px", color: C.textDim }}>Total abonado: <strong style={{ color: C.greenBright }}>${totalPaid}</strong></span>
                  </div>
                </div>
              )}
            </Card>
          )}
          {tab === "deudas" && (
            <Card>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", marginBottom: "20px", fontWeight: "600" }}>Mis Deudas</h2>
              {myPendingDebts.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>x}0</div>
                  <p style={{ color: C.greenBright, fontWeight: "600", fontSize: "15px" }}>Ests al da! Sin deudas pendientes.</p>
                </div>
              ) : (
                <>
                  <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "14px 18px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#991b1b", fontSize: "14px" }}>a Total adeudado</span>
                    <span style={{ color: "#dc2626", fontWeight: "700", fontSize: "20px" }}>${totalOwed}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {myPendingDebts.map(d => (
                      <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: C.surface2, borderRadius: "10px", border: `1px solid ${d.estado === "vencida" ? "#fecaca" : C.border}` }}>
                        <div>
                          <div style={{ fontSize: "14px", color: C.text, fontWeight: "500" }}>{d.concepto}</div>
                          <div style={{ fontSize: "12px", color: C.textMuted, marginTop: "2px" }}>
                            Monto original: ${d.montoOriginal}  Vence: {d.vencimiento}
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ color: "#dc2626", fontWeight: "700", fontSize: "16px" }}>${d.saldoPendiente}</div>
                            <div style={{ fontSize: "10px", color: C.textMuted }}>pendiente</div>
                          </div>
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
              {notifications.length === 0 ? <Card><EmptyState icon="x" msg="Sin avisos por ahora" /></Card> : notifications.map(n => (
                <Card key={n.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                    <h3 style={{ color: C.gold, fontWeight: "600", fontSize: "15px" }}>x {n.titulo}</h3>
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

// """""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
// CONSOLA DE ADMINISTRACI?N con validaciones en modal y pagos
// """""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const AdminConsole = ({ allUsers, setAllUsers, abonos, setAbonos, debts, setDebts, notifications, setNotifications, onLogout }) => {
  const [tab, setTab] = useState("dashboard");
  const [modal, setModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(() => crearFormularioMiembro({}, []));
  const [pagoTab, setPagoTab] = useState("deuda");
  const [deudaForm, setDeudaForm] = useState({ miembroId: "", concepto: "", monto: "", vencimiento: new Date().toISOString().split("T")[0] });
  const [abonoForm, setAbonoForm] = useState({ miembroId: "", deudaId: "", monto: "", fecha: new Date().toISOString().split("T")[0] });
  const [notifForm, setNotifForm] = useState({ titulo: "", mensaje: "" });
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmDebt, setConfirmDebt] = useState(null);
  const [showDebtors, setShowDebtors] = useState(false);
  const [sortCol, setSortCol] = useState("miembro");
  const [sortDir, setSortDir] = useState("asc");
  const [debtFilter, setDebtFilter] = useState("");
  const [reportFilter, setReportFilter] = useState("");
  const [reportSortCol, setReportSortCol] = useState("miembro");
  const [reportSortDir, setReportSortDir] = useState("asc");

  // Estados de errores (uno por formulario)
  const [memberErrors, setMemberErrors] = useState({});
  const [deudaErrors, setDeudaErrors]   = useState({});
  const [abonoErrors, setAbonoErrors]   = useState({});

  const members = allUsers.filter(u => u.role === "member");
  const fireToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };
  const totalRec = abonos.reduce((s, a) => s + a.monto, 0);
  const totalDeuda = debts.filter(d => d.estado !== "pagada").reduce((s, d) => s + d.saldoPendiente, 0);
  const activeMembersCount = members.filter(m => m.activo).length;
  const inactiveMembersCount = members.filter(m => !m.activo).length;
  const debtorsList = members.map(m => ({
    ...m,
    deudaTotal: debts.filter(d => d.miembroId === m.id && d.estado !== "pagada").reduce((s, d) => s + d.saldoPendiente, 0),
  })).filter(m => m.deudaTotal > 0).sort((a, b) => b.deudaTotal - a.deudaTotal);
  const deudoresCount = debtorsList.length;
  const pieData = [{ name: "Recaudado", value: totalRec }, { name: "Por cobrar", value: totalDeuda }];

  const openAddModal = () => {
    setEditTarget(null);
    setForm(crearFormularioMiembro({}, members));
    setMemberErrors({});   //   limpia errores al abrir
    setModal(true);
  };
  const openEditModal = (m) => {
    setEditTarget(m);
    setForm(crearFormularioMiembro(m, members));
    setMemberErrors({});   //   limpia errores al abrir
    setModal(true);
  };

  // Validar formulario de miembro
  const validarMiembro = () => {
    const e = {};
    if (!form.nombres.trim())             e.nombres  = "El nombre es obligatorio";
    if (!form.apellido.trim())            e.apellido = "El apellido es obligatorio";
    if (!esEmailValido(form.email))       e.email    = "Ingresa un correo vlido (ej: usuario@correo.com)";
    if (form.password.length < 8)         e.password = "La contrasea debe tener mnimo 8 caracteres";
    if (!form.celular.trim())             e.celular  = "El celular no puede estar vacio";
    if (form.cedula && !esCedulaValida(form.cedula))
                                          e.cedula   = "Formato venezolano requerido: V-12345678 o E-12345678";
    return e;
  };

  const saveMember = () => {
    const e = validarMiembro();
    if (Object.keys(e).length > 0) {
      setMemberErrors(e);   // muestra errores, no guarda
      return;
    }
    setMemberErrors({});
    const miembroData = {
      ...form,
      nombre: `${form.nombres} ${form.apellido}`.trim(),
      telefono: form.celular || form.telefonoHabitacion,
      ingreso: form.fechaInscripcion,
    };
    if (editTarget) {
      setAllUsers(prev => prev.map(u => u.id === editTarget.id ? { ...u, ...miembroData } : u));
      fireToast("Miembro actualizado");
    } else {
      setAllUsers(prev => [...prev, { ...miembroData, id: "m" + Date.now(), role: "member" }]);
      fireToast("Miembro agregado");
    }
    setModal(false);
  };

  const requestDeleteMember = (member) => {
    const pagosCount = abonos.filter(a => a.miembroId === member.id).length;
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
    setAbonos(prev => prev.filter(a => a.miembroId !== memberId));
    setDebts(prev => prev.filter(d => d.miembroId !== memberId));
    setConfirmDelete(null);
    fireToast("Miembro eliminado", "danger");
  };

  // Validar y registrar deuda nueva
  const validarDeuda = () => {
    const e = {};
    if (!deudaForm.miembroId)             e.miembroId   = "Debes seleccionar un miembro";
    if (!deudaForm.concepto.trim())       e.concepto    = "El concepto no puede estar vaco";
    if (!esMontoValido(deudaForm.monto))  e.monto       = "Ingresa un monto vlido mayor a cero";
    if (!deudaForm.vencimiento)           e.vencimiento = "La fecha de vencimiento es requerida";
    return e;
  };

  const registrarDeuda = () => {
    const e = validarDeuda();
    if (Object.keys(e).length > 0) { setDeudaErrors(e); return; }
    setDeudaErrors({});
    const monto = Number(deudaForm.monto);
    const estado = calcularEstado(monto, monto, deudaForm.vencimiento);
    setDebts(prev => [...prev, {
      id: "d" + Date.now(),
      miembroId: deudaForm.miembroId,
      concepto: deudaForm.concepto,
      montoOriginal: monto,
      saldoPendiente: monto,
      vencimiento: deudaForm.vencimiento,
      estado,
      fechaCreacion: new Date().toISOString().split("T")[0]
    }]);
    fireToast("Deuda registrada");
    setDeudaForm({ miembroId: "", concepto: "", monto: "", vencimiento: new Date().toISOString().split("T")[0] });
  };

  // Validar y registrar abono a una deuda especfica
  const validarAbono = () => {
    const e = {};
    if (!abonoForm.miembroId)            e.miembroId = "Debes seleccionar un miembro";
    if (!abonoForm.deudaId)              e.deudaId   = "Debes seleccionar una deuda";
    if (!esMontoValido(abonoForm.monto)) e.monto     = "Ingresa un monto vlido mayor a cero";
    if (!abonoForm.fecha)                e.fecha     = "La fecha no puede estar vaca";
    if (abonoForm.deudaId && esMontoValido(abonoForm.monto)) {
      const deuda = debts.find(d => d.id === abonoForm.deudaId);
      if (deuda && Number(abonoForm.monto) > deuda.saldoPendiente) {
        e.monto = `El abono no puede superar el saldo pendiente ($${deuda.saldoPendiente})`;
      }
    }
    return e;
  };

  const registrarAbono = () => {
    const e = validarAbono();
    if (Object.keys(e).length > 0) { setAbonoErrors(e); return; }
    setAbonoErrors({});
    const monto = Number(abonoForm.monto);
    const deuda = debts.find(d => d.id === abonoForm.deudaId);
    const nuevoSaldo = deuda.saldoPendiente - monto;
    const nuevoEstado = calcularEstado(nuevoSaldo, deuda.montoOriginal, deuda.vencimiento);
    setAbonos(prev => [...prev, {
      id: "a" + Date.now(),
      miembroId: abonoForm.miembroId,
      deudaId: abonoForm.deudaId,
      concepto: `Abono: ${deuda.concepto}`,
      monto,
      fecha: abonoForm.fecha
    }]);
    setDebts(prev => prev.map(d => d.id === abonoForm.deudaId
      ? { ...d, saldoPendiente: nuevoSaldo, estado: nuevoEstado }
      : d
    ));
    fireToast("Abono registrado");
    setAbonoForm({ miembroId: "", deudaId: "", monto: "", fecha: new Date().toISOString().split("T")[0] });
  };

  const sendNotif = () => {
    if (!notifForm.titulo || !notifForm.mensaje) return;
    setNotifications(prev => [{ id: "n" + Date.now(), ...notifForm, fecha: new Date().toISOString().split("T")[0] }, ...prev]);
    setNotifForm({ titulo: "", mensaje: "" });
    fireToast("Aviso publicado");
  };

  const deleteDebt = (id) => {
    setDebts(prev => prev.filter(d => d.id !== id));
    setAbonos(prev => prev.filter(a => a.deudaId !== id));
    fireToast("Deuda eliminada", "danger");
  };

  const ejecutarConfirmDebt = () => {
    if (!confirmDebt) return;
    deleteDebt(confirmDebt.id);
    setConfirmDebt(null);
  };

  const SIDEBAR_ITEMS = [
    { id: "dashboard", icon: "x`", label: "Dashboard" },
    { id: "miembros", icon: "x", label: "Miembros" },
    { id: "pagos", icon: "x", label: "Pagos y Cargos" },
    { id: "deudas", icon: "a", label: "Gestin de Deudas" },
    { id: "avisos", icon: "x", label: "Avisos" },
    { id: "reportes", icon: "x", label: "Reportes" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg }}>
      <aside style={{ width: "230px", minHeight: "100vh", background: C.sidebar, borderRight: `1px solid ${C.sidebarBorder}`, display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${C.sidebarBorder}` }}>
          <div style={{ fontSize: "26px", marginBottom: "10px" }}>x}</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", color: "#ffffff", fontWeight: "600" }}>Tovarerjokili</div>
          <div style={{ fontSize: "9px", color: C.goldLight, letterSpacing: "0.2em", textTransform: "uppercase", marginTop: "4px" }}>Consola de Administracin</div>
        </div>
        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {SIDEBAR_ITEMS.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "11px 14px", borderRadius: "10px", border: "none", background: tab === item.id ? "rgba(200,146,14,0.18)" : "transparent", color: tab === item.id ? C.goldLight : C.sidebarText, fontSize: "13px", fontWeight: tab === item.id ? "600" : "400", marginBottom: "2px", textAlign: "left", borderLeft: tab === item.id ? `3px solid ${C.goldLight}` : "3px solid transparent" }}>
              <span style={{ fontSize: "15px" }}>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "16px" }}>
          <button onClick={onLogout} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "transparent", border: `1px solid ${C.sidebarBorder}`, color: C.sidebarMuted, fontSize: "12px" }}>  Cerrar sesin</button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: "30px 28px", overflow: "auto" }}>
        {toast && <Toast msg={toast.msg} type={toast.type} />}

        {/* DASHBOARD */}
        {tab === "dashboard" && (
          <div className="fadeUp">
            <H1 sub="Resumen general del club">Dashboard</H1>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginBottom: "24px" }}>
              {[
                { icon: "A", label: "Miembros Activos", val: activeMembersCount, color: C.gold },
                { icon: "I", label: "Miembros Inactivos", val: inactiveMembersCount, color: "#dc2626" },
                { icon: "$", label: "Total Recaudado", val: `$${totalRec}`, color: C.greenBright },
                { icon: "!", label: "Total Adeudado", val: `$${totalDeuda}`, color: "#dc2626" },
                { icon: "D", label: "Miembros c/ Deuda", val: deudoresCount, color: C.goldLight, clickable: true },
              ].map(s => (
                <Card key={s.label} style={{ padding: "20px", cursor: s.clickable ? "pointer" : "default", outline: s.clickable && showDebtors ? `1px solid ${C.gold}` : "none", boxShadow: s.clickable && showDebtors ? `0 0 0 3px ${C.goldGlow}` : "none" }}>
                  <div onClick={s.clickable ? () => setShowDebtors(v => !v) : undefined} role={s.clickable ? "button" : undefined} tabIndex={s.clickable ? 0 : undefined} onKeyDown={s.clickable ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setShowDebtors(v => !v); } } : undefined} style={{ margin: "-20px", padding: "20px" }}>
                    <div style={{ fontSize: "24px", marginBottom: "8px" }}>{s.icon}</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "26px", fontWeight: "700", color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "4px" }}>{s.label}{s.clickable ? " - Ver lista" : ""}</div>
                  </div>
                </Card>
              ))}
            </div>
            {showDebtors && (
              <Card style={{ padding: 0, overflow: "hidden", marginBottom: "16px" }}>
                <div style={{ padding: "18px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
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
                        <div style={{ color: "#dc2626", fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: "700" }}>${m.deudaTotal}</div>
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
                      {pieData.map((_, i) => <Cell key={i} fill={[C.greenBright, "#dc2626"][i]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: "8px", color: C.text, fontSize: "12px" }} />
                    <Legend wrapperStyle={{ color: C.textDim, fontSize: "12px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </div>
        )}

        {/* MIEMBROS */}
        {tab === "miembros" && (
          <div className="fadeUp">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
              <H1 sub={`${members.length} miembros registrados`}>Gestin de Miembros</H1>
              <Btn onClick={openAddModal}>+ Agregar Miembro</Btn>
            </div>
            <Card style={{ padding: 0, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: C.surface2, borderBottom: `1px solid ${C.border}` }}>
                    {["Nombre", "Email", "Cdula", "Cargo", "Estado", "Acciones"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "10px", color: C.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: "600" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {members.map((m, i) => (
                    <tr key={m.id} style={{ borderBottom: `1px solid ${C.border}40`, background: i % 2 ? `${C.surface2}50` : "transparent" }}>
                      <td style={{ padding: "13px 16px", fontSize: "14px", color: C.text, fontWeight: "500" }}>{m.nombre}</td>
                      <td style={{ padding: "13px 16px", fontSize: "12px", color: C.textDim }}>{m.email}</td>
                      <td style={{ padding: "13px 16px", fontSize: "12px", color: C.textDim }}>{m.cedula || "-"}</td>
                      <td style={{ padding: "13px 16px", fontSize: "12px", color: C.textDim }}>{m.cargo}</td>
                      <td style={{ padding: "13px 16px" }}><Badge type={m.activo ? "activo" : "inactivo"}>{m.activo ? "Activo" : "Inactivo"}</Badge></td>
                      <td style={{ padding: "13px 16px" }}>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <Btn small variant="ghost" onClick={() => openEditModal(m)}>S Editar</Btn>
                          <Btn small variant="danger" onClick={() => deleteMember(m.id)}>x</Btn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {/* PAGOS Y CARGOS */}
        {tab === "pagos" && (
          <div className="fadeUp">
            <H1 sub="Registra deudas por concepto libre y abonos a deudas especficas">Pagos y Cargos</H1>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <Card>
                <div style={{ display: "flex", gap: "8px", marginBottom: "18px" }}>
                  {[["deuda", "a Nueva Deuda"], ["abono", "S& Registrar Abono"]].map(([val, lbl]) => (
                    <button key={val} onClick={() => { setPagoTab(val); setDeudaErrors({}); setAbonoErrors({}); }} style={{ flex: 1, padding: "10px", borderRadius: "8px", border: `1px solid ${pagoTab === val ? C.gold : C.border}`, background: pagoTab === val ? `${C.gold}18` : "transparent", color: pagoTab === val ? C.goldLight : C.textDim, fontSize: "12px", fontWeight: "500" }}>{lbl}</button>
                  ))}
                </div>

                {pagoTab === "deuda" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div>
                      <Label>Miembro</Label>
                      <select value={deudaForm.miembroId} onChange={e => { setDeudaForm(f => ({ ...f, miembroId: e.target.value })); setDeudaErrors(p => ({ ...p, miembroId: "" })); }} style={inputConError(deudaErrors.miembroId)}>
                        <option value="">Seleccionar miembro...</option>
                        {members.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                      </select>
                      <CampoError msg={deudaErrors.miembroId} />
                    </div>
                    <div>
                      <Label>Concepto</Label>
                      <input value={deudaForm.concepto} onChange={e => { setDeudaForm(f => ({ ...f, concepto: e.target.value })); setDeudaErrors(p => ({ ...p, concepto: "" })); }} placeholder="Ej: Anualidad 2026, Broche, Zapatos..." style={inputConError(deudaErrors.concepto)} />
                      <CampoError msg={deudaErrors.concepto} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <div>
                        <Label>Monto ($)</Label>
                        <input type="number" value={deudaForm.monto} onChange={e => { setDeudaForm(f => ({ ...f, monto: e.target.value })); setDeudaErrors(p => ({ ...p, monto: "" })); }} placeholder="0" style={inputConError(deudaErrors.monto)} />
                        <CampoError msg={deudaErrors.monto} />
                      </div>
                      <div>
                        <Label>Vencimiento</Label>
                        <input type="date" value={deudaForm.vencimiento} onChange={e => { setDeudaForm(f => ({ ...f, vencimiento: e.target.value })); setDeudaErrors(p => ({ ...p, vencimiento: "" })); }} style={inputConError(deudaErrors.vencimiento)} />
                        <CampoError msg={deudaErrors.vencimiento} />
                      </div>
                    </div>
                    <Btn onClick={registrarDeuda}>Registrar Deuda</Btn>
                  </div>
                )}

                {pagoTab === "abono" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div>
                      <Label>Miembro</Label>
                      <select value={abonoForm.miembroId} onChange={e => { setAbonoForm(f => ({ ...f, miembroId: e.target.value, deudaId: "" })); setAbonoErrors(p => ({ ...p, miembroId: "" })); }} style={inputConError(abonoErrors.miembroId)}>
                        <option value="">Seleccionar miembro...</option>
                        {members.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                      </select>
                      <CampoError msg={abonoErrors.miembroId} />
                    </div>
                    <div>
                      <Label>Deuda a abonar</Label>
                      <select value={abonoForm.deudaId} onChange={e => { setAbonoForm(f => ({ ...f, deudaId: e.target.value })); setAbonoErrors(p => ({ ...p, deudaId: "" })); }} disabled={!abonoForm.miembroId} style={inputConError(abonoErrors.deudaId)}>
                        <option value="">{abonoForm.miembroId ? "Seleccionar deuda..." : "Selecciona un miembro primero"}</option>
                        {debts.filter(d => d.miembroId === abonoForm.miembroId && d.estado !== "pagada").map(d => (
                          <option key={d.id} value={d.id}>{d.concepto}  Saldo: ${d.saldoPendiente}</option>
                        ))}
                      </select>
                      <CampoError msg={abonoErrors.deudaId} />
                    </div>
                    {abonoForm.deudaId && (
                      <div style={{ padding: "10px 14px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "8px", fontSize: "12px", color: "#92400e" }}>
                        Saldo pendiente: <strong>${debts.find(d => d.id === abonoForm.deudaId)?.saldoPendiente}</strong>
                      </div>
                    )}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <div>
                        <Label>Monto a abonar ($)</Label>
                        <input type="number" value={abonoForm.monto} onChange={e => { setAbonoForm(f => ({ ...f, monto: e.target.value })); setAbonoErrors(p => ({ ...p, monto: "" })); }} placeholder="0" style={inputConError(abonoErrors.monto)} />
                        <CampoError msg={abonoErrors.monto} />
                      </div>
                      <div>
                        <Label>Fecha de pago</Label>
                        <input type="date" value={abonoForm.fecha} onChange={e => { setAbonoForm(f => ({ ...f, fecha: e.target.value })); setAbonoErrors(p => ({ ...p, fecha: "" })); }} style={inputConError(abonoErrors.fecha)} />
                        <CampoError msg={abonoErrors.fecha} />
                      </div>
                    </div>
                    <Btn onClick={registrarAbono}>Registrar Abono</Btn>
                  </div>
                )}
              </Card>

              <Card>
                <div style={{ fontSize: "14px", color: C.gold, fontWeight: "600", marginBottom: "16px" }}>altimos Registros</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "400px", overflowY: "auto" }}>
                  {[...abonos.map(a => ({ ...a, _k: "abono" })), ...debts.map(d => ({ ...d, fecha: d.vencimiento, monto: d.montoOriginal, _k: "deuda" }))].sort((a, b) => (b.fecha || "").localeCompare(a.fecha || "")).map(item => {
                    const m = members.find(mb => mb.id === item.miembroId);
                    return (
                      <div key={item.id + item._k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: C.surface2, borderRadius: "8px", border: `1px solid ${C.border}` }}>
                        <div>
                          <div style={{ fontSize: "12px", color: C.text }}>{item.concepto}</div>
                          <div style={{ fontSize: "11px", color: C.textMuted }}>{m?.nombre?.split(" ")[0] || "-"}  {item.fecha}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "13px", fontWeight: "700", color: item._k === "abono" ? C.greenBright : "#ff7070" }}>${item.monto}</div>
                          <Badge type={item._k === "abono" ? "pagado" : item.estado}>{item._k === "abono" ? "Abono" : item.estado}</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* GESTION DE DEUDAS */}
        {tab === "deudas" && (() => {
          const toggleSort = (col) => {
            if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
            else { setSortCol(col); setSortDir("asc"); }
          };

          const debtFilterText = debtFilter.trim().toLowerCase();
          const filteredDebts = debtFilterText
            ? debts.filter(d => {
                const memberName = members.find(mb => mb.id === d.miembroId)?.nombre || "";
                return memberName.toLowerCase().includes(debtFilterText);
              })
            : debts;

          const sortedDebts = [...filteredDebts].sort((a, b) => {
            const mA = members.find(mb => mb.id === a.miembroId)?.nombre || "";
            const mB = members.find(mb => mb.id === b.miembroId)?.nombre || "";
            let va, vb;
            if (sortCol === "miembro")        { va = mA; vb = mB; }
            else if (sortCol === "concepto")  { va = a.concepto; vb = b.concepto; }
            else if (sortCol === "original")  { va = a.montoOriginal; vb = b.montoOriginal; }
            else if (sortCol === "saldo")     { va = a.saldoPendiente; vb = b.saldoPendiente; }
            else if (sortCol === "vencimiento"){ va = a.vencimiento; vb = b.vencimiento; }
            else if (sortCol === "estado")    { va = a.estado; vb = b.estado; }
            else { va = ""; vb = ""; }
            const cmp = typeof va === "number" ? va - vb : va.localeCompare(vb);
            return sortDir === "asc" ? cmp : -cmp;
          });

          const SortTh = ({ col, label }) => {
            const active = sortCol === col;
            const arrow = active ? (sortDir === "asc" ? "  " : "  ") : "";
            return (
              <th onClick={() => toggleSort(col)} style={{ padding: "11px 14px", textAlign: "left", fontSize: "10px", color: active ? C.goldLight : C.textMuted, letterSpacing: "0.09em", textTransform: "uppercase", fontWeight: "600", whiteSpace: "nowrap", cursor: "pointer", userSelect: "none", background: active ? `${C.gold}0d` : "transparent" }}>
                {label}{arrow}
              </th>
            );
          };

          return (
          <div className="fadeUp">
            <H1 sub="Consulta, revisa y ordena las deudas. Para registrar abonos, usa Pagos y Cargos.">Gestin de Deudas</H1>
            {debts.length === 0 ? (
              <Card><EmptyState icon="a" msg="No hay deudas registradas. Usa 'Pagos y Cargos' para agregar una." /></Card>
            ) : (
              <Card style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: "240px", maxWidth: "340px", position: "relative" }}>
                    <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: C.textMuted, fontSize: "14px", pointerEvents: "none" }}>x</span>
                    <input
                      value={debtFilter}
                      onChange={e => setDebtFilter(e.target.value)}
                      placeholder="Buscar por nombre de miembro..."
                      style={{ paddingLeft: "36px" }}
                    />
                  </div>
                  {debtFilterText && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "12px", color: C.textMuted }}>
                        {sortedDebts.length} de {debts.length} deuda(s)
                      </span>
                      <button
                        onClick={() => setDebtFilter("")}
                        style={{ fontSize: "11px", color: C.textMuted, background: "transparent", border: `1px solid ${C.border}`, borderRadius: "6px", padding: "3px 9px", cursor: "pointer" }}
                      >
                        X Limpiar
                      </button>
                    </div>
                  )}
                </div>
                <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", color: C.textDim, fontWeight: "600" }}>
                    {sortedDebts.length} deuda(s)
                    &nbsp;&nbsp;
                    <span style={{ color: "#dc2626" }}>{sortedDebts.filter(d => d.estado !== "pagada").length} activa(s)</span>
                    &nbsp;&nbsp;
                    <span style={{ color: C.greenBright }}>{sortedDebts.filter(d => d.estado === "pagada").length} pagada(s)</span>
                  </span>
                  <span style={{ fontSize: "11px", color: C.textMuted }}>Haz clic en una columna para ordenar</span>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: C.surface2, borderBottom: `1px solid ${C.border}` }}>
                        <SortTh col="miembro"     label="Miembro" />
                        <SortTh col="concepto"    label="Concepto" />
                        <SortTh col="original"    label="Monto Orig." />
                        <SortTh col="saldo"       label="Saldo Pend." />
                        <SortTh col="vencimiento" label="Vencimiento" />
                        <SortTh col="estado"      label="Estado" />
                        <th style={{ padding: "11px 14px", textAlign: "left", fontSize: "10px", color: C.textMuted, letterSpacing: "0.09em", textTransform: "uppercase", fontWeight: "600", whiteSpace: "nowrap" }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedDebts.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ padding: "36px", textAlign: "center", color: C.textMuted, fontSize: "13px" }}>
                            No se encontraron deudas para ese nombre.
                          </td>
                        </tr>
                      ) : sortedDebts.map((d, i) => {
                        const m = members.find(mb => mb.id === d.miembroId);
                        return (
                          <tr key={d.id} style={{ borderBottom: `1px solid ${C.border}40`, background: i % 2 ? `${C.surface2}50` : "transparent", opacity: d.estado === "pagada" ? 0.7 : 1 }}>
                            <td style={{ padding: "12px 14px", fontSize: "13px", color: C.text, fontWeight: "500", whiteSpace: "nowrap" }}>{m?.nombre || "-"}</td>
                            <td style={{ padding: "12px 14px", fontSize: "13px", color: C.textDim }}>{d.concepto}</td>
                            <td style={{ padding: "12px 14px", fontSize: "13px", color: C.textMuted, whiteSpace: "nowrap" }}>${d.montoOriginal}</td>
                            <td style={{ padding: "12px 14px", fontSize: "13px", color: d.estado === "pagada" ? C.greenBright : "#dc2626", fontWeight: "700", whiteSpace: "nowrap" }}>${d.saldoPendiente}</td>
                            <td style={{ padding: "12px 14px", fontSize: "12px", color: C.textMuted, whiteSpace: "nowrap" }}>{d.vencimiento}</td>
                            <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}><Badge type={d.estado}>{d.estado}</Badge></td>
                            <td style={{ padding: "12px 14px" }}>
                              <Btn small variant="danger" onClick={() => setConfirmDebt({ id: d.id, accion: "eliminar", nombre: m?.nombre || "-", concepto: d.concepto, saldoPendiente: d.saldoPendiente })}>Eliminar</Btn>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
          );
        })()}

        {/* AVISOS */}
        {tab === "avisos" && (
          <div className="fadeUp">
            <H1 sub="Comunica noticias a todos los miembros">Avisos y Notificaciones</H1>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <Card>
                <div style={{ fontSize: "14px", color: C.gold, fontWeight: "600", marginBottom: "18px" }}>Nuevo Aviso</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div><Label>Ttulo</Label><input value={notifForm.titulo} onChange={e => setNotifForm(f => ({ ...f, titulo: e.target.value }))} placeholder="Ej: Reunin del mes" /></div>
                  <div><Label>Mensaje</Label><textarea value={notifForm.mensaje} onChange={e => setNotifForm(f => ({ ...f, mensaje: e.target.value }))} placeholder="Escribe el aviso..." style={{ minHeight: "110px", resize: "vertical" }} /></div>
                  <div style={{ padding: "10px 14px", background: C.surface2, borderRadius: "8px", fontSize: "12px", color: C.textDim, border: `1px solid ${C.border}` }}>x Visible para <strong style={{ color: C.text }}>todos los miembros activos</strong></div>
                  <Btn onClick={sendNotif}>Publicar Aviso</Btn>
                </div>
              </Card>
              <Card>
                <div style={{ fontSize: "14px", color: C.gold, fontWeight: "600", marginBottom: "16px" }}>Historial de Avisos</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "400px", overflowY: "auto" }}>
                  {notifications.length === 0 ? <EmptyState icon="x" msg="Sin avisos publicados" /> : notifications.map(n => (
                    <div key={n.id} style={{ padding: "14px", background: C.surface2, borderRadius: "10px", border: `1px solid ${C.border}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: C.gold, fontWeight: "600", fontSize: "13px" }}>x {n.titulo}</span>
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

        {/* REPORTES */}
        {tab === "reportes" && (() => {
          const toggleReportSort = (col) => {
            if (reportSortCol === col) setReportSortDir(d => d === "asc" ? "desc" : "asc");
            else { setReportSortCol(col); setReportSortDir("asc"); }
          };

          const ReportSortTh = ({ col, label }) => {
            const active = reportSortCol === col;
            const arrow = active ? (reportSortDir === "asc" ? "  " : "  ") : "  "";
            return (
              <th
                onClick={() => toggleReportSort(col)}
                style={{
                  padding: "11px 14px",
                  textAlign: "left",
                  fontSize: "10px",
                  color: active ? C.goldLight : C.textMuted,
                  letterSpacing: "0.09em",
                  textTransform: "uppercase",
                  fontWeight: "600",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  userSelect: "none",
                  background: active ? `${C.gold}0d` : "transparent",
                }}
              >
                {label}<span style={{ opacity: active ? 1 : 0.35 }}>{arrow}</span>
              </th>
            );
          };

          // 1. Calcular datos por miembro
          const reportRows = members.map(m => {
            const mAbonos = abonos.filter(a => a.miembroId === m.id);
            const mPendingDebts = debts.filter(d => d.miembroId === m.id && d.estado !== "pagada");
            const paid = mAbonos.reduce((s, a) => s + a.monto, 0);
            const owed = mPendingDebts.reduce((s, d) => s + d.saldoPendiente, 0);
            return { m, mAbonos, mPendingDebts, paid, owed };
          });

          // 2. Filtrar por nombre
          const filterText = reportFilter.trim().toLowerCase();
          const filteredRows = filterText
            ? reportRows.filter(r => r.m.nombre.toLowerCase().includes(filterText))
            : reportRows;

          // 3. Ordenar
          const sortedRows = [...filteredRows].sort((a, b) => {
            let va, vb;
            if      (reportSortCol === "miembro")   { va = a.m.nombre;          vb = b.m.nombre; }
            else if (reportSortCol === "abonos")    { va = a.mAbonos.length;    vb = b.mAbonos.length; }
            else if (reportSortCol === "pagado")    { va = a.paid;              vb = b.paid; }
            else if (reportSortCol === "dPend")     { va = a.mPendingDebts.length; vb = b.mPendingDebts.length; }
            else if (reportSortCol === "adeudado")  { va = a.owed;              vb = b.owed; }
            else if (reportSortCol === "estado")    { va = a.owed === 0 ? "Al da" : "Con deuda"; vb = b.owed === 0 ? "Al da" : "Con deuda"; }
            else { va = ""; vb = ""; }
            const cmp = typeof va === "number" ? va - vb : va.localeCompare(vb);
            return reportSortDir === "asc" ? cmp : -cmp;
          });

          // Totales sobre filas visibles (filtradas)
          const visibleTotalPaid   = filteredRows.reduce((s, r) => s + r.paid, 0);
          const visibleTotalOwed   = filteredRows.reduce((s, r) => s + r.owed, 0);
          const visibleTotalAbonos = filteredRows.reduce((s, r) => s + r.mAbonos.length, 0);
          const visibleTotalDPend  = filteredRows.reduce((s, r) => s + r.mPendingDebts.length, 0);
          const isFiltered = filterText.length > 0;

          return (
            <div className="fadeUp">
              <H1 sub="Estado de cuentas y resumen por miembro">Reportes</H1>

              {/* Filtro por nombre */}
              <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ flex: 1, maxWidth: "340px", position: "relative" }}>
                  <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: C.textMuted, fontSize: "14px", pointerEvents: "none" }}>x</span>
                  <input
                    value={reportFilter}
                    onChange={e => setReportFilter(e.target.value)}
                    placeholder="Buscar miembro por nombre..."
                    style={{ paddingLeft: "36px" }}
                  />
                </div>
                {isFiltered && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "12px", color: C.textMuted }}>
                      {sortedRows.length} de {members.length} miembro(s)
                    </span>
                    <button
                      onClick={() => setReportFilter("")}
                      style={{ fontSize: "11px", color: C.textMuted, background: "transparent", border: `1px solid ${C.border}`, borderRadius: "6px", padding: "3px 9px", cursor: "pointer" }}
                    >
                      S" Limpiar
                    </button>
                  </div>
                )}
              </div>

              <Card style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", color: C.textDim, fontWeight: "600" }}>
                    Estado de cuenta por miembro
                    {isFiltered && <span style={{ color: C.goldLight }}>  filtrando por "{reportFilter.trim()}"</span>}
                  </span>
                  <span style={{ fontSize: "11px", color: C.textMuted }}>Haz clic en una columna para ordenar</span>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: C.surface2, borderBottom: `1px solid ${C.border}` }}>
                        <ReportSortTh col="miembro"  label="Miembro" />
                        <ReportSortTh col="abonos"   label="Abonos" />
                        <ReportSortTh col="pagado"   label="Total Abonado" />
                        <ReportSortTh col="dPend"    label="Deudas Pendientes" />
                        <ReportSortTh col="adeudado" label="Total Adeudado" />
                        <ReportSortTh col="estado"   label="Estado" />
                      </tr>
                    </thead>
                    <tbody>
                      {sortedRows.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ padding: "36px", textAlign: "center", color: C.textMuted, fontSize: "13px" }}>
                            No se encontraron miembros con ese nombre.
                          </td>
                        </tr>
                      ) : sortedRows.map(({ m, mAbonos, mPendingDebts, paid, owed }, i) => (
                        <tr key={m.id} style={{ borderBottom: `1px solid ${C.border}40`, background: i % 2 ? `${C.surface2}50` : "transparent" }}>
                          <td style={{ padding: "13px 14px", fontSize: "14px", color: C.text, fontWeight: "500", whiteSpace: "nowrap" }}>{m.nombre}</td>
                          <td style={{ padding: "13px 14px", fontSize: "13px", color: C.textDim }}>{mAbonos.length}</td>
                          <td style={{ padding: "13px 14px", fontSize: "13px", color: C.greenBright, fontWeight: "600", whiteSpace: "nowrap" }}>${paid}</td>
                          <td style={{ padding: "13px 14px", fontSize: "13px", color: C.textDim }}>{mPendingDebts.length}</td>
                          <td style={{ padding: "13px 14px", fontSize: "13px", color: owed > 0 ? "#dc2626" : C.textMuted, fontWeight: owed > 0 ? "700" : "400", whiteSpace: "nowrap" }}>${owed}</td>
                          <td style={{ padding: "13px 14px" }}><Badge type={owed === 0 ? "pagado" : "vencida"}>{owed === 0 ? "Al da" : "Con deuda"}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr style={{ borderTop: `2px solid ${C.border}`, background: `${C.gold}10` }}>
                        <td style={{ padding: "13px 14px", fontSize: "12px", color: C.goldLight, fontWeight: "700" }}>
                          {isFiltered ? `SUBTOTAL (${sortedRows.length})` : "TOTAL"}
                        </td>
                        <td style={{ padding: "13px 14px", fontSize: "13px", color: C.textDim }}>{visibleTotalAbonos}</td>
                        <td style={{ padding: "13px 14px", fontSize: "13px", color: C.greenBright, fontWeight: "700" }}>${visibleTotalPaid}</td>
                        <td style={{ padding: "13px 14px", fontSize: "13px", color: C.textDim }}>{visibleTotalDPend}</td>
                        <td style={{ padding: "13px 14px", fontSize: "13px", color: "#dc2626", fontWeight: "700" }}>${visibleTotalOwed}</td>
                        <td style={{ padding: "13px 14px", fontSize: "10px", color: C.textMuted, letterSpacing: "0.05em" }}>
                          {isFiltered ? "solo visibles" : "global"}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </Card>
            </div>
          );
        })()}
      </main>

      {confirmDelete && (
        <div className="fadeIn" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.78)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 250 }} onClick={(e) => e.target === e.currentTarget && cancelDeleteMember()}>
          <div className="fadeUp" style={{ background: C.surface, border: `1px solid ${C.errorBorder}`, borderRadius: "18px", padding: "28px", width: "440px", maxWidth: "92vw", boxShadow: "0 30px 80px rgba(0,0,0,0.72)" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: C.errorBg, border: `1px solid ${C.errorBorder}`, color: C.errorColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", marginBottom: "16px" }}>!</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "23px", marginBottom: "8px", fontWeight: "600", color: C.text }}>Confirmar eliminacin</h2>
            <p style={{ color: C.textDim, fontSize: "13px", lineHeight: "1.55", marginBottom: "14px" }}>
              Vas a eliminar a <strong style={{ color: C.text }}>{confirmDelete.member.nombre}</strong>. Esta accin tambin quitar sus registros asociados.
            </p>
            <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "12px 14px", marginBottom: "22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: C.textDim, fontSize: "12px", marginBottom: "6px" }}>
                <span>Abonos asociados</span>
                <strong style={{ color: C.greenBright }}>{confirmDelete.pagosCount}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: C.textDim, fontSize: "12px" }}>
                <span>Deudas asociadas</span>
                <strong style={{ color: "#ff7070" }}>{confirmDelete.deudasCount}</strong>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <Btn variant="ghost" onClick={cancelDeleteMember}>Cancelar</Btn>
              <Btn variant="danger" onClick={confirmDeleteMember}>S, eliminar</Btn>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE MIEMBRO */}
      {modal && (
        <div className="fadeIn" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }} onClick={(e) => e.target === e.currentTarget && setModal(false)}>
          <div className="fadeUp" style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "20px", padding: "32px", width: "880px", maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", marginBottom: "22px", fontWeight: "600" }}>
              {editTarget ? "S Editar Miembro" : "x Agregar Miembro"}
            </h2>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: C.surface2, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "14px 18px", marginBottom: "18px" }}>
              <div style={{ fontSize: "12px", color: C.textDim }}>Ficha No. <strong style={{ color: C.gold }}>{form.fichaNumero}</strong></div>
              <div style={{ fontSize: "12px", color: C.textMuted }}>Los datos se guardan en el perfil del miembro.</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <ModalSection title="Datos de inscripcion">
                <ModalField label="No. de ficha" error={memberErrors.fichaNumero}>
                  <input value={form.fichaNumero} onChange={e => setForm(f => ({ ...f, fichaNumero: e.target.value }))} />
                </ModalField>
                <ModalField label="Fecha de inscripcion">
                  <input type="date" value={form.fechaInscripcion} onChange={e => setForm(f => ({ ...f, fechaInscripcion: e.target.value }))} />
                </ModalField>
                <ModalField label="Nombres" error={memberErrors.nombres}>
                  <input value={form.nombres} onChange={e => { setForm(f => ({ ...f, nombres: e.target.value })); setMemberErrors(p => ({ ...p, nombres: "" })); }} placeholder="Ej: Ricardo Enrique" style={inputConError(memberErrors.nombres)} />
                </ModalField>
                <ModalField label="Apellido" error={memberErrors.apellido}>
                  <input value={form.apellido} onChange={e => { setForm(f => ({ ...f, apellido: e.target.value })); setMemberErrors(p => ({ ...p, apellido: "" })); }} placeholder="Ej: Alvarez Rodriguez" style={inputConError(memberErrors.apellido)} />
                </ModalField>
                <ModalField label="Correo" error={memberErrors.email}>
                  <input type="email" value={form.email} onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setMemberErrors(p => ({ ...p, email: "" })); }} placeholder="correo@jokili.com" style={inputConError(memberErrors.email)} />
                </ModalField>
                <ModalField label="Contrasena" error={memberErrors.password}>
                  <input type="password" value={form.password} onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setMemberErrors(p => ({ ...p, password: "" })); }} placeholder="Minimo 8 caracteres" style={inputConError(memberErrors.password)} />
                </ModalField>
                <ModalField label="Cedula" error={memberErrors.cedula}>
                  <input value={form.cedula} onChange={e => { setForm(f => ({ ...f, cedula: e.target.value })); setMemberErrors(p => ({ ...p, cedula: "" })); }} placeholder="V-12.345.678" style={inputConError(memberErrors.cedula)} />
                </ModalField>
                <ModalField label="Fecha de nacimiento">
                  <input type="date" value={form.fechaNacimiento} onChange={e => setForm(f => ({ ...f, fechaNacimiento: e.target.value }))} />
                </ModalField>
                <ModalField label="Sexo">
                  <select value={form.sexo} onChange={e => setForm(f => ({ ...f, sexo: e.target.value }))}>
                    <option value="">Seleccionar...</option>
                    <option>Masculino</option>
                    <option>Femenino</option>
                  </select>
                </ModalField>
                <ModalField label="Nombre conyuge">
                  <input value={form.conyuge} onChange={e => setForm(f => ({ ...f, conyuge: e.target.value }))} />
                </ModalField>
                <ModalField label="Lugar de nacimiento">
                  <input value={form.lugarNacimiento} onChange={e => setForm(f => ({ ...f, lugarNacimiento: e.target.value }))} />
                </ModalField>
                <ModalField label="Profesion u ocupacion">
                  <input value={form.profesion} onChange={e => setForm(f => ({ ...f, profesion: e.target.value }))} />
                </ModalField>
              </ModalSection>

              <ModalSection title="Contacto y direccion">
                <ModalField label="Direccion de habitacion" wide>
                  <input value={form.direccion} onChange={e => setForm(f => ({ ...f, direccion: e.target.value }))} />
                </ModalField>
                <ModalField label="Estado">
                  <input value={form.estadoRegion} onChange={e => setForm(f => ({ ...f, estadoRegion: e.target.value }))} />
                </ModalField>
                <ModalField label="Municipio">
                  <input value={form.municipio} onChange={e => setForm(f => ({ ...f, municipio: e.target.value }))} />
                </ModalField>
                <ModalField label="Ciudad">
                  <input value={form.ciudad} onChange={e => setForm(f => ({ ...f, ciudad: e.target.value }))} />
                </ModalField>
                <ModalField label="Telefono habitacion">
                  <input value={form.telefonoHabitacion} onChange={e => setForm(f => ({ ...f, telefonoHabitacion: e.target.value }))} />
                </ModalField>
                <ModalField label="Celular" error={memberErrors.celular}>
                  <input value={form.celular} onChange={e => { setForm(f => ({ ...f, celular: e.target.value })); setMemberErrors(p => ({ ...p, celular: "" })); }} placeholder="0412-..." style={inputConError(memberErrors.celular)} />
                </ModalField>
              </ModalSection>

              <ModalSection title="Datos del club">
                <ModalField label="No. de broche">
                  <input value={form.broche} onChange={e => setForm(f => ({ ...f, broche: e.target.value }))} />
                </ModalField>
                <ModalField label="No. de carnet">
                  <input value={form.carnet} onChange={e => setForm(f => ({ ...f, carnet: e.target.value }))} />
                </ModalField>
                <ModalField label="Padrino">
                  <input value={form.padrino} onChange={e => setForm(f => ({ ...f, padrino: e.target.value }))} />
                </ModalField>
                <ModalField label="Cuota anual que cancela">
                  <input value={form.cuotaAnual} onChange={e => setForm(f => ({ ...f, cuotaAnual: e.target.value }))} />
                </ModalField>
                <ModalField label="Cargo actual">
                  <select value={form.cargo} onChange={e => setForm(f => ({ ...f, cargo: e.target.value }))}>
                    {["Miembro", "Vocal", "Secretario/a", "Tesorero/a", "Vicepresidente/a", "Presidente/a", "Oberzunftmeister"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </ModalField>
                <ModalField label="Fecha del cargo">
                  <input type="date" value={form.fechaCargo} onChange={e => setForm(f => ({ ...f, fechaCargo: e.target.value }))} />
                </ModalField>
                <ModalField label="Estado del miembro">
                  <select value={form.activo ? "true" : "false"} onChange={e => setForm(f => ({ ...f, activo: e.target.value === "true" }))}>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </ModalField>
              </ModalSection>

              <ModalSection title="Tradiciones Jokili" special>
                <ModalField label="Bautizado">
                  <select value={form.bautizado} onChange={e => setForm(f => ({ ...f, bautizado: e.target.value }))}>
                    <option value="si">Si</option>
                    <option value="no">No</option>
                  </select>
                </ModalField>
                <ModalField label="Fecha de bautismo">
                  <input type="date" value={form.fechaBautismo} onChange={e => setForm(f => ({ ...f, fechaBautismo: e.target.value }))} />
                </ModalField>
                <ModalField label="Fue Oberjokili">
                  <select value={form.oberjokili} onChange={e => setForm(f => ({ ...f, oberjokili: e.target.value }))}>
                    <option value="si">Si</option>
                    <option value="no">No</option>
                  </select>
                </ModalField>
                <ModalField label="Periodo como Oberjokili">
                  <input value={form.periodoOberjokili} onChange={e => setForm(f => ({ ...f, periodoOberjokili: e.target.value }))} />
                </ModalField>
                <ModalField label="Bautizado en Jokili Brunnen">
                  <select value={form.brunnen} onChange={e => setForm(f => ({ ...f, brunnen: e.target.value }))}>
                    <option value="si">Si</option>
                    <option value="no">No</option>
                  </select>
                </ModalField>
                <ModalField label="Ano Jokili Brunnen">
                  <input value={form.anioBrunnen} onChange={e => setForm(f => ({ ...f, anioBrunnen: e.target.value }))} />
                </ModalField>
                <ModalField label="Otros" wide>
                  <textarea value={form.otros} onChange={e => setForm(f => ({ ...f, otros: e.target.value }))} rows={3} />
                </ModalField>
              </ModalSection>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "24px", justifyContent: "flex-end" }}>
              <Btn variant="ghost" onClick={() => setModal(false)}>Cancelar</Btn>
              <Btn onClick={saveMember}>{editTarget ? "Guardar cambios" : "Agregar miembro"}</Btn>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMACIN DE ACCIN EN DEUDA */}
      {confirmDebt && (
        <div className="fadeIn" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 250 }} onClick={e => e.target === e.currentTarget && setConfirmDebt(null)}>
          <div className="fadeUp" style={{ background: C.surface, border: `1px solid ${C.errorBorder}`, borderRadius: "18px", padding: "28px", width: "420px", maxWidth: "92vw", boxShadow: "0 30px 80px rgba(0,0,0,0.65)" }}>
            <div style={{ width: "46px", height: "46px", borderRadius: "50%", background: C.errorBg, border: `1px solid ${C.errorBorder}`, color: C.errorColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", marginBottom: "16px" }}>x</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", marginBottom: "8px", fontWeight: "600", color: C.text }}>Eliminar deuda</h2>
            <p style={{ color: C.textDim, fontSize: "13px", lineHeight: "1.6", marginBottom: "16px" }}>Vas a <strong style={{ color: C.text }}>eliminar permanentemente</strong> esta deuda y sus abonos asociados.</p>
            <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "12px 14px", marginBottom: "22px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: C.textDim }}>
                <span>Miembro</span><strong style={{ color: C.text }}>{confirmDebt.nombre}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: C.textDim }}>
                <span>Concepto</span><strong style={{ color: C.text }}>{confirmDebt.concepto}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: C.textDim }}>
                <span>Saldo pendiente</span><strong style={{ color: "#dc2626" }}>${confirmDebt.saldoPendiente}</strong>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <Btn variant="ghost" onClick={() => setConfirmDebt(null)}>Cancelar</Btn>
              <Btn variant="danger" onClick={ejecutarConfirmDebt}>S, eliminar</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};




