import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../../lib/axiosInstance.js'

const roleOptions = ['admin', 'mentor', 'student']

const jobSources = [
  { name: 'JSearch API', enabled: true },
  { name: 'Adzuna API', enabled: false },
]

function AdminDashboard() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingUserId, setEditingUserId] = useState(null)
  const [draftRole, setDraftRole] = useState('student')
  const [draftSuspended, setDraftSuspended] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadUsers() {
      const response = await axiosInstance.get('/api/admin/users')

      if (cancelled) {
        return
      }

      if (response.status === 403) {
        navigate('/dashboard', { replace: true })
        return
      }

      setUsers(response.data.users || [])
      setLoading(false)
    }

    loadUsers()

    return () => {
      cancelled = true
    }
  }, [navigate])

  const stats = useMemo(() => {
    const totalJobsTracked = users.reduce((sum, user) => sum + user.jobCount, 0)

    return {
      totalUsers: users.length,
      totalJobsTracked,
      apiCallsToday: 1248,
    }
  }, [users])

  function openManage(user) {
    setEditingUserId(user.id)
    setDraftRole(user.role)
    setDraftSuspended(user.suspended)
  }

  async function handleSave(userId) {
    const response = await axiosInstance.patch(`/api/admin/users/${userId}`, {
      role: draftRole,
      suspended: draftSuspended,
    })

    if (response.status === 403) {
      navigate('/dashboard', { replace: true })
      return
    }

    setUsers((current) =>
      current.map((user) =>
        user.id === userId
          ? {
              ...user,
              role: draftRole,
              suspended: draftSuspended,
            }
          : user,
      ),
    )
    setEditingUserId(null)
  }

  return (
    <main className="page-shell">
      <section className="page-card stack">
        <div>
          <p className="auth-brand">Job-Friend</p>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">
            Review platform users, roles, and job-source settings from the admin view.
          </p>
        </div>

        <div className="dashboard-stats">
          <article className="info-card">
            <p className="info-label">Total Users</p>
            <p className="info-value">{stats.totalUsers}</p>
          </article>
          <article className="info-card">
            <p className="info-label">Jobs Tracked</p>
            <p className="info-value">{stats.totalJobsTracked}</p>
          </article>
          <article className="info-card">
            <p className="info-label">API Calls Today</p>
            <p className="info-value">{stats.apiCallsToday}</p>
          </article>
        </div>

        {loading ? (
          <div className="spinner-card">
            <div className="spinner" aria-hidden="true" />
            <p>Loading admin users...</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Job Count</th>
                  <th>Status</th>
                  <th>Manage</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-pill role-${user.role}`}>{user.role}</span>
                    </td>
                    <td>{user.jobCount}</td>
                    <td>{user.suspended ? 'Suspended' : 'Active'}</td>
                    <td>
                      {editingUserId === user.id ? (
                        <div className="admin-inline-edit">
                          <select
                            className="job-select"
                            onChange={(event) => setDraftRole(event.target.value)}
                            value={draftRole}
                          >
                            {roleOptions.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                          <label className="admin-checkbox">
                            <input
                              checked={draftSuspended}
                              onChange={(event) => setDraftSuspended(event.target.checked)}
                              type="checkbox"
                            />
                            <span>Suspended</span>
                          </label>
                          <div className="admin-inline-actions">
                            <button
                              className="auth-button auth-button-primary admin-action-button"
                              onClick={() => handleSave(user.id)}
                              type="button"
                            >
                              Save
                            </button>
                            <button
                              className="auth-button auth-button-secondary admin-action-button"
                              onClick={() => setEditingUserId(null)}
                              type="button"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          className="auth-button auth-button-secondary admin-manage-button"
                          onClick={() => openManage(user)}
                          type="button"
                        >
                          Manage
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <article className="stack">
          <div>
            <h2 className="onboarding-title">Job Sources</h2>
            <p className="page-subtitle">
              Current provider toggles for job discovery integrations.
            </p>
          </div>

          <div className="info-grid">
            {jobSources.map((source) => (
              <article className="info-card" key={source.name}>
                <p className="info-label">{source.name}</p>
                <p className="info-value">{source.enabled ? 'Enabled' : 'Disabled'}</p>
              </article>
            ))}
          </div>
        </article>
      </section>
    </main>
  )
}

export default AdminDashboard
