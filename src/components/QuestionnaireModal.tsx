import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Compass,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Mountain,
  Palmtree,
  Tent,
  Landmark,
  UtensilsCrossed,
  ShoppingBag,
  Camera,
  Coffee,
  TreePine,
  ShieldCheck,
  Baby,
  Accessibility,
  Dog
} from 'lucide-react';
import { BudgetTier, TravelPace, TripDurationType } from '../types/travel';

export const QuestionnaireModal: React.FC = () => {
  const { user, isQuestionnaireOpen, closeQuestionnaire, updatePreferences } = useAuth();

  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    user?.preferences?.interests || ['culture', 'nature', 'food']
  );
  const [preferredDestinations, setPreferredDestinations] = useState<string[]>(
    user?.preferences?.preferredDestinations || ['mountains', 'heritage']
  );
  const [budgetTier, setBudgetTier] = useState<BudgetTier>(
    user?.preferences?.budgetTier || 'moderate'
  );
  const [duration, setDuration] = useState<TripDurationType>(
    user?.preferences?.preferredDuration || 'week'
  );
  const [accommodation, setAccommodation] = useState<string>(
    user?.preferences?.accommodationType || 'Boutique Homestay & Heritage'
  );
  const [pace, setPace] = useState<TravelPace>(
    user?.preferences?.travelPace || 'balanced'
  );
  const [specialReqs, setSpecialReqs] = useState<string[]>(
    user?.preferences?.specialRequirements || []
  );

  if (!isQuestionnaireOpen) return null;

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleDestination = (id: string) => {
    setPreferredDestinations(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSpecialReq = (id: string) => {
    setSpecialReqs(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleFinish = (isSkipped = false) => {
    if (!isSkipped) {
      updatePreferences({
        interests: selectedInterests,
        preferredDestinations,
        budgetTier,
        preferredDuration: duration,
        accommodationType: accommodation,
        travelPace: pace,
        specialRequirements: specialReqs,
        hasCompletedQuestionnaire: true
      });
    } else {
      updatePreferences({ hasCompletedQuestionnaire: true });
    }
    closeQuestionnaire();
  };

  const interestOptions = [
    { id: 'nature', label: 'Nature & Wildlife', icon: TreePine },
    { id: 'mountains', label: 'Mountains & Peaks', icon: Mountain },
    { id: 'beaches', label: 'Beaches & Oceans', icon: Palmtree },
    { id: 'adventure', label: 'Adventure & Trekking', icon: Tent },
    { id: 'heritage', label: 'Heritage & History', icon: Landmark },
    { id: 'food', label: 'Culinary & Local Food', icon: UtensilsCrossed },
    { id: 'shopping', label: 'Artisan & Bazaars', icon: ShoppingBag },
    { id: 'photography', label: 'Photography & Views', icon: Camera },
    { id: 'relaxation', label: 'Soulful Relaxation', icon: Coffee }
  ];

  const destinationTypes = [
    { id: 'mountains', label: 'Mountain Valleys', desc: 'Snow peaks, fresh cedar air & trails' },
    { id: 'heritage', label: 'Historic Cities & Havelis', desc: 'Ancient forts, palaces, and royal stories' },
    { id: 'beaches', label: 'Coastal Havens', desc: 'Sunsets, palm trees & seaside seafood' },
    { id: 'forests', label: 'Forests & National Parks', desc: 'Lush greenery, waterfalls & eco trails' },
    { id: 'villages', label: 'Rural & Tribal Villages', desc: 'Authentic crafts, homestays & calm lives' },
    { id: 'cities', label: 'Vibrant Cultural Metros', desc: 'Museums, street life & nightlife' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0F1A15] text-[#F3F6F4] rounded-3xl shadow-2xl border border-[#234233] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Header */}
        <div className="bg-[#0A110E] px-6 py-5 text-white flex items-center justify-between border-b border-[#1A2E24]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#1C362A] text-[#FBBF24] border border-[#2E5442] flex items-center justify-center shadow">
              <Compass className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#F3F6F4]">Your Travel Persona Quiz</h3>
              <p className="text-[11px] text-[#7D9387]">Step {step} of {totalSteps} · Calibrating Musafir recommendation weights</p>
            </div>
          </div>
          <button
            onClick={closeQuestionnaire}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-[#8A9C93] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#0A110E] h-1.5">
          <div
            className="bg-gradient-to-r from-[#D97706] to-[#F59E0B] h-1.5 transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* Scrollable Questions Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* STEP 1: Interests */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-serif text-xl font-bold text-[#F3F6F4]">
                  What draws your heart to wander?
                </h4>
                <p className="text-xs text-[#8A9C93] mt-1">
                  Select your favorite travel themes. Musafir balances your itinerary with these passions.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {interestOptions.map(item => {
                  const Icon = item.icon;
                  const isSelected = selectedInterests.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleInterest(item.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between h-24 ${
                        isSelected
                          ? 'border-[#F59E0B] bg-[#1C3227] text-white shadow-lg'
                          : 'border-[#1E352B] bg-[#0A110E] text-[#9EAEA6] hover:border-[#2E5442] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-[#FBBF24]' : 'text-[#7D9387]'}`} />
                        {isSelected && <Check className="w-4 h-4 text-[#FBBF24]" />}
                      </div>
                      <span className="text-xs font-semibold">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Preferred Landscapes */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-serif text-xl font-bold text-[#F3F6F4]">
                  Which landscapes do you crave most?
                </h4>
                <p className="text-xs text-[#8A9C93] mt-1">
                  Choose the environments you love exploring.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {destinationTypes.map(item => {
                  const isSelected = preferredDestinations.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleDestination(item.id)}
                      className={`p-4 rounded-2xl border text-left transition-all flex items-start justify-between ${
                        isSelected
                          ? 'border-[#F59E0B] bg-[#1C3227] text-white shadow-lg'
                          : 'border-[#1E352B] bg-[#0A110E] text-[#9EAEA6] hover:border-[#2E5442]'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-xs text-[#F3F6F4]">{item.label}</div>
                        <div className="text-[11px] text-[#7D9387] mt-0.5">{item.desc}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                        isSelected ? 'bg-[#F59E0B] border-[#F59E0B] text-black' : 'border-[#2E5442]'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Budget Range & Trip Duration */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h4 className="font-serif text-xl font-bold text-[#F3F6F4]">
                  Budget Tier & Trip Length
                </h4>
                <p className="text-xs text-[#8A9C93] mt-1">
                  Ensures realistic accommodation, transit, and food estimates.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#FBBF24] uppercase tracking-wider">
                  Typical Daily Budget Tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'budget', label: 'Budget Explorer', cost: '₹1,500 - ₹3,500/day', desc: 'Clean hostels, trains, street food & shared autos' },
                    { id: 'moderate', label: 'Balanced Comfort', cost: '₹3,500 - ₹7,500/day', desc: 'Boutique homestays, AC taxis, curated cafes' },
                    { id: 'luxury', label: 'Luxury Heritage', cost: '₹7,500 - ₹18,000+/day', desc: 'Heritage havelis, luxury resorts & fine dining' }
                  ].map(b => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBudgetTier(b.id as BudgetTier)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        budgetTier === b.id
                          ? 'border-[#F59E0B] bg-[#1C3227] text-white shadow-lg'
                          : 'border-[#1E352B] bg-[#0A110E] text-[#9EAEA6] hover:bg-[#121E19]'
                      }`}
                    >
                      <div className="font-bold text-xs text-[#F3F6F4]">{b.label}</div>
                      <div className="text-[11px] font-semibold mt-1 text-[#FBBF24]">
                        {b.cost}
                      </div>
                      <div className="text-[10px] mt-1 text-[#7D9387]">
                        {b.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#FBBF24] uppercase tracking-wider">
                  Preferred Trip Duration
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'weekend', label: 'Weekend Getaway', time: '2 - 3 Days' },
                    { id: 'week', label: 'Week-long Explorer', time: '4 - 7 Days' },
                    { id: 'extended', label: 'Extended Odyssey', time: '8 - 14+ Days' }
                  ].map(d => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDuration(d.id as TripDurationType)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        duration === d.id
                          ? 'border-[#F59E0B] bg-[#1C3227] text-[#FBBF24] font-bold'
                          : 'border-[#1E352B] bg-[#0A110E] text-[#9EAEA6]'
                      }`}
                    >
                      <div className="text-xs">{d.label}</div>
                      <div className="text-[11px] text-[#7D9387] font-medium">{d.time}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Accommodation & Travel Pace */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h4 className="font-serif text-xl font-bold text-[#F3F6F4]">
                  Where do you sleep & How fast do you move?
                </h4>
                <p className="text-xs text-[#8A9C93] mt-1">
                  A rushed trip is no vacation. Choose how you like your days organized.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#FBBF24] uppercase tracking-wider">
                  Travel Pace
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'relaxed', label: 'Relaxed & Unhurried', desc: '1-2 highlights per day, long cafe lunches and peaceful sunsets' },
                    { id: 'balanced', label: 'Balanced Discovery', desc: '2-3 key spots per day with breathing room between visits' },
                    { id: 'packed', label: 'Action-Packed Explorer', desc: 'Early mornings to late dusk covering maximum landmarks' }
                  ].map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPace(p.id as TravelPace)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        pace === p.id
                          ? 'border-[#F59E0B] bg-[#1C3227] text-white shadow-lg'
                          : 'border-[#1E352B] bg-[#0A110E] text-[#9EAEA6] hover:bg-[#121E19]'
                      }`}
                    >
                      <div className="font-bold text-xs text-[#F3F6F4]">{p.label}</div>
                      <div className="text-[10px] mt-1 text-[#7D9387]">
                        {p.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#FBBF24] uppercase tracking-wider">
                  Preferred Stays
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    'Boutique Homestay & Heritage',
                    'Heritage Havelis & Palaces',
                    'Cozy Backpacker Hostels',
                    'Eco Lodges & Treehouses',
                    '4-5 Star Luxury Hotels'
                  ].map(acc => (
                    <button
                      key={acc}
                      type="button"
                      onClick={() => setAccommodation(acc)}
                      className={`p-3 rounded-2xl border text-xs text-left transition-all flex items-center justify-between ${
                        accommodation === acc
                          ? 'border-[#F59E0B] bg-[#1C3227] font-bold text-[#FBBF24]'
                          : 'border-[#1E352B] bg-[#0A110E] text-[#9EAEA6]'
                      }`}
                    >
                      <span>{acc}</span>
                      {accommodation === acc && <Check className="w-3.5 h-3.5 text-[#F59E0B]" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Special Requirements */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-serif text-xl font-bold text-[#F3F6F4]">
                  Any special requirements or comforts?
                </h4>
                <p className="text-xs text-[#8A9C93] mt-1">
                  We factor in accessibility, safety, and family accommodations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'child_friendly', label: 'Child & Kid Friendly', desc: 'Paved paths, gentle attractions & kid menus', icon: Baby },
                  { id: 'senior_friendly', label: 'Senior Citizen Friendly', desc: 'Elevators, minimal stair climbs & resting pauses', icon: ShieldCheck },
                  { id: 'accessible', label: 'Wheelchair / Easy Access', desc: 'Ramps, accessible restrooms & vehicle access', icon: Accessibility },
                  { id: 'pet_friendly', label: 'Pet Friendly Travel', desc: 'Pet-welcoming stays & outdoor open parks', icon: Dog }
                ].map(item => {
                  const Icon = item.icon;
                  const isSelected = specialReqs.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleSpecialReq(item.id)}
                      className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                        isSelected
                          ? 'border-[#F59E0B] bg-[#1C3227] text-white shadow-lg'
                          : 'border-[#1E352B] bg-[#0A110E] text-[#9EAEA6]'
                      }`}
                    >
                      <Icon className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold text-[#F3F6F4]">{item.label}</div>
                        <div className="text-[11px] text-[#7D9387] mt-0.5">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-[#0A110E] border-t border-[#1E352B] flex items-center justify-between">
          <div>
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-3.5 py-1.5 text-xs font-semibold text-[#D8E4DE] hover:bg-[#162520] rounded-xl transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleFinish(true)}
                className="text-xs text-[#7D9387] hover:text-[#F3F6F4] underline"
              >
                Skip for now
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {step < totalSteps ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#1C362A] hover:bg-[#254939] text-white border border-[#2E5442] transition-colors flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleFinish(false)}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#D97706] to-[#B45309] text-white hover:brightness-110 shadow-lg transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Save Travel Persona</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
