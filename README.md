# Mana Avanigadda

Civic governance and grievance reporting platform for Avanigadda Constituency
(Andhra Pradesh). React + Vite + Tailwind frontend, Node.js + Express +
Supabase Postgres (via Prisma) backend, Cloudflare R2 for photo storage.

## Status

Full-stack and verified end-to-end against a live Supabase Postgres database
and a live Cloudflare R2 bucket — seeding, auth (password and OTP), problem
reporting with photo upload, and admin flows have all been exercised against
the real infrastructure.

## Architecture

```
mana-avanigadda/
├── src/            React frontend (this directory)
└── server/         Express + Prisma + Supabase Postgres backend
    └── prisma/schema.prisma   database schema (source of truth)
```

The frontend talks to the backend over HTTP (`VITE_API_URL`, default
`http://localhost:4000/api`). If the backend isn't running or unreachable,
the frontend degrades to an empty/zero state rather than crashing — but nothing
actually works (no login, no data) until the backend is up.

## Run locally

**1. Create a Supabase project** — free tier, at [supabase.com](https://supabase.com).
Get the connection strings from Connect → "Direct connection" tab (see
`server/.env.example` for exactly which two URIs you need and why).

**2. Backend:**
```
cd server
npm install
cp .env.example .env   # fill in DATABASE_URL, DIRECT_URL, JWT_SECRET, R2_*
npx prisma db push      # creates tables in Supabase from prisma/schema.prisma
npx prisma db execute --file prisma/sql/constraints.sql --schema prisma/schema.prisma
npm run seed             # populates sample data — required before first run
npm run dev               # starts on :4000
```

**3. Frontend** (in a separate terminal, from `mana-avanigadda/`):
```
npm install
cp .env.example .env    # defaults to http://localhost:4000/api, edit if needed
npm run dev              # starts on :5174
```

## Demo accounts

`npm run seed` creates one demo account per role (Resident, Volunteer,
Mandal Admin, Administrator) and prints their phone numbers and a
freshly-generated random password to your terminal when it finishes —
nothing is hardcoded, so there's no fixed credential sitting in this repo.
Use `/admin-login` for the two admin accounts, `/login` for the rest.

**`npm run seed` wipes all existing data first** — only run it against a
database you're OK clearing, never against a live/production one.

## Database (Supabase Postgres via Prisma)

`server/prisma/schema.prisma` is the source of truth. Notes on how it maps
from the app's domain model:

- Enum-like columns (`role`, `category`, `status`, `priority`, OTP `purpose`)
  are plain `String` columns, not native Postgres enums — several real values
  contain spaces/ampersands (`"Mandal Admin"`, `"Roads & Transport"`) that
  Postgres enum identifiers can't represent. They're validated in application
  code (`server/src/constants.js`) and enforced at the DB layer via CHECK
  constraints (`prisma/sql/constraints.sql`, applied separately from `db push`
  since Prisma doesn't manage raw SQL constraints itself).
- What used to be embedded arrays on a single Mongo document (a problem's
  photos, comments, and status timeline) are now proper child tables
  (`problem_photos`, `comments`, `status_history`) with cascading deletes.
- The upvote relation (`problem_supporters`) has a real composite-key unique
  constraint, so "you already supported this" is enforced by the database,
  not just application logic.
- Schema changes: edit `schema.prisma`, then `npx prisma db push` (dev/prototyping)
  or set up `prisma migrate` if you want tracked migration history for
  production going forward — this project currently uses `db push`.

## Photo storage (Cloudflare R2)

Problem photos go to Cloudflare R2 (S3-compatible), not into the database.
See `server/src/services/storage.js`. Flow: client compresses + sends a
base64 image → backend validates it's really an image
(`server/src/utils/validatePhoto.js`) → backend re-compresses server-side
with `sharp` (never trust client-side compression alone) → uploads to R2 →
the resulting public URL is what's stored in Postgres. Requires 5 env vars
(`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`,
`R2_PUBLIC_URL`) — reporting a problem with photos fails cleanly (502) without
them, rather than silently storing nothing.

## Messaging (OTP + SMS notifications)

Phone-based login/registration and SMS notifications (status changes,
volunteer assignment, new announcements) are implemented in
`server/src/services/sms.js`, gated by `MSG91_PROVIDER_MODE`:

- **`mock`** (default) — logs the message to the server console instead of
  sending it. This is what local dev and this environment run on; no MSG91
  account is needed.
- **`live`** — sends through MSG91's Flow API. Requires, in `server/.env`:
  - `MSG91_API_KEY` and `MSG91_SENDER_ID`
  - A DLT-approved template ID per message type per language
    (`MSG91_TEMPLATE_ID_OTP_EN`, `_STATUSCHANGE_TE`, etc. — see
    `.env.example` for the full list)
  - DLT entity + sender header registration on a platform like Jio/Airtel/Vi,
    done outside this codebase — the app can't do that registration for you.

In mock mode, the OTP code is never returned by the API — check the server
console for a `[sms:mock] ... :: <code> is your...` line to get the code for
local testing.

## Deployment

- **Frontend → Netlify.** Build command `npm run build`, publish directory
  `dist/` (both already set in `netlify.toml`). Set `VITE_API_URL` to your
  Render backend's URL + `/api` in Netlify's environment variables.
- **Backend → Render.** Build command `npm install && npx prisma generate`,
  start command `npm start`. Binds to `process.env.PORT` (Render sets this
  automatically). Set every var from `server/.env.example` in Render's
  environment settings.
- **Database → Supabase Postgres**, already covered above.
- **Images → Cloudflare R2**, already covered above.

Set `CORS_ORIGIN` (backend) to your exact Netlify URL once deployed — it
falls back to allowing any origin if unset, which is fine for local dev but
not for production.

## Security hardening (done before going live)

- No demo credentials are shown anywhere in the UI, README, or seed script —
  `npm run seed` generates a random password per run (see "Demo accounts"
  above) instead of a fixed, publicly-known one.
- OTP codes are never returned by the API in any mode — check server console
  logs for local testing.
- `server/src/utils/sanitize.js` strips `$`-prefixed/dotted keys from
  `req.body`/`req.query`/`req.params` globally. This was originally a NoSQL
  (MongoDB operator) injection guard; it's a no-op risk-wise now that queries
  go through Prisma's parameterized SQL, but it's harmless to leave in place.
- `helmet` sets standard security headers; `express-rate-limit` caps
  `/api/auth/*` at 30 requests/15min per IP against brute-force/abuse, on top
  of the per-phone OTP cooldown and attempt cap already in `routes/auth.js`.
- Uploaded photos are validated as real image data URIs
  (`server/src/utils/validatePhoto.js`) rather than accepting arbitrary
  base64 blobs up to the 15mb body limit.
- Database-level CHECK constraints (`prisma/sql/constraints.sql`) back up
  the application-level enum validation — defense in depth, not just a
  single layer of trust.

Still worth doing before real traffic: confirm `CORS_ORIGIN` is set to the
exact production frontend URL, and consider tightening the JWT expiry
(currently 30 days) if that's a concern for your threat model.

## What's still needed before this is real

- Live MSG91/DLT registration (see Messaging above) — the code path is built
  and tested against the mock provider, but no real SMS has been sent
- Mandal Admin vs. Administrator permission split is partial — only an
  Administrator can grant/revoke the Administrator role or remove another
  Administrator (enforced server-side in `routes/users.js`), but every other
  admin action (complaints, announcements, geography, etc.) is still
  identical between the two roles
- No SLA/escalation system — complaints don't currently have a deadline or
  auto-escalation path; this was explicitly scoped out of the Postgres
  migration and would be a separate feature to design and build
