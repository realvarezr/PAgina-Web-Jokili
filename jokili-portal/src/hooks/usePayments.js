import { payments } from '../data/payments.js'
import { annualFees } from '../data/annualFees.js'

export function usePayments() {
  return { payments, annualFees }
}
