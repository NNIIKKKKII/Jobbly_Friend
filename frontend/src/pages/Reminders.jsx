import { useEffect, useMemo, useState } from 'react'
import { axiosInstance } from '../lib/axiosInstance.js'

function getDaysSince(dateString) {
  if (!dateString) {
    return 0
  }

  const now = new Date()
  const date = new Date(dateString)
  const diff = now.getTime() - date.getTime()
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
}

function Reminders() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [draftedEmails, setDraftedEmails] = useState({})
  const [remindersSet, setRemindersSet] = useState({})

  useEffect(() => {
    let cancelled = false

    async function loadJobs() {
      const { data } = await axiosInstance.get('/api/jobs/dashboard')

      if (!cancelled) {
        setJobs(data.jobs || [])
        setLoading(false)
      }
    }

    loadJobs()

    return () => {
      cancelled = true
    }
  }, [])

  const pendingColdEmails = useMemo(
    () =>
      jobs.filter(
        (job) => job.coldEmail && String(job.status).toLowerCase() === 'discovered',
      ),
    [jobs],
  )

  const upcomingFollowUps = useMemo(
    () => jobs.filter((job) => String(job.status).toLowerCase() === 'applied'),
    [jobs],
  )

  const hasOldColdEmails = useMemo(
    () => pendingColdEmails.some((job) => getDaysSince(job.addedAt) > 3),
    [pendingColdEmails],
  )

  return (
    <main className="page-shell">
      <section className="page-card stack">
        <div>
          <p className="auth-brand">Job-Friend</p>
          <h1 className="page-title">Reminders</h1>
          <p className="page-subtitle">
            Keep up with cold emails and follow-ups using locally filtered dashboard jobs.
          </p>
        </div>

        {hasOldColdEmails ? (
          <div className="reminder-warning">
            Some cold email opportunities are more than 3 days old and may need attention.
          </div>
        ) : null}

        {loading ? (
          <div className="spinner-card">
            <div className="spinner" aria-hidden="true" />
            <p>Loading reminders...</p>
          </div>
        ) : (
          <>
            <article className="stack">
              <div>
                <h2 className="onboarding-title">Pending Cold Emails</h2>
                <p className="page-subtitle">
                  Jobs marked for outreach that are still in the discovered stage.
                </p>
              </div>

              <div className="stack">
                {pendingColdEmails.length ? (
                  pendingColdEmails.map((job) => (
                    <article className="info-card reminder-card" key={job.id}>
                      <div>
                        <p className="info-label">{job.company}</p>
                        <p className="info-value">{job.title}</p>
                        <p className="page-subtitle">
                          Added {getDaysSince(job.addedAt)} days ago
                        </p>
                      </div>
                      <button
                        className="auth-button auth-button-primary reminder-button"
                        onClick={() =>
                          setDraftedEmails((current) => ({ ...current, [job.id]: true }))
                        }
                        type="button"
                      >
                        {draftedEmails[job.id] ? 'Draft Ready' : 'Draft Email'}
                      </button>
                    </article>
                  ))
                ) : (
                  <article className="info-card">
                    <p className="info-value">No pending cold emails right now.</p>
                  </article>
                )}
              </div>
            </article>

            <article className="stack">
              <div>
                <h2 className="onboarding-title">Upcoming Follow-ups</h2>
                <p className="page-subtitle">
                  Applied jobs that may need a follow-up check-in soon.
                </p>
              </div>

              <div className="stack">
                {upcomingFollowUps.length ? (
                  upcomingFollowUps.map((job) => (
                    <article className="info-card reminder-card" key={job.id}>
                      <div>
                        <p className="info-label">{job.company}</p>
                        <p className="info-value">{job.title}</p>
                        <p className="page-subtitle">
                          Applied {getDaysSince(job.appliedAt)} days ago
                        </p>
                      </div>
                      <button
                        className="auth-button auth-button-secondary reminder-button"
                        onClick={() =>
                          setRemindersSet((current) => ({ ...current, [job.id]: true }))
                        }
                        type="button"
                      >
                        {remindersSet[job.id] ? 'Reminder Set' : 'Remind Me'}
                      </button>
                    </article>
                  ))
                ) : (
                  <article className="info-card">
                    <p className="info-value">No follow-up reminders yet.</p>
                  </article>
                )}
              </div>
            </article>
          </>
        )}
      </section>
    </main>
  )
}

export default Reminders
