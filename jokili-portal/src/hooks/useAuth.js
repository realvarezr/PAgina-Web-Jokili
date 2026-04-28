import { useMemo, useState } from 'react'
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase.js";
import { validateAccountActivation } from '../logic/authLogic.js'
import {
  clearCurrentUser,
  getCurrentUser,
  getMemberInvitationByToken,
  getMembers,
  getMemberAccounts,
  markInvitationAsAccepted,
  saveMemberAccount,
  setCurrentUser,
} from '../services/dataService.js'

async function getValidatedAdminUser(firebaseUser) {
  let userSnapshot = null

  try {
    userSnapshot = await getDoc(doc(db, 'users', firebaseUser.uid))
  } catch (error) {
    console.error('Firestore user validation error:', error)
    throw new Error('No se pudo conectar con Firestore. Revisa configuración Firebase o reglas.')
  }

  if (!userSnapshot.exists()) {
    throw new Error('No existe un perfil autorizado para este usuario.')
  }

  const userData = userSnapshot.data()

  if (userData.active !== true) {
    throw new Error('Este usuario no esta activo.')
  }

  if (userData.role !== 'admin') {
    throw new Error('Este usuario no tiene permisos de administrador.')
  }

  return {
    id: firebaseUser.uid,
    uid: firebaseUser.uid,
    email: userData.email || firebaseUser.email,
    username: userData.email || firebaseUser.email,
    name: userData.name || userData.email || firebaseUser.email,
    role: userData.role,
  }
}

export function useAuth() {
  const [currentUser, setUserState] = useState(getCurrentUser)
  const isAuthenticated = Boolean(currentUser)

  async function login(username, password) {
    try {
      const credential = await signInWithEmailAndPassword(auth, username, password);

      const firebaseUser = credential.user;
      const user = await getValidatedAdminUser(firebaseUser);

      setCurrentUser(user);
      setUserState(user);

      return { ok: true, user };
    } catch (error) {
      await signOut(auth);
      clearCurrentUser();
      setUserState(null);
      console.error("Firebase login error:", error.code, error.message);

      return {
        ok: false,
        message: error.code ? 'Correo o clave incorrectos.' : error.message
      };
    }
  }

  async function logout() {
    await signOut(auth);
    clearCurrentUser();
    setUserState(null);
  }

  async function activateInvitation(token, accountData) {
    const invitation = await getMemberInvitationByToken(token)
    if (!invitation || invitation.status === 'accepted') {
      return { ok: false, message: 'La invitacion no existe o ya fue usada.' }
    }

    const members = await getMembers()
    const member = members.find((item) => item.id === invitation.memberId)
    if (!member) return { ok: false, message: 'No se encontro la ficha del socio.' }

    const validationError = validateAccountActivation(accountData)
    if (validationError) return { ok: false, message: validationError }

    const accounts = await getMemberAccounts()
    const normalizedUsername = accountData.username.trim().toLowerCase()
    const usernameExists = accounts.some(
      (account) =>
        account.username.toLowerCase() === normalizedUsername &&
        account.memberId !== invitation.memberId
    )

    if (usernameExists) return { ok: false, message: 'Ese usuario ya esta en uso.' }

    const account = await saveMemberAccount({
      id: `user-${invitation.memberId}`,
      username: accountData.username.trim(),
      email: invitation.email,
      password: accountData.password,
      role: 'member',
      memberId: invitation.memberId,
      createdAt: new Date().toISOString(),
    })

    await markInvitationAsAccepted(token)

    const user = {
      id: account.id,
      username: account.username,
      email: account.email,
      role: account.role,
      memberId: account.memberId,
    }

    setCurrentUser(user)
    setUserState(user)
    return { ok: true, user }
  }

  return useMemo(
    () => ({
      currentUser,
      isAuthenticated,
      login,
      logout,
      activateInvitation,
    }),
    [currentUser, isAuthenticated]
  )
}
