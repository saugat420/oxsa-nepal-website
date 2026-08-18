# OXSA Nepal Website

A production-ready, mobile-first website for OXSA Nepal Animal Welfare Society. It uses the Next.js App Router, TypeScript, Tailwind CSS, React Server Components, Zod validation and a small Resend email adapter.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. To validate a production build, run `npm run build`.

## Environment variables

- `CONTACT_TO_EMAIL`: recipient for all forms; defaults to `mail@oxsanepal.org`
- `RESEND_API_KEY`: Resend API key
- `EMAIL_FROM`: verified sender such as `OXSA Nepal <website@example.org>`

If email settings are missing or delivery fails, the API returns an error and the form shows OXSA Nepal's phone and email. It never shows a false success message.

## Content map

- Contact, visiting hours and donation details: `src/config/site.ts`
- Sponsor animals, stories, blog, FAQs, vet centres, wishlist and adoption listings: `src/content/data.ts`
- Reusable page sections and route content: `src/components/Pages.tsx`
- Search, filtering, copying and forms: `src/components/Interactive.tsx`
- Header, footer and global calls to action: `src/components/SiteChrome.tsx`
- Design tokens and responsive styling: `app/globals.css`

To publish an adoption listing, update its data and set `status: "available"`. To add an animal, story, blog post or vet centre, add an entry to the relevant exported collection. Add real photos under `public/images/animals`, `public/images/stories` or `public/images/blog`, then replace the branded placeholder in the relevant card/profile component with `next/image`.

## Forms

Contact, sponsor and adoption forms post to `/api/[type]`. The handler validates core identity fields with Zod, rejects a hidden honeypot, applies a basic per-IP rate limit and sends mail through Resend only after successful provider delivery.

## Deployment

This repository includes `.openai/hosting.json` for OpenAI Sites. For Vercel, import the repository, add the three environment variables above and deploy with the default Next.js settings.

Before public launch, complete every item in `CONTENT_VERIFICATION.md`—especially the missing rewritten content document and time-sensitive contact, donation, animal and veterinary information.
