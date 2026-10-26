import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTrip } from '../context/TripContext';
import { TRAVELLER_MODES } from '../data/travelData';
import {
  Compass,
  MapPin,
  Calendar,
  Sparkles,
  Users,
  Heart,
  User as UserIcon,
  Menu,
  X,
  LogOut,
  SlidersHorizontal,
  ChevronDown,
  BookmarkCheck
} from 'lucide-react';
import { TravellerModeType } from '../types/travel';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenPlanner: (prefilledDestination?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onOpenPlanner }) => {
  const { user, isAuthenticated, logout, openAuthModal, openQuestionnaire, switchTravellerMode } = useAuth();
  const { savedTrips } = useTrip();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [modeDropdownOpen, setModeDropdownOpen] = useState(false);

  const activeMode = user?.preferences?.preferredMode || 'solo';
  const activeModeConfig = TRAVELLER_MODES.find(m => m.id === activeMode) || TRAVELLER_MODES[0];

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'explore', label: 'Explore Destinations' },
    { id: 'planner', label: 'AI Trip Planner', badge: 'AI' },
    { id: 'gems', label: 'Hidden Gems' },
    { id: 'community', label: 'Community' },
    { id: 'dashboard', label: 'My Trips', count: savedTrips.length }
  ];

  const handleLinkClick = (id: string) => {
    setCurrentTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0A110E]/90 backdrop-blur-xl border-b border-[#1A2C24]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#1B3528] to-[#0E1E17] text-[#FBBF24] flex items-center justify-center shadow-lg border border-[#2B4B3B] group-hover:border-[#D97706]/70 transition-all relative">
              <Compass className="w-6 h-6 stroke-[2.2] animate-[spin_16s_linear_infinite]" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#F59E0B] rounded-full ring-2 ring-[#0A110E] shadow-[0_0_8px_#F59E0B]" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl font-bold tracking-tight text-[#F3F6F4] group-hover:text-white transition-colors">
                  Musafir
                </span>
                <span className="text-xs font-semibold tracking-wider text-[#F59E0B]">
                  मुसाफ़िर
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-[#7D9387] hidden sm:block">
                Har Safar, Aapke Andaaz Mein
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map(link => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`px-3.5 py-2 text-xs font-medium rounded-xl transition-all relative flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[#FBBF24] font-semibold bg-[#14231D] border border-[#233D31]'
                      : 'text-[#9EAEA6] hover:text-[#F3F6F4] hover:bg-[#121E19]'
                  }`}
                >
                  {link.label}
                  {link.badge && (
                    <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-md bg-[#D97706] text-white">
                      {link.badge}
                    </span>
                  )}
                  {link.count !== undefined && link.count > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#1F3A2E] text-[#F3F6F4] text-[10px] flex items-center justify-center font-bold border border-[#2F5443]">
                      {link.count}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-1 left-3.5 right-3.5 h-0.5 bg-[#F59E0B] rounded-full shadow-[0_0_6px_#F59E0B]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Area: Mode Switcher & User Profile */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Active Mode Quick Switcher */}
            <div className="relative">
              <button
                onClick={() => setModeDropdownOpen(!modeDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-xl border border-[#22392E] bg-[#111D18] hover:bg-[#172720] text-[#D8E4DE] transition-colors"
                title="Current Traveller Mode"
              >
                <span className="w-2 h-2 rounded-full bg-[#F59E0B] shadow-[0_0_6px_#F59E0B]" />
                <span className="capitalize">{activeModeConfig.title}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#7D9387]" />
              </button>

              {modeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#101B16] rounded-2xl shadow-2xl border border-[#22392E] p-2 z-50 animate-in fade-in duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#7D9387] border-b border-[#1A2C24] mb-1">
                    Select Your Travel Mode
                  </div>
                  {TRAVELLER_MODES.map(mode => (
                    <button
                      key={mode.id}
                      onClick={() => {
                        switchTravellerMode(mode.id as TravellerModeType);
                        setModeDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        activeMode === mode.id
                          ? 'bg-[#1C3227] text-white font-medium border border-[#2E5240]'
                          : 'text-[#9EAEA6] hover:bg-[#14231D] hover:text-[#F3F6F4]'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-[#F3F6F4]">{mode.title}</div>
                        <div className="text-[10px] text-[#7D9387]">
                          {mode.hindiTitle}
                        </div>
                      </div>
                      {activeMode === mode.id && <BookmarkCheck className="w-4 h-4 text-[#F59E0B]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* AI Trip Planner Quick CTA */}
            <button
              onClick={() => onOpenPlanner()}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#D97706] to-[#B45309] text-white hover:brightness-110 shadow-lg shadow-[#D97706]/20 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Plan My Trip</span>
            </button>

            {/* Authentication / Profile Menu */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#14231D] transition-colors border border-transparent hover:border-[#22392E]"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-[#2F5443]"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-[#7D9387]" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-[#101B16] rounded-2xl shadow-2xl border border-[#22392E] p-2 z-50">
                    <div className="px-3 py-2 border-b border-[#1A2C24]">
                      <div className="font-semibold text-xs text-[#F3F6F4]">{user.fullName}</div>
                      <div className="text-[11px] text-[#7D9387] truncate">{user.email}</div>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          openQuestionnaire();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-[#9EAEA6] hover:bg-[#14231D] hover:text-[#F3F6F4] rounded-xl flex items-center gap-2"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 text-[#F59E0B]" />
                        <span>Travel Preferences Quiz</span>
                      </button>
                      <button
                        onClick={() => {
                          setCurrentTab('dashboard');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-[#9EAEA6] hover:bg-[#14231D] hover:text-[#F3F6F4] rounded-xl flex items-center gap-2"
                      >
                        <BookmarkCheck className="w-3.5 h-3.5 text-[#10B981]" />
                        <span>My Saved Trips & Gems</span>
                      </button>
                    </div>
                    <div className="pt-1 border-t border-[#1A2C24]">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/40 rounded-xl flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3 py-1.5 text-xs font-medium text-[#D8E4DE] hover:text-white hover:bg-[#14231D] rounded-xl transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#1B362A] hover:bg-[#254939] border border-[#2E5442] rounded-xl shadow-sm transition-colors"
                >
                  Join Musafir
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => onOpenPlanner()}
              className="p-2 rounded-xl bg-gradient-to-r from-[#D97706] to-[#B45309] text-white"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#D8E4DE] hover:bg-[#14231D]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#1A2C24] bg-[#0A110E] px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1A2C24]">
            <span className="text-xs font-semibold text-[#7D9387] uppercase tracking-wider">
              Mode: {activeModeConfig.title}
            </span>
            <button
              onClick={() => {
                openQuestionnaire();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-[#F59E0B] font-medium"
            >
              Change Preferences
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`px-3 py-2 text-left text-xs font-medium rounded-xl border ${
                  currentTab === link.id
                    ? 'bg-[#14231D] text-[#FBBF24] border-[#2E5240]'
                    : 'bg-[#101B16] text-[#9EAEA6] border-[#1E3328]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-[#1A2C24]">
            {isAuthenticated && user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-xs font-semibold text-[#F3F6F4]">{user.fullName}</div>
                    <div className="text-[11px] text-[#7D9387]">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-400 font-medium px-2 py-1 rounded bg-rose-950/40"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    openAuthModal('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-xs font-medium border border-[#22392E] rounded-xl text-[#D8E4DE]"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    openAuthModal('register');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-xs font-semibold bg-[#1C362A] text-white rounded-xl"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
