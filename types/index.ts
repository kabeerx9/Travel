export interface TripFormData {
  destination: string
  dates: {
    from: Date
    to: Date
  }
  travelers: number
  groupType: 'solo' | 'couple' | 'family' | 'friends'
  tripStyle: 'adventure' | 'cultural' | 'relaxed' | 'foodie' | 'budget'
  budget: number
  interests: string[]
  dietaryPreferences: string[]
  accommodationType: 'hotel' | 'hostel' | 'apartment' | 'resort' | 'local'
  activityLevel: 'low' | 'medium' | 'high'
  specialRequirements?: string
}

export interface Activity {
  time: string
  title: string
  description: string
  location: string
  cost: number
  weatherDependent: boolean
  alternativeActivity?: Activity
  tips?: string[]
}

export interface DayPlan {
  date: string
  activities: Activity[]
  meals: {
    breakfast: string
    lunch: string
    dinner: string
  }
  transportation: {
    type: string
    cost: number
    notes?: string
  }
  accommodation: {
    name: string
    type: string
    cost: number
    location: string
  }
  totalCost: number
  weatherForecast?: {
    condition: string
    temperature: number
    precipitation: number
  }
}

export interface TripPlan {
  destination: string
  dates: {
    from: Date
    to: Date
  }
  travelers: number
  totalCost: number
  overview: string
  days: DayPlan[]
  tips: {
    category: string
    items: string[]
  }[]
  emergencyContacts: {
    type: string
    contact: string
  }[]
}

export interface ContactInfo {
  email: string
  whatsapp?: string
  notificationPreferences?: ('email' | 'whatsapp')[]
}