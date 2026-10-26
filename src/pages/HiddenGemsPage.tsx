import React, { useState } from 'react';
import { HIDDEN_GEMS } from '../data/travelData';
import { HiddenGem, Review } from '../types/travel';
import { useAuth } from '../context/AuthContext';
import { useTrip } from '../context/TripContext';
import { AddReviewModal } from '../components/AddReviewModal';
import {
  Compass,
  Star,
  MapPin,
  Clock,
  IndianRupee,
  Navigation,
  Heart,
  Plus,
  MessageSquare,
  ShieldCheck,
  Check,
  Search
} from 'lucide-react';

interface HiddenGemsPageProps {
  onOpenPlannerWithDestination: (dest: string) => void;
}

export const HiddenGemsPage: React.FC<HiddenGemsPageProps> = ({ onOpenPlannerWithDestination }) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { savedHiddenGems, toggleSaveHiddenGem, addActivityToDay, activeTrip } = useTrip();

  const [gemsList, setGemsList] = useState<HiddenGem[]>(HIDDEN_GEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [reviewingGem, setReviewingGem] = useState<HiddenGem | null>(null);
  const [addedToTripNotice, setAddedToTripNotice] = useState<string | null>(null);
  const [reportedGemId, setReportedGemId] = useState<string | null>(null);

  const categories = ['All', 'Nature', 'Food', 'Heritage', 'Offbeat', 'Adventure'];

  const filteredGems = gemsList.filter(gem => {
    const matchCat = selectedCategory === 'All' || gem.category === selectedCategory;
    const matchSearch =
      gem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gem.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gem.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gem.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchCat && matchSearch;
  });

  const handleAddReview = (newReview: Review) => {
    if (!reviewingGem) return;
    setGemsList(prev =>
      prev.map(g => {
        if (g.id === reviewingGem.id) {
          const updatedReviews = [newReview, ...g.reviews];
          const newAvg = Number(
            (updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length).toFixed(1)
          );
          return {
            ...g,
            rating: newAvg,
            reviewsCount: g.reviewsCount + 1,
            reviews: updatedReviews
          };
        }
        return g;
      })
    );
  };

  const handleAddToItinerary = (gem: HiddenGem) => {
    if (!activeTrip) {
      onOpenPlannerWithDestination(gem.location.split(',')[0]);
      return;
    }

    addActivityToDay(1, {
      id: `gem-act-${Date.now()}`,
      title: `${gem.name} (Hidden Gem)`,
      timeSlot: 'afternoon',
      startTime: '02:00 PM',
      endTime: '04:00 PM',
      duration: gem.estimatedDuration,
      location: gem.location,
      description: gem.description,
      category: 'hidden_gem',
      estimatedCost: 200,
      insiderTip: gem.whyVisit,
      isCustom: true
    });

    setAddedToTripNotice(gem.name);
    setTimeout(() => setAddedToTripNotice(null), 3000);
  };

  const handleReport = (gemId: string) => {
    setReportedGemId(gemId);
    setTimeout(() => setReportedGemId(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-[#0A110E] text-[#F3F6F4]">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111F18] border border-[#234233] text-[#FBBF24] text-xs font-bold uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>Local Secrets & Verified Gems</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F3F6F4]">
          Beyond the Guidebooks
        </h1>
        <p className="text-xs sm:text-sm text-[#8A9C93] max-w-xl mx-auto">
          Quiet hilltop viewpoints, century-old rustic kitchens, secret waterfalls, and artisan guilds. Every recommendation includes practical timing, fee clarity, and verified traveller tips.
        </p>
      </div>

      {addedToTripNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-600 text-xs text-emerald-300 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span><strong>{addedToTripNotice}</strong> has been added to Day 1 of your active itinerary!</span>
          </div>
          <button
            onClick={() => setAddedToTripNotice(null)}
            className="text-xs text-emerald-300 underline font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-[#0F1A15] rounded-3xl p-5 border border-[#1E352B] shadow-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          <div className="md:col-span-8 relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#6B7E75]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search hidden gems by place, state, or keywords (e.g. Gandikota, Badi Lake, Tea Trail)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[#223B2F] bg-[#0A110E] text-[#F3F6F4] placeholder-[#5A6F64] focus:outline-none focus:border-[#F59E0B]"
            />
          </div>

          <div className="md:col-span-4 text-right text-xs text-[#8A9C93]">
            Showing <strong className="text-[#FBBF24]">{filteredGems.length}</strong> verified hidden spots
          </div>
        </div>

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

      {/* Hidden Gems List Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredGems.map(gem => {
          const isSaved = savedHiddenGems.includes(gem.id);
          const isReported = reportedGemId === gem.id;

          return (
            <div
              key={gem.id}
              className="bg-[#0F1A15] rounded-3xl border border-[#1E352B] overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#2E5442] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Photo & Badge */}
                <div className="relative h-64 w-full overflow-hidden">
                  <img
                    src={gem.imageUrl}
                    alt={gem.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 opacity-85"
                  />
                  <div className="absolute top-3 left-3 bg-[#0A110E]/90 backdrop-blur-md text-[#FBBF24] border border-[#1E362C] px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>Verified Gem · {gem.category}</span>
                  </div>

                  <button
                    onClick={() => toggleSaveHiddenGem(gem.id)}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
                      isSaved ? 'bg-rose-950/80 text-rose-400 border border-rose-800 shadow' : 'bg-black/40 hover:bg-black/60 text-white'
                    }`}
                    title="Save to Favourites"
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-400' : ''}`} />
                  </button>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{gem.rating}</span>
                      <span className="text-[11px] font-normal text-gray-300">({gem.reviewsCount} reviews)</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 font-semibold">
                      {gem.estimatedDuration}
                    </span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-6 space-y-4">
                  <div>
                    <div className="text-[10px] font-bold text-[#7D9387] uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#F59E0B]" />
                      <span>{gem.location}</span>
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-[#F3F6F4] mt-1">
                      {gem.name}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-[#9EAEA6] leading-relaxed">
                    {gem.description}
                  </p>

                  {/* Why it is worth visiting */}
                  <div className="p-3.5 rounded-2xl bg-[#0A110E] border border-[#1E352B] space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#F59E0B] block">
                      ✨ Why It’s Worth Visiting:
                    </span>
                    <p className="text-xs font-medium text-[#D8E4DE] leading-relaxed">
                      {gem.whyVisit}
                    </p>
                  </div>

                  {/* Practical Logistics Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                    <div className="flex items-start gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#F59E0B] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[#6B7E75] block text-[10px]">Best Time to Visit</span>
                        <span className="font-semibold text-[#D8E4DE]">{gem.bestTime}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <IndianRupee className="w-3.5 h-3.5 text-[#F59E0B] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[#6B7E75] block text-[10px]">Entry / Fee Status</span>
                        <span className="font-semibold text-[#D8E4DE]">{gem.entryFee}</span>
                      </div>
                    </div>
                  </div>

                  {/* Directions */}
                  <div className="flex items-start gap-2 text-xs text-[#8A9C93] bg-[#0A110E] p-2.5 rounded-xl border border-[#1A2E24]">
                    <Navigation className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                    <span><strong>Directions: </strong>{gem.directions}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {gem.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#0A110E] text-[#7D9387] border border-[#1A2E24]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Community Reviews Teaser */}
                  <div className="pt-3 border-t border-[#182C23] space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-[#F3F6F4]">
                      <span>Community Insights ({gem.reviews.length})</span>
                      <button
                        onClick={() => {
                          if (!isAuthenticated) openAuthModal('login');
                          else setReviewingGem(gem);
                        }}
                        className="text-[11px] text-[#F59E0B] hover:underline flex items-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Write a Review</span>
                      </button>
                    </div>

                    {gem.reviews.slice(0, 1).map(rev => (
                      <div key={rev.id} className="p-3 rounded-xl bg-[#0A110E] border border-[#1E352B] text-xs space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-[#F3F6F4] flex items-center gap-1">
                            {rev.authorName}
                            {rev.isVerifiedTraveller && (
                              <span title="Verified traveller">
                                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                              </span>
                            )}
                          </span>
                          <span className="text-[#6B7E75]">{rev.date}</span>
                        </div>
                        <p className="text-[#9EAEA6] italic">{rev.comment}</p>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-[#0A110E] border-t border-[#182C23] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleReport(gem.id)}
                  className="text-[10px] text-[#6B7E75] hover:text-rose-400 transition-colors"
                >
                  {isReported ? '✓ Flagged for review' : 'Report inaccuracies'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSaveHiddenGem(gem.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                      isSaved
                        ? 'border-rose-900 bg-rose-950/60 text-rose-300'
                        : 'border-[#22392E] bg-[#111D18] hover:bg-[#162720] text-[#D8E4DE]'
                    }`}
                  >
                    {isSaved ? 'Saved in Favourites' : 'Save'}
                  </button>

                  <button
                    onClick={() => handleAddToItinerary(gem)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D97706] to-[#B45309] hover:brightness-110 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Itinerary</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Review Modal */}
      {reviewingGem && (
        <AddReviewModal
          isOpen={!!reviewingGem}
          onClose={() => setReviewingGem(null)}
          gemName={reviewingGem.name}
          onAddReview={handleAddReview}
        />
      )}

    </div>
  );
};
