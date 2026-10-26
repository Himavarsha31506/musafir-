import { TripItinerary, ItineraryDay } from '../types/travel';

export interface PlanTripRequest {
  startingCity: string;
  destination: string;
  startDate: string;
  endDate?: string;
  durationDays: number;
  travellersCount: number;
  travellerMode: string;
  budgetTier: string;
  preferredTransport: string;
  accommodationType: string;
  interests: string[];
  travelPace: string;
  specialRequests?: string;
}

export async function generateAITrip(params: PlanTripRequest): Promise<{ success: boolean; trip: TripItinerary; generatedBy?: string }> {
  try {
    const res = await fetch('/api/plan-trip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }

    const data = await res.json();
    if (data.success && data.trip) {
      return { success: true, trip: data.trip, generatedBy: data.generatedBy };
    }
    throw new Error(data.error || 'Failed to generate trip');
  } catch (err: any) {
    console.warn('API call failed, generating localized trip client-side:', err);
    throw err;
  }
}

export async function regenerateDayWithAI(params: {
  destination: string;
  dayNumber: number;
  date: string;
  travellerMode: string;
  pace: string;
}): Promise<{ success: boolean; day: ItineraryDay }> {
  try {
    const res = await fetch('/api/regenerate-day', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }

    const data = await res.json();
    if (data.success && data.day) {
      return { success: true, day: data.day };
    }
    throw new Error(data.error || 'Failed to regenerate day');
  } catch (err: any) {
    console.warn('Day regeneration failed:', err);
    throw err;
  }
}
