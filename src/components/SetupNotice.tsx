/** Shown when Supabase env vars are missing, so the app degrades gracefully. */
export function SetupNotice() {
  return (
    <div className="notice" style={{ textAlign: 'left' }}>
      <strong>Supabase isn't configured yet.</strong>
      <p style={{ margin: '8px 0 0' }}>
        Create a <code>.env</code> file in the project root with:
      </p>
      <pre
        style={{
          margin: '10px 0 0',
          background: '#fff',
          border: '1px solid var(--red-tint-2)',
          borderRadius: 8,
          padding: 12,
          fontSize: 12,
          overflowX: 'auto',
        }}
      >
{`VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key`}
      </pre>
      <p style={{ margin: '10px 0 0' }}>
        Then restart the dev server. See <code>README.md</code> for the full setup (SQL + storage bucket).
      </p>
    </div>
  )
}
