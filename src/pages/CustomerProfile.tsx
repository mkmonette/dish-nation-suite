import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCustomer } from '@/contexts/CustomerContext';
import { useTenant } from '@/contexts/TenantContext';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { vendorStorage, customerStorage, orderStorage, loyaltyStorage } from '@/lib/storage';
import { User, Star, ShoppingBag, ArrowLeft, Settings } from 'lucide-react';
import CustomerPreferences from '@/components/CustomerPreferences';

const CustomerProfile = () => {
  const { vendorSlug } = useParams();
  const { customer, refreshCustomer } = useCustomer();
  const { currentTenant, setTenant } = useTenant();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
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

    if (!customer || customer.vendorId !== vendor.id) {
      navigate(`/store/${vendor.slug}/auth`);
      return;
    }

    loadOrders();
  }, [vendor, customer, navigate, currentTenant, setTenant]);

  const loadOrders = () => {
    if (vendor && customer) {
      const customerOrders = orderStorage.getAll(vendor.id)
        .filter(order => order.customerId === customer.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(customerOrders);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!customer || !vendor) return;

    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const updatedCustomer = customerStorage.update(customer.id, {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
    }, vendor.id);

    if (updatedCustomer) {
      refreshCustomer(vendor.id);
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  if (!vendor || !customer) {
    return null;
  }

  const loyaltySettings = loyaltyStorage.get(vendor.id);
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const completedOrders = orders.filter(order => order.status === 'delivered').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/store/${vendor.slug}`)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Store
              </Button>
              <div>
                <h1 className="text-xl font-bold">My Profile</h1>
                <p className="text-sm text-muted-foreground">{vendor.storeName}</p>
              </div>
            </div>
            
            {loyaltySettings?.isActive && (
              <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg">
                <Star className="h-5 w-5 text-yellow-500" />
                <div className="text-center">
                  <p className="text-lg font-bold">{customer.loyaltyPoints || 0}</p>
                  <p className="text-xs text-muted-foreground">Points</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Stats */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{customer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{customer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Customer Since</p>
                  <p className="font-medium">{new Date(customer.createdAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Order Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Order Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Orders</span>
                  <span className="font-medium">{orders.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Completed</span>
                  <span className="font-medium">{completedOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Spent</span>
                  <span className="font-medium">${totalSpent.toFixed(2)}</span>
                </div>
                {orders.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg Order</span>
                    <span className="font-medium">${(totalSpent / orders.length).toFixed(2)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="orders">Order History</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                    <CardDescription>
                      Update your personal information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            name="name"
                            defaultValue={customer.name}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            defaultValue={customer.phone || ''}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={customer.email}
                          disabled
                          className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Email cannot be changed
                        </p>
                      </div>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>
                      View your past orders and their status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {orders.length === 0 ? (
                      <div className="text-center py-8">
                        <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No orders yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order.id} className="p-4 border rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium">Order #{order.id}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} items
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">${order.total.toFixed(2)}</p>
                                <Badge 
                                  variant={
                                    order.status === 'delivered' ? 'default' : 
                                    order.status === 'cancelled' ? 'destructive' : 
                                    'secondary'
                                  }
                                >
                                  {order.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="preferences">
                <CustomerPreferences 
                  customer={customer}
                  vendorId={vendor.id}
                  onUpdate={(updatedCustomer) => refreshCustomer(vendor.id)}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerProfile;