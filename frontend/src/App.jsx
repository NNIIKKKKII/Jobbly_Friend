import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import CoverLetter from './pages/CoverLetter.jsx'
import Dashboard from './pages/Dashboard.jsx'
import JobDetail from './pages/JobDetail.jsx'
import Login from './pages/Login.jsx'
import JobSearch from './pages/JobSearch.jsx'
import Onboarding from './pages/Onboarding.jsx'
import Register from './pages/Register.jsx'
import Reminders from './pages/Reminders.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <JobSearch />
          </ProtectedRoute>
        }
      />
      <Route
        path="/jobs/:id"
        element={
          <ProtectedRoute>
            <JobDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cover-letter/:jobId"
        element={
          <ProtectedRoute>
            <CoverLetter />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reminders"
        element={
          <ProtectedRoute>
            <Reminders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
