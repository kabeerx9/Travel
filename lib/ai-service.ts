import { TripFormData, TripPlan } from '@/types'

const API_URL = 'https://api.aimlapi.com/api/v1/chat/completions'
const API_KEY = 'd3048911027f411089a96cd084dbe73b'

export async function generateTripPlan(formData: TripFormData): Promise<TripPlan> {
  try {
    const prompt = generatePrompt(formData)
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert travel planner. Create detailed, personalized travel itineraries based on user preferences.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate trip plan')
    }

    const data = await response.json()
    return parseTripPlan(data.choices[0].message.content, formData)
  } catch (error) {
    console.error('AI API Error:', error)
    throw error
  }
}

function generatePrompt(formData: TripFormData): string {
  const days = Math.ceil(
    (formData.dates.to.getTime() - formData.dates.from.getTime()) / (1000 * 60 * 60 * 24)
  )

  return `Create a detailed ${days}-day travel itinerary for ${formData.travelers} ${
    formData.travelers === 1 ? 'person' : 'people'
  } traveling to ${formData.destination}.

Trip Details:
- Group Type: ${formData.groupType}
- Travel Style: ${formData.tripStyle}
- Daily Budget: ₹${formData.budget}
- Activity Level: ${formData.activityLevel}
- Interests: ${formData.interests.join(', ')}
- Dietary Preferences: ${formData.dietaryPreferences.join(', ')}
- Accommodation Type: ${formData.accommodationType}
- Special Requirements: ${formData.specialRequirements || 'None'}

Please provide a detailed day-by-day itinerary including:
1. Morning, afternoon, and evening activities
2. Restaurant recommendations considering dietary preferences
3. Specific locations and attractions
4. Estimated costs for each activity
5. Local transportation options
6. Cultural insights and tips
7. Weather-appropriate activity alternatives
8. Local customs and etiquette tips

Format the response as a structured JSON object with clear time slots and descriptions.`
}

function parseTripPlan(aiResponse: string, formData: TripFormData): TripPlan {
  try {
    // Parse the AI response and structure it according to the TripPlan interface
    const parsedPlan = JSON.parse(aiResponse)
    
    return {
      ...parsedPlan,
      destination: formData.destination,
      dates: formData.dates,
      travelers: formData.travelers,
      totalCost: calculateTotalCost(parsedPlan.days),
      overview: generateOverview(parsedPlan, formData)
    }
  } catch (error) {
    console.error('Failed to parse AI response:', error)
    throw new Error('Failed to process trip plan')
  }
}

function calculateTotalCost(days: any[]): number {
  return days.reduce((total, day) => {
    return total + day.activities.reduce((dayTotal: number, activity: any) => {
      return dayTotal + (activity.cost || 0)
    }, 0)
  }, 0)
}

function generateOverview(plan: any, formData: TripFormData): string {
  const days = Math.ceil(
    (formData.dates.to.getTime() - formData.dates.from.getTime()) / (1000 * 60 * 60 * 24)
  )
  
  return `A ${days}-day ${formData.tripStyle} journey in ${formData.destination} designed for ${formData.groupType} travelers with a ${formData.activityLevel} activity level.`
}