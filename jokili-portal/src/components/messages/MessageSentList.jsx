import { getMemberFullName } from '../../logic/memberLogic.js'
import { formatDate } from '../../utils/formatDate.js'

export default function MessageSentList({ messages, members }) {
  if (messages.length === 0) {
    return <p className="msg-empty">No hay mensajes enviados todavia.</p>
  }

  function getMemberName(memberId) {
    const m = members.find((m) => m.id === memberId)
    return m ? getMemberFullName(m) : memberId
  }

  const sorted = [...messages].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <ul className="msg-sent-list">
      {sorted.map((msg) => (
        <li key={msg.id} className="msg-sent-item">
          <div className="msg-sent-meta">
            <span className="msg-sent-to">{getMemberName(msg.memberId)}</span>
            <span className="msg-sent-date">{formatDate(msg.date)}</span>
          </div>
          <p className="msg-sent-title">{msg.title}</p>
          <p className="msg-sent-body">{msg.body}</p>
          {!msg.read && <span className="msg-sent-unread">No leido</span>}
        </li>
      ))}
    </ul>
  )
}
