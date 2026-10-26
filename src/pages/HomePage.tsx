import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTrip } from '../context/TripContext';
import { POPULAR_DESTINATIONS, TRAVELLER_MODES, HIDDEN_GEMS } from '../data/travelData';
import {
  Compass,
  Sparkles,
  MapPin,
  Calendar,
  Users,
  Search,
  ArrowRight,
  Star,
  CheckCircle2,
  Heart,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
  Bookmark
} from 'lucide-react';
import { TravellerModeType } from '../types/travel';

interface HomePageProps {
  setCurrentTab: (tab: string) => void;
  onOpenPlannerWithDestination: (destName: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  setCurrentTab,
  onOpenPlannerWithDestination
}) => {
  const { user, switchTravellerMode, openQuestionnaire } = useAuth();
  const { favoriteDestinations, toggleFavoriteDestination } = useTrip();

  const [searchQuery, setSearchQuery] = useState('');

  const activeMode = user?.preferences?.preferredMode || 'solo';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onOpenPlannerWithDestination(searchQuery.trim());
    } else {
      setCurrentTab('explore');
    }
  };

  const filteredDestinations = searchQuery.trim()
    ? POPULAR_DESTINATIONS.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.stateOrCountry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : POPULAR_DESTINATIONS.slice(0, 8);

  return (
    <div className="space-y-24 pb-20 bg-[#0A110E] text-[#F3F6F4]">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[640px] lg:min-h-[720px] flex items-center justify-center overflow-hidden rounded-b-[2.5rem] bg-[#070D0B] border-b border-[#1A2E24]">
        
        {/* Cinematic Background Image with dark radial gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=2000&q=85"
            alt="Musafir Travel Journey"
            className="w-full h-full object-cover object-center opacity-30 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A110E] via-[#0A110E]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A110E]/90 via-transparent to-[#0A110E]/90" />
          {/* Subtle golden ambient glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#D97706]/15 blur-3xl pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-20">
          
          {/* Subtle Tagline kicker */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#111F18]/80 backdrop-blur-md border border-[#234233] text-[#FBBF24] text-xs font-semibold mb-6 shadow-[0_0_20px_rgba(245,158,11,0.15)] animate-in fade-in duration-300">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>मुसाफ़िर · Har Safar, Aapke Andaaz Mein</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#F3F6F4] tracking-tight leading-[1.15] max-w-4xl mx-auto drop-shadow-md">
            Every Journey Has a Story. <br className="hidden sm:inline" />
            <span className="italic font-normal bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-[#FBBF24] bg-clip-text text-transparent">
              Let AI Plan Yours.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="mt-6 text-sm sm:text-base md:text-lg text-[#A2B3AB] max-w-2xl mx-auto font-normal leading-relaxed">
            Tailor-made journeys calibrated to your exact budget, companion dynamics, and unhurried pacing. Discover secret viewpoints, ancestral recipes, and mindful exploration.
          </p>

          {/* Dark Glass Search Box */}
          <div className="mt-10 max-w-3xl mx-auto bg-[#101B16]/90 backdrop-blur-xl p-3 sm:p-4 rounded-3xl shadow-2xl border border-[#233C2F] text-left">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 sm:gap-3 items-center">
              
              {/* Destination Search */}
              <div className="sm:col-span-5 px-3 py-2 rounded-2xl bg-[#0B1410] border border-[#1A2E24] focus-within:border-[#F59E0B] transition-colors">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7D9387]">
                  Where to explore?
                </label>
                <div className="flex items-center gap-2 mt-0.5">
                  <MapPin className="w-4 h-4 text-[#F59E0B] shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Udaipur, Hampi, Spiti, Munnar..."
                    className="w-full bg-transparent text-xs font-semibold text-[#F3F6F4] placeholder-[#5A6F64] focus:outline-none"
                  />
                </div>
              </div>

              {/* Mode Selector */}
              <div className="sm:col-span-4 px-3 py-2 rounded-2xl bg-[#0B1410] border border-[#1A2E24] focus-within:border-[#F59E0B] transition-colors">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7D9387]">
                  Traveller Mode
                </label>
                <div className="flex items-center gap-2 mt-0.5">
                  <Users className="w-4 h-4 text-[#10B981] shrink-0" />
                  <select
                    value={activeMode}
                    onChange={e => switchTravellerMode(e.target.value as TravellerModeType)}
                    className="w-full bg-transparent text-xs font-semibold text-[#F3F6F4] focus:outline-none capitalize cursor-pointer"
                  >
                    <option value="solo" className="bg-[#101B16] text-[#F3F6F4]">Solo Traveller</option>
                    <option value="group" className="bg-[#101B16] text-[#F3F6F4]">Group of Friends</option>
                    <option value="social" className="bg-[#101B16] text-[#F3F6F4]">Social & Meetups</option>
                    <option value="family" className="bg-[#101B16] text-[#F3F6F4]">Family with Kids</option>
                    <option value="couple" className="bg-[#101B16] text-[#F3F6F4]">Couple Escape</option>
                  </select>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="sm:col-span-3">
                <button
                  type="submit"
                  className="w-full h-full py-3 sm:py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#D97706] to-[#B45309] text-white font-bold text-xs hover:brightness-110 shadow-lg shadow-[#D97706]/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
                  <span>Plan My Trip</span>
                </button>
              </div>
            </form>

            {/* Quick popular tags */}
            <div className="mt-3 pt-2.5 border-t border-[#1A2E24] flex flex-wrap items-center gap-2 text-xs text-[#7D9387]">
              <span className="font-semibold text-[#FBBF24] text-[10px] uppercase tracking-wider">Trending:</span>
              {['Udaipur', 'Hampi', 'Spiti Valley', 'Munnar', 'Gokarna', 'Meghalaya', 'Jaisalmer'].map(dest => (
                <button
                  key={dest}
                  type="button"
                  onClick={() => onOpenPlannerWithDestination(dest)}
                  className="px-2.5 py-0.5 rounded-lg bg-[#0B1410] hover:bg-[#182C23] hover:text-[#F3F6F4] text-[11px] font-medium text-[#A2B3AB] border border-[#1A2E24] transition-colors"
                >
                  {dest}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setCurrentTab('planner')}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#D97706] to-[#B45309] text-white font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-[#D97706]/25 transition-transform hover:scale-105 flex items-center gap-2"
            >
              <span>Build Custom AI Itinerary</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentTab('explore')}
              className="px-6 py-3 rounded-2xl bg-[#101B16] hover:bg-[#162520] text-[#D8E4DE] font-semibold text-xs sm:text-sm border border-[#22392E] transition-colors"
            >
              Explore 16+ Destinations
            </button>
          </div>

        </div>
      </section>

      {/* SECTION: 5 TRAVELLER MODES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-[#F59E0B] mb-2">
            Personalized Travel Archetypes
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F3F6F4]">
            Five Ways to Wander the World
          </h2>
          <p className="text-xs sm:text-sm text-[#8A9C93] mt-2">
            Every travel style requires different safety checks, accommodation types, and daily pacing. Switch modes anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {TRAVELLER_MODES.map(mode => {
            const isSelected = activeMode === mode.id;
            return (
              <div
                key={mode.id}
                onClick={() => switchTravellerMode(mode.id)}
                className={`cursor-pointer rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? 'ring-2 ring-[#F59E0B] shadow-2xl bg-[#121E19] scale-[1.02] border-[#F59E0B]'
                    : 'bg-[#0E1814] hover:bg-[#121E19] border-[#1C3227] shadow-sm hover:border-[#2E5240]'
                }`}
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden">
                    <img
                      src={mode.imageUrl}
                      alt={mode.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E1814] via-[#0E1814]/40 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="text-[10px] font-bold text-[#FBBF24] uppercase tracking-wider">
                        {mode.hindiTitle}
                      </div>
                      <h3 className="font-bold text-base leading-tight text-[#F3F6F4]">
                        {mode.title}
                      </h3>
                    </div>
                    {isSelected && (
                      <div className="absolute top-3 right-3 bg-[#F59E0B] text-black text-[9px] font-bold px-2 py-0.5 rounded-full shadow">
                        Active Mode
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-2.5">
                    <p className="text-xs text-[#8A9C93] line-clamp-3 leading-relaxed">
                      {mode.description}
                    </p>
                    <div className="pt-2 border-t border-[#1C3026] space-y-1">
                      <div className="text-[9px] font-bold uppercase text-[#6B7E75]">Key Focus:</div>
                      <div className="text-[11px] font-medium text-[#D8E4DE] truncate">
                        {mode.keyBenefits[0]}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#0A110E] border-t border-[#1C3026]">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      switchTravellerMode(mode.id);
                      onOpenPlannerWithDestination(mode.recommendedDestinations[0]);
                    }}
                    className={`w-full py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
                      isSelected
                        ? 'bg-[#1C362A] text-[#FBBF24] border border-[#2E5442]'
                        : 'bg-[#121E19] text-[#A2B3AB] hover:text-white hover:bg-[#182821]'
                    }`}
                  >
                    <span>Plan as {mode.title.split(' ')[0]}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION: POPULAR DESTINATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#F59E0B] mb-1">
              Curated Escapes ({POPULAR_DESTINATIONS.length} Available)
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F3F6F4]">
              Iconic & Atmospheric Destinations
            </h2>
            <p className="text-xs sm:text-sm text-[#8A9C93] mt-1">
              From the boulder temples of Hampi to the high trans-Himalayan passes of Spiti
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('explore')}
            className="text-xs font-bold text-[#FBBF24] hover:text-[#F59E0B] flex items-center gap-1 border-b border-[#FBBF24] pb-0.5"
          >
            <span>View All Destinations ({POPULAR_DESTINATIONS.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDestinations.map(dest => {
            const isFav = favoriteDestinations.includes(dest.id);
            return (
              <div
                key={dest.id}
                className="group bg-[#0F1A15] rounded-3xl border border-[#1E352B] overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#2E5442] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-52 w-full overflow-hidden">
                    <img
                      src={dest.heroImage}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                    />
                    <div className="absolute top-3 left-3 bg-[#0A110E]/90 backdrop-blur-md text-[#FBBF24] border border-[#1E362C] px-2.5 py-0.5 rounded-md text-[10px] font-semibold">
                      {dest.category}
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleFavoriteDestination(dest.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
                        isFav
                          ? 'bg-rose-950/80 text-rose-400 border border-rose-800 shadow'
                          : 'bg-black/40 hover:bg-black/60 text-white'
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
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="text-[10px] font-semibold text-[#7D9387] uppercase tracking-wider">
                      {dest.stateOrCountry}
                    </div>
                    <h3 className="font-serif text-xl font-bold text-[#F3F6F4] group-hover:text-[#FBBF24] transition-colors">
                      {dest.name}
                    </h3>
                    <p className="text-xs text-[#8A9C93] line-clamp-2 leading-relaxed">
                      {dest.tagline}
                    </p>

                    <div className="pt-2 text-xs space-y-1 border-t border-[#182C23]">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#6B7E75]">Best Season:</span>
                        <span className="text-[#D8E4DE]">{dest.bestTimeToVisit}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#6B7E75]">Est. Daily:</span>
                        <span className="font-bold text-[#F59E0B]">₹{dest.averageDailyCost.toLocaleString('en-IN')}/day</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#0A110E] border-t border-[#182C23]">
                  <button
                    onClick={() => onOpenPlannerWithDestination(dest.name)}
                    className="w-full py-2 px-4 rounded-xl bg-[#162B21] hover:bg-[#1E3B2E] border border-[#274B39] text-[#F3F6F4] text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>Plan {dest.name} Trip</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION: HIDDEN GEMS TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#12231B] via-[#0E1A14] to-[#09110D] text-white p-8 sm:p-12 relative overflow-hidden shadow-2xl border border-[#234233]">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#FBBF24] text-xs font-bold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Off the Beaten Track · {HIDDEN_GEMS.length} Verified Spots</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Secret Red Canyons & High-Altitude Trails
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-[#9EAEA6] leading-relaxed">
              Explore Gandikota's red gorge, ancient cedar forest dhabas, cloud inversion tea estates, and hidden emerald pools without tourist tour buses.
            </p>
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setCurrentTab('gems')}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#D97706] to-[#B45309] hover:brightness-110 text-white font-bold text-xs sm:text-sm shadow-lg transition-all flex items-center gap-2"
              >
                <span>Discover Verified Hidden Gems</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => openQuestionnaire()}
                className="px-5 py-3 rounded-2xl bg-[#14261E] hover:bg-[#1A3328] text-[#F3F6F4] font-semibold text-xs sm:text-sm border border-[#2B4E3C]"
              >
                Set Offbeat Preferences
              </button>
            </div>
          </div>

          <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-[#183527]/30 blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* SECTION: HOW MUSAFIR WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-bold uppercase tracking-wider text-[#F59E0B] mb-1">
            Intuitive 4-Stage Architecture
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F3F6F4]">
            How Musafir Orchestrates Your Journey
          </h2>
          <p className="text-xs sm:text-sm text-[#8A9C93] mt-2">
            No cookie-cutter group packages. Full editable agency over every waypoint.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              num: '01',
              title: 'Share Your Style',
              desc: 'Select your traveller mode (Solo, Group, Couple, Family, Social) and quick preferences like budget tier and interests.'
            },
            {
              num: '02',
              title: 'AI Generates Itinerary',
              desc: 'Gemini AI generates practical morning, afternoon, and evening sequences with transit times, stays, and hidden gems.'
            },
            {
              num: '03',
              title: 'Customize Freely',
              desc: 'Drag, reorder, add custom spots, change timings, or regenerate single days. Costs recalculate automatically.'
            },
            {
              num: '04',
              title: 'Travel Like a Local',
              desc: 'Access offline-friendly route maps, verified food stalls, emergency tips, and community meetups.'
            }
          ].map(step => (
            <div
              key={step.num}
              className="p-6 rounded-3xl bg-[#0F1A15] border border-[#1E352B] shadow-sm relative group hover:border-[#F59E0B]/50 transition-colors"
            >
              <span className="font-serif text-3xl font-bold text-[#F59E0B] opacity-90 block mb-3">
                {step.num}.
              </span>
              <h3 className="font-bold text-base text-[#F3F6F4] mb-2">
                {step.title}
              </h3>
              <p className="text-xs text-[#8A9C93] leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
