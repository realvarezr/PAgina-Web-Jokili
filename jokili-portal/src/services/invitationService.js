import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db } from './firebase.js'

const APP_COLLECTION = 'jokiliPortal'
const INVITATIONS_KEY = 'memberInvitations'
const MEMBERS_KEY = 'members'

async function getAppItems(key) {
  const snapshot = await getDoc(doc(db, APP_COLLECTION, key))
  const items = snapshot.exists() ? snapshot.data()?.items : []
  return Array.isArray(items) ? items : []
}

async function saveAppItems(key, items) {
  await setDoc(
    doc(db, APP_COLLECTION, key),
    {
      items,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}

export async function getInvitationByToken(token) {
  if (!token) return null

  const invitations = await getAppItems(INVITATIONS_KEY)
  const invitation = invitations.find((item) => item.token === token)

  return invitation ?? null
}

export async function markInvitationAsUsed(invitationId) {
  try {
    const invitations = await getAppItems(INVITATIONS_KEY)
    const hasAppInvitation = invitations.some((item) => item.id === invitationId)

    if (hasAppInvitation) {
      const updated = invitations.map((item) =>
        item.id === invitationId
          ? { ...item, status: 'used', updatedAt: new Date().toISOString() }
          : item
      )
      await saveAppItems(INVITATIONS_KEY, updated)
      return
    }
  } catch (error) {
    console.warn('No se pudo actualizar la invitacion en datos de la app.', error)
  }

  await updateDoc(doc(db, 'memberInvitations', invitationId), {
    status: 'used',
    updatedAt: serverTimestamp(),
  })
}

export async function linkMemberAccount(memberId, uid) {
  try {
    const members = await getAppItems(MEMBERS_KEY)
    const hasAppMember = members.some((member) => member.id === memberId)

    if (hasAppMember) {
      const updated = members.map((member) =>
        member.id === memberId ? { ...member, uid } : member
      )
      await saveAppItems(MEMBERS_KEY, updated)
      return
    }
  } catch (error) {
    console.warn('No se pudo vincular el socio en datos de la app.', error)
  }

  await updateDoc(doc(db, 'members', memberId), { uid })
}
