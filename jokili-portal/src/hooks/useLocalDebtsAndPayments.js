import { useState } from 'react'
import {
  getDebts,
  getPayments,
  saveDebts,
  savePayments,
} from '../services/localStorageService.js'

export function useLocalDebtsAndPayments() {
  const [debts, setDebts] = useState(getDebts)
  const [manualPayments, setManualPayments] = useState(getPayments)

  function addDebt(newDebt) {
    const debt = {
      ...newDebt,
      id: `d-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    }
    setDebts((prev) => {
      const updated = [...prev, debt]
      saveDebts(updated)
      return updated
    })
  }

  function addManualPayment(newPayment) {
    const payment = {
      ...newPayment,
      id: `mp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    }
    setManualPayments((prev) => {
      const updated = [...prev, payment]
      savePayments(updated)
      return updated
    })
  }

  return { debts, manualPayments, addDebt, addManualPayment }
}
