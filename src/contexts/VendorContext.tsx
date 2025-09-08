import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Vendor, vendorStorage, sessionStorage } from '@/lib/storage';

interface VendorContextType {
  vendor: Vendor | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { email: string; password: string; name: string; storeName: string }) => Promise<boolean>;
  logout: () => void;
  updateVendor: (updates: Partial<Vendor>) => Promise<boolean>;
  isLoading: boolean;
}

const VendorContext = createContext<VendorContextType | undefined>(undefined);

export const useVendor = () => {
  const context = useContext(VendorContext);
  if (!context) {
    throw new Error('useVendor must be used within a VendorProvider');
  }
  return context;
};

interface VendorProviderProps {
  children: ReactNode;
}

// Simple password storage (in production, use proper hashing)
const VENDOR_PASSWORDS_KEY = 'foodapp_vendor_passwords';

const getStoredPassword = (email: string): string | null => {
  const passwords = JSON.parse(localStorage.getItem(VENDOR_PASSWORDS_KEY) || '{}');
  return passwords[email] || null;
};

const storePassword = (email: string, password: string): void => {
  const passwords = JSON.parse(localStorage.getItem(VENDOR_PASSWORDS_KEY) || '{}');
  passwords[email] = password;
  localStorage.setItem(VENDOR_PASSWORDS_KEY, JSON.stringify(passwords));
};

export const VendorProvider: React.FC<VendorProviderProps> = ({ children }) => {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const currentVendor = sessionStorage.getCurrentVendor();
    if (currentVendor) {
      setVendor(currentVendor);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const storedPassword = getStoredPassword(email);
      if (!storedPassword || storedPassword !== password) {
        return false;
      }

      const existingVendor = vendorStorage.getByEmail(email);
      if (!existingVendor) {
        return false;
      }

      setVendor(existingVendor);
      sessionStorage.setCurrentVendor(existingVendor);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (data: { 
    email: string; 
    password: string; 
    name: string; 
    storeName: string; 
  }): Promise<boolean> => {
    try {
      // Check if vendor already exists
      const existingVendor = vendorStorage.getByEmail(data.email);
      if (existingVendor) {
        return false;
      }

      // Create slug from store name
      const slug = data.storeName.toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      // Check if slug is taken
      const existingSlug = vendorStorage.getBySlug(slug);
      if (existingSlug) {
        return false;
      }

      // Store password
      storePassword(data.email, data.password);

      // Create vendor
      const newVendor = vendorStorage.create({
        email: data.email,
        name: data.name,
        storeName: data.storeName,
        slug,
      });

      setVendor(newVendor);
      sessionStorage.setCurrentVendor(newVendor);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = (): void => {
    setVendor(null);
    sessionStorage.clearCurrentVendor();
  };

  const updateVendor = async (updates: Partial<Vendor>): Promise<boolean> => {
    if (!vendor) return false;

    try {
      const updatedVendor = vendorStorage.update(vendor.id, updates);
      if (!updatedVendor) return false;

      setVendor(updatedVendor);
      sessionStorage.setCurrentVendor(updatedVendor);
      return true;
    } catch (error) {
      console.error('Update vendor error:', error);
      return false;
    }
  };

  return (
    <VendorContext.Provider
      value={{
        vendor,
        login,
        register,
        logout,
        updateVendor,
        isLoading,
      }}
    >
      {children}
    </VendorContext.Provider>
  );
};