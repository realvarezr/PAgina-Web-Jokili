import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMemberSearch } from '../hooks/useMemberSearch.js'
import MemberSearch from '../components/members/MemberSearch.jsx'
import MembersList from '../components/members/MembersList.jsx'
import MemberForm from '../components/members/MemberForm.jsx'
import Button from '../components/ui/Button.jsx'

export default function MembersPage({ members, stats, addMember }) {
  const navigate = useNavigate()
  const [isAddingMember, setIsAddingMember] = useState(false)
  const { query, setQuery, results } = useMemberSearch(members)

  function handleAddMember(memberData) {
    const member = addMember(memberData)
    setIsAddingMember(false)
    setQuery('')
    navigate(`/socios/${member.id}`)
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Socios</h1>
        <div className="page-stats">
          <span className="stat-chip stat-chip--green">{stats.activos} activos</span>
          {stats.honorarios > 0 && (
            <span className="stat-chip stat-chip--yellow">{stats.honorarios} honor.</span>
          )}
          {stats.inactivos > 0 && (
            <span className="stat-chip stat-chip--gray">{stats.inactivos} inactivos</span>
          )}
        </div>
        <Button size="sm" onClick={() => setIsAddingMember((value) => !value)}>
          {isAddingMember ? 'Cerrar' : 'Agregar socio'}
        </Button>
      </div>
      {isAddingMember && (
        <MemberForm
          onAddMember={handleAddMember}
          onCancel={() => setIsAddingMember(false)}
        />
      )}
      <MemberSearch
        query={query}
        onQueryChange={setQuery}
        total={members.length}
        found={results.length}
      />
      <MembersList members={results} />
    </div>
  )
}
