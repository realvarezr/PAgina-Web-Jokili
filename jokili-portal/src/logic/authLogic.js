import { users } from '../data/users.js'

function normalizeEmail(value) {
  return value.trim().toLowerCase()
}

function authenticateAdminOrStaticUser(username, password) {
  const normalizedUsername = username.trim().toLowerCase()

  const user = users.find(
    (item) =>
      item.username.toLowerCase() === normalizedUsername &&
      item.password === password
  )

  if (!user) return null

  const { password: _password, ...safeUser } = user
  return safeUser
}

function authenticateMemberAccount(login, password, memberAccounts) {
  const normalizedLogin = login.trim().toLowerCase()
  const account = memberAccounts.find(
    (item) =>
      item.password === password &&
      (item.username.toLowerCase() === normalizedLogin ||
        normalizeEmail(item.email) === normalizedLogin)
  )

  if (!account) return null

  return {
    id: account.id,
    username: account.username,
    email: account.email,
    role: 'member',
    memberId: account.memberId,
  }
}

export function authenticateUser(username, password, memberAccounts = []) {
  return (
    authenticateAdminOrStaticUser(username, password) ??
    authenticateMemberAccount(username, password, memberAccounts)
  )
}

export function validateAccountActivation({ username, password, confirmPassword }) {
  if (!username.trim()) return 'El usuario es obligatorio.'
  if (username.trim().length < 3) return 'El usuario debe tener al menos 3 caracteres.'
  if (!password) return 'La clave es obligatoria.'
  if (password.length < 4) return 'La clave debe tener al menos 4 caracteres.'
  if (password !== confirmPassword) return 'Las claves no coinciden.'
  return ''
}

export function canAccessAdmin(user) {
  return user?.role === 'admin'
}

export function canAccessMemberPortal(user) {
  return user?.role === 'member' && Boolean(user.memberId)
}
