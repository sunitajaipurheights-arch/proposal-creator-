/** A single label/value row in an option's spec table (e.g. "Rent" : "25 Rs/sqft"). */
export interface SpecRow {
  id: string
  label: string
  value: string
}

/** An uploaded photo with an optional caption (e.g. "Front View"). */
export interface Photo {
  id: string
  url: string
  /** Storage path, used to delete the file from the bucket. */
  path: string
  caption: string
}

/** One property option inside a proposal (Option 1, Option 2, ...). */
export interface PropertyOption {
  id: string
  /** e.g. "Madri Ind Area, Udaipur" */
  title: string
  specs: SpecRow[]
  /** Optional numbered scope-of-work / requirement items. */
  scope: string[]
  photos: Photo[]
}

/** A highlight badge shown in the footer strip. */
export interface Highlight {
  id: string
  title: string
  text: string
}

/** The full proposal document. */
export interface ProposalData {
  /** Small kicker above the title, e.g. "COMMERCIAL SPACE". */
  category: string
  /** Client / proposed-for name, e.g. "BBC Logistics". */
  clientName: string
  /** Location subtitle under the title. */
  location: string
  /** Proposal date (ISO yyyy-mm-dd). Shown on the cover. */
  date: string

  /** Contact block (defaults to Jaipur Heights). */
  contactName: string
  companyName: string
  address: string
  phone: string
  email: string

  /** Optional hero image shown in the header. */
  heroPhoto: Photo | null

  options: PropertyOption[]
  highlights: Highlight[]
  tagline: string
}

/** Row shape of the `proposals` table. */
export interface ProposalRecord {
  id: string
  user_id: string
  title: string
  data: ProposalData
  created_at: string
  updated_at: string
}
