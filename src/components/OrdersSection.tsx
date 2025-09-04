import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Order } from '@/lib/storage';
import { Package, Filter, Calendar } from 'lucide-react';
import OrderDetailsModal from './OrderDetailsModal';

interface OrdersSectionProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
}

const OrdersSection: React.FC<OrdersSectionProps> = ({ orders, onUpdateOrderStatus }) => {
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // Update filtered orders when orders or filters change
  React.useEffect(() => {
    let filtered = [...orders];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(order => new Date(order.createdAt) >= filterDate);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(order => new Date(order.createdAt) >= filterDate);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(order => new Date(order.createdAt) >= filterDate);
          break;
      }
    }

    setFilteredOrders(filtered);
  }, [orders, statusFilter, dateFilter]);

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'destructive';
      case 'preparing':
        return 'secondary';
      case 'out_for_delivery':
        return 'secondary';
      case 'paid_manual_verification':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const renderActionButtons = (order: Order) => {
    const buttons = [];
    
    if (order.status === 'pending' && order.paymentMethod === 'pay_on_delivery') {
      buttons.push(
        <Button 
          key="confirm"
          size="sm" 
          variant="success"
          onClick={(e) => {
            e.stopPropagation();
            onUpdateOrderStatus(order.id, 'preparing');
          }}
        >
          Confirm Order
        </Button>
      );
    }
    
    if (order.status === 'paid_manual_verification') {
      buttons.push(
        <Button 
          key="verify"
          size="sm" 
          variant="success"
          onClick={(e) => {
            e.stopPropagation();
            onUpdateOrderStatus(order.id, 'preparing');
          }}
        >
          Verify & Start Preparing
        </Button>,
        <Button 
          key="reject"
          size="sm" 
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            onUpdateOrderStatus(order.id, 'cancelled');
          }}
        >
          Reject Payment
        </Button>
      );
    }
    
    if (order.status === 'preparing') {
      if (order.orderType === 'delivery') {
        buttons.push(
          <Button 
            key="ready"
            size="sm" 
            variant="order"
            onClick={(e) => {
              e.stopPropagation();
              onUpdateOrderStatus(order.id, 'out_for_delivery');
            }}
          >
            Ready for Delivery
          </Button>
        );
      } else {
        buttons.push(
          <Button 
            key="pickup"
            size="sm" 
            variant="success"
            onClick={(e) => {
              e.stopPropagation();
              onUpdateOrderStatus(order.id, 'completed');
            }}
          >
            Mark Picked Up
          </Button>
        );
      }
    }
    
    if (order.status === 'out_for_delivery') {
      buttons.push(
        <Button 
          key="delivered"
          size="sm" 
          variant="success"
          onClick={(e) => {
            e.stopPropagation();
            onUpdateOrderStatus(order.id, 'completed');
          }}
        >
          Mark Delivered
        </Button>
      );
    }

    return buttons;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">Manage your incoming orders</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid_manual_verification">Paid (Manual Verification)</SelectItem>
                  <SelectItem value="preparing">Preparing</SelectItem>
                  <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="date-filter">Date Range</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger id="date-filter">
                  <SelectValue placeholder="All dates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Total Orders</Label>
              <div className="h-10 flex items-center">
                <Badge variant="secondary" className="text-sm">
                  {filteredOrders.length} of {orders.length}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              {orders.length === 0 ? 'No Orders Yet' : 'No Orders Found'}
            </h2>
            <p className="text-muted-foreground">
              {orders.length === 0 
                ? 'Share your store link to get started!' 
                : 'Try adjusting your filters to see more orders.'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            {/* Desktop Table */}
            <div className="hidden lg:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow 
                      key={order.id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleOrderClick(order)}
                    >
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customerInfo.name}</p>
                          <p className="text-sm text-muted-foreground">{order.customerInfo.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
                      <TableCell className="capitalize">
                        {order.paymentMethod.replace('_', ' ')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(order.status)}>
                          {order.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-1 flex-wrap">
                          {renderActionButtons(order)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4 p-4">
              {filteredOrders.map((order) => (
                <Card 
                  key={order.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleOrderClick(order)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Order #{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.customerInfo.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${order.total.toFixed(2)}</p>
                          <Badge variant={getStatusColor(order.status)} className="mt-1">
                            {order.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Payment</p>
                          <p className="capitalize">{order.paymentMethod.replace('_', ' ')}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Date</p>
                          <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
                        {renderActionButtons(order)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Details Modal */}
      <OrderDetailsModal 
        order={selectedOrder}
        isOpen={showOrderDetails}
        onClose={() => {
          setShowOrderDetails(false);
          setSelectedOrder(null);
        }}
        showCustomerInfo={true}
      />
    </div>
  );
};

export default OrdersSection;