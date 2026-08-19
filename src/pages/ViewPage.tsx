import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProposal } from '../data/proposals'
import { ProposalDocument } from '../components/ProposalDocument'
import { useFitScale } from '../lib/useFitScale'
import type { ProposalRecord } from '../lib/types'

export default function ViewPage() {
  const { id } = useParams()
  const [record, setRecord] = useState<ProposalRecord | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { ref, innerRef, scale, innerHeight } = useFitScale()

  useEffect(() => {
    if (!id) return
    getProposal(id)
      .then(setRecord)
      .catch((e) => setError(e instanceof Error ? e.message : 'Not found'))
  }, [id])

  if (error) {
    return (
      <div className="center-screen">
        <div style={{ textAlign: 'center' }}>
          <p className="muted">{error}</p>
          <Link className="btn btn-ghost" to="/">← Back to dashboard</Link>
        </div>
      </div>
    )
  }
  if (!record) {
    return (
      <div className="center-screen">
        <span className="spinner dark" />
      </div>
    )
  }

  return (
    <div style={{ background: '#33363b', minHeight: '100vh' }}>
      {/* toolbar (hidden when printing) */}
      <div className="no-print view-toolbar">
        <Link to="/" className="btn btn-ghost btn-sm">← Dashboard</Link>
        <Link to={`/proposal/${record.id}/edit`} className="btn btn-ghost btn-sm">Edit</Link>
        <div className="spacer" />
        <span className="view-tip">Tip: choose "Save as PDF" in the print dialog</span>
        <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
          Download PDF
        </button>
      </div>

      <div
        className="print-host"
        ref={ref}
        style={{ display: 'flex', justifyContent: 'center', padding: '28px 16px 60px' }}
      >
        {/* screen-only scaler: shrinks the 900px doc to fit narrow screens */}
        <div className="screen-fit" style={{ width: 900 * scale, height: innerHeight ? innerHeight * scale : undefined }}>
          <div
            className="screen-fit-inner"
            ref={innerRef}
            style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: 900 }}
          >
            <ProposalDocument data={record.data} />
          </div>
        </div>
      </div>
    </div>
  )
}
