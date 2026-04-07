import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { axiosInstance } from '../lib/axiosInstance.js'

const statusOptions = ['Saved', 'Applied', 'Cold Email', 'Interview', 'Rejected']

function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [runningMatch, setRunningMatch] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [togglingColdEmail, setTogglingColdEmail] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadJob() {
      const { data } = await axiosInstance.get(`/api/jobs/${id}`)

      if (!cancelled) {
        setJob(data.job)
        setLoading(false)
      }
    }

    loadJob()

    return () => {
      cancelled = true
    }
  }, [id])

  const matchRingStyle = useMemo(() => {
    const score = job?.matchScore ?? 0
    return {
      background: `conic-gradient(#60a5fa ${score * 3.6}deg, rgba(30, 41, 59, 0.95) 0deg)`,
    }
  }, [job?.matchScore])

  async function handleRunMatch() {
    setRunningMatch(true)
    const { data } = await axiosInstance.post('/api/ai/match', { jobId: id })
    setJob(data.job)
    setRunningMatch(false)
  }

  async function handleStatusChange(event) {
    setUpdatingStatus(true)
    const { data } = await axiosInstance.patch(`/api/jobs/${id}`, {
      status: event.target.value,
    })

    setJob(data.job)
    setUpdatingStatus(false)
  }

  async function handleColdEmailToggle() {
    setTogglingColdEmail(true)
    const { data } = await axiosInstance.patch(`/api/jobs/${id}`, {
      coldEmail: !job.coldEmail,
    })
    setJob(data.job)
    setTogglingColdEmail(false)
  }

  if (loading) {
    return (
      <main className="page-shell">
        <section className="page-card spinner-card">
          <div className="spinner" aria-hidden="true" />
          <p>Loading job details...</p>
        </section>
      </main>
    )
  }

  if (!job) {
    return (
      <main className="page-shell">
        <section className="page-card stack">
          <h1 className="page-title">Job not found</h1>
          <p className="page-subtitle">
            This job is not available in the current dummy data set.
          </p>
          <div className="link-row">
            <Link className="link-chip" to="/dashboard">
              Back to dashboard
            </Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="page-shell">
      <section className="page-card job-detail-layout">
        <div className="stack">
          <div className="stack">
            <p className="auth-brand">Job-Friend</p>
            <div className="job-detail-header">
              <div>
                <p className="info-label">{job.company}</p>
                <h1 className="page-title">{job.title}</h1>
                <p className="page-subtitle">{job.location}</p>
              </div>
              <button
                className="auth-button auth-button-secondary job-detail-back"
                onClick={() => navigate('/dashboard')}
                type="button"
              >
                Back
              </button>
            </div>
          </div>

          <div className="dashboard-tags">
            {job.techStack.map((tag) => (
              <span className="dashboard-tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>

          <article className="onboarding-panel stack">
            <div>
              <p className="info-label">Description</p>
              <p className="job-detail-description">{job.description}</p>
            </div>
          </article>
        </div>

        <aside className="stack">
          <article className="onboarding-panel stack">
            <p className="info-label">Match Score</p>

            {job.matchScore === null ? (
              <div className="stack">
                <p className="page-subtitle">
                  No match analysis has been run yet for this role.
                </p>
                <button
                  className="auth-button auth-button-primary"
                  disabled={runningMatch}
                  onClick={handleRunMatch}
                  type="button"
                >
                  {runningMatch ? 'Running match...' : 'Run Match'}
                </button>
              </div>
            ) : (
              <>
                <div className="match-ring" style={matchRingStyle}>
                  <div className="match-ring-inner">
                    <strong>{job.matchScore}%</strong>
                  </div>
                </div>

                <div className="stack">
                  {job.skillGaps.map((gap) => (
                    <div className="skill-gap-row" key={gap.label}>
                      <span className={`skill-gap-dot ${gap.level}`} />
                      <span>{gap.label}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </article>

          <article className="onboarding-panel stack">
            <p className="info-label">Quick Actions</p>

            <button
              className="auth-button auth-button-primary"
              onClick={() => navigate(`/cover-letter/${job.id}`)}
              type="button"
            >
              Generate Cover Letter
            </button>

            <label className="auth-field" htmlFor="job-status">
              <span>Update Status</span>
              <select
                id="job-status"
                className="job-select"
                value={job.status}
                disabled={updatingStatus}
                onChange={handleStatusChange}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <button
              className="auth-button auth-button-secondary"
              disabled={togglingColdEmail}
              onClick={handleColdEmailToggle}
              type="button"
            >
              {job.coldEmail ? 'Remove Cold Email Reminder' : 'Set Cold Email Reminder'}
            </button>
          </article>
        </aside>
      </section>
    </main>
  )
}

export default JobDetail
