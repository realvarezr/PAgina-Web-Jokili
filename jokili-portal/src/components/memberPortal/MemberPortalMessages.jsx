import { useState } from 'react'
import { formatDate } from '../../utils/formatDate.js'

export default function MemberPortalMessages({ messages, onMarkRead }) {
  const [expanded, setExpanded] = useState(null)
  const unreadCount = messages.filter((m) => !m.read).length
  const sorted = [...messages].sort((a, b) => b.date.localeCompare(a.date))

  function handleOpen(msg) {
    setExpanded((prev) => (prev === msg.id ? null : msg.id))
    if (!msg.read) onMarkRead(msg.id)
  }

  if (sorted.length === 0) {
    return (
      <div className="member-portal-panel">
        <div className="member-portal-panel-header">
          <h2>Mensajes</h2>
        </div>
        <p className="member-portal-empty">No tienes mensajes.</p>
      </div>
    )
  }

  return (
    <div className="member-portal-panel">
      <div className="member-portal-panel-header">
        <h2>Mensajes</h2>
        {unreadCount > 0 && (
          <span className="msg-unread-badge">{unreadCount} nuevo{unreadCount !== 1 ? 's' : ''}</span>
        )}
      </div>
      <ul className="msg-inbox-list">
        {sorted.map((msg) => (
          <li
            key={msg.id}
            className={`msg-inbox-item${!msg.read ? ' msg-inbox-item--unread' : ''}`}
            onClick={() => handleOpen(msg)}
          >
            <div className="msg-inbox-row">
              <span className="msg-inbox-title">{msg.title}</span>
              <span className="msg-inbox-date">{formatDate(msg.date)}</span>
            </div>
            {expanded === msg.id && (
              <p className="msg-inbox-body">{msg.body}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
