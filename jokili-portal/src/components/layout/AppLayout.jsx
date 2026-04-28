import Header from './Header.jsx'
import Sidebar from './Sidebar.jsx'

export default function AppLayout({ children, currentUser, onLogout }) {
  return (
    <div className="app-layout">
      <Header currentUser={currentUser} onLogout={onLogout} />
      <div className="app-body">
        <Sidebar />
        <main className="app-main">{children}</main>
      </div>
    </div>
  )
}
