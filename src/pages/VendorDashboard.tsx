import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVendor } from '@/contexts/VendorContext';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { menuStorage, orderStorage, categoryStorage, MenuItem, Order, MenuCategory } from '@/lib/storage';
import StorefrontCustomizer from '@/components/StorefrontCustomizer';
import EnhancedMenuManager from '@/components/EnhancedMenuManager';
import CategoryManager from '@/components/CategoryManager';
import { Plus, Store, Package, Settings, LogOut, ExternalLink, Eye, Trash2 } from 'lucide-react';
import DiscountManager from '@/components/DiscountManager';
import NotificationManager from '@/components/NotificationManager';
import CustomerManager from '@/components/CustomerManager';
import LoyaltyManager from '@/components/LoyaltyManager';
import EmailCampaignManager from '@/components/EmailCampaignManager';
import VendorSubscriptionManager from '@/components/VendorSubscriptionManager';

const VendorDashboard = () => {
  const { logout } = useVendor();
  const [vendor, setVendor] = useState(useVendor().vendor);
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!vendor) {
      navigate('/vendor/auth');
      return;
    }
    
    // Load vendor data
    loadMenuItems();
    loadCategories();
    loadOrders();
  }, [vendor, navigate]);

  const loadMenuItems = () => {
    if (vendor) {
      setMenuItems(menuStorage.getAll(vendor.id));
    }
  };

  const loadCategories = () => {
    if (vendor) {
      setCategories(categoryStorage.getAll(vendor.id));
    }
  };

  const loadOrders = () => {
    if (vendor) {
      setOrders(orderStorage.getAll(vendor.id));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddMenuItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!vendor) return;

    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const newItem = menuStorage.create({
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category') as string,
      available: true,
      vendorId: vendor.id,
    }, vendor.id);

    setMenuItems(prev => [...prev, newItem]);
    setIsMenuModalOpen(false);
    toast({ title: 'Menu item added!', description: `${newItem.name} has been added to your menu.` });
    setIsLoading(false);
  };

  const handleDeleteMenuItem = (itemId: string) => {
    if (!vendor) return;
    
    const success = menuStorage.delete(itemId, vendor.id);
    if (success) {
      setMenuItems(prev => prev.filter(item => item.id !== itemId));
      toast({ title: 'Menu item deleted', description: 'The item has been removed from your menu.' });
    }
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    if (!vendor) return;

    const updatedOrder = orderStorage.update(orderId, { status: newStatus }, vendor.id);
    if (updatedOrder) {
      setOrders(prev => prev.map(order => order.id === orderId ? updatedOrder : order));
      toast({ title: 'Order updated', description: `Order status changed to ${newStatus}.` });
    }
  };

  if (!vendor) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const storeUrl = `${window.location.origin}/store/${vendor.slug}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {vendor.storefront?.logo ? (
                <img 
                  src={vendor.storefront.logo} 
                  alt={`${vendor.storeName} logo`}
                  className="h-8 w-8 object-contain"
                />
              ) : (
                <Store className="h-8 w-8 text-primary" />
              )}
              <div>
                <h1 className="text-2xl font-bold">{vendor.storeName}</h1>
                <p className="text-sm text-muted-foreground">Vendor Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                onClick={() => window.open(storeUrl, '_blank')}
                className="hidden sm:flex"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Store
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Store Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Store Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Store URL</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input value={storeUrl} readOnly className="text-sm" />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => window.open(storeUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Store Slug</Label>
                <Input value={vendor.slug} readOnly className="mt-1 text-sm" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="menu" className="space-y-4">
          <TabsList className="grid w-full grid-cols-11">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="storefront">Storefront</TabsTrigger>
            <TabsTrigger value="discounts">Discounts</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4">
            <CategoryManager 
              vendorId={vendor.id}
              categories={categories}
              onCategoriesUpdate={loadCategories}
            />
          </TabsContent>

          {/* Menu Items Tab */}
          <TabsContent value="menu" className="space-y-4">
            <EnhancedMenuManager 
              vendorId={vendor.id}
              menuItems={menuItems}
              categories={categories}
              onMenuUpdate={loadMenuItems}
            />
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <h2 className="text-xl font-semibold">Recent Orders ({orders.length})</h2>
            
            {orders.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No orders yet. Share your store link to get started!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                          <CardDescription>
                            {order.customerInfo.name} • {order.customerInfo.phone}
                          </CardDescription>
                        </div>
                        <Badge variant={order.status === 'pending' ? 'destructive' : order.status === 'delivered' ? 'default' : 'secondary'}>
                          {order.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.quantity}x {item.name}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="border-t pt-2 flex justify-between font-semibold">
                          <span>Total</span>
                          <span>${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 flex-wrap">
                        {order.status === 'pending' && (
                          <Button 
                            size="sm" 
                            variant="success"
                            onClick={() => handleUpdateOrderStatus(order.id, 'confirmed')}
                          >
                            Confirm
                          </Button>
                        )}
                        {order.status === 'confirmed' && (
                          <Button 
                            size="sm" 
                            variant="warning"
                            onClick={() => handleUpdateOrderStatus(order.id, 'preparing')}
                          >
                            Start Preparing
                          </Button>
                        )}
                        {order.status === 'preparing' && (
                          <Button 
                            size="sm" 
                            variant="order"
                            onClick={() => handleUpdateOrderStatus(order.id, 'ready')}
                          >
                            Mark Ready
                          </Button>
                        )}
                        {order.status === 'ready' && order.orderType === 'delivery' && (
                          <Button 
                            size="sm" 
                            variant="order"
                            onClick={() => handleUpdateOrderStatus(order.id, 'out_for_delivery')}
                          >
                            Out for Delivery
                          </Button>
                        )}
                        {order.status === 'out_for_delivery' && (
                          <Button 
                            size="sm" 
                            variant="success"
                            onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                          >
                            Mark Delivered
                          </Button>
                        )}
                        {order.status === 'ready' && order.orderType === 'pickup' && (
                          <Button 
                            size="sm" 
                            variant="success"
                            onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                          >
                            Mark Picked Up
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Storefront Customization Tab */}
          <TabsContent value="storefront" className="space-y-4">
            <StorefrontCustomizer 
              vendor={vendor}
              onUpdate={(updatedVendor) => {
                // This would normally trigger a context update, but for localStorage demo this is sufficient
                window.location.reload();
              }}
            />
          </TabsContent>

          {/* Discount Codes Tab */}
          <TabsContent value="discounts" className="space-y-4">
            <DiscountManager vendorId={vendor.id} />
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <NotificationManager vendorId={vendor.id} />
          </TabsContent>

          {/* Email Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-4">
            <EmailCampaignManager vendorId={vendor.id} />
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-4">
            <CustomerManager vendorId={vendor.id} />
          </TabsContent>

          {/* Loyalty Tab */}
          <TabsContent value="loyalty" className="space-y-4">
            <LoyaltyManager vendorId={vendor.id} />
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription" className="space-y-4">
            <VendorSubscriptionManager />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <h2 className="text-xl font-semibold">Store Settings</h2>
            <Card>
              <CardHeader>
                <CardTitle>Store Information</CardTitle>
                <CardDescription>Update your store details and branding</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Store settings coming soon! Currently you can manage your menu and orders.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default VendorDashboard;