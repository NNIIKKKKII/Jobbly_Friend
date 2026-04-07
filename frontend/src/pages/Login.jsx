import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleEmailSignIn(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setSubmitting(false)
      return
    }

    navigate('/dashboard')
  }

  async function handleGoogleSignIn() {
    setSubmitting(true)
    setError('')

    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })

    if (signInError) {
      setError(signInError.message)
      setSubmitting(false)
      return
    }

    navigate('/dashboard')
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="auth-brand">Job-Friend</p>
        <h1 className="page-title">Welcome back</h1>
        <p className="page-subtitle">
          Sign in to continue tracking applications, reminders, and cover letters.
        </p>

        <form className="auth-form" onSubmit={handleEmailSignIn}>
          <label className="auth-field" htmlFor="login-email">
            <span>Email</span>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="auth-field" htmlFor="login-password">
            <span>Password</span>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
            />
          </label>

          {error ? <p className="auth-error">{error}</p> : null}

          <button className="auth-button auth-button-primary" disabled={submitting} type="submit">
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <button
          className="auth-button auth-button-secondary"
          disabled={submitting}
          onClick={handleGoogleSignIn}
          type="button"
        >
          Continue with Google
        </button>

        <p className="auth-footer">
          Need an account?{' '}
          <Link to="/register">
            Create one here
          </Link>
        </p>
      </section>
    </main>
  )
}

export default Login
