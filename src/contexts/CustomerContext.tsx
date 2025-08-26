import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Customer, customerStorage, sessionStorage } from '@/lib/storage';

interface CustomerContextType {
  customer: Customer | null;
  login: (email: string, password: string, vendorId: string) => Promise<boolean>;
  register: (data: { email: string; password: string; name: string; phone?: string }, vendorId: string) => Promise<boolean>;
  logout: () => void;
  refreshCustomer: (vendorId: string) => void;
  isLoading: boolean;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
};

interface CustomerProviderProps {
  children: ReactNode;
}

// Simple password storage (in production, use proper hashing)
const CUSTOMER_PASSWORDS_KEY = 'foodapp_customer_passwords';

const getStoredPassword = (email: string, vendorId: string): string | null => {
  const passwords = JSON.parse(localStorage.getItem(CUSTOMER_PASSWORDS_KEY) || '{}');
  const key = `${email}_${vendorId}`;
  return passwords[key] || null;
};

const storePassword = (email: string, password: string, vendorId: string): void => {
  const passwords = JSON.parse(localStorage.getItem(CUSTOMER_PASSWORDS_KEY) || '{}');
  const key = `${email}_${vendorId}`;
  passwords[key] = password;
  localStorage.setItem(CUSTOMER_PASSWORDS_KEY, JSON.stringify(passwords));
};

export const CustomerProvider: React.FC<CustomerProviderProps> = ({ children }) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const currentCustomer = sessionStorage.getCurrentCustomer();
    if (currentCustomer) {
      setCustomer(currentCustomer);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, vendorId: string): Promise<boolean> => {
    try {
      const storedPassword = getStoredPassword(email, vendorId);
      if (!storedPassword || storedPassword !== password) {
        return false;
      }

      const existingCustomer = customerStorage.getByEmail(email, vendorId);
      if (!existingCustomer) {
        return false;
      }

      setCustomer(existingCustomer);
      sessionStorage.setCurrentCustomer(existingCustomer);
      return true;
    } catch (error) {
      console.error('Customer login error:', error);
      return false;
    }
  };

  const register = async (data: { 
    email: string; 
    password: string; 
    name: string; 
    phone?: string;
  }, vendorId: string): Promise<boolean> => {
    try {
      // Check if customer already exists for this vendor
      const existingCustomer = customerStorage.getByEmail(data.email, vendorId);
      if (existingCustomer) {
        return false;
      }

      // Store password
      storePassword(data.email, data.password, vendorId);

      // Create customer
      const newCustomer = customerStorage.create({
        email: data.email,
        name: data.name,
        phone: data.phone,
        vendorId,
      }, vendorId);

      setCustomer(newCustomer);
      sessionStorage.setCurrentCustomer(newCustomer);
      return true;
    } catch (error) {
      console.error('Customer registration error:', error);
      return false;
    }
  };

  const logout = (): void => {
    setCustomer(null);
    sessionStorage.clearCurrentCustomer();
  };

  const refreshCustomer = (vendorId: string): void => {
    if (customer) {
      const updatedCustomer = customerStorage.getById(customer.id, vendorId);
      if (updatedCustomer) {
        setCustomer(updatedCustomer);
        sessionStorage.setCurrentCustomer(updatedCustomer);
      }
    }
  };

  return (
    <CustomerContext.Provider
      value={{
        customer,
        login,
        register,
        logout,
        refreshCustomer,
        isLoading,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};