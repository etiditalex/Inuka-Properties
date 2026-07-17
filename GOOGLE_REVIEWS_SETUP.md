# Google Reviews Integration Setup

The homepage testimonials section (`GoogleReviewsSection`) loads **real Google reviews** from the Places API and refreshes them about every 2 minutes.

## Required environment variables

Set these in `.env.local` (local) and in **Vercel → Project → Settings → Environment Variables**:

```env
GOOGLE_PLACES_API_KEY=your_api_key_here
GOOGLE_PLACE_ID=ChIJh7mWVCcTQBgRz0n0qhSMn1Q
```

`GOOGLE_PLACE_ID` already defaults to the Inuka Afrika Properties Place ID used by the “Write a Review” button if omitted.

## Google Cloud checklist (required)

1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. **Enable Billing** on the project (Places API will return `REQUEST_DENIED` until this is done)
3. Enable **Places API** (and/or Places API legacy Place Details)
4. Create an API key under **APIs & Services → Credentials**
5. Prefer restricting the key to:
   - API: Places API
   - Application: IP / server (for Vercel server routes) or leave unrestricted only while testing

After billing + Places API are enabled, redeploy on Vercel (or restart `npm run dev` locally).

## Behaviour

- API route: `/api/google-reviews`
- Sorts by **newest** reviews
- Server cache: **2 minutes** (keeps data fresh without excess API calls)
- Homepage auto-refreshes every **2 minutes**
- Manual **Refresh** button on the section
- If Google is unavailable, the section shows links to view/write Google reviews (no fake sample reviews)

## Limits

Google Place Details returns up to **5 reviews** per request (Google’s limit). The overall rating and total review count still come from Google and stay up to date.
