import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Highlight, ProposalData, PropertyOption } from '../lib/types'
import { emptyProposal, newOption, COMPANY, todayISO } from '../lib/defaults'
import { createProposal, getProposal, updateProposal } from '../data/proposals'
import { isSupabaseConfigured } from '../lib/supabase'
import { OptionEditor } from '../components/OptionEditor'
import { PhotoUploader } from '../components/PhotoUploader'
import { ProposalDocument } from '../components/ProposalDocument'
import { SetupNotice } from '../components/SetupNotice'
import { useFitScale } from '../lib/useFitScale'

export default function EditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [data, setData] = useState<ProposalData>(emptyProposal())
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const { ref, innerRef, scale, innerHeight } = useFitScale()

  useEffect(() => {
    if (!id) {
      // Switching to a brand-new proposal — start from a clean slate.
      setData(emptyProposal())
      setLoading(false)
      return
    }
    setLoading(true)
    getProposal(id)
      // Backfill fields added after this proposal was first saved
      .then((rec) => setData({ ...rec.data, date: rec.data.date || todayISO() }))
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }, [id])

  const patch = (p: Partial<ProposalData>) => setData((d) => ({ ...d, ...p }))

  const setOption = (opt: PropertyOption) =>
    patch({ options: data.options.map((o) => (o.id === opt.id ? opt : o)) })
  const addOption = () => patch({ options: [...data.options, newOption(data.options.length)] })
  const removeOption = (oid: string) =>
    patch({ options: data.options.filter((o) => o.id !== oid) })

  const setHighlight = (h: Highlight) =>
    patch({ highlights: data.highlights.map((x) => (x.id === h.id ? h : x)) })

  const save = async (goView: boolean) => {
    setError(null)
    setSaving(true)
    try {
      const title = data.clientName ? `Proposal for ${data.clientName}` : 'Untitled Proposal'
      if (isEdit && id) {
        await updateProposal(id, title, data)
        if (goView) navigate(`/proposal/${id}/view`)
      } else {
        const rec = await createProposal(title, data)
        navigate(goView ? `/proposal/${rec.id}/view` : `/proposal/${rec.id}/edit`)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="page" style={{ maxWidth: 560 }}>
        <SetupNotice />
      </div>
    )
  }
  if (loading) {
    return (
      <div className="center-screen">
        <span className="spinner dark" />
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>{isEdit ? 'Edit Proposal' : 'New Proposal'}</h1>
          <p>Every field is optional — fill in only what you need. The preview updates live.</p>
        </div>
        <div className="row">
          <button className="btn btn-ghost" onClick={() => navigate('/')}>Cancel</button>
          <button className="btn btn-ghost" disabled={saving} onClick={() => save(false)}>
            {saving && <span className="spinner dark" />} Save draft
          </button>
          <button className="btn btn-primary" disabled={saving} onClick={() => save(true)}>
            {saving && <span className="spinner" />} Save &amp; Preview
          </button>
        </div>
      </div>

      {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

      <div className="editor-grid">
        {/* ---------------- FORM ---------------- */}
        <div>
          {/* Header */}
          <div className="section-card card">
            <div className="section-title"><span className="num">1</span> Header</div>
            <div className="grid grid-2">
              <div className="field">
                <label>Category / kicker</label>
                <input value={data.category} onChange={(e) => patch({ category: e.target.value })} placeholder="COMMERCIAL SPACE" />
              </div>
              <div className="field">
                <label>Proposal for (client)</label>
                <input value={data.clientName} onChange={(e) => patch({ clientName: e.target.value })} placeholder="BBC Logistics" />
              </div>
            </div>
            <div className="grid grid-2" style={{ marginTop: 14 }}>
              <div className="field">
                <label>Location subtitle</label>
                <input value={data.location} onChange={(e) => patch({ location: e.target.value })} placeholder="Malviya Nagar Industrial Area, Jaipur" />
              </div>
              <div className="field">
                <label>Proposal date</label>
                <input type="date" value={data.date} onChange={(e) => patch({ date: e.target.value })} />
              </div>
            </div>
            <div className="field" style={{ marginTop: 14 }}>
              <label>
                Header image <span className="muted">(optional — a warehouse image is used by default)</span>
              </label>
              <PhotoUploader
                photos={data.heroPhoto ? [data.heroPhoto] : []}
                onChange={(photos) => patch({ heroPhoto: photos[photos.length - 1] ?? null })}
                captionPlaceholder="—"
              />
            </div>
          </div>

          {/* Contact */}
          <div className="section-card card">
            <div className="section-title">
              <span className="num">2</span> Contact details
              <button
                className="btn btn-ghost btn-sm"
                style={{ marginLeft: 'auto' }}
                type="button"
                onClick={() => patch({ ...COMPANY })}
              >
                Reset to Jaipur Heights
              </button>
            </div>
            <div className="grid grid-2">
              <div className="field">
                <label>Contact name</label>
                <input value={data.contactName} onChange={(e) => patch({ contactName: e.target.value })} />
              </div>
              <div className="field">
                <label>Company</label>
                <input value={data.companyName} onChange={(e) => patch({ companyName: e.target.value })} />
              </div>
            </div>
            <div className="field" style={{ marginTop: 14 }}>
              <label>Address</label>
              <textarea value={data.address} onChange={(e) => patch({ address: e.target.value })} />
            </div>
            <div className="grid grid-2" style={{ marginTop: 14 }}>
              <div className="field">
                <label>Phone</label>
                <input value={data.phone} onChange={(e) => patch({ phone: e.target.value })} />
              </div>
              <div className="field">
                <label>Email <span className="muted">(optional)</span></label>
                <input value={data.email} onChange={(e) => patch({ email: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="section-card card">
            <div className="section-title"><span className="num">3</span> Property options</div>
            {data.options.map((opt, i) => (
              <OptionEditor
                key={opt.id}
                option={opt}
                index={i}
                canRemove={data.options.length > 1}
                onChange={setOption}
                onRemove={() => removeOption(opt.id)}
              />
            ))}
            <button className="btn btn-primary btn-sm" type="button" onClick={addOption}>
              + Add another option
            </button>
          </div>

          {/* Advanced: footer highlights + tagline */}
          <div className="section-card card">
            <div className="section-title" style={{ marginBottom: showAdvanced ? 16 : 0 }}>
              <span className="num">4</span> Footer highlights &amp; tagline
              <button
                className="btn btn-ghost btn-sm"
                style={{ marginLeft: 'auto' }}
                type="button"
                onClick={() => setShowAdvanced((s) => !s)}
              >
                {showAdvanced ? 'Hide' : 'Customize'}
              </button>
            </div>
            {showAdvanced && (
              <>
                <div className="grid grid-2">
                  {data.highlights.map((h) => (
                    <div key={h.id} className="option-block" style={{ padding: 12 }}>
                      <div className="field">
                        <label>Title</label>
                        <input value={h.title} onChange={(e) => setHighlight({ ...h, title: e.target.value })} />
                      </div>
                      <div className="field" style={{ marginTop: 8 }}>
                        <label>Text</label>
                        <input value={h.text} onChange={(e) => setHighlight({ ...h, text: e.target.value })} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="field" style={{ marginTop: 14 }}>
                  <label>Tagline</label>
                  <input value={data.tagline} onChange={(e) => patch({ tagline: e.target.value })} />
                </div>
              </>
            )}
          </div>

          <div className="sticky-actions">
            <button className="btn btn-ghost" disabled={saving} onClick={() => save(false)}>
              {saving && <span className="spinner dark" />} Save draft
            </button>
            <button className="btn btn-primary" disabled={saving} onClick={() => save(true)}>
              {saving && <span className="spinner" />} Save &amp; Preview PDF
            </button>
          </div>
        </div>

        {/* ---------------- PREVIEW ---------------- */}
        <div className="preview-pane">
          <div className="preview-label">
            <span>Live preview</span>
            <span className="badge">Auto-updates</span>
          </div>
          <div className="preview-scale" ref={ref} style={{ height: innerHeight * scale }}>
            <div ref={innerRef} style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: 900 }}>
              <ProposalDocument data={data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
