import { supabase, PHOTO_BUCKET } from '../lib/supabase'
import { uid } from '../lib/defaults'
import type { Photo, ProposalData, ProposalRecord } from '../lib/types'

export async function listProposals(): Promise<ProposalRecord[]> {
  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .order('updated_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as ProposalRecord[]
}

export async function getProposal(id: string): Promise<ProposalRecord> {
  const { data, error } = await supabase.from('proposals').select('*').eq('id', id).single()
  if (error) throw error
  return data as ProposalRecord
}

export async function createProposal(title: string, data: ProposalData): Promise<ProposalRecord> {
  const { data: userData } = await supabase.auth.getUser()
  const user_id = userData.user?.id
  const { data: row, error } = await supabase
    .from('proposals')
    .insert({ title, data, user_id })
    .select('*')
    .single()
  if (error) throw error
  return row as ProposalRecord
}

export async function updateProposal(id: string, title: string, data: ProposalData): Promise<void> {
  const { error } = await supabase
    .from('proposals')
    .update({ title, data, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function deleteProposal(id: string): Promise<void> {
  const { error } = await supabase.from('proposals').delete().eq('id', id)
  if (error) throw error
}

/**
 * Create a copy of an existing proposal (new row, "(Copy)" suffix).
 * Photos are shared by URL — the copy references the same stored files.
 */
export async function duplicateProposal(id: string): Promise<ProposalRecord> {
  const src = await getProposal(id)
  const title = /\(Copy\)\s*$/.test(src.title) ? src.title : `${src.title} (Copy)`
  return createProposal(title, src.data)
}

/** Upload a single image file to storage and return a Photo with a public URL. */
export async function uploadPhoto(file: File, caption = ''): Promise<Photo> {
  const { data: userData } = await supabase.auth.getUser()
  const uidPart = userData.user?.id ?? 'anon'
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${uidPart}/${uid()}.${ext}`

  const { error } = await supabase.storage.from(PHOTO_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || 'image/jpeg',
  })
  if (error) throw error

  const { data } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path)
  return { id: uid(), url: data.publicUrl, path, caption }
}

/** Best-effort removal of a photo file from storage (ignores failures). */
export async function removePhotoFile(path: string): Promise<void> {
  if (!path) return
  await supabase.storage.from(PHOTO_BUCKET).remove([path]).catch(() => {})
}
