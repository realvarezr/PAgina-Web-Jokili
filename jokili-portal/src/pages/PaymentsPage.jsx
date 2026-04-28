import { useState } from 'react'
import { useMemberSearch } from '../hooks/useMemberSearch.js'
import MemberSearch from '../components/members/MemberSearch.jsx'
import MemberPaymentsAndDebts from '../components/paymentsAndDebts/MemberPaymentsAndDebts.jsx'
import AnnualFeePanel from '../components/paymentsAndDebts/AnnualFeePanel.jsx'
import Card from '../components/ui/Card.jsx'

export default function PaymentsPage({ members, debts, payments, addDebt, addPayment, addAnnualFee }) {
  const [selectedMemberId, setSelectedMemberId] = useState(null)
  const { query, setQuery, results } = useMemberSearch(members)

  const selectedMember = members.find((m) => m.id === selectedMemberId) ?? null

  function handleSelectMember(memberId) {
    setSelectedMemberId((prev) => (prev === memberId ? null : memberId))
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Pagos y Deudas</h1>
      </div>

      <AnnualFeePanel members={members} onAddAnnualFee={addAnnualFee} />

      <MemberSearch
        query={query}
        onQueryChange={setQuery}
        total={members.length}
        found={results.length}
      />

      <Card>
        <div className="pad-table-wrapper">
          <table className="pad-table">
            <thead>
              <tr>
                <th>Socio</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {results.map((member) => {
                const isSelected = selectedMemberId === member.id
                return (
                  <tr key={member.id}>
                    <td>{member.nombres} {member.apellido}</td>
                    <td>
                      <button
                        className="btn btn--sm btn--primary"
                        onClick={() => handleSelectMember(member.id)}
                      >
                        {isSelected ? 'Cerrar' : 'Administrar'}
                      </button>
                    </td>
                  </tr>
                )
              })}
              {results.length === 0 && (
                <tr>
                  <td colSpan="2" className="pad-table-empty">
                    No se encontraron socios con esa busqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedMember && (
        <MemberPaymentsAndDebts
          member={selectedMember}
          debts={debts}
          payments={payments}
          onAddDebt={addDebt}
          onAddPayment={addPayment}
        />
      )}
    </div>
  )
}
