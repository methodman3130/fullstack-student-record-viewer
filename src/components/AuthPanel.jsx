import { useState } from 'react'
import { useAuth } from '../context/authContext'

const emptyForm = { name: '', email: '', password: '' }

function AuthPanel() {
  const { user, isAuthenticated, isRestoring, login, register, logout } = useAuth()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isRegistering = mode === 'register'

  function updateField(field) {
    return (event) => setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  function switchMode() {
    setMode(isRegistering ? 'login' : 'register')
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      if (isRegistering) await register(form)
      else await login({ email: form.email, password: form.password })

      setForm(emptyForm)
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleLogout() {
    setError('')

    try {
      await logout()
    } catch (logoutError) {
      setError(logoutError.message)
    }
  }

  if (isRestoring) {
    return (
      <section className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4 text-secondary">Checking your session…</div>
      </section>
    )
  }

  if (isAuthenticated) {
    return (
      <section className="card border-0 shadow-sm mb-4" aria-label="Account">
        <div className="card-body p-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <p className="text-secondary text-uppercase small fw-semibold mb-1">Signed in</p>
            <p className="mb-0 fw-semibold">
              {user.name} <span className="text-secondary fw-normal">({user.email})</span>
            </p>
          </div>
          <button className="btn btn-outline-secondary" type="button" onClick={handleLogout}>
            Log out
          </button>
        </div>
        {error && <div className="alert alert-danger m-4 mt-0" role="alert">{error}</div>}
      </section>
    )
  }

  return (
    <section className="card border-0 shadow-sm mb-4" aria-label="Sign in">
      <div className="card-body p-4">
        <h2 className="h5 mb-1">{isRegistering ? 'Create an account' : 'Log in'}</h2>
        <p className="text-secondary small">
          Signing in unlocks adding, editing, and deleting student records.
        </p>

        <form className="row g-3" onSubmit={handleSubmit}>
          {isRegistering && (
            <div className="col-md-4">
              <label className="form-label fw-semibold" htmlFor="auth-name">Full name</label>
              <input
                id="auth-name"
                className="form-control"
                value={form.name}
                onChange={updateField('name')}
                autoComplete="name"
                required
              />
            </div>
          )}
          <div className={isRegistering ? 'col-md-4' : 'col-md-5'}>
            <label className="form-label fw-semibold" htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              className="form-control"
              type="email"
              value={form.email}
              onChange={updateField('email')}
              autoComplete="email"
              required
            />
          </div>
          <div className={isRegistering ? 'col-md-4' : 'col-md-5'}>
            <label className="form-label fw-semibold" htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              className="form-control"
              type="password"
              value={form.password}
              onChange={updateField('password')}
              autoComplete={isRegistering ? 'new-password' : 'current-password'}
              minLength={isRegistering ? 8 : undefined}
              required
            />
          </div>
          <div className="col-12 d-flex flex-wrap align-items-center gap-3">
            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Please wait…' : isRegistering ? 'Register' : 'Log in'}
            </button>
            <button className="btn btn-link p-0" type="button" onClick={switchMode}>
              {isRegistering ? 'Already registered? Log in' : 'Need an account? Register'}
            </button>
          </div>
        </form>

        {error && <div className="alert alert-danger mt-3 mb-0" role="alert">{error}</div>}
      </div>
    </section>
  )
}

export default AuthPanel
