import React, { useState, useEffect } from 'react';
import { Activity } from '../types/travel';
import { X, Clock, MapPin, IndianRupee, Sparkles, Tag, AlertTriangle } from 'lucide-react';

interface ItineraryEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayNumber: number;
  existingActivity?: Activity | null;
  onSave: (activity: Activity) => void;
}

export const ItineraryEditorModal: React.FC<ItineraryEditorModalProps> = ({
  isOpen,
  onClose,
  dayNumber,
  existingActivity,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [timeSlot, setTimeSlot] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('11:30 AM');
  const [duration, setDuration] = useState('2.5 hours');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Activity['category']>('sightseeing');
  const [estimatedCost, setEstimatedCost] = useState(400);
  const [travelTimeToNext, setTravelTimeToNext] = useState('15 mins auto-rickshaw');
  const [insiderTip, setInsiderTip] = useState('');

  useEffect(() => {
    if (existingActivity) {
      setTitle(existingActivity.title);
      setTimeSlot(existingActivity.timeSlot);
      setStartTime(existingActivity.startTime);
      setEndTime(existingActivity.endTime);
      setDuration(existingActivity.duration);
      setLocation(existingActivity.location);
      setDescription(existingActivity.description);
      setCategory(existingActivity.category);
      setEstimatedCost(existingActivity.estimatedCost);
      setTravelTimeToNext(existingActivity.travelTimeToNext || '15 mins transit');
      setInsiderTip(existingActivity.insiderTip || '');
    } else {
      setTitle('');
      setTimeSlot('morning');
      setStartTime('09:00 AM');
      setEndTime('11:30 AM');
      setDuration('2.5 hours');
      setLocation('');
      setDescription('');
      setCategory('sightseeing');
      setEstimatedCost(400);
      setTravelTimeToNext('15 mins transit');
      setInsiderTip('');
    }
  }, [existingActivity, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) return;

    const activityData: Activity = {
      id: existingActivity?.id || `act-${dayNumber}-${Date.now()}`,
      title: title.trim(),
      timeSlot,
      startTime,
      endTime,
      duration,
      location: location.trim(),
      description: description.trim() || `Experience ${title} with local flavor.`,
      category,
      estimatedCost: Number(estimatedCost) || 0,
      travelTimeToNext,
      insiderTip: insiderTip.trim() || undefined,
      isCustom: true
    };

    onSave(activityData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0F1A15] rounded-3xl shadow-2xl border border-[#1F362C] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#0A110E] px-6 py-4.5 border-b border-[#1F362C] flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#F3F6F4] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
              {existingActivity ? 'Edit Activity Details' : `Add New Place to Day ${dayNumber}`}
            </h3>
            <p className="text-[11px] text-[#8A9C93]">
              Customize timing, costs, and personal notes for this waypoint
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#162520] hover:bg-[#1E332A] text-[#8A9C93] hover:text-[#F3F6F4] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Title */}
          <div>
            <label className="block text-[11px] font-bold text-[#D2DDD6] uppercase tracking-wider mb-1.5">
              Activity / Place Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Sunset Boat Ride or Local Pottery Workshop"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#1F362C] bg-[#0A110E] text-[#F3F6F4] placeholder-[#506359] focus:outline-none focus:border-[#F59E0B]"
            />
          </div>

          {/* Time Slot & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#8A9C93] mb-1.5">
                Time Slot
              </label>
              <select
                value={timeSlot}
                onChange={e => setTimeSlot(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#1F362C] bg-[#0A110E] text-[#F3F6F4] focus:outline-none focus:border-[#F59E0B]"
              >
                <option value="morning">Morning (Sunrise - 12:00 PM)</option>
                <option value="afternoon">Afternoon (12:00 PM - 04:30 PM)</option>
                <option value="evening">Evening (04:30 PM - 10:00 PM)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#8A9C93] mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#1F362C] bg-[#0A110E] text-[#F3F6F4] focus:outline-none focus:border-[#F59E0B]"
              >
                <option value="sightseeing">Sightseeing & Monuments</option>
                <option value="food">Food & Local Dining</option>
                <option value="nature">Nature & Outdoors</option>
                <option value="culture">Culture & Heritage</option>
                <option value="adventure">Adventure & Trails</option>
                <option value="relaxation">Relaxation & Wellness</option>
                <option value="hidden_gem">Hidden Gem</option>
              </select>
            </div>
          </div>

          {/* Timing details */}
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-[#8A9C93] mb-1.5">
                Start Time
              </label>
              <input
                type="text"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                placeholder="09:00 AM"
                className="w-full px-3 py-2.5 rounded-xl border border-[#1F362C] bg-[#0A110E] text-[#F3F6F4] focus:outline-none focus:border-[#F59E0B]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#8A9C93] mb-1.5">
                End Time
              </label>
              <input
                type="text"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                placeholder="11:30 AM"
                className="w-full px-3 py-2.5 rounded-xl border border-[#1F362C] bg-[#0A110E] text-[#F3F6F4] focus:outline-none focus:border-[#F59E0B]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#8A9C93] mb-1.5">
                Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                placeholder="2.5 hours"
                className="w-full px-3 py-2.5 rounded-xl border border-[#1F362C] bg-[#0A110E] text-[#F3F6F4] focus:outline-none focus:border-[#F59E0B]"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-[11px] font-bold text-[#D2DDD6] uppercase tracking-wider mb-1.5">
              Location / Area *
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Near Lake Pichola or Mall Road"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#1F362C] bg-[#0A110E] text-[#F3F6F4] placeholder-[#506359] focus:outline-none focus:border-[#F59E0B]"
            />
          </div>

          {/* Estimated Cost & Travel Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#8A9C93] mb-1.5">
                Estimated Cost (₹ INR)
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-3 w-3.5 h-3.5 text-[#8A9C93]" />
                <input
                  type="number"
                  min="0"
                  value={estimatedCost}
                  onChange={e => setEstimatedCost(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-[#1F362C] bg-[#0A110E] text-[#F3F6F4] focus:outline-none focus:border-[#F59E0B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#8A9C93] mb-1.5">
                Transit to Next Spot
              </label>
              <input
                type="text"
                value={travelTimeToNext}
                onChange={e => setTravelTimeToNext(e.target.value)}
                placeholder="e.g. 15 mins by cab"
                className="w-full px-3 py-2.5 rounded-xl border border-[#1F362C] bg-[#0A110E] text-[#F3F6F4] focus:outline-none focus:border-[#F59E0B]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-semibold text-[#8A9C93] mb-1.5">
              Description & Highlights
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What makes this activity worthwhile..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#1F362C] bg-[#0A110E] text-[#F3F6F4] placeholder-[#506359] focus:outline-none focus:border-[#F59E0B]"
            />
          </div>

          {/* Insider Tip */}
          <div>
            <label className="block text-[11px] font-semibold text-[#8A9C93] mb-1.5">
              Local Insider Tip (Optional)
            </label>
            <input
              type="text"
              value={insiderTip}
              onChange={e => setInsiderTip(e.target.value)}
              placeholder="e.g. Best light for photos at 5 PM; carry water bottle"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#1F362C] bg-[#0A110E] text-[#F3F6F4] placeholder-[#506359] focus:outline-none focus:border-[#F59E0B]"
            />
          </div>

          {/* Schedule tip notice */}
          <div className="p-3 rounded-xl bg-[#162520] border border-[#234234] text-[11px] text-[#A3B8AD] flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
            <span>
              Tip: Musafir automatically recalculates overall budget when activities or costs are adjusted.
            </span>
          </div>

          {/* Buttons */}
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
              {existingActivity ? 'Save Changes' : 'Add to Itinerary'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
