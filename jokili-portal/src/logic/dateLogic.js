export function isOverdue(dateStr) {
  if (!dateStr) return false
  const today = new Date()
  const date = new Date(dateStr + 'T00:00:00')
  return date < today
}

export function daysBetween(dateStrA, dateStrB) {
  const a = new Date(dateStrA + 'T00:00:00')
  const b = new Date(dateStrB + 'T00:00:00')
  return Math.round((b - a) / (1000 * 60 * 60 * 24))
}

export function getCurrentYear() {
  return new Date().getFullYear()
}
