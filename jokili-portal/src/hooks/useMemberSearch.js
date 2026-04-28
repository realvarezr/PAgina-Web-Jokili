import { useState, useMemo } from 'react'
import { filterMembers } from '../logic/memberLogic.js'

export function useMemberSearch(members) {
  const [query, setQuery] = useState('')

  const results = useMemo(() => filterMembers(members, query), [members, query])

  return { query, setQuery, results }
}
