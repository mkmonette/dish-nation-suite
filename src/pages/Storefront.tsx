import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { vendorStorage, menuStorage, orderStorage, customerStorage, loyaltyStorage, categoryStorage, MenuItem, MenuCategory, MenuVariation, MenuAddOn } from '@/lib/storage';
import { ShoppingCart, Plus, Minus, Store, User, LogOut, MapPin, Phone, Star, X, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import ModernTemplate from '@/components/templates/ModernTemplate';
import ClassicTemplate from '@/components/templates/ClassicTemplate';
import MinimalTemplate from '@/components/templates/MinimalTemplate';
import VendorLogo from '@/components/VendorLogo';
import MenuItemModal from '@/components/MenuItemModal';

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  selectedVariation?: MenuVariation;
  selectedAddOns?: MenuAddOn[];
}

const Storefront = () => {
  const { vendorSlug } = useParams();
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

  const vendor = React.useMemo(() => {
    if (!vendorSlug) {
      console.log('No vendor slug provided');
      return null;
    }
    console.log('Looking for vendor with slug:', vendorSlug);
    const foundVendor = vendorStorage.getBySlug(vendorSlug);
    console.log('Found vendor:', foundVendor);
    return foundVendor;
  }, [vendorSlug]);

  useEffect(() => {
    if (!vendor) {
      navigate('/');
      return;
    }

    if (!currentTenant || currentTenant.id !== vendor.id) {
      setTenant(vendor.slug);
    }

    // Load menu items and categories
    setMenuItems(menuStorage.getAll(vendor.id));
    setCategories(categoryStorage.getAll(vendor.id));
    
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

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const paymentMethod = formData.get('paymentMethod') as 'pay_on_delivery' | 'manual_payment';
    let paymentProof: string | undefined;
    let selectedPaymentMethod: string | undefined;

    // Handle manual payment proof upload
    if (paymentMethod === 'manual_payment') {
      const proofFile = formData.get('paymentProof') as File;
      if (!proofFile || proofFile.size === 0) {
        alert('Please upload proof of payment for manual payment method.');
        setIsLoading(false);
        return;
      }

      // Convert image to base64
      if (proofFile.size > 2 * 1024 * 1024) {
        alert('Payment proof file size must be less than 2MB');
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
        alert('Failed to process payment proof image');
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
        price: item.menuItem.price,
        quantity: item.quantity,
      })),
      total: cartTotal,
      status: paymentMethod === 'manual_payment' ? 'paid_manual_verification' : 'pending',
      orderType: formData.get('orderType') as 'delivery' | 'pickup',
      paymentMethod,
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
    toast({ 
      title: 'Order placed!', 
      description: `Your order #${order.id} has been placed successfully.` 
    });
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
              
              <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                <DialogTrigger asChild>
                  <Button variant="order" size="lg" className="w-full min-h-12">
                    Checkout
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] sm:max-h-[90vh] p-0 gap-0 flex flex-col">
                  {/* Mobile bottom sheet style header with drag handle */}
                  <div className="flex flex-col sm:hidden">
                    <div className="flex justify-center py-2">
                      <div className="w-12 h-1 bg-muted rounded-full"></div>
                    </div>
                  </div>
                  
                  <DialogHeader className="px-6 pt-4 pb-2 flex-shrink-0">
                    <div className="flex items-center gap-3">
                      <VendorLogo 
                        vendor={vendor} 
                        size="sm" 
                        showFallback={true}
                        variant="rounded"
                      />
                      <DialogTitle className="flex-1">{vendor.storeName} - Checkout</DialogTitle>
                    </div>
                  </DialogHeader>
                  
                   <div className="flex-1 overflow-y-auto px-6">
                     <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4 pb-6">
                       <div className="space-y-2">
                         <Label htmlFor="checkout-name">Full Name</Label>
                         <Input 
                           id="checkout-name" 
                           name="name" 
                           defaultValue={customer?.name || ''}
                           required 
                         />
                       </div>
                       <div className="space-y-2">
                         <Label htmlFor="checkout-phone">Phone Number</Label>
                         <Input 
                           id="checkout-phone" 
                           name="phone" 
                           type="tel"
                           defaultValue={customer?.phone || ''}
                           required 
                         />
                       </div>
                       <div className="space-y-2">
                         <Label htmlFor="checkout-address">Address</Label>
                         <Input 
                           id="checkout-address" 
                           name="address" 
                           placeholder="Enter your delivery address"
                           required 
                         />
                       </div>
                       <div className="space-y-4">
                         <div className="space-y-2">
                           <Label>Order Type</Label>
                           <RadioGroup name="orderType" defaultValue="delivery" className="flex space-x-4">
                             <div className="flex items-center space-x-2">
                               <RadioGroupItem value="delivery" id="delivery" />
                               <Label htmlFor="delivery">Delivery</Label>
                             </div>
                             <div className="flex items-center space-x-2">
                               <RadioGroupItem value="pickup" id="pickup" />
                               <Label htmlFor="pickup">Pickup</Label>
                             </div>
                           </RadioGroup>
                         </div>

                          <div className="space-y-2">
                            <Label>Payment Method</Label>
                             <RadioGroup 
                               name="paymentMethod" 
                               defaultValue="pay_on_delivery" 
                               className="space-y-2"
                               onValueChange={(value) => {
                                 const manualSection = document.getElementById('manual-payment-section');
                                 if (manualSection) {
                                   manualSection.style.display = value === 'manual_payment' ? 'block' : 'none';
                                 }
                               }}
                             >
                               <div className="flex items-center space-x-2">
                                 <RadioGroupItem value="pay_on_delivery" id="pay_on_delivery" />
                                 <Label htmlFor="pay_on_delivery">Pay on Delivery/Pickup</Label>
                               </div>
                               {vendor?.manualPaymentEnabled && vendor.manualPaymentMethods?.some(method => method.enabled) && (
                                 <div className="flex items-center space-x-2">
                                   <RadioGroupItem value="manual_payment" id="manual_payment" />
                                   <Label htmlFor="manual_payment">Manual Payment</Label>
                                 </div>
                               )}
                             </RadioGroup>
                          </div>

                          {/* Manual Payment Options */}
                          <div id="manual-payment-section" className="space-y-4" style={{ display: 'none' }}>
                            <Label>Select Payment Method</Label>
                            {vendor?.manualPaymentMethods?.filter(method => method.enabled).map((method) => (
                              <Card key={method.id} className="p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                  <RadioGroupItem 
                                    value={method.title} 
                                    id={`payment-method-${method.id}`}
                                  />
                                  <input 
                                    type="hidden" 
                                    name="selectedPaymentMethod" 
                                    value={method.title}
                                  />
                                  <Label htmlFor={`payment-method-${method.id}`} className="font-medium">
                                    {method.title}
                                  </Label>
                                </div>
                                <div className="ml-6 space-y-2">
                                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {method.instructions}
                                  </p>
                                  {method.qrCode && (
                                    <div className="mt-2">
                                      <img 
                                        src={method.qrCode} 
                                        alt="QR Code" 
                                        className="w-32 h-32 border rounded"
                                      />
                                    </div>
                                  )}
                                </div>
                              </Card>
                            ))}
                            
                            <div className="space-y-2">
                              <Label htmlFor="payment-proof">Upload Proof of Payment *</Label>
                              <input
                                id="payment-proof"
                                name="paymentProof"
                                type="file"
                                accept="image/*"
                                className="w-full p-2 border rounded-md"
                                required
                              />
                              <p className="text-xs text-muted-foreground">
                                Upload a screenshot or photo of your payment (max 2MB)
                              </p>
                            </div>
                          </div>

                         <div className="space-y-2">
                           <Label htmlFor="checkout-notes">Special Instructions (Optional)</Label>
                           <Textarea 
                             id="checkout-notes" 
                             name="notes" 
                             placeholder="Any special requests or instructions..."
                             className="min-h-20"
                           />
                         </div>

                         {/* Marketing Preferences for Guest Checkout */}
                         {!customer && (
                           <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                             <h4 className="font-medium text-sm">Stay connected with us</h4>
                             <div className="space-y-2">
                               <div className="flex items-center space-x-2">
                                 <Checkbox 
                                   id="email-marketing"
                                   name="emailMarketing"
                                   defaultChecked={true}
                                 />
                                 <Label htmlFor="email-marketing" className="text-sm">
                                   Email me about special offers and promotions
                                 </Label>
                               </div>
                               <div className="flex items-center space-x-2">
                                 <Checkbox 
                                   id="push-notifications"
                                   name="pushNotifications"
                                   defaultChecked={true}
                                 />
                                 <Label htmlFor="push-notifications" className="text-sm">
                                   Send me order updates and notifications
                                 </Label>
                               </div>
                             </div>
                           </div>
                         )}
                       </div>
                     </form>
                   </div>
                   
                   {/* Sticky footer with Place Order button */}
                   <div className="border-t bg-background p-6 flex-shrink-0">
                     {customer && (() => {
                       const loyaltySettings = loyaltyStorage.get(vendor.id);
                       return loyaltySettings?.isActive && (
                         <div className="bg-muted/50 p-3 rounded-lg mb-4">
                           <div className="flex items-center justify-between">
                             <span className="text-sm font-medium">Available Points</span>
                             <span className="text-sm font-bold">{customer.loyaltyPoints || 0} points</span>
                           </div>
                           <div className="text-xs text-muted-foreground mt-1">
                             You'll earn {Math.floor(cartTotal * (loyaltySettings?.pointsPerPeso || 1))} points from this order
                           </div>
                           {loyaltySettings.redemptionRules.length > 0 && (
                             <div className="text-xs text-muted-foreground">
                               Redeem: {loyaltySettings.redemptionRules.map(rule => 
                                 `${rule.pointsRequired} pts = ₱${rule.discountAmount} off`
                               ).join(', ')}
                             </div>
                           )}
                         </div>
                       );
                     })()}
                     <div className="flex justify-between text-lg font-semibold mb-4">
                       <span>Total</span>
                       <span>${cartTotal.toFixed(2)}</span>
                     </div>
                     <div className="flex gap-2">
                       <Button type="button" variant="outline" size="lg" className="flex-1" onClick={() => setIsCheckoutOpen(false)}>
                         Cancel
                       </Button>
                       <Button 
                         type="submit" 
                         variant="order" 
                         size="lg" 
                         className="flex-1" 
                         disabled={isLoading}
                         onClick={(e) => {
                           e.preventDefault();
                           const form = document.querySelector('#checkout-form') as HTMLFormElement;
                           if (form) {
                             handleCheckout({ preventDefault: () => {}, currentTarget: form } as any);
                           }
                         }}
                       >
                         {isLoading ? <LoadingSpinner size="sm" /> : `Place Order - $${cartTotal.toFixed(2)}`}
                       </Button>
                     </div>
                   </div>
                </DialogContent>
              </Dialog>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      {/* Render the appropriate template */}
      {(() => {
        const template = vendor.storefront?.template || 'modern';
        
        switch (template) {
          case 'classic':
            return (
              <ClassicTemplate
                vendor={vendor}
                menuItems={filteredMenuItems}
                categories={displayCategories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                onAddToCart={addToCart}
                cartItemCount={cartItemCount}
                cartComponent={cartComponent}
                headerComponent={headerComponent}
              />
            );
          case 'minimal':
            return (
              <MinimalTemplate
                vendor={vendor}
                menuItems={filteredMenuItems}
                categories={displayCategories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                onAddToCart={addToCart}
                cartItemCount={cartItemCount}
                cartComponent={cartComponent}
                headerComponent={headerComponent}
              />
            );
          default:
            return (
              <ModernTemplate
                vendor={vendor}
                menuItems={filteredMenuItems}
                categories={displayCategories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                onAddToCart={addToCart}
                cartItemCount={cartItemCount}
                cartComponent={cartComponent}
                headerComponent={headerComponent}
              />
            );
        }
      })()}

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