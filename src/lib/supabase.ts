import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/**
 * True only when both env vars are present. The UI uses this to show a friendly
 * "configure Supabase" screen instead of crashing when the project isn't wired up yet.
 */
export const isSupabaseConfigured = Boolean(url && anonKey)

// Fall back to harmless placeholders so importing this module never throws.
export const supabase = createClient(
  url ?? 'https://placeholder.supabase.co',
  anonKey ?? 'placeholder-anon-key',
)

/** Storage bucket that holds uploaded property photos. */
export const PHOTO_BUCKET = 'proposal-photos'
