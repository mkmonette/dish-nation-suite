import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCustomer } from '@/contexts/CustomerContext';
import { useTenant } from '@/contexts/TenantContext';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import OrderTracker from '@/components/OrderTracker';
import { vendorStorage, orderStorage, Order } from '@/lib/storage';
import { ArrowLeft, Package } from 'lucide-react';
import VendorLogo from '@/components/VendorLogo';

const CustomerOrders = () => {
  const { vendorSlug } = useParams();
  const { customer } = useCustomer();
  const { currentTenant } = useTenant();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const vendor = React.useMemo(() => {
    if (!vendorSlug) return null;
    return vendorStorage.getBySlug(vendorSlug);
  }, [vendorSlug]);

  useEffect(() => {
    if (!vendor || !customer) {
      navigate(`/store/${vendorSlug}`);
      return;
    }

    // Load customer orders
    const allOrders = orderStorage.getAll(vendor.id);
    const customerOrders = allOrders.filter(order => order.customerId === customer.id);
    setOrders(customerOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setIsLoading(false);
  }, [vendor, customer, navigate, vendorSlug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!vendor || !customer) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Please log in to view your orders.</p>
            <Button 
              variant="outline" 
              onClick={() => navigate(`/store/${vendorSlug}`)}
              className="mt-4"
            >
              Back to Store
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate(`/store/${vendor.slug}`)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <VendorLogo 
              vendor={vendor} 
              size="md" 
              showFallback={true}
              variant="rounded"
            />
            <div>
              <h1 className="text-2xl font-bold">My Orders - {vendor.storeName}</h1>
              <p className="text-sm text-muted-foreground">
                Orders from {vendor.storeName}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Orders List */}
      <main className="container mx-auto px-4 py-8">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Orders Yet</h2>
              <p className="text-muted-foreground mb-4">
                You haven't placed any orders yet.
              </p>
              <Button 
                variant="hero"
                onClick={() => navigate(`/store/${vendor.slug}`)}
              >
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderTracker key={order.id} order={order} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerOrders;