# Supabase Setup Guide

## 1. Database
Run in order in the Supabase SQL Editor:
1. `supabase/schema.sql`
2. `supabase/storage.sql`
3. `supabase/seed.sql` (optional sample data)

## 2. Auth
Create an admin user in **Authentication → Users**.

## 3. Environment variables
Copy `.env.example` to `.env.local` and fill in:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 4. Seed properties
```bash
npm run seed:properties
```

## 5. Image uploads
The `admin-uploads` bucket is created by `storage.sql`. Upload from any admin form via the image uploader.

## 6. Email notifications

### Option A — Resend (recommended, built into API routes)
1. Sign up at [resend.com](https://resend.com)
2. Add to `.env.local`:
   ```
   RESEND_API_KEY=re_xxx
   NOTIFY_EMAIL=admin@inukaproperties.co.ke
   EMAIL_FROM=IAPL Admin <notifications@inukaproperties.co.ke>
   ```
3. Notifications send automatically when contact/site-visit forms submit.

### Option B — Supabase Edge Function
```bash
supabase secrets set RESEND_API_KEY=re_xxx NOTIFY_EMAIL=admin@inukaproperties.co.ke SITE_URL=https://www.inukaproperties.co.ke
supabase functions deploy send-notification
```
Create Database Webhooks on `inquiries` and `property_leads` INSERT → function URL.

### Option C — Next.js webhook
Set `WEBHOOK_SECRET` and point Supabase Database Webhooks to:
`https://your-site.com/api/webhooks/notify` with header `Authorization: Bearer YOUR_SECRET`

## 7. Private admin URL

Set in `.env.local` (both must match):

```
ADMIN_PATH=/your-secret-path
NEXT_PUBLIC_ADMIN_PATH=/your-secret-path
```

Sign in at: `https://your-site.com/your-secret-path/login`

The default `/admin` URL is **not linked** anywhere on the public site and returns 404 when a custom path is configured.

## 8. Dynamic content
- **Blogs**: New posts in admin appear at `/iapl-insider/blogs/[slug]` (static article folders still take priority).
- **Properties**: Admin + seed script sync to `/for-sale` and detail pages.
- **News / Market Research**: Managed in admin, live on frontend via API.
