import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVendor } from '@/contexts/VendorContext';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { menuStorage, orderStorage, categoryStorage, MenuItem, Order, MenuCategory } from '@/lib/storage';
import StorefrontCustomizer from '@/components/StorefrontCustomizer';
import EnhancedMenuManager from '@/components/EnhancedMenuManager';
import CategoryManager from '@/components/CategoryManager';
import VendorSidebar from '@/components/VendorSidebar';
import { Package, LogOut, ExternalLink, TrendingUp, Users, ShoppingCart, DollarSign } from 'lucide-react';
import DiscountManager from '@/components/DiscountManager';
import NotificationManager from '@/components/NotificationManager';
import CustomerManager from '@/components/CustomerManager';
import LoyaltyManager from '@/components/LoyaltyManager';
import EmailCampaignManager from '@/components/EmailCampaignManager';
import VendorSubscriptionManager from '@/components/VendorSubscriptionManager';
import VendorLogo from '@/components/VendorLogo';
import ManualPaymentSettings from '@/components/ManualPaymentSettings';
import OrdersSection from '@/components/OrdersSection';

const VendorDashboard = () => {
  const { logout } = useVendor();
  const [vendor, setVendor] = useState(useVendor().vendor);
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeSection, setActiveSection] = useState('overview');
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

  // Dashboard overview stats
  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    totalMenuItems: menuItems.length,
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Dashboard Overview</h1>
              <p className="text-muted-foreground">Welcome to your vendor dashboard</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.pendingOrders} pending
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    All time revenue
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalMenuItems}</div>
                  <p className="text-xs text-muted-foreground">
                    Active menu items
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Categories</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{categories.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Menu categories
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Store Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <VendorLogo vendor={vendor} size="sm" />
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
          </div>
        );

      case 'orders':
        return <OrdersSection 
          orders={orders} 
          onUpdateOrderStatus={handleUpdateOrderStatus} 
        />;

      case 'menu':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Menu Management</h1>
              <p className="text-muted-foreground">Add, edit, and organize your menu items</p>
            </div>
            <EnhancedMenuManager 
              vendorId={vendor.id}
              menuItems={menuItems}
              categories={categories}
              onMenuUpdate={loadMenuItems}
            />
          </div>
        );

      case 'categories':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Categories</h1>
              <p className="text-muted-foreground">Organize your menu with categories</p>
            </div>
            <CategoryManager 
              vendorId={vendor.id}
              categories={categories}
              onCategoriesUpdate={loadCategories}
            />
          </div>
        );

      case 'storefront':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Storefront</h1>
              <p className="text-muted-foreground">Customize your store's appearance and branding</p>
            </div>
            <StorefrontCustomizer 
              vendor={vendor}
              onUpdate={(updatedVendor) => {
                setVendor(updatedVendor);
              }}
            />
          </div>
        );

      case 'discounts':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Discounts</h1>
              <p className="text-muted-foreground">Create and manage discount codes</p>
            </div>
            <DiscountManager vendorId={vendor.id} />
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Notifications</h1>
              <p className="text-muted-foreground">Send notifications to your customers</p>
            </div>
            <NotificationManager vendorId={vendor.id} />
          </div>
        );

      case 'campaigns':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Email Campaigns</h1>
              <p className="text-muted-foreground">Create and send email campaigns</p>
            </div>
            <EmailCampaignManager vendorId={vendor.id} />
          </div>
        );

      case 'customers':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Customers</h1>
              <p className="text-muted-foreground">Manage your customer base</p>
            </div>
            <CustomerManager vendorId={vendor.id} />
          </div>
        );

      case 'loyalty':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Loyalty Program</h1>
              <p className="text-muted-foreground">Set up and manage your loyalty rewards</p>
            </div>
            <LoyaltyManager vendorId={vendor.id} />
          </div>
        );

      case 'subscription':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Subscription</h1>
              <p className="text-muted-foreground">Manage your subscription plan</p>
            </div>
            <VendorSubscriptionManager />
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground">Configure your store settings</p>
            </div>
            <ManualPaymentSettings />
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Section not found</p>
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar */}
        <VendorSidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b bg-card sticky top-0 z-40">
            <div className="flex h-16 items-center justify-between px-6">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <VendorLogo 
                  vendor={vendor} 
                  size="sm" 
                  showFallback={true}
                  variant="rounded"
                />
                <div>
                  <h1 className="font-semibold">{vendor.storeName}</h1>
                  <p className="text-sm text-muted-foreground">Vendor Dashboard</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(storeUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Store
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default VendorDashboard;