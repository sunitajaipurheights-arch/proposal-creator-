# Deploying to Vercel

This is a Vite + React SPA. `vercel.json` already configures the framework,
build command, output directory, and the SPA routing fallback (so deep links
like `/proposal/:id/view` work on refresh).

> **Environment variables are build-time.** Vite inlines `VITE_*` vars into the
> bundle at build. They must exist in Vercel **before** the production build,
> otherwise the deployed app shows the "Supabase isn't configured" screen.
> Your two values are in the local `.env` file.

---

## Option A — Vercel CLI (recommended, no Git needed)

```bash
npm i -g vercel
cd /Users/apple/proposal-creator
vercel login
```

Link/create the project (accept the detected Vite settings):

```bash
vercel
```

Add the two environment variables (paste each value from your `.env` when
prompted, and select **Production, Preview, Development**):

```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

Deploy to production:

```bash
vercel --prod
```

Vercel prints your live URL (e.g. `https://proposal-creator.vercel.app`).

---

## Option B — Git + GitHub + Vercel dashboard (auto-deploy on push)

⚠️ This folder is **not its own git repo** — `git` here currently points at a
repo rooted at your home directory. Give the project its own repo first:

```bash
cd /Users/apple/proposal-creator
git init
git add .
git commit -m "Proposal creator app"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

Then in the Vercel dashboard:

1. **Add New → Project → Import** your GitHub repo.
2. Framework preset auto-detects **Vite** (build `npm run build`, output `dist`).
3. **Environment Variables** → add `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY` (values from `.env`).
4. **Deploy.** Every push to `main` will redeploy automatically.

`.env`, `dist/`, `node_modules/`, and `.vercel/` are gitignored, so no secrets
or build output get committed.

---

## After the first deploy — Supabase

- **Login works immediately** (email/password needs no redirect config).
- Recommended: Supabase → **Authentication → URL Configuration** → add your
  Vercel URL to **Site URL** / **Redirect URLs**. Required only if you later
  enable email confirmation, magic links, or OAuth.

## Notes

- The `VITE_SUPABASE_ANON_KEY` is a public key by design — it's safe in the
  client bundle. Your data is protected by Row Level Security (see
  `supabase/schema.sql`), so each user only sees their own proposals.
- To change env vars later: update them in Vercel (dashboard or
  `vercel env`) and **redeploy** — a rebuild is required for Vite to pick them up.
