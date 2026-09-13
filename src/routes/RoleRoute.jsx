import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ROLE_HOME = {
  farmer: '/farmer',
  fpo: '/fpo',
  consumer: '/consumer',
}

// Gates a role-specific subtree (must be nested under ProtectedRoute).
// A logged-in user with the wrong role is bounced to their own dashboard
// rather than to /login.
export default function RoleRoute({ allowedRole }) {
  const { role } = useAuth()

  if (role !== allowedRole) {
    return <Navigate to={ROLE_HOME[role] ?? '/'} replace />
  }

  return <Outlet />
}
