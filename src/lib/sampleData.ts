import { 
  vendorStorage, 
  customerStorage, 
  menuStorage, 
  orderStorage, 
  subscriptionPlanStorage, 
  vendorSubscriptionStorage, 
  adminStorage,
  sessionStorage 
} from './storage';

export const initializeSampleData = () => {
  // Clear existing data
  localStorage.clear();

  // Create subscription plans
  const basicPlan = subscriptionPlanStorage.create({
    name: 'Basic Plan',
    price: 29.99,
    billingCycle: 'monthly',
    trialPeriod: 7,
    features: [
      'Up to 50 menu items',
      'Basic order management',
      'Email support',
      'Basic analytics'
    ],
    maxMenuItems: 50,
    maxOrders: 100
  });

  const proPlan = subscriptionPlanStorage.create({
    name: 'Pro Plan',
    price: 79.99,
    billingCycle: 'monthly',
    trialPeriod: 14,
    features: [
      'Up to 200 menu items',
      'Advanced order management',
      'Priority support',
      'Advanced analytics',
      'Custom branding',
      'Multiple locations'
    ],
    maxMenuItems: 200,
    maxOrders: 500
  });

  const enterprisePlan = subscriptionPlanStorage.create({
    name: 'Enterprise Plan',
    price: 199.99,
    billingCycle: 'monthly',
    trialPeriod: 30,
    features: [
      'Unlimited menu items',
      'Enterprise order management',
      '24/7 dedicated support',
      'Custom integrations',
      'White-label solution',
      'API access',
      'Advanced reporting'
    ]
  });

  // Create admin user
  const admin = adminStorage.create({
    email: 'admin@foodsaas.com',
    name: 'Super Admin',
    role: 'super_admin'
  });

  // Create sample vendors
  const vendor1 = vendorStorage.create({
    email: 'joe@joespizza.com',
    name: 'Joe Smith',
    storeName: "Joe's Pizza Palace",
    slug: 'joes-pizza',
    description: 'Authentic New York style pizza since 1985'
  });

  const vendor2 = vendorStorage.create({
    email: 'maria@burgermania.com',
    name: 'Maria Rodriguez',
    storeName: 'Burger Mania',
    slug: 'burger-mania',
    description: 'Gourmet burgers and craft fries'
  });

  const vendor3 = vendorStorage.create({
    email: 'chen@sushizen.com',
    name: 'Chen Tanaka',
    storeName: 'Sushi Zen',
    slug: 'sushi-zen',
    description: 'Fresh sushi and Japanese cuisine'
  });

  const vendor4 = vendorStorage.create({
    email: 'ahmed@spicekitchen.com',
    name: 'Ahmed Hassan',
    storeName: 'Spice Kitchen',
    slug: 'spice-kitchen',
    description: 'Authentic Indian and Middle Eastern cuisine'
  });

  // Approve some vendors
  vendorStorage.update(vendor1.id, { status: 'approved' });
  vendorStorage.update(vendor2.id, { status: 'approved' });
  vendorStorage.update(vendor3.id, { status: 'approved' });
  // Leave vendor4 as pending for demo

  // Create subscriptions for approved vendors
  const sub1 = vendorSubscriptionStorage.create({
    vendorId: vendor1.id,
    planId: proPlan.id,
    status: 'active',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    paymentMethod: 'paypal',
    autoRenew: true
  });

  const sub2 = vendorSubscriptionStorage.create({
    vendorId: vendor2.id,
    planId: basicPlan.id,
    status: 'active',
    startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days from now
    paymentMethod: 'proof_of_payment',
    autoRenew: true
  });

  const sub3 = vendorSubscriptionStorage.create({
    vendorId: vendor3.id,
    planId: enterprisePlan.id,
    status: 'active',
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    endDate: new Date(Date.now() + 53 * 24 * 60 * 60 * 1000).toISOString(), // 53 days from now
    paymentMethod: 'paypal',
    autoRenew: true
  });

  // Update vendors with subscription IDs
  vendorStorage.update(vendor1.id, { subscriptionId: sub1.id });
  vendorStorage.update(vendor2.id, { subscriptionId: sub2.id });
  vendorStorage.update(vendor3.id, { subscriptionId: sub3.id });

  // Create sample customers for each vendor
  const customer1 = customerStorage.create({
    email: 'john.doe@email.com',
    name: 'John Doe',
    phone: '+1-555-0101',
    vendorId: vendor1.id
  }, vendor1.id);

  const customer2 = customerStorage.create({
    email: 'jane.smith@email.com',
    name: 'Jane Smith',
    phone: '+1-555-0102',
    vendorId: vendor1.id
  }, vendor1.id);

  const customer3 = customerStorage.create({
    email: 'mike.jones@email.com',
    name: 'Mike Jones',
    phone: '+1-555-0201',
    vendorId: vendor2.id
  }, vendor2.id);

  const customer4 = customerStorage.create({
    email: 'sarah.wilson@email.com',
    name: 'Sarah Wilson',
    phone: '+1-555-0301',
    vendorId: vendor3.id
  }, vendor3.id);

  // Create menu items for Joe's Pizza
  const pizza1 = menuStorage.create({
    name: 'Margherita Pizza',
    description: 'Fresh mozzarella, tomato sauce, and basil',
    price: 16.99,
    category: 'Pizza',
    available: true,
    vendorId: vendor1.id,
    variations: [
      { id: '1', name: 'Small (10")', price: 14.99 },
      { id: '2', name: 'Medium (12")', price: 16.99 },
      { id: '3', name: 'Large (14")', price: 19.99 }
    ],
    addOns: [
      { id: '1', name: 'Extra Cheese', price: 2.50 },
      { id: '2', name: 'Pepperoni', price: 3.00 },
      { id: '3', name: 'Mushrooms', price: 2.00 }
    ]
  }, vendor1.id);

  const pizza2 = menuStorage.create({
    name: 'Pepperoni Supreme',
    description: 'Double pepperoni with extra cheese',
    price: 19.99,
    category: 'Pizza',
    available: true,
    vendorId: vendor1.id,
    variations: [
      { id: '1', name: 'Small (10")', price: 17.99 },
      { id: '2', name: 'Medium (12")', price: 19.99 },
      { id: '3', name: 'Large (14")', price: 22.99 }
    ]
  }, vendor1.id);

  const appetizer1 = menuStorage.create({
    name: 'Garlic Breadsticks',
    description: 'Fresh baked breadsticks with garlic butter',
    price: 7.99,
    category: 'Appetizers',
    available: true,
    vendorId: vendor1.id
  }, vendor1.id);

  // Create menu items for Burger Mania
  const burger1 = menuStorage.create({
    name: 'Classic Cheeseburger',
    description: 'Beef patty with cheese, lettuce, tomato, and special sauce',
    price: 12.99,
    category: 'Burgers',
    available: true,
    vendorId: vendor2.id,
    variations: [
      { id: '1', name: 'Single Patty', price: 12.99 },
      { id: '2', name: 'Double Patty', price: 16.99 }
    ],
    addOns: [
      { id: '1', name: 'Bacon', price: 2.50 },
      { id: '2', name: 'Avocado', price: 2.00 },
      { id: '3', name: 'Extra Cheese', price: 1.50 }
    ]
  }, vendor2.id);

  const fries1 = menuStorage.create({
    name: 'Crispy Fries',
    description: 'Golden crispy french fries',
    price: 4.99,
    category: 'Sides',
    available: true,
    vendorId: vendor2.id,
    variations: [
      { id: '1', name: 'Regular', price: 4.99 },
      { id: '2', name: 'Large', price: 6.99 }
    ]
  }, vendor2.id);

  // Create menu items for Sushi Zen
  const sushi1 = menuStorage.create({
    name: 'California Roll',
    description: 'Crab, avocado, and cucumber with sesame seeds',
    price: 8.99,
    category: 'Sushi Rolls',
    available: true,
    vendorId: vendor3.id
  }, vendor3.id);

  const sushi2 = menuStorage.create({
    name: 'Salmon Nigiri',
    description: 'Fresh salmon over seasoned rice (2 pieces)',
    price: 6.99,
    category: 'Nigiri',
    available: true,
    vendorId: vendor3.id
  }, vendor3.id);

  // Create sample orders
  const order1 = orderStorage.create({
    customerId: customer1.id,
    vendorId: vendor1.id,
    items: [
      {
        menuItemId: pizza1.id,
        name: 'Margherita Pizza',
        price: 16.99,
        quantity: 1,
        selectedVariation: { id: '2', name: 'Medium (12")', price: 16.99 },
        selectedAddOns: [{ id: '1', name: 'Extra Cheese', price: 2.50 }]
      },
      {
        menuItemId: appetizer1.id,
        name: 'Garlic Breadsticks',
        price: 7.99,
        quantity: 1
      }
    ],
    total: 27.48,
    status: 'delivered',
    orderType: 'delivery',
    paymentMethod: 'pay_on_delivery',
    customerInfo: {
      name: 'John Doe',
      phone: '+1-555-0101',
      address: '123 Main St, Anytown, USA'
    },
    notes: 'Please ring doorbell'
  });

  const order2 = orderStorage.create({
    customerId: customer2.id,
    vendorId: vendor1.id,
    items: [
      {
        menuItemId: pizza2.id,
        name: 'Pepperoni Supreme',
        price: 19.99,
        quantity: 2,
        selectedVariation: { id: '3', name: 'Large (14")', price: 22.99 }
      }
    ],
    total: 45.98,
    status: 'preparing',
    orderType: 'pickup',
    paymentMethod: 'pay_on_delivery',
    customerInfo: {
      name: 'Jane Smith',
      phone: '+1-555-0102'
    }
  });

  const order3 = orderStorage.create({
    customerId: customer3.id,
    vendorId: vendor2.id,
    items: [
      {
        menuItemId: burger1.id,
        name: 'Classic Cheeseburger',
        price: 16.99,
        quantity: 1,
        selectedVariation: { id: '2', name: 'Double Patty', price: 16.99 },
        selectedAddOns: [
          { id: '1', name: 'Bacon', price: 2.50 },
          { id: '2', name: 'Avocado', price: 2.00 }
        ]
      },
      {
        menuItemId: fries1.id,
        name: 'Crispy Fries',
        price: 6.99,
        quantity: 1,
        selectedVariation: { id: '2', name: 'Large', price: 6.99 }
      }
    ],
    total: 28.48,
    status: 'confirmed',
    orderType: 'delivery',
    paymentMethod: 'proof_of_payment',
    customerInfo: {
      name: 'Mike Jones',
      phone: '+1-555-0201',
      address: '456 Oak Ave, Somewhere, USA'
    }
  });

  const order4 = orderStorage.create({
    customerId: customer4.id,
    vendorId: vendor3.id,
    items: [
      {
        menuItemId: sushi1.id,
        name: 'California Roll',
        price: 8.99,
        quantity: 2
      },
      {
        menuItemId: sushi2.id,
        name: 'Salmon Nigiri',
        price: 6.99,
        quantity: 3
      }
    ],
    total: 38.95,
    status: 'pending',
    orderType: 'pickup',
    paymentMethod: 'pay_on_delivery',
    customerInfo: {
      name: 'Sarah Wilson',
      phone: '+1-555-0301'
    }
  });

  console.log('✅ Sample data initialized successfully!');
  console.log('📊 Created:');
  console.log(`- ${subscriptionPlanStorage.getAll().length} subscription plans`);
  console.log(`- ${vendorStorage.getAll().length} vendors (3 approved, 1 pending)`);
  console.log(`- ${vendorSubscriptionStorage.getAll().length} active subscriptions`);
  console.log(`- ${adminStorage.getAll().length} admin user`);
  console.log(`- 4 customers across vendors`);
  console.log(`- 7 menu items across vendors`);
  console.log(`- 4 sample orders`);

  return {
    vendors: vendorStorage.getAll(),
    plans: subscriptionPlanStorage.getAll(),
    subscriptions: vendorSubscriptionStorage.getAll(),
    orders: [order1, order2, order3, order4]
  };
};