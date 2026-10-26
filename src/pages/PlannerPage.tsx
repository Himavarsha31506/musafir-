import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTrip } from '../context/TripContext';
import { generateAITrip, regenerateDayWithAI } from '../services/aiService';
import { TRAVELLER_MODES, POPULAR_DESTINATIONS } from '../data/travelData';
import { InteractiveMap } from '../components/InteractiveMap';
import { TravelOptionsCard } from '../components/TravelOptionsCard';
import { ItineraryEditorModal } from '../components/ItineraryEditorModal';
import { Activity, BudgetTier, TravelPace, TravellerModeType, TripItinerary } from '../types/travel';
import {
  Sparkles,
  MapPin,
  Calendar,
  Users,
  Compass,
  Wallet,
  Clock,
  ArrowRight,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  BookmarkCheck,
  Share2,
  Printer,
  Check,
  AlertTriangle,
  Lightbulb,
  UtensilsCrossed,
  Shield,
  Plane
} from 'lucide-react';

interface PlannerPageProps {
  initialDestination?: string;
  onOpenGems: () => void;
}

export const PlannerPage: React.FC<PlannerPageProps> = ({ initialDestination, onOpenGems }) => {
  const { user } = useAuth();
  const {
    activeTrip,
    setActiveTrip,
    saveCurrentTrip,
    addActivityToDay,
    removeActivity,
    updateActivity,
    moveActivity,
    moveActivityToDay
  } = useTrip();

  // Form State
  const [startingCity, setStartingCity] = useState('New Delhi');
  const [destination, setDestination] = useState(initialDestination || 'Udaipur');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [durationDays, setDurationDays] = useState(4);
  const [travellersCount, setTravellersCount] = useState(2);
  const [travellerMode, setTravellerMode] = useState<TravellerModeType>(
    user?.preferences?.preferredMode || 'solo'
  );
  const [budgetTier, setBudgetTier] = useState<BudgetTier>(
    user?.preferences?.budgetTier || 'moderate'
  );
  const [preferredTransport, setPreferredTransport] = useState('flight');
  const [accommodationType, setAccommodationType] = useState(
    user?.preferences?.accommodationType || 'Boutique Haveli & Homestay'
  );
  const [travelPace, setTravelPace] = useState<TravelPace>(
    user?.preferences?.travelPace || 'balanced'
  );
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    user?.preferences?.interests || ['culture', 'nature', 'food']
  );
  const [specialRequests, setSpecialRequests] = useState('');

  // UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationQuoteIndex, setGenerationQuoteIndex] = useState(0);
  const [activeDayTab, setActiveDayTab] = useState(1);
  const [editorModalOpen, setEditorModalOpen] = useState(false);
  const [editorDayNumber, setEditorDayNumber] = useState(1);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [regeneratingDayNumber, setRegeneratingDayNumber] = useState<number | null>(null);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [saveSuccessNotification, setSaveSuccessNotification] = useState(false);

  useEffect(() => {
    if (initialDestination) {
      setDestination(initialDestination);
    }
  }, [initialDestination]);

  const quotes = [
    '“Safar khubsurat hai manzil se bhi...” — Consulting travel maps',
    'Synthesizing practical morning, afternoon & dusk sequences...',
    'Curating authentic local food stalls and hidden viewpoints...',
    'Optimizing transport connections & timing between attractions...',
    'Finalizing personalized Musafir itinerary in your own style...'
  ];

  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      interval = setInterval(() => {
        setGenerationQuoteIndex(prev => (prev + 1) % quotes.length);
      }, 2200);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;

    setIsGenerating(true);
    try {
      const result = await generateAITrip({
        startingCity,
        destination: destination.trim(),
        startDate,
        durationDays: Number(durationDays),
        travellersCount: Number(travellersCount),
        travellerMode,
        budgetTier,
        preferredTransport,
        accommodationType,
        interests: selectedInterests,
        travelPace,
        specialRequests
      });

      if (result.success && result.trip) {
        setActiveTrip(result.trip);
        setActiveDayTab(1);
      }
    } catch (err) {
      console.error('Generation error handled:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateDay = async (dayNumber: number, dayDate: string) => {
    if (!activeTrip) return;
    setRegeneratingDayNumber(dayNumber);
    try {
      const res = await regenerateDayWithAI({
        destination: activeTrip.destination,
        dayNumber,
        date: dayDate,
        travellerMode: activeTrip.travellerMode,
        pace: activeTrip.pace
      });

      if (res.success && res.day) {
        setActiveTrip({
          ...activeTrip,
          days: activeTrip.days.map(d => d.dayNumber === dayNumber ? res.day : d)
        });
      }
    } catch (err) {
      console.error('Failed to regenerate day:', err);
    } finally {
      setRegeneratingDayNumber(null);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 2000);
  };

  const handleSave = () => {
    saveCurrentTrip();
    setSaveSuccessNotification(true);
    setTimeout(() => setSaveSuccessNotification(false), 2500);
  };

  const openAddActivity = (dayNumber: number) => {
    setEditorDayNumber(dayNumber);
    setEditingActivity(null);
    setEditorModalOpen(true);
  };

  const openEditActivity = (dayNumber: number, act: Activity) => {
    setEditorDayNumber(dayNumber);
    setEditingActivity(act);
    setEditorModalOpen(true);
  };

  const handleSaveActivityModal = (activity: Activity) => {
    if (editingActivity) {
      updateActivity(editorDayNumber, activity);
    } else {
      addActivityToDay(editorDayNumber, activity);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 bg-[#0A110E] text-[#F3F6F4]">
      
      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111F18] border border-[#234233] text-[#FBBF24] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>AI Trip Planning Engine</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F3F6F4]">
          Craft Your Journey, Aapke Andaaz Mein
        </h1>
        <p className="text-xs sm:text-sm text-[#8A9C93] max-w-xl mx-auto">
          Set your origin, dates, companions, and pacing. Musafir crafts a structured, realistic day-by-day itinerary that you can freely edit, reorder, and save.
        </p>
      </div>

      {/* TRIP PLANNER FORM CARD */}
      <div className="bg-[#0F1A15] rounded-3xl p-6 sm:p-8 border border-[#1E352B] shadow-2xl">
        <form onSubmit={handleGenerate} className="space-y-6">
          
          {/* Row 1: Starting City & Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#FBBF24] mb-1.5">
                Starting City / Origin *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-[#6B7E75]" />
                <input
                  type="text"
                  required
                  value={startingCity}
                  onChange={e => setStartingCity(e.target.value)}
                  placeholder="e.g. New Delhi, Mumbai, Bengaluru"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[#223B2F] bg-[#0A110E] font-semibold text-[#F3F6F4] focus:outline-none focus:border-[#F59E0B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#FBBF24] mb-1.5">
                Target Destination *
              </label>
              <div className="relative">
                <Compass className="absolute left-3.5 top-3 w-4 h-4 text-[#F59E0B]" />
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  placeholder="e.g. Udaipur, Hampi, Spiti, Munnar, Gokarna"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[#223B2F] bg-[#0A110E] font-semibold text-[#F3F6F4] focus:outline-none focus:border-[#F59E0B]"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Dates, Duration, Travellers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#D8E4DE] mb-1.5">
                Departure Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-[#6B7E75]" />
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[#223B2F] bg-[#0A110E] font-semibold text-[#F3F6F4]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#D8E4DE] mb-1.5">
                Trip Duration (Days)
              </label>
              <select
                value={durationDays}
                onChange={e => setDurationDays(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#223B2F] bg-[#0A110E] font-semibold text-[#F3F6F4]"
              >
                <option value={2} className="bg-[#101B16]">2 Days (Quick Escape)</option>
                <option value={3} className="bg-[#101B16]">3 Days (Long Weekend)</option>
                <option value={4} className="bg-[#101B16]">4 Days (Recommended)</option>
                <option value={5} className="bg-[#101B16]">5 Days (Immersive)</option>
                <option value={7} className="bg-[#101B16]">7 Days (Full Explorer)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#D8E4DE] mb-1.5">
                No. of Travellers
              </label>
              <div className="relative">
                <Users className="absolute left-3.5 top-3 w-4 h-4 text-[#6B7E75]" />
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={travellersCount}
                  onChange={e => setTravellersCount(Math.max(1, Number(e.target.value)))}
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[#223B2F] bg-[#0A110E] font-semibold text-[#F3F6F4]"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Traveller Mode & Budget Tier */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#D8E4DE] mb-1.5">
                Traveller Mode
              </label>
              <select
                value={travellerMode}
                onChange={e => setTravellerMode(e.target.value as TravellerModeType)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#223B2F] bg-[#0A110E] font-semibold text-[#F3F6F4] capitalize"
              >
                <option value="solo" className="bg-[#101B16]">Solo Traveller (Safe & Independent)</option>
                <option value="group" className="bg-[#101B16]">Group Travellers (Splits & Villas)</option>
                <option value="social" className="bg-[#101B16]">Social Travellers (Meetups & Walks)</option>
                <option value="family" className="bg-[#101B16]">Family Travellers (Comfort & Kids)</option>
                <option value="couple" className="bg-[#101B16]">Couple Travellers (Romantic & Serene)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#D8E4DE] mb-1.5">
                Budget Tier
              </label>
              <select
                value={budgetTier}
                onChange={e => setBudgetTier(e.target.value as BudgetTier)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#223B2F] bg-[#0A110E] font-semibold text-[#F3F6F4]"
              >
                <option value="budget" className="bg-[#101B16]">Budget Explorer (₹1,500 - ₹3,500/day)</option>
                <option value="moderate" className="bg-[#101B16]">Moderate Comfort (₹3,500 - ₹7,500/day)</option>
                <option value="luxury" className="bg-[#101B16]">Luxury Heritage (₹7,500+/day)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#D8E4DE] mb-1.5">
                Preferred Travel Pace
              </label>
              <select
                value={travelPace}
                onChange={e => setTravelPace(e.target.value as TravelPace)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#223B2F] bg-[#0A110E] font-semibold text-[#F3F6F4]"
              >
                <option value="relaxed" className="bg-[#101B16]">Relaxed & Leisurely</option>
                <option value="balanced" className="bg-[#101B16]">Balanced (Ideal pacing)</option>
                <option value="packed" className="bg-[#101B16]">Packed (Early sunrise to late dusk)</option>
              </select>
            </div>
          </div>

          {/* Row 4: Transport & Stay Preference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#D8E4DE] mb-1.5">
                Preferred Transport
              </label>
              <select
                value={preferredTransport}
                onChange={e => setPreferredTransport(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#223B2F] bg-[#0A110E] font-semibold text-[#F3F6F4]"
              >
                <option value="flight" className="bg-[#101B16]">Flight (Fastest connection)</option>
                <option value="train" className="bg-[#101B16]">Train (Vande Bharat / Superfast Express)</option>
                <option value="bus" className="bg-[#101B16]">AC Volvo / Sleeper Coach</option>
                <option value="cab" className="bg-[#101B16]">Self Drive / Outstation Private Cab</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#D8E4DE] mb-1.5">
                Stay Style
              </label>
              <select
                value={accommodationType}
                onChange={e => setAccommodationType(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#223B2F] bg-[#0A110E] font-semibold text-[#F3F6F4]"
              >
                <option value="Boutique Haveli & Homestay" className="bg-[#101B16]">Boutique Haveli & Authentic Homestay</option>
                <option value="Backpacker Dorm / Hostel" className="bg-[#101B16]">Cozy Backpacker Hostel (Social vibe)</option>
                <option value="Luxury Palace Resort" className="bg-[#101B16]">Heritage Luxury Palace / 5-Star Resort</option>
                <option value="Eco-Lodge / Cottage" className="bg-[#101B16]">Eco-Lodge / Mountain Wood Cottage</option>
              </select>
            </div>
          </div>

          {/* Additional requests */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#D8E4DE] mb-1.5">
              Special Requests or Must-See Interests (Optional)
            </label>
            <input
              type="text"
              value={specialRequests}
              onChange={e => setSpecialRequests(e.target.value)}
              placeholder="e.g. Include sunrise photography spot, pure vegetarian street food, boulder climb"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#223B2F] bg-[#0A110E] text-[#F3F6F4] placeholder-[#5A6F64] focus:outline-none focus:border-[#F59E0B]"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-between">
            <div className="text-xs text-[#8A9C93] flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#F59E0B]" />
              <span>Full editable control on all generated activities</span>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-[#D97706] to-[#B45309] text-white font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-[#D97706]/25 hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Planning with Gemini AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Generate My Personalized Trip</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* LOADING STATE OVERLAY */}
      {isGenerating && (
        <div className="p-12 text-center rounded-3xl bg-[#0F1A15] border border-[#234233] space-y-4 animate-pulse">
          <div className="w-16 h-16 rounded-2xl bg-[#162720] text-[#F59E0B] flex items-center justify-center mx-auto shadow-lg border border-[#2C4D3E]">
            <Compass className="w-8 h-8 animate-spin" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#F3F6F4]">
            Crafting Your Tailored Journey
          </h3>
          <p className="text-xs sm:text-sm text-[#8A9C93] italic max-w-md mx-auto">
            {quotes[generationQuoteIndex]}
          </p>
        </div>
      )}

      {/* GENERATED ITINERARY VIEW */}
      {activeTrip && !isGenerating && (
        <div className="space-y-10">
          
          {/* Trip Summary Card & Quick Actions Bar */}
          <div className="bg-gradient-to-br from-[#12231B] via-[#0E1A14] to-[#0A110E] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#234233] relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#FBBF24] text-xs font-bold uppercase tracking-wider">
                  <span>{activeTrip.travellerMode} Mode</span>
                  <span>·</span>
                  <span>{activeTrip.durationDays} Days</span>
                  <span>·</span>
                  <span>{activeTrip.travellersCount} {activeTrip.travellersCount > 1 ? 'Travellers' : 'Traveller'}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/10"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copiedShareLink ? 'Link Copied!' : 'Share'}</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/10"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>

                  <button
                    onClick={handleSave}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#D97706] to-[#B45309] hover:brightness-110 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
                  >
                    <BookmarkCheck className="w-4 h-4" />
                    <span>Save Itinerary</span>
                  </button>
                </div>
              </div>

              {saveSuccessNotification && (
                <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-600 text-xs text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Trip successfully saved to "My Trips" dashboard!</span>
                </div>
              )}

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F3F6F4]">
                {activeTrip.title}
              </h2>

              <p className="text-xs sm:text-sm text-[#9EAEA6] max-w-3xl leading-relaxed">
                {activeTrip.destinationSummary}
              </p>

              <div className="pt-2 text-xs text-[#D8E4DE] bg-[#0A110E]/60 p-3.5 rounded-2xl border border-[#1E352B]">
                <strong className="text-[#FBBF24]">Why this itinerary matches you: </strong>
                {activeTrip.whySuitedForYou}
              </div>

            </div>

            <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#1F3A2E]/20 blur-3xl pointer-events-none" />
          </div>

          {/* BUDGET SUMMARY CARD */}
          <div className="bg-[#0F1A15] rounded-3xl p-6 border border-[#1E352B] shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#182C23] gap-3">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#F59E0B]" />
                <h3 className="font-serif text-lg font-bold text-[#F3F6F4]">
                  Estimated Trip Expenses Breakdown
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#8A9C93]">Total Estimated Budget: </span>
                <span className="font-serif text-xl font-bold text-[#FBBF24]">
                  ₹{activeTrip.budget.total.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-[#F59E0B] font-semibold ml-2">
                  (₹{activeTrip.budget.perPerson.toLocaleString('en-IN')} / person)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#0A110E] border border-[#1E352B]">
                <span className="text-[#6B7E75] block text-[10px]">Transport</span>
                <span className="font-bold text-[#F3F6F4] text-sm">
                  ₹{activeTrip.budget.transport.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#0A110E] border border-[#1E352B]">
                <span className="text-[#6B7E75] block text-[10px]">Stay ({activeTrip.durationDays - 1} nights)</span>
                <span className="font-bold text-[#F3F6F4] text-sm">
                  ₹{activeTrip.budget.accommodation.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#0A110E] border border-[#1E352B]">
                <span className="text-[#6B7E75] block text-[10px]">Food & Dining</span>
                <span className="font-bold text-[#F3F6F4] text-sm">
                  ₹{activeTrip.budget.food.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#0A110E] border border-[#1E352B]">
                <span className="text-[#6B7E75] block text-[10px]">Activities & Entry</span>
                <span className="font-bold text-[#F3F6F4] text-sm">
                  ₹{activeTrip.budget.activities.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#0A110E] border border-[#1E352B]">
                <span className="text-[#6B7E75] block text-[10px]">Buffer / Misc</span>
                <span className="font-bold text-[#F3F6F4] text-sm">
                  ₹{activeTrip.budget.miscellaneous.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* INTERACTIVE ROUTE MAP */}
          <InteractiveMap
            destination={activeTrip.destination}
            days={activeTrip.days}
            activeDayNumber={activeDayTab}
            onSelectDay={d => setActiveDayTab(d)}
          />

          {/* DAY-BY-DAY ITINERARY HEADER & TABS */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#F3F6F4]">
                  Daily Schedule & Waypoints
                </h3>
                <p className="text-xs text-[#8A9C93]">
                  Organized by morning, afternoon, and dusk timings. Add, move, edit, or regenerate anytime.
                </p>
              </div>

              {/* Day Tab Selectors */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {activeTrip.days.map(day => (
                  <button
                    key={day.dayNumber}
                    onClick={() => setActiveDayTab(day.dayNumber)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                      activeDayTab === day.dayNumber
                        ? 'bg-[#1C362A] text-[#FBBF24] border border-[#2E5442] shadow-sm'
                        : 'bg-[#0F1A15] text-[#8A9C93] hover:text-[#F3F6F4] border border-[#1E352B]'
                    }`}
                  >
                    Day {day.dayNumber}
                  </button>
                ))}
              </div>
            </div>

            {/* ACTIVE DAY DETAILS & ACTIVITIES */}
            {activeTrip.days
              .filter(d => d.dayNumber === activeDayTab)
              .map(day => (
                <div key={day.dayNumber} className="bg-[#0F1A15] rounded-3xl p-6 sm:p-8 border border-[#1E352B] shadow-lg space-y-6">
                  
                  {/* Day Banner */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#182C23] gap-3">
                    <div>
                      <div className="text-[10px] font-bold text-[#F59E0B] uppercase tracking-wider">
                        Day {day.dayNumber} · {day.date}
                      </div>
                      <h4 className="font-serif text-xl font-bold text-[#F3F6F4] mt-0.5">
                        {day.theme}
                      </h4>
                      <p className="text-xs text-[#8A9C93] mt-1">
                        {day.summary}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleRegenerateDay(day.dayNumber, day.date)}
                        disabled={regeneratingDayNumber === day.dayNumber}
                        className="px-3 py-1.5 rounded-xl border border-[#22392E] bg-[#111D18] hover:bg-[#162720] text-xs font-semibold text-[#D8E4DE] flex items-center gap-1.5 transition-colors disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${regeneratingDayNumber === day.dayNumber ? 'animate-spin text-[#F59E0B]' : ''}`} />
                        <span>Regenerate Day with AI</span>
                      </button>

                      <button
                        onClick={() => openAddActivity(day.dayNumber)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#D97706] to-[#B45309] hover:brightness-110 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Place</span>
                      </button>
                    </div>
                  </div>

                  {/* Activities list for this day */}
                  <div className="space-y-4">
                    {day.activities.map((act, idx) => {
                      const timeColor =
                        act.timeSlot === 'morning'
                          ? 'text-amber-300 bg-amber-950/40 border-amber-800'
                          : act.timeSlot === 'afternoon'
                          ? 'text-emerald-300 bg-emerald-950/40 border-emerald-800'
                          : 'text-indigo-300 bg-indigo-950/40 border-indigo-800';

                      return (
                        <div
                          key={act.id}
                          className="p-4 sm:p-5 rounded-2xl bg-[#0A110E] border border-[#1E352B] hover:border-[#2E5442] transition-all space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                            
                            {/* Timing & Title */}
                            <div className="flex items-start gap-3">
                              <span className="w-6 h-6 rounded-full bg-[#1C362A] text-[#FBBF24] border border-[#2E5442] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${timeColor}`}>
                                    {act.timeSlot} · {act.startTime} - {act.endTime} ({act.duration})
                                  </span>
                                  {act.category === 'hidden_gem' && (
                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#D97706] text-white">
                                      Hidden Gem
                                    </span>
                                  )}
                                </div>
                                <h5 className="font-bold text-sm sm:text-base text-[#F3F6F4] mt-1">
                                  {act.title}
                                </h5>
                                <div className="text-xs text-[#7D9387] flex items-center gap-1 mt-0.5">
                                  <MapPin className="w-3 h-3 text-[#F59E0B]" />
                                  <span>{act.location}</span>
                                </div>
                              </div>
                            </div>

                            {/* Activity Controls */}
                            <div className="flex items-center gap-1 self-end sm:self-center">
                              <button
                                disabled={idx === 0}
                                onClick={() => moveActivity(day.dayNumber, act.id, 'up')}
                                className="p-1.5 rounded-lg text-[#8A9C93] hover:bg-[#162520] disabled:opacity-20"
                                title="Move earlier"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>

                              <button
                                disabled={idx === day.activities.length - 1}
                                onClick={() => moveActivity(day.dayNumber, act.id, 'down')}
                                className="p-1.5 rounded-lg text-[#8A9C93] hover:bg-[#162520] disabled:opacity-20"
                                title="Move later"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>

                              {activeTrip.days.length > 1 && (
                                <select
                                  value={day.dayNumber}
                                  onChange={e => moveActivityToDay(day.dayNumber, Number(e.target.value), act.id)}
                                  className="text-[10px] py-1 px-1.5 rounded-lg border border-[#22392E] bg-[#111D18] text-[#D8E4DE]"
                                  title="Move to another day"
                                >
                                  {activeTrip.days.map(d => (
                                    <option key={d.dayNumber} value={d.dayNumber} className="bg-[#101B16]">
                                      Day {d.dayNumber}
                                    </option>
                                  ))}
                                </select>
                              )}

                              <button
                                onClick={() => openEditActivity(day.dayNumber, act)}
                                className="p-1.5 rounded-lg text-[#D8E4DE] hover:bg-[#162520]"
                                title="Edit activity"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => removeActivity(day.dayNumber, act.id)}
                                className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40"
                                title="Remove activity"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <p className="text-xs text-[#9EAEA6] leading-relaxed pl-9">
                            {act.description}
                          </p>

                          <div className="pl-9 pt-2 border-t border-[#162520] flex flex-wrap items-center justify-between text-xs gap-2">
                            {act.insiderTip && (
                              <div className="text-[11px] text-[#F3F6F4] font-medium flex items-center gap-1.5">
                                <Lightbulb className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                                <span>{act.insiderTip}</span>
                              </div>
                            )}

                            <div className="flex items-center gap-3 text-[11px] text-[#7D9387] ml-auto">
                              <span>Est. Cost: <strong className="text-[#FBBF24]">₹{act.estimatedCost}</strong></span>
                              {act.travelTimeToNext && (
                                <span>• Next: {act.travelTimeToNext}</span>
                              )}
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>

                </div>
              ))}
          </div>

          {/* LOCAL FOOD & SIGNATURE SPOTS */}
          <div className="bg-[#0F1A15] rounded-3xl p-6 sm:p-8 border border-[#1E352B] shadow-lg space-y-4">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-[#F59E0B]" />
              <h4 className="font-serif text-xl font-bold text-[#F3F6F4]">
                Authentic Food Spots & Signature Delicacies
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeTrip.localFoodSpots.map((spot, i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#0A110E] border border-[#1E352B] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#F3F6F4]">{spot.name}</span>
                    <span className="text-[10px] font-semibold text-[#F59E0B]">{spot.priceRange}</span>
                  </div>
                  <div className="text-[11px] text-[#7D9387]">{spot.cuisine} · {spot.area}</div>
                  <div className="text-xs font-semibold text-[#D8E4DE]">
                    Must try: <span className="text-[#FBBF24]">{spot.signatureDish}</span>
                  </div>
                  <p className="text-[11px] text-[#8A9C93] pt-1 border-t border-[#162520]">
                    {spot.highlight}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* TRAVEL OPTIONS & STAYS */}
          <TravelOptionsCard
            accommodations={activeTrip.accommodations}
            transports={activeTrip.transportOptions}
          />

          {/* SAFETY TIPS & PACKING ESSENTIALS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-[#0F1A15] border border-[#1E352B] shadow-lg space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#FBBF24] uppercase tracking-wider">
                <Shield className="w-4 h-4 text-[#F59E0B]" />
                <span>Local Safety & Cultural Advice ({activeTrip.travellerMode})</span>
              </div>
              <ul className="space-y-2 text-xs text-[#9EAEA6]">
                {activeTrip.safetyTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#F59E0B] font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-[#0F1A15] border border-[#1E352B] shadow-lg space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#FBBF24] uppercase tracking-wider">
                <Compass className="w-4 h-4 text-[#F59E0B]" />
                <span>Packing Essentials for {activeTrip.destination}</span>
              </div>
              <ul className="space-y-2 text-xs text-[#9EAEA6]">
                {activeTrip.packingEssentials.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      )}

      {/* ACTIVITY EDITOR MODAL */}
      <ItineraryEditorModal
        isOpen={editorModalOpen}
        onClose={() => setEditorModalOpen(false)}
        dayNumber={editorDayNumber}
        existingActivity={editingActivity}
        onSave={handleSaveActivityModal}
      />

    </div>
  );
};
