import { NextResponse } from 'next/server';

// Disable caching to ensure real-time updates
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const placeId = process.env.GOOGLE_PLACE_ID;
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    // If API credentials are not configured, return empty array
    // The component will handle this gracefully
    if (!placeId || !apiKey) {
      return NextResponse.json({ 
        reviews: [],
        rating: 0,
        totalReviews: 0,
        message: 'Google Places API not configured. Please add GOOGLE_PLACE_ID and GOOGLE_PLACES_API_KEY to your environment variables.'
      });
    }

    // Fetch place details including reviews from Google Places API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews&key=${apiKey}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch reviews from Google Places API');
    }

    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places API error: ${data.status}`);
    }

    // Format reviews data
    const reviews = (data.result?.reviews || []).map((review: any) => ({
      authorName: review.author_name,
      authorPhoto: review.profile_photo_url || null,
      rating: review.rating,
      text: review.text,
      time: review.time,
      relativeTimeDescription: review.relative_time_description,
    }));

    return NextResponse.json({
      reviews,
      rating: data.result?.rating || 0,
      totalReviews: data.result?.user_ratings_total || 0,
      placeName: data.result?.name || 'Inuka Afrika Properties',
    });
  } catch (error: any) {
    console.error('Error fetching Google Reviews:', error);
    return NextResponse.json(
      { 
        reviews: [],
        rating: 0,
        totalReviews: 0,
        error: error.message || 'Failed to fetch reviews'
      },
      { status: 500 }
    );
  }
}


