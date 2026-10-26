import React, { useState } from 'react';
import { Activity, ItineraryDay } from '../types/travel';
import { MapPin, Navigation, Compass, Layers, Info } from 'lucide-react';

interface InteractiveMapProps {
  destination: string;
  days: ItineraryDay[];
  activeDayNumber: number;
  onSelectDay: (day: number) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  destination,
  days,
  activeDayNumber,
  onSelectDay
}) => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const currentDay = days.find(d => d.dayNumber === activeDayNumber) || days[0];
  const activities = currentDay?.activities || [];

  const getCoordinatesForIndex = (index: number, total: number) => {
    const spread = Math.min(total, 5);
    const angle = (index / Math.max(1, spread)) * 2 * Math.PI + 0.5;
    const rx = 32 + (index % 2 === 0 ? 10 : -8);
    const ry = 28 + (index % 3 === 0 ? 8 : -6);
    const cx = 50 + Math.cos(angle) * rx;
    const cy = 50 + Math.sin(angle) * ry;
    return {
      x: Math.max(18, Math.min(82, cx)),
      y: Math.max(20, Math.min(80, cy))
    };
  };

  const points = activities.map((act, idx) => ({
    activity: act,
    ...getCoordinatesForIndex(idx, activities.length)
  }));

  const pathD = points.length > 1
    ? points.reduce((acc, curr, idx) => {
        return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
      }, '')
    : '';

  return (
    <div className="bg-[#0F1A15] rounded-3xl border border-[#1E352B] overflow-hidden shadow-xl text-[#F3F6F4]">
      {/* Map Header */}
      <div className="px-5 py-3.5 bg-[#0B1410] border-b border-[#1A2E24] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-[#1C362A] text-[#FBBF24] border border-[#2E5442]">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#F3F6F4] uppercase tracking-wider">
              {destination} Route & Waypoints Map
            </h4>
            <p className="text-[11px] text-[#7D9387]">
              Day {activeDayNumber} Flow: {currentDay?.theme || 'Exploration'}
            </p>
          </div>
        </div>

        {/* Day Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {days.map(d => (
            <button
              key={d.dayNumber}
              onClick={() => onSelectDay(d.dayNumber)}
              className={`px-3 py-1 text-xs font-semibold rounded-xl transition-all ${
                activeDayNumber === d.dayNumber
                  ? 'bg-[#1C362A] text-[#FBBF24] border border-[#2E5442] shadow-sm'
                  : 'bg-[#0A110E] text-[#8A9C93] hover:text-white border border-[#1A2E24]'
              }`}
            >
              Day {d.dayNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Map Canvas Area */}
      <div className="relative h-72 sm:h-96 w-full bg-[#070D0B] overflow-hidden select-none">
        
        {/* Subtle Dark Topography / Grid lines */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(#10B981 1px, transparent 1px), radial-gradient(#10B981 1px, #070D0B 1px)`,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px'
          }}
        />

        {/* Ambient atmospheric glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#059669]/10 blur-3xl pointer-events-none" />

        {/* Decorative compass rose */}
        <div className="absolute top-4 right-4 pointer-events-none opacity-20">
          <Compass className="w-16 h-16 text-[#FBBF24]" />
        </div>

        {/* Map Terrain Features Labels */}
        <div className="absolute bottom-4 left-4 text-[10px] font-semibold text-[#8A9C93] bg-[#0A110E]/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-[#1A2E24]">
          📍 {destination} Coordinates & Topography
        </div>

        {/* Connecting route SVG path */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="0.8"
              strokeDasharray="2 1.5"
              className="opacity-80"
            />
          )}
        </svg>

        {/* Waypoint Pins */}
        {points.map((pt, idx) => {
          const isSelected = selectedActivity?.id === pt.activity.id;
          const timeColor =
            pt.activity.timeSlot === 'morning'
              ? 'bg-amber-400'
              : pt.activity.timeSlot === 'afternoon'
              ? 'bg-emerald-400'
              : 'bg-indigo-400';

          return (
            <div
              key={pt.activity.id}
              onClick={() => setSelectedActivity(pt.activity)}
              style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
            >
              {/* Pulsing ring */}
              <div className={`absolute -inset-2 rounded-full ${timeColor} opacity-20 animate-ping group-hover:opacity-50`} />

              {/* Pin marker */}
              <div
                className={`relative px-2.5 py-1 rounded-full shadow-2xl flex items-center gap-1.5 border transition-all duration-200 ${
                  isSelected
                    ? 'scale-110 border-[#FBBF24] bg-[#162920] text-white ring-4 ring-[#F59E0B]/40 shadow-[0_0_15px_#F59E0B]'
                    : 'border-[#2E5240] bg-[#0E1A14] text-[#F3F6F4] hover:scale-105 hover:border-[#F59E0B]'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${timeColor} shadow-[0_0_6px_currentColor]`} />
                <span className="text-[11px] font-bold text-[#FBBF24]">#{idx + 1}</span>
                <span className="text-[11px] font-medium max-w-[120px] truncate hidden sm:inline text-[#D8E4DE]">
                  {pt.activity.title.split(' ')[0]}
                </span>
              </div>
            </div>
          );
        })}

        {/* Selected Pin Details Popover */}
        {selectedActivity && (
          <div className="absolute bottom-4 right-4 max-w-xs bg-[#0F1A15]/95 backdrop-blur-xl p-4 rounded-2xl border border-[#234233] shadow-2xl z-20 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F59E0B]">
                  {selectedActivity.timeSlot} · {selectedActivity.startTime}
                </span>
                <h5 className="font-bold text-xs text-[#F3F6F4] mt-0.5">
                  {selectedActivity.title}
                </h5>
                <p className="text-[11px] text-[#8A9C93] mt-1 line-clamp-2">
                  {selectedActivity.description}
                </p>
              </div>
              <button
                onClick={() => setSelectedActivity(null)}
                className="text-xs text-[#7D9387] hover:text-white"
              >
                ✕
              </button>
            </div>
            {selectedActivity.insiderTip && (
              <div className="mt-2.5 pt-2 border-t border-[#1C3227] text-[10px] text-[#FBBF24] font-medium flex items-center gap-1">
                <span>💡 Tip: {selectedActivity.insiderTip}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Map Legend */}
      <div className="px-5 py-2.5 bg-[#0B1410] border-t border-[#1A2E24] flex flex-wrap items-center justify-between text-[11px] text-[#7D9387] gap-2">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-[#F3F6F4]">Chronological Sequence:</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Morning
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Afternoon
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-indigo-400" /> Evening
          </span>
        </div>
        <div className="text-[10px] text-[#6B7E75]">
          Click any pin for waypoint context & tips
        </div>
      </div>
    </div>
  );
};
