import { members } from '../data/members.js'

export function getMemberFullName(member) {
  return `${member.nombres} ${member.apellido}`
}

export function getMemberStatus(member) {
  const c = (member.cuotaCancelada ?? '').toLowerCase()
  if (c.includes('honor') || c.includes('exonera')) return 'honorario'
  if (c === 'si') return 'activo'
  return 'inactivo'
}

export function getAllMembers() {
  return members
}

export function getMemberById(id) {
  return members.find((m) => m.id === id) ?? null
}

export function filterMembers(memberList, query) {
  if (!query.trim()) return memberList
  const q = query.toLowerCase()
  return memberList.filter(
    (m) =>
      getMemberFullName(m).toLowerCase().includes(q) ||
      (m.numeroCarnet ?? '').toLowerCase().includes(q) ||
      (m.cargoActual ?? '').toLowerCase().includes(q) ||
      (m.cedula ?? '').toLowerCase().includes(q) ||
      (m.fichaNro ?? '').toLowerCase().includes(q)
  )
}

export function countByStatus(memberList) {
  let activos = 0, honorarios = 0, inactivos = 0
  for (const m of memberList) {
    const s = getMemberStatus(m)
    if (s === 'activo') activos++
    else if (s === 'honorario') honorarios++
    else inactivos++
  }
  return { activos, honorarios, inactivos, total: memberList.length }
}
