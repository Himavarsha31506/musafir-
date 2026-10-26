import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTrip } from '../context/TripContext';
import { POPULAR_DESTINATIONS, HIDDEN_GEMS, TRAVELLER_MODES } from '../data/travelData';
import {
  Compass,
  BookmarkCheck,
  Calendar,
  Wallet,
  Heart,
  Settings,
  Trash2,
  Share2,
  ExternalLink,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  Shield,
  User as UserIcon,
  SlidersHorizontal,
  Star
} from 'lucide-react';
import { TripItinerary } from '../types/travel';

interface DashboardPageProps {
  onOpenTripInPlanner: (trip: TripItinerary) => void;
  onOpenPlannerWithDestination: (dest: string) => void;
  setCurrentTab: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onOpenTripInPlanner,
  onOpenPlannerWithDestination,
  setCurrentTab
}) => {
  const { user, openQuestionnaire, openAuthModal, isAuthenticated } = useAuth();
  const { savedTrips, deleteSavedTrip, favoriteDestinations, savedHiddenGems, toggleFavoriteDestination, toggleSaveHiddenGem } = useTrip();

  const [activeTab, setActiveTab] = useState<'trips' | 'favorites' | 'gems' | 'profile'>('trips');
  const [copiedShareId, setCopiedShareId] = useState<string | null>(null);

  const favDests = POPULAR_DESTINATIONS.filter(d => favoriteDestinations.includes(d.id));
  const favGems = HIDDEN_GEMS.filter(g => savedHiddenGems.includes(g.id));

  const handleShareTrip = (tripId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/#trip=${tripId}`);
    setCopiedShareId(tripId);
    setTimeout(() => setCopiedShareId(null), 2000);
  };

  const totalSpentEstimate = savedTrips.reduce((acc, t) => acc + (t.budget?.total || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-[#0A110E] text-[#F3F6F4]">
      
      {/* Profile Overview Header */}
      <div className="bg-gradient-to-br from-[#12231B] via-[#0E1A14] to-[#0A110E] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#234233] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={user?.fullName || 'Musafir Explorer'}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#F59E0B] shadow-lg ring-4 ring-[#1E3A2D]"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold">
                  {user?.fullName || 'Wanderer Profile'}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-[#FBBF24] font-semibold uppercase tracking-wider border border-white/10">
                  {user?.preferences?.preferredMode || 'Solo'} Mode
                </span>
              </div>
              <p className="text-xs text-[#7D9387] mt-1">{user?.email || 'wanderer@musafir.internal'}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-[#D8E4DE]">
                <span className="capitalize font-medium">Pace: {user?.preferences?.travelPace || 'Balanced'}</span>
                <span>·</span>
                <span className="capitalize font-medium">Tier: {user?.preferences?.budgetTier || 'Moderate'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => openQuestionnaire()}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/10"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#FBBF24]" />
              <span>Update Persona Quiz</span>
            </button>
            <button
              onClick={() => setCurrentTab('planner')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D97706] to-[#B45309] hover:brightness-110 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Plan New Trip</span>
            </button>
          </div>

        </div>

        {/* Stats strip */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-[#1C3227] text-xs">
          <div>
            <span className="text-[#7D9387] block text-[10px]">Saved Itineraries</span>
            <span className="font-bold text-lg text-[#F3F6F4]">{savedTrips.length} Trips</span>
          </div>
          <div>
            <span className="text-[#7D9387] block text-[10px]">Wishlist Destinations</span>
            <span className="font-bold text-lg text-[#F3F6F4]">{favoriteDestinations.length} Places</span>
          </div>
          <div>
            <span className="text-[#7D9387] block text-[10px]">Saved Hidden Gems</span>
            <span className="font-bold text-lg text-[#F3F6F4]">{savedHiddenGems.length} Gems</span>
          </div>
          <div>
            <span className="text-[#7D9387] block text-[10px]">Combined Estimated Budget</span>
            <span className="font-bold text-lg text-[#FBBF24]">₹{totalSpentEstimate.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1A2E24] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('trips')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 ${
            activeTab === 'trips'
              ? 'bg-[#1C362A] text-[#FBBF24] border border-[#2E5442] shadow-sm'
              : 'text-[#8A9C93] hover:text-[#F3F6F4]'
          }`}
        >
          <BookmarkCheck className="w-4 h-4" />
          <span>My Trips ({savedTrips.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 ${
            activeTab === 'favorites'
              ? 'bg-[#1C362A] text-[#FBBF24] border border-[#2E5442] shadow-sm'
              : 'text-[#8A9C93] hover:text-[#F3F6F4]'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Wishlist Destinations ({favDests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('gems')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 ${
            activeTab === 'gems'
              ? 'bg-[#1C362A] text-[#FBBF24] border border-[#2E5442] shadow-sm'
              : 'text-[#8A9C93] hover:text-[#F3F6F4]'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Saved Gems ({favGems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-[#1C362A] text-[#FBBF24] border border-[#2E5442] shadow-sm'
              : 'text-[#8A9C93] hover:text-[#F3F6F4]'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Persona Settings</span>
        </button>
      </div>

      {/* TAB CONTENT: MY TRIPS */}
      {activeTab === 'trips' && (
        <div className="space-y-6">
          {savedTrips.length === 0 ? (
            <div className="p-12 text-center bg-[#0F1A15] rounded-3xl border border-[#1E352B] space-y-3">
              <Compass className="w-10 h-10 text-[#F59E0B] mx-auto opacity-70" />
              <h3 className="font-serif text-lg font-bold text-[#F3F6F4]">No saved trips yet</h3>
              <p className="text-xs text-[#8A9C93] max-w-sm mx-auto">
                Generate an itinerary using Musafir’s AI Planner and click "Save Itinerary" to keep it here.
              </p>
              <button
                onClick={() => setCurrentTab('planner')}
                className="mt-2 px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#D97706] to-[#B45309] text-white"
              >
                Plan a Trip Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedTrips.map(trip => (
                <div
                  key={trip.id}
                  className="p-6 rounded-3xl bg-[#0F1A15] border border-[#1E352B] shadow-sm hover:shadow-xl hover:border-[#2E5442] transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#F59E0B] bg-[#0A110E] px-2.5 py-1 rounded-md border border-[#1E352B]">
                        {trip.travellerMode} Mode · {trip.durationDays} Days
                      </span>
                      <span className="text-xs font-bold text-[#FBBF24]">
                        ₹{trip.budget?.total?.toLocaleString('en-IN')} Total
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-[#F3F6F4]">
                      {trip.title}
                    </h3>

                    <p className="text-xs text-[#8A9C93] line-clamp-2 leading-relaxed">
                      {trip.destinationSummary}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs text-[#D8E4DE] pt-1 border-t border-[#182C23]">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" />
                        <span>{trip.destination}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#10B981]" />
                        <span>{trip.startDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#182C23] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleShareTrip(trip.id)}
                        className="p-2 rounded-xl text-[#8A9C93] hover:text-[#F3F6F4] hover:bg-[#162720]"
                        title="Copy share link"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      {copiedShareId === trip.id && (
                        <span className="text-[10px] font-semibold text-emerald-400">Copied!</span>
                      )}
                      <button
                        onClick={() => deleteSavedTrip(trip.id)}
                        className="p-2 rounded-xl text-rose-400 hover:bg-rose-950/40"
                        title="Delete itinerary"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => onOpenTripInPlanner(trip)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D97706] to-[#B45309] hover:brightness-110 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <span>Open & Edit Plan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: FAVORITE DESTINATIONS */}
      {activeTab === 'favorites' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {favDests.length === 0 ? (
            <div className="col-span-3 p-12 text-center bg-[#0F1A15] rounded-3xl border border-[#1E352B] text-xs text-[#8A9C93]">
              No favourite destinations bookmarked yet. Browse Explore page to add!
            </div>
          ) : (
            favDests.map(dest => (
              <div
                key={dest.id}
                className="bg-[#0F1A15] rounded-3xl border border-[#1E352B] overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <img src={dest.heroImage} alt={dest.name} className="w-full h-full object-cover opacity-85" />
                  <button
                    onClick={() => toggleFavoriteDestination(dest.id)}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-rose-400 shadow"
                  >
                    <Heart className="w-4 h-4 fill-rose-400" />
                  </button>
                  <div className="absolute bottom-2 left-3 bg-black/70 text-[#FBBF24] text-[10px] px-2 py-0.5 rounded font-semibold border border-white/10">
                    {dest.category}
                  </div>
                </div>
                <div className="p-4 space-y-1">
                  <h4 className="font-serif text-lg font-bold text-[#F3F6F4]">{dest.name}</h4>
                  <p className="text-xs text-[#8A9C93] line-clamp-2">{dest.tagline}</p>
                </div>
                <div className="p-3 bg-[#0A110E] border-t border-[#182C23]">
                  <button
                    onClick={() => onOpenPlannerWithDestination(dest.name)}
                    className="w-full py-1.5 text-xs font-bold rounded-xl bg-[#162B21] hover:bg-[#1E3B2E] text-white border border-[#274B39]"
                  >
                    Plan {dest.name} Trip
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB CONTENT: SAVED GEMS */}
      {activeTab === 'gems' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favGems.length === 0 ? (
            <div className="col-span-2 p-12 text-center bg-[#0F1A15] rounded-3xl border border-[#1E352B] text-xs text-[#8A9C93]">
              No saved hidden gems yet. Explore offbeat spots to add!
            </div>
          ) : (
            favGems.map(gem => (
              <div
                key={gem.id}
                className="p-5 rounded-3xl bg-[#0F1A15] border border-[#1E352B] shadow-sm flex items-start gap-4"
              >
                <img
                  src={gem.imageUrl}
                  alt={gem.name}
                  className="w-24 h-24 rounded-2xl object-cover shrink-0 opacity-85"
                />
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#F59E0B] uppercase tracking-wider">{gem.category}</span>
                    <button
                      onClick={() => toggleSaveHiddenGem(gem.id)}
                      className="text-xs text-rose-400 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  <h4 className="font-bold text-sm text-[#F3F6F4]">{gem.name}</h4>
                  <p className="text-xs text-[#8A9C93] line-clamp-2">{gem.whyVisit}</p>
                  <div className="text-[11px] text-[#6B7E75] pt-1">
                    📍 {gem.location} · {gem.estimatedDuration}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB CONTENT: PREFERENCES PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-[#0F1A15] rounded-3xl p-6 sm:p-8 border border-[#1E352B] shadow-lg space-y-6 max-w-2xl">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#F3F6F4]">
              Travel Persona & Preferences
            </h3>
            <p className="text-xs text-[#8A9C93] mt-1">
              Musafir references these preferences to automatically calibrate Gemini AI itinerary generation.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#0A110E] border border-[#1E352B] flex justify-between items-center">
              <div>
                <span className="text-[#6B7E75] block text-[10px]">Active Traveller Mode</span>
                <span className="font-bold text-[#F3F6F4] capitalize">{user?.preferences?.preferredMode || 'Solo'}</span>
              </div>
              <button
                onClick={openQuestionnaire}
                className="text-xs font-semibold text-[#F59E0B] hover:underline"
              >
                Change
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0A110E] border border-[#1E352B] flex justify-between items-center">
              <div>
                <span className="text-[#6B7E75] block text-[10px]">Daily Budget Tier</span>
                <span className="font-bold text-[#F3F6F4] capitalize">{user?.preferences?.budgetTier || 'Moderate'}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0A110E] border border-[#1E352B] flex justify-between items-center">
              <div>
                <span className="text-[#6B7E75] block text-[10px]">Travel Pace</span>
                <span className="font-bold text-[#F3F6F4] capitalize">{user?.preferences?.travelPace || 'Balanced'}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0A110E] border border-[#1E352B]">
              <span className="text-[#6B7E75] block text-[10px] mb-1">Passions & Interests</span>
              <div className="flex flex-wrap gap-1.5">
                {(user?.preferences?.interests || ['culture', 'nature', 'food']).map(i => (
                  <span key={i} className="px-2.5 py-0.5 rounded-lg bg-[#14231D] border border-[#233D31] text-[#F3F6F4] capitalize font-medium text-xs">
                    {i}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={openQuestionnaire}
            className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-[#D97706] to-[#B45309] text-white text-xs font-bold hover:brightness-110 shadow-lg"
          >
            Retake Full Preference Questionnaire
          </button>
        </div>
      )}

    </div>
  );
};
