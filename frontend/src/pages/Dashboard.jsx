import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../lib/axiosInstance.js'

const filters = ['All', 'High Match', 'Applied', 'Cold Email', 'Interview']

function Dashboard() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [activeFilter, setActiveFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadDashboardJobs() {
      const { data } = await axiosInstance.get('/api/jobs/dashboard')

      if (!cancelled) {
        setJobs(data.jobs || [])
        setLoading(false)
      }
    }

    loadDashboardJobs()

    return () => {
      cancelled = true
    }
  }, [])

  const stats = useMemo(() => {
    const highMatchCount = jobs.filter((job) => job.matchScore > 70).length
    const appliedCount = jobs.filter((job) => job.status === 'Applied').length
    const coldEmailCount = jobs.filter((job) => job.status === 'Cold Email').length

    return {
      totalJobs: jobs.length,
      highMatchCount,
      appliedCount,
      coldEmailCount,
    }
  }, [jobs])

  const filteredJobs = useMemo(() => {
    if (activeFilter === 'All') {
      return jobs
    }

    if (activeFilter === 'High Match') {
      return jobs.filter((job) => job.matchScore > 70)
    }

    return jobs.filter((job) => job.status === activeFilter)
  }, [activeFilter, jobs])

  return (
    <main className="page-shell">
      <section className="page-card stack">
        <div className="dashboard-topbar">
          <div>
            <p className="auth-brand">Job-Friend</p>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">
              Your current job pipeline, filtered locally from dummy dashboard data.
            </p>
          </div>

          <button
            className="auth-button auth-button-primary dashboard-find-jobs"
            onClick={() => navigate('/search')}
            type="button"
          >
            Find Jobs
          </button>
        </div>

        <div className="dashboard-stats">
          <article className="info-card">
            <p className="info-label">Total Jobs</p>
            <p className="info-value">{stats.totalJobs}</p>
          </article>
          <article className="info-card">
            <p className="info-label">High Match</p>
            <p className="info-value">{stats.highMatchCount}</p>
          </article>
          <article className="info-card">
            <p className="info-label">Applied</p>
            <p className="info-value">{stats.appliedCount}</p>
          </article>
          <article className="info-card">
            <p className="info-label">Cold Email</p>
            <p className="info-value">{stats.coldEmailCount}</p>
          </article>
        </div>

        <div className="filter-row" role="tablist" aria-label="Job filters">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`filter-chip ${filter === activeFilter ? 'is-active' : ''}`}
              onClick={() => setActiveFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="spinner-card">
            <div className="spinner" aria-hidden="true" />
            <p>Loading dashboard jobs...</p>
          </div>
        ) : (
          <div className="dashboard-job-grid">
            {filteredJobs.map((job) => (
              <article
                className="dashboard-job-card"
                key={job.id}
                onClick={() => navigate(`/jobs/${job.id}`)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    navigate(`/jobs/${job.id}`)
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="dashboard-job-header">
                  <div>
                    <p className="info-label">{job.company}</p>
                    <h2 className="dashboard-job-title">{job.title}</h2>
                  </div>
                  <span className="dashboard-status">{job.status}</span>
                </div>

                <div className="dashboard-tags">
                  {job.techStack.map((tag) => (
                    <span className="dashboard-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="dashboard-score">
                  <div className="dashboard-score-row">
                    <span>Match score</span>
                    <span>{job.matchScore === null ? 'Not run' : `${job.matchScore}%`}</span>
                  </div>
                  <div className="dashboard-progress">
                    <span
                      className="dashboard-progress-fill"
                      style={{ width: `${job.matchScore ?? 0}%` }}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Dashboard
