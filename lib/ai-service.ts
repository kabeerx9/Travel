import { TripFormData, TripPlan } from '@/types';

// In a production environment, these should be environment variables
const API_URL = '"https://api.aimlapi.com/v1"';
const API_KEY =
  process.env.NEXT_PUBLIC_AI_API_KEY || 'd3048911027f411089a96cd084dbe73b';

export async function generateTripPlan(
  formData: TripFormData
): Promise<TripPlan> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        destination: formData.destination,
        dates: {
          from: formData.dates.from.toISOString(),
          to: formData.dates.to.toISOString(),
        },
        travelers: formData.travelers,
        groupType: formData.groupType,
        tripStyle: formData.tripStyle,
        budget: formData.budget,
        interests: formData.interests,
        dietaryPreferences: formData.dietaryPreferences,
        accommodationType: formData.accommodationType,
        activityLevel: formData.activityLevel,
        specialRequirements: formData.specialRequirements,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', errorData);
      throw new Error(errorData.message || 'Failed to generate trip plan');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Trip generation error:', error);
    throw error;
  }
}
