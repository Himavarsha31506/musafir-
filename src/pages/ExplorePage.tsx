import React, { useState, useMemo } from 'react';
import { POPULAR_DESTINATIONS } from '../data/travelData';
import { Destination } from '../types/travel';
import { useAuth } from '../context/AuthContext';
import { useTrip } from '../context/TripContext';
import {
  Search,
  MapPin,
  Calendar,
  Sparkles,
  Heart,
  Star,
  Check,
  X,
  Compass,
  UtensilsCrossed,
  ArrowRight,
  Info
} from 'lucide-react';

interface ExplorePageProps {
  onOpenPlannerWithDestination: (destName: string) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({ onOpenPlannerWithDestination }) => {
  const { user } = useAuth();
  const { favoriteDestinations, toggleFavoriteDestination } = useTrip();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [budgetFilter, setBudgetFilter] = useState<string>('all');
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  const categories = ['All', 'Heritage', 'Mountains', 'Nature', 'Spiritual', 'Adventure', 'Beaches'];

  const filteredDestinations = useMemo(() => {
    return POPULAR_DESTINATIONS.filter(dest => {
      const matchSearch =
        dest.name.toLowerCase().includes(search.toLowerCase()) ||
        dest.stateOrCountry.toLowerCase().includes(search.toLowerCase()) ||
        dest.tagline.toLowerCase().includes(search.toLowerCase());

      const matchCategory =
        selectedCategory === 'All' || dest.category === selectedCategory;

      let matchBudget = true;
      if (budgetFilter === 'budget') {
        matchBudget = dest.averageDailyCost <= 3000;
      } else if (budgetFilter === 'moderate') {
        matchBudget = dest.averageDailyCost > 3000 && dest.averageDailyCost <= 5000;
      } else if (budgetFilter === 'luxury') {
        matchBudget = dest.averageDailyCost > 5000;
      }

      return matchSearch && matchCategory && matchBudget;
    });
  }, [search, selectedCategory, budgetFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-[#0A110E] text-[#F3F6F4]">
      
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111F18] border border-[#234233] text-[#FBBF24] text-xs font-bold uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>Curated Indian & Global Escapes</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F3F6F4]">
          Explore {POPULAR_DESTINATIONS.length} Atmospheric Destinations
        </h1>
        <p className="text-xs sm:text-sm text-[#8A9C93] max-w-xl mx-auto">
          From ancient boulder empires to high-altitude cold deserts and bioluminescent lagoons. Filter by landscape, daily budget, and season.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-[#0F1A15] rounded-3xl p-4 sm:p-6 border border-[#1E352B] shadow-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Search text input */}
          <div className="md:col-span-6 relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#6B7E75]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by city, state, or style (e.g. Hampi, Spiti, Gokarna, Fort)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[#223B2F] bg-[#0A110E] text-[#F3F6F4] placeholder-[#5A6F64] focus:outline-none focus:border-[#F59E0B]"
            />
          </div>

          {/* Budget tier filter */}
          <div className="md:col-span-3">
            <select
              value={budgetFilter}
              onChange={e => setBudgetFilter(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#223B2F] bg-[#0A110E] text-[#F3F6F4] focus:outline-none focus:border-[#F59E0B]"
            >
              <option value="all">Any Daily Budget</option>
              <option value="budget">Budget Friendly (≤ ₹3,000/day)</option>
              <option value="moderate">Moderate Comfort (₹3,000 - ₹5,000/day)</option>
              <option value="luxury">Luxury Heritage (&gt; ₹5,000/day)</option>
            </select>
          </div>

          {/* Quick counts summary */}
          <div className="md:col-span-3 text-right text-xs text-[#8A9C93]">
            Showing <strong className="text-[#FBBF24]">{filteredDestinations.length}</strong> of {POPULAR_DESTINATIONS.length} curated destinations
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-[#182C23] pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#1C362A] text-[#FBBF24] border border-[#2E5442]'
                  : 'bg-[#0A110E] text-[#8A9C93] hover:text-[#F3F6F4] border border-[#1A2E24]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDestinations.map(dest => {
          const isFav = favoriteDestinations.includes(dest.id);
          return (
            <div
              key={dest.id}
              className="bg-[#0F1A15] rounded-3xl border border-[#1E352B] overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#2E5442] transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    src={dest.heroImage}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                  />
                  <div className="absolute top-3 left-3 bg-[#0A110E]/90 backdrop-blur-md text-[#FBBF24] border border-[#1E362C] px-2.5 py-0.5 rounded-md text-[10px] font-semibold">
                    {dest.category}
                  </div>
                  <button
                    onClick={() => toggleFavoriteDestination(dest.id)}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
                      isFav ? 'bg-rose-950/80 text-rose-400 border border-rose-800 shadow' : 'bg-black/40 hover:bg-black/60 text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-400' : ''}`} />
                  </button>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="font-semibold px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[11px]">
                      {dest.idealDuration}
                    </span>
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 font-bold text-[11px]">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{dest.rating}</span>
                      <span className="text-[10px] font-normal text-gray-300">({dest.reviewsCount})</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-2.5">
                  <div className="text-[10px] font-semibold text-[#7D9387] uppercase tracking-wider">
                    {dest.stateOrCountry}
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#F3F6F4] group-hover:text-[#FBBF24] transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-[#8A9C93] line-clamp-2 leading-relaxed">
                    {dest.tagline}
                  </p>

                  <div className="pt-2 text-xs space-y-1.5 border-t border-[#182C23]">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#6B7E75]">Best Season:</span>
                      <span className="font-medium text-[#D8E4DE]">{dest.bestTimeToVisit}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#6B7E75]">Estimated Cost:</span>
                      <span className="font-bold text-[#F59E0B]">₹{dest.averageDailyCost.toLocaleString('en-IN')}/day</span>
                    </div>
                  </div>

                  {/* Highlights snippet */}
                  <div className="pt-1 flex flex-wrap gap-1">
                    {dest.highlights.slice(0, 2).map((h, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#0A110E] text-[#A2B3AB] border border-[#1A2E24]"
                      >
                        • {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#0A110E] border-t border-[#182C23] grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDestination(dest)}
                  className="w-full py-2 px-3 rounded-xl border border-[#22392E] bg-[#111D18] hover:bg-[#162720] text-[#D8E4DE] text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenPlannerWithDestination(dest.name)}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#D97706] to-[#B45309] hover:brightness-110 text-white text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span>Plan Trip</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Destination Details Drawer / Modal */}
      {selectedDestination && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#0F1A15] rounded-3xl shadow-2xl border border-[#234233] overflow-hidden flex flex-col max-h-[90vh] text-[#F3F6F4]">
            
            {/* Header Image */}
            <div className="relative h-60 w-full overflow-hidden shrink-0">
              <img
                src={selectedDestination.heroImage}
                alt={selectedDestination.name}
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1A15] via-[#0F1A15]/40 to-transparent" />
              <button
                onClick={() => setSelectedDestination(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FBBF24]">
                  {selectedDestination.stateOrCountry} · {selectedDestination.category}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold">
                  {selectedDestination.name}
                </h2>
                <p className="text-xs text-[#A2B3AB] mt-0.5">{selectedDestination.tagline}</p>
              </div>
            </div>

            {/* Scrollable details */}
            <div className="p-6 overflow-y-auto space-y-5">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#FBBF24] mb-1">
                  About {selectedDestination.name}
                </h4>
                <p className="text-xs sm:text-sm text-[#A2B3AB] leading-relaxed">
                  {selectedDestination.description}
                </p>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[#0A110E] border border-[#1E352B] text-xs">
                <div>
                  <span className="text-[#6B7E75] block text-[10px]">Ideal Duration</span>
                  <span className="font-bold text-[#F3F6F4]">{selectedDestination.idealDuration}</span>
                </div>
                <div>
                  <span className="text-[#6B7E75] block text-[10px]">Best Time</span>
                  <span className="font-bold text-[#F3F6F4]">{selectedDestination.bestTimeToVisit}</span>
                </div>
                <div>
                  <span className="text-[#6B7E75] block text-[10px]">Estimated Daily</span>
                  <span className="font-bold text-[#F59E0B]">₹{selectedDestination.averageDailyCost.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Top Attractions */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#FBBF24] mb-2">
                  Key Attractions & Highlights
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedDestination.topAttractions.map((att, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-[#0A110E] border border-[#1E352B] text-xs text-[#D8E4DE] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                      <span>{att}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Local Specialties & Food */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FBBF24] mb-2">
                  <UtensilsCrossed className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>Must-Try Local Food & Specialties</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDestination.localSpecialties.map((spec, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-xl bg-[#14261E] text-[#F3F6F4] font-medium border border-[#2B4E3C]">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer action */}
            <div className="p-4 bg-[#0A110E] border-t border-[#1E352B] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedDestination(null)}
                className="text-xs text-[#8A9C93] hover:underline"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const destName = selectedDestination.name;
                  setSelectedDestination(null);
                  onOpenPlannerWithDestination(destName);
                }}
                className="px-5 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#D97706] to-[#B45309] text-white hover:brightness-110 shadow-lg flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Itinerary for {selectedDestination.name}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
