import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Star, ShieldCheck, Check } from 'lucide-react';
import { Review } from '../types/travel';

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  gemName: string;
  onAddReview: (review: Review) => void;
}

export const AddReviewModal: React.FC<AddReviewModalProps> = ({
  isOpen,
  onClose,
  gemName,
  onAddReview
}) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [travelTip, setTravelTip] = useState('');
  const [monthVisited, setMonthVisited] = useState('October 2026');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      openAuthModal('login');
      return;
    }
    if (!comment.trim()) return;

    const fullComment = travelTip.trim()
      ? `${comment.trim()}\n\n💡 Insider Tip: ${travelTip.trim()}`
      : comment.trim();

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      authorName: user.fullName || 'Musafir Explorer',
      rating,
      date: 'Just now',
      comment: fullComment,
      isVerifiedTraveller: true
    };

    onAddReview(newReview);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0F1A15] rounded-3xl shadow-2xl border border-[#1F362C] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-[#0A110E] px-6 py-4.5 border-b border-[#1F362C] flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#F3F6F4]">Write a Travel Review</h3>
            <p className="text-[11px] text-[#8A9C93]">Sharing authentic insight for {gemName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#162520] hover:bg-[#1E332A] text-[#8A9C93] hover:text-[#F3F6F4] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-[#F3F6F4]">Review Published!</h4>
            <p className="text-xs text-[#8A9C93]">
              Thank you for contributing to Musafir's verified travel community.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            
            {/* Rating Stars */}
            <div>
              <label className="block text-[11px] font-bold text-[#D2DDD6] uppercase tracking-wider mb-2">
                Your Rating
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 text-2xl transition-transform hover:scale-110 cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        (hoverRating || rating) >= star
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-[#243B30]'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-semibold text-[#F59E0B] ml-2">
                  {rating === 5 ? 'Exceptional' : rating === 4 ? 'Very Good' : rating === 3 ? 'Average' : 'Could be better'}
                </span>
              </div>
            </div>

            {/* When did you visit */}
            <div>
              <label className="block text-[11px] font-semibold text-[#8A9C93] mb-1.5">
                Month of Visit
              </label>
              <select
                value={monthVisited}
                onChange={e => setMonthVisited(e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#1F362C] bg-[#0A110E] text-[#F3F6F4] focus:outline-none focus:border-[#F59E0B]"
              >
                <option value="October 2026">October 2026</option>
                <option value="September 2026">September 2026</option>
                <option value="August 2026">August 2026</option>
                <option value="Winter Season">Winter Season</option>
                <option value="Monsoon Season">Monsoon Season</option>
                <option value="Spring / Summer">Spring / Summer</option>
              </select>
            </div>

            {/* Review text */}
            <div>
              <label className="block text-[11px] font-bold text-[#D2DDD6] uppercase tracking-wider mb-1.5">
                Your Experience & Atmosphere *
              </label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="What was magical? What should fellow travellers know before heading here?"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#1F362C] bg-[#0A110E] text-[#F3F6F4] placeholder-[#506359] focus:outline-none focus:border-[#F59E0B]"
              />
            </div>

            {/* Travel Tip */}
            <div>
              <label className="block text-[11px] font-semibold text-[#8A9C93] mb-1.5">
                Practical Advice or Safety Tip
              </label>
              <input
                type="text"
                value={travelTip}
                onChange={e => setTravelTip(e.target.value)}
                placeholder="e.g. Arrive before 7 AM; steep steps require sturdy sneakers"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#1F362C] bg-[#0A110E] text-[#F3F6F4] placeholder-[#506359] focus:outline-none focus:border-[#F59E0B]"
              />
            </div>

            {/* Community standard notice */}
            <div className="p-3 rounded-xl bg-[#162520] border border-[#234234] text-[11px] text-[#A3B8AD] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
              <span>
                Verified Musafir guidelines: honest, unbiased reviews only. Commercial promotions or spam are flagged immediately by moderators.
              </span>
            </div>

            {/* Submit button */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-[#8A9C93] hover:text-[#F3F6F4] hover:bg-[#162520] rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] text-black hover:opacity-95 shadow-md transition-all cursor-pointer"
              >
                Post Verified Review
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
