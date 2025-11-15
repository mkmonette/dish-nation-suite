import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useCustomer } from '@/contexts/CustomerContext';
import { useTenant } from '@/contexts/TenantContext';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { vendorStorage, menuStorage, orderStorage, customerStorage, loyaltyStorage, categoryStorage, paymentStorage, MenuItem, MenuCategory, MenuVariation, MenuAddOn, SectionConfig } from '@/lib/storage';
import { getGateway } from '@/lib/paymentGateways';
import { ShoppingCart, Plus, Minus, Store, User, LogOut, MapPin, Phone, Star, X, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import ModernGlassTemplate from '@/components/templates/ModernGlassTemplate';
import VendorLogo from '@/components/VendorLogo';
import MenuItemModal from '@/components/MenuItemModal';
import CheckoutModal from '@/components/CheckoutModal';
import OrderConfirmationModal from '@/components/OrderConfirmationModal';

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  selectedVariation?: MenuVariation;
  selectedAddOns?: MenuAddOn[];
}

const Storefront = () => {
  const { vendorSlug } = useParams();
  const [searchParams] = useSearchParams();
  const previewTemplate = searchParams.get('preview');
  const { customer, logout, refreshCustomer } = useCustomer();
  const { currentTenant, setTenant } = useTenant();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]); // Menu categories state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isOrderConfirmationOpen, setIsOrderConfirmationOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  const [sectionConfig, setSectionConfig] = useState<SectionConfig[]>([]);
  const [vendorData, setVendorData] = useState<any>(null);

  const vendor = React.useMemo(() => {
    if (!vendorSlug) {
      console.log('No vendor slug provided');
      return null;
    }
    console.log('Fetching vendor with slug:', vendorSlug, 'at timestamp:', vendorData);
    const foundVendor = vendorStorage.getBySlug(vendorSlug);
    console.log('Found vendor:', foundVendor?.storeName);
    if (foundVendor?.storefront?.templateConfigs) {
      console.log('Vendor has templateConfigs:', Object.keys(foundVendor.storefront.templateConfigs));
    }
    return foundVendor;
  }, [vendorSlug, vendorData]); // Add vendorData dependency

  // Listen for vendor data changes
  useEffect(() => {
    const handleStorageChange = () => {
      console.log('Storage changed, refreshing vendor data');
      setVendorData(Date.now()); // Trigger vendor reload
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events from the same window
    const handleVendorUpdate = () => {
      console.log('Vendor updated event received, refreshing vendor data');
      setVendorData(Date.now());
    };
    
    window.addEventListener('vendorUpdated', handleVendorUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('vendorUpdated', handleVendorUpdate);
    };
  }, []);

  // Clean up corrupted template configs on mount
  useEffect(() => {
    if (!vendor) return;
    
    const storedSettings = vendor;
    if (storedSettings?.storefront?.templateConfigs) {
      const configs = storedSettings.storefront.templateConfigs;
      let needsCleanup = false;
      
      // Check for circular references or invalid configs
      ['modern-glass'].forEach(template => {
        const config = configs[template];
        if (!Array.isArray(config) || (config as any).message) {
          needsCleanup = true;
        }
      });
      
      if (needsCleanup) {
        const defaultSections = [
          { id: 'header', name: 'Header/Navigation', enabled: true, order: 0, settings: { variant: 'sticky' }, content: {} },
          { id: 'hero', name: 'Hero Banner', enabled: true, order: 1, settings: { layout: 'fullscreen' }, content: {} },
          { id: 'featured', name: 'Featured Products', enabled: true, order: 2, settings: { columns: 3 }, content: {} },
          { id: 'categories', name: 'Categories Grid', enabled: true, order: 3, settings: { layout: 'grid' }, content: {} },
          { id: 'promos', name: 'Promo Banners', enabled: true, order: 4, settings: { autoplay: true }, content: {} },
          { id: 'menu', name: 'Full Menu', enabled: true, order: 5, settings: { layout: 'list' }, content: {} },
          { id: 'about', name: 'About/Story', enabled: true, order: 6, settings: {}, content: {} },
          { id: 'services', name: 'Services/Features', enabled: true, order: 7, settings: { columns: 3 }, content: {} },
          { id: 'howItWorks', name: 'How It Works', enabled: true, order: 8, settings: { layout: 'steps' }, content: {} },
          { id: 'reviews', name: 'Customer Reviews', enabled: true, order: 9, settings: { layout: 'carousel' }, content: {} },
          { id: 'gallery', name: 'Gallery/Media', enabled: true, order: 10, settings: { columns: 4 }, content: {} },
          { id: 'cta', name: 'Call to Action', enabled: true, order: 11, settings: { variant: 'banner' }, content: {} },
          { id: 'newsletter', name: 'Newsletter Signup', enabled: true, order: 12, settings: {}, content: {} },
          { id: 'faq', name: 'FAQ Section', enabled: true, order: 13, settings: {}, content: {} },
          { id: 'team', name: 'Team Section', enabled: true, order: 14, settings: { columns: 4 }, content: {} },
          { id: 'contact', name: 'Contact Info', enabled: true, order: 15, settings: {}, content: {} },
          { id: 'stats', name: 'Social Proof/Stats', enabled: true, order: 16, settings: { layout: 'inline' }, content: {} },
          { id: 'offers', name: 'Special Offers', enabled: true, order: 17, settings: {}, content: {} },
          { id: 'delivery', name: 'Delivery/Shipping Info', enabled: true, order: 18, settings: {}, content: {} },
          { id: 'payment', name: 'Payment Methods', enabled: true, order: 19, settings: {}, content: {} },
          { id: 'partners', name: 'Partners/Brands', enabled: true, order: 20, settings: { layout: 'logos' }, content: {} },
          { id: 'footer', name: 'Footer', enabled: true, order: 21, settings: { variant: 'detailed' }, content: {} },
        ];
        
        // Clean up corrupted template configs
        const cleanConfigs = {
          'modern-glass': [...defaultSections]
        };
        
        vendorStorage.update(vendor.id, {
          storefront: {
            ...vendor.storefront,
            templateConfigs: cleanConfigs
          }
        });
        
        console.log('Cleaned up corrupted template configurations');
      }
    }
  }, [vendor]);

  useEffect(() => {
    // Template migration is now handled by storage.ts module on load
    // Just ensure we reload vendor data if template was migrated
    if (vendor && vendor.storefront?.template !== 'modern-glass') {
      console.log('Detecting template migration, reloading vendor data');
      const freshVendor = vendorStorage.getBySlug(vendorSlug!);
      if (freshVendor) {
        setVendorData(Date.now());
      }
    }
    
    if (!vendor) return;
    
    const defaultSections: SectionConfig[] = [
      { id: 'header', name: 'Header/Navigation', enabled: true, order: 0, settings: { variant: 'sticky' }, content: {} },
      { id: 'hero', name: 'Hero Banner', enabled: true, order: 1, settings: { layout: 'fullscreen' }, content: {} },
      { id: 'featured', name: 'Featured Products', enabled: true, order: 2, settings: { columns: 3 }, content: {} },
      { id: 'categories', name: 'Categories Grid', enabled: true, order: 3, settings: { layout: 'grid' }, content: {} },
      { id: 'promos', name: 'Promo Banners', enabled: true, order: 4, settings: { autoplay: true }, content: {} },
      { id: 'menu', name: 'Full Menu', enabled: true, order: 5, settings: { layout: 'list' }, content: {} },
      { id: 'about', name: 'About/Story', enabled: true, order: 6, settings: {}, content: {} },
      { id: 'services', name: 'Services/Features', enabled: true, order: 7, settings: { columns: 3 }, content: {} },
      { id: 'howItWorks', name: 'How It Works', enabled: true, order: 8, settings: { layout: 'steps' }, content: {} },
      { id: 'reviews', name: 'Customer Reviews', enabled: true, order: 9, settings: { layout: 'carousel' }, content: {} },
      { id: 'gallery', name: 'Gallery/Media', enabled: true, order: 10, settings: { columns: 4 }, content: {} },
      { id: 'cta', name: 'Call to Action', enabled: true, order: 11, settings: { variant: 'banner' }, content: {} },
      { id: 'newsletter', name: 'Newsletter Signup', enabled: true, order: 12, settings: {}, content: {} },
      { id: 'faq', name: 'FAQ Section', enabled: true, order: 13, settings: {}, content: {} },
      { id: 'team', name: 'Team Section', enabled: true, order: 14, settings: { columns: 4 }, content: {} },
      { id: 'contact', name: 'Contact Info', enabled: true, order: 15, settings: {}, content: {} },
      { id: 'stats', name: 'Social Proof/Stats', enabled: true, order: 16, settings: { layout: 'inline' }, content: {} },
      { id: 'offers', name: 'Special Offers', enabled: true, order: 17, settings: {}, content: {} },
      { id: 'delivery', name: 'Delivery/Shipping Info', enabled: true, order: 18, settings: {}, content: {} },
      { id: 'payment', name: 'Payment Methods', enabled: true, order: 19, settings: {}, content: {} },
      { id: 'partners', name: 'Partners/Brands', enabled: true, order: 20, settings: { layout: 'logos' }, content: {} },
      { id: 'footer', name: 'Footer', enabled: true, order: 21, settings: { variant: 'detailed' }, content: {} },
    ];
    
    // Load section configuration from vendor settings
    const template = previewTemplate || vendor.storefront?.template || 'modern-glass';
    const templateConfig = vendor.storefront?.templateConfigs?.[template];
    
    console.log('Loading sections for template:', template);
    console.log('Template config from storage:', templateConfig);
    
    // Use stored config if valid (array), otherwise use defaults
    let storedSections = defaultSections;
    if (Array.isArray(templateConfig) && templateConfig.length > 0) {
      // Validate that stored sections have required properties
      const validSections = templateConfig.every(section => 
        section && typeof section.id === 'string' && typeof section.enabled === 'boolean'
      );
      if (validSections) {
        storedSections = templateConfig;
        console.log('Using stored template config with', templateConfig.length, 'sections');
      } else {
        console.log('Invalid template config, using defaults');
      }
    } else {
      console.log('No template config found, using defaults');
    }
    
    // Process sections: ensure proper order, keep ALL sections (enabled and disabled)
    const processedSections = storedSections
      .map((section, index) => ({
        ...section,
        order: section.order !== undefined ? section.order : index,
        // Ensure enabled flag exists
        enabled: section.enabled !== undefined ? section.enabled : true
      }))
      .sort((a, b) => a.order - b.order);
    
    console.log('Processed sections:', processedSections.map(s => ({ id: s.id, enabled: s.enabled, order: s.order })));
    
    setSectionConfig(processedSections);
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem(`cart_${vendor.id}`);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, [vendor, navigate, currentTenant, setTenant]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (vendor) {
      localStorage.setItem(`cart_${vendor.id}`, JSON.stringify(cart));
    }
  }, [cart, vendor]);

  if (!vendor) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Store className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Store not found.</p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="mt-4"
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Group menu items by category
  const categorizedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  // Get filtered menu items based on selected category
  const filteredMenuItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  // Create categories list for display in templates
  const displayCategories: MenuCategory[] = [
    { 
      id: 'all', 
      name: 'all', 
      order: 0,
      vendorId: vendor.id,
      createdAt: new Date().toISOString()
    },
    ...categories
  ];

  const addToCart = (menuItem: MenuItem, quantity: number = 1, selectedVariation?: MenuVariation, selectedAddOns?: MenuAddOn[]) => {
    // If item has variations or add-ons and none are selected, open modal
    if ((menuItem.variations?.length > 0 || menuItem.addOns?.length > 0) && !selectedVariation && !selectedAddOns) {
      setSelectedMenuItem(menuItem);
      setIsItemModalOpen(true);
      return;
    }

    setCart(prev => {
      const cartKey = `${menuItem.id}-${selectedVariation?.id || 'none'}-${selectedAddOns?.map(a => a.id).join(',') || 'none'}`;
      const existingItem = prev.find(item => 
        item.menuItem.id === menuItem.id &&
        item.selectedVariation?.id === selectedVariation?.id &&
        JSON.stringify(item.selectedAddOns?.map(a => a.id).sort()) === JSON.stringify(selectedAddOns?.map(a => a.id).sort())
      );
      
      if (existingItem) {
        return prev.map(item =>
          item === existingItem
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { menuItem, quantity, selectedVariation, selectedAddOns }];
    });
    toast({ title: 'Added to cart', description: `${menuItem.name} added to your cart.` });
  };

  const updateCartItemQuantity = (cartIndex: number, newQuantity: number) => {
    if (newQuantity === 0) {
      setCart(prev => prev.filter((_, index) => index !== cartIndex));
    } else {
      setCart(prev =>
        prev.map((item, index) =>
          index === cartIndex
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const removeCartItem = (cartIndex: number) => {
    setCart(prev => prev.filter((_, index) => index !== cartIndex));
    toast({ title: 'Item removed', description: 'Item removed from cart.' });
  };

  const moveCartItem = (fromIndex: number, toIndex: number) => {
    setCart(prev => {
      const newCart = [...prev];
      const [movedItem] = newCart.splice(fromIndex, 1);
      newCart.splice(toIndex, 0, movedItem);
      return newCart;
    });
  };

  const cartTotal = cart.reduce((sum, item) => {
    let itemPrice = item.selectedVariation?.price || item.menuItem.price;
    const addOnsPrice = item.selectedAddOns?.reduce((addOnSum, addOn) => addOnSum + addOn.price, 0) || 0;
    return sum + ((itemPrice + addOnsPrice) * item.quantity);
  }, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async (formData: FormData) => {
    if (cart.length === 0) return;

    setIsLoading(true);
    
    const paymentMethod = formData.get('paymentMethod') as string;
    let paymentProof: string | undefined;
    let selectedPaymentMethod: string | undefined;

    // Handle manual payment proof upload
    if (paymentMethod === 'manual_payment') {
      const proofFile = formData.get('paymentProof') as File;
      if (!proofFile || proofFile.size === 0) {
        toast({
          title: 'Payment proof required',
          description: 'Please upload proof of payment for manual payment method.',
          variant: 'destructive'
        });
        setIsLoading(false);
        return;
      }

      // Convert image to base64
      if (proofFile.size > 2 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Payment proof file size must be less than 2MB',
          variant: 'destructive'
        });
        setIsLoading(false);
        return;
      }

      try {
        paymentProof = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(proofFile);
        });

        selectedPaymentMethod = formData.get('selectedPaymentMethod') as string;
      } catch (error) {
        toast({
          title: 'Upload failed',
          description: 'Failed to process payment proof image',
          variant: 'destructive'
        });
        setIsLoading(false);
        return;
      }
    }
    
    const order = orderStorage.create({
      customerId: customer?.id || 'guest',
      vendorId: vendor.id,
      items: cart.map(item => ({
        menuItemId: item.menuItem.id,
        name: item.menuItem.name,
        price: item.selectedVariation?.price || item.menuItem.price,
        quantity: item.quantity,
      })),
      total: cartTotal,
      status: paymentMethod === 'manual_payment' ? 'paid_manual_verification' : 'pending',
      orderType: formData.get('orderType') as 'delivery' | 'pickup',
      paymentMethod: paymentMethod as any,
      paymentProof,
      selectedPaymentMethod,
      customerInfo: {
        name: formData.get('name') as string,
        phone: formData.get('phone') as string,
        address: formData.get('address') as string,
      },
      notes: formData.get('notes') as string,
    });

    // Award loyalty points if customer is logged in and loyalty is active
    if (customer) {
      const loyaltySettings = loyaltyStorage.get(vendor.id);
      if (loyaltySettings?.isActive) {
        const pointsEarned = Math.floor(cartTotal * loyaltySettings.pointsPerPeso);
        const updatedCustomer = customerStorage.update(customer.id, {
          loyaltyPoints: customer.loyaltyPoints + pointsEarned
        }, vendor.id);
        
        if (updatedCustomer && pointsEarned > 0) {
          refreshCustomer(vendor.id);
          toast({
            title: 'Points earned!',
            description: `You earned ${pointsEarned} loyalty points from this order.`,
          });
        }
      }
    }

    setCart([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setCompletedOrder(order);
    setIsOrderConfirmationOpen(true);
    setIsLoading(false);
  };

  const handleLogout = () => {
    logout();
    toast({ title: 'Logged out', description: 'You have been logged out successfully.' });
  };

  // Header component that all templates can use
  const headerComponent = (
    <header className="border-b bg-card sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <VendorLogo 
              vendor={vendor} 
              size="md" 
              showFallback={true}
              variant="rounded"
            />
            <div>
              <h1 className="text-2xl font-bold">{vendor.storeName}</h1>
              <p className="text-sm text-muted-foreground">
                {vendor.description || 'Delicious food delivered to your door'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {customer ? (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/store/${vendor.slug}/orders`)}
                >
                  My Orders
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/store/${vendor.slug}/profile`)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
                {(() => {
                  const loyaltySettings = loyaltyStorage.get(vendor.id);
                  return loyaltySettings?.isActive && (
                    <div className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{customer.loyaltyPoints || 0}</span>
                    </div>
                  );
                })()}
                <span className="text-sm text-muted-foreground hidden sm:block">
                  {customer.name}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => navigate(`/store/${vendor.slug}/auth`)}
              >
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}
            
            <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
              <DialogTrigger asChild>
                <Button variant="hero" className="relative min-h-12 px-6">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  <span className="hidden sm:inline">Cart</span>
                  {cartItemCount > 0 && (
                    <Badge 
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground min-w-6 h-6 flex items-center justify-center p-0 text-xs font-bold"
                    >
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>
      </div>
    </header>
  );

  // Cart component that all templates can use
  const cartComponent = (
    <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center gap-3 pb-2">
            <VendorLogo 
              vendor={vendor} 
              size="sm" 
              showFallback={true}
              variant="rounded"
            />
            <DialogTitle className="flex-1">{vendor.storeName} - Cart</DialogTitle>
          </div>
        </DialogHeader>
        
        {cart.length === 0 ? (
          <div className="py-8 text-center flex-1">
            <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
              {cart.map((item, index) => {
                const itemPrice = item.selectedVariation?.price || item.menuItem.price;
                const addOnsPrice = item.selectedAddOns?.reduce((sum, addOn) => sum + addOn.price, 0) || 0;
                const totalItemPrice = itemPrice + addOnsPrice;
                
                return (
                  <div key={`${item.menuItem.id}-${index}`} className="border rounded-lg p-3 bg-card/50">
                    <div className="flex items-start gap-3">
                      {/* Drag handle */}
                      <div className="flex flex-col gap-1 mt-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0 hover:bg-muted"
                          onClick={() => index > 0 && moveCartItem(index, index - 1)}
                          disabled={index === 0}
                        >
                          <ChevronUp className="h-3 w-3" />
                        </Button>
                        <GripVertical className="h-4 w-4 text-muted-foreground mx-auto" />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0 hover:bg-muted"
                          onClick={() => index < cart.length - 1 && moveCartItem(index, index + 1)}
                          disabled={index === cart.length - 1}
                        >
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Item details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-sm leading-tight">{item.menuItem.name}</h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive flex-shrink-0 ml-2"
                            onClick={() => removeCartItem(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {item.selectedVariation && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.selectedVariation.name} - ${item.selectedVariation.price.toFixed(2)}
                          </p>
                        )}
                        {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Add-ons: {item.selectedAddOns.map(addOn => `${addOn.name} (+$${addOn.price.toFixed(2)})`).join(', ')}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-medium">
                            ${totalItemPrice.toFixed(2)} each
                          </span>
                          
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateCartItemQuantity(index, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="min-w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <Button 
                              variant="outline" 
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateCartItemQuantity(index, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="border-t pt-4 flex-shrink-0">
              <div className="flex justify-between text-lg font-semibold mb-4">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              
              <Button 
                variant="default" 
                size="lg" 
                className="w-full"
                onClick={() => setIsCheckoutOpen(true)}
              >
                Checkout - ₱{cartTotal.toFixed(2)}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );

  // Render the template
  const renderTemplate = () => {
    const template = previewTemplate || vendor.storefront?.template || 'modern-glass';
    
    const templateProps = {
      vendor,
      menuItems,
      categories: displayCategories,
      selectedCategory,
      onCategoryChange: setSelectedCategory,
      onAddToCart: addToCart,
      cartItemCount,
      cartComponent,
      headerComponent,
      sections: sectionConfig,
    };

    // Render the appropriate template
    if (template === 'sleek-minimal') {
      const SleekMinimalTemplate = React.lazy(() => import('@/components/templates/SleekMinimalTemplate'));
      return (
        <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
          <SleekMinimalTemplate {...templateProps} />
        </React.Suspense>
      );
    }
    
    // Default to modern-glass template
    return <ModernGlassTemplate {...templateProps} />;
  };

  return (
    <>
      {/* Exit Preview Button */}
      {previewTemplate && (
        <Button
          onClick={() => navigate(-1)}
          className="fixed top-4 right-4 z-50 bg-background/95 backdrop-blur-sm border shadow-lg"
          variant="outline"
          size="sm"
        >
          <X className="h-4 w-4 mr-2" />
          Exit Preview
        </Button>
      )}
      
      {renderTemplate()}

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        vendor={vendor}
        cart={cart}
        cartTotal={cartTotal}
        customer={customer}
        loyaltySettings={loyaltyStorage.get(vendor.id)}
        onSubmit={handleCheckout}
        isLoading={isLoading}
      />

      {/* Order Confirmation Modal */}
      {completedOrder && (
        <OrderConfirmationModal
          isOpen={isOrderConfirmationOpen}
          onClose={() => {
            setIsOrderConfirmationOpen(false);
            setCompletedOrder(null);
          }}
          order={completedOrder}
          vendor={vendor}
          onBackToStore={() => {
            setIsOrderConfirmationOpen(false);
            setCompletedOrder(null);
          }}
          onViewOrders={() => {
            navigate(`/store/${vendor.slug}/orders`);
          }}
        />
      )}

      {/* Menu Item Modal for variations */}
      {selectedMenuItem && (
        <MenuItemModal
          item={selectedMenuItem}
          isOpen={isItemModalOpen}
          onClose={() => {
            setIsItemModalOpen(false);
            setSelectedMenuItem(null);
          }}
          onAddToCart={addToCart}
        />
      )}
    </>
  );

};

export default Storefront;