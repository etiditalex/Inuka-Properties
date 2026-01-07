# Google Reviews Integration Setup

This document explains how to set up the Google Reviews integration to display real-time reviews from Google.

## Features

- ✅ Real-time Google Reviews from Google Places API
- ✅ Automatic fallback to sample reviews if API is not configured
- ✅ Responsive design (3 reviews on desktop, carousel on mobile)
- ✅ Star ratings display
- ✅ Link to view all reviews on Google Maps

## Setup Instructions

### Step 1: Get Google Places API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Places API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Places API"
   - Click "Enable"
4. Create an API Key:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key

### Step 2: Get Your Google Place ID

1. Go to [Google Maps](https://www.google.com/maps)
2. Search for your business: "Inuka Afrika Properties Nyali Mombasa"
3. Click on your business listing
4. In the URL or business details, find your **Place ID** (it looks like: `ChIJ...`)
   - Alternatively, use [Google Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)

### Step 3: Add Environment Variables

Add these to your `.env.local` file:

```env
GOOGLE_PLACES_API_KEY=your_api_key_here
GOOGLE_PLACE_ID=your_place_id_here
```

### Step 4: Restart Your Development Server

After adding the environment variables, restart your Next.js development server:

```bash
npm run dev
```

## How It Works

1. **API Route** (`/api/google-reviews`):
   - Fetches reviews from Google Places API
   - Returns formatted review data with ratings, text, and author info
   - Falls back gracefully if API credentials are missing

2. **Component** (`GoogleReviewsSection`):
   - Fetches reviews on component mount
   - Displays 3 reviews on desktop in a grid
   - Shows carousel on mobile with navigation
   - Displays overall rating and total review count
   - Includes link to view all reviews on Google Maps

## Fallback Behavior

If the Google Places API is not configured:
- The component will display sample reviews
- Shows a 4.8-star rating with 25+ reviews
- All functionality remains the same (carousel, navigation, etc.)

## API Rate Limits

Google Places API has rate limits:
- **Free tier**: 1,000 requests per day
- **Paid tier**: Higher limits available

The reviews are cached on the client side and only fetched once per page load, so you should stay well within free tier limits.

## Troubleshooting

### Reviews not showing?

1. Check that your API key is correct in `.env.local`
2. Verify your Place ID is correct
3. Ensure Places API is enabled in Google Cloud Console
4. Check browser console for any error messages
5. Verify your API key has the correct permissions

### API errors?

- Make sure your API key has "Places API" enabled
- Check that billing is enabled (required for Places API)
- Verify your Place ID is valid

## Security Notes

- Never commit your `.env.local` file to version control
- The API key is used server-side only (in the API route)
- Client-side code never sees your API key

