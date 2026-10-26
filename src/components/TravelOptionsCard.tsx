import React from 'react';
import { AccommodationOption, TransportOption } from '../types/travel';
import { Plane, Train, Bus, Hotel, Star, ExternalLink, ShieldAlert } from 'lucide-react';

interface TravelOptionsCardProps {
  accommodations: AccommodationOption[];
  transports: TransportOption[];
}

export const TravelOptionsCard: React.FC<TravelOptionsCardProps> = ({
  accommodations,
  transports
}) => {
  return (
    <div className="space-y-6 text-[#F3F6F4]">
      <div className="p-4 rounded-3xl bg-[#0F1A15] border border-[#1E352B] flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
        <div className="text-xs text-[#9EAEA6]">
          <span className="font-semibold text-[#F3F6F4]">Demonstration & Sample Travel Rates: </span>
          The schedules, fares, and room tariffs below reflect real-world indicative ranges for this route. Outbound booking links connect to authorized booking portals (MakeMyTrip, IRCTC, IndiGo, Booking.com) to complete live bookings.
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Hotel className="w-4 h-4 text-[#F59E0B]" />
            <h4 className="font-serif text-base font-bold text-[#F3F6F4]">
              Recommended Stays & Boutique Haveli
            </h4>
          </div>
          <span className="text-[11px] text-[#7D9387]">Filtered by your travel mode</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accommodations.map(acc => (
            <div
              key={acc.id}
              className="bg-[#0F1A15] rounded-3xl border border-[#1E352B] overflow-hidden shadow-sm hover:shadow-xl hover:border-[#2E5442] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={acc.imageUrl}
                    alt={acc.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 opacity-85"
                  />
                  <div className="absolute top-3 left-3 bg-[#0A110E]/90 backdrop-blur-md text-[#FBBF24] border border-[#1E362C] px-2.5 py-0.5 rounded-md text-[10px] font-semibold">
                    {acc.type}
                  </div>
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-[#F3F6F4] px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 border border-white/10">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{acc.rating}</span>
                    <span className="text-[9px] text-[#7D9387] font-normal">({acc.reviewsCount})</span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h5 className="font-bold text-sm text-[#F3F6F4]">{acc.name}</h5>
                  <p className="text-xs text-[#7D9387]">{acc.location}</p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {acc.amenities.map((am, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#0A110E] text-[#A2B3AB] border border-[#1A2E24]"
                      >
                        ✓ {am}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-5 py-3.5 bg-[#0A110E] border-t border-[#182C23] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#7D9387]">Tariff from </span>
                  <span className="text-sm font-bold text-[#FBBF24]">₹{acc.pricePerNight.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-[#7D9387]"> / night</span>
                </div>
                <a
                  href={acc.providerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-[#162B21] hover:bg-[#1E3B2E] text-white border border-[#274B39] flex items-center gap-1.5 transition-colors"
                >
                  <span>Book with {acc.bookingProvider.split('/')[0]}</span>
                  <ExternalLink className="w-3 h-3 text-[#F59E0B]" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Plane className="w-4 h-4 text-[#F59E0B]" />
            <h4 className="font-serif text-base font-bold text-[#F3F6F4]">
              Flight, Train & Transit Connections
            </h4>
          </div>
          <span className="text-[11px] text-[#7D9387]">Direct & connecting options</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {transports.map(tr => {
            const Icon = tr.type === 'flight' ? Plane : tr.type === 'train' ? Train : Bus;
            return (
              <div
                key={tr.id}
                className="p-4 rounded-3xl bg-[#0F1A15] border border-[#1E352B] shadow-sm flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#0A110E] text-[#F59E0B] flex items-center justify-center shrink-0 border border-[#1E352B]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#F3F6F4]">{tr.provider}</span>
                      <span className="text-[9px] font-semibold uppercase px-1.5 py-0.2 bg-[#0A110E] text-[#7D9387] rounded border border-[#1A2E24]">
                        {tr.type}
                      </span>
                    </div>
                    <div className="text-xs text-[#D8E4DE] font-medium mt-0.5">{tr.route}</div>
                    <div className="text-[11px] text-[#7D9387] mt-0.5">
                      {tr.departureTime} → {tr.arrivalTime} · {tr.duration}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-[#FBBF24]">
                    ₹{tr.estimatedPrice.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-[#6B7E75] mb-1">per person</div>
                  <a
                    href={tr.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#F59E0B] hover:underline"
                  >
                    <span>View Booking</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
