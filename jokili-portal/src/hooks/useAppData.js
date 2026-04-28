import { useEffect, useMemo, useState } from 'react'
import { countByStatus, getMemberStatus } from '../logic/memberLogic.js'
import {
  getDebts,
  getMemberAccounts,
  getMemberInvitations,
  getMembers,
  getMessages,
  getPayments,
  saveDebts,
  saveMemberInvitations,
  saveMembers,
  saveMessages,
  savePayments,
} from '../services/dataService.js'

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function useAppData() {
  const [members, setMembers] = useState([])
  const [debts, setDebts] = useState([])
  const [payments, setPayments] = useState([])
  const [memberInvitations, setMemberInvitations] = useState([])
  const [memberAccounts, setMemberAccounts] = useState([])
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function loadData() {
      const [
        loadedMembers,
        loadedDebts,
        loadedPayments,
        loadedInvitations,
        loadedAccounts,
        loadedMessages,
      ] = await Promise.all([
        getMembers(),
        getDebts(),
        getPayments(),
        getMemberInvitations(),
        getMemberAccounts(),
        getMessages(),
      ])

      if (ignore) return
      setMembers(loadedMembers)
      setDebts(loadedDebts)
      setPayments(loadedPayments)
      setMemberInvitations(loadedInvitations)
      setMemberAccounts(loadedAccounts)
      setMessages(loadedMessages)
      setIsLoading(false)
    }

    loadData().catch(() => {
      if (!ignore) setIsLoading(false)
    })
    return () => {
      ignore = true
    }
  }, [])

  const stats = useMemo(() => countByStatus(members), [members])

  function addMember(memberData) {
    const member = {
      ...memberData,
      id: createId('m'),
    }

    setMembers((prev) => {
      const updated = [...prev, member]
      saveMembers(updated)
      return updated
    })

    createMemberInvitation(member)
    return member
  }

  function updateMember(memberId, memberData) {
    let updatedMember = null

    setMembers((prev) => {
      const updated = prev.map((member) => {
        if (member.id !== memberId) return member

        updatedMember = {
          ...member,
          ...memberData,
          id: member.id,
        }
        return updatedMember
      })

      saveMembers(updated)
      return updated
    })

    return updatedMember
  }

  function deleteMember(memberId) {
    setMembers((prev) => {
      const updated = prev.filter((m) => m.id !== memberId)
      saveMembers(updated)
      return updated
    })
  }

  function createMemberInvitation(member) {
    if (!member.email) return null

    const invitation = {
      id: createId('invite'),
      token: createId('token'),
      memberId: member.id,
      email: member.email,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    setMemberInvitations((prev) => {
      const updated = [
        ...prev.filter((item) => item.memberId !== member.id || item.status === 'accepted'),
        invitation,
      ]
      saveMemberInvitations(updated)
      return updated
    })

    return invitation
  }

  function addDebt(newDebt) {
    const debt = {
      ...newDebt,
      id: createId('d'),
    }

    setDebts((prev) => {
      const updated = [...prev, debt]
      saveDebts(updated)
      return updated
    })
  }

  function addAnnualFee({ description, amount, currency }) {
    const today = new Date().toISOString().slice(0, 10)
    const activeMembers = members.filter((m) => getMemberStatus(m) === 'activo')
    const membersWithoutFee = activeMembers.filter(
      (member) =>
        !debts.some(
          (debt) => debt.memberId === member.id && debt.description === description
        )
    )
    const newDebts = membersWithoutFee.map((m) => ({
      id: createId('d'),
      memberId: m.id,
      description,
      amount: Number(amount),
      currency,
      date: today,
      note: 'Anualidad registrada por administrador',
    }))

    setDebts((prev) => {
      const updated = [...prev, ...newDebts]
      saveDebts(updated)
      return updated
    })

    return newDebts.length
  }

  function sendMessage({ memberId, title, body }) {
    const today = new Date().toISOString().slice(0, 10)

    if (memberId === 'all') {
      const activeMembers = members.filter((m) => getMemberStatus(m) === 'activo')
      const newMessages = activeMembers.map((m) => ({
        id: createId('msg'),
        memberId: m.id,
        title,
        body,
        date: today,
        read: false,
      }))
      setMessages((prev) => {
        const updated = [...prev, ...newMessages]
        saveMessages(updated)
        return updated
      })
      return newMessages.length
    }

    const msg = {
      id: createId('msg'),
      memberId,
      title,
      body,
      date: today,
      read: false,
    }
    setMessages((prev) => {
      const updated = [...prev, msg]
      saveMessages(updated)
      return updated
    })
    return 1
  }

  function markMessageRead(messageId) {
    setMessages((prev) => {
      const updated = prev.map((m) => m.id === messageId ? { ...m, read: true } : m)
      saveMessages(updated)
      return updated
    })
  }

  function addPayment(newPayment) {
    const payment = {
      ...newPayment,
      id: createId('mp'),
    }

    setPayments((prev) => {
      const updated = [...prev, payment]
      savePayments(updated)
      return updated
    })
  }

  return {
    members,
    isLoading,
    stats,
    debts,
    payments,
    memberAccounts,
    memberInvitations,
    addMember,
    updateMember,
    deleteMember,
    createMemberInvitation,
    addDebt,
    addPayment,
    addAnnualFee,
    messages,
    sendMessage,
    markMessageRead,
  }
}
