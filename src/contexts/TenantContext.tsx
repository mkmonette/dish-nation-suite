import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Vendor, vendorStorage } from '@/lib/storage';

interface TenantContextType {
  currentTenant: Vendor | null;
  setTenant: (vendorSlug: string) => boolean;
  clearTenant: () => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [currentTenant, setCurrentTenant] = useState<Vendor | null>(null);

  const setTenant = (vendorSlug: string): boolean => {
    const vendor = vendorStorage.getBySlug(vendorSlug);
    if (!vendor) {
      return false;
    }
    setCurrentTenant(vendor);
    return true;
  };

  const clearTenant = (): void => {
    setCurrentTenant(null);
  };

  return (
    <TenantContext.Provider
      value={{
        currentTenant,
        setTenant,
        clearTenant,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};