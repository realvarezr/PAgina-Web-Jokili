// Funciones puras de validación — separadas de paymentLogic.js

export function validatePayment(data) {
  const errors = {}

  if (!data.memberId) {
    errors.memberId = 'El socio es obligatorio.'
  }

  if (!data.type) {
    errors.type = 'El tipo de pago es obligatorio.'
  }

  const year = Number(data.year)
  if (!data.year || isNaN(year)) {
    errors.year = 'El año es obligatorio.'
  }

  const amount = Number(data.amount)
  if (data.amount === '' || data.amount === null || data.amount === undefined) {
    errors.amount = 'El monto es obligatorio.'
  } else if (isNaN(amount) || amount <= 0) {
    errors.amount = 'El monto debe ser mayor que 0.'
  } else if (amount > 9999) {
    errors.amount = 'El monto no puede superar 9999.'
  }

  if (!data.currency) {
    errors.currency = 'La moneda es obligatoria.'
  }

  if (!data.paidAt) {
    errors.paidAt = 'La fecha de pago es obligatoria.'
  }

  if (!data.method) {
    errors.method = 'El método de pago es obligatorio.'
  }

  if (!data.concept || !data.concept.trim()) {
    errors.concept = 'El concepto es obligatorio.'
  }

  return errors
}

export function isValidPayment(data) {
  return Object.keys(validatePayment(data)).length === 0
}
