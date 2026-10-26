import React from 'react';
import { Compass, Heart, Shield, Award, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  return (
    <footer className="bg-[#070D0B] text-[#9EAEA6] pt-16 pb-12 border-t border-[#162520]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#162520]">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1C362A] to-[#0E1E17] text-[#FBBF24] flex items-center justify-center shadow-lg border border-[#2B4B3B]">
                <Compass className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-[#F3F6F4]">
                  Musafir
                </span>
                <span className="text-xs font-semibold text-[#F59E0B] ml-2">
                  मुसाफ़िर
                </span>
              </div>
            </div>

            <p className="text-xs text-[#8A9C93] leading-relaxed max-w-sm">
              “Har Safar, Aapke Andaaz Mein.” A cinematic AI-powered travel planning and discovery platform crafting mindful, tailored journeys across India and the globe.
            </p>

            <div className="p-3.5 rounded-2xl bg-[#0F1B16] border border-[#1E362C] text-xs text-[#CBD8D1] space-y-1">
              <div className="flex items-center gap-2 font-semibold text-[#FBBF24]">
                <Award className="w-4 h-4 text-[#FBBF24]" />
                <span>Academic & Student Innovation Project</span>
              </div>
              <p className="text-[11px] text-[#7D9387]">
                Demonstration platform highlighting modern AI travel orchestration, personalized recommendations, and responsible community discovery.
              </p>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FBBF24] mb-4">
              Explore Musafir
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => setCurrentTab('home')}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('explore')}
                  className="hover:text-white transition-colors"
                >
                  Destinations Catalog (16+)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('planner')}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>AI Trip Planner</span>
                  <span className="text-[9px] px-1 py-0.2 bg-[#D97706] text-white rounded font-bold">AI</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('gems')}
                  className="hover:text-white transition-colors"
                >
                  Verified Hidden Gems
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('community')}
                  className="hover:text-white transition-colors"
                >
                  Social Travellers & Meetups
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('dashboard')}
                  className="hover:text-white transition-colors"
                >
                  My Saved Trips
                </button>
              </li>
            </ul>
          </div>

          {/* 5 Modes */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FBBF24] mb-4">
              Traveller Modes
            </h4>
            <ul className="space-y-2 text-xs text-[#8A9C93]">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                <span>Solo Travellers (Safe Stays)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                <span>Group Travellers (Splits & Villas)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#818CF8]" />
                <span>Social Travellers (Open Walks)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                <span>Family Travellers (Comfort & Kids)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F43F5E]" />
                <span>Couple Travellers (Romantic Views)</span>
              </li>
            </ul>
          </div>

          {/* Contact & Transparency */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FBBF24] mb-4">
              Transparency & Contact
            </h4>
            <div className="space-y-3 text-xs text-[#8A9C93]">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                <span>External booking providers (IRCTC, IndiGo, Booking.com) redirect to official portals.</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>hello@musafir-travel.internal</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>New Delhi · Jaipur · Bangalore</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B7E75] gap-4">
          <p>© {new Date().getFullYear()} Musafir (मुसाफ़िर). Har Safar, Aapke Andaaz Mein.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer">About Us</span>
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">Community Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
