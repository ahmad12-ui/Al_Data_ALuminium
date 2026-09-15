# ALDATA — Aluminum & Interior Decorators

A full-stack, CMS-driven website for ALDATA, built with Next.js 14 (App Router), TypeScript,
Tailwind CSS, MongoDB/Mongoose, and Cloudinary. Every piece of public content — hero slides,
projects, services, videos, and FAQs — is managed from a password-protected admin panel and
served dynamically. Nothing is hardcoded into the frontend.

---

## 1. Requirements

- Node.js 18.18+ (Node 20 LTS recommended)
- A MongoDB database (MongoDB Atlas recommended for production)
- A Cloudinary account (free tier is enough to start)
- A Gmail account (or other SMTP provider) for the contact form

---

## 2. Install

```bash
npm install
```

---

## 3. Environment Variables

Copy the example file and fill in real values:

```bash
cp .env.example .env.local
```

| Variable | Where it's used | Notes |
|---|---|---|
| `MONGODB_URI` | Server only | Full MongoDB Atlas (or local) connection string |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Server only | From your Cloudinary dashboard |
| `ADMIN_SECRET_CODE` | Server only | The single access code for `/admin/login`. Never expose with `NEXT_PUBLIC_` |
| `SESSION_SECRET` | Server only | Long random string used to sign the admin session cookie. Generate with `openssl rand -hex 32` |
| `EMAIL_SERVICE` / `EMAIL_USER` / `EMAIL_PASSWORD` / `EMAIL_TO` | Server only | SMTP credentials for the contact form. For Gmail, use an **App Password**, not your login password |
| `NEXT_PUBLIC_SITE_URL` | Public | Used for metadata, sitemap, and OpenGraph URLs |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Public | Defaults to `923048762936` |
| `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL_DAHRKI` / `..._SADIQABAD` | Public | Optional — the live embed URLs are actually managed later in **Admin → Settings**, these env vars are just a fallback/reference |

**Never** commit `.env.local` — it's already git-ignored.

### MongoDB Atlas setup
1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Add a database user and password.
3. Under Network Access, allow your deployment's IP (or `0.0.0.0/0` for simplicity while testing).
4. Copy the connection string into `MONGODB_URI`, replacing `<password>` and adding `/aldata` as the database name.

### Cloudinary setup
1. Sign up at [cloudinary.com](https://cloudinary.com).
2. From the dashboard, copy your **Cloud Name**, **API Key**, and **API Secret** into the env file.
3. No manual folder creation needed — the app creates `aldata/hero`, `aldata/projects`, `aldata/services`, and `aldata/videos` folders automatically on first upload.

### Admin secret setup
Set `ADMIN_SECRET_CODE` to something long and private (not a word found in a dictionary). This is
the only credential needed to log into `/admin/login` — there is no separate username, and it's
never stored in MongoDB.

### Email setup (Gmail example)
1. Enable 2-Step Verification on the Gmail account.
2. Generate an **App Password** (Google Account → Security → App Passwords).
3. Set `EMAIL_USER` to the Gmail address and `EMAIL_PASSWORD` to the generated app password.

### Google Maps setup
Go to Google Maps → search the location → Share → Embed a map → copy the `src` URL from the
`<iframe>` tag. Paste that full URL into **Admin → Settings → Google Maps Embeds** (this is the
supported way to manage it — no Google API key required for basic embeds).

---

## 4. Seed the database

Seeds default site settings, the 12 initial services, and the starter FAQ list. It does **not**
create any demo projects, testimonials, or statistics — those must be entered for real through
the admin panel.

```bash
npm run seed
```

Safe to re-run — it skips anything that already exists (matched by slug/question).

---

## 5. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000` for the public site and `http://localhost:3000/admin/login` for
the admin panel (use the `ADMIN_SECRET_CODE` you set).

---

## 6. Build & start (production mode locally)

```bash
npm run build
npm start
```

---

## 7. Deploying to Vercel

1. Push this repository to GitHub/GitLab/Bitbucket.
2. Import the repo into [Vercel](https://vercel.com/new).
3. Add every variable from `.env.local` into the Vercel project's **Environment Variables**
   settings (do this for all of Production, Preview, and Development as needed).
4. Deploy. Vercel runs `npm install` and `npm run build` automatically.
5. After the first deploy, run `npm run seed` once locally (pointed at the same `MONGODB_URI`
   you configured in Vercel) to populate initial services and FAQs.
6. Log into `/admin/login` on the live URL and start adding hero slides and real projects.

---

## 8. How the admin panel works

Everything under `/admin` is protected by middleware — visiting any admin page or calling any
admin API route without a valid session redirects to `/admin/login`. There is no public sign-up;
access is controlled entirely by the single `ADMIN_SECRET_CODE`.

### Adding a project
1. Go to **Admin → Projects → Add Project**.
2. Fill in name, category, location, date, price (optional), and description.
3. Drag & drop one or more images — the **first image becomes the cover** (drag to reorder if you
   want a different cover).
4. Optionally upload a Before and/or After image if it's a renovation-style project — this powers
   the before/after comparison slider on the project detail page.
5. Toggle **Featured** if you want it prioritized on the homepage.
6. Save. The project immediately appears on `/projects`, its own `/projects/[slug]` page, related
   sections, and — if eligible — the homepage's featured projects and portfolio slider. No code
   changes, no redeploy.

### Adding a service
Admin → Services → Add Service. Same pattern: name, description, one image, featured flag, order.

### Adding a video
Admin → Videos → Add Video. Upload the video file directly (MP4/WEBM/MOV) plus a thumbnail image.

### Managing FAQs
Admin → FAQs. Add/edit/delete/publish questions and answers; order controls display sequence.

### Managing the homepage hero
Admin → Hero Slides. Each slide has its own image, title, subtitle, description, and button. Use
the up/down arrows to reorder, and the toggle to activate/deactivate a slide without deleting it.
The homepage hero always reflects exactly the active slides, in order — add a 5th slide and the
homepage shows 5; deactivate one and it disappears immediately.

### Site Settings
Admin → Settings manages the business name, taglines, phone/email/WhatsApp, both location
addresses, Google Maps embed URLs, social links, and footer text — all without touching code.

---

## 9. How the dynamic portfolio slider works

The homepage's "Selected Work" slider is **not** a hardcoded set of images. It queries the
`Project` collection directly, sorted `featured desc → order asc → updatedAt desc`. That means:

- A brand-new project appears near the front of the slider automatically (most recently updated).
- Marking a project **Featured** moves it to the front, ahead of non-featured projects.
- Editing a project's images updates the slider's cover image immediately (it always reads the
  project's current `featuredImage`, defaulting to the first image if none is explicitly set).
- Deleting a project removes it from the slider (and from Cloudinary) immediately.

The **Hero Slider** and **Portfolio Slider** are intentionally separate systems: Hero Slides are
manually curated marketing slides (their own collection), while the Portfolio Slider is generated
entirely from your actual Projects data.

---

## 10. Project structure

```
app/                    Next.js App Router pages, layouts, and API routes
  admin/(dashboard)/     Protected admin pages (dashboard, CRUD screens, settings)
  admin/login/           Public admin login page
  api/                   Route handlers (projects, services, videos, faqs, hero-slides,
                         settings, contact, upload, auth)
  projects/, services/, videos/, faq/, contact/   Public pages
components/
  layout/                Navbar, Footer, LoadingScreen, WhatsAppButton, ChromeGate
  home/                  All homepage sections (HeroSlider, PortfolioSlider, etc.)
  projects/, services/, videos/   Public-facing cards, galleries, filters
  admin/                 Sidebar, forms, image/video uploader, confirm dialog
  ui/                    shadcn-style primitives (Button, Dialog, Sheet, Accordion, etc.)
lib/                     mongodb.ts, cloudinary.ts, auth.ts, email.ts, validations.ts, data.ts, utils.ts
models/                  Mongoose schemas: Project, Service, Video, FAQ, HeroSlide, SiteSettings
types/                   Shared TypeScript DTOs
scripts/seed.ts          Database seed script
middleware.ts            Protects /admin/* pages and admin API mutations
```

---

## 11. Security notes

- `MONGODB_URI`, `CLOUDINARY_API_SECRET`, `ADMIN_SECRET_CODE`, `SESSION_SECRET`, and email
  credentials are read only in server-side code (route handlers, Server Components, middleware)
  and are never sent to the browser.
- The admin session is a signed, HTTP-only, `SameSite=Lax` cookie — not readable by client-side
  JavaScript and not stored in MongoDB.
- The login route is rate-limited (5 attempts per 15 minutes per IP, in-memory).
- All admin API routes reject unauthenticated requests with `401`, independent of the UI.

## 12. A note on “no fake content”

Per the brief, this build does not invent years-in-business, project counts, client counts, or
testimonials anywhere in the copy. Add these only once ALDATA supplies real figures — the
Introduction and Why ALDATA sections are written to remain accurate without them.
