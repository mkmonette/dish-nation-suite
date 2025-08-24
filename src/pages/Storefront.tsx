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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { vendorStorage, menuStorage, orderStorage, MenuItem } from '@/lib/storage';
import { ShoppingCart, Plus, Minus, Store, User, LogOut, MapPin, Phone } from 'lucide-react';
import ModernTemplate from '@/components/templates/ModernTemplate';
import ClassicTemplate from '@/components/templates/ClassicTemplate';
import MinimalTemplate from '@/components/templates/MinimalTemplate';

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

const Storefront = () => {
  const { vendorSlug } = useParams();
  const { customer, logout } = useCustomer();
  const { currentTenant, setTenant } = useTenant();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const vendor = React.useMemo(() => {
    if (!vendorSlug) return null;
    return vendorStorage.getBySlug(vendorSlug);
  }, [vendorSlug]);

  useEffect(() => {
    if (!vendor) {
      navigate('/');
      return;
    }

    if (!currentTenant || currentTenant.id !== vendor.id) {
      setTenant(vendor.slug);
    }

    // Load menu items
    setMenuItems(menuStorage.getAll(vendor.id));
  }, [vendor, navigate, currentTenant, setTenant]);

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

  const addToCart = (menuItem: MenuItem) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.menuItem.id === menuItem.id);
      if (existingItem) {
        return prev.map(item =>
          item.menuItem.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { menuItem, quantity: 1 }];
    });
    toast({ title: 'Added to cart', description: `${menuItem.name} added to your cart.` });
  };

  const updateCartItemQuantity = (menuItemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCart(prev => prev.filter(item => item.menuItem.id !== menuItemId));
    } else {
      setCart(prev =>
        prev.map(item =>
          item.menuItem.id === menuItemId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    
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
      status: 'pending',
      orderType: formData.get('orderType') as 'delivery' | 'pickup',
      paymentMethod: formData.get('paymentMethod') as 'pay_on_delivery' | 'proof_of_payment',
      customerInfo: {
        name: formData.get('name') as string,
        phone: formData.get('phone') as string,
        address: formData.get('address') as string,
      },
      notes: formData.get('notes') as string,
    });

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
            <Store className="h-8 w-8 text-primary" />
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
                <Button variant="hero" className="relative">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart
                  {cartItemCount > 0 && (
                    <Badge 
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground min-w-5 h-5 flex items-center justify-center p-0 text-xs"
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Your Cart</DialogTitle>
        </DialogHeader>
        
        {cart.length === 0 ? (
          <div className="py-8 text-center">
            <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.menuItem.id} className="flex justify-between items-center">
                <div className="flex-1">
                  <h4 className="font-medium">{item.menuItem.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    ${item.menuItem.price.toFixed(2)} each
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateCartItemQuantity(item.menuItem.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="min-w-8 text-center">{item.quantity}</span>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateCartItemQuantity(item.menuItem.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              
              <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                <DialogTrigger asChild>
                  <Button variant="order" size="lg" className="w-full mt-4">
                    Checkout
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Checkout</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCheckout} className="space-y-4">
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
                        <RadioGroup name="paymentMethod" defaultValue="pay_on_delivery" className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="pay_on_delivery" id="pay_on_delivery" />
                            <Label htmlFor="pay_on_delivery">Pay on Delivery/Pickup</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="proof_of_payment" id="proof_of_payment" />
                            <Label htmlFor="proof_of_payment">Upload Proof of Payment</Label>
                          </div>
                        </RadioGroup>
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
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-semibold mb-4">
                        <span>Total</span>
                        <span>${cartTotal.toFixed(2)}</span>
                      </div>
                      <Button type="submit" variant="order" size="lg" className="w-full" disabled={isLoading}>
                        {isLoading ? <LoadingSpinner size="sm" /> : `Place Order - $${cartTotal.toFixed(2)}`}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  // Render the appropriate template
  const template = vendor.storefront?.template || 'modern';
  
  switch (template) {
    case 'classic':
      return (
        <ClassicTemplate
          vendor={vendor}
          menuItems={menuItems}
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
          menuItems={menuItems}
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
          menuItems={menuItems}
          onAddToCart={addToCart}
          cartItemCount={cartItemCount}
          cartComponent={cartComponent}
          headerComponent={headerComponent}
        />
      );
  }
};

export default Storefront;