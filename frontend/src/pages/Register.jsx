import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSignUp(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setSubmitting(false)
      return
    }

    navigate('/onboarding')
  }

  async function handleGoogleSignUp() {
    setSubmitting(true)
    setError('')

    const { error: signUpError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })

    if (signUpError) {
      setError(signUpError.message)
      setSubmitting(false)
      return
    }

    navigate('/onboarding')
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="auth-brand">Job-Friend</p>
        <h1 className="page-title">Create your account</h1>
        <p className="page-subtitle">
          Start your job tracker with a dark-mode demo flow powered by dummy data.
        </p>

        <form className="auth-form" onSubmit={handleSignUp}>
          <label className="auth-field" htmlFor="register-name">
            <span>Name</span>
            <input
              id="register-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your full name"
              required
            />
          </label>

          <label className="auth-field" htmlFor="register-email">
            <span>Email</span>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="auth-field" htmlFor="register-password">
            <span>Password</span>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create a password"
              required
            />
          </label>

          {error ? <p className="auth-error">{error}</p> : null}

          <button className="auth-button auth-button-primary" disabled={submitting} type="submit">
            {submitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <button
          className="auth-button auth-button-secondary"
          disabled={submitting}
          onClick={handleGoogleSignUp}
          type="button"
        >
          Google signup
        </button>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  )
}

export default Register
