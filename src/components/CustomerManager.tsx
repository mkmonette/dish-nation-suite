import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/enhanced-button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { customerStorage, orderStorage, Customer, Order } from '@/lib/storage';
import { Users, Search, Eye, Mail, Phone, Package, TrendingUp } from 'lucide-react';

interface CustomerManagerProps {
  vendorId: string;
}

const CustomerManager: React.FC<CustomerManagerProps> = ({ vendorId }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadCustomers();
    loadOrders();
  }, [vendorId]);

  const loadCustomers = () => {
    setCustomers(customerStorage.getAll(vendorId));
  };

  const loadOrders = () => {
    setOrders(orderStorage.getAll(vendorId));
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.phone && customer.phone.includes(searchTerm))
  );

  const getCustomerStats = (customerId: string) => {
    const customerOrders = orders.filter(order => order.customerId === customerId);
    const totalSpent = customerOrders.reduce((sum, order) => sum + order.total, 0);
    const completedOrders = customerOrders.filter(order => order.status === 'completed').length;
    
    return {
      totalOrders: customerOrders.length,
      completedOrders,
      totalSpent,
      avgOrderValue: customerOrders.length > 0 ? totalSpent / customerOrders.length : 0,
      lastOrderDate: customerOrders.length > 0 ? new Date(Math.max(...customerOrders.map(o => new Date(o.createdAt).getTime()))) : null,
    };
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    const customerOrders = orders.filter(order => order.customerId === customer.id);
    setCustomerOrders(customerOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const getTotalStats = () => {
    const totalCustomers = customers.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
    const repeatCustomers = customers.filter(customer => {
      const customerOrders = orders.filter(order => order.customerId === customer.id);
      return customerOrders.length > 1;
    }).length;

    return {
      totalCustomers,
      totalRevenue,
      avgOrderValue,
      repeatCustomers,
      repeatRate: totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0,
    };
  };

  const stats = getTotalStats();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Customer Management</h2>
        <p className="text-muted-foreground">View customer details and order history</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.avgOrderValue.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Repeat Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.repeatRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.repeatCustomers} repeat customers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search">Search Customers</Label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Customer List */}
      {filteredCustomers.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {searchTerm ? 'No customers found matching your search.' : 'No customers yet. Orders will create customer records automatically!'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredCustomers.map((customer) => {
            const customerStats = getCustomerStats(customer.id);
            return (
              <Card key={customer.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{customer.name}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {customer.email}
                        </span>
                        {customer.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {customer.phone}
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewCustomer(customer)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Orders</p>
                      <p className="font-medium">{customerStats.totalOrders}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Completed Orders</p>
                      <p className="font-medium">{customerStats.completedOrders}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Spent</p>
                      <p className="font-medium">${customerStats.totalSpent.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Order</p>
                      <p className="font-medium">
                        {customerStats.lastOrderDate 
                          ? customerStats.lastOrderDate.toLocaleDateString()
                          : 'Never'
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Customer Details Modal */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-sm">{selectedCustomer.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm">{selectedCustomer.email}</p>
                </div>
                {selectedCustomer.phone && (
                  <div>
                    <Label className="text-sm font-medium">Phone</Label>
                    <p className="text-sm">{selectedCustomer.phone}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium">Customer Since</Label>
                  <p className="text-sm">{new Date(selectedCustomer.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Customer Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(() => {
                  const stats = getCustomerStats(selectedCustomer.id);
                  return (
                    <>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold">{stats.totalOrders}</p>
                        <p className="text-xs text-muted-foreground">Total Orders</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold">{stats.completedOrders}</p>
                        <p className="text-xs text-muted-foreground">Completed</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold">${stats.totalSpent.toFixed(0)}</p>
                        <p className="text-xs text-muted-foreground">Total Spent</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold">${stats.avgOrderValue.toFixed(0)}</p>
                        <p className="text-xs text-muted-foreground">Avg Order</p>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Order History */}
              <div>
                <h4 className="font-medium mb-4">Order History ({customerOrders.length})</h4>
                {customerOrders.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No orders yet</p>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {customerOrders.map((order) => (
                      <div key={order.id} className="flex justify-between items-center p-3 border rounded-lg">
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
                              order.status === 'completed' ? 'default' : 
                              order.status === 'cancelled' ? 'destructive' : 
                              'secondary'
                            }
                            className="text-xs"
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerManager;