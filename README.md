# Techy BD

Techy BD is a Vite + React website with a PostgreSQL-backed content admin panel. The public site uses safe seed content while the CMS API is unavailable, and automatically uses the database content when deployed through Vercel.

## What the admin manages

- Portfolio projects
- Services
- Offers and packages
- Testimonials
- FAQ items
- Site settings: brand, contact details, SEO, hero copy, page text, hosting, footer, CTA and other editable text through the Advanced JSON editor

Open the admin panel at `/admin`.

## Local setup

1. Copy `.env.example` to `.env.local` and add your own values. Never commit `.env.local`.
2. Install dependencies with `npm install`.
3. Create the CMS tables and add the initial Techy BD content:

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. For a public UI-only preview, run:

   ```bash
   npm run dev
   ```

   For the API and admin authentication locally, run Vercel's local runtime instead:

   ```bash
   npx vercel dev
   ```

`db:seed` is idempotent: it only inserts missing starter content and will not overwrite CMS edits.

## Required environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string. Keep this server-only. |
| `ADMIN_PASSWORD` | Password for `/admin`. |
| `ADMIN_SESSION_SECRET` | A random secret of at least 32 characters used to sign the admin session cookie. |

Optional: `DATABASE_SSL=false` for a local non-TLS database and `ADMIN_SESSION_TTL_HOURS` to change the 12-hour default session lifetime.

## Vercel deployment

1. Import the GitHub repository into Vercel.
2. Add `DATABASE_URL`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` to **Production**, **Preview**, and **Development** environment settings as needed.
3. Deploy. `vercel.json` builds the Vite site, keeps `/api/*` serverless functions available, and falls back to `index.html` for public client-side routes.

Do not create `VITE_DATABASE_URL` or any other browser-exposed database variable.

## Verification

```bash
npm run build
```

The CMS functions live in `api/`, database code in `lib/cms/`, and the initial migration and seed scripts are in `scripts/`.
