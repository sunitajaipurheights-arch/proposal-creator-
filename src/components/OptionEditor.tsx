import type { PropertyOption, SpecRow } from '../lib/types'
import { uid } from '../lib/defaults'
import { PhotoUploader } from './PhotoUploader'

interface Props {
  option: PropertyOption
  index: number
  canRemove: boolean
  onChange: (option: PropertyOption) => void
  onRemove: () => void
}

const PHOTO_CAPTIONS = ['Front View', 'Interior View', 'Side View', 'Inside View']

export function OptionEditor({ option, index, canRemove, onChange, onRemove }: Props) {
  const patch = (p: Partial<PropertyOption>) => onChange({ ...option, ...p })

  const setSpec = (id: string, key: keyof SpecRow, val: string) =>
    patch({ specs: option.specs.map((s) => (s.id === id ? { ...s, [key]: val } : s)) })

  const addSpec = () =>
    patch({ specs: [...option.specs, { id: uid(), label: '', value: '' }] })

  const removeSpec = (id: string) =>
    patch({ specs: option.specs.filter((s) => s.id !== id) })

  const setScope = (i: number, val: string) =>
    patch({ scope: option.scope.map((s, idx) => (idx === i ? val : s)) })

  const addScope = () => patch({ scope: [...option.scope, ''] })
  const removeScope = (i: number) => patch({ scope: option.scope.filter((_, idx) => idx !== i) })

  return (
    <div className="option-block">
      <div className="option-head">
        <span className="opt-index">OPTION {index + 1}</span>
        <input
          style={{ flex: 1 }}
          value={option.title}
          placeholder="e.g. Madri Ind Area, Udaipur"
          onChange={(e) => patch({ title: e.target.value })}
        />
        {canRemove && (
          <button className="btn btn-danger-ghost btn-sm" onClick={onRemove} type="button">
            Remove
          </button>
        )}
      </div>

      <div className="option-body">
        {/* Spec rows — fully editable & optional */}
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)' }}>
          Details <span className="muted" style={{ fontWeight: 400 }}>— all optional. Rename any field, remove what you don't need, or add your own.</span>
        </label>
        <div style={{ marginTop: 8 }}>
          {option.specs.length === 0 && (
            <p className="muted" style={{ fontSize: 13, margin: '4px 0 10px' }}>
              No fields yet. Click “Add field” to create one.
            </p>
          )}
          {option.specs.map((s) => (
            <div className="spec-row" key={s.id}>
              <input
                value={s.label}
                placeholder="Field name (e.g. Rent)"
                onChange={(e) => setSpec(s.id, 'label', e.target.value)}
              />
              <input
                value={s.value}
                placeholder="Value (e.g. 25 Rs/sqft)"
                onChange={(e) => setSpec(s.id, 'value', e.target.value)}
              />
              <button
                className="icon-btn"
                type="button"
                title="Remove field"
                onClick={() => removeSpec(s.id)}
              >
                ✕
              </button>
            </div>
          ))}
          <button className="btn btn-danger-ghost btn-sm" type="button" onClick={addSpec} style={{ width: '100%', justifyContent: 'center' }}>
            + Add field
          </button>
        </div>

        {/* Scope of work */}
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', display: 'block', marginTop: 18 }}>
          Scope of Work <span className="muted" style={{ fontWeight: 400 }}>(optional)</span>
        </label>
        <div style={{ marginTop: 8 }}>
          {option.scope.map((item, i) => (
            <div className="row" key={i} style={{ marginBottom: 8, alignItems: 'flex-start' }}>
              <span
                style={{
                  flex: 'none',
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  background: 'var(--red)',
                  color: '#fff',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  marginTop: 6,
                }}
              >
                {i + 1}
              </span>
              <textarea
                style={{ minHeight: 40 }}
                value={item}
                placeholder="Requirement / construction note"
                onChange={(e) => setScope(i, e.target.value)}
              />
              <button className="icon-btn" type="button" onClick={() => removeScope(i)} title="Remove">
                ✕
              </button>
            </div>
          ))}
          <button className="btn btn-ghost btn-sm" type="button" onClick={addScope}>
            + Add scope item
          </button>
        </div>

        {/* Photos */}
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', display: 'block', marginTop: 18, marginBottom: 8 }}>
          Photos
        </label>
        <PhotoUploader
          photos={option.photos}
          onChange={(photos) => patch({ photos })}
          captionSuggestions={PHOTO_CAPTIONS}
        />
      </div>
    </div>
  )
}
