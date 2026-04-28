export function formatCurrency(amount, currency = 'CHF') {
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}
