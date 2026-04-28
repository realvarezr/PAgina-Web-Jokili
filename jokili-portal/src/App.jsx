import { Navigate, Routes, Route } from 'react-router-dom'
import { useAppData } from './hooks/useAppData.js'
import { useAuth } from './hooks/useAuth.js'
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'
import AppLayout from './components/layout/AppLayout.jsx'
import Header from './components/layout/Header.jsx'
import ActivateAccountPage from './pages/ActivateAccountPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import MembersPage from './pages/MembersPage.jsx'
import MemberDetailPage from './pages/MemberDetailPage.jsx'
import PaymentsPage from './pages/PaymentsPage.jsx'
import MessagesPage from './pages/MessagesPage.jsx'
import MemberPortalPage from './pages/MemberPortalPage.jsx'
import './styles/global.css'
import './styles/layout.css'
import './styles/auth.css'
import './styles/members.css'
import './styles/paymentsAndDebts.css'
import './styles/memberPortal.css'
import './styles/messages.css'

export default function App() {
  const { currentUser, login, logout, activateInvitation } = useAuth()
  const {
    members,
    isLoading,
    stats,
    debts,
    payments,
    memberAccounts,
    memberInvitations,
    addMember,
    updateMember,
    deleteMember,
    createMemberInvitation,
    addDebt,
    addPayment,
    addAnnualFee,
    messages,
    sendMessage,
    markMessageRead,
  } = useAppData()
  const handleLogin = (username, password) => login(username, password)

  return (
    <Routes>
      <Route path="/login" element={<LoginPage currentUser={currentUser} onLogin={handleLogin} />} />
      <Route
        path="/activar/:token"
        element={
          <ActivateAccountPage
            currentUser={currentUser}
            dataReady={!isLoading}
            memberInvitations={memberInvitations}
            onActivateInvitation={activateInvitation}
          />
        }
      />
      <Route
        path="/portal-miembro"
        element={
          <ProtectedRoute user={currentUser} allowedRoles={['member']}>
            <div className="member-portal-shell">
              <Header currentUser={currentUser} onLogout={logout} />
              <main className="member-portal-main">
                {isLoading ? (
                  <div className="page member-portal">
                    <div className="member-portal-empty">Cargando portal...</div>
                  </div>
                ) : (
                  <MemberPortalPage
                    currentUser={currentUser}
                    members={members}
                    debts={debts}
                    payments={payments}
                    messages={messages}
                    onMarkMessageRead={markMessageRead}
                  />
                )}
              </main>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute user={currentUser} allowedRoles={['admin']}>
            <AppLayout currentUser={currentUser} onLogout={logout}>
              <Routes>
                <Route
                  path="/"
                  element={<MembersPage members={members} stats={stats} addMember={addMember} />}
                />
                <Route
                  path="/socios/:id"
                  element={
                    <MemberDetailPage
                      members={members}
                      debts={debts}
                      manualPayments={payments}
                      memberAccounts={memberAccounts}
                      memberInvitations={memberInvitations}
                      updateMember={updateMember}
                      deleteMember={deleteMember}
                      createMemberInvitation={createMemberInvitation}
                    />
                  }
                />
                <Route
                  path="/pagos"
                  element={
                    <PaymentsPage
                      members={members}
                      debts={debts}
                      payments={payments}
                      addDebt={addDebt}
                      addPayment={addPayment}
                      addAnnualFee={addAnnualFee}
                    />
                  }
                />
                <Route
                  path="/mensajes"
                  element={
                    <MessagesPage
                      members={members}
                      messages={messages}
                      onSendMessage={sendMessage}
                    />
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
