import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ user, allowedRoles, children }) {
  if (!user) return <Navigate to="/login" replace />

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const targetPath = user.role === 'member' ? '/portal-miembro' : '/'
    return <Navigate to={targetPath} replace />
  }

  return children
}
