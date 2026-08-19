import type { ProposalData } from '../lib/types'
import {
  IconPin,
  IconPhone,
  IconUser,
  IconShield,
  specIcon,
  highlightIcon,
} from './icons'

const LOGO = '/brand/jh-logo.png'
/** Fixed default header image, used when no custom header photo is uploaded. */
const DEFAULT_HEADER = '/brand/warehouse-header.jpg'

function formatDate(iso: string): string {
  if (!iso) return ''
  const d = new Date(`${iso}T00:00:00`)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

/**
 * Presentational render of the full proposal as a set of A4 "sheets":
 *  - one cover sheet (brand, hero, contact, highlights)
 *  - one sheet per property option (so each entry gets its own page in the PDF)
 *
 * Fixed 900px width — scale via a CSS transform on the wrapper for previews.
 */
export function ProposalDocument({ data }: { data: ProposalData }) {
  const options = data.options.filter(Boolean)
  const totalPages = options.length + 1
  const dateLabel = formatDate(data.date)
  const headerImage = data.heroPhoto?.url || DEFAULT_HEADER

  return (
    <div className="doc">
      {/* ===================== COVER ===================== */}
      <section className="sheet cover">
        <div className="cover-top">
          <img src={LOGO} alt="Jaipur Heights" />
          <div className="ct-brand">
            <b>{data.companyName || 'Jaipur Heights'}</b>
            <small>PROPERTY CONSULTANTS</small>
          </div>
          <div className="ct-meta">
            <b>Rental Proposal</b>
            <br />
            {dateLabel && <>Date: {dateLabel}</>}
          </div>
        </div>

        <div className="cover-hero">
          {data.category && <div className="ch-kicker">{data.category}</div>}
          <h1>PROPOSAL</h1>
          <div className="ch-for">PREPARED FOR</div>
          <div className="ch-client">{data.clientName || 'Client Name'}</div>
          {data.location && (
            <div className="ch-loc">
              <IconPin size={15} /> {data.location}
            </div>
          )}
        </div>

        <img className="cover-photo" src={headerImage} alt="" />

        <div className="cover-contact">
          <div className="cc-avatar">
            <IconUser size={30} />
          </div>
          <div>
            <div className="cc-name">{data.contactName || 'Contact Name'}</div>
            <div className="cc-company">{data.companyName}</div>
          </div>
          <div className="cc-lines" style={{ gridColumn: 2 }}>
            {data.address && (
              <div className="cc-row">
                <IconPin size={15} />
                <span>{data.address}</span>
              </div>
            )}
            {data.phone && (
              <div className="cc-row">
                <IconPhone size={15} />
                <span>Mob — {data.phone}</span>
              </div>
            )}
            {data.email && (
              <div className="cc-row">
                <IconUser size={15} />
                <span>{data.email}</span>
              </div>
            )}
          </div>
        </div>

        <div className="cover-highlights">
          <div className="chi-grid">
            {data.highlights.map((h, i) => (
              <div className="chi-item" key={h.id}>
                <span className="chi-ico">{highlightIcon(i)}</span>
                <div>
                  <h4>{h.title}</h4>
                  <p>{h.text}</p>
                </div>
              </div>
            ))}
          </div>
          {data.tagline && <div className="cover-tagline">{data.tagline}</div>}
        </div>
      </section>

      {/* ===================== OPTION SHEETS ===================== */}
      {options.map((opt, i) => {
        const hasScope = opt.scope.filter((x) => x.trim()).length > 0
        // Only render fields the user actually filled in — every field is optional.
        const specs = opt.specs.filter((sp) => sp.value.trim())
        return (
          <section className="sheet option" key={opt.id}>
            <header className="sheet-head">
              <img src={LOGO} alt="" />
              <div className="sh-name">
                {data.companyName || 'Jaipur Heights'}
                <small>RENTAL PROPOSAL</small>
              </div>
              <span className="sh-tag">OPTION {i + 1}</span>
              <span className="sh-page">{String(i + 2).padStart(2, '0')}</span>
            </header>

            <div className="sheet-main">
              <div className="opt-title">
                <span className="ot-no">{String(i + 1).padStart(2, '0')}.</span>
                <span>{opt.title || `Option ${i + 1}`}</span>
              </div>
              <div className="opt-sub">Property Option {i + 1} of {options.length}</div>
              <div className="opt-accent" />

              <div className={`opt-cols${hasScope && specs.length > 0 ? ' has-scope' : ''}`}>
                {specs.length > 0 && (
                  <div className="spec-table">
                    {specs.map((sp, idx) => (
                      <div className="spec-line" key={sp.id}>
                        <span className="sico">{specIcon(sp.label)}</span>
                        <span className="slabel">
                          {idx + 1}. {sp.label}
                        </span>
                        <span className="sval">{sp.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {hasScope && (
                  <div className="scope-box">
                    <div className="scope-title">
                      <IconShield size={16} /> Scope of Work
                    </div>
                    {opt.scope
                      .filter((x) => x.trim())
                      .map((item, si) => (
                        <div className="scope-item" key={si}>
                          <span className="snum">{String(si + 1).padStart(2, '0')}</span>
                          <span>{item}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {opt.photos.length > 0 && (
                <div className="opt-photos">
                  <div className="photos-head">PHOTOS</div>
                  <div className="photos-row">
                    {opt.photos.map((ph) => (
                      <div className="photo-card" key={ph.id}>
                        <img src={ph.url} alt={ph.caption} />
                        {ph.caption && <div className="pcap">{ph.caption}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <footer className="sheet-foot">
              <span className="ff-tag">{data.tagline || "Let's build the future together."}</span>
              <span className="ff-right">
                {data.phone ? `Mob — ${data.phone}` : data.companyName}
              </span>
              <span style={{ marginLeft: 14 }}>
                {i + 2} / {totalPages}
              </span>
            </footer>
          </section>
        )
      })}
    </div>
  )
}
