import { useState } from 'react'
import { axiosInstance } from '../lib/axiosInstance.js'

function JobSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [trackedJobs, setTrackedJobs] = useState({})

  async function handleSearch() {
    setLoading(true)
    const { data } = await axiosInstance.get(
      `/api/jobs/search?query=${encodeURIComponent(query)}`,
    )
    setResults(data.jobs || [])
    setLoading(false)
  }

  async function handleTrackJob(job) {
    setTrackedJobs((current) => ({
      ...current,
      [job.id]: { saving: true, success: false },
    }))

    const { data } = await axiosInstance.post('/api/jobs/create', job)

    setTrackedJobs((current) => ({
      ...current,
      [job.id]: { saving: false, success: true, created: data.created },
    }))
  }

  return (
    <main className="page-shell">
      <section className="page-card stack">
        <div>
          <p className="auth-brand">Job-Friend</p>
          <h1 className="page-title">Search Jobs</h1>
          <p className="page-subtitle">
            Search against dummy job data and track interesting roles into your dashboard.
          </p>
        </div>

        <div className="search-bar">
          <input
            className="search-input"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title, company, location, or stack"
            type="text"
            value={query}
          />
          <button
            className="auth-button auth-button-primary search-button"
            onClick={handleSearch}
            type="button"
          >
            Search
          </button>
        </div>

        {loading ? (
          <div className="spinner-card">
            <div className="spinner" aria-hidden="true" />
            <p>Searching jobs...</p>
          </div>
        ) : (
          <div className="dashboard-job-grid">
            {results.map((job) => {
              const cardState = trackedJobs[job.id]

              return (
                <article className="dashboard-job-card" key={job.id}>
                  <div className="dashboard-job-header">
                    <div>
                      <p className="info-label">{job.company}</p>
                      <h2 className="dashboard-job-title">{job.title}</h2>
                    </div>
                    <span className="dashboard-status">{job.location}</span>
                  </div>

                  <div className="stack">
                    <p className="page-subtitle search-salary">Salary: {job.salary}</p>
                    <div className="dashboard-tags">
                      {job.techStack.map((tag) => (
                        <span className="dashboard-tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    className="auth-button auth-button-primary"
                    disabled={cardState?.saving || cardState?.success}
                    onClick={() => handleTrackJob(job)}
                    type="button"
                  >
                    {cardState?.saving
                      ? 'Tracking...'
                      : cardState?.success
                        ? cardState.created
                          ? 'Tracked'
                          : 'Already tracked'
                        : 'Track This'}
                  </button>
                </article>
              )
            })}
          </div>
        )}

        {!loading && results.length === 0 ? (
          <p className="page-subtitle">No search results yet. Run a search to see jobs here.</p>
        ) : null}
      </section>
    </main>
  )
}

export default JobSearch
