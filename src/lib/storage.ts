// Multi-tenant localStorage utilities for the food ordering SaaS

export interface StorefrontSettings {
  template: 'modern' | 'classic' | 'minimal';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  logo?: string;
  banner?: string;
  heroText?: string;
  heroSubtext?: string;
  aboutUs?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  trialPeriod: number; // days
  features: string[];
  limits?: {
    maxProducts: number;
    maxDiscountCodes: number;
    loyaltyProgramAccess: boolean;
  };
  createdAt: string;
}

export interface VendorSubscription {
  id: string;
  vendorId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial' | 'pending_payment';
  startDate: string;
  endDate: string;
  paymentMethod: 'paypal' | 'manual_payment';
  paymentProof?: string;
  paypalTransactionId?: string;
  autoRenew: boolean;
  createdAt: string;
}

export interface Admin {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin';
  createdAt: string;
}

export interface Vendor {
  id: string;
  email: string;
  name: string;
  storeName: string;
  slug: string; // for subdomain simulation
  description?: string;
  logo?: string;
  status: 'pending' | 'approved' | 'suspended' | 'rejected';
  subscriptionId?: string;
  storefront: StorefrontSettings;
  createdAt: string;
}

export interface Customer {
  id: string;
  email: string;
  name: string;
  phone?: string;
  vendorId: string; // tenant isolation
  loyaltyPoints: number;
  marketingPreferences: {
    emailMarketing: boolean;
    pushNotifications: boolean;
    smsMarketing: boolean;
  };
  createdAt: string;
}

export interface MenuVariation {
  id: string;
  name: string;
  price: number;
}

export interface MenuAddOn {
  id: string;
  name: string;
  price: number;
  required?: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  order: number;
  vendorId: string;
  createdAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
  variations?: MenuVariation[];
  addOns?: MenuAddOn[];
  vendorId: string;
  createdAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  vendorId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  orderType: 'delivery' | 'pickup';
  paymentMethod: 'pay_on_delivery' | 'proof_of_payment';
  paymentProof?: string; // base64 image data
  customerInfo: {
    name: string;
    phone: string;
    address?: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  selectedVariation?: MenuVariation;
  selectedAddOns?: MenuAddOn[];
}

export interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue?: number;
  maxUses?: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
  vendorId: string;
  createdAt: string;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'email' | 'push';
  vendorId: string;
  createdAt: string;
}

export interface LoyaltySettings {
  id: string;
  vendorId: string;
  pointsPerPeso: number; // Points earned per peso spent
  redemptionRules: {
    pointsRequired: number;
    discountAmount: number;
    maxRedemption?: number; // Maximum discount per order
  }[];
  isActive: boolean;
  createdAt: string;
}

export interface EmailCampaign {
  id: string;
  vendorId: string;
  name: string;
  subject: string;
  content: string;
  targetAudience: 'all' | 'loyal' | 'recent' | 'inactive';
  scheduledFor?: string;
  sentAt?: string;
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled';
  recipients: string[]; // customer IDs
  openRate?: number;
  clickRate?: number;
  createdAt: string;
}

// Storage keys
const VENDORS_KEY = 'foodapp_vendors';
const CUSTOMERS_KEY = 'foodapp_customers';
const MENU_ITEMS_KEY = 'foodapp_menu_items';
const MENU_CATEGORIES_KEY = 'foodapp_menu_categories';
const ORDERS_KEY = 'foodapp_orders';
const SUBSCRIPTION_PLANS_KEY = 'foodapp_subscription_plans';
const VENDOR_SUBSCRIPTIONS_KEY = 'foodapp_vendor_subscriptions';
const ADMINS_KEY = 'foodapp_admins';
const CURRENT_VENDOR_KEY = 'foodapp_current_vendor';
const CURRENT_CUSTOMER_KEY = 'foodapp_current_customer';
const CURRENT_ADMIN_KEY = 'foodapp_current_admin';
const DISCOUNT_CODES_KEY = 'foodapp_discount_codes';
const NOTIFICATION_TEMPLATES_KEY = 'foodapp_notification_templates';

// Vendor operations
export const vendorStorage = {
  getAll(): Vendor[] {
    const vendors = localStorage.getItem(VENDORS_KEY);
    return vendors ? JSON.parse(vendors) : [];
  },

  getById(id: string): Vendor | null {
    const vendors = this.getAll();
    return vendors.find(v => v.id === id) || null;
  },

  getBySlug(slug: string): Vendor | null {
    const vendors = this.getAll();
    return vendors.find(v => v.slug === slug) || null;
  },

  getByEmail(email: string): Vendor | null {
    const vendors = this.getAll();
    return vendors.find(v => v.email === email) || null;
  },

  create(vendor: Omit<Vendor, 'id' | 'createdAt' | 'storefront' | 'status'>): Vendor {
    const vendors = this.getAll();
    const newVendor: Vendor = {
      ...vendor,
      id: Date.now().toString(),
      status: 'pending',
      storefront: {
        template: 'modern',
        colors: {
          primary: '#FF6B35',
          secondary: '#2ECC71',
          accent: '#F39C12'
        },
        heroText: `Welcome to ${vendor.storeName}`,
        heroSubtext: 'Delicious food delivered to your door'
      },
      createdAt: new Date().toISOString(),
    };
    vendors.push(newVendor);
    localStorage.setItem(VENDORS_KEY, JSON.stringify(vendors));
    return newVendor;
  },

  update(id: string, updates: Partial<Vendor>): Vendor | null {
    const vendors = this.getAll();
    const index = vendors.findIndex(v => v.id === id);
    if (index === -1) return null;
    
    vendors[index] = { ...vendors[index], ...updates };
    localStorage.setItem(VENDORS_KEY, JSON.stringify(vendors));
    return vendors[index];
  }
};

// Customer operations (tenant-isolated)
export const customerStorage = {
  getAll(vendorId: string): Customer[] {
    const customers = localStorage.getItem(CUSTOMERS_KEY);
    const allCustomers: Customer[] = customers ? JSON.parse(customers) : [];
    return allCustomers.filter(c => c.vendorId === vendorId);
  },

  getById(id: string, vendorId: string): Customer | null {
    const customers = this.getAll(vendorId);
    return customers.find(c => c.id === id) || null;
  },

  getByEmail(email: string, vendorId: string): Customer | null {
    const customers = this.getAll(vendorId);
    return customers.find(c => c.email === email) || null;
  },

  create(customer: Omit<Customer, 'id' | 'createdAt' | 'loyaltyPoints' | 'marketingPreferences'>, vendorId: string): Customer {
    const allCustomers: Customer[] = JSON.parse(localStorage.getItem(CUSTOMERS_KEY) || '[]');
    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString(),
      vendorId,
      loyaltyPoints: 0,
      marketingPreferences: {
        emailMarketing: true, // Default opt-in
        pushNotifications: true,
        smsMarketing: false,
      },
      createdAt: new Date().toISOString(),
    };
    allCustomers.push(newCustomer);
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(allCustomers));
    return newCustomer;
  },

  update(id: string, updates: Partial<Customer>, vendorId: string): Customer | null {
    const allCustomers: Customer[] = JSON.parse(localStorage.getItem(CUSTOMERS_KEY) || '[]');
    const index = allCustomers.findIndex(c => c.id === id && c.vendorId === vendorId);
    
    if (index === -1) return null;
    
    allCustomers[index] = { ...allCustomers[index], ...updates };
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(allCustomers));
    return allCustomers[index];
  }
};

// Menu operations (tenant-isolated)
export const menuStorage = {
  getAll(vendorId: string): MenuItem[] {
    const items = localStorage.getItem(MENU_ITEMS_KEY);
    const allItems: MenuItem[] = items ? JSON.parse(items) : [];
    return allItems.filter(item => item.vendorId === vendorId);
  },

  getById(id: string, vendorId: string): MenuItem | null {
    const items = this.getAll(vendorId);
    return items.find(item => item.id === id) || null;
  },

  create(item: Omit<MenuItem, 'id' | 'createdAt'>, vendorId: string): MenuItem {
    const allItems: MenuItem[] = JSON.parse(localStorage.getItem(MENU_ITEMS_KEY) || '[]');
    const newItem: MenuItem = {
      ...item,
      id: Date.now().toString(),
      vendorId,
      createdAt: new Date().toISOString(),
    };
    allItems.push(newItem);
    localStorage.setItem(MENU_ITEMS_KEY, JSON.stringify(allItems));
    return newItem;
  },

  update(id: string, updates: Partial<MenuItem>, vendorId: string): MenuItem | null {
    const allItems: MenuItem[] = JSON.parse(localStorage.getItem(MENU_ITEMS_KEY) || '[]');
    const index = allItems.findIndex(item => item.id === id && item.vendorId === vendorId);
    if (index === -1) return null;
    
    allItems[index] = { ...allItems[index], ...updates };
    localStorage.setItem(MENU_ITEMS_KEY, JSON.stringify(allItems));
    return allItems[index];
  },

  delete(id: string, vendorId: string): boolean {
    const allItems: MenuItem[] = JSON.parse(localStorage.getItem(MENU_ITEMS_KEY) || '[]');
    const index = allItems.findIndex(item => item.id === id && item.vendorId === vendorId);
    if (index === -1) return false;
    
    allItems.splice(index, 1);
    localStorage.setItem(MENU_ITEMS_KEY, JSON.stringify(allItems));
    return true;
  }
};

// Order operations (tenant-isolated)
export const orderStorage = {
  getAll(vendorId: string): Order[] {
    const orders = localStorage.getItem(ORDERS_KEY);
    const allOrders: Order[] = orders ? JSON.parse(orders) : [];
    return allOrders.filter(order => order.vendorId === vendorId);
  },

  create(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order {
    const allOrders: Order[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    allOrders.push(newOrder);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders));
    return newOrder;
  },

  update(id: string, updates: Partial<Order>, vendorId: string): Order | null {
    const allOrders: Order[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    const index = allOrders.findIndex(order => order.id === id && order.vendorId === vendorId);
    if (index === -1) return null;
    
    allOrders[index] = { 
      ...allOrders[index], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders));
    return allOrders[index];
  }
};

// Subscription plan operations
export const subscriptionPlanStorage = {
  getAll(): SubscriptionPlan[] {
    const plans = localStorage.getItem(SUBSCRIPTION_PLANS_KEY);
    return plans ? JSON.parse(plans) : [];
  },

  getById(id: string): SubscriptionPlan | null {
    const plans = this.getAll();
    return plans.find(p => p.id === id) || null;
  },

  create(plan: Omit<SubscriptionPlan, 'id' | 'createdAt'>): SubscriptionPlan {
    const plans = this.getAll();
    const newPlan: SubscriptionPlan = {
      ...plan,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    plans.push(newPlan);
    localStorage.setItem(SUBSCRIPTION_PLANS_KEY, JSON.stringify(plans));
    return newPlan;
  },

  update(id: string, updates: Partial<SubscriptionPlan>): SubscriptionPlan | null {
    const plans = this.getAll();
    const index = plans.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    plans[index] = { ...plans[index], ...updates };
    localStorage.setItem(SUBSCRIPTION_PLANS_KEY, JSON.stringify(plans));
    return plans[index];
  },

  delete(id: string): boolean {
    const plans = this.getAll();
    const index = plans.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    plans.splice(index, 1);
    localStorage.setItem(SUBSCRIPTION_PLANS_KEY, JSON.stringify(plans));
    return true;
  }
};

// Vendor subscription operations
export const vendorSubscriptionStorage = {
  getAll(): VendorSubscription[] {
    const subscriptions = localStorage.getItem(VENDOR_SUBSCRIPTIONS_KEY);
    return subscriptions ? JSON.parse(subscriptions) : [];
  },

  getByVendorId(vendorId: string): VendorSubscription | null {
    const subscriptions = this.getAll();
    return subscriptions.find(s => s.vendorId === vendorId) || null;
  },

  create(subscription: Omit<VendorSubscription, 'id' | 'createdAt'>): VendorSubscription {
    const subscriptions = this.getAll();
    const newSubscription: VendorSubscription = {
      ...subscription,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    subscriptions.push(newSubscription);
    localStorage.setItem(VENDOR_SUBSCRIPTIONS_KEY, JSON.stringify(subscriptions));
    return newSubscription;
  },

  update(id: string, updates: Partial<VendorSubscription>): VendorSubscription | null {
    const subscriptions = this.getAll();
    const index = subscriptions.findIndex(s => s.id === id);
    if (index === -1) return null;
    
    subscriptions[index] = { ...subscriptions[index], ...updates };
    localStorage.setItem(VENDOR_SUBSCRIPTIONS_KEY, JSON.stringify(subscriptions));
    return subscriptions[index];
  }
};

// Admin operations
export const adminStorage = {
  getAll(): Admin[] {
    const admins = localStorage.getItem(ADMINS_KEY);
    return admins ? JSON.parse(admins) : [];
  },

  getByEmail(email: string): Admin | null {
    const admins = this.getAll();
    return admins.find(a => a.email === email) || null;
  },

  create(admin: Omit<Admin, 'id' | 'createdAt'>): Admin {
    const admins = this.getAll();
    const newAdmin: Admin = {
      ...admin,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    admins.push(newAdmin);
    localStorage.setItem(ADMINS_KEY, JSON.stringify(admins));
    return newAdmin;
  }
};

// Current session management
export const sessionStorage = {
  setCurrentVendor(vendor: Vendor): void {
    localStorage.setItem(CURRENT_VENDOR_KEY, JSON.stringify(vendor));
  },

  getCurrentVendor(): Vendor | null {
    const vendor = localStorage.getItem(CURRENT_VENDOR_KEY);
    return vendor ? JSON.parse(vendor) : null;
  },

  clearCurrentVendor(): void {
    localStorage.removeItem(CURRENT_VENDOR_KEY);
  },

  setCurrentCustomer(customer: Customer): void {
    localStorage.setItem(CURRENT_CUSTOMER_KEY, JSON.stringify(customer));
  },

  getCurrentCustomer(): Customer | null {
    const customer = localStorage.getItem(CURRENT_CUSTOMER_KEY);
    return customer ? JSON.parse(customer) : null;
  },

  clearCurrentCustomer(): void {
    localStorage.removeItem(CURRENT_CUSTOMER_KEY);
  },

  setCurrentAdmin(admin: Admin): void {
    localStorage.setItem(CURRENT_ADMIN_KEY, JSON.stringify(admin));
  },

  getCurrentAdmin(): Admin | null {
    const admin = localStorage.getItem(CURRENT_ADMIN_KEY);
    return admin ? JSON.parse(admin) : null;
  },

  clearCurrentAdmin(): void {
    localStorage.removeItem(CURRENT_ADMIN_KEY);
  }
};

// Discount code operations (tenant-isolated)
export const discountCodeStorage = {
  getAll(vendorId: string): DiscountCode[] {
    const codes = localStorage.getItem(DISCOUNT_CODES_KEY);
    const allCodes: DiscountCode[] = codes ? JSON.parse(codes) : [];
    return allCodes.filter(code => code.vendorId === vendorId);
  },

  getByCode(code: string, vendorId: string): DiscountCode | null {
    const codes = this.getAll(vendorId);
    return codes.find(c => c.code === code && c.isActive) || null;
  },

  create(code: Omit<DiscountCode, 'id' | 'createdAt' | 'usedCount'>, vendorId: string): DiscountCode {
    const allCodes: DiscountCode[] = JSON.parse(localStorage.getItem(DISCOUNT_CODES_KEY) || '[]');
    const newCode: DiscountCode = {
      ...code,
      id: Date.now().toString(),
      vendorId,
      usedCount: 0,
      createdAt: new Date().toISOString(),
    };
    allCodes.push(newCode);
    localStorage.setItem(DISCOUNT_CODES_KEY, JSON.stringify(allCodes));
    return newCode;
  },

  update(id: string, updates: Partial<DiscountCode>, vendorId: string): DiscountCode | null {
    const allCodes: DiscountCode[] = JSON.parse(localStorage.getItem(DISCOUNT_CODES_KEY) || '[]');
    const index = allCodes.findIndex(code => code.id === id && code.vendorId === vendorId);
    if (index === -1) return null;
    
    allCodes[index] = { ...allCodes[index], ...updates };
    localStorage.setItem(DISCOUNT_CODES_KEY, JSON.stringify(allCodes));
    return allCodes[index];
  },

  delete(id: string, vendorId: string): boolean {
    const allCodes: DiscountCode[] = JSON.parse(localStorage.getItem(DISCOUNT_CODES_KEY) || '[]');
    const index = allCodes.findIndex(code => code.id === id && code.vendorId === vendorId);
    if (index === -1) return false;
    
    allCodes.splice(index, 1);
    localStorage.setItem(DISCOUNT_CODES_KEY, JSON.stringify(allCodes));
    return true;
  },

  incrementUsage(id: string, vendorId: string): boolean {
    const allCodes: DiscountCode[] = JSON.parse(localStorage.getItem(DISCOUNT_CODES_KEY) || '[]');
    const index = allCodes.findIndex(code => code.id === id && code.vendorId === vendorId);
    if (index === -1) return false;
    
    allCodes[index].usedCount += 1;
    localStorage.setItem(DISCOUNT_CODES_KEY, JSON.stringify(allCodes));
    return true;
  }
};

// Notification template operations (tenant-isolated)
export const notificationTemplateStorage = {
  getAll(vendorId: string): NotificationTemplate[] {
    const templates = localStorage.getItem(NOTIFICATION_TEMPLATES_KEY);
    const allTemplates: NotificationTemplate[] = templates ? JSON.parse(templates) : [];
    return allTemplates.filter(template => template.vendorId === vendorId);
  },

  create(template: Omit<NotificationTemplate, 'id' | 'createdAt'>, vendorId: string): NotificationTemplate {
    const allTemplates: NotificationTemplate[] = JSON.parse(localStorage.getItem(NOTIFICATION_TEMPLATES_KEY) || '[]');
    const newTemplate: NotificationTemplate = {
      ...template,
      id: Date.now().toString(),
      vendorId,
      createdAt: new Date().toISOString(),
    };
    allTemplates.push(newTemplate);
    localStorage.setItem(NOTIFICATION_TEMPLATES_KEY, JSON.stringify(allTemplates));
    return newTemplate;
  },

  update(id: string, updates: Partial<NotificationTemplate>, vendorId: string): NotificationTemplate | null {
    const allTemplates: NotificationTemplate[] = JSON.parse(localStorage.getItem(NOTIFICATION_TEMPLATES_KEY) || '[]');
    const index = allTemplates.findIndex(template => template.id === id && template.vendorId === vendorId);
    if (index === -1) return null;
    
    allTemplates[index] = { ...allTemplates[index], ...updates };
    localStorage.setItem(NOTIFICATION_TEMPLATES_KEY, JSON.stringify(allTemplates));
    return allTemplates[index];
  },

  delete(id: string, vendorId: string): boolean {
    const allTemplates: NotificationTemplate[] = JSON.parse(localStorage.getItem(NOTIFICATION_TEMPLATES_KEY) || '[]');
    const index = allTemplates.findIndex(template => template.id === id && template.vendorId === vendorId);
    if (index === -1) return false;
    
    allTemplates.splice(index, 1);
    localStorage.setItem(NOTIFICATION_TEMPLATES_KEY, JSON.stringify(allTemplates));
    return true;
  }
};

export const loyaltyStorage = {
  getKey: (vendorId: string) => `loyalty_${vendorId}`,
  
  get: (vendorId: string): LoyaltySettings | null => {
    const key = loyaltyStorage.getKey(vendorId);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },

  create: (data: Omit<LoyaltySettings, 'id' | 'createdAt'>, vendorId: string): LoyaltySettings => {
    const settings: LoyaltySettings = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(loyaltyStorage.getKey(vendorId), JSON.stringify(settings));
    return settings;
  },

  update: (data: Partial<LoyaltySettings>, vendorId: string): LoyaltySettings | null => {
    const existing = loyaltyStorage.get(vendorId);
    if (!existing) return null;

    const updated = { ...existing, ...data };
    localStorage.setItem(loyaltyStorage.getKey(vendorId), JSON.stringify(updated));
    return updated;
  },

  delete: (vendorId: string): boolean => {
    localStorage.removeItem(loyaltyStorage.getKey(vendorId));
    return true;
  },
};

export const emailCampaignStorage = {
  getKey: (vendorId: string) => `email_campaigns_${vendorId}`,
  
  getAll: (vendorId: string): EmailCampaign[] => {
    const key = emailCampaignStorage.getKey(vendorId);
    return JSON.parse(localStorage.getItem(key) || '[]');
  },

  create: (data: Omit<EmailCampaign, 'id' | 'createdAt'>, vendorId: string): EmailCampaign => {
    const campaign: EmailCampaign = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
    };

    const campaigns = emailCampaignStorage.getAll(vendorId);
    campaigns.push(campaign);
    localStorage.setItem(emailCampaignStorage.getKey(vendorId), JSON.stringify(campaigns));
    return campaign;
  },

  update: (id: string, data: Partial<EmailCampaign>, vendorId: string): EmailCampaign | null => {
    const campaigns = emailCampaignStorage.getAll(vendorId);
    const index = campaigns.findIndex(c => c.id === id);
    
    if (index === -1) return null;

    campaigns[index] = { ...campaigns[index], ...data };
    localStorage.setItem(emailCampaignStorage.getKey(vendorId), JSON.stringify(campaigns));
    return campaigns[index];
  },

  delete: (id: string, vendorId: string): boolean => {
    const campaigns = emailCampaignStorage.getAll(vendorId);
    const filteredCampaigns = campaigns.filter(c => c.id !== id);
    
    if (filteredCampaigns.length === campaigns.length) return false;

    localStorage.setItem(emailCampaignStorage.getKey(vendorId), JSON.stringify(filteredCampaigns));
    return true;
  },
};

// Menu category operations (tenant-isolated)
export const categoryStorage = {
  getAll(vendorId: string): MenuCategory[] {
    const categories = localStorage.getItem(MENU_CATEGORIES_KEY);
    const allCategories: MenuCategory[] = categories ? JSON.parse(categories) : [];
    return allCategories.filter(category => category.vendorId === vendorId)
      .sort((a, b) => a.order - b.order);
  },

  getById(id: string, vendorId: string): MenuCategory | null {
    const categories = this.getAll(vendorId);
    return categories.find(category => category.id === id) || null;
  },

  create(category: Omit<MenuCategory, 'id' | 'createdAt'>, vendorId: string): MenuCategory {
    const allCategories: MenuCategory[] = JSON.parse(localStorage.getItem(MENU_CATEGORIES_KEY) || '[]');
    const newCategory: MenuCategory = {
      ...category,
      id: Date.now().toString(),
      vendorId,
      createdAt: new Date().toISOString(),
    };
    allCategories.push(newCategory);
    localStorage.setItem(MENU_CATEGORIES_KEY, JSON.stringify(allCategories));
    return newCategory;
  },

  update(id: string, updates: Partial<MenuCategory>, vendorId: string): MenuCategory | null {
    const allCategories: MenuCategory[] = JSON.parse(localStorage.getItem(MENU_CATEGORIES_KEY) || '[]');
    const index = allCategories.findIndex(category => category.id === id && category.vendorId === vendorId);
    if (index === -1) return null;
    
    allCategories[index] = { ...allCategories[index], ...updates };
    localStorage.setItem(MENU_CATEGORIES_KEY, JSON.stringify(allCategories));
    return allCategories[index];
  },

  delete(id: string, vendorId: string): boolean {
    const allCategories: MenuCategory[] = JSON.parse(localStorage.getItem(MENU_CATEGORIES_KEY) || '[]');
    const index = allCategories.findIndex(category => category.id === id && category.vendorId === vendorId);
    if (index === -1) return false;
    
    allCategories.splice(index, 1);
    localStorage.setItem(MENU_CATEGORIES_KEY, JSON.stringify(allCategories));
    return true;
  },

  reorder(vendorId: string, categoryIds: string[]): boolean {
    const allCategories: MenuCategory[] = JSON.parse(localStorage.getItem(MENU_CATEGORIES_KEY) || '[]');
    
    categoryIds.forEach((id, index) => {
      const categoryIndex = allCategories.findIndex(category => category.id === id && category.vendorId === vendorId);
      if (categoryIndex !== -1) {
        allCategories[categoryIndex].order = index;
      }
    });
    
    localStorage.setItem(MENU_CATEGORIES_KEY, JSON.stringify(allCategories));
    return true;
  }
};