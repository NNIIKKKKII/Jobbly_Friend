import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { axiosInstance } from '../lib/axiosInstance.js'

const toneOptions = ['Professional', 'Casual', 'Confident']

function CoverLetter() {
  const { jobId } = useParams()
  const [job, setJob] = useState(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [tone, setTone] = useState('Professional')
  const [extraInstructions, setExtraInstructions] = useState('')
  const [loading, setLoading] = useState(true)
  const [regenerating, setRegenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function generateInitialCoverLetter() {
      const { data } = await axiosInstance.post('/api/ai/cover-letter', {
        jobId,
        tone: 'Professional',
        extraInstructions: '',
      })

      if (!cancelled) {
        setJob(data.job)
        setCoverLetter(data.coverLetter)
        setLoading(false)
      }
    }

    generateInitialCoverLetter()

    return () => {
      cancelled = true
    }
  }, [jobId])

  async function handleRegenerate() {
    setRegenerating(true)
    const { data } = await axiosInstance.post('/api/ai/cover-letter', {
      jobId,
      tone,
      extraInstructions,
    })
    setJob(data.job)
    setCoverLetter(data.coverLetter)
    setRegenerating(false)
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(coverLetter)
    setCopied(true)

    window.setTimeout(() => {
      setCopied(false)
    }, 1400)
  }

  if (loading) {
    return (
      <main className="page-shell">
        <section className="page-card spinner-card">
          <div className="spinner" aria-hidden="true" />
          <p>Generating cover letter...</p>
        </section>
      </main>
    )
  }

  return (
    <main className="page-shell">
      <section className="page-card cover-letter-layout">
        <div className="stack">
          <div className="stack">
            <p className="auth-brand">Job-Friend</p>
            <div className="cover-letter-breadcrumb">
              <Link to="/dashboard">Dashboard</Link>
              <span>/</span>
              <Link to={`/jobs/${jobId}`}>{job?.title || 'Job Detail'}</Link>
              <span>/</span>
              <span>{job?.company || 'Cover Letter'}</span>
            </div>
            <div>
              <h1 className="page-title">AI Cover Letter</h1>
              <p className="page-subtitle">
                Edit the generated draft directly, then copy it wherever you need.
              </p>
            </div>
          </div>

          <textarea
            className="cover-letter-editor"
            onChange={(event) => setCoverLetter(event.target.value)}
            value={coverLetter}
          />

          <div className="cover-letter-actions">
            <button
              className="auth-button auth-button-secondary cover-letter-button"
              onClick={handleCopy}
              type="button"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              className="auth-button auth-button-primary cover-letter-button"
              disabled={regenerating}
              onClick={handleRegenerate}
              type="button"
            >
              {regenerating ? 'Regenerating...' : 'Regenerate'}
            </button>
          </div>
        </div>

        <aside className="stack">
          <article className="onboarding-panel stack">
            <p className="info-label">Job</p>
            <h2 className="onboarding-title">{job?.title}</h2>
            <p className="page-subtitle">{job?.company}</p>
          </article>

          <article className="onboarding-panel stack">
            <p className="info-label">Tone</p>
            <div className="filter-row">
              {toneOptions.map((toneOption) => (
                <button
                  key={toneOption}
                  className={`filter-chip ${tone === toneOption ? 'is-active' : ''}`}
                  onClick={() => setTone(toneOption)}
                  type="button"
                >
                  {toneOption}
                </button>
              ))}
            </div>
          </article>

          <article className="onboarding-panel stack">
            <label className="auth-field" htmlFor="extra-instructions">
              <span>Extra instructions</span>
              <textarea
                id="extra-instructions"
                className="cover-letter-hint-input"
                onChange={(event) => setExtraInstructions(event.target.value)}
                placeholder="Example: emphasize React projects, fast learning, and internship readiness."
                value={extraInstructions}
              />
            </label>
            <p className="page-subtitle cover-letter-note">
              This hint is included in future regenerate calls.
            </p>
          </article>
        </aside>
      </section>
    </main>
  )
}

export default CoverLetter
