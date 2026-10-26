import React, { createContext, useContext, useState, useEffect } from 'react';
import { TripItinerary, Activity, BudgetBreakdown } from '../types/travel';

interface TripContextType {
  activeTrip: TripItinerary | null;
  savedTrips: TripItinerary[];
  favoriteDestinations: string[];
  savedHiddenGems: string[];
  setActiveTrip: (trip: TripItinerary | null) => void;
  saveCurrentTrip: () => void;
  deleteSavedTrip: (id: string) => void;
  toggleFavoriteDestination: (id: string) => void;
  toggleSaveHiddenGem: (id: string) => void;
  addActivityToDay: (dayNumber: number, activity: Activity) => void;
  removeActivity: (dayNumber: number, activityId: string) => void;
  updateActivity: (dayNumber: number, activity: Activity) => void;
  moveActivity: (dayNumber: number, activityId: string, direction: 'up' | 'down') => void;
  moveActivityToDay: (fromDay: number, toDay: number, activityId: string) => void;
  recalculateBudget: (trip: TripItinerary) => BudgetBreakdown;
  updateActiveTripData: (updater: (prev: TripItinerary) => TripItinerary) => void;
}

const DEFAULT_SAMPLE_TRIP: TripItinerary = {
  id: 'trip_sample_udaipur_2026',
  title: 'Romantic Lakes & Regal Havelis of Udaipur',
  startingCity: 'New Delhi',
  destination: 'Udaipur',
  destinationSummary: 'Udaipur, the Crown Jewel of Rajasthan, is an oasis of royal heritage, shimmering emerald lakes, and timeless Mewar architecture nestled against the ancient Aravalli mountains.',
  whySuitedForYou: 'Personalized for your balanced pace with an emphasis on heritage walking, golden hour photography, tranquil boat rides, and authentic local Rajasthani dining.',
  startDate: '2026-11-10',
  endDate: '2026-11-13',
  durationDays: 4,
  travellersCount: 2,
  travellerMode: 'couple',
  budgetTier: 'moderate',
  pace: 'balanced',
  interests: ['culture', 'nature', 'food', 'photography'],
  isSaved: true,
  createdAt: '2026-10-24',
  updatedAt: '2026-10-24',
  budget: {
    transport: 8400,
    accommodation: 14500,
    food: 6800,
    activities: 3800,
    miscellaneous: 2500,
    total: 36000,
    perPerson: 18000
  },
  days: [
    {
      dayNumber: 1,
      date: '2026-11-10',
      theme: 'Arrival & The Shimmering Sunset on Lake Pichola',
      summary: 'Check into your heritage lakeside stay, soak in the tranquil lake breezes, and take an evening boat cruise past illuminated marble palaces.',
      activities: [
        {
          id: 'act-1-1',
          title: 'Arrival & Check-in at Amet Haveli / Lake Pichola',
          timeSlot: 'morning',
          startTime: '11:00 AM',
          endTime: '01:00 PM',
          duration: '2 hours',
          location: 'Hanuman Ghat, Lake Pichola',
          description: 'Settle into your traditional Mewari room with intricate jharokha bay windows facing the tranquil waters.',
          category: 'relaxation',
          estimatedCost: 0,
          travelTimeToNext: '10 mins walk',
          insiderTip: 'Request an upper-floor room for prime views of Jag Mandir.'
        },
        {
          id: 'act-1-2',
          title: 'Lunch at Jheel’s Ginger Coffee & Bakery',
          timeSlot: 'afternoon',
          startTime: '01:30 PM',
          endTime: '02:45 PM',
          duration: '1.25 hours',
          location: 'Gangaur Ghat Marg',
          description: 'Rooftop cafe perched right over the water serving artisan coffees, fresh wood-fired thin crust pizza, and local lemon sodas.',
          category: 'food',
          estimatedCost: 900,
          travelTimeToNext: '5 mins walk',
          insiderTip: 'Try their spiced cold brew and walnut pie.'
        },
        {
          id: 'act-1-3',
          title: 'Private Sunset Boat Cruise around Jag Mandir Palace',
          timeSlot: 'evening',
          startTime: '04:45 PM',
          endTime: '06:15 PM',
          duration: '1.5 hours',
          location: 'Rameshwar Ghat boarding point',
          description: 'Glide on shimmering golden waters as the sun sets behind the Sajjangarh Monsoon Palace atop the distant hills.',
          category: 'sightseeing',
          estimatedCost: 1600,
          travelTimeToNext: '15 mins walk',
          insiderTip: 'Golden hour between 5:15 PM and 5:45 PM offers dreamlike photo light.'
        },
        {
          id: 'act-1-4',
          title: 'Bagore Ki Haveli Evening Dharohar Folk Dance Show',
          timeSlot: 'evening',
          startTime: '07:00 PM',
          endTime: '08:15 PM',
          duration: '1.25 hours',
          location: 'Gangaur Ghat',
          description: 'World-renowned traditional Rajasthani performance featuring Chari fire dancing, vibrant puppet theatre, and the iconic 11-brass-pot balancing act.',
          category: 'culture',
          estimatedCost: 350,
          travelTimeToNext: 'Walk to dinner',
          insiderTip: 'Arrive by 6:30 PM to get front-row floor mattress seating.'
        }
      ]
    },
    {
      dayNumber: 2,
      date: '2026-11-11',
      theme: 'Royal Opulence & Ancient Artisan Lanes',
      summary: 'Explore the labyrinthine City Palace, wander through Jagdish Temple courtyard, and sample royal Mewari thali.',
      activities: [
        {
          id: 'act-2-1',
          title: 'Comprehensive Morning Tour of Udaipur City Palace',
          timeSlot: 'morning',
          startTime: '09:00 AM',
          endTime: '12:00 PM',
          duration: '3 hours',
          location: 'City Palace Complex',
          description: 'Spanning over 400 years of Mewar history, marvel at Sheesh Mahal (Mirror Palace), Mor Chowk (peacock mosaics), and royal courtyards.',
          category: 'culture',
          estimatedCost: 900,
          travelTimeToNext: '7 mins walk',
          insiderTip: 'Book an audio guide or verified certified guide at Gate 1.'
        },
        {
          id: 'act-2-2',
          title: 'Royal Dal Baati Churma Lunch at Krishna Dal Bati Restro',
          timeSlot: 'afternoon',
          startTime: '12:30 PM',
          endTime: '01:45 PM',
          duration: '1.25 hours',
          location: 'Jal B-Road',
          description: 'Famous unlimited traditional Rajasthani thali with wood-charcoal roasted baatis, pure ghee, panchmel dal, and sweet churma.',
          category: 'food',
          estimatedCost: 650,
          travelTimeToNext: '15 mins auto-rickshaw',
          insiderTip: 'Wash it down with their chilled cumin buttermilk.'
        },
        {
          id: 'act-2-3',
          title: 'Saheliyon Ki Bari (Garden of the Royal Maids)',
          timeSlot: 'afternoon',
          startTime: '02:30 PM',
          endTime: '04:00 PM',
          duration: '1.5 hours',
          location: 'Panchwati',
          description: 'Lush 18th-century royal pleasure garden with marble elephant fountains powered naturally by gravity water pressure from Fateh Sagar Lake.',
          category: 'nature',
          estimatedCost: 150,
          travelTimeToNext: '10 mins auto-rickshaw',
          insiderTip: 'Look for the lotus pools and ancient bougainvillea trellises.'
        },
        {
          id: 'act-2-4',
          title: 'Candlelit Lakefront Dinner at Ambrai Restaurant',
          timeSlot: 'evening',
          startTime: '07:30 PM',
          endTime: '09:30 PM',
          duration: '2 hours',
          location: 'Amet Haveli, Ambavgarh',
          description: 'Celebrated open-air dining terrace directly across the water from the floodlit City Palace and Lake Palace.',
          category: 'food',
          estimatedCost: 2800,
          travelTimeToNext: '5 mins walk',
          insiderTip: 'Reserve 1-2 weeks in advance for a front-row water-edge table.'
        }
      ]
    },
    {
      dayNumber: 3,
      date: '2026-11-12',
      theme: 'Offbeat Hills, Serene Reservoirs & Sunset Fortress',
      summary: 'Discover the hidden Bahubali Hill viewpoint over Badi Lake, visit artisanal craft villages, and catch dusk from Sajjangarh.',
      activities: [
        {
          id: 'act-3-1',
          title: 'Early Morning Trek to Bahubali Hill & Badi Lake (Hidden Gem)',
          timeSlot: 'morning',
          startTime: '06:30 AM',
          endTime: '09:00 AM',
          duration: '2.5 hours',
          location: 'Badi Lake, 12km from city',
          description: 'Short 15-minute trail up Bahubali rock outcrop giving stunning 360-degree vistas over misty hills and sapphire water.',
          category: 'hidden_gem',
          estimatedCost: 200,
          travelTimeToNext: '25 mins cab ride',
          insiderTip: 'Go early before 8 AM for tranquil solitude and soft morning light.'
        },
        {
          id: 'act-3-2',
          title: 'Shilpgram Rural Arts & Crafts Complex Walk',
          timeSlot: 'afternoon',
          startTime: '11:00 AM',
          endTime: '01:30 PM',
          duration: '2.5 hours',
          location: 'Havala Khurd',
          description: 'Living ethnographic museum with 26 authentic indigenous huts representing tribal cultures of Rajasthan, Gujarat, and Goa.',
          category: 'culture',
          estimatedCost: 300,
          travelTimeToNext: '20 mins auto',
          insiderTip: 'Watch live potters and leather-craft artisans at work.'
        },
        {
          id: 'act-3-3',
          title: 'Sajjangarh Monsoon Palace Panoramic Sunset',
          timeSlot: 'evening',
          startTime: '04:30 PM',
          endTime: '06:30 PM',
          duration: '2 hours',
          location: 'Bansdara Peak (3100 ft)',
          description: 'Hilltop palatial hunting lodge built in 1884 to view monsoon clouds, offering dramatic bird’s-eye vistas of the entire Udaipur valley.',
          category: 'sightseeing',
          estimatedCost: 400,
          travelTimeToNext: '20 mins ride back',
          insiderTip: 'Watch out for friendly langur monkeys near the sanctuary gate.'
        }
      ]
    },
    {
      dayNumber: 4,
      date: '2026-11-13',
      theme: 'Artisanal Keepsakes & Fond Farewell',
      summary: 'Stroll through Jagdish Temple market for blue pottery and miniature Mewari paintings before departure.',
      activities: [
        {
          id: 'act-4-1',
          title: 'Old City Artisanal Painting & Silver Bazaar Walk',
          timeSlot: 'morning',
          startTime: '10:00 AM',
          endTime: '12:30 PM',
          duration: '2.5 hours',
          location: 'Hathi Pol & Bada Bazaar',
          description: 'Meet miniature painting masters painting with squirrel hair brushes on handmade camel paper; pick up authentic silver filigree.',
          category: 'culture',
          estimatedCost: 600,
          travelTimeToNext: '10 mins walk',
          insiderTip: 'Bargaining is polite and customary; ask for stone-color authenticity.'
        },
        {
          id: 'act-4-2',
          title: 'Farewell Tea & Kachori at Paliwal Kachori Center',
          timeSlot: 'afternoon',
          startTime: '01:00 PM',
          endTime: '02:00 PM',
          duration: '1 hour',
          location: 'Jagdish Chowk',
          description: 'Crunchy, piping-hot pyaz and hing kachori served with spicy mint chutney and sweet tamarind sauce.',
          category: 'food',
          estimatedCost: 200,
          travelTimeToNext: 'Airport/Station transfer',
          insiderTip: 'Fresh batches come out hot every 20 minutes.'
        }
      ]
    }
  ],
  accommodations: [
    {
      id: 'acc-1',
      name: 'Amet Haveli – Heritage Lakefront Stay',
      type: 'Heritage Haveli',
      location: 'Outside Chandpole, Lake Pichola',
      rating: 4.8,
      reviewsCount: 620,
      pricePerNight: 7200,
      amenities: ['Lake View Jharokhas', 'Heritage Courtyard Pool', 'Ambrai Restaurant On-site', 'Free Breakfast', 'Wi-Fi'],
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      bookingProvider: 'MakeMyTrip / Booking.com',
      providerUrl: 'https://www.makemytrip.com/hotels/udaipur-hotels.html',
      isDemo: true
    },
    {
      id: 'acc-2',
      name: 'Madpackers Udaipur Rooftop Hostel',
      type: 'Boutique Backpacker',
      location: 'Near Gangaur Ghat',
      rating: 4.7,
      reviewsCount: 940,
      pricePerNight: 1600,
      amenities: ['Panoramic Sunset Roof', 'Co-working Cafe', 'Community Walking Tours', 'Air Conditioning'],
      imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
      bookingProvider: 'Hostelworld / Booking.com',
      providerUrl: 'https://www.hostelworld.com',
      isDemo: true
    }
  ],
  transportOptions: [
    {
      id: 'tr-1',
      type: 'flight',
      provider: 'IndiGo 6E-2041',
      route: 'DEL (New Delhi) → UDR (Maharana Pratap Airport)',
      departureTime: '07:15 AM',
      arrivalTime: '08:45 AM',
      duration: '1h 30m',
      estimatedPrice: 4200,
      bookingUrl: 'https://www.goindigo.in',
      isDemo: true
    },
    {
      id: 'tr-2',
      type: 'train',
      provider: 'Mewar Superfast Express (12963)',
      route: 'NZM (Hazrat Nizamuddin) → UDZ (Udaipur City)',
      departureTime: '06:25 PM (Overnight)',
      arrivalTime: '07:15 AM',
      duration: '12h 50m (AC 2-Tier)',
      estimatedPrice: 1750,
      bookingUrl: 'https://www.irctc.co.in',
      isDemo: true
    }
  ],
  localFoodSpots: [
    {
      name: 'Ambrai Restaurant',
      cuisine: 'Mewari & North Indian',
      signatureDish: 'Mewari Khargosh / Laal Maas & Garlic Naan',
      priceRange: '₹₹₹',
      area: 'Outside Chandpole',
      highlight: 'Direct open-air water view of lit-up City Palace.'
    },
    {
      name: 'Krishna Dal Baati',
      cuisine: 'Authentic Rajasthani',
      signatureDish: 'Unlimited Thali with Dal Baati Churma & Buttermilk',
      priceRange: '₹',
      area: 'Jal B Road',
      highlight: 'Pure authentic local flavors cooked in desi ghee.'
    },
    {
      name: 'Jheel’s Ginger Coffee & Bakery',
      cuisine: 'Cafe & Continental',
      signatureDish: 'Spiced Cold Brew & Smoked Paneer Croissant',
      priceRange: '₹₹',
      area: 'Gangaur Ghat Marg',
      highlight: 'Relaxed water edge seating directly over the lake.'
    }
  ],
  hiddenGems: [
    'Bahubali Hill sunrise over Badi Lake',
    'Chet Singh Ghat quiet sandstone terraces',
    'Panna Meena Ka Kund architectural stepwell'
  ],
  safetyTips: [
    'Only hire Rajasthan Tourism (RTDC) certified guides with valid ID cards.',
    'Pre-agree auto-rickshaw fares or use app-based autos to avoid inflated tourist fares.',
    'Keep modest clothing handy for visiting active temples like Jagdish Temple.'
  ],
  packingEssentials: [
    'Comfortable walking shoes with good grip for palace stone steps',
    'Light cotton clothes for afternoon sun + a light pashmina/shawl for evening breezes by the lake',
    'Sunglasses and high-SPF sun lotion',
    'Reusable water bottle to stay hydrated'
  ]
};

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTrip, setActiveTrip] = useState<TripItinerary | null>(() => {
    try {
      const saved = localStorage.getItem('musafir_active_trip');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_SAMPLE_TRIP;
  });

  const [savedTrips, setSavedTrips] = useState<TripItinerary[]>(() => {
    try {
      const saved = localStorage.getItem('musafir_saved_trips');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [DEFAULT_SAMPLE_TRIP];
  });

  const [favoriteDestinations, setFavoriteDestinations] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('musafir_fav_destinations');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['udaipur', 'meghalaya', 'munnar'];
  });

  const [savedHiddenGems, setSavedHiddenGems] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('musafir_fav_gems');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['gem-1', 'gem-3'];
  });

  useEffect(() => {
    if (activeTrip) {
      localStorage.setItem('musafir_active_trip', JSON.stringify(activeTrip));
    }
  }, [activeTrip]);

  useEffect(() => {
    localStorage.setItem('musafir_saved_trips', JSON.stringify(savedTrips));
  }, [savedTrips]);

  useEffect(() => {
    localStorage.setItem('musafir_fav_destinations', JSON.stringify(favoriteDestinations));
  }, [favoriteDestinations]);

  useEffect(() => {
    localStorage.setItem('musafir_fav_gems', JSON.stringify(savedHiddenGems));
  }, [savedHiddenGems]);

  const recalculateBudget = (trip: TripItinerary): BudgetBreakdown => {
    let activitiesTotal = 0;
    trip.days.forEach(day => {
      day.activities.forEach(act => {
        activitiesTotal += act.estimatedCost || 0;
      });
    });

    const travellers = Math.max(1, trip.travellersCount || 1);
    const duration = Math.max(1, trip.durationDays || 3);

    // Approximate accommodation:
    const accCostPerNight = trip.accommodations?.[0]?.pricePerNight || (trip.budgetTier === 'luxury' ? 9000 : trip.budgetTier === 'moderate' ? 3500 : 1800);
    const accommodation = accCostPerNight * (duration - 1);

    // Transport:
    const transportPerPerson = trip.transportOptions?.[0]?.estimatedPrice || (trip.budgetTier === 'luxury' ? 6000 : trip.budgetTier === 'moderate' ? 3500 : 1500);
    const transport = transportPerPerson * travellers;

    // Food estimate:
    const dailyFoodPerPerson = trip.budgetTier === 'luxury' ? 2200 : trip.budgetTier === 'moderate' ? 1000 : 500;
    const food = dailyFoodPerPerson * duration * travellers;

    const misc = Math.round((activitiesTotal + food) * 0.15);
    const total = transport + accommodation + food + activitiesTotal + misc;
    const perPerson = Math.round(total / travellers);

    return {
      transport,
      accommodation,
      food,
      activities: activitiesTotal,
      miscellaneous: misc,
      total,
      perPerson
    };
  };

  const updateActiveTripData = (updater: (prev: TripItinerary) => TripItinerary) => {
    setActiveTrip(prev => {
      if (!prev) return null;
      const updated = updater(prev);
      const newBudget = recalculateBudget(updated);
      const finalTrip = {
        ...updated,
        budget: newBudget,
        updatedAt: new Date().toISOString()
      };
      return finalTrip;
    });
  };

  const saveCurrentTrip = () => {
    if (!activeTrip) return;
    const tripToSave = { ...activeTrip, isSaved: true, updatedAt: new Date().toISOString() };
    setActiveTrip(tripToSave);
    setSavedTrips(prev => {
      const idx = prev.findIndex(t => t.id === tripToSave.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = tripToSave;
        return copy;
      }
      return [tripToSave, ...prev];
    });
  };

  const deleteSavedTrip = (id: string) => {
    setSavedTrips(prev => prev.filter(t => t.id !== id));
    if (activeTrip?.id === id) {
      setActiveTrip(null);
    }
  };

  const toggleFavoriteDestination = (id: string) => {
    setFavoriteDestinations(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSaveHiddenGem = (id: string) => {
    setSavedHiddenGems(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const addActivityToDay = (dayNumber: number, activity: Activity) => {
    updateActiveTripData(trip => {
      const days = trip.days.map(d => {
        if (d.dayNumber === dayNumber) {
          return {
            ...d,
            activities: [...d.activities, activity]
          };
        }
        return d;
      });
      return { ...trip, days };
    });
  };

  const removeActivity = (dayNumber: number, activityId: string) => {
    updateActiveTripData(trip => {
      const days = trip.days.map(d => {
        if (d.dayNumber === dayNumber) {
          return {
            ...d,
            activities: d.activities.filter(a => a.id !== activityId)
          };
        }
        return d;
      });
      return { ...trip, days };
    });
  };

  const updateActivity = (dayNumber: number, updatedActivity: Activity) => {
    updateActiveTripData(trip => {
      const days = trip.days.map(d => {
        if (d.dayNumber === dayNumber) {
          return {
            ...d,
            activities: d.activities.map(a => a.id === updatedActivity.id ? updatedActivity : a)
          };
        }
        return d;
      });
      return { ...trip, days };
    });
  };

  const moveActivity = (dayNumber: number, activityId: string, direction: 'up' | 'down') => {
    updateActiveTripData(trip => {
      const days = trip.days.map(d => {
        if (d.dayNumber === dayNumber) {
          const idx = d.activities.findIndex(a => a.id === activityId);
          if (idx < 0) return d;
          const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
          if (targetIdx < 0 || targetIdx >= d.activities.length) return d;

          const newActivities = [...d.activities];
          const [moved] = newActivities.splice(idx, 1);
          newActivities.splice(targetIdx, 0, moved);
          return { ...d, activities: newActivities };
        }
        return d;
      });
      return { ...trip, days };
    });
  };

  const moveActivityToDay = (fromDay: number, toDay: number, activityId: string) => {
    if (fromDay === toDay) return;
    updateActiveTripData(trip => {
      let movedActivity: Activity | undefined;
      const daysAfterRemoval = trip.days.map(d => {
        if (d.dayNumber === fromDay) {
          movedActivity = d.activities.find(a => a.id === activityId);
          return {
            ...d,
            activities: d.activities.filter(a => a.id !== activityId)
          };
        }
        return d;
      });

      if (!movedActivity) return trip;

      const finalDays = daysAfterRemoval.map(d => {
        if (d.dayNumber === toDay) {
          return {
            ...d,
            activities: [...d.activities, movedActivity!]
          };
        }
        return d;
      });

      return { ...trip, days: finalDays };
    });
  };

  return (
    <TripContext.Provider
      value={{
        activeTrip,
        savedTrips,
        favoriteDestinations,
        savedHiddenGems,
        setActiveTrip,
        saveCurrentTrip,
        deleteSavedTrip,
        toggleFavoriteDestination,
        toggleSaveHiddenGem,
        addActivityToDay,
        removeActivity,
        updateActivity,
        moveActivity,
        moveActivityToDay,
        recalculateBudget,
        updateActiveTripData
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
