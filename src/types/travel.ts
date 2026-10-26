export type TravellerModeType = 'solo' | 'group' | 'social' | 'family' | 'couple';

export type BudgetTier = 'budget' | 'moderate' | 'luxury';
export type TravelPace = 'relaxed' | 'balanced' | 'packed';
export type TripDurationType = 'weekend' | 'week' | 'extended';

export interface UserPreferences {
  interests: string[];
  preferredDestinations: string[];
  budgetTier: BudgetTier;
  preferredDuration: TripDurationType;
  accommodationType: string;
  travelPace: TravelPace;
  favoriteActivities: string[];
  specialRequirements: string[];
  preferredMode: TravellerModeType;
  hasCompletedQuestionnaire: boolean;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: string;
}

export interface Activity {
  id: string;
  title: string;
  timeSlot: 'morning' | 'afternoon' | 'evening';
  startTime: string; // e.g. "09:00 AM"
  endTime: string;   // e.g. "11:30 AM"
  duration: string;  // e.g. "2.5 hours"
  location: string;
  lat?: number;
  lng?: number;
  description: string;
  category: 'sightseeing' | 'food' | 'nature' | 'culture' | 'adventure' | 'relaxation' | 'hidden_gem';
  estimatedCost: number; // in INR
  travelTimeToNext?: string; // e.g. "20 mins via auto-rickshaw"
  insiderTip?: string;
  isCustom?: boolean;
}

export interface ItineraryDay {
  dayNumber: number;
  date: string;
  theme: string;
  summary: string;
  activities: Activity[];
}

export interface AccommodationOption {
  id: string;
  name: string;
  type: string; // 'Boutique Haveli' | 'Eco Lodge' | 'Homestay' | 'Luxury Resort'
  location: string;
  rating: number;
  reviewsCount: number;
  pricePerNight: number;
  amenities: string[];
  imageUrl: string;
  bookingProvider: string;
  providerUrl: string;
  isDemo?: boolean;
}

export interface TransportOption {
  id: string;
  type: 'flight' | 'train' | 'bus' | 'cab';
  provider: string;
  route: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  estimatedPrice: number;
  bookingUrl: string;
  isDemo?: boolean;
}

export interface FoodSpot {
  name: string;
  cuisine: string;
  signatureDish: string;
  priceRange: string; // '₹' | '₹₹' | '₹₹₹'
  area: string;
  highlight: string;
}

export interface BudgetBreakdown {
  transport: number;
  accommodation: number;
  food: number;
  activities: number;
  miscellaneous: number;
  total: number;
  perPerson: number;
}

export interface TripItinerary {
  id: string;
  userId?: string;
  title: string;
  startingCity: string;
  destination: string;
  destinationSummary: string;
  whySuitedForYou: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  travellersCount: number;
  travellerMode: TravellerModeType;
  budgetTier: BudgetTier;
  pace: TravelPace;
  interests: string[];
  days: ItineraryDay[];
  accommodations: AccommodationOption[];
  transportOptions: TransportOption[];
  localFoodSpots: FoodSpot[];
  hiddenGems: string[];
  budget: BudgetBreakdown;
  safetyTips: string[];
  packingEssentials: string[];
  isSaved?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Destination {
  id: string;
  name: string;
  stateOrCountry: string;
  tagline: string;
  description: string;
  heroImage: string;
  category: 'Mountains' | 'Heritage' | 'Beaches' | 'Nature' | 'Spiritual' | 'Adventure';
  idealDuration: string;
  bestTimeToVisit: string;
  averageDailyCost: number; // in INR
  suitableModes: TravellerModeType[];
  highlights: string[];
  topAttractions: string[];
  localSpecialties: string[];
  lat: number;
  lng: number;
  rating: number;
  reviewsCount: number;
}

export interface HiddenGem {
  id: string;
  name: string;
  location: string;
  destinationId?: string;
  category: 'Nature' | 'Food' | 'Culture' | 'Adventure' | 'Heritage' | 'Offbeat';
  imageUrl: string;
  description: string;
  whyVisit: string;
  bestTime: string;
  entryFee: string;
  estimatedDuration: string;
  directions: string;
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  submittedBy?: string;
  lat: number;
  lng: number;
  tags: string[];
  reviews: Review[];
}

export interface Review {
  id: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  isVerifiedTraveller: boolean;
}

export interface SocialMeetup {
  id: string;
  title: string;
  destination: string;
  location: string;
  date: string;
  time: string;
  type: 'walking_tour' | 'photography_walk' | 'cooking_workshop' | 'cafe_crawl' | 'sunset_meetup';
  hostName: string;
  hostBadge: string;
  attendeesCount: number;
  maxCapacity: number;
  price: number; // 0 for free
  description: string;
  safetyNotice: string;
}
