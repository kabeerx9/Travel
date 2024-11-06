export interface TripPlan {
  destination: string;
  dates: {
    from: Date;
    to: Date;
  };
  travelers: number;
  groupType: 'solo' | 'couple' | 'family' | 'friends';
  tripStyle: 'adventure' | 'cultural' | 'relaxed' | 'foodie' | 'budget';
  budget: number;
  activities: string[];
  activityLevel: 'low' | 'medium' | 'high';
  itinerary: DayPlan[];
}

export interface DayPlan {
  day: number;
  date: string;
  schedule: {
    time: string;
    activity: string;
    description: string;
    location?: string;
    cost?: number;
  }[];
}

export interface ContactInfo {
  email: string;
  whatsapp?: string;
}