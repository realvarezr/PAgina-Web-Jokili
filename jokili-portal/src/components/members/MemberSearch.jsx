import SearchInput from '../ui/SearchInput.jsx'

export default function MemberSearch({ query, onQueryChange, total, found }) {
  return (
    <div className="member-search">
      <SearchInput
        value={query}
        onChange={onQueryChange}
        placeholder="Buscar por nombre, número o rol..."
      />
      <span className="member-search-count">
        {query ? `${found} de ${total}` : `${total} socios`}
      </span>
    </div>
  )
}
