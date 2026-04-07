import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import LoadingSpinner from './LoadingSpinner.jsx'

function ProtectedRoute({ children }) {
  const { loading, user } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
