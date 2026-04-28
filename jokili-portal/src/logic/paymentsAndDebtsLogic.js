// ============================================================
// FUNCIONES PURAS — reciben datos como argumentos
// ============================================================

export function getMemberDebts(memberId, debts) {
  return debts.filter((d) => d.memberId === memberId)
}

export function getMemberPayments(memberId, payments) {
  return payments.filter((p) => p.memberId === memberId)
}

export function getTotalDebts(memberId, debts) {
  return getMemberDebts(memberId, debts).reduce((acc, d) => acc + d.amount, 0)
}

export function getTotalPayments(memberId, payments) {
  return getMemberPayments(memberId, payments).reduce((acc, p) => acc + p.amount, 0)
}

export function getMemberBalance(memberId, debts, payments) {
  const totalDebts = getTotalDebts(memberId, debts)
  const totalPayments = getTotalPayments(memberId, payments)
  return totalDebts - totalPayments
}
