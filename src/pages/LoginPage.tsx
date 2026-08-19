import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { SetupNotice } from '../components/SetupNotice'
import { Logo } from '../components/Logo'

export default function LoginPage() {
  const { session } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  if (session) return <Navigate to="/" replace />

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setBusy(true)
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        if (!data.session) {
          setInfo('Account created. Check your email to confirm, then sign in.')
          setMode('signin')
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <Logo size={56} radius={12} className="auth-logo" />
        <h1>Jaipur Heights</h1>
        <p className="sub">Proposal Studio — {mode === 'signin' ? 'sign in to continue' : 'create your account'}</p>

        {!isSupabaseConfigured ? (
          <SetupNotice />
        ) : (
          <>
            <form onSubmit={submit}>
              {error && <div className="auth-error">{error}</div>}
              {info && (
                <div className="auth-error" style={{ background: '#eef8ef', color: '#256b2e', borderColor: '#cfe9d2' }}>
                  {info}
                </div>
              )}
              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                />
              </div>
              <div className="field">
                <label>Password</label>
                <input
                  type="password"
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <button className="btn btn-primary btn-block" disabled={busy} type="submit">
                {busy && <span className="spinner" />}
                {mode === 'signin' ? 'Sign in' : 'Create account'}
              </button>
            </form>
            <div className="auth-toggle">
              {mode === 'signin' ? (
                <>
                  New here?{' '}
                  <button onClick={() => { setMode('signup'); setError(null) }}>Create an account</button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button onClick={() => { setMode('signin'); setError(null) }}>Sign in</button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
