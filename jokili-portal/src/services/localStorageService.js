import { debts as initialDebts } from '../data/debts.js'
import { getAllMembers } from '../logic/memberLogic.js'

const STORAGE_KEYS = {
  currentUser: 'jokili_current_user',
  members: 'jokili_members',
  debts: 'jokili_debts',
  payments: 'jokili_payments',
  legacyPayments: 'jokili_manual_payments',
  memberAccounts: 'jokili_member_accounts',
  memberInvitations: 'jokili_member_invitations',
  messages: 'jokili_messages',
}

function readJson(key, fallback) {
  try {
    const stored = localStorage.getItem(key)
    if (!stored) return fallback

    const parsed = JSON.parse(stored)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // La app puede seguir funcionando en memoria si el navegador bloquea storage.
  }
}

function readArray(key, fallback) {
  const parsed = readJson(key, fallback)
  return Array.isArray(parsed) ? parsed : fallback
}

export function getCurrentUser() {
  return readJson(STORAGE_KEYS.currentUser, null)
}

export function setCurrentUser(user) {
  writeJson(STORAGE_KEYS.currentUser, user)
}

export function clearCurrentUser() {
  try {
    localStorage.removeItem(STORAGE_KEYS.currentUser)
  } catch {
    // Ignorar errores de limpieza local.
  }
}

export function getMembers() {
  return readArray(STORAGE_KEYS.members, getAllMembers())
}

export function saveMembers(members) {
  writeJson(STORAGE_KEYS.members, members)
}

export function getDebts() {
  return readArray(STORAGE_KEYS.debts, initialDebts)
}

export function saveDebts(debts) {
  writeJson(STORAGE_KEYS.debts, debts)
}

export function getPayments() {
  const payments = readArray(STORAGE_KEYS.payments, null)
  if (payments) return payments

  return readArray(STORAGE_KEYS.legacyPayments, [])
}

export function savePayments(payments) {
  writeJson(STORAGE_KEYS.payments, payments)
}

export function getMemberAccounts() {
  return readArray(STORAGE_KEYS.memberAccounts, [])
}

export function saveMemberAccounts(accounts) {
  writeJson(STORAGE_KEYS.memberAccounts, accounts)
}

export function getMemberInvitations() {
  return readArray(STORAGE_KEYS.memberInvitations, [])
}

export function saveMemberInvitations(invitations) {
  writeJson(STORAGE_KEYS.memberInvitations, invitations)
}

export function getMessages() {
  return readArray(STORAGE_KEYS.messages, [])
}

export function saveMessages(messages) {
  writeJson(STORAGE_KEYS.messages, messages)
}

export function getMemberInvitationByToken(token) {
  return getMemberInvitations().find((invitation) => invitation.token === token) ?? null
}

export function saveMemberAccount(account) {
  const accounts = getMemberAccounts()
  const updated = [
    ...accounts.filter((item) => item.memberId !== account.memberId),
    account,
  ]
  saveMemberAccounts(updated)
  return account
}

export function markInvitationAsAccepted(token) {
  const invitations = getMemberInvitations()
  const updated = invitations.map((invitation) =>
    invitation.token === token
      ? {
          ...invitation,
          status: 'accepted',
          acceptedAt: new Date().toISOString(),
        }
      : invitation
  )
  saveMemberInvitations(updated)
}
