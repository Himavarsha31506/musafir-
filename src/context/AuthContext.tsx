import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserPreferences, TravellerModeType } from '../types/travel';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  register: (fullName: string, email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updatePreferences: (newPrefs: Partial<UserPreferences>) => void;
  switchTravellerMode: (mode: TravellerModeType) => void;
  loginDemoUser: () => void;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  isQuestionnaireOpen: boolean;
  openQuestionnaire: () => void;
  closeQuestionnaire: () => void;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  interests: ['culture', 'nature', 'food', 'photography'],
  preferredDestinations: ['mountains', 'heritage'],
  budgetTier: 'moderate',
  preferredDuration: 'week',
  accommodationType: 'Boutique Homestay & Heritage',
  travelPace: 'balanced',
  favoriteActivities: ['Heritage walking tours', 'Scenic viewpoints', 'Local food trails'],
  specialRequirements: [],
  preferredMode: 'solo',
  hasCompletedQuestionnaire: false
};

const DEMO_USER: User = {
  id: 'usr_demo_108',
  fullName: 'Kabir Verma',
  email: 'kabir.musafir@example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  preferences: {
    ...DEFAULT_PREFERENCES,
    hasCompletedQuestionnaire: true,
    preferredMode: 'solo'
  },
  createdAt: '2026-01-15'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('musafir_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEMO_USER; // Default logged in as demo user so users can immediately test all features!
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('musafir_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('musafir_user');
    }
  }, [user]);

  const login = async (email: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    if (!email || !pass) {
      return { success: false, message: 'Please enter both email and password' };
    }
    if (pass.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters' };
    }

    // Check stored users or authenticate
    const existingUsersRaw = localStorage.getItem('musafir_registered_accounts');
    const existingUsers: Record<string, { pass: string; user: User }> = existingUsersRaw ? JSON.parse(existingUsersRaw) : {};

    const account = existingUsers[email.toLowerCase()];
    if (account) {
      if (account.pass !== pass) {
        return { success: false, message: 'Incorrect password. Please try again.' };
      }
      setUser(account.user);
      setIsAuthModalOpen(false);
      return { success: true };
    }

    // For any valid new mock test email:
    const newUser: User = {
      id: `usr_${Date.now()}`,
      fullName: email.split('@')[0].replace('.', ' '),
      email: email.toLowerCase(),
      preferences: { ...DEFAULT_PREFERENCES, hasCompletedQuestionnaire: true },
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const register = async (fullName: string, email: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    if (!fullName || !email || !pass) {
      return { success: false, message: 'All fields are required' };
    }
    if (pass.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters' };
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      fullName,
      email: email.toLowerCase(),
      preferences: { ...DEFAULT_PREFERENCES, hasCompletedQuestionnaire: false },
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Save to accounts
    try {
      const existingUsersRaw = localStorage.getItem('musafir_registered_accounts');
      const existingUsers = existingUsersRaw ? JSON.parse(existingUsersRaw) : {};
      existingUsers[email.toLowerCase()] = { pass, user: newUser };
      localStorage.setItem('musafir_registered_accounts', JSON.stringify(existingUsers));
    } catch {
      // fallback
    }

    setUser(newUser);
    setIsAuthModalOpen(false);
    // Automatically trigger onboarding questionnaire!
    setIsQuestionnaireOpen(true);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const loginDemoUser = () => {
    setUser(DEMO_USER);
    setIsAuthModalOpen(false);
  };

  const updatePreferences = (newPrefs: Partial<UserPreferences>) => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        preferences: {
          ...prev.preferences,
          ...newPrefs
        }
      };
    });
  };

  const switchTravellerMode = (mode: TravellerModeType) => {
    updatePreferences({ preferredMode: mode });
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);
  const openQuestionnaire = () => setIsQuestionnaireOpen(true);
  const closeQuestionnaire = () => setIsQuestionnaireOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updatePreferences,
        switchTravellerMode,
        loginDemoUser,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        isQuestionnaireOpen,
        openQuestionnaire,
        closeQuestionnaire
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
