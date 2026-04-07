import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../lib/axiosInstance.js'

const techFocusOptions = [
  'Frontend',
  'Backend',
  'Full Stack',
  'DevOps',
  'ML/AI',
  'Mobile',
  'Data Engineering',
  'Cybersecurity',
]

function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedFileName, setSelectedFileName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [selectedFocuses, setSelectedFocuses] = useState([])

  const canContinue = useMemo(() => {
    if (step === 1) {
      return uploadSuccess
    }

    return true
  }, [step, uploadSuccess])

  async function handleResumeSelect(event) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setSelectedFileName(file.name)
    setUploadError('')
    setUploadSuccess(false)
    setUploading(true)

    const formData = new FormData()
    formData.append('resume', file)

    const { data } = await axiosInstance.post('/api/resume/upload', formData)

    if (!data.success) {
      setUploadError(data.message || 'Resume upload failed. Please try again.')
      setUploading(false)
      return
    }

    setUploadSuccess(true)
    setUploading(false)
  }

  function toggleFocus(focus) {
    setSelectedFocuses((current) =>
      current.includes(focus)
        ? current.filter((item) => item !== focus)
        : [...current, focus],
    )
  }

  function handleContinue() {
    if (step === 1) {
      setStep(2)
      return
    }

    navigate('/dashboard')
  }

  return (
    <main className="page-shell">
      <section className="page-card onboarding-card stack">
        <div className="onboarding-header">
          <div className="onboarding-dots" aria-label={`Step ${step} of 2`}>
            {[1, 2].map((dotStep) => (
              <span
                key={dotStep}
                className={`onboarding-dot ${dotStep === step ? 'is-active' : ''}`}
              />
            ))}
          </div>
          <div>
            <p className="auth-brand">Job-Friend</p>
            <h1 className="page-title">Build your student profile</h1>
            <p className="page-subtitle">
              Upload your resume first, then choose the tech tracks you want Job-Friend
              to prioritize.
            </p>
          </div>
        </div>

        {step === 1 ? (
          <div className="stack">
            <article className="onboarding-panel">
              <p className="info-label">Step 1</p>
              <h2 className="onboarding-title">Upload your resume PDF</h2>
              <p className="page-subtitle">
                This demo uses a mocked upload request, but it keeps the same API shape
                as the real backend flow.
              </p>

              <label className="upload-zone" htmlFor="resume-upload">
                <input
                  id="resume-upload"
                  accept="application/pdf"
                  className="sr-only"
                  onChange={handleResumeSelect}
                  type="file"
                />
                <span className="upload-zone-title">
                  {selectedFileName ? selectedFileName : 'Choose a PDF resume'}
                </span>
                <span className="upload-zone-copy">
                  Drag and drop later. For now, click here to select your file.
                </span>
              </label>

              {uploading ? <p className="onboarding-note">Uploading resume...</p> : null}
              {uploadSuccess ? (
                <p className="onboarding-success">Resume uploaded successfully.</p>
              ) : null}
              {uploadError ? <p className="auth-error">{uploadError}</p> : null}
            </article>
          </div>
        ) : (
          <div className="stack">
            <article className="onboarding-panel">
              <p className="info-label">Step 2</p>
              <h2 className="onboarding-title">Choose your tech focus</h2>
              <p className="page-subtitle">
                Select every area you want Job-Friend to prioritize in your dashboard.
              </p>

              <div className="focus-grid">
                {techFocusOptions.map((focus) => {
                  const selected = selectedFocuses.includes(focus)

                  return (
                    <button
                      key={focus}
                      className={`focus-chip ${selected ? 'is-selected' : ''}`}
                      onClick={() => toggleFocus(focus)}
                      type="button"
                    >
                      {focus}
                    </button>
                  )
                })}
              </div>

              <p className="onboarding-note">
                Selected: {selectedFocuses.length ? selectedFocuses.join(', ') : 'None yet'}
              </p>
            </article>
          </div>
        )}

        <div className="onboarding-footer">
          {step === 2 ? (
            <button
              className="auth-button auth-button-secondary onboarding-back"
              onClick={() => setStep(1)}
              type="button"
            >
              Back
            </button>
          ) : null}

          <button
            className="auth-button auth-button-primary onboarding-continue"
            disabled={!canContinue}
            onClick={handleContinue}
            type="button"
          >
            {step === 1 ? 'Continue to tech focus' : 'Continue'}
          </button>
        </div>
      </section>
    </main>
  )
}

export default Onboarding
