import { useState, useMemo } from 'react'
import { countByStatus } from '../logic/memberLogic.js'
import { getMembers, saveMembers } from '../services/localStorageService.js'

export function useMembers() {
  const [members, setMembers] = useState(getMembers)
  const stats = useMemo(() => countByStatus(members), [members])

  function addMember(memberData) {
    const member = {
      ...memberData,
      id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    }

    setMembers((prev) => {
      const updated = [...prev, member]
      saveMembers(updated)
      return updated
    })

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

  return { members, stats, addMember, updateMember }
}
