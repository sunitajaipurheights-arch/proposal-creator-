import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Logo } from './Logo'

export function NavBar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="app-nav">
      <Link to="/" className="brand">
        <Logo size={38} />
        <span className="brand-name">
          Jaipur Heights
          <small>Proposal Studio</small>
        </span>
      </Link>
      <div className="nav-actions">
        {user && <span className="nav-user">{user.email}</span>}
        <button
          className="btn btn-ghost btn-sm"
          onClick={async () => {
            await signOut()
            navigate('/login')
          }}
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
