# Jaipur Heights — Proposal Studio

An internal tool for the Jaipur Heights properties office to generate polished,
branded **property rental proposals** from a simple form. Fill in the details,
add photos, and export a print-ready PDF.

Built with **React + Vite + TypeScript** and **Supabase** (Auth, Postgres, Storage).

## Features

- 🔐 Email/password login (Supabase Auth)
- 📝 Form editor with **multiple property options** per proposal
- 🖼️ Drag-and-drop photo uploads (stored in Supabase Storage)
- 👀 Live preview that updates as you type
- 🧩 Every field optional + add your own custom fields per option
- 📑 **Duplicate** any proposal to reuse it as a starting point
- 🎨 Red brand theme matching the **JH** logo
- 📄 One-click **Download PDF** (via the browser print dialog → "Save as PDF")
- 📱 Fully responsive — works from phone to desktop (proposal auto-scales to fit)
- 💾 Saved proposals dashboard (each user sees only their own)

## 1. Prerequisites

- Node.js 18+
- A free [Supabase](https://supabase.com) project

## 2. Configure Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor → New query**, paste the contents of
   [`supabase/schema.sql`](supabase/schema.sql), and **Run**. This creates the
   `proposals` table, row-level security, and the `proposal-photos` storage bucket.
3. (Optional) Under **Authentication → Providers → Email**, disable
   "Confirm email" if you want instant sign-in without email verification.

## 3. Add environment variables

Copy the example file and fill in your project's URL and anon key
(**Project Settings → API**):

```bash
cp .env.example .env
```

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

## 4. Run

```bash
npm install
npm run dev
```

Open the printed local URL, create an account, and start building proposals.

## Exporting a PDF

Open a proposal → **Download PDF** → in the browser dialog choose
**"Save as PDF"**. The proposal is laid out at A4 width, so it maps cleanly to
a PDF page. For best results set margins to *None* and enable *Background graphics*.

## Project structure

```
src/
  components/      NavBar, ProposalDocument (the template), editors, icons
  context/         AuthContext (Supabase auth state)
  data/            proposals.ts — CRUD + photo upload helpers
  lib/             supabase client, types, defaults (Jaipur Heights info)
  pages/           Login, Dashboard, Editor, View
  styles/          proposal.css — the branded document theme
supabase/
  schema.sql       tables, RLS policies, storage bucket
```

## Notes

- The proposal template lives in `src/components/ProposalDocument.tsx` and
  `src/styles/proposal.css`. It renders as a **cover page + one page per
  property option** (each option page-breaks separately in the PDF). Editing
  those files changes every proposal's look.
- Default contact info (Jaipur Heights / Hitesh Arya) is in
  `src/lib/defaults.ts` — change it there to update the pre-filled values.

### Logo

The JH logo is a single file: **`public/brand/jh-logo.svg`**. It's used in the
navbar, login screen, and on every page of the proposal (via
`src/components/Logo.tsx`). To use a different logo, either replace the SVG's
contents, or drop a raster (`jh-logo.png`) into `public/brand/` and point
`Logo.tsx` + `ProposalDocument.tsx` at the new filename. The brand red
(`--red`) is defined in `src/index.css` and `src/styles/proposal.css`.
