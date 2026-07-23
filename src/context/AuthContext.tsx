import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, Partner } from '../types';
import { INITIAL_PARTNERS } from '../data/initialData';

interface AuthContextType {
  currentUser: UserProfile;
  activePartner: Partner;
  partners: Partner[];
  switchUserRole: (partnerId: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  verify2FAPin: (pin: string) => boolean;
  enable2FA: (pin: string) => void;
  disable2FA: () => void;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [partners, setPartners] = useState<Partner[]>(INITIAL_PARTNERS);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('p-1');
  const [pinSecret, setPinSecret] = useState<string>('1234');
  const [is2FAVerified, setIs2FAVerified] = useState<boolean>(true);
  const [is2FAEnabled, setIs2FAEnabled] = useState<boolean>(true);

  // Dark Mode state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('beyond_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('beyond_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('beyond_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const activePartner = partners.find((p) => p.id === selectedPartnerId) || partners[0];

  const currentUser: UserProfile = {
    uid: activePartner.id,
    email: activePartner.email,
    displayName: activePartner.name,
    role: activePartner.role,
    partnerId: activePartner.id,
    twoFactorEnabled: is2FAEnabled,
    twoFactorVerified: is2FAVerified,
  };

  const switchUserRole = (partnerId: string) => {
    setSelectedPartnerId(partnerId);
  };

  const verify2FAPin = (pin: string) => {
    if (pin === pinSecret) {
      setIs2FAVerified(true);
      return true;
    }
    return false;
  };

  const enable2FA = (pin: string) => {
    setPinSecret(pin);
    setIs2FAEnabled(true);
    setIs2FAVerified(true);
  };

  const disable2FA = () => {
    setIs2FAEnabled(false);
  };

  const hasPermission = (requiredRoles: UserRole[]) => {
    return requiredRoles.includes(currentUser.role);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activePartner,
        partners,
        switchUserRole,
        isDarkMode,
        toggleDarkMode,
        verify2FAPin,
        enable2FA,
        disable2FA,
        hasPermission,
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
