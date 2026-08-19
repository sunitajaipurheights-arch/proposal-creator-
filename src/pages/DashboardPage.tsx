import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { deleteProposal, duplicateProposal, listProposals } from '../data/proposals'
import { isSupabaseConfigured } from '../lib/supabase'
import { SetupNotice } from '../components/SetupNotice'
import type { ProposalRecord } from '../lib/types'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState<ProposalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    listProposals()
      .then(setItems)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (isSupabaseConfigured) load()
    else setLoading(false)
  }, [])

  const onDelete = async (rec: ProposalRecord) => {
    if (!confirm(`Delete "${rec.title}"? This cannot be undone.`)) return
    await deleteProposal(rec.id)
    setItems((xs) => xs.filter((x) => x.id !== rec.id))
  }

  const onDuplicate = async (rec: ProposalRecord) => {
    setBusyId(rec.id)
    setError(null)
    try {
      const copy = await duplicateProposal(rec.id)
      setItems((xs) => [copy, ...xs])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not duplicate')
    } finally {
      setBusyId(null)
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="page" style={{ maxWidth: 560 }}>
        <SetupNotice />
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Proposals</h1>
          <p>Create, edit and export property proposals.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/new')}>
          + New Proposal
        </button>
      </div>

      {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

      {loading ? (
        <div className="center-screen"><span className="spinner dark" /></div>
      ) : items.length === 0 ? (
        <div className="card empty-state">
          <div style={{ fontSize: 40, marginBottom: 8 }}>📄</div>
          <h3 style={{ color: 'var(--ink)' }}>No proposals yet</h3>
          <p>Create your first proposal to get started.</p>
          <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => navigate('/new')}>
            + New Proposal
          </button>
        </div>
      ) : (
        <div className="proposal-list">
          {items.map((rec) => (
            <div className="card proposal-tile" key={rec.id}>
              <span className="badge">{rec.data.options.length} option{rec.data.options.length > 1 ? 's' : ''}</span>
              <h3>{rec.title}</h3>
              <div className="meta">
                {rec.data.location || 'No location set'}
                <br />
                Updated {new Date(rec.updated_at).toLocaleDateString()}
              </div>
              <div className="tile-actions">
                <Link className="btn btn-primary btn-sm" to={`/proposal/${rec.id}/view`}>View / PDF</Link>
                <Link className="btn btn-ghost btn-sm" to={`/proposal/${rec.id}/edit`}>Edit</Link>
                <button
                  className="btn btn-ghost btn-sm"
                  disabled={busyId === rec.id}
                  onClick={() => onDuplicate(rec)}
                >
                  {busyId === rec.id ? <span className="spinner dark" /> : null} Duplicate
                </button>
                <button className="btn btn-danger-ghost btn-sm" onClick={() => onDelete(rec)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
