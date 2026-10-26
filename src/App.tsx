/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { TripProvider, useTrip } from './context/TripContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { QuestionnaireModal } from './components/QuestionnaireModal';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { PlannerPage } from './pages/PlannerPage';
import { HiddenGemsPage } from './pages/HiddenGemsPage';
import { CommunityPage } from './pages/CommunityPage';
import { DashboardPage } from './pages/DashboardPage';
import { TripItinerary } from './types/travel';

function AppContent() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [plannerDestination, setPlannerDestination] = useState<string>('Udaipur');
  const { setActiveTrip } = useTrip();

  const handleOpenPlannerWithDestination = (destName: string) => {
    setPlannerDestination(destName);
    setCurrentTab('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenTripInPlanner = (trip: TripItinerary) => {
    setActiveTrip(trip);
    setPlannerDestination(trip.destination);
    setCurrentTab('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A2520]">
      {/* Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenPlanner={(dest) => {
          if (dest) setPlannerDestination(dest);
          setCurrentTab('planner');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Pages */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            setCurrentTab={setCurrentTab}
            onOpenPlannerWithDestination={handleOpenPlannerWithDestination}
          />
        )}

        {currentTab === 'explore' && (
          <ExplorePage
            onOpenPlannerWithDestination={handleOpenPlannerWithDestination}
          />
        )}

        {currentTab === 'planner' && (
          <PlannerPage
            initialDestination={plannerDestination}
            onOpenGems={() => setCurrentTab('gems')}
          />
        )}

        {currentTab === 'gems' && (
          <HiddenGemsPage
            onOpenPlannerWithDestination={handleOpenPlannerWithDestination}
          />
        )}

        {currentTab === 'community' && (
          <CommunityPage />
        )}

        {currentTab === 'dashboard' && (
          <DashboardPage
            onOpenTripInPlanner={handleOpenTripInPlanner}
            onOpenPlannerWithDestination={handleOpenPlannerWithDestination}
            setCurrentTab={setCurrentTab}
          />
        )}
      </main>

      {/* Footer */}
      <Footer setCurrentTab={setCurrentTab} />

      {/* Global Modals */}
      <AuthModal />
      <QuestionnaireModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TripProvider>
        <AppContent />
      </TripProvider>
    </AuthProvider>
  );
}
