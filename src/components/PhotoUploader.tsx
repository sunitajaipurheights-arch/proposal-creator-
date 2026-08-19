import { useRef, useState } from 'react'
import type { Photo } from '../lib/types'
import { uploadPhoto, removePhotoFile } from '../data/proposals'

interface Props {
  photos: Photo[]
  onChange: (photos: Photo[]) => void
  captionPlaceholder?: string
  /** Suggested captions cycled through as photos are added. */
  captionSuggestions?: string[]
}

export function PhotoUploader({
  photos,
  onChange,
  captionPlaceholder = 'Caption (e.g. Front View)',
  captionSuggestions = [],
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setError(null)
    setUploading(true)
    try {
      const list = Array.from(files).filter((f) => f.type.startsWith('image/'))
      const uploaded: Photo[] = []
      for (let i = 0; i < list.length; i++) {
        const suggestion = captionSuggestions[(photos.length + i) % captionSuggestions.length] ?? ''
        uploaded.push(await uploadPhoto(list[i], captionSuggestions.length ? suggestion : ''))
      }
      onChange([...photos, ...uploaded])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const remove = async (photo: Photo) => {
    onChange(photos.filter((p) => p.id !== photo.id))
    await removePhotoFile(photo.path)
  }

  const setCaption = (id: string, caption: string) =>
    onChange(photos.map((p) => (p.id === id ? { ...p, caption } : p)))

  return (
    <div>
      {photos.length > 0 && (
        <div className="photo-grid" style={{ marginBottom: 12 }}>
          {photos.map((p) => (
            <div className="photo-cell" key={p.id}>
              <img src={p.url} alt={p.caption} />
              <div className="cap">
                <input
                  value={p.caption}
                  placeholder={captionPlaceholder}
                  onChange={(e) => setCaption(p.id, e.target.value)}
                />
              </div>
              <button className="rm" onClick={() => remove(p)} type="button">
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        className={`dropzone${dragging ? ' drag' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          handleFiles(e.dataTransfer.files)
        }}
      >
        {uploading ? (
          <span className="row" style={{ justifyContent: 'center' }}>
            <span className="spinner dark" /> Uploading…
          </span>
        ) : (
          <>📷 Click or drop images here to upload</>
        )}
      </div>
      {error && <p style={{ color: 'var(--red)', fontSize: 13, marginTop: 8 }}>{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}
