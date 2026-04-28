import MessageCompose from '../components/messages/MessageCompose.jsx'
import MessageSentList from '../components/messages/MessageSentList.jsx'

export default function MessagesPage({ members, messages, onSendMessage }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Mitteilungen</h1>
      </div>

      <div className="msg-page-grid">
        <div className="card msg-compose-card">
          <MessageCompose members={members} onSend={onSendMessage} />
        </div>

        <div className="card">
          <h2 className="msg-sent-heading">Mensajes enviados</h2>
          <MessageSentList messages={messages} members={members} />
        </div>
      </div>
    </div>
  )
}
