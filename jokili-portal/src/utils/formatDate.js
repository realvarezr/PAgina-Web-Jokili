// Handles both DD-MM-YYYY (club format) and YYYY-MM-DD
function parseDateStr(dateStr) {
  if (!dateStr) return null
  const parts = dateStr.split('-')
  if (parts.length !== 3) return null
  if (parts[0].length === 2) {
    // DD-MM-YYYY
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`)
  }
  return new Date(dateStr + 'T00:00:00')
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  const parts = dateStr.split('-')
  if (parts[0].length === 2) return `${parts[0]}.${parts[1]}.${parts[2]}`
  const [y, m, d] = parts
  return `${d}.${m}.${y}`
}

export function formatDateLong(dateStr) {
  if (!dateStr) return '—'
  const date = parseDateStr(dateStr)
  if (!date) return dateStr
  return date.toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function yearsSince(dateStr) {
  if (!dateStr) return 0
  const date = parseDateStr(dateStr)
  if (!date) return 0
  return Math.floor((new Date() - date) / (1000 * 60 * 60 * 24 * 365.25))
}
