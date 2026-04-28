export default function SearchInput({ value, onChange, placeholder = 'Buscar...' }) {
  return (
    <div className="search-input-wrapper">
      <span className="search-input-icon">🔍</span>
      <input
        type="text"
        className="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button className="search-input-clear" onClick={() => onChange('')} aria-label="Limpiar">
          ✕
        </button>
      )}
    </div>
  )
}
