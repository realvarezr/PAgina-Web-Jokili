import * as localStorageService from './localStorageService.js'
import { db } from './firebase.js'

const COLLECTION = 'jokiliPortal'
let firestoreModules = null

const LOCAL_READERS = {
  members: localStorageService.getMembers,
  debts: localStorageService.getDebts,
  payments: localStorageService.getPayments,
  memberAccounts: localStorageService.getMemberAccounts,
  memberInvitations: localStorageService.getMemberInvitations,
  messages: localStorageService.getMessages,
}

const LOCAL_WRITERS = {
  members: localStorageService.saveMembers,
  debts: localStorageService.saveDebts,
  payments: localStorageService.savePayments,
  memberAccounts: localStorageService.saveMemberAccounts,
  memberInvitations: localStorageService.saveMemberInvitations,
  messages: localStorageService.saveMessages,
}

function getFallback(key) {
  return LOCAL_READERS[key]?.() ?? []
}

async function getFirestoreModules() {
  if (firestoreModules) return firestoreModules

  const { doc, getDoc, serverTimestamp, setDoc } = await import('firebase/firestore')

  firestoreModules = { doc, getDoc, serverTimestamp, setDoc, firestoreDb: db }
  return firestoreModules
}

async function readItems(key) {
  try {
    const firebase = await getFirestoreModules()
    if (!firebase?.firestoreDb) return getFallback(key)
    const { doc, getDoc, serverTimestamp, setDoc, firestoreDb } = firebase
    const snapshot = await getDoc(doc(firestoreDb, COLLECTION, key))
    if (!snapshot.exists()) {
      const fallback = getFallback(key)
      await setDoc(
        doc(firestoreDb, COLLECTION, key),
        {
          items: fallback,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )
      return fallback
    }

    const items = snapshot.exists() ? snapshot.data()?.items : null
    return Array.isArray(items) ? items : getFallback(key)
  } catch (error) {
    console.warn(`Firebase read failed for ${key}; using local fallback.`, error)
    return getFallback(key)
  }
}

async function writeItems(key, items) {
  try {
    const firebase = await getFirestoreModules()
    if (!firebase?.firestoreDb) {
      LOCAL_WRITERS[key]?.(items)
      return items
    }
    const { doc, serverTimestamp, setDoc, firestoreDb } = firebase

    await setDoc(
      doc(firestoreDb, COLLECTION, key),
      {
        items,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    )
  } catch (error) {
    console.warn(`Firebase write failed for ${key}; saving local fallback.`, error)
    LOCAL_WRITERS[key]?.(items)
  }

  return items
}

export function getCurrentUser() {
  return localStorageService.getCurrentUser()
}

export function setCurrentUser(user) {
  localStorageService.setCurrentUser(user)
}

export function clearCurrentUser() {
  localStorageService.clearCurrentUser()
}

export const getMembers = () => readItems('members')
export const saveMembers = (members) => writeItems('members', members)
export const getDebts = () => readItems('debts')
export const saveDebts = (debts) => writeItems('debts', debts)
export const getPayments = () => readItems('payments')
export const savePayments = (payments) => writeItems('payments', payments)
export const getMemberAccounts = () => readItems('memberAccounts')
export const saveMemberAccounts = (accounts) => writeItems('memberAccounts', accounts)
export const getMemberInvitations = () => readItems('memberInvitations')
export const saveMemberInvitations = (invitations) => writeItems('memberInvitations', invitations)
export const getMessages = () => readItems('messages')
export const saveMessages = (messages) => writeItems('messages', messages)

export async function getMemberInvitationByToken(token) {
  const invitations = await getMemberInvitations()
  return invitations.find((invitation) => invitation.token === token) ?? null
}

export async function saveMemberAccount(account) {
  const accounts = await getMemberAccounts()
  const updated = [
    ...accounts.filter((item) => item.memberId !== account.memberId),
    account,
  ]
  await saveMemberAccounts(updated)
  return account
}

export async function markInvitationAsAccepted(token) {
  const invitations = await getMemberInvitations()
  const updated = invitations.map((invitation) =>
    invitation.token === token
      ? {
          ...invitation,
          status: 'accepted',
          acceptedAt: new Date().toISOString(),
        }
      : invitation
  )
  await saveMemberInvitations(updated)
}
