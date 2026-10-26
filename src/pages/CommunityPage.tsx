import React, { useState } from 'react';
import { COMMUNITY_MEETUPS } from '../data/travelData';
import { SocialMeetup } from '../types/travel';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Compass,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle,
  Plus,
  Sparkles
} from 'lucide-react';

export const CommunityPage: React.FC = () => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [meetups, setMeetups] = useState<SocialMeetup[]>(COMMUNITY_MEETUPS);
  const [joinedMeetups, setJoinedMeetups] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [rsvpNotification, setRsvpNotification] = useState<string | null>(null);

  const filterTypes = [
    { id: 'all', label: 'All Gatherings' },
    { id: 'walking_tour', label: 'Heritage Walks' },
    { id: 'photography_walk', label: 'Photo Walks' },
    { id: 'cooking_workshop', label: 'Culinary Workshops' },
    { id: 'sunset_meetup', label: 'Sunset Circles' }
  ];

  const filteredMeetups = meetups.filter(m => {
    return selectedType === 'all' || m.type === selectedType;
  });

  const handleToggleJoin = (meetup: SocialMeetup) => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    const isJoined = joinedMeetups.includes(meetup.id);
    if (isJoined) {
      setJoinedMeetups(prev => prev.filter(x => x !== meetup.id));
      setMeetups(prev =>
        prev.map(m => m.id === meetup.id ? { ...m, attendeesCount: m.attendeesCount - 1 } : m)
      );
    } else {
      setJoinedMeetups(prev => [...prev, meetup.id]);
      setMeetups(prev =>
        prev.map(m => m.id === meetup.id ? { ...m, attendeesCount: m.attendeesCount + 1 } : m)
      );
      setRsvpNotification(`RSVP confirmed for "${meetup.title}". Safety guidelines sent to your profile!`);
      setTimeout(() => setRsvpNotification(null), 3500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 bg-[#0A110E] text-[#F3F6F4]">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111F18] border border-[#234233] text-[#FBBF24] text-xs font-bold uppercase tracking-wider">
          <Users className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>Social Travellers & Open Circles</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F3F6F4]">
          Wander Together, Safely
        </h1>
        <p className="text-xs sm:text-sm text-[#8A9C93] max-w-xl mx-auto">
          Opt-in heritage walks, sunrise photography groups, and traditional cooking circles. Every event takes place in vetted public spaces with verified community hosts.
        </p>
      </div>

      {rsvpNotification && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-600 text-xs text-emerald-300 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{rsvpNotification}</span>
          </div>
          <button
            onClick={() => setRsvpNotification(null)}
            className="text-xs font-bold text-emerald-300 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="p-5 rounded-3xl bg-[#0F1A15] text-[#FAF7F2] border border-[#1E352B] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[#1C362A] text-[#FBBF24]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#F3F6F4]">Musafir Safe Community Code</h4>
            <p className="text-xs text-[#9EAEA6] mt-0.5 max-w-2xl leading-relaxed">
              All community meetups are held strictly in verified public locations with vetted organizers. Real names and participant reporting guarantee privacy and mutual respect.
            </p>
          </div>
        </div>
        <div className="text-xs text-[#FBBF24] font-semibold whitespace-nowrap px-3 py-1 rounded-full bg-[#1C362A] border border-[#2E5442]">
          Zero Commercial Solicitation
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {filterTypes.map(f => (
          <button
            key={f.id}
            onClick={() => setSelectedType(f.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedType === f.id
                ? 'bg-[#1C362A] text-[#FBBF24] border border-[#2E5442] shadow-sm'
                : 'bg-[#0F1A15] text-[#8A9C93] hover:text-[#F3F6F4] border border-[#1E352B]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMeetups.map(meetup => {
          const isJoined = joinedMeetups.includes(meetup.id);
          const spotsLeft = meetup.maxCapacity - meetup.attendeesCount;

          return (
            <div
              key={meetup.id}
              className="p-6 rounded-3xl bg-[#0F1A15] border border-[#1E352B] shadow-sm hover:shadow-2xl hover:border-[#2E5442] transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                    <span className="text-[10px] font-bold text-[#F59E0B] uppercase tracking-wider">
                      {meetup.destination} · {meetup.type.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#F3F6F4] bg-[#0A110E] px-2.5 py-1 rounded-xl border border-[#1E352B]">
                    {meetup.price === 0 ? 'Free Community Meet' : `₹${meetup.price}/person`}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#F3F6F4]">
                  {meetup.title}
                </h3>

                <p className="text-xs text-[#9EAEA6] leading-relaxed">
                  {meetup.description}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs text-[#D8E4DE] pt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>{meetup.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>{meetup.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2 text-[11px] text-[#7D9387]">
                    <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>{meetup.location}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#0A110E] border border-[#1E352B] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#F3F6F4]">Host: {meetup.hostName}</span>
                    <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-800">
                      ✓ {meetup.hostBadge}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#8A9C93]">
                    🛡️ {meetup.safetyNotice}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#182C23] flex items-center justify-between">
                <div className="text-xs text-[#8A9C93]">
                  <strong className="text-[#F3F6F4]">{meetup.attendeesCount}</strong> attending ·{' '}
                  <span className="text-[#F59E0B] font-medium">{spotsLeft} spots left</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleJoin(meetup)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    isJoined
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700'
                      : 'bg-gradient-to-r from-[#D97706] to-[#B45309] hover:brightness-110 text-white'
                  }`}
                >
                  {isJoined ? '✓ Joined · View Details' : 'RSVP & Join Meetup'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
