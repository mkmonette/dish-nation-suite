import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCustomer } from '@/contexts/CustomerContext';
import { useTenant } from '@/contexts/TenantContext';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { vendorStorage, customerStorage, orderStorage, loyaltyStorage, Order } from '@/lib/storage';
import { User, Star, ShoppingBag, LogOut } from 'lucide-react';
import CustomerPreferences from '@/components/CustomerPreferences';
import CustomerSidebar from '@/components/CustomerSidebar';
import OrderDetailsModal from '@/components/OrderDetailsModal';
import VendorLogo from '@/components/VendorLogo';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const CustomerDashboard = () => {
  const { vendorSlug } = useParams();
  const { customer, logout, refreshCustomer } = useCustomer();
  const { currentTenant, setTenant } = useTenant();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeSection, setActiveSection] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

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

  const handleLogout = () => {
    logout();
    navigate(`/store/${vendor?.slug}`);
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  if (!vendor || !customer) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const loyaltySettings = loyaltyStorage.get(vendor.id);
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const completedOrders = orders.filter(order => order.status === 'completed').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'destructive';
      case 'preparing':
      case 'out_for_delivery':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Profile</h1>
              <p className="text-muted-foreground">Manage your personal information</p>
            </div>

            {/* Profile Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orders.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {completedOrders} completed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    All time spending
                  </p>
                </CardContent>
              </Card>

              {loyaltySettings?.isActive && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Loyalty Points</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{customer.loyaltyPoints || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      Available points
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Profile Form */}
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
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">My Orders</h1>
              <p className="text-muted-foreground">View your order history and status</p>
            </div>

            {orders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No Orders Yet</h2>
                  <p className="text-muted-foreground">
                    You haven't placed any orders yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-0">
                  {/* Desktop Table */}
                  <div className="hidden md:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow 
                            key={order.id} 
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => handleOrderClick(order)}
                          >
                            <TableCell className="font-medium">#{order.id}</TableCell>
                            <TableCell>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {order.items.length} item{order.items.length > 1 ? 's' : ''}
                            </TableCell>
                            <TableCell>${order.total.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge variant={getStatusColor(order.status)}>
                                {order.status.replace('_', ' ').toUpperCase()}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden space-y-4 p-4">
                    {orders.map((order) => (
                      <Card 
                        key={order.id} 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleOrderClick(order)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium">Order #{order.id}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} items
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${order.total.toFixed(2)}</p>
                              <Badge variant={getStatusColor(order.status)} className="mt-1">
                                {order.status.replace('_', ' ').toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {order.items.slice(0, 2).map(item => item.name).join(', ')}
                            {order.items.length > 2 && ` +${order.items.length - 2} more`}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Preferences</h1>
              <p className="text-muted-foreground">Customize your shopping experience</p>
            </div>
            <CustomerPreferences 
              customer={customer}
              vendorId={vendor.id}
              onUpdate={(updatedCustomer) => refreshCustomer(vendor.id)}
            />
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
        <CustomerSidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          vendorSlug={vendor.slug}
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
                  <h1 className="font-semibold">{customer.name}</h1>
                  <p className="text-sm text-muted-foreground">{vendor.storeName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {loyaltySettings?.isActive && (
                  <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{customer.loyaltyPoints || 0}</span>
                  </div>
                )}
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

      {/* Order Details Modal */}
      <OrderDetailsModal 
        order={selectedOrder}
        isOpen={showOrderDetails}
        onClose={() => {
          setShowOrderDetails(false);
          setSelectedOrder(null);
        }}
        showCustomerInfo={false}
      />
    </SidebarProvider>
  );
};

export default CustomerDashboard;