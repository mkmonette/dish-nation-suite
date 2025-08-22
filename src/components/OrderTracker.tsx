import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/enhanced-button';
import { Order } from '@/lib/storage';
import { CheckCircle, Clock, ChefHat, Truck, MapPin } from 'lucide-react';

interface OrderTrackerProps {
  order: Order;
}

const OrderTracker: React.FC<OrderTrackerProps> = ({ order }) => {
  const statusSteps = [
    { key: 'pending', label: 'Order Placed', icon: Clock },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { key: 'preparing', label: 'Preparing', icon: ChefHat },
    { key: 'ready', label: order.orderType === 'pickup' ? 'Ready for Pickup' : 'Ready', icon: CheckCircle },
    ...(order.orderType === 'delivery' ? [
      { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
    ] : []),
    { key: 'delivered', label: order.orderType === 'pickup' ? 'Picked Up' : 'Delivered', icon: MapPin },
  ];

  const currentStepIndex = statusSteps.findIndex(step => step.key === order.status);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'preparing': return 'bg-orange-500';
      case 'ready': return 'bg-green-500';
      case 'out_for_delivery': return 'bg-purple-500';
      case 'delivered': return 'bg-emerald-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Order #{order.id}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {order.orderType === 'delivery' ? 'Delivery' : 'Pickup'} • ${order.total.toFixed(2)}
            </p>
          </div>
          <Badge className={`${getStatusColor(order.status)} text-white`}>
            {order.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Progress Timeline */}
          <div className="space-y-4">
            {statusSteps.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const IconComponent = step.icon;

              return (
                <div key={step.key} className="flex items-center space-x-3">
                  <div className={`
                    flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                    ${isCompleted 
                      ? 'bg-primary text-primary-foreground' 
                      : isCurrent 
                        ? 'bg-muted border-2 border-primary' 
                        : 'bg-muted text-muted-foreground'
                    }
                  `}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.label}
                    </p>
                    {isCurrent && order.status === 'preparing' && (
                      <p className="text-xs text-muted-foreground">
                        Your order is being prepared...
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Details */}
          <div className="space-y-2">
            <h4 className="font-semibold">Order Items:</h4>
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.name}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Customer Info */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Customer:</span>
              <span>{order.customerInfo.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium">Phone:</span>
              <span>{order.customerInfo.phone}</span>
            </div>
            {order.customerInfo.address && (
              <div className="flex justify-between text-sm">
                <span className="font-medium">Address:</span>
                <span className="text-right">{order.customerInfo.address}</span>
              </div>
            )}
          </div>

          {/* Payment Info */}
          <div className="border-t pt-4">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Payment:</span>
              <span>
                {order.paymentMethod === 'pay_on_delivery' 
                  ? `Pay on ${order.orderType === 'pickup' ? 'Pickup' : 'Delivery'}`
                  : 'Proof of Payment Uploaded'
                }
              </span>
            </div>
            <div className="flex justify-between text-lg font-semibold mt-2">
              <span>Total:</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderTracker;