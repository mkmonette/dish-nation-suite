import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Order } from '@/lib/storage';
import { Package, Filter, Calendar, ShoppingCart, DollarSign, Clock, CheckCircle, TrendingUp, Eye } from 'lucide-react';
import OrderDetailsModal from './OrderDetailsModal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

  // Calculate dashboard metrics
  const calculateMetrics = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const thisWeekOrders = orders.filter(order => new Date(order.createdAt) >= weekAgo);
    const thisMonthOrders = orders.filter(order => new Date(order.createdAt) >= monthAgo);
    const pendingOrders = orders.filter(order => order.status === 'pending' || order.status === 'paid_manual_verification');
    const completedOrders = orders.filter(order => order.status === 'completed');
    const totalSales = orders.reduce((sum, order) => order.status === 'completed' ? sum + order.total : sum, 0);

    return {
      totalOrders: orders.length,
      thisWeekOrders: thisWeekOrders.length,
      thisMonthOrders: thisMonthOrders.length,
      pendingOrders: pendingOrders.length,
      completedOrders: completedOrders.length,
      totalSales
    };
  };

  const metrics = calculateMetrics();

  // Chart data
  const statusDistribution = [
    { name: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: '#f59e0b' },
    { name: 'Paid Verification', value: orders.filter(o => o.status === 'paid_manual_verification').length, color: '#3b82f6' },
    { name: 'Preparing', value: orders.filter(o => o.status === 'preparing').length, color: '#8b5cf6' },
    { name: 'Out for Delivery', value: orders.filter(o => o.status === 'out_for_delivery').length, color: '#06b6d4' },
    { name: 'Completed', value: orders.filter(o => o.status === 'completed').length, color: '#10b981' },
    { name: 'Cancelled', value: orders.filter(o => o.status === 'cancelled').length, color: '#ef4444' },
  ].filter(item => item.value > 0);

  const salesChartData = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.toDateString() === date.toDateString() && order.status === 'completed';
      });
      const sales = dayOrders.reduce((sum, order) => sum + order.total, 0);
      last7Days.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        sales: sales,
        orders: dayOrders.length
      });
    }
    return last7Days;
  };

  const handleMetricClick = (filterType: string, filterValue: string) => {
    if (filterType === 'status') {
      setStatusFilter(filterValue);
    } else if (filterType === 'date') {
      setDateFilter(filterValue);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders Dashboard</h1>
        <p className="text-muted-foreground">Monitor and manage your orders with real-time insights</p>
      </div>

      {/* Dashboard Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <Card 
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => handleMetricClick('status', 'all')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalOrders}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => handleMetricClick('date', 'week')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.thisWeekOrders}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => handleMetricClick('status', 'pending')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{metrics.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => handleMetricClick('status', 'completed')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.completedOrders}</div>
            <p className="text-xs text-muted-foreground">Successfully delivered</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => handleMetricClick('status', 'all')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱{metrics.totalSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Completed orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      {orders.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Sales Trend (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'sales' ? `₱${value}` : value,
                      name === 'sales' ? 'Sales' : 'Orders'
                    ]}
                  />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Order Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {statusDistribution.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div 
                      className="w-3 h-3 rounded" 
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-muted-foreground">{entry.name}: {entry.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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