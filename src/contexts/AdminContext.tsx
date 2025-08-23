import React, { createContext, useContext, useEffect, useState } from 'react';
import { Admin, adminStorage, sessionStorage } from '../lib/storage';

interface AdminContextType {
  admin: Admin | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentAdmin = sessionStorage.getCurrentAdmin();
    setAdmin(currentAdmin);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Default admin credentials
    if (email === 'admin@foodsaas.com' && password === 'admin123') {
      let adminUser = adminStorage.getByEmail(email);
      if (!adminUser) {
        adminUser = adminStorage.create({
          email,
          name: 'Super Admin',
          role: 'super_admin'
        });
      }
      
      setAdmin(adminUser);
      sessionStorage.setCurrentAdmin(adminUser);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setAdmin(null);
    sessionStorage.clearCurrentAdmin();
  };

  return (
    <AdminContext.Provider value={{ admin, login, logout, isLoading }}>
      {children}
    </AdminContext.Provider>
  );
};